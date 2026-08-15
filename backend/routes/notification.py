from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.notification import Notification, NotificationRead
from schemas.notification import NotificationOut
from services.auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/", response_model=list[NotificationOut])
def get_notifications(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    notifications = db.query(Notification)\
        .order_by(Notification.created_at.desc())\
        .limit(20)\
        .all()

    read_ids = {
        r.notification_id
        for r in db.query(NotificationRead.notification_id).filter(
            NotificationRead.student_id == current_user.id
        ).all()
    }

    result = []
    for n in notifications:
        out = NotificationOut.model_validate(n)
        out.is_read = n.id in read_ids
        result.append(out)
    return result


@router.post("/{notification_id}/read", response_model=NotificationOut)
def mark_notification_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    existing = db.query(NotificationRead).filter(
        NotificationRead.student_id == current_user.id,
        NotificationRead.notification_id == notification_id
    ).first()

    if not existing:
        db.add(NotificationRead(student_id=current_user.id, notification_id=notification_id))
        db.commit()

    out = NotificationOut.model_validate(notification)
    out.is_read = True
    return out


@router.post("/mark-all-read")
def mark_all_notifications_read(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    notifications = db.query(Notification).all()
    already_read_ids = {
        r.notification_id
        for r in db.query(NotificationRead.notification_id).filter(
            NotificationRead.student_id == current_user.id
        ).all()
    }

    new_reads = [
        NotificationRead(student_id=current_user.id, notification_id=n.id)
        for n in notifications
        if n.id not in already_read_ids
    ]
    if new_reads:
        db.add_all(new_reads)
        db.commit()

    return {"marked_read": len(new_reads)}