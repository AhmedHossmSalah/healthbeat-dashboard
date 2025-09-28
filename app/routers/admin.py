from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, func
from typing import List, Dict, Any
from uuid import UUID
import structlog

from app.database import get_session
from app.schemas import UserResponse, PaginatedResponse
from app.models import User, RiskAssessment, SurveySubmission, AnalyticsEvent
from app.auth import get_admin_user

logger = structlog.get_logger()
router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    role: str = Query(None, description="Filter by role"),
    status: str = Query(None, description="Filter by status"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_admin_user)
):
    """List users with filters (admin only)"""
    statement = select(User)
    
    if role:
        statement = statement.where(User.role == role)
    if status:
        statement = statement.where(User.status == status)
    
    offset = (page - 1) * per_page
    statement = statement.offset(offset).limit(per_page).order_by(User.created_at.desc())
    
    users = session.exec(statement).all()
    
    return [
        UserResponse(
            id=user.id,
            email=user.email,
            role=user.role,
            status=user.status,
            created_at=user.created_at,
            full_name=user.patient_profile.full_name if user.patient_profile else None,
            sex=user.patient_profile.sex if user.patient_profile else None,
            birth_date=user.patient_profile.birth_date if user.patient_profile else None
        )
        for user in users
    ]

@router.get("/assessments", response_model=Dict[str, Any])
async def get_assessment_metrics(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_admin_user)
):
    """Get assessment metrics and model performance (admin only)"""
    
    # Count submissions by disease
    diabetes_count = session.exec(
        select(func.count(RiskAssessment.id)).where(RiskAssessment.disease == "diabetes")
    ).first()
    
    hypertension_count = session.exec(
        select(func.count(RiskAssessment.id)).where(RiskAssessment.disease == "hypertension")
    ).first()
    
    heart_count = session.exec(
        select(func.count(RiskAssessment.id)).where(RiskAssessment.disease == "heart")
    ).first()
    
    # Average risk scores by disease
    avg_diabetes_risk = session.exec(
        select(func.avg(RiskAssessment.risk_score)).where(RiskAssessment.disease == "diabetes")
    ).first()
    
    avg_hypertension_risk = session.exec(
        select(func.avg(RiskAssessment.risk_score)).where(RiskAssessment.disease == "hypertension")
    ).first()
    
    avg_heart_risk = session.exec(
        select(func.avg(RiskAssessment.risk_score)).where(RiskAssessment.disease == "heart")
    ).first()
    
    # Risk bucket distribution
    risk_distribution = {}
    for disease in ["diabetes", "hypertension", "heart"]:
        for bucket in ["low", "medium", "high"]:
            count = session.exec(
                select(func.count(RiskAssessment.id)).where(
                    RiskAssessment.disease == disease,
                    RiskAssessment.risk_bucket == bucket
                )
            ).first()
            risk_distribution[f"{disease}_{bucket}"] = count or 0
    
    return {
        "total_assessments": {
            "diabetes": diabetes_count or 0,
            "hypertension": hypertension_count or 0,
            "heart": heart_count or 0
        },
        "average_risk_scores": {
            "diabetes": round(avg_diabetes_risk or 0, 4),
            "hypertension": round(avg_hypertension_risk or 0, 4),
            "heart": round(avg_heart_risk or 0, 4)
        },
        "risk_distribution": risk_distribution,
        "model_versions": {
            "diabetes": "v1.0",
            "hypertension": "v1.0", 
            "heart": "v1.0"
        }
    }

@router.put("/users/{user_id}/status")
async def update_user_status(
    user_id: UUID,
    new_status: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_admin_user)
):
    """Update user status (admin only)"""
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if new_status not in ["active", "suspended", "deleted"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status"
        )
    
    user.status = new_status
    session.commit()
    
    logger.info(
        "User status updated",
        user_id=str(user_id),
        new_status=new_status,
        updated_by=str(current_user.id)
    )
    
    return {"message": "User status updated successfully"}