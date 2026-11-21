from typing import List, Dict, Any
from app.database.repositories import repo

class ContextBuilder:
    @staticmethod
    def build_grounded_context(workspace_id: str, query: str) -> tuple[str, List[Dict[str, Any]]]:
        """
        Retrieves relevant document chunks for the workspace and formats citation context.
        """
        chunks = repo.get_chunks(workspace_id)
        lower_query = query.lower()
        
        # Simple high-speed keyword & relevance scoring
        matched_chunks = []
        for c in chunks:
            content_lower = c.content.lower()
            # Calculate match score based on common terms
            score = 0
            for word in lower_query.split():
                if len(word) > 3 and word in content_lower:
                    score += 1
            if score > 0 or len(matched_chunks) < 2:
                matched_chunks.append((score, c))
                
        # Sort by relevance
        matched_chunks.sort(key=lambda x: x[0], reverse=True)
        top_chunks = [c for _, c in matched_chunks[:3]]
        
        if not top_chunks:
            return "", []
            
        context_str = "\n\n=== VERIFIED COMPANY KNOWLEDGE CONTEXT ===\n"
        citations = []
        for i, chunk in enumerate(top_chunks):
            doc_title = chunk.metadata.get("title", f"Document {chunk.document_id}")
            source = chunk.metadata.get("source", "Internal")
            context_str += f"[Source {i+1}: {doc_title} ({source})]\n{chunk.content}\n\n"
            citations.append({
                "id": chunk.id,
                "name": doc_title,
                "sourceType": source,
                "excerpt": chunk.content[:160] + "..."
            })
            
        return context_str, citations

context_builder = ContextBuilder()
