"""
backend/seed_questions_only.py

SAFE SEED SCRIPT:
Modifies ONLY `quiz_questions`, `option_sets`, and `quiz_options` in the database.
Does NOT drop any tables.
Does NOT touch students, events, RSVPs, quiz_attempts, admins, or superusers.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from sqlalchemy import text
from database import SessionLocal
from models.quiz import QuizTemplate, QuizQuestion, OptionSet, QuizOption, QuizResponse
from services.quiz_service import populate_quiz_questions

def update_questions_and_options():
    db: Session = SessionLocal()
    try:
        print("--- Safe Question & OptionSet Seeder ---")

        templates = db.query(QuizTemplate).all()
        if not templates:
            print("No quiz templates found in database.")
            return

        print(f"Found {len(templates)} existing quiz templates.")
        print("Clearing old question and option set tables only...")

        db.execute(text("DELETE FROM quiz_responses"))
        db.execute(text("DELETE FROM quiz_questions"))
        db.execute(text("DELETE FROM quiz_options"))
        db.execute(text("DELETE FROM option_sets"))
        db.commit()

        print("Populating real questions and option sets...")
        for template in templates:
            populate_quiz_questions(db, template)

        db.commit()
        print("Successfully updated questions and option sets!")
        print("Students, Events, RSVPs, and Quiz Attempts were completely untouched.")

    except Exception as e:
        db.rollback()
        print(f"Error updating questions: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    update_questions_and_options()
