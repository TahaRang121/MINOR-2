from contextlib import asynccontextmanager
from pathlib import Path
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load .env from the backend folder before app startup so pydantic-settings sees env vars.
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(env_path)
print(f"Loaded .env from {env_path}: {env_path.exists()}")
print("GROQ KEY LOADED:", bool(os.getenv("GROQ_API_KEY")))

from app.config import get_settings
from app.dependencies import get_processor, get_chat_history_service
from app.routes import chat, events, predictions, search, history, debug
from app.scheduler import build_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    scheduler = build_scheduler(settings, get_processor())
    scheduler.start()
    app.state.scheduler = scheduler
    
    # Initialize chat history service
    get_chat_history_service()
    if settings.ai_provider == 'groq' and not settings.groq_api_key:
        import logging
        logging.getLogger(__name__).warning('AI provider set to groq but GROQ API key is not configured. Set GROQ_API_KEY in .env.')

    yield
    scheduler.shutdown(wait=False)


app = FastAPI(
    title="Global Crisis Market Intelligence API",
    version="0.1.0",
    lifespan=lifespan,
)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router)
app.include_router(predictions.router)
app.include_router(search.router)
app.include_router(chat.router)
app.include_router(history.router)
app.include_router(debug.router)


@app.get("/health")
async def health():
    return {"status": "ok"}

