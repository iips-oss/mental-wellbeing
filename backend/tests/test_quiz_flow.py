"""
tests/test_quiz_flow.py

Tests quiz question loading and quiz submission flow for SCQ, GWBS, TABBPS, and EI.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from models.admin import Admin
from models.student import Student
from models.event import Event, EventRSVP
from models.quiz import QuizTemplate, QuizQuestion, QuizOption, QuizAttempt
from services.quiz_service import populate_quiz_questions
from services.quiz_scoring import compute_quiz_result

@pytest.fixture
def test_db():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    TestSessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestSessionLocal()
    yield db
    db.close()

def test_quiz_population_and_scoring(test_db):
    # 1. Create admin, event, student, rsvp
    admin = Admin(id="admin-1", name="Dr. Yasmin", email="yasmin@test.com", password_hash="hash")
    from datetime import date, time
    event = Event(id="event-1", admin_id="admin-1", title="Test Event", venue="Hall", event_date=date(2026, 7, 27), event_time=time(10, 0), status="scheduled")
    student = Student(
        id="student-1",
        enrollment_no="EN123",
        name="Test Student",
        email="student@test.com",
        phone="1234567890",
        gender="female",
        course="MTECH IT",
        semester=6,
        session="25-26",
        password_hash="hash"
    )
    rsvp = EventRSVP(id="rsvp-1", event_id="event-1", student_id="student-1")
    test_db.add_all([admin, event, student, rsvp])
    test_db.commit()

    # 2. Test each quiz type
    for qtype in ["SCQ", "GWBS", "TABBPS", "EI"]:
        template = QuizTemplate(id=f"tmpl-{qtype}", event_id="event-1", quiz_type=qtype, sequence_no=1, title=f"{qtype} Test")
        test_db.add(template)
        test_db.flush()
        populate_quiz_questions(test_db, template)
        test_db.commit()

        # Fetch questions
        questions = test_db.query(QuizQuestion).filter(QuizQuestion.quiz_template_id == template.id).all()
        assert len(questions) > 0

        # Build answers
        if qtype == "TABBPS":
            scoring_answers = {"A": {}, "B": {}}
            for q in questions:
                opts = test_db.query(QuizOption).filter(QuizOption.option_set_id == q.option_set_id).all()
                chosen_opt = opts[0]
                scoring_answers[q.form][q.question_no] = chosen_opt.score_value
        else:
            scoring_answers = {}
            for q in questions:
                opts = test_db.query(QuizOption).filter(QuizOption.option_set_id == q.option_set_id).all()
                chosen_opt = opts[0]
                scoring_answers[q.question_no] = chosen_opt.score_value

        # Score result
        res = compute_quiz_result(qtype, scoring_answers, gender=student.gender)
        assert res is not None
        assert "quiz_type" in res or "final_classification" in res
