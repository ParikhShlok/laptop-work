from typing import Dict, Any
from app.agents.base_agent import BaseAgent
from app.ai.prompts.base_prompts import SALES_AGENT_PROMPT

class SalesAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Sales Agent",
            description="Researches leads and drafts personalized outbound emails. Enforces approval gates.",
            system_prompt=SALES_AGENT_PROMPT,
            allowed_tools=["research_lead", "draft_email", "stage_approval"],
            allowed_actions=["research", "draft_email"],
            risk_level="High",
            approval_required=True
        )

    def run(self, workspace_id: str, user_name: str, input_payload: Dict[str, Any]) -> Dict[str, Any]:
        lead_name = input_payload.get("lead_name", "Marcus Vance")
        lead_role = input_payload.get("lead_role", "VP of Engineering")
        lead_company = input_payload.get("lead_company", "Acme Technologies")
        lead_email = input_payload.get("lead_email", "marcus.vance@acmetech.io")

        # 1. Lead Research & Strategy
        research_notes = (
            f"{lead_company} is scaling their engineering team to 40 devs. "
            f"Marcus recently expressed concerns about uncontrolled developer copilot leakage on LinkedIn. "
            f"Key hook: Highlight BUILDORA's Sprint 14 SAML SSO and strict founder approval gates."
        )

        email_subject = "Acme Technologies & Buildora: SOC2-ready AI workspace with Zero Retention"
        email_body = (
            f"Hi {lead_name.split()[0]},\n\n"
            f"Noticed {lead_company} is adopting AI agents across development while maintaining strict SOC2 standards.\n\n"
            f"Buildora provides an air-gapped operating workspace where meeting notes, roadmap knowledge, and "
            f"developer automations remain strictly private—with founder approvals required for any external API dispatches.\n\n"
            f"We just released Sprint 14 Okta/Google Workspace SAML support. Would you be open to a 10-minute preview next Tuesday?\n\n"
            f"Best regards,\nAlex Rivera\nFounder, AcmeFlow"
        )

        # 2. Enforce Human-in-the-Loop Approval Requirement (Section 12 & 17)
        approval_item = self.check_permissions_and_stage_approval(
            workspace_id=workspace_id,
            user_name=user_name,
            action_type="email",
            action_title=f"Outbound Email to {lead_name} ({lead_company})",
            target_system="Gmail",
            recipient=lead_email,
            payload={
                "subject": email_subject,
                "body": email_body,
                "lead_name": lead_name,
                "lead_company": lead_company
            }
        )

        return {
            "status": "approval_required",
            "approval_id": approval_item.id,
            "lead": {
                "name": lead_name,
                "company": lead_company,
                "email": lead_email,
                "role": lead_role
            },
            "research_notes": research_notes,
            "draft_email": {
                "subject": email_subject,
                "body": email_body
            },
            "risk_level": "High",
            "message": "⚠️ Approval Required: Email cannot be sent automatically. Staged in the Approval Center."
        }

sales_agent = SalesAgent()
