"""Chat history management routes."""

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_chat_history_service
from app.services.chat_history import ChatHistoryService
from app.schemas import (
    ChatConversationDetailSchema,
    ChatConversationSchema,
    ChatHistoryListResponse,
    ChatStartRequest,
)
from app.models import ChatMessage

router = APIRouter(prefix="/api/history", tags=["chat_history"])
logger = logging.getLogger(__name__)


@router.post("/new", response_model=ChatConversationDetailSchema)
async def create_new_chat(
    request: ChatStartRequest | None = None,
    service: ChatHistoryService = Depends(get_chat_history_service),
):
    """Create a new chat conversation."""
    try:
        title = request.title if request else None
        conversation = service.create_conversation(title)
        
        # Convert to schema
        messages = [
            ChatMessage(
                id=msg.id,
                role=msg.role,
                text=msg.text,
                timestamp=msg.timestamp,
                sources=msg.sources
            )
            for msg in conversation.messages
        ]
        
        return ChatConversationDetailSchema(
            id=conversation.id,
            title=conversation.title,
            messages=messages,
            created_at=conversation.created_at,
            updated_at=conversation.updated_at
        )
    except Exception as e:
        logger.error(f"Error creating new chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list", response_model=ChatHistoryListResponse)
async def list_chats(
    limit: int = 50,
    offset: int = 0,
    service: ChatHistoryService = Depends(get_chat_history_service),
):
    """List all chat conversations."""
    try:
        conversations = service.list_conversations(limit, offset)
        
        # Convert to summaries
        summaries = [
            ChatConversationSchema(
                id=conv.id,
                title=conv.title,
                preview=conv.get_preview(),
                message_count=len(conv.messages),
                created_at=conv.created_at,
                updated_at=conv.updated_at
            )
            for conv in conversations
        ]
        
        return ChatHistoryListResponse(
            conversations=summaries,
            total=len(service.conversations)
        )
    except Exception as e:
        logger.error(f"Error listing chats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{conversation_id}", response_model=ChatConversationDetailSchema)
async def get_chat(
    conversation_id: UUID,
    service: ChatHistoryService = Depends(get_chat_history_service),
):
    """Get a specific chat conversation."""
    try:
        conversation = service.get_conversation(conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        # Switch to this conversation
        service.switch_conversation(conversation_id)
        
        # Convert messages
        messages = [
            ChatMessage(
                id=msg.id,
                role=msg.role,
                text=msg.text,
                timestamp=msg.timestamp,
                sources=msg.sources
            )
            for msg in conversation.messages
        ]
        
        return ChatConversationDetailSchema(
            id=conversation.id,
            title=conversation.title,
            messages=messages,
            created_at=conversation.created_at,
            updated_at=conversation.updated_at
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{conversation_id}")
async def delete_chat(
    conversation_id: UUID,
    service: ChatHistoryService = Depends(get_chat_history_service),
):
    """Delete a chat conversation."""
    try:
        if not service.delete_conversation(conversation_id):
            raise HTTPException(status_code=404, detail="Chat not found")
        
        return {"status": "deleted", "id": str(conversation_id)}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search/query", response_model=ChatHistoryListResponse)
async def search_chats(
    q: str,
    service: ChatHistoryService = Depends(get_chat_history_service),
):
    """Search chat conversations."""
    try:
        if not q or len(q) < 2:
            raise HTTPException(status_code=400, detail="Search query too short")
        
        conversations = service.search_conversations(q)
        
        # Convert to summaries
        summaries = [
            ChatConversationSchema(
                id=conv.id,
                title=conv.title,
                preview=conv.get_preview(),
                message_count=len(conv.messages),
                created_at=conv.created_at,
                updated_at=conv.updated_at
            )
            for conv in conversations
        ]
        
        return ChatHistoryListResponse(
            conversations=summaries,
            total=len(summaries)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error searching chats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/clear")
async def clear_all_chats(
    service: ChatHistoryService = Depends(get_chat_history_service),
):
    """Clear all chat conversations (for testing only)."""
    try:
        count = service.clear_all()
        return {"status": "cleared", "count": count}
    except Exception as e:
        logger.error(f"Error clearing chats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
