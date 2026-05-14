const socket = io();

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const colorInput = document.querySelector("#color");
const sizeInput = document.querySelector("#size");
const sizeValue = document.querySelector("#sizeValue");
const clearButton = document.querySelector("#clear");
const downloadButton = document.querySelector("#download");
const roomInput = document.querySelector("#room");
const roomForm = document.querySelector("#roomForm");
const onlineCount = document.querySelector("#onlineCount");

const params = new URLSearchParams(window.location.search);
const room = params.get("room") || "main";
let isDrawing = false;
let lastPoint = null;

roomInput.value = room;

function resizeCanvas() {
  const snapshot = document.createElement("canvas");
  snapshot.width = canvas.width;
  snapshot.height = canvas.height;
  snapshot.getContext("2d").drawImage(canvas, 0, 0);

  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.fillStyle = "#fffaf3";
  ctx.fillRect(0, 0, rect.width, rect.height);

  if (snapshot.width && snapshot.height) {
    ctx.drawImage(snapshot, 0, 0, rect.width, rect.height);
  }
}

function getPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const source = event.touches?.[0] || event;

  return {
    x: source.clientX - rect.left,
    y: source.clientY - rect.top,
  };
}

function drawSegment(segment) {
  ctx.strokeStyle = segment.color;
  ctx.lineWidth = segment.size;
  ctx.beginPath();
  ctx.moveTo(segment.from.x, segment.from.y);
  ctx.lineTo(segment.to.x, segment.to.y);
  ctx.stroke();
}

function startDrawing(event) {
  event.preventDefault();
  isDrawing = true;
  lastPoint = getPoint(event);
}

function draw(event) {
  if (!isDrawing || !lastPoint) {
    return;
  }

  event.preventDefault();
  const nextPoint = getPoint(event);
  const segment = {
    room,
    from: lastPoint,
    to: nextPoint,
    color: colorInput.value,
    size: Number(sizeInput.value),
  };

  drawSegment(segment);
  socket.emit("draw", segment);
  lastPoint = nextPoint;
}

function stopDrawing() {
  isDrawing = false;
  lastPoint = null;
}

function clearBoard() {
  const rect = canvas.getBoundingClientRect();
  ctx.fillStyle = "#fffaf3";
  ctx.fillRect(0, 0, rect.width, rect.height);
}

function downloadBoard() {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height;
  const exportCtx = exportCanvas.getContext("2d");

  exportCtx.fillStyle = "#ffffff";
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  exportCtx.drawImage(canvas, 0, 0);

  const link = document.createElement("a");
  link.href = exportCanvas.toDataURL("image/jpeg", 0.92);
  link.download = "draw-board.jpg";
  link.click();
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
window.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("touchstart", startDrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
window.addEventListener("touchend", stopDrawing);

sizeInput.addEventListener("input", () => {
  sizeValue.textContent = `${sizeInput.value}px`;
});

clearButton.addEventListener("click", () => {
  clearBoard();
  socket.emit("clear", room);
});

downloadButton.addEventListener("click", downloadBoard);

roomForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nextRoom = roomInput.value.trim() || "main";
  window.location.href = `/?room=${encodeURIComponent(nextRoom)}`;
});

socket.emit("join-room", room);
socket.on("draw", drawSegment);
socket.on("clear", clearBoard);
socket.on("presence", (count) => {
  onlineCount.textContent = `${count} online`;
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
