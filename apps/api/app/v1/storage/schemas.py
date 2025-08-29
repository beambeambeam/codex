from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class FileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    upload_by: Optional[str] = None  # display name for API response
    upload_at: datetime
    name: str
    size: int
    type: str
    resource: str
    url: str
