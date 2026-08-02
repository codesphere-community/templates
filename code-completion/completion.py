"""Small, dependency-free client for a local OpenAI-compatible model."""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from typing import Any, Callable


DEFAULT_MODEL_BASE_URL = "http://127.0.0.1:8080/v1"
MAX_SOURCE_CHARS = 120_000


def build_prompt(prefix: str, suffix: str, language: str) -> str:
    """Build a conservative fill-in-the-middle prompt for a local model."""

    prefix = prefix[-MAX_SOURCE_CHARS:]
    suffix = suffix[:MAX_SOURCE_CHARS]
    language = (language or "text").strip()[:40]
    return (
        "You are a code-completion engine. Return only the code that should be "
        "inserted at the cursor; do not add markdown fences or explanations.\n"
        f"Language: {language}\n\n"
        "<prefix>\n"
        f"{prefix}\n"
        "</prefix>\n"
        "<suffix>\n"
        f"{suffix}\n"
        "</suffix>\n"
        "<completion>\n"
    )


def _model_url() -> str:
    base = os.environ.get("MODEL_BASE_URL", DEFAULT_MODEL_BASE_URL).rstrip("/")
    return f"{base}/completions"


def request_completion(
    prefix: str,
    suffix: str,
    language: str,
    *,
    max_tokens: int = 160,
    temperature: float = 0.1,
    opener: Callable[..., Any] = urllib.request.urlopen,
) -> str:
    """Request a completion without ever logging or returning credentials."""

    if not isinstance(prefix, str) or not isinstance(suffix, str):
        raise ValueError("prefix and suffix must be strings")
    if not 1 <= max_tokens <= 1024:
        raise ValueError("max_tokens must be between 1 and 1024")
    payload = {
        "prompt": build_prompt(prefix, suffix, language),
        "max_tokens": max_tokens,
        "temperature": max(0.0, min(float(temperature), 1.0)),
        "stop": ["</completion>"],
    }
    request = urllib.request.Request(
        _model_url(),
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    api_key = os.environ.get("MODEL_API_KEY")
    if api_key:
        request.add_header("Authorization", f"Bearer {api_key}")
    try:
        response = opener(request, timeout=30)
        raw = response.read()
    except urllib.error.HTTPError as exc:
        raise RuntimeError(f"model server returned HTTP {exc.code}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError("model server is unavailable") from exc
    data = json.loads(raw.decode("utf-8"))
    choices = data.get("choices") or []
    if not choices:
        raise RuntimeError("model response contained no choices")
    choice = choices[0]
    text = choice.get("text")
    if text is None and isinstance(choice.get("message"), dict):
        text = choice["message"].get("content")
    if not isinstance(text, str):
        raise RuntimeError("model response contained no completion text")
    return text.strip()
