from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional
from app.schemas.target_scope import TargetScopeCreate, TargetScopeResponse

class TargetBase(BaseModel):
    name: str
    domain: str

class TargetCreate(BaseModel):
    name: str
    url: HttpUrl
    authorization_confirmed: bool
    scope: Optional[TargetScopeCreate] = None

class TargetResponse(TargetBase):
    id: int
    user_id: int
    normalized_url: str
    verification_status: str
    authorization_confirmed: bool
    authorization_timestamp: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    scope: Optional[TargetScopeResponse] = None

    class Config:
        from_attributes = True
