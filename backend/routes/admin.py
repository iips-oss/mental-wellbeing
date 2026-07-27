from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models.event import Event, EventReport
from models.quiz import QuizTemplate, QuizAttempt
from models.student import Student
from services.auth import require_role 
from schemas.event import EventOut, EventCreate, EventUpdate, EventCancelSchema
# from models.admin import Admin  # needed for admin dashboard route
from schemas.quiz import QuizTemplateOut,QuizTemplateCreate
from services.quiz_service import populate_quiz_questions

router = APIRouter(prefix="/admin", tags=["admin"])

from models.event import Event, EventReport, EventRSVP

@router.get("/events")
def get_admin_events(
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    events = db.query(Event).all()
    
    result = []
    for event in events:
        templates = db.query(QuizTemplate).filter(QuizTemplate.event_id == event.id).all()
        total_templates = len(templates)
        
        completed_templates = 0
        if total_templates > 0:
            template_ids = [t.id for t in templates]
            completed_templates = db.query(QuizAttempt.quiz_template_id).filter(
                QuizAttempt.quiz_template_id.in_(template_ids),
                QuizAttempt.status == "submitted"
            ).distinct().count()
            
        quizzes_count_str = f"{completed_templates}/{total_templates}"
        attendees_count = db.query(EventRSVP).filter(EventRSVP.event_id == event.id).count()
        
        # performance logic based on GWBS average
        event_gwbs_attempts = db.query(QuizAttempt.total_score).join(
            QuizTemplate, QuizAttempt.quiz_template_id == QuizTemplate.id
        ).filter(
            QuizTemplate.event_id == event.id,
            QuizTemplate.quiz_type == "GWBS",
            QuizAttempt.status == "submitted"
        ).all()
        
        perf_str = "N/A"
        if event_gwbs_attempts:
            e_scores = [a[0] for a in event_gwbs_attempts if a[0] is not None]
            if e_scores:
                e_avg = sum(e_scores) / len(e_scores)
                if e_avg >= 220:
                    perf_str = "High"
                elif e_avg >= 150:
                    perf_str = "Average"
                else:
                    perf_str = "Low"
                    
        result.append({
            "id": str(event.id),
            "title": event.title,
            "venue": event.venue,
            "event_date": event.event_date.isoformat(),
            "event_time": event.event_time.strftime("%H:%M") if hasattr(event.event_time, 'strftime') else str(event.event_time),
            "status": event.status,
            "description": event.description,
            "quizzes_count": quizzes_count_str,
            "attendees_count": attendees_count,
            "performance": perf_str
        })
    return result

@router.get("/dashboard")
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    # 1. Total events
    admin_events = db.query(Event).all()
    event_ids = [e.id for e in admin_events]
    total_events = len(admin_events)
    
    # 2. Total quizzes assigned to these events
    total_quizzes = 0
    if event_ids:
        total_quizzes = db.query(QuizTemplate).filter(QuizTemplate.event_id.in_(event_ids)).count()
        
    # 3. Total unique students registered (RSVP'd)
    total_students = 0
    if event_ids:
        total_students = db.query(EventRSVP.student_id).filter(EventRSVP.event_id.in_(event_ids)).distinct().count()
        
    # 4. Average GWBS well-being score
    avg_wellbeing_pct = 0.0
    if event_ids:
        gwbs_attempts = db.query(QuizAttempt.total_score).join(
            QuizTemplate, QuizAttempt.quiz_template_id == QuizTemplate.id
        ).filter(
            QuizTemplate.event_id.in_(event_ids),
            QuizTemplate.quiz_type == "GWBS",
            QuizAttempt.status == "submitted"
        ).all()
        
        if gwbs_attempts:
            scores = [a[0] for a in gwbs_attempts if a[0] is not None]
            if scores:
                avg_score = sum(scores) / len(scores)
                avg_wellbeing_pct = round((avg_score / 275.0) * 100, 1)
                
    # 5. Events summary for dashboard
    events_summary = []
    for event in admin_events:
        templates = db.query(QuizTemplate).filter(QuizTemplate.event_id == event.id).all()
        total_templates = len(templates)
        
        completed_templates = 0
        if total_templates > 0:
            template_ids = [t.id for t in templates]
            completed_templates = db.query(QuizAttempt.quiz_template_id).filter(
                QuizAttempt.quiz_template_id.in_(template_ids),
                QuizAttempt.status == "submitted"
            ).distinct().count()
            
        quizzes_count_str = f"{completed_templates}/{total_templates}"
        attendees_count = db.query(EventRSVP).filter(EventRSVP.event_id == event.id).count()
        
        event_gwbs_attempts = db.query(QuizAttempt.total_score).join(
            QuizTemplate, QuizAttempt.quiz_template_id == QuizTemplate.id
        ).filter(
            QuizTemplate.event_id == event.id,
            QuizTemplate.quiz_type == "GWBS",
            QuizAttempt.status == "submitted"
        ).all()
        
        perf_str = "N/A"
        if event_gwbs_attempts:
            e_scores = [a[0] for a in event_gwbs_attempts if a[0] is not None]
            if e_scores:
                e_avg = sum(e_scores) / len(e_scores)
                if e_avg >= 220:
                    perf_str = "High"
                elif e_avg >= 150:
                    perf_str = "Average"
                else:
                    perf_str = "Low"
                    
        events_summary.append({
            "id": str(event.id),
            "title": event.title,
            "quizzes_count": quizzes_count_str,
            "event_date": event.event_date.isoformat(),
            "event_time": event.event_time.strftime("%H:%M") if hasattr(event.event_time, 'strftime') else str(event.event_time),
            "attendees_count": attendees_count,
            "performance": perf_str,
            "status": event.status
        })
        
    return {
        "admin_name": current_user.name,
        "department": current_user.department,
        "stats": {
            "total_events": total_events,
            "total_quizzes": total_quizzes,
            "total_students": total_students,
            "avg_wellbeing": f"{avg_wellbeing_pct}%" if avg_wellbeing_pct > 0 else "N/A"
        },
        "events_summary": events_summary
    }



@router.post("/events")
def create_event(
    data: EventCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    
    admin_id = current_user.id

    new_event = Event(
        admin_id=current_user.id,
        title=data.title,
        venue=data.venue,
        event_date=data.event_date,
        event_time=data.event_time,
        status="scheduled",
        description=data.description
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    # assign quizzes to this event
    quiz_types = data.quiz_types   # e.g. ["SCQ", "GWBS"]
    sequences = data.sequences     # e.g. [1, 2]

    for i, quiz_type in enumerate(quiz_types):
        new_quiz = QuizTemplate(
            event_id=new_event.id,
            quiz_type=quiz_type,
            sequence_no=sequences[i] if i < len(sequences) else i + 1,
            title=f"{quiz_type} Assessment"
        )
        db.add(new_quiz)
        db.flush()
        populate_quiz_questions(db, new_quiz)

    db.commit()

    return {"message": "Event created successfully", "event_id": str(new_event.id)}


@router.patch("/events/{event_id}", response_model=EventOut)
def update_event(
    event_id: str,
    data: EventUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    # Any admin may edit any event — admin_id on Event records who created it,
    # it isn't an access-control boundary between admins.
    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # partial update — only update fields that were sent
    if data.title is not None:
       event.title = data.title
    if data.venue is not None:
       event.venue = data.venue
    if data.event_date is not None:
       event.event_date = data.event_date
    if data.event_time is not None:
       event.event_time = data.event_time
    if data.description is not None:
       event.description = data.description
    if data.status is not None:
       event.status = data.status

    db.commit()
    db.refresh(event)

    return event


@router.patch("/events/{event_id}/complete")
def complete_event(
    event_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event.status = "completed"
    db.commit()
    db.refresh(event)

    return {"message": "Event marked as completed successfully"}


@router.patch("/events/{event_id}/cancel")
def cancel_event(
    event_id: str,
    data: EventCancelSchema,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if event.status == "cancelled":
        raise HTTPException(status_code=400, detail="Event is already cancelled")

    event.status = "cancelled"
    event.cancelled_at = datetime.now()
    event.cancellation_reason = data.cancellation_reason

    db.commit()
    db.refresh(event)

    return {"message": "Event cancelled successfully"}


@router.post("/events/{event_id}/report")
async def upload_report(
    event_id: str,
    report_content: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    # CHECK 1: event exists
    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # CHECK 2: event should not be cancelled
    if event.status == "cancelled":
        raise HTTPException(status_code=400, detail="Cannot upload report for cancelled event")

    # save file to local storage
    safe_filename = os.path.basename(file.filename).replace(" ", "_")
    file_location = f"reports/{event_id}_{safe_filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # create EventReport row
    new_report = EventReport(
        event_id=event_id,
        report_content=report_content,
        file_url=file_location,
        uploaded_at=datetime.now()
    )
    db.add(new_report)
    db.commit()

    return {"message": "Report uploaded successfully"}


@router.get("/events/{event_id}/quizzes", response_model=list[QuizTemplateOut])
def get_event_quizzes(
    event_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    # CHECK: event exists
    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    quizzes = db.query(QuizTemplate)\
        .filter(QuizTemplate.event_id == event_id)\
        .order_by(QuizTemplate.sequence_no)\
        .all()

    return quizzes


@router.get("/quiz-templates")
def get_all_quiz_templates(
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    results = db.query(QuizTemplate, Event)\
        .join(Event, QuizTemplate.event_id == Event.id)\
        .order_by(Event.event_date.desc())\
        .all()

    return [
        {
            "quizTemplateId": str(quiz.id),
            "quiz_type": quiz.quiz_type,
            "title": quiz.title,
            "eventId": str(event.id),
            "eventTitle": event.title,
            "eventDate": event.event_date.isoformat(),
            "eventTime": event.event_time.strftime("%H:%M") if hasattr(event.event_time, 'strftime') else str(event.event_time),
            "eventStatus": event.status
        }
        for quiz, event in results
    ]


@router.post("/events/{event_id}/quizzes")
def add_quiz_to_event(
    event_id: str,
    data: QuizTemplateCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    # CHECK: event exists
    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # CHECK: quiz type already assigned to this event?
    existing = db.query(QuizTemplate).filter(
        QuizTemplate.event_id == event_id,
        QuizTemplate.quiz_type == data.quiz_type
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="This quiz type already assigned to this event")

    new_quiz = QuizTemplate(
        event_id=event_id,
        quiz_type=data.quiz_type,
        sequence_no=data.sequence_no,
        title=data.title
    )
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    return {"message": "Quiz assigned successfully"}



@router.get("/events/{event_id}/results/scq")
def get_scq_results(
    event_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    results = db.query(QuizAttempt, Student, QuizTemplate).join(
        QuizTemplate, QuizAttempt.quiz_template_id == QuizTemplate.id
    ).join(
        Student, QuizAttempt.student_id == Student.id
    ).filter(
        QuizTemplate.event_id == event_id,
        QuizTemplate.quiz_type == "SCQ",
        QuizAttempt.status == "submitted"
    ).all()

    return {
        "event_title": event.title,
        "event_date": event.event_date,
        "quiz_type": "SCQ",
        "results": [
            {
                "student_name": student.name,
                "enrollment_no": student.enrollment_no,
                "total_score": attempt.total_score,
                "interpretation": attempt.result_json.get("interpretation"),
                "dimension_scores": attempt.result_json.get("dimension_scores")
            }
            for attempt, student, quiz_template in results
        ]
    }


@router.get("/events/{event_id}/results/gwbs")
def get_gwbs_results(
    event_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    results = db.query(QuizAttempt, Student, QuizTemplate).join(
        QuizTemplate, QuizAttempt.quiz_template_id == QuizTemplate.id
    ).join(
        Student, QuizAttempt.student_id == Student.id
    ).filter(
        QuizTemplate.event_id == event_id,
        QuizTemplate.quiz_type == "GWBS",
        QuizAttempt.status == "submitted"
    ).all()

    return {
        "event_title": event.title,
        "event_date": event.event_date,
        "quiz_type": "GWBS",
        "results": [
            {
                "student_name": student.name,
                "enrollment_no": student.enrollment_no,
                "total_score": attempt.total_score,
                "interpretation": attempt.result_json.get("interpretation"),
                "dimension_scores": attempt.result_json.get("dimension_scores")
            }
            for attempt, student, quiz_template in results
        ]
    }


@router.get("/events/{event_id}/results/tabbps")
def get_tabbps_results(
    event_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    results = db.query(QuizAttempt, Student, QuizTemplate).join(
        QuizTemplate, QuizAttempt.quiz_template_id == QuizTemplate.id
    ).join(
        Student, QuizAttempt.student_id == Student.id
    ).filter(
        QuizTemplate.event_id == event_id,
        QuizTemplate.quiz_type == "TABBPS",
        QuizAttempt.status == "submitted"
    ).all()

    return {
        "event_title": event.title,
        "event_date": event.event_date,
        "quiz_type": "TABBPS",
        "results": [
            {
                "student_name": student.name,
                "enrollment_no": student.enrollment_no,
                "final_classification": attempt.result_json.get("final_classification"),
                "form_a_score": attempt.result_json.get("form_a_score"),
                "form_a_interpretation": attempt.result_json.get("form_a_interpretation"),
                "form_b_score": attempt.result_json.get("form_b_score"),
                "form_b_interpretation": attempt.result_json.get("form_b_interpretation"),
                "form_a_factor_scores": attempt.result_json.get("form_a_factor_scores"),
                "form_b_factor_scores": attempt.result_json.get("form_b_factor_scores")
            }
            for attempt, student, quiz_template in results
        ]
    }


@router.get("/events/{event_id}/results/ei")
def get_ei_results(
    event_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    results = db.query(QuizAttempt, Student, QuizTemplate).join(
        QuizTemplate, QuizAttempt.quiz_template_id == QuizTemplate.id
    ).join(
        Student, QuizAttempt.student_id == Student.id
    ).filter(
        QuizTemplate.event_id == event_id,
        QuizTemplate.quiz_type == "EI",
        QuizAttempt.status == "submitted"
    ).all()

    return {
    "event_title": event.title,
    "event_date": event.event_date,
    "quiz_type": "EI",
    "results": [
        {
            "student_name": student.name,
            "enrollment_no": student.enrollment_no,
            "Self_Awareness": {
                "score": attempt.result_json.get("competency_scores", {}).get("Self_Awareness"),
                "interpretation": attempt.result_json.get("competency_interpretations", {}).get("Self_Awareness")
            },
            "Managing_Emotions": {
                "score": attempt.result_json.get("competency_scores", {}).get("Managing_Emotions"),
                "interpretation": attempt.result_json.get("competency_interpretations", {}).get("Managing_Emotions")
            },
            "Motivating_Oneself": {
                "score": attempt.result_json.get("competency_scores", {}).get("Motivating_Oneself"),
                "interpretation": attempt.result_json.get("competency_interpretations", {}).get("Motivating_Oneself")
            },
            "Empathy": {
                "score": attempt.result_json.get("competency_scores", {}).get("Empathy"),
                "interpretation": attempt.result_json.get("competency_interpretations", {}).get("Empathy")
            },
            "Social_Skill": {
                "score": attempt.result_json.get("competency_scores", {}).get("Social_Skill"),
                "interpretation": attempt.result_json.get("competency_interpretations", {}).get("Social_Skill")
            }
        }
        for attempt, student, quiz_template in results
    ]
}

@router.get("/events/{event_id}/results/overall")
def get_overall_results(
    event_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # get all students who attempted any quiz in this event
    results = db.query(QuizAttempt, Student, QuizTemplate).join(
        QuizTemplate, QuizAttempt.quiz_template_id == QuizTemplate.id
    ).join(
        Student, QuizAttempt.student_id == Student.id
    ).filter(
        QuizTemplate.event_id == event_id,
        QuizAttempt.status == "submitted"
    ).all()

    # group by student
    student_map = {}
    for attempt, student, quiz_template in results:
        sid = str(student.id)
        if sid not in student_map:
            student_map[sid] = {
                "student_name": student.name,
                "enrollment_no": student.enrollment_no,
                "SCQ": None,
                "GWBS": None,
                "TABBPS": None,
                "EI": None
            }

        qt = quiz_template.quiz_type

        if qt == "SCQ":
            student_map[sid]["SCQ"] = {
                "total_score": attempt.total_score,
                "interpretation": attempt.result_json.get("interpretation")
            }
        elif qt == "GWBS":
            student_map[sid]["GWBS"] = {
                "total_score": attempt.total_score,
                "interpretation": attempt.result_json.get("interpretation")
            }
        elif qt == "TABBPS":
            student_map[sid]["TABBPS"] = {
                "final_classification": attempt.result_json.get("final_classification")
            }
        elif qt == "EI":
            scores = attempt.result_json.get("competency_scores", {})
            interps = attempt.result_json.get("competency_interpretations", {})
            student_map[sid]["EI"] = {
                 "Self_Awareness": {"score": scores.get("Self_Awareness"), "interpretation": interps.get("Self_Awareness")},
                "Managing_Emotions": {"score": scores.get("Managing_Emotions"), "interpretation": interps.get("Managing_Emotions")},
                "Motivating_Oneself": {"score": scores.get("Motivating_Oneself"), "interpretation": interps.get("Motivating_Oneself")},
                "Empathy": {"score": scores.get("Empathy"), "interpretation": interps.get("Empathy")},
                "Social_Skill": {"score": scores.get("Social_Skill"), "interpretation": interps.get("Social_Skill")},
    }

    return {
        "event_title": event.title,
        "event_date": event.event_date,
        "results": list(student_map.values())
    }

@router.get("/events/{event_id}/results")
def get_event_results(
    event_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    # CHECK: event exists
    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    results = db.query(QuizAttempt, Student, QuizTemplate)\
        .join(QuizTemplate, QuizAttempt.quiz_template_id == QuizTemplate.id)\
        .join(Student, QuizAttempt.student_id == Student.id)\
        .filter(
            QuizTemplate.event_id == event_id,
            QuizAttempt.status == "submitted"
        ).all()

    return [
        {
            "student_name": student.name,
            "enrollment_no": student.enrollment_no,
            "quiz_type": quiz_template.quiz_type,
            "total_score": attempt.total_score,
            "result_json": attempt.result_json,
            "attempted_at": attempt.attempted_at
        }
        for attempt, student, quiz_template in results
    ]