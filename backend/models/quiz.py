import uuid
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, func, UniqueConstraint
from sqlalchemy import JSON
from sqlalchemy.orm import relationship
from database import Base


class OptionSet(Base):
    __tablename__ = "option_sets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    label = Column(String, nullable=False, unique=True)
    # e.g. "agree_disagree", "apply_scale", "scqs_q1" etc.
    description = Column(Text, nullable=True)

    # relationships
    options = relationship("QuizOption", back_populates="option_set")
    questions = relationship("QuizQuestion", back_populates="option_set")


class QuizOption(Base):
    __tablename__ = "quiz_options"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    option_set_id = Column(String, ForeignKey("option_sets.id"), nullable=False)
    option_text = Column(String, nullable=False)
    score_value = Column(Integer, nullable=False)    # raw score 1-5, no polarity here
    display_order = Column(Integer, nullable=False)  # controls order shown on screen

    # relationships
    option_set = relationship("OptionSet", back_populates="options")
    responses = relationship("QuizResponse", back_populates="selected_option")


class QuizTemplate(Base):
    __tablename__ = "quiz_templates"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String, ForeignKey("events.id"), nullable=False)
    quiz_type = Column(String, nullable=False)
    # quiz_type = 'SCQ' | 'GWBS' | 'TABBPS' | 'EI'
    # maps directly to scoring function in quiz_scoring.py
    sequence_no = Column(Integer, nullable=False)   # order quizzes appear in event
    title = Column(String, nullable=False)

    # relationships
    event = relationship("Event", back_populates="quiz_templates")
    attempts = relationship("QuizAttempt", back_populates="quiz_template")
    # NOTE: no `questions` relationship anymore — question banks are shared
    # across all templates of the same quiz_type, not owned by one template.


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    quiz_type = Column(String, nullable=False)
    # quiz_type = 'SCQ' | 'GWBS' | 'TABBPS' | 'EI'
    # Shared question bank keyed by quiz_type — NOT by quiz_template_id.
    # This is what prevents questions from being duplicated per event.
    option_set_id = Column(String, ForeignKey("option_sets.id"), nullable=False)
    question_no = Column(Integer, nullable=False)
    question_text = Column(Text, nullable=False)
    area_code = Column(String, nullable=True)
    # area_code = dimension/competency e.g. "A_Physical", "Self_Awareness"
    # null for TABBPS since it uses form + factor structure instead
    form = Column(String, nullable=True)
    # form = "A" or "B" for TABBPS only, null for all other quiz types

    # no polarity column — reversal logic lives in Python scoring functions only

    __table_args__ = (
        UniqueConstraint("quiz_type", "question_no", "form", name="uq_question_type_no_form"),
    )

    # relationships
    option_set = relationship("OptionSet", back_populates="questions")
    responses = relationship("QuizResponse", back_populates="question")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    quiz_template_id = Column(String, ForeignKey("quiz_templates.id"), nullable=False)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    status = Column(String, nullable=False, default="not_attempted")
    # status = 'not_attempted' | 'in_progress' | 'submitted'
    # created with 'not_attempted' when student RSVPs to event
    attempted_at = Column(DateTime(timezone=True), nullable=True)   # set when student starts
    total_score = Column(Integer, nullable=True)
    # null for EI (no overall score) and TABBPS (no single total)
    overall_remark = Column(String, nullable=True)
    # null for EI (per competency only) and TABBPS (classification instead)
    result_json = Column(JSON, nullable=True)
    # stores full scoring output:
    # SCQ   → dimension scores
    # GWBS  → dimension scores
    # TABBPS → form A/B scores, factor scores, classification
    # EI    → competency scores and interpretations

    # unique constraint — one attempt per student per quiz template
    __table_args__ = (
        UniqueConstraint("quiz_template_id", "student_id", name="uq_attempt_template_student"),
    )

    # relationships
    quiz_template = relationship("QuizTemplate", back_populates="attempts")
    student = relationship("Student", back_populates="quiz_attempts")
    area_scores = relationship("AreaScore", back_populates="attempt")
    responses = relationship("QuizResponse", back_populates="attempt")


class AreaScore(Base):
    __tablename__ = "area_scores"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    attempt_id = Column(String, ForeignKey("quiz_attempts.id"), nullable=False)
    area_code = Column(String, nullable=False)
    # matches area_code on quiz_questions
    # enables direct SQL: "all students with EI SA score above 35"
    area_score = Column(Integer, nullable=False)
    area_remark = Column(String, nullable=True)

    # relationships
    attempt = relationship("QuizAttempt", back_populates="area_scores")


class QuizResponse(Base):
    __tablename__ = "quiz_responses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    attempt_id = Column(String, ForeignKey("quiz_attempts.id"), nullable=False)
    question_id = Column(String, ForeignKey("quiz_questions.id"), nullable=False)
    selected_option_id = Column(String, ForeignKey("quiz_options.id"), nullable=False)
    score_awarded = Column(Integer, nullable=False)
    # raw score_value from selected option
    # service layer builds answers dict from these rows before calling scorer

    # relationships
    attempt = relationship("QuizAttempt", back_populates="responses")
    question = relationship("QuizQuestion", back_populates="responses")
    selected_option = relationship("QuizOption", back_populates="responses")