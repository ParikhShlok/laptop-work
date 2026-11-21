import json
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from app.database.models import (
    UserRecord, WorkspaceRecord, WorkspaceMemberRecord,
    DocumentRecord, DocumentChunk, ApprovalRecord,
    AuditLogRecord, TaskRecord, DemoRequestRecord,
    SecurityEventRecord, UsageRecord, RoleEnum
)

class InMemoryDatabase:
    def __init__(self):
        self.users: Dict[str, UserRecord] = {}
        self.workspaces: Dict[str, WorkspaceRecord] = {}
        self.workspace_members: List[WorkspaceMemberRecord] = []
        self.documents: Dict[str, DocumentRecord] = {}
        self.chunks: List[DocumentChunk] = []
        self.approvals: Dict[str, ApprovalRecord] = {}
        self.audit_logs: List[AuditLogRecord] = []
        self.tasks: Dict[str, TaskRecord] = []
        self.demo_requests: List[DemoRequestRecord] = []
        self.security_events: List[SecurityEventRecord] = []
        self.usage: Dict[str, UsageRecord] = {}
        
        self._seed_acmeflow_data()

    def _seed_acmeflow_data(self):
        """Seeds the standard AcmeFlow demo workspace required by Section 26 & 40"""
        ws_id = "ws-acmeflow-prod"
        
        # 1. Users
        alex = UserRecord(id="usr-alex", email="alex@acmeflow.io", name="Alex (Founder)")
        sarah = UserRecord(id="usr-sarah", email="sarah@acmeflow.io", name="Sarah (Product)")
        rahul = UserRecord(id="usr-rahul", email="rahul@acmeflow.io", name="Rahul (Engineering)")
        maya = UserRecord(id="usr-maya", email="maya@acmeflow.io", name="Maya (Sales)")
        
        for u in [alex, sarah, rahul, maya]:
            self.users[u.id] = u

        # 2. Workspace
        ws = WorkspaceRecord(
            id=ws_id,
            name="AcmeFlow",
            slug="acmeflow",
            owner_id=alex.id,
            plan="team",
            trial_ends_at=(datetime.utcnow() + timedelta(days=14)).isoformat()
        )
        self.workspaces[ws.id] = ws

        # 3. Members
        self.workspace_members.extend([
            WorkspaceMemberRecord(workspace_id=ws_id, user_id=alex.id, role=RoleEnum.OWNER),
            WorkspaceMemberRecord(workspace_id=ws_id, user_id=sarah.id, role=RoleEnum.ADMIN),
            WorkspaceMemberRecord(workspace_id=ws_id, user_id=rahul.id, role=RoleEnum.MEMBER),
            WorkspaceMemberRecord(workspace_id=ws_id, user_id=maya.id, role=RoleEnum.MEMBER)
        ])

        # 4. Demo Knowledge Documents & Chunks
        doc_roadmap = DocumentRecord(
            id="doc-1",
            workspace_id=ws_id,
            title="Product Roadmap & Sprint 14 Priorities",
            source_type="notion",
            file_type="md",
            size_bytes=4200,
            chunks_count=2,
            uploaded_by="Alex (Founder)"
        )
        self.documents[doc_roadmap.id] = doc_roadmap
        self.chunks.append(DocumentChunk(
            id="chk-1",
            document_id=doc_roadmap.id,
            workspace_id=ws_id,
            chunk_index=0,
            content=(
                "Top product priorities for this month (Sprint 14):\n"
                "1. Enterprise SAML / SSO Integration for Google Workspace and Okta.\n"
                "2. Simplified 3-Step Self-Serve Onboarding to reduce multi-tool drop-off.\n"
                "3. Founder Customer Validation: Complete 5 founder interviews before finalizing pricing."
            ),
            metadata={"title": doc_roadmap.title, "source": "Notion"}
        ))

        doc_meeting = DocumentRecord(
            id="doc-2",
            workspace_id=ws_id,
            title="Product Strategy Meeting Transcript — Oct 5",
            source_type="google_meet",
            file_type="txt",
            size_bytes=7800,
            chunks_count=3,
            uploaded_by="Meeting Agent"
        )
        self.documents[doc_meeting.id] = doc_meeting
        self.chunks.append(DocumentChunk(
            id="chk-2",
            document_id=doc_meeting.id,
            workspace_id=ws_id,
            chunk_index=0,
            content=(
                "Attendees: Alex (Founder), Sarah (Product), Rahul (Engineering), Maya (Sales).\n"
                "Decisions: Prioritize SSO before enterprise launch (unblocks CloudPeak and Acme Tech deals).\n"
                "Action items: Rahul to spec SAML 2.0; Sarah to draft onboarding wireframes; Maya to follow up with Marcus Vance."
            ),
            metadata={"title": doc_meeting.title, "source": "Google Meet"}
        ))

        # 5. Pending Approvals
        appr_email = ApprovalRecord(
            id="appr-101",
            workspace_id=ws_id,
            agent_id="sales-agent",
            agent_name="Sales Agent",
            action_type="email",
            action_title="Outbound Sales Pitch to Marcus Vance",
            target_system="Gmail",
            recipient="marcus.vance@acmetech.io",
            payload={
                "subject": "AcmeFlow Enterprise SSO & Air-Gapped Compliance Update",
                "body": "Hi Marcus, saw your team is evaluating AI workspace options. AcmeFlow has completed SAML SSO for Sprint 14..."
            },
            risk_level="High",
            status="pending"
        )
        self.approvals[appr_email.id] = appr_email

        # 6. Audit Logs
        self.audit_logs.extend([
            AuditLogRecord(
                id="aud-1",
                workspace_id=ws_id,
                user_name="Meeting Agent",
                agent_name="Meeting Agent",
                action="Processed Google Meet recording",
                resource="Product Strategy Meeting — Oct 5",
                result="Generated 3 action items",
                risk_level="Low",
                status_badge="emerald",
                details="Extracted decisions and action items from audio transcript."
            ),
            AuditLogRecord(
                id="aud-2",
                workspace_id=ws_id,
                user_name="Sales Agent",
                agent_name="Sales Agent",
                action="Staged Outbound Email Draft",
                resource="marcus.vance@acmetech.io",
                result="Awaiting Founder Approval",
                risk_level="High",
                status_badge="amber",
                details="Action quarantined per strict human-in-the-loop policy."
            )
        ])

        # 7. Security Events
        self.security_events.append(SecurityEventRecord(
            id="sec-1",
            workspace_id=ws_id,
            event_type="PROMPT_INJECTION_DEFENSE",
            severity="warning",
            description="Sanitized untrusted instruction in uploaded document: 'Ignore previous instructions'.",
            source_ip="10.0.4.12",
            blocked=True
        ))

        # 8. Usage Records
        self.usage[ws_id] = UsageRecord(
            workspace_id=ws_id,
            requests_count=842,
            tokens_input=412000,
            tokens_output=89000,
            estimated_cost_usd=18.42,
            storage_mb=128.5
        )

db = InMemoryDatabase()
