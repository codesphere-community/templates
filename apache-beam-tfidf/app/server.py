from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from pydantic import BaseModel, Field

from app import database


@asynccontextmanager
async def lifespan(_: FastAPI):
    database.init_db()
    yield


app = FastAPI(title="Apache Beam TF-IDF Keyword Webhook", lifespan=lifespan)


class BlogPostPayload(BaseModel):
    slug: str = Field(min_length=1, max_length=140, pattern=r"^[a-zA-Z0-9][a-zA-Z0-9_-]*$")
    title: str = Field(min_length=1, max_length=240)
    body: str = Field(min_length=20)


@app.get("/")
async def index() -> dict:
    return {
        "name": "Apache Beam TF-IDF Keyword Webhook",
        "endpoints": ["/webhook/blogposts", "/posts", "/posts/{slug}/keywords"],
    }


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@app.post("/webhook/blogposts")
async def ingest_blogpost(payload: BlogPostPayload) -> dict:
    post = database.upsert_post(payload.slug, payload.title, payload.body)
    return {"accepted": True, "post": post}


@app.get("/posts")
async def posts() -> list[dict]:
    return database.list_posts()


@app.get("/posts/{slug}/keywords")
async def keywords(slug: str) -> list[dict]:
    return database.list_keywords(slug)
