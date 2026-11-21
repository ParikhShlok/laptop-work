from sqlalchemy.orm import Session
from typing import Optional, Any, Dict
from app.models.audit_log import AuditLog

def log_audit_event(
    db: Session,
    user_id: int,
    action: str,
    target_id: Optional[int] = None,
    scan_id: Optional[int] = None,
    metadata_json: Optional[Dict[str, Any]] = None
) -> AuditLog:
    """
    Log an administrative or operational action performed in the system.
    """
    db_log = AuditLog(
        user_id=user_id,
        action=action,
        target_id=target_id,
        scan_id=scan_id,
        metadata_json=metadata_json
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log
