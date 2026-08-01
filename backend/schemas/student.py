from pydantic import BaseModel, EmailStr, Field,field_validator
from datetime import datetime
from typing import Annotated, Optional
import re
ROLL_NUMBER_PATTERN = re.compile(r"^[A-Z]{2}-2K\d{2}-\d{1,3}$")
def validate_roll_number_format(v: str) -> str:
    v = v.strip().upper()
    if not ROLL_NUMBER_PATTERN.match(v):
        raise ValueError(
            "Roll number must be in format XX-2Kyy-nn, e.g. IT-2K23-53"
        )
    return v
class StudentCreate(BaseModel):
    enrollment_no: str
    roll_number: str
    name: str
    email: EmailStr
    phone: str
    gender: str
    course: str
    semester: int
    session: str
    password: str
    @field_validator("roll_number")
    @classmethod
    def check_roll_number(cls, v: str) -> str:
        return validate_roll_number_format(v)


class StudentOut(BaseModel):
    id: str
    enrollment_no: str
    roll_number: Optional[str] = None
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
    @field_validator("roll_number")
    @classmethod
    def check_roll_number(cls, v):
        if v is None:
            return v
        return validate_roll_number_format(v)
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