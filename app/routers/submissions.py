from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session
from typing import Optional, List
from uuid import UUID
import json
import structlog

from app.database import get_session
from app.schemas import SubmissionCreate, SubmissionResponse, CompleteSubmissionResponse, PaginatedResponse
from app.models import User
from app.crud import (
    create_submission, get_submission, get_user_submissions, 
    get_assessment_type_by_slug, create_risk_assessment,
    create_diabetes_assessment, create_hypertension_assessment, 
    create_heart_assessment, create_recommendation
)
from app.auth import get_current_user_optional
from app.services.risk_calculator import calculate_risk

logger = structlog.get_logger()
router = APIRouter()

@router.post("/", response_model=CompleteSubmissionResponse, status_code=status.HTTP_201_CREATED)
async def submit_assessment(
    submission_data: SubmissionCreate,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Submit assessment and calculate risk"""
    # Get assessment type
    assessment_type = get_assessment_type_by_slug(session, submission_data.assessment_type_id)
    if not assessment_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment type not found"
        )
    
    # Use current user if authenticated
    user_id = current_user.id if current_user else submission_data.user_id
    
    # Create submission
    submission = create_submission(
        session,
        assessment_type.id,
        user_id,
        submission_data.session_id,
        submission_data.data
    )
    
    # Calculate risk
    risk_result = calculate_risk(submission_data.assessment_type_id, submission_data.data)
    
    # Create risk assessment
    risk_assessment = create_risk_assessment(
        session,
        submission.id,
        submission_data.assessment_type_id,
        risk_result["risk_score"],
        risk_result["risk_bucket"],
        risk_result["model_version"]
    )
    
    # Create disease-specific assessment
    disease_specific = None
    if submission_data.assessment_type_id == "diabetes":
        disease_specific = create_diabetes_assessment(session, risk_assessment.id, risk_result.get("clinical_data", {}))
    elif submission_data.assessment_type_id == "hypertension":
        disease_specific = create_hypertension_assessment(session, risk_assessment.id, risk_result.get("clinical_data", {}))
    elif submission_data.assessment_type_id == "heart":
        disease_specific = create_heart_assessment(session, risk_assessment.id, risk_result.get("clinical_data", {}))
    
    # Generate recommendations
    recommendations = []
    for rec_data in risk_result.get("recommendations", []):
        recommendation = create_recommendation(
            session,
            submission_data.assessment_type_id,
            user_id,
            risk_assessment.id,
            rec_data["title"],
            rec_data.get("details"),
            rec_data.get("priority", "med")
        )
        recommendations.append({
            "id": recommendation.id,
            "title": recommendation.title,
            "details": recommendation.details,
            "priority": recommendation.priority,
            "status": recommendation.status,
            "created_at": recommendation.created_at
        })
    
    logger.info(
        "Assessment submitted and processed",
        submission_id=str(submission.id),
        risk_id=str(risk_assessment.id),
        disease=submission_data.assessment_type_id,
        risk_score=risk_result["risk_score"]
    )
    
    return CompleteSubmissionResponse(
        submission_id=submission.id,
        risk_id=risk_assessment.id,
        score=risk_result["risk_score"],
        risk_bucket=risk_result["risk_bucket"],
        recommendations=recommendations,
        disease_specific=risk_result.get("clinical_data")
    )

@router.get("/{submission_id}", response_model=SubmissionResponse)
async def get_submission_by_id(
    submission_id: UUID,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Get submission by ID"""
    submission = get_submission(session, submission_id)
    
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    # Check permissions
    if current_user and submission.user_id and submission.user_id != current_user.id:
        if current_user.role not in ["provider", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this submission"
            )
    
    return SubmissionResponse(
        id=submission.id,
        assessment_type_id=submission.assessment_type_id,
        user_id=submission.user_id,
        session_id=submission.session_id,
        data=json.loads(submission.data) if submission.data else None,
        started_at=submission.started_at,
        submitted_at=submission.submitted_at
    )

@router.get("/", response_model=List[SubmissionResponse])
async def get_user_submissions_list(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user_optional),
    session: Session = Depends(get_session)
):
    """Get user submissions with pagination"""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    submissions = get_user_submissions(session, current_user.id, page, per_page)
    
    return [
        SubmissionResponse(
            id=sub.id,
            assessment_type_id=sub.assessment_type_id,
            user_id=sub.user_id,
            session_id=sub.session_id,
            data=json.loads(sub.data) if sub.data else None,
            started_at=sub.started_at,
            submitted_at=sub.submitted_at
        )
        for sub in submissions
    ]