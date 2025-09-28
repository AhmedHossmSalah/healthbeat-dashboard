from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from datetime import timedelta
import structlog

from app.database import get_session
from app.schemas import UserRegister, UserLogin, Token, UserResponse, UserUpdate
from app.models import User, PatientProfile
from app.core.security import verify_password, create_access_token
from app.core.config import settings
from app.crud import create_user, get_user_by_email, update_patient_profile
from app.auth import get_current_active_user

logger = structlog.get_logger()
router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, session: Session = Depends(get_session)):
    """Register a new user"""
    # Check if user already exists
    existing_user = get_user_by_email(session, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
            headers={"code": "email_exists"}
        )
    
    # Create user
    user = create_user(session, user_data.email, user_data.password)
    
    # Update profile if full_name provided
    if user_data.full_name:
        update_patient_profile(session, user.id, {"full_name": user_data.full_name})
    
    logger.info("User registered successfully", user_id=str(user.id), email=user_data.email)
    
    return UserResponse(
        id=user.id,
        email=user.email,
        role=user.role,
        status=user.status,
        created_at=user.created_at,
        full_name=user_data.full_name
    )

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, session: Session = Depends(get_session)):
    """Authenticate user and return access token"""
    user = get_user_by_email(session, user_credentials.email)
    
    if not user or not verify_password(user_credentials.password, user.password_hash):
        logger.warning("Failed login attempt", email=user_credentials.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer", "code": "invalid_credentials"},
        )
    
    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is not active",
            headers={"code": "account_inactive"}
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, 
        expires_delta=access_token_expires
    )
    
    logger.info("User logged in successfully", user_id=str(user.id), email=user.email)
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Get current user profile"""
    # Get patient profile if exists
    profile_data = {}
    if current_user.role == "patient" and current_user.patient_profile:
        profile = current_user.patient_profile
        profile_data = {
            "full_name": profile.full_name,
            "sex": profile.sex,
            "birth_date": profile.birth_date
        }
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        role=current_user.role,
        status=current_user.status,
        created_at=current_user.created_at,
        **profile_data
    )

@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    profile_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Update current user profile"""
    if current_user.role == "patient":
        profile_data = profile_update.dict(exclude_unset=True)
        update_patient_profile(session, current_user.id, profile_data)
        
        logger.info("User profile updated", user_id=str(current_user.id))
    
    # Refresh user data
    session.refresh(current_user)
    
    profile_data = {}
    if current_user.patient_profile:
        profile = current_user.patient_profile
        profile_data = {
            "full_name": profile.full_name,
            "sex": profile.sex,
            "birth_date": profile.birth_date
        }
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        role=current_user.role,
        status=current_user.status,
        created_at=current_user.created_at,
        **profile_data
    )