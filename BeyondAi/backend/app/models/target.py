from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

class Target(Base):
    __tablename__ = "targets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=True)
    name = Column(String, nullable=False)
    domain = Column(String, nullable=False)
    normalized_url = Column(String, nullable=False)
    verification_token = Column(String, nullable=False)
    verification_status = Column(String, default="pending")  # pending, verified, failed
    authorization_confirmed = Column(Boolean, default=False)
    authorization_timestamp = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="targets")
    organization = relationship("Organization", back_populates="targets")
    scans = relationship("Scan", back_populates="target", cascade="all, delete-orphan")
    scope = relationship("TargetScope", uselist=False, back_populates="target", cascade="all, delete-orphan")
    assets = relationship("Asset", back_populates="target", cascade="all, delete-orphan")
