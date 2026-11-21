from typing import Dict, Any
from app.agents.base_agent import BaseAgent
from app.ai.prompts.base_prompts import BASE_SYSTEM_PROMPT
from app.ai.context_builder import context_builder
from app.ai.model_router import model_router

class KnowledgeAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Knowledge Agent",
            description="Answers questions about private company knowledge with citations.",
            system_prompt=BASE_SYSTEM_PROMPT,
            allowed_tools=["search_knowledge", "retrieve_chunks"],
            allowed_actions=["query"],
            risk_level="Low",
            approval_required=False
        )

    def run(self, workspace_id: str, user_name: str, input_payload: Dict[str, Any]) -> Dict[str, Any]:
        query = input_payload.get("query", "")
        context_str, citations = context_builder.build_grounded_context(workspace_id, query)
        
        full_system = f"{self.system_prompt}\n{context_str}"
        response = model_router.generate(
            messages=[{"sender": "user", "text": query}],
            system_prompt=full_system
        )
        
        return {
            "agent": self.name,
            "answer": response["text"],
            "sources": citations,
            "provider": response["provider"],
            "tokens_in": response["tokens_in"],
            "tokens_out": response["tokens_out"]
        }

knowledge_agent = KnowledgeAgent()
