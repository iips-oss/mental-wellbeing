import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, func
from database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, nullable=False)
    # type = 'event_created' | 'event_cancelled' | 'quiz_assigned' | 'results_published'
    event_id = Column(String, ForeignKey("events.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)