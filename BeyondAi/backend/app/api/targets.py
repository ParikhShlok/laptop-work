from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from urllib.parse import urlparse
import uuid
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.target import Target
from app.models.target_scope import TargetScope
from app.schemas.target import TargetCreate, TargetResponse
from app.utils.ssrf import validate_url_for_ssrf
from app.utils.rate_limit import RateLimiter
from app.services.audit import log_audit_event

router = APIRouter(prefix="/api/targets", tags=["Targets"])

# Rate limit: max 10 target registrations per minute per user/IP
target_rate_limiter = RateLimiter(limit=10, window_seconds=60)

@router.post("", response_model=TargetResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(target_rate_limiter)])
def create_target(target_in: TargetCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Register a new target web application for security posture analysis.
    """
    if not target_in.authorization_confirmed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authorization confirmation is required to register and scan a target application."
        )

    parsed_url = urlparse(str(target_in.url))
    domain = parsed_url.netloc
    if not domain:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid URL structure. Must include domain name."
        )

    # Normalize url to include protocol and host path
    normalized_url = f"{parsed_url.scheme}://{parsed_url.netloc}"

    # Protect against SSRF: Verify target does not point to internal/loopback IP address
    if not validate_url_for_ssrf(normalized_url):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SSRF Protection: The specified target URL resolves to an internal, loopback, or restricted IP range."
        )

    # Check if target already registered by this user
    existing = db.query(Target).filter(
        Target.user_id == current_user.id,
        Target.normalized_url == normalized_url
    ).first()

    if existing:
        return existing

    # Create verification token
    verification_token = str(uuid.uuid4())

    new_target = Target(
        user_id=current_user.id,
        name=target_in.name,
        domain=domain,
        normalized_url=normalized_url,
        verification_token=verification_token,
        verification_status="verified",  # Default to auto-verified for testing/demo purposes
        authorization_confirmed=True,
        authorization_timestamp=datetime.utcnow()
    )
    
    # Establish target scope
    scope_data = target_in.scope
    allowed_paths = scope_data.allowed_paths if (scope_data and scope_data.allowed_paths is not None) else ["*"]
    excluded_paths = scope_data.excluded_paths if (scope_data and scope_data.excluded_paths is not None) else []
    allowed_ports = scope_data.allowed_ports if (scope_data and scope_data.allowed_ports is not None) else [80, 443]
    scan_profile = scope_data.scan_profile if (scope_data and scope_data.scan_profile is not None) else "STANDARD"

    new_scope = TargetScope(
        hostname=domain,
        allowed_paths=allowed_paths,
        excluded_paths=excluded_paths,
        allowed_ports=allowed_ports,
        scan_profile=scan_profile
    )
    new_target.scope = new_scope

    db.add(new_target)
    db.commit()
    db.refresh(new_target)

    # Log audit event
    log_audit_event(
        db=db,
        user_id=current_user.id,
        action="TARGET_CREATED",
        target_id=new_target.id,
        metadata_json={
            "name": new_target.name,
            "url": new_target.normalized_url,
            "scope": {
                "hostname": domain,
                "allowed_paths": allowed_paths,
                "excluded_paths": excluded_paths,
                "allowed_ports": allowed_ports,
                "scan_profile": scan_profile
            }
        }
    )

    return new_target

@router.get("", response_model=list[TargetResponse])
def list_targets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    List all targets owned by the authenticated user.
    """
    return db.query(Target).filter(Target.user_id == current_user.id).all()

@router.get("/{target_id}", response_model=TargetResponse)
def get_target(target_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Retrieve details of a registered target.
    """
    target = db.query(Target).filter(Target.id == target_id, Target.user_id == current_user.id).first()
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target not found."
        )
    return target
