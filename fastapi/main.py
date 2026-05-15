from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.responses import HTMLResponse
import json
import asyncio
from typing import Set, Dict
from datetime import datetime

app = FastAPI(title="FastAPI Chat", version="1.0.0")
security = HTTPBasic()

# Simple in-memory user store (for demo purposes)
USERS = {
    "alice": "password123",
    "bob": "securepass456"
}

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, username: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[username] = websocket
        await self.broadcast(f"{username} joined the chat!", "system")
    
    def disconnect(self, username: str):
        if username in self.active_connections:
            del self.active_connections[username]
    
    async def broadcast(self, message: str, sender: str = "system"):
        disconnected = []
        for username, ws in self.active_connections.items():
            try:
                await ws.send_json({
                    "sender": sender,
                    "message": message,
                    "timestamp": datetime.now().isoformat()
                })
            except:
                disconnected.append(username)
        for username in disconnected:
            self.disconnect(username)

manager = ConnectionManager()

@app.get("/")
async def get():
    with open("public/index.html", "r") as f:
        return HTMLResponse(f.read())

@app.post("/login")
async def login(credentials: HTTPBasicCredentials = Depends(security)):
    username = credentials.username
    password = credentials.password
    
    if username in USERS and USERS[username] == password:
        return {"username": username, "status": "logged_in"}
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
    )

@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await manager.connect(username, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            if message_data.get("type") == "message":
                await manager.broadcast(message_data["content"], username)
    except WebSocketDisconnect:
        manager.disconnect(username)
        await manager.broadcast(f"{username} left the chat!", "system")
