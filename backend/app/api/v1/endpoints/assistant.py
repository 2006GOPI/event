from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.deps import get_current_user, get_optional_current_user
from app.db.session import get_db
from app.models.chat import ChatMessage
from app.models.user import User
from app.schemas.assistant import ChatMessageResponse, ChatRequest, ChatResponse
from app.services.assistant_service import AssistantService

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat_with_assistant(
    request: ChatRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    return AssistantService.process_chat(
        db=db, current_user=current_user, request=request
    )


@router.get("/history", response_model=List[ChatMessageResponse])
def get_chat_history(
    conversation_id: str = Query("default", description="Conversation ID"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    history = (
        db.query(ChatMessage)
        .filter(
            ChatMessage.user_id == current_user.id,
            ChatMessage.conversation_id == conversation_id,
        )
        .order_by(ChatMessage.created_at.asc())
        .limit(50)
        .all()
    )
    return [ChatMessageResponse.model_validate(msg) for msg in history]
