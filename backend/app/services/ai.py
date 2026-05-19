import json
import logging
import ssl
from uuid import uuid4

import certifi
import httpx

from app.config import Settings
from app.models import Category, CrisisEvent, Direction, NewsArticle, SectorPrediction, Severity


SYSTEM_PROMPT = """You are a financial crisis market analyst.
Return strict JSON with keys: event_name, location, category, severity, summary, predictions.
category must be one of: Geopolitical, Economic, Natural Disaster, Energy, Health.
severity must be one of: Low, Medium, High.
summary must be exactly three concise sentences.
predictions is an array of objects: sector_name, direction, confidence, reasoning.
direction must be rise, fall, or neutral. confidence is 0 to 100. reasoning is 2-3 sentences."""
logger = logging.getLogger(__name__)


class AIAnalysisService:
    def __init__(self, settings: Settings):
        self.settings = settings
        # Validate provider configuration early and create helpful message
        self._missing_provider_key: str | None = None
        if self.settings.ai_provider == 'groq' and not self.settings.groq_api_key:
            self._missing_provider_key = 'GROQ API key is not configured (GROQ_API_KEY).'
            logger.warning(self._missing_provider_key)
        if self.settings.ai_provider == 'openai' and not self.settings.openai_api_key:
            self._missing_provider_key = 'OpenAI API key is not configured (OPENAI_API_KEY).'
            logger.warning(self._missing_provider_key)
        if self.settings.ai_provider == 'anthropic' and not self.settings.anthropic_api_key:
            self._missing_provider_key = 'Anthropic API key is not configured (ANTHROPIC_API_KEY).'
            logger.warning(self._missing_provider_key)

    async def analyze_article(self, article: NewsArticle) -> CrisisEvent:
        if getattr(self, '_missing_provider_key', None):
            raise RuntimeError(self._missing_provider_key)
        if self.settings.ai_provider == "openai" and self.settings.openai_api_key:
            payload = await self._openai(article)
        elif self.settings.ai_provider == "anthropic" and self.settings.anthropic_api_key:
            payload = await self._anthropic(article)
        elif self.settings.ai_provider == "groq" and self.settings.groq_api_key:
            payload = await self._groq(article)
        else:
            raise RuntimeError("No AI provider configured or API key missing")
        return self._event_from_payload(article, payload)

    async def answer_chat(self, conversation_messages: list[dict], context: str) -> str:
        """
        Send the full conversation history to Groq and return the assistant reply text.
        `conversation_messages` is a list of dicts with keys: role (user/assistant) and content/text.
        """
        system_content = (
            "Use the provided crisis market context and the conversation history to answer the user's question "
            "clearly and concisely. Base the response on the supplied event context and do not invent sources or event details."
        )
        messages_payload = [{"role": "system", "content": f"Context:\n{context}\n\n{system_content}"}]

        for m in conversation_messages:
            role = m.get("role")
            content = m.get("content") or m.get("text") or ""
            if role and content is not None:
                messages_payload.append({"role": role, "content": content})

        logger.debug("Prepared messages payload to AI provider: %s", [
            {"role": m.get("role"), "len": len(m.get("content", ""))} for m in messages_payload
        ])

        if getattr(self, '_missing_provider_key', None):
            raise RuntimeError(self._missing_provider_key)

        async def _call_chat_endpoint(url: str, headers: dict, body: dict):
            ssl_context = ssl.create_default_context(cafile=certifi.where())
            if hasattr(ssl, "TLSVersion"):
                ssl_context.minimum_version = ssl.TLSVersion.TLSv1_2
            safe_headers = {k: v for k, v in headers.items() if k.lower() != "authorization"}
            logger.info("Sending request to AI provider: %s", url)
            logger.debug("SSL/OpenSSL version: %s", ssl.OPENSSL_VERSION)
            logger.debug("Safe request headers: %s", safe_headers)
            logger.debug("Request body sample: %s", {"model": body.get("model"), "messages_count": len(body.get("messages", []))})
            try:
                async with httpx.AsyncClient(timeout=httpx.Timeout(60.0, connect=30.0), verify=ssl_context) as client:
                    resp = await client.post(url, headers=headers, json=body)
                    logger.info("AI provider response status: %s", resp.status_code)
                    logger.debug("AI provider response headers: %s", dict(resp.headers))
                    resp.raise_for_status()
                    return resp.json()
            except httpx.HTTPStatusError as exc:
                logger.error("AI provider HTTP status error: %s", exc, exc_info=True)
                error_text = exc.response.text
                try:
                    error_payload = exc.response.json()
                    error_message = error_payload.get("error") or error_payload.get("message") or error_text
                except Exception:
                    error_message = error_text or str(exc)
                raise RuntimeError(f"AI provider HTTP error {exc.response.status_code}: {error_message}") from exc
            except httpx.TimeoutException as exc:
                logger.error("AI provider timeout error: %s", exc, exc_info=True)
                raise RuntimeError("AI provider request timed out. Please try again.") from exc
            except httpx.TransportError as exc:
                logger.error("AI provider transport error: %s", exc, exc_info=True)
                raise RuntimeError("Unable to connect to the AI provider. Please check network connectivity.") from exc
            except Exception as exc:
                logger.error("AI provider HTTP/TLS error: %s", exc, exc_info=True)
                raise RuntimeError("Unexpected error communicating with AI provider.") from exc

        try:
            if self.settings.ai_provider != "groq" or not self.settings.groq_api_key:
                raise RuntimeError("Groq AI provider is required and GROQ_API_KEY must be configured.")

            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {self.settings.groq_api_key}",
                "Content-Type": "application/json",
            }

            models_to_try = [self.settings.groq_model]
            if self.settings.groq_fallback_model and self.settings.groq_fallback_model != self.settings.groq_model:
                models_to_try.append(self.settings.groq_fallback_model)

            last_error = None
            for idx, model in enumerate(models_to_try):
                body = {
                    "model": model,
                    "messages": messages_payload,
                    "temperature": 0.7,
                    "max_tokens": 700,
                    "n": 1,
                }
                logger.info("Sending Groq request with model: %s", model)
                if idx > 0:
                    logger.warning("Retrying with fallback Groq model: %s", model)
                logger.debug("Calling Groq URL: %s", url)
                logger.debug("Groq request payload: %s", {"model": body["model"], "temperature": body["temperature"], "max_tokens": body["max_tokens"], "messages_count": len(messages_payload)})

                try:
                    resp_json = await _call_chat_endpoint(url, headers, body)
                    logger.info("Groq response received from model %s", model)
                    logger.debug("Groq assistant response preview: %s", str(resp_json)[:500])
                    assistant_text = resp_json["choices"][0]["message"]["content"]
                    assistant_text = assistant_text.strip()
                    logger.info("Groq assistant reply length=%d", len(assistant_text))
                    logger.debug("Groq assistant reply preview: %s", assistant_text[:300])
                    return assistant_text
                except Exception as exc:
                    last_error = exc
                    logger.error("Groq provider error for model %s: %s", model, exc, exc_info=True)
                    if idx == len(models_to_try) - 1:
                        break
                    logger.warning("Model %s failed, attempting fallback model %s", model, models_to_try[idx + 1])

            raise RuntimeError(f"Groq provider error: {last_error}") from last_error

        except Exception as exc:
            logger.error("AI provider call failed: %s", exc, exc_info=True)
            raise RuntimeError(f"AI provider error: {str(exc)}")


    async def _openai(self, article: NewsArticle) -> dict:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {self.settings.openai_api_key}"},
                json={
                    "model": self.settings.openai_model,
                    "response_format": {"type": "json_object"},
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": self._article_prompt(article)},
                    ],
                },
            )
            response.raise_for_status()
            return json.loads(response.json()["choices"][0]["message"]["content"])

    async def _anthropic(self, article: NewsArticle) -> dict:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": self.settings.anthropic_api_key,
                    "anthropic-version": "2023-06-01",
                },
                json={
                    "model": self.settings.anthropic_model,
                    "max_tokens": 900,
                    "system": SYSTEM_PROMPT,
                    "messages": [{"role": "user", "content": self._article_prompt(article)}],
                },
            )
            response.raise_for_status()
            return json.loads(response.json()["content"][0]["text"])

    async def _groq(self, article: NewsArticle) -> dict:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {self.settings.groq_api_key}"},
                json={
                    "model": self.settings.groq_model,
                    "messages": [
                        {
                            "role": "system",
                            "content": SYSTEM_PROMPT
                            + "\nReturn ONLY raw JSON. No markdown, no backticks. No newlines inside string values.",
                        },
                        {"role": "user", "content": self._article_prompt(article)},
                    ],
                },
            )
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"].strip()
            content = content.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            content = "".join(char if char in "\n\r\t" or ord(char) >= 32 else " " for char in content)
            return json.loads(content)

    def _article_prompt(self, article: NewsArticle) -> str:
        return f"Title: {article.title}\nSource: {article.source}\nDescription: {article.description}\nContent: {article.content}"

    def _event_from_payload(self, article: NewsArticle, payload: dict) -> CrisisEvent:
        event_id = uuid4()
        event = CrisisEvent(
            id=event_id,
            title=article.title,
            event_name=payload.get("event_name") or article.title[:80],
            location=payload.get("location") or "Global",
            category=self._enum_value(Category, payload.get("category"), Category.economic),
            severity=self._enum_value(Severity, payload.get("severity"), Severity.medium),
            summary=payload.get("summary") or article.description or article.title,
            source_url=article.source_url,
            published_at=article.published_at,
        )
        predictions = payload.get("predictions", [])
        if not isinstance(predictions, list):
            predictions = []
        event.predictions = [
            SectorPrediction(
                event_id=event_id,
                sector_name=item.get("sector_name", "Broad Market"),
                direction=self._enum_value(Direction, item.get("direction"), Direction.neutral),
                confidence=self._confidence(item.get("confidence", 50)),
                reasoning=item.get("reasoning", "The event may influence investor risk appetite and sector positioning."),
            )
            for item in predictions
            if isinstance(item, dict)
        ]
        return event

    def _enum_value(self, enum_type, value, default):
        try:
            return enum_type(value or default.value)
        except (TypeError, ValueError):
            return default

    def _confidence(self, value) -> int:
        try:
            confidence = int(value)
        except (TypeError, ValueError):
            confidence = 50
        return max(0, min(100, confidence))
