import sys
import os
import uuid
from datetime import datetime
from sqlalchemy.orm import Session

# Add the directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, SessionLocal
from models.student import Student
from models.event import Event, EventRSVP
from models.quiz import QuizTemplate, QuizAttempt
from services.auth import hash_password

def seed_mock_results():
    db: Session = SessionLocal()
    try:
        # Find the "Stress Management Workshop" event
        event = db.query(Event).filter(Event.title == "Stress Management Workshop").first()
        if not event:
            print("Stress Management Workshop event not found!")
            return
            
        # Find the SCQ and GWBS templates for this event
        scq_temp = db.query(QuizTemplate).filter(QuizTemplate.event_id == event.id, QuizTemplate.quiz_type == "SCQ").first()
        gwbs_temp = db.query(QuizTemplate).filter(QuizTemplate.event_id == event.id, QuizTemplate.quiz_type == "GWBS").first()
        
        if not scq_temp or not gwbs_temp:
            print("Templates not found!")
            return

        # Delete any existing attempts for these templates to clear space for the exact mock results
        db.query(QuizAttempt).filter(QuizAttempt.quiz_template_id.in_([scq_temp.id, gwbs_temp.id])).delete()
        db.commit()

        # SCQ Mock Students data
        scq_students = [
            ("Raju Singh", "IT-2k21-86", 67, "Below Average"),
            ("Jay Shah", "IT-2k21-86", 125, "Average"),
            ("Amit Shah", "IT-2k21-86", 180, "Above Average"),
            ("Narendra Modi", "IT-2k21-86", 221, "High"),
            ("Mohan Yadav", "IT-2k21-86", 100, "Average"),
            ("Yogi Adityanath", "IT-2k21-86", 40, "Low"),
            ("Rahul Gandhi", "IT-2k21-86", 213, "High")
        ]

        # GWBS Mock Students data
        gwbs_students = [
            ("Mamta Banerjee", "IT-2k21-86", 169, "Low"),
            ("Smriti Irani", "IT-2k21-86", 208, "Average"),
            ("Indira Gandhi", "IT-2k21-86", 257, "High"),
            ("Droupadi Murmu", "IT-2k21-86", 261, "High"),
            ("Shivraj S. Chouhan", "IT-2k21-86", 169, "Average"),
            ("Nirmala Sitharaman", "IT-2k21-86", 150, "Low"),
            ("Nitin Gadkari", "IT-2k21-86", 267, "High")
        ]

        def insert_mock_attempts(student_list, template):
            for name, roll, score, interpretation in student_list:
                # Find if student already exists or create new
                email = f"{name.lower().replace(' ', '').replace('.', '')}@iips.edu"
                student = db.query(Student).filter(Student.email == email).first()
                
                if not student:
                    student = Student(
                        id=str(uuid.uuid4()),
                        enrollment_no=f"EN-{str(uuid.uuid4())[:8]}",
                        roll_number=roll,
                        name=name,
                        email=email,
                        phone="9876543210",
                        gender="male" if "Yogi" in name or "Modi" in name or "Shah" in name or "Singh" in name or "Yadav" in name or "Gandhi" in name or "Chouhan" in name or "Gadkari" in name else "female",
                        course="MTECH IT",
                        semester=6,
                        session="25-26",
                        password_hash=hash_password("password123")
                    )
                    db.add(student)
                    db.flush()
                else:
                    student.roll_number = roll
                    db.flush()

                # Add RSVP if not exists
                rsvp = db.query(EventRSVP).filter(EventRSVP.event_id == event.id, EventRSVP.student_id == student.id).first()
                if not rsvp:
                    rsvp = EventRSVP(
                        id=str(uuid.uuid4()),
                        event_id=event.id,
                        student_id=student.id
                    )
                    db.add(rsvp)
                    db.flush()

                # Insert attempt
                attempt = QuizAttempt(
                    id=str(uuid.uuid4()),
                    quiz_template_id=template.id,
                    student_id=student.id,
                    status="submitted",
                    attempted_at=datetime.now(),
                    total_score=score,
                    overall_remark=interpretation,
                    result_json={
                        "quiz_type": template.quiz_type,
                        "total_score": score,
                        "interpretation": interpretation,
                        "dimension_scores": {
                            "A_Physical": score // 4,
                            "B_Emotional": score // 4,
                            "C_Social": score // 4,
                            "D_School": score - (score // 4) * 3
                        }
                    }
                )
                db.add(attempt)
            db.commit()

        print("Seeding SCQ mock results...")
        insert_mock_attempts(scq_students, scq_temp)

        print("Seeding GWBS mock results...")
        insert_mock_attempts(gwbs_students, gwbs_temp)

        print("Mock results seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding mock results: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_mock_results()

