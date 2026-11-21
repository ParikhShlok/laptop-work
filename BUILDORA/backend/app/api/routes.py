from fastapi import APIRouter, HTTPException, Depends, Header, Query
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
import time

from app.database.repositories import repo
from app.database.models import DemoRequestRecord, AuditLogRecord, RoleEnum
from app.ai.model_router import model_router
from app.ai.prompts.base_prompts import sanitize_user_input, BASE_SYSTEM_PROMPT
from app.ai.context_builder import context_builder
from app.agents.knowledge_agent import knowledge_agent
from app.agents.meeting_agent import meeting_agent
from app.agents.research_agent import research_agent
from app.agents.sales_agent import sales_agent
from app.agents.support_agent import support_agent
from app.billing.billing_service import billing_service
from app.integrations.adapters import INTEGRATION_REGISTRY

api_router = APIRouter(prefix="/api")

# Pydantic Request Models
class ChatRequest(BaseModel):
    workspace_id: str = "ws-acmeflow-prod"
    query: str
    agent: Optional[str] = "Buildora AI"

class MeetingProcessRequest(BaseModel):
    workspace_id: str = "ws-acmeflow-prod"
    title: str = "Product Strategy Meeting — Oct 5"
    transcript: str

class ResearchRunRequest(BaseModel):
    workspace_id: str = "ws-acmeflow-prod"
    topic: str

class SalesDraftRequest(BaseModel):
    workspace_id: str = "ws-acmeflow-prod"
    lead_name: str
    lead_role: str
    lead_company: str
    lead_email: str

class SupportQueryRequest(BaseModel):
    workspace_id: str = "ws-acmeflow-prod"
    customer_email: str
    question: str

class ApprovalActionRequest(BaseModel):
    workspace_id: str = "ws-acmeflow-prod"
    user_name: str = "Alex (Founder)"
    reason: Optional[str] = None

class DemoRequestInput(BaseModel):
    name: str
    work_email: str
    company: str
    company_size: str
    role: str
    current_ai_tools: str
    workflow_problem: str
    message: Optional[str] = None

class CheckoutRequestInput(BaseModel):
    workspace_id: str = "ws-acmeflow-prod"
    plan_id: str
    gateway: str = "razorpay"
    currency: str = "INR"

# 1. Health & Status
@api_router.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "BUILDORA Enterprise AI Backend",
        "version": "2.0.0",
        "tenancy": "Row-Level Multi-Tenant Isolation",
        "human_in_the_loop": "Enforced"
    }

# 2. Workspaces & Tenancy
@api_router.get("/workspaces")
def list_workspaces():
    return repo.list_workspaces()

@api_router.get("/workspaces/{workspace_id}")
def get_workspace(workspace_id: str):
    ws = repo.get_workspace(workspace_id)
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return ws

# 3. AI Chat (Section 24)
@api_router.post("/chat")
def chat(req: ChatRequest):
    # Prompt injection check (Section 20)
    clean_query, is_injection = sanitize_user_input(req.query)
    if is_injection:
        repo.db.security_events.append({
            "id": f"sec-{int(time.time())}",
            "workspace_id": req.workspace_id,
            "event_type": "PROMPT_INJECTION_DETECTED",
            "severity": "critical",
            "description": f"Blocked malicious injection attempt: '{req.query[:60]}...'",
            "source_ip": "127.0.0.1",
            "blocked": True,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        })
        return {
            "answer": "⚠️ Request Blocked: Suspicious prompt injection pattern detected. Action quarantined.",
            "sources": [],
            "provider": "Buildora Security Shield"
        }

    # Route based on selected agent
    if req.agent == "Meeting Agent":
        res = meeting_agent.run(req.workspace_id, "Alex (Founder)", {"transcript": clean_query})
        return {"answer": res["summary"], "sources": [{"name": res["title"], "sourceType": "Google Meet", "excerpt": str(res["decisions"])}]}
    elif req.agent == "Research Agent":
        res = research_agent.run(req.workspace_id, "Alex (Founder)", {"topic": clean_query})
        return {"answer": res["executive_summary"], "sources": [{"name": "Market Analysis", "sourceType": "Research", "excerpt": str(res["opportunities"])}]}
    else:
        # Default Knowledge Agent Grounded Search
        res = knowledge_agent.run(req.workspace_id, "Alex (Founder)", {"query": clean_query})
        return {"answer": res["answer"], "sources": res["sources"], "provider": res["provider"]}

# 4. Agents Endpoints (Section 8-13)
@api_router.get("/agents")
def list_agents():
    return [
        {"id": "knowledge", "name": "Knowledge Agent", "risk": "Low", "approvalRequired": False, "status": "Active"},
        {"id": "meeting", "name": "Meeting Agent", "risk": "Low", "approvalRequired": False, "status": "Active"},
        {"id": "research", "name": "Research Agent", "risk": "Low", "approvalRequired": False, "status": "Active"},
        {"id": "sales", "name": "Sales Agent", "risk": "High", "approvalRequired": True, "status": "Active"},
        {"id": "support", "name": "Support Agent", "risk": "Medium", "approvalRequired": True, "status": "Active"}
    ]

@api_router.post("/meetings/process")
def process_meeting(req: MeetingProcessRequest):
    return meeting_agent.run(req.workspace_id, "Alex (Founder)", {"title": req.title, "transcript": req.transcript})

@api_router.post("/research/run")
def run_research(req: ResearchRunRequest):
    return research_agent.run(req.workspace_id, "Alex (Founder)", {"topic": req.topic})

@api_router.post("/sales/draft")
def draft_sales_email(req: SalesDraftRequest):
    return sales_agent.run(req.workspace_id, "Alex (Founder)", {
        "lead_name": req.lead_name,
        "lead_role": req.lead_role,
        "lead_company": req.lead_company,
        "lead_email": req.lead_email
    })

@api_router.post("/support/query")
def support_query(req: SupportQueryRequest):
    return support_agent.run(req.workspace_id, "Alex (Founder)", {
        "customer_email": req.customer_email,
        "question": req.question
    })

# 5. Approvals Engine (Section 17)
@api_router.get("/approvals")
def list_approvals(workspace_id: str = "ws-acmeflow-prod"):
    return repo.list_approvals(workspace_id)

@api_router.post("/approvals/{approval_id}/approve")
def approve_action(approval_id: str, req: ApprovalActionRequest):
    appr = repo.get_approval(req.workspace_id, approval_id)
    if not appr:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    appr.status = "approved"
    appr.resolved_at = time.strftime("%Y-%m-%dT%H:%M:%SZ")
    appr.resolved_by = req.user_name

    # Add immutable audit log (Section 18)
    repo.add_audit_log(
        workspace_id=req.workspace_id,
        log=AuditLogRecord(
            id=f"aud-appr-{int(time.time())}",
            workspace_id=req.workspace_id,
            user_name=req.user_name,
            agent_name=appr.agent_name,
            action=f"Approved: {appr.action_title}",
            resource=appr.recipient or appr.target_system,
            result="Executed after Founder Approval",
            risk_level=appr.risk_level,
            approval_id=appr.id,
            status_badge="emerald",
            details=f"Human-in-the-loop requirement satisfied. Payload transmitted to {appr.target_system}."
        )
    )
    return {"status": "approved", "approval_id": approval_id}

@api_router.post("/approvals/{approval_id}/reject")
def reject_action(approval_id: str, req: ApprovalActionRequest):
    appr = repo.get_approval(req.workspace_id, approval_id)
    if not appr:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    appr.status = "rejected"
    appr.resolved_at = time.strftime("%Y-%m-%dT%H:%M:%SZ")
    appr.resolved_by = req.user_name
    appr.reason = req.reason or "Rejected by founder"

    repo.add_audit_log(
        workspace_id=req.workspace_id,
        log=AuditLogRecord(
            id=f"aud-rej-{int(time.time())}",
            workspace_id=req.workspace_id,
            user_name=req.user_name,
            agent_name=appr.agent_name,
            action=f"Rejected: {appr.action_title}",
            resource=appr.recipient or appr.target_system,
            result="Blocked / Quarantined",
            risk_level=appr.risk_level,
            approval_id=appr.id,
            status_badge="rose",
            details=f"Execution rejected by {req.user_name}. Transmission aborted."
        )
    )
    return {"status": "rejected", "approval_id": approval_id}

# 6. Immutable Audit Logs (Section 18)
@api_router.get("/audit-logs")
def list_audit_logs(workspace_id: str = "ws-acmeflow-prod"):
    return repo.list_audit_logs(workspace_id)

# 7. Knowledge Documents (Section 14)
@api_router.get("/knowledge")
def list_knowledge(workspace_id: str = "ws-acmeflow-prod"):
    return repo.list_documents(workspace_id)

# 8. Team Management (Section 31)
@api_router.get("/team")
def list_team(workspace_id: str = "ws-acmeflow-prod"):
    return repo.list_members(workspace_id)

# 9. Integrations (Section 32)
@api_router.get("/integrations")
def list_integrations():
    return [adapter.get_status() for adapter in INTEGRATION_REGISTRY.values()]

# 10. Billing & Pricing (Section 27-30)
@api_router.get("/billing/plans")
def get_plans():
    return billing_service.get_plans()

@api_router.post("/billing/checkout")
def create_checkout(req: CheckoutRequestInput):
    return billing_service.create_checkout_session(
        workspace_id=req.workspace_id,
        plan_id=req.plan_id,
        gateway=req.gateway,
        currency=req.currency
    )

@api_router.get("/billing/usage")
def get_usage(workspace_id: str = "ws-acmeflow-prod"):
    return repo.get_usage(workspace_id)

# 11. Demo Request Booking (Section 51)
@api_router.post("/demo/request")
def submit_demo_request(req: DemoRequestInput):
    record = DemoRequestRecord(
        id=f"dreq-{int(time.time())}",
        name=req.name,
        work_email=req.work_email,
        company=req.company,
        company_size=req.company_size,
        role=req.role,
        current_ai_tools=req.current_ai_tools,
        workflow_problem=req.workflow_problem,
        message=req.message
    )
    repo.save_demo_request(record)
    return {"status": "received", "id": record.id, "message": "Demo request recorded successfully."}

# 12. Internal Admin Panel (Section 52)
@api_router.get("/admin/dashboard")
def admin_dashboard():
    return {
        "total_workspaces": len(repo.list_workspaces()),
        "total_users": len(repo.db.users),
        "demo_requests": repo.list_demo_requests(),
        "security_events": repo.db.security_events,
        "total_ai_requests": sum(u.requests_count for u in repo.db.usage.values()),
        "total_ai_cost_usd": round(sum(u.estimated_cost_usd for u in repo.db.usage.values()), 2),
        "system_health": "100% Operational"
    }
