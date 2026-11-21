from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class RoleEnum:
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"

class UserRecord(BaseModel):
    id: str
    email: str
    name: str
    avatar: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class WorkspaceRecord(BaseModel):
    id: str
    name: str
    slug: str
    owner_id: str
    plan: str = "team"
    trial_ends_at: str
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class WorkspaceMemberRecord(BaseModel):
    workspace_id: str
    user_id: str
    role: str = RoleEnum.MEMBER
    status: str = "active"
    last_active: str = "Just now"

class DocumentChunk(BaseModel):
    id: str
    document_id: str
    workspace_id: str
    chunk_index: int
    content: str
    embedding: Optional[List[float]] = None
    metadata: Dict[str, Any] = {}

class DocumentRecord(BaseModel):
    id: str
    workspace_id: str
    title: str
    source_type: str  # google_drive, notion, slack, github, upload
    file_type: str    # pdf, docx, txt, md
    size_bytes: int
    chunks_count: int
    uploaded_by: str
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ApprovalRecord(BaseModel):
    id: str
    workspace_id: str
    agent_id: str
    agent_name: str
    action_type: str   # email, crm_update, file_delete, data_export
    action_title: str
    target_system: str # Gmail, HubSpot, GitHub, Notion
    recipient: Optional[str] = None
    payload: Dict[str, Any]
    risk_level: str    # Low, Medium, High, Critical
    status: str = "pending" # pending, approved, rejected, modified
    requested_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    resolved_at: Optional[str] = None
    resolved_by: Optional[str] = None
    reason: Optional[str] = None

class AuditLogRecord(BaseModel):
    id: str
    workspace_id: str
    user_id: Optional[str] = None
    user_name: str
    agent_id: Optional[str] = None
    agent_name: str
    tool_name: Optional[str] = None
    action: str
    resource: str
    result: str
    risk_level: str = "Low"
    approval_id: Optional[str] = None
    status_badge: str = "emerald"
    ip_address: str = "127.0.0.1"
    details: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class TaskRecord(BaseModel):
    id: str
    workspace_id: str
    title: str
    assignee: str
    due: str
    priority: str = "Medium"
    origin: str
    origin_type: str
    completed: bool = False

class DemoRequestRecord(BaseModel):
    id: str
    name: str
    work_email: str
    company: str
    company_size: str
    role: str
    current_ai_tools: str
    workflow_problem: str
    message: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    status: str = "new"

class SecurityEventRecord(BaseModel):
    id: str
    workspace_id: str
    event_type: str
    severity: str # info, warning, critical
    description: str
    source_ip: str
    blocked: bool = True
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class UsageRecord(BaseModel):
    workspace_id: str
    requests_count: int = 0
    tokens_input: int = 0
    tokens_output: int = 0
    estimated_cost_usd: float = 0.0
    storage_mb: float = 0.0
