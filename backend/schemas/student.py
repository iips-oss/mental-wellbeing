from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Annotated, Optional

class StudentCreate(BaseModel):
    enrollment_no: str
    name: str
    email: EmailStr
    phone: str
    gender: str
    course: str
    semester: int
    session: str
    password: str

class StudentOut(BaseModel):
    id: str
    enrollment_no: str
    name: str
    email: EmailStr
    phone: str
    gender: str
    course: str
    semester: int
    session: str
    created_at: datetime

    class Config:
        from_attributes = True


# Custom types specifically for update validation
PhoneNum = Annotated[str, Field(min_length=10, max_length=15, pattern=r"^\+?[0-9]+$")]

class StudentUpdate(BaseModel):
    roll_number: Annotated[Optional[str], Field(default=None, min_length=4, max_length=50, strip_whitespace=True)]
    phone: Optional[PhoneNum] = None
    semester: Annotated[Optional[int], Field(default=None, ge=1, le=10)]

# added for student dashboard route requirements
class DashboardSummary(BaseModel):
    total_rsvps: int
    total_quizzes: int

class DashboardOut(BaseModel):
    student: StudentOut
    summary: DashboardSummary

from datetime import date
from typing import Optional

class ScqHistoryItem(BaseModel):
    event_id: str
    event_name: str
    event_date: date
    score: int

class ScqProgressOut(BaseModel):
    current_score: Optional[int]
    latest_event: Optional[date]
    history: list[ScqHistoryItem]