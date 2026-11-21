"""Authenticated v1 pilot API.

All workspace resources require a server session and workspace membership. It
never sends external messages: approvals only create a human-review record.
"""

from __future__ import annotations

from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel, Field, field_validator

from app.config import settings
from app.database.pilot_store import PilotStore

router = APIRouter(prefix="/api/v1", tags=["pilot"])
store = PilotStore(settings.PILOT_DATABASE_URL)


class EmailPayload(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def valid_email(cls, value: str) -> str:
        value = value.strip().lower()
        if "@" not in value or value.startswith("@") or value.endswith("@"):
            raise ValueError("Enter a valid email address.")
        return value


class RegisterRequest(EmailPayload):
    name: str = Field(min_length=2, max_length=120)
    password: str = Field(min_length=12, max_length=256)
    workspace_name: str = Field(min_length=2, max_length=120)


class LoginRequest(EmailPayload):
    password: str = Field(min_length=1, max_length=256)


class DocumentRequest(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    content: str = Field(min_length=20, max_length=100_000)
    source_type: Literal["manual", "support_playbook", "product_docs", "meeting_notes"] = "manual"


class SupportDraftRequest(BaseModel):
    customer_email: str = Field(min_length=5, max_length=320)
    customer_question: str = Field(min_length=4, max_length=8_000)


class ApprovalDecision(BaseModel):
    decision: Literal["approved", "rejected"]


def _bearer_token(authorization: Annotated[str | None, Header()] = None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required.")
    return authorization.removeprefix("Bearer ").strip()


def current_user(token: Annotated[str, Depends(_bearer_token)]) -> dict:
    user = store.user_for_token(token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired or invalid.")
    return user


def require_workspace(workspace_id: str, user: Annotated[dict, Depends(current_user)]) -> dict:
    role = store.membership(workspace_id, user["id"])
    if not role:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this workspace.")
    return {**user, "role": role, "workspace_id": workspace_id}


def require_editor(member: Annotated[dict, Depends(require_workspace)]) -> dict:
    if member["role"] == "viewer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Your role is read-only.")
    return member


@router.get("/health")
def health() -> dict:
    return {"status": "healthy", "service": "BUILDORA Pilot API", "external_delivery": "disabled"}


@router.post("/auth/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest) -> dict:
    try:
        user = store.register(payload.name, str(payload.email), payload.password, payload.workspace_name)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return {"access_token": store.create_session(user["id"]), "token_type": "bearer", "user": user}


@router.post("/auth/login")
def login(payload: LoginRequest) -> dict:
    user = store.login(str(payload.email), payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    return {"access_token": store.create_session(user["id"]), "token_type": "bearer", "user": user}


@router.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(token: Annotated[str, Depends(_bearer_token)]) -> None:
    store.revoke_session(token)


@router.get("/me")
def me(user: Annotated[dict, Depends(current_user)]) -> dict:
    return {"user": user, "workspaces": store.workspaces_for_user(user["id"])}


@router.get("/workspaces/{workspace_id}/documents")
def list_documents(member: Annotated[dict, Depends(require_workspace)]) -> list[dict]:
    return store.list_documents(member["workspace_id"])


@router.post("/workspaces/{workspace_id}/documents", status_code=status.HTTP_201_CREATED)
def add_document(payload: DocumentRequest, member: Annotated[dict, Depends(require_editor)]) -> dict:
    return store.add_document(member["workspace_id"], member["id"], payload.title, payload.content, payload.source_type)


@router.post("/workspaces/{workspace_id}/support-drafts", status_code=status.HTTP_201_CREATED)
def create_support_draft(payload: SupportDraftRequest, member: Annotated[dict, Depends(require_editor)]) -> dict:
    sources = store.search_documents(member["workspace_id"], payload.customer_question)
    if not sources:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="No matching approved knowledge found. Add a source before drafting a reply.")
    source_titles = ", ".join(source["title"] for source in sources[:3])
    draft = (
        "Hi,\n\n"
        "Thanks for reaching out. Based on our current support documentation, here is the information relevant to your question:\n\n"
        f"{payload.customer_question}\n\n"
        "Please review the attached source context before sending this reply.\n\n"
        "Best,\nSupport Team"
    )
    approval = store.create_approval(member["workspace_id"], member["id"], f"Support reply to {payload.customer_email}", str(payload.customer_email), draft)
    return {"draft": draft, "approval": approval, "sources": [{"id": source["id"], "title": source["title"], "source_type": source["source_type"], "excerpt": source["content"][:280]} for source in sources], "notice": "Draft staged for human review. BUILDORA does not send external messages in this pilot."}


@router.get("/workspaces/{workspace_id}/approvals")
def list_approvals(member: Annotated[dict, Depends(require_workspace)]) -> list[dict]:
    return store.list_approvals(member["workspace_id"])


@router.post("/workspaces/{workspace_id}/approvals/{approval_id}")
def decide_approval(approval_id: str, payload: ApprovalDecision, member: Annotated[dict, Depends(require_editor)]) -> dict:
    approval = store.resolve_approval(member["workspace_id"], approval_id, member["id"], payload.decision)
    if not approval:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Approval is missing or was already resolved.")
    return {"approval": approval, "notice": "Decision recorded. External delivery remains manual in this pilot."}


@router.get("/workspaces/{workspace_id}/audit-events")
def audit_events(member: Annotated[dict, Depends(require_workspace)]) -> list[dict]:
    if member["role"] not in {"owner", "admin"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only workspace owners and admins may view audit events.")
    return store.audit_events(member["workspace_id"])
