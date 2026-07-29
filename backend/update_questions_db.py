"""
backend/update_questions_db.py

Script to replace mock questions and option sets in the database with real
questions from quiz_content.py, without modifying students, events, RSVPs,
or quiz attempt results.

Seeds each quiz_type (SCQ, GWBS, TABBPS, EI) exactly once — question banks
are shared across all events, not duplicated per event/template.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
from models.quiz import QuizQuestion, OptionSet
from services.quiz_service import populate_quiz_questions
from sqlalchemy import text

def update_db_questions():
    db = SessionLocal()
    try:
        print("Starting in-place update of quiz questions and option sets...")

        print("Clearing old mock responses and mock questions...")
        db.execute(text("DELETE FROM quiz_responses"))
        db.execute(text("DELETE FROM quiz_questions"))
        db.execute(text("DELETE FROM quiz_options"))
        db.execute(text("DELETE FROM option_sets"))
        db.commit()

        quiz_types = ["SCQ", "GWBS", "TABBPS", "EI"]
        print(f"Populating real questions and option sets for {len(quiz_types)} quiz types...")
        for quiz_type in quiz_types:
            print(f"Processing quiz type: {quiz_type}")
            populate_quiz_questions(db, quiz_type)

        db.commit()
        print("Real questions and option sets populated successfully!")

        q_count = db.query(QuizQuestion).count()
        opt_count = db.query(OptionSet).count()
        print(f"Verification: DB now has {q_count} questions across {opt_count} option sets.")

    except Exception as e:
        db.rollback()
        print(f"Error updating questions: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    update_db_questions()