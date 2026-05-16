from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from app import auth, database

ROOMS = ["general", "product", "support"]


@asynccontextmanager
async def lifespan(_: FastAPI):
    database.init_db()
    yield


app = FastAPI(title="FastAPI Real-Time Chat", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="app/static"), name="static")


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=40)
    password: str = Field(min_length=1, max_length=80)


class LoginResponse(BaseModel):
    token: str
    username: str


class ChatMessage(BaseModel):
    id: int
    room: str
    username: str
    body: str
    created_at: str


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[str, set[WebSocket]] = {}

    async def connect(self, room: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.setdefault(room, set()).add(websocket)

    def disconnect(self, room: str, websocket: WebSocket) -> None:
        connections = self.active_connections.get(room)
        if not connections:
            return
        connections.discard(websocket)
        if not connections:
            self.active_connections.pop(room, None)

    async def broadcast(self, room: str, message: dict) -> None:
        for connection in list(self.active_connections.get(room, set())):
            await connection.send_json(message)


manager = ConnectionManager()


@app.get("/")
async def index() -> FileResponse:
    return FileResponse("app/static/index.html")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest) -> LoginResponse:
    token = auth.login(payload.username, payload.password)
    return LoginResponse(token=token, username=payload.username)


@app.get("/rooms")
async def rooms(username: str = Depends(auth.require_user)) -> dict:
    return {"username": username, "rooms": ROOMS}


@app.get("/messages/{room}", response_model=list[ChatMessage])
async def messages(room: str, username: str = Depends(auth.require_user)) -> list[dict]:
    _ = username
    return database.list_messages(room)


@app.websocket("/ws/{room}")
async def websocket_endpoint(websocket: WebSocket, room: str) -> None:
    token = websocket.query_params.get("token")
    username = auth.username_for_token(token)
    if not username:
        await websocket.close(code=1008)
        return

    await manager.connect(room, websocket)
    try:
        await manager.broadcast(
            room,
            {
                "id": 0,
                "room": room,
                "username": "system",
                "body": f"{username} joined {room}",
                "created_at": "",
            },
        )

        while True:
            payload = await websocket.receive_json()
            body = str(payload.get("body", "")).strip()
            if not body:
                continue
            saved = database.save_message(room, username, body[:500])
            await manager.broadcast(room, saved)
    except WebSocketDisconnect:
        manager.disconnect(room, websocket)
