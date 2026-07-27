"""
backend/update_questions_db.py

Script to replace mock questions and option sets in the database with real questions from quiz_content.py
without modifying students, events, RSVPs, or quiz attempt results.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
from models.quiz import QuizTemplate, QuizQuestion, OptionSet, QuizOption, QuizResponse
from services.quiz_service import populate_quiz_questions
from sqlalchemy import text

def update_db_questions():
    db = SessionLocal()
    try:
        print("Starting in-place update of quiz questions and option sets...")

        # 1. Fetch all quiz templates
        templates = db.query(QuizTemplate).all()
        print(f"Found {len(templates)} quiz templates.")

        # 2. Clear old responses and old questions to maintain foreign key integrity
        print("Clearing old mock responses and mock questions...")
        db.execute(text("DELETE FROM quiz_responses"))
        db.execute(text("DELETE FROM quiz_questions"))
        db.execute(text("DELETE FROM quiz_options"))
        db.execute(text("DELETE FROM option_sets"))
        db.commit()

        # 3. Populate real questions for each template
        print("Populating real questions and option sets for all templates...")
        for template in templates:
            print(f"Processing template: {template.title} ({template.quiz_type}) - ID: {template.id}")
            populate_quiz_questions(db, template)

        db.commit()
        print("Real questions and option sets populated successfully!")

        # 4. Verify question count
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
