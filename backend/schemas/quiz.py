from typing import Annotated, Optional, Literal, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
# from uuid import UUID

# quiz types currenly supported by the scoring engine
QuizTypeStr = Literal['SCQ', 'GWBS', 'TABBPS', 'EI']
# TABBPS questions are split between form A and form B
FormStr = Literal['A', 'B']
AttemptStatus = Literal['not_attempted', 'in_progress', 'submitted']

LabelStr = Annotated[str, Field(min_length=2, max_length=100, strip_whitespace=True)]
QuestionText = Annotated[str, Field(min_length=5, max_length=1000, strip_whitespace=True)]

class QuizOptionBase(BaseModel):
    option_text: Annotated[str, Field(min_length=1, max_length=255, strip_whitespace=True)]
    # bounded 1-5 to match the psychological scaling in SCQ, GWBS and EI logics
    score_value: Annotated[int, Field(ge=1, le=5)]
    display_order: Annotated[int, Field(ge=1)]

class QuizOptionCreate(QuizOptionBase):
    pass

class QuizOptionOut(QuizOptionBase):
    id: str
    option_set_id: str

    model_config = ConfigDict(from_attributes=True)

class OptionSetBase(BaseModel):
    label: LabelStr
    description: Annotated[Optional[str], Field(default=None, max_length=500, strip_whitespace=True)]

class OptionSetCreate(OptionSetBase):
    # supports nested creation so a complete option set with its options can be created in one request
    options: list[QuizOptionCreate] = Field(default_factory=list)

class OptionSetOut(OptionSetBase):
    id: str
    options: list[QuizOptionOut] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)

class QuizTemplateBase(BaseModel):
    quiz_type: QuizTypeStr
    sequence_no: Annotated[int, Field(ge=1)]
    title: Annotated[str, Field(min_length=3, max_length=255, strip_whitespace=True)]

class QuizTemplateCreate(QuizTemplateBase):
    event_id: str

class QuizTemplateOut(QuizTemplateBase):
    id: str
    event_id: str

    model_config = ConfigDict(from_attributes=True)

class QuizQuestionBase(BaseModel):
    question_no: Annotated[int, Field(ge=1)]
    question_text: QuestionText
    area_code: Annotated[Optional[str], Field(default=None, max_length=50, strip_whitespace=True)]
    form: Optional[FormStr] = None

class QuizQuestionCreate(QuizQuestionBase):
    quiz_template_id: str
    option_set_id: str

class QuizQuestionOut(QuizQuestionBase):
    id: str
    quiz_template_id: str
    option_set_id: str
    options: list[QuizOptionOut] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)

class QuizOut(BaseModel):
    quiz_template_id: str
    quiz_type: str
    title: str
    sequence_no: int
    questions: list[QuizQuestionOut] = Field(default_factory=list)

# created for POST /quiz/submit...accepts a dict for TABBPS nested structure.
class QuizSubmit(BaseModel):
    quiz_template_id: str
    answers: dict[str, Any]

class AreaScoreOut(BaseModel):
    id: str
    area_code: str
    area_score: int
    area_remark: Annotated[Optional[str], Field(default=None, max_length=1000)]

    model_config = ConfigDict(from_attributes=True)

class QuizResponseOut(BaseModel):
    id: str
    question_id: str
    selected_option_id: str
    score_awarded: int

    model_config = ConfigDict(from_attributes=True)

class QuizAttemptOut(BaseModel):
    id: str
    quiz_template_id: str
    student_id: str
    status: AttemptStatus
    attempted_at: Optional[datetime] = None
    total_score: Optional[int] = None
    overall_remark: Annotated[Optional[str], Field(default=None, max_length=1000)]
    result_json: Optional[dict[str, Any]] = None
    area_scores: list[AreaScoreOut] = Field(default_factory=list)
    quiz_type: Optional[str] = None   # NEW — populated manually in the route, not from the ORM object directly

    model_config = ConfigDict(from_attributes=True)