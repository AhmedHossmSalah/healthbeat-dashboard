from sqlmodel import Session, select
from typing import Optional, List, Dict, Any
from uuid import UUID
import json
from datetime import datetime
import structlog

from app.models import (
    User, PatientProfile, AssessmentType, AssessmentDraft, 
    SurveySubmission, RiskAssessment, DiabetesAssessment,
    HypertensionAssessment, HeartAssessment, AnalyticsEvent,
    DiabetesRecommendation, HypertensionRecommendation, HeartRecommendation
)
from app.core.security import get_password_hash

logger = structlog.get_logger()

# User CRUD
def create_user(session: Session, email: str, password: str, role: str = "patient") -> User:
    """Create a new user"""
    hashed_password = get_password_hash(password)
    user = User(
        email=email,
        password_hash=hashed_password,
        role=role
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    
    # Create patient profile if role is patient
    if role == "patient":
        profile = PatientProfile(user_id=user.id)
        session.add(profile)
        session.commit()
    
    logger.info("User created", user_id=str(user.id), email=email, role=role)
    return user

def get_user_by_email(session: Session, email: str) -> Optional[User]:
    """Get user by email"""
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()

def update_patient_profile(session: Session, user_id: UUID, profile_data: Dict[str, Any]) -> PatientProfile:
    """Update patient profile"""
    statement = select(PatientProfile).where(PatientProfile.user_id == user_id)
    profile = session.exec(statement).first()
    
    if not profile:
        profile = PatientProfile(user_id=user_id)
        session.add(profile)
    
    for key, value in profile_data.items():
        if hasattr(profile, key):
            setattr(profile, key, value)
    
    profile.updated_at = datetime.utcnow()
    session.commit()
    session.refresh(profile)
    return profile

# Assessment Type CRUD
def get_assessment_type_by_slug(session: Session, slug: str) -> Optional[AssessmentType]:
    """Get assessment type by slug"""
    statement = select(AssessmentType).where(AssessmentType.slug == slug)
    return session.exec(statement).first()

def create_assessment_types(session: Session):
    """Create default assessment types"""
    types = [
        {"slug": "diabetes", "title": "تقييم خطر السكري", "description": "تقييم خطر الإصابة بداء السكري من النوع الثاني"},
        {"slug": "hypertension", "title": "تقييم خطر ارتفاع ضغط الدم", "description": "تقييم خطر الإصابة بارتفاع ضغط الدم"},
        {"slug": "heart", "title": "تقييم خطر أمراض القلب", "description": "تقييم خطر الإصابة بأمراض القلب والشرايين"}
    ]
    
    for type_data in types:
        existing = get_assessment_type_by_slug(session, type_data["slug"])
        if not existing:
            assessment_type = AssessmentType(**type_data)
            session.add(assessment_type)
    
    session.commit()

# Draft CRUD
def upsert_draft(session: Session, assessment_type_id: UUID, user_id: Optional[UUID], 
                session_id: Optional[str], data: Dict[str, Any]) -> AssessmentDraft:
    """Create or update draft"""
    # Find existing draft
    statement = select(AssessmentDraft).where(
        AssessmentDraft.assessment_type_id == assessment_type_id
    )
    
    if user_id:
        statement = statement.where(AssessmentDraft.user_id == user_id)
    elif session_id:
        statement = statement.where(AssessmentDraft.session_id == session_id)
    
    draft = session.exec(statement).first()
    
    if draft:
        # Update existing
        draft.data = json.dumps(data)
        draft.last_saved_at = datetime.utcnow()
        draft.updated_at = datetime.utcnow()
    else:
        # Create new
        draft = AssessmentDraft(
            assessment_type_id=assessment_type_id,
            user_id=user_id,
            session_id=session_id,
            data=json.dumps(data)
        )
        session.add(draft)
    
    session.commit()
    session.refresh(draft)
    return draft

def get_draft(session: Session, assessment_type_id: UUID, user_id: Optional[UUID], 
             session_id: Optional[str]) -> Optional[AssessmentDraft]:
    """Get draft by user or session"""
    statement = select(AssessmentDraft).where(
        AssessmentDraft.assessment_type_id == assessment_type_id
    )
    
    if user_id:
        statement = statement.where(AssessmentDraft.user_id == user_id)
    elif session_id:
        statement = statement.where(AssessmentDraft.session_id == session_id)
    else:
        return None
    
    return session.exec(statement).first()

# Submission CRUD
def create_submission(session: Session, assessment_type_id: UUID, user_id: Optional[UUID],
                     session_id: Optional[str], data: Dict[str, Any]) -> SurveySubmission:
    """Create survey submission"""
    submission = SurveySubmission(
        assessment_type_id=assessment_type_id,
        user_id=user_id,
        session_id=session_id,
        data=json.dumps(data),
        submitted_at=datetime.utcnow()
    )
    session.add(submission)
    session.commit()
    session.refresh(submission)
    return submission

def get_submission(session: Session, submission_id: UUID) -> Optional[SurveySubmission]:
    """Get submission by ID"""
    statement = select(SurveySubmission).where(SurveySubmission.id == submission_id)
    return session.exec(statement).first()

def get_user_submissions(session: Session, user_id: UUID, page: int = 1, per_page: int = 10) -> List[SurveySubmission]:
    """Get user submissions with pagination"""
    offset = (page - 1) * per_page
    statement = select(SurveySubmission).where(
        SurveySubmission.user_id == user_id
    ).offset(offset).limit(per_page).order_by(SurveySubmission.submitted_at.desc())
    
    return session.exec(statement).all()

# Risk Assessment CRUD
def create_risk_assessment(session: Session, survey_id: UUID, disease: str, 
                          risk_score: float, risk_bucket: str, model_version: str = "v1.0") -> RiskAssessment:
    """Create risk assessment"""
    risk = RiskAssessment(
        survey_id=survey_id,
        disease=disease,
        model_version=model_version,
        risk_score=risk_score,
        risk_bucket=risk_bucket
    )
    session.add(risk)
    session.commit()
    session.refresh(risk)
    return risk

def get_risk_assessment(session: Session, risk_id: UUID) -> Optional[RiskAssessment]:
    """Get risk assessment by ID"""
    statement = select(RiskAssessment).where(RiskAssessment.id == risk_id)
    return session.exec(statement).first()

# Disease-specific CRUD
def create_diabetes_assessment(session: Session, risk_id: UUID, clinical_data: Dict[str, Any]) -> DiabetesAssessment:
    """Create diabetes-specific assessment"""
    diabetes = DiabetesAssessment(
        risk_id=risk_id,
        pred_class=clinical_data.get("pred_class"),
        decision_threshold=clinical_data.get("decision_threshold"),
        calibration_method=clinical_data.get("calibration_method", "none"),
        pre_diabetes_flag=clinical_data.get("pre_diabetes_flag", False)
    )
    session.add(diabetes)
    session.commit()
    return diabetes

def create_hypertension_assessment(session: Session, risk_id: UUID, clinical_data: Dict[str, Any]) -> HypertensionAssessment:
    """Create hypertension-specific assessment"""
    hypertension = HypertensionAssessment(
        risk_id=risk_id,
        systolic_mmhg=clinical_data.get("systolic_mmhg"),
        diastolic_mmhg=clinical_data.get("diastolic_mmhg"),
        heart_rate_bpm=clinical_data.get("heart_rate_bpm"),
        antihypertensive_medications=clinical_data.get("medications")
    )
    session.add(hypertension)
    session.commit()
    return hypertension

def create_heart_assessment(session: Session, risk_id: UUID, clinical_data: Dict[str, Any]) -> HeartAssessment:
    """Create heart-specific assessment"""
    heart = HeartAssessment(
        risk_id=risk_id,
        cholesterol_mgdl=clinical_data.get("cholesterol_mgdl"),
        triglycerides_mgdl=clinical_data.get("triglycerides_mgdl"),
        hdl_mgdl=clinical_data.get("hdl_mgdl"),
        ldl_mgdl=clinical_data.get("ldl_mgdl"),
        family_history=clinical_data.get("family_history", False),
        smoking=clinical_data.get("smoking", False),
        obesity=clinical_data.get("obesity", False)
    )
    session.add(heart)
    session.commit()
    return heart

# Recommendations CRUD
def create_recommendation(session: Session, disease: str, user_id: Optional[UUID], 
                         risk_id: UUID, title: str, details: Optional[str], priority: str) -> Any:
    """Create disease-specific recommendation"""
    recommendation_data = {
        "user_id": user_id,
        "risk_id": risk_id,
        "title": title,
        "details": details,
        "priority": priority
    }
    
    if disease == "diabetes":
        recommendation = DiabetesRecommendation(**recommendation_data)
    elif disease == "hypertension":
        recommendation = HypertensionRecommendation(**recommendation_data)
    elif disease == "heart":
        recommendation = HeartRecommendation(**recommendation_data)
    else:
        raise ValueError(f"Unknown disease: {disease}")
    
    session.add(recommendation)
    session.commit()
    session.refresh(recommendation)
    return recommendation

def get_user_recommendations(session: Session, user_id: UUID, disease: Optional[str] = None) -> List[Any]:
    """Get user recommendations"""
    recommendations = []
    
    diseases = [disease] if disease else ["diabetes", "hypertension", "heart"]
    
    for d in diseases:
        if d == "diabetes":
            statement = select(DiabetesRecommendation).where(DiabetesRecommendation.user_id == user_id)
            recommendations.extend(session.exec(statement).all())
        elif d == "hypertension":
            statement = select(HypertensionRecommendation).where(HypertensionRecommendation.user_id == user_id)
            recommendations.extend(session.exec(statement).all())
        elif d == "heart":
            statement = select(HeartRecommendation).where(HeartRecommendation.user_id == user_id)
            recommendations.extend(session.exec(statement).all())
    
    return recommendations

# Analytics CRUD
def create_analytics_event(session: Session, user_id: Optional[UUID], session_id: Optional[str],
                          event_type: str, payload: Optional[Dict[str, Any]]) -> AnalyticsEvent:
    """Create analytics event"""
    event = AnalyticsEvent(
        user_id=user_id,
        session_id=session_id,
        event_type=event_type,
        payload=json.dumps(payload) if payload else None
    )
    session.add(event)
    session.commit()
    return event