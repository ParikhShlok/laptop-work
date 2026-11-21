from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TargetScopeBase(BaseModel):
    hostname: str
    allowed_paths: List[str] = ["*"]
    excluded_paths: List[str] = []
    allowed_ports: List[int] = [80, 443]
    scan_profile: str = "STANDARD"

class TargetScopeCreate(BaseModel):
    allowed_paths: Optional[List[str]] = ["*"]
    excluded_paths: Optional[List[str]] = []
    allowed_ports: Optional[List[int]] = [80, 443]
    scan_profile: Optional[str] = "STANDARD"

class TargetScopeResponse(TargetScopeBase):
    id: int
    target_id: int
    created_at: datetime

    class Config:
        from_attributes = True
