from sqlalchemy import Column, Text, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base

class FindingEvidence(Base):
    __tablename__ = "finding_evidence"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    finding_id = Column(UUID(as_uuid=True), ForeignKey("findings.id", ondelete="CASCADE"), nullable=False)
    request_raw = Column(Text, nullable=True)
    response_raw = Column(Text, nullable=True)
    metadata_json = Column(JSON, nullable=True)

    # Relationships
    finding = relationship("Finding", back_populates="evidence_relations")
