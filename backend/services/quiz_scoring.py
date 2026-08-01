from typing import Dict, Any


# ─────────────────────────────────────────────
# QUIZ 1: Self Concept Questionnaire (SCQ-S)
# 48 questions, 6 dimensions, score 1-5 each
# All items positive direction — no reversal needed
# ─────────────────────────────────────────────

SCQ_DIMENSIONS = {
    "A_Physical":      [2, 3, 9, 20, 22, 27, 29, 31],
    "B_Social":        [1, 8, 21, 37, 40, 43, 46, 48],
    "C_Temperamental": [4, 10, 14, 16, 19, 23, 24, 28],
    "D_Educational":   [5, 13, 15, 17, 25, 26, 30, 32],
    "E_Moral":         [6, 34, 35, 41, 42, 44, 45, 47],
    "F_Intellectual":  [7, 11, 12, 18, 33, 36, 38, 39],
}

def score_SCQ(answers: Dict[int, int]) -> Dict[str, Any]:
    dimension_scores = {}
    for dim, questions in SCQ_DIMENSIONS.items():
        dimension_scores[dim] = sum(answers.get(q, 0) for q in questions)

    total = sum(dimension_scores.values())

    if total >= 193:
        interpretation = "High Self Concept"
    elif total >= 145:
        interpretation = "Above Average"
    elif total >= 97:
        interpretation = "Average"
    elif total >= 49:
        interpretation = "Below Average"
    else:
        interpretation = "Low Self Concept"

    return {
        "quiz_type": "SCQ",
        "total_score": total,
        "interpretation": interpretation,
        "dimension_scores": dimension_scores,
        "max_possible": 240,
    }


# ─────────────────────────────────────────────
# QUIZ 2: General Well-Being Scale (GWBS-KADA)
# 55 questions, 4 dimensions
# Negative items are reverse-scored (6 - score)
# Gender-based interpretation thresholds
# ─────────────────────────────────────────────

GWBS_DIMENSIONS = {
    "A_Physical": {
        "positive": [1, 2, 3, 4, 5, 6, 10, 11],
        "negative": [7, 8, 9],
    },
    "B_Emotional": {
        "positive": [22, 23, 24, 25],
        "negative": [12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    },
    "C_Social": {
        "positive": [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 42],
        "negative": [38, 39, 40, 41],
    },
    "D_School": {
        "positive": [51, 52, 53, 54, 55],
        "negative": [43, 44, 45, 46, 47, 48, 49, 50],
    },
}

def score_GWBS(answers: Dict[int, int], gender: str = "male") -> Dict[str, Any]:
    dimension_scores = {}
    for dim, groups in GWBS_DIMENSIONS.items():
        pos = sum(answers.get(q, 0) for q in groups["positive"])
        neg = sum(6 - answers.get(q, 6) for q in groups["negative"])
        dimension_scores[dim] = pos + neg

    total = sum(dimension_scores.values())

    if gender.lower() == "female":
        if total >= 226:
            interpretation = "High General Well-Being"
        elif total >= 177:
            interpretation = "Average General Well-Being"
        else:
            interpretation = "Low General Well-Being"
    else:  # male 
        if total >= 231:
            interpretation = "High General Well-Being"
        elif total >= 168:
            interpretation = "Average General Well-Being"
        else:
            interpretation = "Low General Well-Being"

    return {
        "quiz_type": "GWBS",
        "total_score": total,
        "interpretation": interpretation,
        "dimension_scores": dimension_scores,
        "max_possible": 275,
    }


# ─────────────────────────────────────────────
# QUIZ 3: Type A/B Behavioural Pattern (TABBPS-DJ)
#
# Form A: 17 items numbered 1-17, 6 factors (I-VI)
# Form B: 16 items numbered 1-16, 5 factors (I-V)
#
# Both forms have "factors" which are like dimension scores, same reasoning as SCQ dimension scores.
# Factors have no names — identified by roman numerals.
#
# answers = {
#     "A": {1: score, 2: score, ...},   17 items
#     "B": {1: score, 2: score, ...}    16 items
# }
#
# ─────────────────────────────────────────────

TABBPS_FORM_A_FACTORS = {
    "I":   [8, 10, 13, 15],
    "II":  [2, 6],
    "III": [4, 7, 17],
    "IV":  [3, 9, 16],
    "V":   [1, 11, 14],
    "VI":  [5, 12],
}

TABBPS_FORM_B_FACTORS = {
    "I":   [5, 14, 15, 16],
    "II":  [4, 7, 12],
    "III": [2, 10, 13],
    "IV":  [1, 3, 8],
    "V":   [6, 9, 11],
}

def score_TABBPS(answers: Dict[str, Dict[int, int]]) -> Dict[str, Any]:
    form_a_answers = answers.get("A", {})
    form_b_answers = answers.get("B", {})

    # factor scores per form
    form_a_factors = {
        factor: sum(form_a_answers.get(q, 0) for q in questions)
        for factor, questions in TABBPS_FORM_A_FACTORS.items()
    }
    form_b_factors = {
        factor: sum(form_b_answers.get(q, 0) for q in questions)
        for factor, questions in TABBPS_FORM_B_FACTORS.items()
    }

    # form totals are sum of their factor scores
    form_a_score = sum(form_a_factors.values())
    form_b_score = sum(form_b_factors.values())

    def interpret_a(score):
        if score >= 61:
            return "High Type A"
        elif score >= 46:
            return "Average/Normal"
        return "Low Type A"

    def interpret_b(score):
        if score >= 59:
            return "High Type B"
        elif score >= 46:
            return "Average/Normal"
        return "Low Type B"

    a_interp = interpret_a(form_a_score)
    b_interp = interpret_b(form_b_score)

    high_a = True if (a_interp == "High Type A") else False
    high_b = True if (b_interp == "High Type B") else False
    avg_a  = True if (a_interp == "Average/Normal") else False
    avg_b  = True if (b_interp == "Average/Normal") else False
    low_a  = True if (a_interp == "Low Type A") else False
    low_b  = True if (b_interp == "Low Type B") else False

    if high_a and (avg_b or low_b):
        final = "Type A Personality"
    elif high_b and (avg_a or low_a):
        final = "Type B Personality"
    elif high_a and high_b:
        final = "Type A Personality" if form_a_score >= form_b_score else "Type B Personality"
    elif avg_a and avg_b:
        final = "Mixed/Balanced Personality"
    elif low_a and low_b:
        final = "No Strong Pattern"
    else:
        final = "Inconclusive"

    return {
        "quiz_type": "TABBPS",
        "total_score": None,           # no meaningful single total for TABBPS
        "form_a_score": form_a_score,
        "form_b_score": form_b_score,
        "form_a_interpretation": a_interp,
        "form_b_interpretation": b_interp,
        "final_classification": final,
        "form_a_factor_scores": form_a_factors,   
        "form_b_factor_scores": form_b_factors,   
    }


# ─────────────────────────────────────────────
# QUIZ 4: Emotional Intelligence (EI-LAL)
# 50 questions, 5 competencies, scored individually
# No single overall classification — each competency is interpreted independently
# ─────────────────────────────────────────────

EI_COMPETENCIES = {
    "Self_Awareness":     [1, 6, 11, 16, 21, 26, 31, 36, 41, 46],
    "Managing_Emotions":  [2, 7, 12, 17, 22, 27, 32, 37, 42, 47],
    "Motivating_Oneself": [3, 8, 13, 18, 23, 28, 33, 38, 43, 48],
    "Empathy":            [4, 9, 14, 19, 24, 29, 34, 39, 44, 49],
    "Social_Skill":       [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
}

def score_EI(answers: Dict[int, int]) -> Dict[str, Any]:
    competency_scores = {}
    competency_interpretations = {}

    for comp, questions in EI_COMPETENCIES.items():
        score = sum(answers.get(q, 0) for q in questions)
        competency_scores[comp] = score

        if score >= 35:
            interp = "Strength"
        elif score >= 18:
            interp = "Above Average"
        else:
            interp = "Average"
        competency_interpretations[comp] = interp

    strengths = sum(1 for v in competency_interpretations.values() if v == "Strength")
    if strengths >= 4:
        overall_interpretation = "High Emotional Intelligence"
    elif strengths >= 2:
        overall_interpretation = "Above Average EI"
    elif strengths >= 1:
        overall_interpretation = "Average EI"
    else:
        overall_interpretation = "Developing EI"

    total = sum(competency_scores.values())

    return {
        "quiz_type": "EI",
        "total_score": total if total > 0 else None,
        "interpretation": overall_interpretation,
        "strengths_count": strengths,
        "competency_scores": competency_scores,
        "competency_interpretations": competency_interpretations,
        "max_possible": 250,
        "note": "EI is evaluated per competency as well as overall score",
    }


# ─────────────────────────────────────────────
# DISPATCHER
# Single entry point called from the API route.
#
# SCQ, GWBS, EI  → flat format: { question_number: score_given }
# TABBPS         → nested format: { "A": {1: score...}, "B": {1: score...} }
#
# gender is only used by GWBS, ignored by others.
# ─────────────────────────────────────────────

def compute_quiz_result(quiz_type: str, answers: dict, gender: str = "male") -> Dict[str, Any]:
    if quiz_type == "SCQ":
        return score_SCQ(answers)
    elif quiz_type == "GWBS":
        return score_GWBS(answers, gender)
    elif quiz_type == "TABBPS":
        # answers must be {"A": {1: score, ...}, "B": {1: score, ...}}
        return score_TABBPS(answers)
    elif quiz_type == "EI":
        return score_EI(answers)
    else:
        raise ValueError(f"Unknown quiz type: '{quiz_type}'. Must be one of: SCQ, GWBS, TABBPS, EI")