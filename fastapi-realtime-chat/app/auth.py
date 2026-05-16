from __future__ import annotations

import secrets
from typing import Annotated

from fastapi import Depends, HTTPException, Query, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

DEMO_USERS = {
    "ada": "codesphere",
    "grace": "codesphere",
    "linus": "codesphere",
}

_active_tokens: dict[str, str] = {}
_bearer = HTTPBearer(auto_error=False)


def login(username: str, password: str) -> str:
    if DEMO_USERS.get(username) != password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    token = secrets.token_urlsafe(24)
    _active_tokens[token] = username
    return token


def username_for_token(token: str | None) -> str | None:
    if not token:
        return None
    return _active_tokens.get(token)


def require_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
) -> str:
    username = username_for_token(credentials.credentials if credentials else None)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid token",
        )
    return username


def require_socket_user(token: Annotated[str | None, Query()] = None) -> str:
    username = username_for_token(token)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid token",
        )
    return username
