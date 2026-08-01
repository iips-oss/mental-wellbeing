from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.notification import Notification
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
    return notifications