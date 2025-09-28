from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
from app.models import UserRole, UserStatus, RiskBucket, Priority

# Auth schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class UserResponse(BaseModel):
    id: UUID
    email: str
    role: UserRole
    status: UserStatus
    created_at: datetime
    full_name: Optional[str] = None
    sex: Optional[str] = None
    birth_date: Optional[datetime] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    sex: Optional[str] = None
    birth_date: Optional[datetime] = None

# Draft schemas
class DraftCreate(BaseModel):
    assessment_type_id: str  # slug like "diabetes"
    session_id: Optional[str] = None
    user_id: Optional[UUID] = None
    data: Dict[str, Any] = Field(default_factory=dict)

class DraftResponse(BaseModel):
    id: UUID
    assessment_type_id: UUID
    user_id: Optional[UUID]
    session_id: Optional[str]
    data: Dict[str, Any]
    last_saved_at: datetime
    created_at: datetime

# Submission schemas
class SubmissionCreate(BaseModel):
    assessment_type_id: str  # slug
    user_id: Optional[UUID] = None
    session_id: Optional[str] = None
    data: Dict[str, Any] = Field(default_factory=dict)

class SubmissionResponse(BaseModel):
    id: UUID
    assessment_type_id: UUID
    user_id: Optional[UUID]
    session_id: Optional[str]
    data: Optional[Dict[str, Any]]
    started_at: datetime
    submitted_at: Optional[datetime]

# Risk assessment schemas
class RiskAssessmentResponse(BaseModel):
    id: UUID
    survey_id: UUID
    disease: str
    model_version: str
    risk_score: float
    risk_bucket: RiskBucket
    auc_at_train: Optional[float]
    predicted_at: datetime
    recommendations: List["RecommendationResponse"] = []

class RecommendationResponse(BaseModel):
    id: UUID
    title: str
    details: Optional[str]
    priority: Priority
    status: str
    created_at: datetime

class RecommendationCreate(BaseModel):
    user_id: Optional[UUID] = None
    risk_id: UUID
    title: str = Field(max_length=400)
    details: Optional[str] = None
    priority: Priority = Priority.MEDIUM

# Disease-specific schemas
class DiabetesAssessmentResponse(BaseModel):
    risk_id: UUID
    pred_class: Optional[str]
    decision_threshold: Optional[float]
    calibration_method: Optional[str]
    pre_diabetes_flag: Optional[bool]

class HypertensionAssessmentResponse(BaseModel):
    risk_id: UUID
    systolic_mmhg: Optional[int]
    diastolic_mmhg: Optional[int]
    heart_rate_bpm: Optional[int]
    antihypertensive_medications: Optional[str]

class HeartAssessmentResponse(BaseModel):
    risk_id: UUID
    cholesterol_mgdl: Optional[float]
    triglycerides_mgdl: Optional[float]
    hdl_mgdl: Optional[float]
    ldl_mgdl: Optional[float]
    family_history: Optional[bool]
    smoking: Optional[bool]
    obesity: Optional[bool]

# Analytics schemas
class AnalyticsEventCreate(BaseModel):
    user_id: Optional[UUID] = None
    session_id: Optional[str] = None
    event_type: str = Field(max_length=100)
    payload: Optional[Dict[str, Any]] = None

# Complete submission response with risk
class CompleteSubmissionResponse(BaseModel):
    submission_id: UUID
    risk_id: UUID
    score: float
    risk_bucket: RiskBucket
    recommendations: List[RecommendationResponse]
    disease_specific: Optional[Dict[str, Any]] = None

# Pagination
class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    per_page: int
    pages: int

# Error response
class ErrorResponse(BaseModel):
    detail: str
    code: str
    status: int