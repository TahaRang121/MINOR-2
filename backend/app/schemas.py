from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field

from app.models import Category, Direction, Severity


class EventFilters(BaseModel):
    category: Category | None = None
    severity: Severity | None = None
    date_from: date | None = None
    date_to: date | None = None
    limit: int = Field(default=20, ge=1, le=100)
    offset: int = Field(default=0, ge=0)


class PredictionFilters(BaseModel):
    sector: str | None = None
    direction: Direction | None = None
    limit: int = Field(default=50, ge=1, le=200)


class ChatHistoryItem(BaseModel):
    role: Literal["user", "assistant"]
    text: str = Field(min_length=1, max_length=2000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    history: list[ChatHistoryItem] = Field(default_factory=list)


class ChatResponse(BaseModel):
    answer: str
    sources: list[UUID] = []


class FetchResponse(BaseModel):
    created_events: int
    created_predictions: int
    mode: str


# Chat History Schemas
class ChatMessageSchema(BaseModel):
    """Chat message with metadata."""
    id: UUID
    role: str  # "user" or "assistant"
    text: str
    timestamp: datetime
    sources: list[UUID] = []


class ChatConversationSchema(BaseModel):
    """Chat conversation summary."""
    id: UUID
    title: str
    preview: str
    message_count: int
    created_at: datetime
    updated_at: datetime


class ChatConversationDetailSchema(BaseModel):
    """Complete chat conversation with all messages."""
    id: UUID
    title: str
    messages: list[ChatMessageSchema]
    created_at: datetime
    updated_at: datetime


class ChatStartRequest(BaseModel):
    """Request to start a new chat (optional title)."""
    title: str | None = None


class ChatHistoryListResponse(BaseModel):
    """Response with list of conversations."""
    conversations: list[ChatConversationSchema]
    total: int

