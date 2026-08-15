from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from services import auth
from services.scheduling import start_scheduler
from database import engine, Base, get_db
from routes.auth import router as auth_router
from routes.quiz import router as quiz_router
from routes.admin import router as admin_router
from routes.student import router as student_router
from routes.superuser import router as superuser_router
from routes.notification import router as notifications_router
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = start_scheduler()
    yield
    scheduler.shutdown(wait=False)

app = FastAPI(title="Mental Well-Being Platform", lifespan=lifespan)


class NoCacheMiddleware(BaseHTTPMiddleware):
    """Prevents the browser from caching API responses by URL alone. Without
    this, a GET response cached before a backend fix (or for a different
    logged-in user) can keep being served stale/wrong data indefinitely,
    since HTTP caching ignores the Authorization header by default."""
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["Cache-Control"] = "no-store"
        return response

app.add_middleware(NoCacheMiddleware)

origins=[
"http://localhost:5173", 
"http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(quiz_router)
app.include_router(admin_router)
app.include_router(student_router)
app.include_router(superuser_router)
app.include_router(notifications_router)
@app.get("/")
def root():
    return {"message": "API is running"}

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error"}