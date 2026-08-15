import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, func, UniqueConstraint
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


class NotificationRead(Base):
    """Per-student read-state for the shared/broadcast notifications feed.
    Notifications themselves are global (no student_id), so read state is
    tracked separately here rather than on the Notification row itself —
    one row per (student, notification) once that student has read it."""
    __tablename__ = "notification_reads"
    __table_args__ = (UniqueConstraint("student_id", "notification_id", name="uq_student_notification_read"),)

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    notification_id = Column(String, ForeignKey("notifications.id"), nullable=False)
    read_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)