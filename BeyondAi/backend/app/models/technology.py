from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base

class Technology(Base):
    __tablename__ = "technologies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False, index=True)
    version = Column(String, nullable=True)
    confidence = Column(String, default="HIGH")  # LOW, MEDIUM, HIGH

    # Relationships
    asset = relationship("Asset", back_populates="technologies")
