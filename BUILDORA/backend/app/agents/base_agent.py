from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from app.ai.model_router import model_router
from app.database.repositories import repo
from app.database.models import ApprovalRecord, AuditLogRecord

class BaseAgent(ABC):
    def __init__(
        self,
        name: str,
        description: str,
        system_prompt: str,
        allowed_tools: List[str],
        allowed_actions: List[str],
        risk_level: str = "Low",
        approval_required: bool = False
    ):
        self.name = name
        self.description = description
        self.system_prompt = system_prompt
        self.allowed_tools = allowed_tools
        self.allowed_actions = allowed_actions
        self.risk_level = risk_level
        self.approval_required = approval_required

    @abstractmethod
    def run(self, workspace_id: str, user_name: str, input_payload: Dict[str, Any]) -> Dict[str, Any]:
        """Executes the agent core logic"""
        pass

    def check_permissions_and_stage_approval(
        self,
        workspace_id: str,
        user_name: str,
        action_type: str,
        action_title: str,
        target_system: str,
        recipient: Optional[str],
        payload: Dict[str, Any]
    ) -> ApprovalRecord:
        """
        Enforces Section 8 & 17:
        Action requested -> Risk evaluation -> Permission evaluation -> Approval policy -> Stage
        """
        approval_id = f"appr-{int(datetime.utcnow().timestamp())}"
        appr = ApprovalRecord(
            id=approval_id,
            workspace_id=workspace_id,
            agent_id=self.name.lower().replace(" ", "-"),
            agent_name=self.name,
            action_type=action_type,
            action_title=action_title,
            target_system=target_system,
            recipient=recipient,
            payload=payload,
            risk_level=self.risk_level,
            status="pending"
        )
        repo.db.approvals[appr.id] = appr

        # Log to audit trail
        repo.add_audit_log(
            workspace_id=workspace_id,
            log=AuditLogRecord(
                id=f"aud-{int(datetime.utcnow().timestamp())}",
                workspace_id=workspace_id,
                user_name=user_name,
                agent_name=self.name,
                action=f"Staged {action_title}",
                resource=recipient or target_system,
                result="Awaiting Founder Approval",
                risk_level=self.risk_level,
                approval_id=appr.id,
                status_badge="amber",
                details=f"Mutating action paused by strict policy. Human-in-the-loop approval required."
            )
        )
        return appr

from datetime import datetime
