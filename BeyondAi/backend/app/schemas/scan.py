from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.schemas.finding import FindingResponse

class ScanBase(BaseModel):
    scan_type: str = "FULL"

class ScanCreate(ScanBase):
    target_id: int

class ScanResponse(ScanBase):
    id: int
    target_id: int
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    overall_score: Optional[int] = None
    error_message: Optional[str] = None

    class Config:
        from_attributes = True
