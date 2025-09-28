from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Optional, Dict, Any
from uuid import UUID
import json
import structlog

from app.database import get_session
from app.schemas import RiskAssessmentResponse, RecommendationResponse
from app.models import (
    User, RiskAssessment, DiabetesAssessment, HypertensionAssessment, 
    HeartAssessment, DiabetesRecommendation, HypertensionRecommendation, 
    HeartRecommendation
)
from app.crud import get_risk_assessment
from app.auth import get_current_user_optional

logger = structlog.get_logger()
router = APIRouter()

@router.get("/{risk_id}", response_model=Dict[str, Any])
async def get_risk_assessment_details(
    risk_id: UUID,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Get complete risk assessment with disease-specific details and recommendations"""
    risk = get_risk_assessment(session, risk_id)
    
    if not risk:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Risk assessment not found"
        )
    
    # Check permissions
    if current_user and risk.survey.user_id and risk.survey.user_id != current_user.id:
        if current_user.role not in ["provider", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this assessment"
            )
    
    # Get disease-specific details
    disease_specific = {}
    recommendations = []
    
    if risk.disease == "diabetes":
        # Get diabetes assessment
        statement = select(DiabetesAssessment).where(DiabetesAssessment.risk_id == risk_id)
        diabetes_assessment = session.exec(statement).first()
        if diabetes_assessment:
            disease_specific = {
                "pred_class": diabetes_assessment.pred_class,
                "decision_threshold": diabetes_assessment.decision_threshold,
                "calibration_method": diabetes_assessment.calibration_method,
                "pre_diabetes_flag": diabetes_assessment.pre_diabetes_flag
            }
        
        # Get recommendations
        statement = select(DiabetesRecommendation).where(DiabetesRecommendation.risk_id == risk_id)
        recs = session.exec(statement).all()
        recommendations = [
            {
                "id": rec.id,
                "title": rec.title,
                "details": rec.details,
                "priority": rec.priority,
                "status": rec.status,
                "created_at": rec.created_at
            }
            for rec in recs
        ]
    
    elif risk.disease == "hypertension":
        # Get hypertension assessment
        statement = select(HypertensionAssessment).where(HypertensionAssessment.risk_id == risk_id)
        hypertension_assessment = session.exec(statement).first()
        if hypertension_assessment:
            disease_specific = {
                "systolic_mmhg": hypertension_assessment.systolic_mmhg,
                "diastolic_mmhg": hypertension_assessment.diastolic_mmhg,
                "heart_rate_bpm": hypertension_assessment.heart_rate_bpm,
                "antihypertensive_medications": hypertension_assessment.antihypertensive_medications
            }
        
        # Get recommendations
        statement = select(HypertensionRecommendation).where(HypertensionRecommendation.risk_id == risk_id)
        recs = session.exec(statement).all()
        recommendations = [
            {
                "id": rec.id,
                "title": rec.title,
                "details": rec.details,
                "priority": rec.priority,
                "status": rec.status,
                "created_at": rec.created_at
            }
            for rec in recs
        ]
    
    elif risk.disease == "heart":
        # Get heart assessment
        statement = select(HeartAssessment).where(HeartAssessment.risk_id == risk_id)
        heart_assessment = session.exec(statement).first()
        if heart_assessment:
            disease_specific = {
                "cholesterol_mgdl": heart_assessment.cholesterol_mgdl,
                "triglycerides_mgdl": heart_assessment.triglycerides_mgdl,
                "hdl_mgdl": heart_assessment.hdl_mgdl,
                "ldl_mgdl": heart_assessment.ldl_mgdl,
                "family_history": heart_assessment.family_history,
                "smoking": heart_assessment.smoking,
                "obesity": heart_assessment.obesity
            }
        
        # Get recommendations
        statement = select(HeartRecommendation).where(HeartRecommendation.risk_id == risk_id)
        recs = session.exec(statement).all()
        recommendations = [
            {
                "id": rec.id,
                "title": rec.title,
                "details": rec.details,
                "priority": rec.priority,
                "status": rec.status,
                "created_at": rec.created_at
            }
            for rec in recs
        ]
    
    return {
        "id": risk.id,
        "survey_id": risk.survey_id,
        "disease": risk.disease,
        "model_version": risk.model_version,
        "risk_score": risk.risk_score,
        "risk_bucket": risk.risk_bucket,
        "auc_at_train": risk.auc_at_train,
        "predicted_at": risk.predicted_at,
        "disease_specific": disease_specific,
        "recommendations": recommendations,
        "submission_data": json.loads(risk.survey.data) if risk.survey.data else None
    }