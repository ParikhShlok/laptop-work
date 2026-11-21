from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Any

class FindingBase(BaseModel):
    title: str
    category: str
    severity: str
    confidence: str
    description: str
    evidence: Optional[str] = None
    affected_component: Optional[str] = None
    recommendation: Optional[str] = None
    references: Optional[List[str]] = None

class FindingResponse(FindingBase):
    id: int
    scan_id: int
    created_at: datetime

    class Config:
        from_attributes = True
