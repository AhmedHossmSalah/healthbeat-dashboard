from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session
from typing import Optional
from uuid import UUID
import json
import structlog

from app.database import get_session
from app.schemas import DraftCreate, DraftResponse
from app.models import User
from app.crud import upsert_draft, get_draft, get_assessment_type_by_slug
from app.auth import get_current_user_optional

logger = structlog.get_logger()
router = APIRouter()

@router.post("/", response_model=DraftResponse, status_code=status.HTTP_201_CREATED)
async def save_draft(
    draft_data: DraftCreate,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Save or update assessment draft"""
    # Get assessment type
    assessment_type = get_assessment_type_by_slug(session, draft_data.assessment_type_id)
    if not assessment_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment type not found"
        )
    
    # Use current user if authenticated, otherwise use provided user_id or session_id
    user_id = current_user.id if current_user else draft_data.user_id
    session_id = draft_data.session_id if not current_user else None
    
    if not user_id and not session_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either user authentication or session_id is required"
        )
    
    # Upsert draft
    draft = upsert_draft(
        session, 
        assessment_type.id, 
        user_id, 
        session_id, 
        draft_data.data
    )
    
    logger.info("Draft saved", draft_id=str(draft.id), assessment_type=draft_data.assessment_type_id)
    
    return DraftResponse(
        id=draft.id,
        assessment_type_id=draft.assessment_type_id,
        user_id=draft.user_id,
        session_id=draft.session_id,
        data=json.loads(draft.data),
        last_saved_at=draft.last_saved_at,
        created_at=draft.created_at
    )

@router.get("/", response_model=Optional[DraftResponse])
async def get_draft_data(
    assessment_type_id: str = Query(..., description="Assessment type slug"),
    session_id: Optional[str] = Query(None, description="Session ID for anonymous users"),
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Get draft data by user or session"""
    # Get assessment type
    assessment_type = get_assessment_type_by_slug(session, assessment_type_id)
    if not assessment_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment type not found"
        )
    
    # Use current user if authenticated, otherwise use session_id
    user_id = current_user.id if current_user else None
    
    if not user_id and not session_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either user authentication or session_id is required"
        )
    
    draft = get_draft(session, assessment_type.id, user_id, session_id)
    
    if not draft:
        return None
    
    return DraftResponse(
        id=draft.id,
        assessment_type_id=draft.assessment_type_id,
        user_id=draft.user_id,
        session_id=draft.session_id,
        data=json.loads(draft.data),
        last_saved_at=draft.last_saved_at,
        created_at=draft.created_at
    )

@router.delete("/{draft_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_draft(
    draft_id: UUID,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Delete draft"""
    from sqlmodel import select
    from app.models import AssessmentDraft
    
    statement = select(AssessmentDraft).where(AssessmentDraft.id == draft_id)
    draft = session.exec(statement).first()
    
    if not draft:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Draft not found"
        )
    
    # Check permissions
    if current_user and draft.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this draft"
        )
    
    session.delete(draft)
    session.commit()
    
    logger.info("Draft deleted", draft_id=str(draft_id))