from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings
import structlog

logger = structlog.get_logger()

# Create engine
if settings.ENVIRONMENT == "test":
    engine = create_engine("sqlite:///./test.db", echo=False)
else:
    engine = create_engine(
        settings.database_url,
        echo=settings.LOG_LEVEL == "DEBUG",
        pool_pre_ping=True,
        pool_recycle=300
    )

def create_db_and_tables():
    """Create database tables"""
    try:
        SQLModel.metadata.create_all(engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error("Failed to create database tables", error=str(e))
        raise

def get_session():
    """Get database session"""
    with Session(engine) as session:
        yield session