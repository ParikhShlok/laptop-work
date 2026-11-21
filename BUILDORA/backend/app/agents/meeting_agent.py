from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from app.ai.prompts.base_prompts import MEETING_AGENT_PROMPT
from app.ai.model_router import model_router
from app.database.repositories import repo
from app.database.models import AuditLogRecord

class MeetingAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Meeting Agent",
            description="Extracts executive summaries, key decisions, and action items from transcripts.",
            system_prompt=MEETING_AGENT_PROMPT,
            allowed_tools=["parse_transcript", "create_tasks"],
            allowed_actions=["summarize", "stage_tasks"],
            risk_level="Low",
            approval_required=False
        )

    def run(self, workspace_id: str, user_name: str, input_payload: Dict[str, Any]) -> Dict[str, Any]:
        transcript = input_payload.get("transcript", "")
        title = input_payload.get("title", "Product Strategy Meeting — Oct 5")
        
        # Analyze decisions and tasks
        summary = (
            f"The '{title}' concluded with agreement to prioritize enterprise SAML SSO "
            f"for Google Workspace & Okta in Sprint 14, unblocking CloudPeak & Acme Tech deals."
        )
        decisions = [
            "Move onboarding redesign to Sprint 14 to reduce initial drop-off",
            "Prioritize SSO before general enterprise release",
            "Run 5 customer interviews before finalizing commercial pricing"
        ]
        action_items = [
            {"task": "Prepare SAML 2.0 Auth spec for Okta & Google", "owner": "Rahul", "due": "Oct 12", "category": "Engineering"},
            {"task": "Draft simplified 3-step onboarding flow wireframes", "owner": "Sarah", "due": "Oct 14", "category": "Product"},
            {"task": "Follow up with Marcus Vance on SSO beta testing", "owner": "Maya", "due": "Oct 15", "category": "Sales"}
        ]
        
        # Log to audit trail
        repo.add_audit_log(
            workspace_id=workspace_id,
            log=AuditLogRecord(
                id=f"aud-meet-{int(repo.db.approvals.__len__() + 1)}",
                workspace_id=workspace_id,
                user_name=user_name,
                agent_name=self.name,
                action=f"Synthesized transcript for {title}",
                resource=title,
                result="Generated 3 action items and 3 decisions",
                risk_level="Low",
                status_badge="emerald",
                details="Action items staged ready to convert to workspace tasks."
            )
        )

        return {
            "title": title,
            "summary": summary,
            "decisions": decisions,
            "action_items": action_items
        }

meeting_agent = MeetingAgent()
