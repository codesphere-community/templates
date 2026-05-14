import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const io = new Server(server);
const port = Number(process.env.PORT || 3000);
const roomMembers = new Map();

app.use(express.static(join(__dirname, "public")));

function updatePresence(room) {
  const size = roomMembers.get(room)?.size ?? 0;
  io.to(room).emit("presence", size);
}

io.on("connection", (socket) => {
  let activeRoom = "main";

  socket.on("join-room", (roomName) => {
    activeRoom = String(roomName || "main").slice(0, 64);
    socket.join(activeRoom);

    if (!roomMembers.has(activeRoom)) {
      roomMembers.set(activeRoom, new Set());
    }

    roomMembers.get(activeRoom).add(socket.id);
    updatePresence(activeRoom);
  });

  socket.on("draw", (segment) => {
    socket.to(segment.room).emit("draw", segment);
  });

  socket.on("clear", (room) => {
    socket.to(room).emit("clear");
  });

  socket.on("disconnect", () => {
    const members = roomMembers.get(activeRoom);

    if (members) {
      members.delete(socket.id);
      if (members.size === 0) {
        roomMembers.delete(activeRoom);
      } else {
        updatePresence(activeRoom);
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Socket.IO draw board running on port ${port}`);
});
