# FastAPI Real-time Chat Template

A real-time chat application built with FastAPI and WebSockets.

## Features
- Real-time messaging via WebSockets
- Simple username/password authentication
- Join/leave notifications
- Broadcast messaging
- Clean, responsive UI

## Quick Start

1. **Install dependencies**
```bash
pip install -r requirements.txt
```

2. **Run the server**
```bash
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

3. **Open in browser**
Navigate to `http://localhost:8080`

## Test Users
- Username: `alice`, Password: `password123`
- Username: `bob`, Password: `securepass456`

## API Endpoints
- `GET /` - Chat web interface
- `POST /login` - User login
- `WS /ws/{username}` - WebSocket chat connection

## Structure
```
fastapi/
├── main.py           # FastAPI application
├── public/
│   └── index.html    # Chat frontend
├── requirements.txt  # Python dependencies
├── ci.yml           # Codesphere CI pipeline
├── start.sh         # Startup script
└── README.md        # This file
```
