# Socket.IO Collaborative Draw Board

A Codesphere-ready collaborative drawing board built with Express, Socket.IO, and a browser canvas. Multiple people can join the same room, draw together in real time, clear the board, and export the current canvas as a JPG.

## Features

- Real-time drawing synchronization with Socket.IO
- Shareable room names through the URL
- Brush color and size controls
- Connected-user count
- Clear-board event shared across the room
- Download the canvas as `draw-board.jpg`
- One-workspace Codesphere deployment through `ci.yml`

## Run Locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

To test collaboration locally, open the same URL in two browser windows. Add a room name with `?room=team-sketch` to isolate a board.

## Deploy On Codesphere

Create a Codesphere workspace from this template and run the included CI pipeline:

1. `prepare` installs dependencies.
2. `test` validates the server entry point.
3. `run` starts the Socket.IO app on port `3000`.

Codesphere exposes the app URL for your workspace automatically.

## Customize

- Edit `public/app.js` to add tools such as rectangles, undo, or saved boards.
- Edit `public/styles.css` to match your brand.
- Add persistence in `server.js` if rooms should survive server restarts.
