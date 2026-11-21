from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.target import Target
from app.models.scan import Scan
from app.models.finding import Finding
from app.schemas.scan import ScanCreate, ScanResponse
from app.schemas.finding import FindingResponse
from app.services.header_checker import run_header_compliance_scan
from app.services.audit import log_audit_event
from app.utils.rate_limit import RateLimiter
from app.core.config import settings

router = APIRouter(prefix="/api/scans", tags=["Scans"])

# API Rate limit: max 5 scan requests per minute per IP/token
scan_rate_limiter = RateLimiter(limit=5, window_seconds=60)

@router.post("", response_model=ScanResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(scan_rate_limiter)])
def start_scan(
    scan_in: ScanCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Queue a compliance and vulnerability posture scan for a verified target.
    """
    # Ensure target belongs to user
    target = db.query(Target).filter(
        Target.id == scan_in.target_id,
        Target.user_id == current_user.id
    ).first()

    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target not found or not associated with your account."
        )

    # Ensure target has authorized scanning confirmed
    if not target.authorization_confirmed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Target scanning authorization has not been confirmed."
        )

    # Enforce scan concurrency rate-limiting (max active scans per user)
    active_scans_count = db.query(Scan).join(Target).filter(
        Target.user_id == current_user.id,
        Scan.status.in_(["QUEUED", "RUNNING"])
    ).count()

    if active_scans_count >= settings.MAX_CONCURRENT_SCANS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Concurrency Limit: You already have {active_scans_count} scans queued/running (Max: {settings.MAX_CONCURRENT_SCANS})."
        )

    # Initialize Scan object
    new_scan = Scan(
        target_id=target.id,
        status="QUEUED",
        scan_type=scan_in.scan_type
    )
    db.add(new_scan)
    db.commit()
    db.refresh(new_scan)

    # Log audit event
    log_audit_event(
        db=db,
        user_id=current_user.id,
        action="SCAN_STARTED",
        target_id=target.id,
        scan_id=new_scan.id,
        metadata_json={"scan_type": new_scan.scan_type}
    )

    # Dispatch compliance assessment task in background
    background_tasks.add_task(
        run_header_compliance_scan,
        db=db,
        scan=new_scan,
        target_url=target.normalized_url
    )

    return new_scan

@router.get("/{scan_id}", response_model=ScanResponse)
def get_scan_status(
    scan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve details and status of a scan.
    """
    scan = db.query(Scan).join(Target).filter(
        Scan.id == scan_id,
        Target.user_id == current_user.id
    ).first()

    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found."
        )
    return scan

@router.get("/{scan_id}/findings", response_model=list[FindingResponse])
def get_scan_findings(
    scan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve all findings discovered during a specific scan.
    """
    # Ensure scan belongs to user
    scan = db.query(Scan).join(Target).filter(
        Scan.id == scan_id,
        Target.user_id == current_user.id
    ).first()

    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found."
        )

    return db.query(Finding).filter(Finding.scan_id == scan.id).all()
