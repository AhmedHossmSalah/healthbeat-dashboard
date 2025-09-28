from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import structlog
import uvicorn

from app.core.config import settings
from app.database import create_db_and_tables
from app.routers import auth, drafts, submissions, risks, recommendations, admin, analytics

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

app = FastAPI(
    title="HealthBeat Medical Risk Assessment API",
    description="API for medical risk assessment system supporting diabetes, hypertension, and heart disease evaluation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_HOST, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(drafts.router, prefix="/drafts", tags=["Drafts"])
app.include_router(submissions.router, prefix="/submissions", tags=["Submissions"])
app.include_router(risks.router, prefix="/risks", tags=["Risk Assessments"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "code": getattr(exc, 'code', 'http_error'),
            "status": exc.status_code
        }
    )

@app.on_event("startup")
async def startup_event():
    logger.info("Starting HealthBeat API", version="1.0.0")
    create_db_and_tables()
    logger.info("Database tables created/verified")

@app.get("/")
async def root():
    return {
        "message": "HealthBeat Medical Risk Assessment API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2024-01-01T00:00:00Z"}

@app.get("/assessments")
async def get_assessment_types():
    """Get available assessment types"""
    return [
        {
            "id": "diabetes",
            "slug": "diabetes", 
            "title": "تقييم خطر السكري",
            "description": "تقييم خطر الإصابة بداء السكري من النوع الثاني"
        },
        {
            "id": "hypertension",
            "slug": "hypertension",
            "title": "تقييم خطر ارتفاع ضغط الدم", 
            "description": "تقييم خطر الإصابة بارتفاع ضغط الدم"
        },
        {
            "id": "heart",
            "slug": "heart",
            "title": "تقييم خطر أمراض القلب",
            "description": "تقييم خطر الإصابة بأمراض القلب والشرايين"
        }
    ]

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development"
    )