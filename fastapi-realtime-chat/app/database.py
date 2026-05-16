from __future__ import annotations

import sqlite3
from pathlib import Path

DATABASE_PATH = Path(__file__).resolve().parents[1] / "chat.db"


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                room TEXT NOT NULL,
                username TEXT NOT NULL,
                body TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )


def save_message(room: str, username: str, body: str) -> dict:
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO messages (room, username, body)
            VALUES (?, ?, ?)
            RETURNING id, room, username, body, created_at
            """,
            (room, username, body),
        )
        row = cursor.fetchone()
        connection.commit()
    return dict(row)


def list_messages(room: str, limit: int = 50) -> list[dict]:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT id, room, username, body, created_at
            FROM messages
            WHERE room = ?
            ORDER BY id DESC
            LIMIT ?
            """,
            (room, limit),
        ).fetchall()
    return [dict(row) for row in reversed(rows)]
