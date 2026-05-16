# FastAPI Real-Time Chat

This template is a real-time chat application built with FastAPI, WebSockets, simple token-based authentication, and SQLite message history. It is designed to run as a single Codesphere workspace with no external services.

## Demo Users

The app ships with three demo users:

| Username | Password |
| --- | --- |
| ada | `codesphere` |
| grace | `codesphere` |
| linus | `codesphere` |

## Run Locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/init_db.py
uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload
```

Open `http://localhost:3000`, sign in as a demo user, choose a room, and send messages from multiple browser tabs.

## Codesphere

The included `ci.yml` installs dependencies, initializes the SQLite database, runs tests, and starts the FastAPI server on port `3000`.

## What This Template Demonstrates

- FastAPI route handlers and static file serving.
- WebSocket connection management.
- Token-based authentication for HTTP and WebSocket requests.
- SQLite persistence without extra infrastructure.
- A browser UI that reconnects by opening a new authenticated socket per room.

## Article Draft

### Building a Real-Time Chat App with FastAPI WebSockets on Codesphere

FastAPI is a strong choice for real-time applications because it supports both traditional HTTP endpoints and WebSockets in the same app. This template uses that combination to build a small authenticated chat application that can be deployed in one Codesphere workspace.

The backend has a `/login` endpoint for demo authentication, `/rooms` and `/messages/{room}` endpoints for loading the interface, and a `/ws/{room}` WebSocket endpoint for live messages. When a user sends a message, FastAPI stores it in SQLite and broadcasts the saved payload to everyone connected to the same room.

SQLite keeps the template simple: there is no database server to configure, but messages still survive process restarts. The `scripts/init_db.py` script creates the schema, and the CI pipeline runs it before starting the app.

In Codesphere, the workflow is straightforward. The prepare step installs Python dependencies, initializes the database, and runs tests. The run step starts Uvicorn on port `3000`. From there, developers can replace the demo user map with a real user table, add private rooms, or connect the app to a production database.
