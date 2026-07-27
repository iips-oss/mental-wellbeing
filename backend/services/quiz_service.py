import uuid
from sqlalchemy.orm import Session
from models.quiz import OptionSet, QuizOption, QuizQuestion, QuizTemplate
from data.quiz_content import (
    SCQ_QUESTIONS, SCQ_OPTIONS,
    GWBS_QUESTIONS, GWBS_OPTIONS,
    TABBPS_FORM_A_QUESTIONS, TABBPS_FORM_B_QUESTIONS, TABBPS_OPTIONS,
    EI_QUESTIONS, EI_OPTIONS
)
from services.quiz_scoring import (
    SCQ_DIMENSIONS, GWBS_DIMENSIONS,
    TABBPS_FORM_A_FACTORS, TABBPS_FORM_B_FACTORS,
    EI_COMPETENCIES
)

def get_scq_dim(q_no: int) -> str:
    for dim, questions in SCQ_DIMENSIONS.items():
        if q_no in questions:
            return dim
    return "Unknown"

def get_gwbs_dim(q_no: int) -> str:
    for dim, groups in GWBS_DIMENSIONS.items():
        if q_no in groups["positive"] or q_no in groups["negative"]:
            return dim
    return "Unknown"

def get_tabbps_factor(form: str, q_no: int) -> str:
    factors = TABBPS_FORM_A_FACTORS if form == "A" else TABBPS_FORM_B_FACTORS
    for factor, questions in factors.items():
        if q_no in questions:
            return factor
    return "Unknown"

def get_ei_comp(q_no: int) -> str:
    for comp, questions in EI_COMPETENCIES.items():
        if q_no in questions:
            return comp
    return "Unknown"

def get_or_create_option_set(db: Session, label: str, description: str, options_tuples: list) -> OptionSet:
    """
    options_tuples: list of (option_text, score_value, display_order)
    """
    opt_set = db.query(OptionSet).filter(OptionSet.label == label).first()
    if not opt_set:
        opt_set = OptionSet(
            id=str(uuid.uuid4()),
            label=label,
            description=description
        )
        db.add(opt_set)
        db.flush()

        for text_val, score, order in options_tuples:
            opt = QuizOption(
                id=str(uuid.uuid4()),
                option_set_id=opt_set.id,
                option_text=text_val,
                score_value=score,
                display_order=order
            )
            db.add(opt)
        db.flush()
    return opt_set

def get_or_create_gwbs_option_set(db: Session) -> OptionSet:
    options_tuples = [(opt_text, idx + 1, idx + 1) for idx, opt_text in enumerate(GWBS_OPTIONS)]
    return get_or_create_option_set(db, "gwbs_likert_5", "GWBS 5-point scale (Strongly Disagree=1 to Strongly Agree=5)", options_tuples)

def get_or_create_tabbps_option_set(db: Session) -> OptionSet:
    # TABBPS: Strongly Agree=5, Agree=4, Uncertain=3, Disagree=2, Strongly Disagree=1
    scores = [5, 4, 3, 2, 1]
    options_tuples = [(opt_text, scores[idx], idx + 1) for idx, opt_text in enumerate(TABBPS_OPTIONS)]
    return get_or_create_option_set(db, "tabbps_likert_5", "TABBPS 5-point scale (Strongly Agree=5 to Strongly Disagree=1)", options_tuples)

def get_or_create_ei_option_set(db: Session) -> OptionSet:
    options_tuples = [(opt_text, idx + 1, idx + 1) for idx, opt_text in enumerate(EI_OPTIONS)]
    return get_or_create_option_set(db, "ei_likert_5", "EI 5-point scale (Does not apply=1 to Always applies=5)", options_tuples)

def get_or_create_scq_option_set(db: Session, q_no: int) -> OptionSet:
    options_list = SCQ_OPTIONS[q_no - 1]
    scores = [5, 4, 3, 2, 1]
    options_tuples = [(opt_text, scores[idx], idx + 1) for idx, opt_text in enumerate(options_list)]
    return get_or_create_option_set(db, f"scq_options_q{q_no}", f"SCQ question {q_no} unique 5-point scale", options_tuples)

def populate_quiz_questions(db: Session, template: QuizTemplate):
    """
    Populates real questions and option sets for a given QuizTemplate based on its quiz_type.
    """
    quiz_type = template.quiz_type.upper()

    if quiz_type == "SCQ":
        for i in range(1, len(SCQ_QUESTIONS) + 1):
            area_code = get_scq_dim(i)
            opt_set = get_or_create_scq_option_set(db, i)
            q = QuizQuestion(
                id=str(uuid.uuid4()),
                quiz_template_id=template.id,
                option_set_id=opt_set.id,
                question_no=i,
                question_text=SCQ_QUESTIONS[i - 1],
                area_code=area_code,
                form=None
            )
            db.add(q)

    elif quiz_type == "GWBS":
        opt_set = get_or_create_gwbs_option_set(db)
        for i in range(1, len(GWBS_QUESTIONS) + 1):
            area_code = get_gwbs_dim(i)
            q = QuizQuestion(
                id=str(uuid.uuid4()),
                quiz_template_id=template.id,
                option_set_id=opt_set.id,
                question_no=i,
                question_text=GWBS_QUESTIONS[i - 1],
                area_code=area_code,
                form=None
            )
            db.add(q)

    elif quiz_type == "TABBPS":
        opt_set = get_or_create_tabbps_option_set(db)
        # Form A questions (17)
        for i in range(1, len(TABBPS_FORM_A_QUESTIONS) + 1):
            q = QuizQuestion(
                id=str(uuid.uuid4()),
                quiz_template_id=template.id,
                option_set_id=opt_set.id,
                question_no=i,
                question_text=TABBPS_FORM_A_QUESTIONS[i - 1],
                area_code=get_tabbps_factor("A", i),
                form="A"
            )
            db.add(q)
        # Form B questions (16)
        for i in range(1, len(TABBPS_FORM_B_QUESTIONS) + 1):
            q = QuizQuestion(
                id=str(uuid.uuid4()),
                quiz_template_id=template.id,
                option_set_id=opt_set.id,
                question_no=i,
                question_text=TABBPS_FORM_B_QUESTIONS[i - 1],
                area_code=get_tabbps_factor("B", i),
                form="B"
            )
            db.add(q)

    elif quiz_type == "EI":
        opt_set = get_or_create_ei_option_set(db)
        for i in range(1, len(EI_QUESTIONS) + 1):
            area_code = get_ei_comp(i)
            q = QuizQuestion(
                id=str(uuid.uuid4()),
                quiz_template_id=template.id,
                option_set_id=opt_set.id,
                question_no=i,
                question_text=EI_QUESTIONS[i - 1],
                area_code=area_code,
                form=None
            )
            db.add(q)
