from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Optional
import structlog

from app.database import get_session
from app.schemas import AnalyticsEventCreate
from app.models import User
from app.crud import create_analytics_event
from app.auth import get_current_user_optional

logger = structlog.get_logger()
router = APIRouter()

@router.post("/events", status_code=status.HTTP_201_CREATED)
async def track_event(
    event_data: AnalyticsEventCreate,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Track analytics event"""
    user_id = current_user.id if current_user else event_data.user_id
    
    event = create_analytics_event(
        session,
        user_id,
        event_data.session_id,
        event_data.event_type,
        event_data.payload
    )
    
    logger.info(
        "Analytics event tracked",
        event_id=str(event.id),
        event_type=event_data.event_type,
        user_id=str(user_id) if user_id else None
    )
    
    return {"message": "Event tracked successfully", "event_id": event.id}