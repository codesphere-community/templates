from __future__ import annotations

import json
import sqlite3
from pathlib import Path

DATABASE_PATH = Path(__file__).resolve().parents[1] / "beam_tfidf.db"


def connect() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with connect() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS blog_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT NOT NULL UNIQUE,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                processed_at TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS post_keywords (
                post_slug TEXT NOT NULL,
                keyword TEXT NOT NULL,
                score REAL NOT NULL,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (post_slug, keyword)
            )
            """
        )


def upsert_post(slug: str, title: str, body: str) -> dict:
    with connect() as connection:
        connection.execute(
            """
            INSERT INTO blog_posts (slug, title, body, processed_at)
            VALUES (?, ?, ?, NULL)
            ON CONFLICT(slug) DO UPDATE SET
                title = excluded.title,
                body = excluded.body,
                processed_at = NULL
            """,
            (slug, title, body),
        )
        row = connection.execute(
            "SELECT slug, title, body, created_at, processed_at FROM blog_posts WHERE slug = ?",
            (slug,),
        ).fetchone()
    return dict(row)


def list_posts() -> list[dict]:
    with connect() as connection:
        rows = connection.execute(
            "SELECT slug, title, body, created_at, processed_at FROM blog_posts ORDER BY created_at DESC"
        ).fetchall()
    return [dict(row) for row in rows]


def list_keywords(slug: str) -> list[dict]:
    with connect() as connection:
        rows = connection.execute(
            """
            SELECT keyword, score, updated_at
            FROM post_keywords
            WHERE post_slug = ?
            ORDER BY score DESC, keyword ASC
            """,
            (slug,),
        ).fetchall()
    return [dict(row) for row in rows]


def replace_keywords(results: list[dict]) -> None:
    with connect() as connection:
        slugs = sorted({row["slug"] for row in results})
        for slug in slugs:
            connection.execute("DELETE FROM post_keywords WHERE post_slug = ?", (slug,))
        connection.executemany(
            """
            INSERT INTO post_keywords (post_slug, keyword, score)
            VALUES (?, ?, ?)
            """,
            [(row["slug"], row["keyword"], row["score"]) for row in results],
        )
        connection.executemany(
            "UPDATE blog_posts SET processed_at = CURRENT_TIMESTAMP WHERE slug = ?",
            [(slug,) for slug in slugs],
        )


def export_posts_json() -> str:
    return json.dumps(list_posts())
