"""Chat history management service.

Stores and manages chat conversations. Currently uses in-memory storage,
which can be upgraded to use a real database later.
"""

import logging
from uuid import UUID, uuid4
from datetime import datetime

from app.models import ChatMessage, ChatConversation, utc_now

logger = logging.getLogger(__name__)


class ChatHistoryService:
    """Service for managing chat conversations."""
    
    def __init__(self):
        # In-memory storage for conversations
        # In production, this would be a database
        self.conversations: dict[UUID, ChatConversation] = {}
        self.current_conversation_id: UUID | None = None
        logger.info("Chat history service initialized")
    
    def create_conversation(self, title: str = None) -> ChatConversation:
        """Create a new chat conversation."""
        conversation = ChatConversation(
            title=title or "New Chat",
            messages=[],
            created_at=utc_now(),
            updated_at=utc_now()
        )
        self.conversations[conversation.id] = conversation
        self.current_conversation_id = conversation.id
        logger.info(f"Created new conversation: {conversation.id}")
        return conversation
    
    def get_conversation(self, conversation_id: UUID) -> ChatConversation | None:
        """Get a specific conversation."""
        return self.conversations.get(conversation_id)
    
    def get_current_conversation(self) -> ChatConversation | None:
        """Get the current active conversation."""
        if self.current_conversation_id:
            return self.conversations.get(self.current_conversation_id)
        return None
    
    def switch_conversation(self, conversation_id: UUID) -> bool:
        """Switch to a different conversation."""
        if conversation_id in self.conversations:
            self.current_conversation_id = conversation_id
            logger.info(f"Switched to conversation: {conversation_id}")
            return True
        logger.warning(f"Conversation not found: {conversation_id}")
        return False
    
    def add_message(
        self,
        conversation_id: UUID,
        role: str,
        text: str,
        sources: list[UUID] = None
    ) -> ChatMessage | None:
        """Add a message to a conversation."""
        conversation = self.conversations.get(conversation_id)
        if not conversation:
            logger.warning(f"Conversation not found: {conversation_id}")
            return None
        
        message = conversation.add_message(role, text, sources)
        
        # Update title from first user message
        if conversation.title == "New Chat" and role == "user":
            first_msg = message.text[:50]
            conversation.title = first_msg if len(first_msg) < 50 else first_msg + "..."
            logger.debug(f"Updated conversation title: {conversation.title}")
        
        logger.debug(f"Added {role} message to conversation {conversation_id}")
        return message
    
    def list_conversations(self, limit: int = 50, offset: int = 0) -> list[ChatConversation]:
        """List all conversations sorted by update time (newest first)."""
        conversations = sorted(
            self.conversations.values(),
            key=lambda c: c.updated_at,
            reverse=True
        )
        return conversations[offset:offset + limit]
    
    def delete_conversation(self, conversation_id: UUID) -> bool:
        """Delete a conversation."""
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]
            if self.current_conversation_id == conversation_id:
                self.current_conversation_id = None
            logger.info(f"Deleted conversation: {conversation_id}")
            return True
        logger.warning(f"Conversation not found: {conversation_id}")
        return False
    
    def search_conversations(self, query: str) -> list[ChatConversation]:
        """Search conversations by title or content."""
        query_lower = query.lower()
        results = []
        
        for conversation in self.conversations.values():
            # Search in title
            if query_lower in conversation.title.lower():
                results.append(conversation)
                continue
            
            # Search in messages
            for message in conversation.messages:
                if query_lower in message.text.lower():
                    results.append(conversation)
                    break
        
        return sorted(results, key=lambda c: c.updated_at, reverse=True)
    
    def clear_all(self) -> int:
        """Clear all conversations (for testing)."""
        count = len(self.conversations)
        self.conversations.clear()
        self.current_conversation_id = None
        logger.warning(f"Cleared all {count} conversations")
        return count
