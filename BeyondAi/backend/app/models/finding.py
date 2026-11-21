from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Finding(Base):
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)  # DNS, Security Headers, SSL/TLS, Port Scan, ZAP Passive, etc.
    severity = Column(String, nullable=False)  # INFO, LOW, MEDIUM, HIGH, CRITICAL
    confidence = Column(String, nullable=False)  # LOW, MEDIUM, HIGH
    description = Column(Text, nullable=False)
    evidence = Column(Text, nullable=True)
    affected_component = Column(String, nullable=True)  # URL, Port, Header Name, etc.
    recommendation = Column(Text, nullable=True)
    references = Column(JSON, nullable=True)  # List of URLs or details
    scanner_source = Column(String, nullable=False)  # custom_headers, nmap, zap, etc.
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    scan = relationship("Scan", back_populates="findings")
