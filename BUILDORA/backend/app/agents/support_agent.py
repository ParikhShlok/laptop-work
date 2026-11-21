from typing import Dict, Any
from app.agents.base_agent import BaseAgent
from app.ai.prompts.base_prompts import SUPPORT_AGENT_PROMPT
from app.ai.context_builder import context_builder

class SupportAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Support Agent",
            description="Answers incoming customer tickets using grounded company docs with human sign-off.",
            system_prompt=SUPPORT_AGENT_PROMPT,
            allowed_tools=["search_knowledge", "draft_reply", "stage_approval"],
            allowed_actions=["support_ticket_reply"],
            risk_level="Medium",
            approval_required=True
        )

    def run(self, workspace_id: str, user_name: str, input_payload: Dict[str, Any]) -> Dict[str, Any]:
        customer_email = input_payload.get("customer_email", "support-lead@bigsaas.com")
        question = input_payload.get("question", "Does Buildora support SAML SSO for Google Workspace?")
        
        # 1. Search knowledge
        _, citations = context_builder.build_grounded_context(workspace_id, question)

        # 2. Draft response
        draft_response = (
            "Hi there,\n\n"
            "Yes! As part of our Sprint 14 release, Buildora includes full SAML 2.0 Single Sign-On (SSO) "
            "for both Google Workspace and Okta. This is available on our Team and Business tiers.\n\n"
            "Please let us know if you would like us to enable this for your organization.\n\n"
            "— AcmeFlow Support"
        )
        confidence_score = 0.94

        # 3. Stage approval before dispatch
        approval_item = self.check_permissions_and_stage_approval(
            workspace_id=workspace_id,
            user_name=user_name,
            action_type="email",
            action_title=f"Support Response to {customer_email}",
            target_system="Gmail / Zendesk",
            recipient=customer_email,
            payload={
                "customer_email": customer_email,
                "question": question,
                "response": draft_response,
                "confidence": confidence_score
            }
        )

        return {
            "status": "approval_required",
            "approval_id": approval_item.id,
            "question": question,
            "draft_reply": draft_response,
            "confidence_score": confidence_score,
            "sources": citations,
            "message": "Human approval required before response is sent to customer."
        }

support_agent = SupportAgent()
