from fastapi import APIRouter, Depends, HTTPException
import logging
from uuid import UUID

from app.dependencies import get_ai_service, get_repository, get_chat_history_service
from app.repository import CrisisRepository
from app.schemas import ChatRequest, ChatResponse
from app.services.ai import AIAnalysisService
from app.services.chat_history import ChatHistoryService

router = APIRouter(prefix="/api/chat", tags=["chat"])
logger = logging.getLogger(__name__)


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    repository: CrisisRepository = Depends(get_repository),
    ai_service: AIAnalysisService = Depends(get_ai_service),
    history_service: ChatHistoryService = Depends(get_chat_history_service),
):
    try:
        if not request.message or not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        logger.info(f"Chat request: {request.message[:100]}")
        
        # Get or create current conversation
        conversation = history_service.get_current_conversation()
        if not conversation:
            conversation = history_service.create_conversation()
            logger.debug(f"Created new conversation: {conversation.id}")
        
        # Add user message to history and then build the full conversation messages.
        user_msg = history_service.add_message(
            conversation.id,
            "user",
            request.message,
            sources=[]
        )
        logger.debug("User message added to history: %s", str(user_msg.id))

        if request.history:
            conversation_messages = [
                {"role": item.role, "content": item.text}
                for item in request.history
                if item.role in {"user", "assistant"} and item.text and item.text.strip()
            ]
            if not conversation_messages or conversation_messages[-1]["role"] != "user":
                conversation_messages.append({"role": "user", "content": request.message})
        else:
            current_conv = history_service.get_conversation(conversation.id)
            conversation_messages = [
                {"role": m.role, "content": m.text} for m in current_conv.messages
            ]
        logger.debug("Conversation message count to send: %d", len(conversation_messages))
        
        # Search for relevant events
        events = await repository.search(request.message, limit=6)
        
        # If no search results, get recent events
        if not events:
            events = await repository.list_events(limit=6)
            logger.debug(f"No search results, returned {len(events)} recent events")
        else:
            logger.debug(f"Found {len(events)} matching events")
        
        # Build context from events
        context = "\n\n".join(
            [
                f"Event: {event.event_name}\nTitle: {event.title}\nSummary: {event.summary}\nPredictions: "
                + "; ".join(
                    f"{prediction.sector_name} {prediction.direction.value} ({prediction.confidence}%): {prediction.reasoning}"
                    for prediction in event.predictions
                )
                for event in events
            ]
        )
        
        # Generate answer from AI service using full conversation history
        try:
            logger.info("Sending conversation to AI service (user preview): %s", request.message[:120])
            answer = await ai_service.answer_chat(conversation_messages, context)
        except Exception as exc:
            # Log full error and return the message to the client for debugging
            logger.error("AI service failed to generate answer: %s", exc, exc_info=True)
            # Avoid exposing secrets but return a helpful message
            detail = str(exc) if isinstance(exc, Exception) else "AI provider error"
            raise HTTPException(status_code=502, detail=detail)

        if not answer or not str(answer).strip():
            logger.warning("AI service returned empty answer")
            raise HTTPException(status_code=500, detail="Failed to generate response")

        logger.info("Chat response generated successfully (len=%d)", len(answer))

        # Add AI response to history (only on success)
        source_ids = [event.id for event in events]
        history_service.add_message(
            conversation.id,
            "assistant",
            answer,
            sources=source_ids
        )
        logger.debug("Assistant message added to history")

        return ChatResponse(answer=answer, sources=source_ids)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


