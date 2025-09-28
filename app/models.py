from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID, uuid4
from enum import Enum

class UserRole(str, Enum):
    PATIENT = "patient"
    PROVIDER = "provider"
    ADMIN = "admin"

class UserStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    DELETED = "deleted"

class RiskBucket(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "med"
    HIGH = "high"

# Base User Model
class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=512)
    role: UserRole = Field(default=UserRole.PATIENT)
    status: UserStatus = Field(default=UserStatus.ACTIVE)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    patient_profile: Optional["PatientProfile"] = Relationship(back_populates="user")
    submissions: List["SurveySubmission"] = Relationship(back_populates="user")
    drafts: List["AssessmentDraft"] = Relationship(back_populates="user")

class PatientProfile(SQLModel, table=True):
    __tablename__ = "patient_profiles"
    
    user_id: UUID = Field(foreign_key="users.id", primary_key=True)
    full_name: Optional[str] = Field(max_length=255)
    sex: Optional[str] = Field(max_length=1)  # M/F
    birth_date: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: User = Relationship(back_populates="patient_profile")

class AssessmentType(SQLModel, table=True):
    __tablename__ = "assessment_types"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    slug: str = Field(unique=True, max_length=100)
    title: str = Field(max_length=200)
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    drafts: List["AssessmentDraft"] = Relationship(back_populates="assessment_type")
    submissions: List["SurveySubmission"] = Relationship(back_populates="assessment_type")

class AssessmentDraft(SQLModel, table=True):
    __tablename__ = "assessment_drafts"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    assessment_type_id: UUID = Field(foreign_key="assessment_types.id")
    user_id: Optional[UUID] = Field(foreign_key="users.id", default=None)
    session_id: Optional[str] = Field(max_length=200, default=None)
    data: str = Field()  # JSON string
    last_saved_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    assessment_type: AssessmentType = Relationship(back_populates="drafts")
    user: Optional[User] = Relationship(back_populates="drafts")

class SurveySubmission(SQLModel, table=True):
    __tablename__ = "survey_submissions"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    assessment_type_id: UUID = Field(foreign_key="assessment_types.id")
    user_id: Optional[UUID] = Field(foreign_key="users.id", default=None)
    session_id: Optional[str] = Field(max_length=200, default=None)
    data: Optional[str] = None  # JSON string
    started_at: datetime = Field(default_factory=datetime.utcnow)
    submitted_at: Optional[datetime] = None
    
    # Relationships
    assessment_type: AssessmentType = Relationship(back_populates="submissions")
    user: Optional[User] = Relationship(back_populates="submissions")
    risk_assessment: Optional["RiskAssessment"] = Relationship(back_populates="survey")

class RiskAssessment(SQLModel, table=True):
    __tablename__ = "risk_assessments"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    survey_id: UUID = Field(foreign_key="survey_submissions.id", unique=True)
    disease: str = Field(max_length=20)  # diabetes/hypertension/heart
    model_version: str = Field(max_length=100)
    risk_score: float = Field(ge=0.0, le=1.0)
    risk_bucket: RiskBucket
    auc_at_train: Optional[float] = Field(ge=0.0, le=1.0, default=None)
    predicted_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    survey: SurveySubmission = Relationship(back_populates="risk_assessment")
    diabetes_assessment: Optional["DiabetesAssessment"] = Relationship(back_populates="risk")
    hypertension_assessment: Optional["HypertensionAssessment"] = Relationship(back_populates="risk")
    heart_assessment: Optional["HeartAssessment"] = Relationship(back_populates="risk")

# Disease-specific assessment models
class DiabetesAssessment(SQLModel, table=True):
    __tablename__ = "diabetes_assessments"
    
    risk_id: UUID = Field(foreign_key="risk_assessments.id", primary_key=True)
    pred_class: Optional[str] = Field(max_length=10)  # positive/negative
    decision_threshold: Optional[float] = Field(ge=0.0, le=1.0)
    calibration_method: Optional[str] = Field(max_length=20)  # isotonic/platt/none
    pre_diabetes_flag: Optional[bool] = False
    
    # Relationships
    risk: RiskAssessment = Relationship(back_populates="diabetes_assessment")

class DiabetesClinicalDetails(SQLModel, table=True):
    __tablename__ = "diabetes_clinical_details"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    survey_id: UUID = Field(foreign_key="survey_submissions.id")
    fasting_glucose_mgdl: Optional[float] = None
    ppg_2h_mgdl: Optional[float] = None
    hba1c_percent: Optional[float] = None
    ogtt_mgdl: Optional[float] = None
    neuropathy_symptoms: Optional[bool] = False
    retinopathy_flag: Optional[bool] = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DiabetesRecommendation(SQLModel, table=True):
    __tablename__ = "diabetes_recommendations"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: Optional[UUID] = Field(foreign_key="users.id", default=None)
    risk_id: UUID = Field(foreign_key="risk_assessments.id")
    title: str = Field(max_length=400)
    details: Optional[str] = None
    priority: Priority = Field(default=Priority.MEDIUM)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="open", max_length=50)

class HypertensionAssessment(SQLModel, table=True):
    __tablename__ = "hypertension_assessments"
    
    risk_id: UUID = Field(foreign_key="risk_assessments.id", primary_key=True)
    systolic_mmhg: Optional[int] = None
    diastolic_mmhg: Optional[int] = None
    heart_rate_bpm: Optional[int] = None
    antihypertensive_medications: Optional[str] = None
    
    # Relationships
    risk: RiskAssessment = Relationship(back_populates="hypertension_assessment")

class HypertensionRecommendation(SQLModel, table=True):
    __tablename__ = "hypertension_recommendations"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: Optional[UUID] = Field(foreign_key="users.id", default=None)
    risk_id: UUID = Field(foreign_key="risk_assessments.id")
    title: str = Field(max_length=400)
    details: Optional[str] = None
    priority: Priority = Field(default=Priority.MEDIUM)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="open", max_length=50)

class HeartAssessment(SQLModel, table=True):
    __tablename__ = "heart_assessments"
    
    risk_id: UUID = Field(foreign_key="risk_assessments.id", primary_key=True)
    cholesterol_mgdl: Optional[float] = None
    triglycerides_mgdl: Optional[float] = None
    hdl_mgdl: Optional[float] = None
    ldl_mgdl: Optional[float] = None
    family_history: Optional[bool] = False
    smoking: Optional[bool] = False
    obesity: Optional[bool] = False
    
    # Relationships
    risk: RiskAssessment = Relationship(back_populates="heart_assessment")

class HeartRecommendation(SQLModel, table=True):
    __tablename__ = "heart_recommendations"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: Optional[UUID] = Field(foreign_key="users.id", default=None)
    risk_id: UUID = Field(foreign_key="risk_assessments.id")
    title: str = Field(max_length=400)
    details: Optional[str] = None
    priority: Priority = Field(default=Priority.MEDIUM)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="open", max_length=50)

# Analytics and Audit
class AnalyticsEvent(SQLModel, table=True):
    __tablename__ = "analytics_events"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: Optional[UUID] = Field(foreign_key="users.id", default=None)
    session_id: Optional[str] = Field(max_length=200, default=None)
    event_type: str = Field(max_length=100)
    payload: Optional[str] = None  # JSON
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_logs"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    actor_id: Optional[UUID] = Field(foreign_key="users.id", default=None)
    action: str = Field(max_length=200)
    resource_type: Optional[str] = Field(max_length=100)
    resource_id: Optional[UUID] = None
    details: Optional[str] = None  # JSON
    created_at: datetime = Field(default_factory=datetime.utcnow)