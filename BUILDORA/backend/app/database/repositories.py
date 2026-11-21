from typing import List, Optional, Dict, Any
from app.database.db import db
from app.database.models import (
    WorkspaceRecord, WorkspaceMemberRecord, DocumentRecord,
    DocumentChunk, ApprovalRecord, AuditLogRecord,
    DemoRequestRecord, SecurityEventRecord, UsageRecord, UserRecord
)

class Repository:
    @staticmethod
    def get_workspace(workspace_id: str) -> Optional[WorkspaceRecord]:
        return db.workspaces.get(workspace_id)

    @staticmethod
    def list_workspaces() -> List[WorkspaceRecord]:
        return list(db.workspaces.values())

    @staticmethod
    def list_members(workspace_id: str) -> List[Dict[str, Any]]:
        members = [m for m in db.workspace_members if m.workspace_id == workspace_id]
        result = []
        for m in members:
            u = db.users.get(m.user_id)
            if u:
                result.append({
                    "id": u.id,
                    "name": u.name,
                    "email": u.email,
                    "role": m.role,
                    "status": m.status,
                    "last_active": m.last_active
                })
        return result

    @staticmethod
    def list_documents(workspace_id: str) -> List[DocumentRecord]:
        return [d for d in db.documents.values() if d.workspace_id == workspace_id]

    @staticmethod
    def get_chunks(workspace_id: str) -> List[DocumentChunk]:
        return [c for c in db.chunks if c.workspace_id == workspace_id]

    @staticmethod
    def list_approvals(workspace_id: str) -> List[ApprovalRecord]:
        return [a for a in db.approvals.values() if a.workspace_id == workspace_id]

    @staticmethod
    def get_approval(workspace_id: str, approval_id: str) -> Optional[ApprovalRecord]:
        appr = db.approvals.get(approval_id)
        if appr and appr.workspace_id == workspace_id:
            return appr
        return None

    @staticmethod
    def list_audit_logs(workspace_id: str) -> List[AuditLogRecord]:
        return [a for a in db.audit_logs if a.workspace_id == workspace_id]

    @staticmethod
    def add_audit_log(workspace_id: str, log: AuditLogRecord) -> AuditLogRecord:
        log.workspace_id = workspace_id
        db.audit_logs.insert(0, log)
        return log

    @staticmethod
    def get_usage(workspace_id: str) -> UsageRecord:
        if workspace_id not in db.usage:
            db.usage[workspace_id] = UsageRecord(workspace_id=workspace_id)
        return db.usage[workspace_id]

    @staticmethod
    def save_demo_request(req: DemoRequestRecord):
        db.demo_requests.insert(0, req)
        return req

    @staticmethod
    def list_demo_requests() -> List[DemoRequestRecord]:
        return db.demo_requests

    @staticmethod
    def list_security_events(workspace_id: str) -> List[SecurityEventRecord]:
        return [s for s in db.security_events if s.workspace_id == workspace_id]

repo = Repository()
