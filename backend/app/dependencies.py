from functools import lru_cache

from app.config import get_settings
from app.repository import CrisisRepository
from app.services.ai import AIAnalysisService
from app.services.news import NewsService
from app.services.processor import CrisisProcessor
from app.services.chat_history import ChatHistoryService


@lru_cache
def get_repository() -> CrisisRepository:
    return CrisisRepository(get_settings())


@lru_cache
def get_ai_service() -> AIAnalysisService:
    return AIAnalysisService(get_settings())


@lru_cache
def get_news_service() -> NewsService:
    return NewsService(get_settings())


def get_processor() -> CrisisProcessor:
    return CrisisProcessor(get_news_service(), get_ai_service(), get_repository())


# Chat history service - singleton
_chat_history_service: ChatHistoryService | None = None

def get_chat_history_service() -> ChatHistoryService:
    """Get or create the chat history service singleton."""
    global _chat_history_service
    if _chat_history_service is None:
        _chat_history_service = ChatHistoryService()
    return _chat_history_service

