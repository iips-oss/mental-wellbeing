from sqlalchemy.orm import relationship

from sqlalchemy.sql import func
from sqlalchemy import Column, DateTime, String, Integer, TIMESTAMP
import uuid
from database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    enrollment_no = Column(String, nullable=False, unique=True)  # assigned at admission, always exists
    roll_number = Column(String, nullable=True, unique=True)      # assigned later, null until then
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True,index=True)
    phone = Column(String, nullable=False)
    gender = Column(String, nullable=False)       # required for GWBS-KADA interpretation
    course = Column(String, nullable=False)
    semester = Column(Integer, nullable=False)
    session = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    avatar_key = Column(String, nullable=True)  # id from AVATAR_OPTIONS, e.g. "sprout"; null = show initial
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # relationships
    rsvps = relationship("EventRSVP", back_populates="student")
    quiz_attempts = relationship("QuizAttempt", back_populates="student")