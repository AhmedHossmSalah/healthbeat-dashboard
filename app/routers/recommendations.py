from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session
from typing import Optional, List
from uuid import UUID
import structlog

from app.database import get_session
from app.schemas import RecommendationCreate, RecommendationResponse
from app.models import User
from app.crud import create_recommendation, get_user_recommendations
from app.auth import get_current_active_user, get_provider_or_admin_user

logger = structlog.get_logger()
router = APIRouter()

@router.get("/", response_model=List[RecommendationResponse])
async def get_recommendations(
    disease: Optional[str] = Query(None, description="Filter by disease type"),
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Get user recommendations"""
    recommendations = get_user_recommendations(session, current_user.id, disease)
    
    return [
        RecommendationResponse(
            id=rec.id,
            title=rec.title,
            details=rec.details,
            priority=rec.priority,
            status=rec.status,
            created_at=rec.created_at
        )
        for rec in recommendations
    ]

@router.post("/", response_model=RecommendationResponse, status_code=status.HTTP_201_CREATED)
async def create_manual_recommendation(
    recommendation_data: RecommendationCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_provider_or_admin_user)
):
    """Create manual recommendation (provider/admin only)"""
    from sqlmodel import select
    from app.models import RiskAssessment
    
    # Verify risk assessment exists
    statement = select(RiskAssessment).where(RiskAssessment.id == recommendation_data.risk_id)
    risk = session.exec(statement).first()
    
    if not risk:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Risk assessment not found"
        )
    
    # Create recommendation
    recommendation = create_recommendation(
        session,
        risk.disease,
        recommendation_data.user_id,
        recommendation_data.risk_id,
        recommendation_data.title,
        recommendation_data.details,
        recommendation_data.priority
    )
    
    logger.info(
        "Manual recommendation created",
        recommendation_id=str(recommendation.id),
        created_by=str(current_user.id),
        disease=risk.disease
    )
    
    return RecommendationResponse(
        id=recommendation.id,
        title=recommendation.title,
        details=recommendation.details,
        priority=recommendation.priority,
        status=recommendation.status,
        created_at=recommendation.created_at
    )