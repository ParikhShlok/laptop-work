from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

class TargetScope(Base):
    __tablename__ = "target_scopes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    target_id = Column(UUID(as_uuid=True), ForeignKey("targets.id", ondelete="CASCADE"), nullable=False, unique=True)
    hostname = Column(String, nullable=False)
    allowed_paths = Column(JSON, nullable=False)  # list of paths, e.g., ["*"]
    excluded_paths = Column(JSON, nullable=False)  # list of paths, e.g., []
    allowed_ports = Column(JSON, nullable=False)  # list of ports, e.g., [80, 443]
    scan_profile = Column(String, default="STANDARD")  # SAFE, STANDARD, DEEP
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    target = relationship("Target", back_populates="scope")
