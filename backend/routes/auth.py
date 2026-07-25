from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from sqlalchemy.exc import IntegrityError
from database import get_db
from models.student import Student
from models.admin import Admin, ProfileUpdate
from schemas.student import StudentCreate, StudentOut
from schemas.admin import AdminCreate, AdminOut
from schemas.auth import TokenResponse

from services.auth import (
    hash_password,
    verify_password,
    create_access_token,
    find_user_by_email,
    get_current_user,
    verify_google_token,
    create_password_reset_token,
    verify_password_reset_token,
    send_password_reset_email,
    update_user_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


#request response models for google login and password reset

class GoogleLoginRequest(BaseModel):
    id_token: str
    role: str  # "student" or "admin" — frontend must say which login screen this came from


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


#registeration endpoints

@router.post("/register/student", response_model=StudentOut)
def register_student(payload: StudentCreate, db: Session = Depends(get_db)):
    existing, _ = find_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(400, "Email already registered")

    student = Student(
        enrollment_no=payload.enrollment_no,
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        course=payload.course,
        semester=payload.semester,
        session=payload.session,
        gender=payload.gender,
        password_hash=hash_password(payload.password),
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@router.post("/register/admin", response_model=AdminOut)
def register_admin(payload: AdminCreate, db: Session = Depends(get_db)):
    existing, _ = find_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(400, "Email already registered")

    admin = Admin(
        name=payload.name,
        email=payload.email,
        department=payload.department,
        password_hash=hash_password(payload.password),
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


#login endpoint with email and password,return access token and role of user

@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    #form_data.username is email btw
    user, role = find_user_by_email(db, form_data.username)

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(401, "Invalid email or password")

    token = create_access_token({"sub": str(user.id), "role": role})
    return {"access_token": token, "token_type": "bearer", "role": role}


#google login endpoint, frontend sends id_token from google and role of user, backend verifies the token and returns access token if user exists

@router.post("/google-login", response_model=TokenResponse)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Frontend flow:
      1. User clicks "Sign in with Google" (Google's official button/SDK)
      2. Google returns an id_token to the frontend
      3. Frontend sends that id_token here, along with which role screen they're on

    only using google auth for login wala flow,not for registration as it requires additional info
    """
    google_data = verify_google_token(payload.id_token)
    email = google_data["email"]

    user, role = find_user_by_email(db, email)

    if not user:
        raise HTTPException(
            404,
            "No account found for this Google email. Please register first."
        )

    if role != payload.role:
        raise HTTPException(
            403,
            "Account not found for this login type."
        )

    token = create_access_token({"sub": str(user.id), "role": role})
    return {"access_token": token, "token_type": "bearer", "role": role}


#forgot password endpoint for reset link

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
   
    user, role = find_user_by_email(db, payload.email)

    if user:
        reset_token = create_password_reset_token(payload.email, role)
        send_password_reset_email(payload.email, reset_token)

    return {"message": "If an account exists for this email, a reset link has been sent."}


#reset password endpoint,where we set new password
@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    token_data = verify_password_reset_token(payload.token)
    email = token_data["sub"]
    role = token_data["role"]

    user, found_role = find_user_by_email(db, email)
    if not user or found_role != role:
        raise HTTPException(400, "Invalid or expired reset token")

    if len(payload.new_password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters")

    update_user_password(db, user, role, payload.new_password)
    return {"message": "Password has been reset successfully. You can now log in."}

#return current user info to check who is logged in


@router.patch("/me")
def update_me(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if data.name is not None:
        current_user.name = data.name

    if data.email is not None and data.email != current_user.email:
        existing_user, existing_role = find_user_by_email(db, data.email)
        if existing_user is not None and not (
            existing_role == current_user.role and existing_user.id == current_user.id
        ):
            raise HTTPException(
                status_code=409,
                detail="This email is already in use by another account."
            )
        current_user.email = data.email

    if data.department is not None:
        if not hasattr(current_user, "department"):
            raise HTTPException(status_code=400, detail="This account type does not support a department field")
        current_user.department = data.department
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="This email is already in use by another account."
        )

    db.refresh(current_user)

    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "department": getattr(current_user, "department", None),
        "course": getattr(current_user, "course", None),
        "semester": getattr(current_user, "semester", None),
        "session": getattr(current_user, "session", None),
        "enrollment": getattr(current_user, "enrollment_no", None),
    }
@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "department": getattr(current_user, "department", None),
        "course": getattr(current_user, "course", None),
        "semester": getattr(current_user, "semester", None),
        "session": getattr(current_user, "session", None),
        "enrollment": getattr(current_user, "enrollment_no", None),
    }