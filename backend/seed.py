"""import sys
import os
import uuid
import random
from datetime import datetime, date, time
from sqlalchemy.orm import Session

# Add the directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, SessionLocal, Base
from models.student import Student
from models.admin import Admin
from models.superuser import Superuser
from models.event import Event, EventReport, EventRSVP
from models.quiz import OptionSet, QuizOption, QuizTemplate, QuizQuestion, QuizResponse, QuizAttempt, AreaScore
from services.auth import hash_password
from services.quiz_scoring import compute_quiz_result, SCQ_DIMENSIONS, GWBS_DIMENSIONS, TABBPS_FORM_A_FACTORS, TABBPS_FORM_B_FACTORS, EI_COMPETENCIES

def get_scq_dim(q_no):
    for dim, questions in SCQ_DIMENSIONS.items():
        if q_no in questions:
            return dim
    return "Unknown"

def get_gwbs_dim(q_no):
    for dim, groups in GWBS_DIMENSIONS.items():
        if q_no in groups["positive"] or q_no in groups["negative"]:
            return dim
    return "Unknown"

def get_tabbps_factor(form, q_no):
    factors = TABBPS_FORM_A_FACTORS if form == "A" else TABBPS_FORM_B_FACTORS
    for factor, questions in factors.items():
        if q_no in questions:
            return factor
    return "Unknown"

def get_ei_comp(q_no):
    for comp, questions in EI_COMPETENCIES.items():
        if q_no in questions:
            return comp
    return "Unknown"

def seed_db():
    print("Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        print("Seeding Admin...")
        admin = Admin(
            id=str(uuid.uuid4()),
            name="Dr. Yasmin Sheikh",
            email="yasmin@iips.edu",
            password_hash=hash_password("password123"),
            department="Senior Technical Faculty, IIPS DAVV"
        )
        db.add(admin)
        db.flush()
        
        print("Seeding Option Set (5-point Likert)...")
        opt_set = OptionSet(
            id=str(uuid.uuid4()),
            label="likert_5",
            description="5-point scale: Strongly Disagree to Strongly Agree"
        )
        db.add(opt_set)
        db.flush()
        
        options = [
            ("Strongly Disagree", 1, 1),
            ("Disagree", 2, 2),
            ("Neutral", 3, 3),
            ("Agree", 4, 4),
            ("Strongly Agree", 5, 5)
        ]
        db_options = []
        for text_val, score, order in options:
            opt = QuizOption(
                id=str(uuid.uuid4()),
                option_set_id=opt_set.id,
                option_text=text_val,
                score_value=score,
                display_order=order
            )
            db.add(opt)
            db_options.append(opt)
        db.flush()
        
        print("Seeding Events...")
        # 1. Completed Event: Stress Management Workshop
        e1 = Event(
            id=str(uuid.uuid4()),
            admin_id=admin.id,
            title="Stress Management Workshop",
            venue="Seminar Hall, IIPS DAVV",
            event_date=date(2026, 7, 12),
            event_time=time(14, 0), # 2:00 PM
            status="completed",
            description="A workshop focused on identifying stressors and cultivating coping strategies."
        )
        # 2. Completed Event: Emotional Intelligence Seminar
        e2 = Event(
            id=str(uuid.uuid4()),
            admin_id=admin.id,
            title="Emotional Intelligence Seminar",
            venue="Auditorium, IIPS DAVV",
            event_date=date(2026, 7, 10),
            event_time=time(11, 0),
            status="completed",
            description="An interactive seminar introducing Emotional Intelligence concepts and applications."
        )
        # 3. Active Event: Time Management & Wellbeing
        e3 = Event(
            id=str(uuid.uuid4()),
            admin_id=admin.id,
            title="Time Management & Wellbeing",
            venue="Lab 4, IIPS DAVV",
            event_date=date(2026, 7, 24),
            event_time=time(10, 0),
            status="scheduled",
            description="Helping students manage academic load, schedule effectively, and minimize stress."
        )
        # 4. Active Event: Academic Anxiety Workshop
        e4 = Event(
            id=str(uuid.uuid4()),
            admin_id=admin.id,
            title="Academic Anxiety Workshop",
            venue="Classroom 101, IIPS DAVV",
            event_date=date(2026, 7, 28),
            event_time=time(15, 0),
            status="scheduled",
            description="Strategies for tackling test anxiety and enhancing cognitive focus during examinations."
        )
        db.add_all([e1, e2, e3, e4])
        db.flush()
        
        print("Seeding Quiz Templates...")
        # Event 1 Templates (SCQ, GWBS, TABBPS, EI)
        t1_scq = QuizTemplate(id=str(uuid.uuid4()), event_id=e1.id, quiz_type="SCQ", sequence_no=1, title="Self Concept Questionnaire (SCQ)")
        t1_gwbs = QuizTemplate(id=str(uuid.uuid4()), event_id=e1.id, quiz_type="GWBS", sequence_no=2, title="General Well-Being Scale (GWBS)")
        t1_tab = QuizTemplate(id=str(uuid.uuid4()), event_id=e1.id, quiz_type="TABBPS", sequence_no=3, title="Type A/B Behavioural Pattern (TABBPS)")
        t1_ei = QuizTemplate(id=str(uuid.uuid4()), event_id=e1.id, quiz_type="EI", sequence_no=4, title="Emotional Intelligence (EI)")
        
        # Event 2 Templates (EI)
        t2_ei = QuizTemplate(id=str(uuid.uuid4()), event_id=e2.id, quiz_type="EI", sequence_no=1, title="Emotional Intelligence assessment")
        t2_scq = QuizTemplate(id=str(uuid.uuid4()), event_id=e2.id, quiz_type="SCQ", sequence_no=2, title="Self Concept Questionnaire")
        
        # Event 3 Templates (GWBS)
        t3_gwbs = QuizTemplate(id=str(uuid.uuid4()), event_id=e3.id, quiz_type="GWBS", sequence_no=1, title="Wellbeing Check-in")
        
        # Event 4 Templates (SCQ, GWBS)
        t4_scq = QuizTemplate(id=str(uuid.uuid4()), event_id=e4.id, quiz_type="SCQ", sequence_no=1, title="Self Assessment SCQ")
        t4_gwbs = QuizTemplate(id=str(uuid.uuid4()), event_id=e4.id, quiz_type="GWBS", sequence_no=2, title="General Wellbeing Assessment")
        
        db.add_all([t1_scq, t1_gwbs, t1_tab, t1_ei, t2_ei, t2_scq, t3_gwbs, t4_scq, t4_gwbs])
        db.flush()
        
        print("Seeding Quiz Questions...")
        # A quick helper function to add questions for templates
        def add_questions_for_template(template, num_questions, type_str):
            for i in range(1, num_questions + 1):
                if type_str == "SCQ":
                    area_code = get_scq_dim(i)
                    q = QuizQuestion(
                        id=str(uuid.uuid4()), quiz_template_id=template.id, option_set_id=opt_set.id,
                        question_no=i, question_text=f"SCQ question {i}: rate your agreement on self perception.",
                        area_code=area_code, form=None
                    )
                elif type_str == "GWBS":
                    area_code = get_gwbs_dim(i)
                    q = QuizQuestion(
                        id=str(uuid.uuid4()), quiz_template_id=template.id, option_set_id=opt_set.id,
                        question_no=i, question_text=f"GWBS question {i}: rate your wellbeing during the past week.",
                        area_code=area_code, form=None
                    )
                elif type_str == "TABBPS":
                    # TABBPS questions: 17 for Form A, 16 for Form B
                    # Let's seed 17 for form A, and 16 for form B
                    pass
                elif type_str == "EI":
                    area_code = get_ei_comp(i)
                    q = QuizQuestion(
                        id=str(uuid.uuid4()), quiz_template_id=template.id, option_set_id=opt_set.id,
                        question_no=i, question_text=f"EI question {i}: rate your emotional intelligence competencies.",
                        area_code=area_code, form=None
                    )
                db.add(q)
        
        # Add questions for SCQ, GWBS, EI templates
        add_questions_for_template(t1_scq, 48, "SCQ")
        add_questions_for_template(t1_gwbs, 55, "GWBS")
        add_questions_for_template(t1_ei, 50, "EI")
        add_questions_for_template(t2_scq, 48, "SCQ")
        add_questions_for_template(t2_ei, 50, "EI")
        add_questions_for_template(t3_gwbs, 55, "GWBS")
        add_questions_for_template(t4_scq, 48, "SCQ")
        add_questions_for_template(t4_gwbs, 55, "GWBS")
        
        # Add TABBPS questions (Form A and Form B)
        # Form A questions (17)
        for i in range(1, 18):
            q = QuizQuestion(
                id=str(uuid.uuid4()), quiz_template_id=t1_tab.id, option_set_id=opt_set.id,
                question_no=i, question_text=f"TABBPS Form A question {i}",
                area_code=get_tabbps_factor("A", i), form="A"
            )
            db.add(q)
        # Form B questions (16)
        for i in range(1, 17):
            q = QuizQuestion(
                id=str(uuid.uuid4()), quiz_template_id=t1_tab.id, option_set_id=opt_set.id,
                question_no=i, question_text=f"TABBPS Form B question {i}",
                area_code=get_tabbps_factor("B", i), form="B"
            )
            db.add(q)
            
        db.flush()
        
        print("Seeding Students...")
        students = []
        
        # Seed Sarthak (existing)
        sarthak = Student(
            id="836c7181-b68c-44ab-b1d4-51ca908da00f",
            enrollment_no="DE2301234",
            name="Sarthak Hardiya",
            email="sarthakhardiya8@gmail.com",
            phone="8328282718",
            gender="male",
            course="MTECH IT",
            semester=6,
            session="25-26",
            password_hash=hash_password("password123")
        )
        db.add(sarthak)
        students.append(sarthak)
        
        # Generate 70 more mock students to reach > 68 attendees for mockups
        names = ["Siddharth", "Aisha", "Aditya", "Riya", "Karan", "Sneha", "Varun", "Ananya", "Rohan", "Tanvi", "Rahul", "Nisha", "Vikram", "Prisha", "Arjun", "Aditi", "Amit", "Shruti", "Raj", "Pooja"]
        surnames = ["Sharma", "Verma", "Gupta", "Joshi", "Mehta", "Patel", "Singh", "Nair", "Iyer", "Rao", "Mishra", "Pandey", "Trivedi", "Deshmukh", "Choudhary"]
        courses = ["MTECH IT", "MCA", "MBA", "MSC CS", "BTECH IT"]
        
        for i in range(1, 75):
            name = f"{random.choice(names)} {random.choice(surnames)}"
            email = f"student{i}@iips.edu"
            en_no = f"DE230{1000 + i}"
            stud = Student(
                id=str(uuid.uuid4()),
                enrollment_no=en_no,
                name=name,
                email=email,
                phone=f"98765432{i:02d}",
                gender=random.choice(["male", "female"]),
                course=random.choice(courses),
                semester=random.choice([2, 4, 6, 8]),
                session="25-26",
                password_hash=hash_password("password123")
            )
            db.add(stud)
            students.append(stud)
        db.flush()
        
        print("Seeding RSVPs...")
        # 68 students RSVP to Event 1 (Stress Management Workshop)
        for s in students[:68]:
            rsvp = EventRSVP(
                id=str(uuid.uuid4()),
                event_id=e1.id,
                student_id=s.id
            )
            db.add(rsvp)
            
        # 50 students RSVP to Event 2 (Emotional Intelligence Seminar)
        for s in students[10:60]:
            rsvp = EventRSVP(
                id=str(uuid.uuid4()),
                event_id=e2.id,
                student_id=s.id
            )
            db.add(rsvp)
            
        # 45 students RSVP to Event 3 (Time Management)
        for s in students[15:60]:
            rsvp = EventRSVP(
                id=str(uuid.uuid4()),
                event_id=e3.id,
                student_id=s.id
            )
            db.add(rsvp)

        # 38 students RSVP to Event 4 (Anxiety Workshop)
        for s in students[20:58]:
            rsvp = EventRSVP(
                id=str(uuid.uuid4()),
                event_id=e4.id,
                student_id=s.id
            )
            db.add(rsvp)
        db.flush()
        
        print("Seeding Quiz Attempts and responses...")
        # Let's populate some quiz attempts for Event 1 (Stress Management Workshop)
        # We need completed attempts to make statistics look real.
        # Let's make 45 students submit GWBS, and 40 students submit SCQ.
        
        # GWBS attempts
        for s in students[:45]:
            # Generate answers dict {question_no: score}
            # GWBS has 55 questions, values 1-5
            answers = {}
            for q_no in range(1, 56):
                answers[q_no] = random.choice([3, 4, 5]) if q_no % 3 != 0 else random.choice([1, 2, 3])
            
            result = compute_quiz_result(
                quiz_type="GWBS",
                answers=answers,
                gender=s.gender
            )
            
            attempt = QuizAttempt(
                id=str(uuid.uuid4()),
                quiz_template_id=t1_gwbs.id,
                student_id=s.id,
                status="submitted",
                attempted_at=datetime.now(),
                total_score=result["total_score"],
                overall_remark=result["interpretation"],
                result_json=result
            )
            db.add(attempt)
            
        # SCQ attempts
        for s in students[10:50]:
            answers = {}
            for q_no in range(1, 49):
                answers[q_no] = random.choice([3, 4, 5]) if q_no % 4 != 0 else random.choice([1, 2])
            
            result = compute_quiz_result(
                quiz_type="SCQ",
                answers=answers,
                gender=s.gender
            )
            
            attempt = QuizAttempt(
                id=str(uuid.uuid4()),
                quiz_template_id=t1_scq.id,
                student_id=s.id,
                status="submitted",
                attempted_at=datetime.now(),
                total_score=result["total_score"],
                overall_remark=result["interpretation"],
                result_json=result
            )
            db.add(attempt)
            
        # EI attempts for Event 2
        for s in students[10:35]:
            answers = {}
            for q_no in range(1, 51):
                answers[q_no] = random.choice([3, 4, 5])
                
            result = compute_quiz_result(
                quiz_type="EI",
                answers=answers,
                gender=s.gender
            )
            
            attempt = QuizAttempt(
                id=str(uuid.uuid4()),
                quiz_template_id=t2_ei.id,
                student_id=s.id,
                status="submitted",
                attempted_at=datetime.now(),
                total_score=None,
                overall_remark="Assessment completed",
                result_json=result
            )
            db.add(attempt)

        db.commit()
        print("Database seeded successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
"""