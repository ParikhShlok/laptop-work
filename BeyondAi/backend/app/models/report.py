from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id", ondelete="CASCADE"), nullable=False)
    report_type = Column(String, default="PDF")  # PDF, HTML, JSON
    generated_at = Column(DateTime, default=datetime.utcnow)
    file_path = Column(String, nullable=False)

    # Relationships
    scan = relationship("Scan", back_populates="reports")
