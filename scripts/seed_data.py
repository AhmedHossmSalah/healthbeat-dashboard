#!/usr/bin/env python3
"""
Seed script to populate initial data
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from sqlmodel import Session
from app.database import engine
from app.crud import create_user, create_assessment_types
import structlog

logger = structlog.get_logger()

def seed_database():
    """Seed database with initial data"""
    with Session(engine) as session:
        # Create assessment types
        create_assessment_types(session)
        logger.info("Assessment types created")
        
        # Create admin user
        try:
            admin_user = create_user(
                session, 
                "admin@example.com", 
                "Passw0rd!", 
                "admin"
            )
            logger.info("Admin user created", user_id=str(admin_user.id))
        except Exception as e:
            logger.warning("Admin user might already exist", error=str(e))
        
        # Create test patient
        try:
            test_patient = create_user(
                session,
                "ali@example.com",
                "Pass1234!",
                "patient"
            )
            logger.info("Test patient created", user_id=str(test_patient.id))
        except Exception as e:
            logger.warning("Test patient might already exist", error=str(e))
        
        logger.info("Database seeding completed")

if __name__ == "__main__":
    seed_database()