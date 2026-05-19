import asyncio
import socket
import ssl

import certifi
import httpx
from fastapi import APIRouter
from app.config import get_settings

router = APIRouter(prefix="/api/debug", tags=["debug"])

@router.get("/ai")
async def ai_settings():
    s = get_settings()
    has_key = False
    detail = None
    if s.ai_provider == 'groq':
        has_key = bool(s.groq_api_key)
        if not has_key:
            detail = "GROQ_API_KEY is not configured."
    elif s.ai_provider == 'openai':
        has_key = bool(s.openai_api_key)
        if not has_key:
            detail = "OPENAI_API_KEY is not configured."
    elif s.ai_provider == 'anthropic':
        has_key = bool(s.anthropic_api_key)
        if not has_key:
            detail = "ANTHROPIC_API_KEY is not configured."
    result = {"ai_provider": s.ai_provider, "has_key": has_key}
    if detail:
        result["detail"] = detail
    return result

@router.get("/groq-test")
async def groq_test():
    endpoint = "https://api.groq.com/openai/v1/chat/completions"
    result = {
        "endpoint": endpoint,
        "ssl_version": ssl.OPENSSL_VERSION,
        "dns": None,
        "dns_error": None,
        "status_code": None,
        "response_headers": None,
        "response_preview": None,
        "connect_error": None,
    }

    try:
        addr_info = await asyncio.to_thread(socket.getaddrinfo, "api.groq.com", 443, type=socket.SOCK_STREAM)
        result["dns"] = [
            {"family": ai[0], "address": ai[4][0], "port": ai[4][1]} for ai in addr_info
        ]
    except Exception as exc:
        result["dns_error"] = str(exc)

    ssl_context = ssl.create_default_context(cafile=certifi.where())
    if hasattr(ssl, "TLSVersion"):
        ssl_context.minimum_version = ssl.TLSVersion.TLSv1_2

    if (api_key := get_settings().groq_api_key):
        body = {
            "model": get_settings().groq_model,
            "messages": [
                {"role": "system", "content": "Groq connectivity test. Respond with a short confirmation message."},
                {"role": "user", "content": "Hello"},
            ],
            "temperature": 0.0,
            "max_tokens": 50,
        }

        async with httpx.AsyncClient(timeout=httpx.Timeout(60.0, connect=30.0), verify=ssl_context) as client:
            try:
                resp = await client.post(endpoint, headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}, json=body)
                result["status_code"] = resp.status_code
                result["response_headers"] = dict(resp.headers)
                result["response_preview"] = resp.text[:1000]
                return result
            except Exception as exc:
                result["connect_error"] = str(exc)
                return result
    else:
        result["groq_key_status"] = {"status_code": None, "detail": "GROQ_API_KEY is not configured."}

    return result

