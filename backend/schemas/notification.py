from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class NotificationOut(BaseModel):
    id: str
    title: str
    message: str
    type: str
    event_id: Optional[str] = None
    created_at: datetime
    is_read: bool = False

    model_config = ConfigDict(from_attributes=True)