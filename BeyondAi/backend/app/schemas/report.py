from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ReportResponse(BaseModel):
    id: int
    scan_id: int
    report_type: str
    generated_at: datetime
    file_path: str

    model_config = ConfigDict(from_attributes=True)
