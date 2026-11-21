from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.core.database import Base

class Asset(Base):
    __tablename__ = "assets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    target_id = Column(UUID(as_uuid=True), ForeignKey("targets.id", ondelete="CASCADE"), nullable=False)
    hostname = Column(String, nullable=False, index=True)
    ip_address = Column(String, nullable=True)
    asset_type = Column(String, default="SUBDOMAIN")  # SUBDOMAIN, IP, PORT
    status = Column(String, default="ACTIVE")          # ACTIVE, INACTIVE
    discovered_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    target = relationship("Target", back_populates="assets")
    technologies = relationship("Technology", back_populates="asset", cascade="all, delete-orphan")
