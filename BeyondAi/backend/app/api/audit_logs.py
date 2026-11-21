from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.audit_log import AuditLog
from app.schemas.audit_log import AuditLogResponse
from app.utils.rate_limit import RateLimiter

router = APIRouter(prefix="/api/audit-logs", tags=["Audit Logs"])

# Rate limit for audit log access: 30 requests per minute
audit_rate_limiter = RateLimiter(limit=30, window_seconds=60)

@router.get("", response_model=List[AuditLogResponse], dependencies=[Depends(audit_rate_limiter)])
def get_audit_logs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve audit logs associated with the authenticated user.
    """
    logs = db.query(AuditLog).filter(AuditLog.user_id == current_user.id).order_by(AuditLog.timestamp.desc()).all()
    return logs
