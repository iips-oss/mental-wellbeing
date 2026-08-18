from typing import Optional
from pydantic import BaseModel
from sqlalchemy import Column, String, TIMESTAMP
from datetime import datetime, timezone
import uuid
from sqlalchemy.orm import relationship
from database import Base

class Admin(Base):
    __tablename__ = "admins"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    department = Column(String)
    created_at = Column(TIMESTAMP, default=lambda: datetime.now(timezone.utc))
    events = relationship("Event", back_populates="admin")

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None
    avatar_key: Optional[str] = None