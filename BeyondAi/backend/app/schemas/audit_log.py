from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import datetime

class AuditLogResponse(BaseModel):
    id: int
    user_id: int
    organization_id: Optional[int] = None
    action: str
    target_id: Optional[int] = None
    scan_id: Optional[int] = None
    timestamp: datetime
    metadata_json: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
