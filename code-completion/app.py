"""Codesphere-ready web UI for a self-hosted code-completion model."""

from __future__ import annotations

import json
import os
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from completion import DEFAULT_MODEL_BASE_URL, request_completion


ROOT = Path(__file__).parent
INDEX = (ROOT / "static" / "index.html").read_bytes()


def _json_bytes(value: object) -> bytes:
    return json.dumps(value, ensure_ascii=False).encode("utf-8")


class Handler(BaseHTTPRequestHandler):
    server_version = "CodeCompletion/1.0"

    def _send(self, status: HTTPStatus, body: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802
        if self.path in ("/", "/index.html"):
            self._send(HTTPStatus.OK, INDEX, "text/html; charset=utf-8")
            return
        if self.path == "/api/health":
            base_url = os.environ.get("MODEL_BASE_URL", DEFAULT_MODEL_BASE_URL)
            self._send(
                HTTPStatus.OK,
                _json_bytes({"ok": True, "model_base_url": base_url, "configured": bool(base_url)}),
                "application/json; charset=utf-8",
            )
            return
        self._send(HTTPStatus.NOT_FOUND, b"Not found", "text/plain; charset=utf-8")

    def do_POST(self) -> None:  # noqa: N802
        if self.path != "/api/complete":
            self._send(HTTPStatus.NOT_FOUND, b"Not found", "text/plain; charset=utf-8")
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > 256_000:
                raise ValueError("request body is empty or too large")
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            completion = request_completion(
                payload.get("prefix", ""),
                payload.get("suffix", ""),
                payload.get("language", "text"),
                max_tokens=int(payload.get("max_tokens", 160)),
            )
            self._send(HTTPStatus.OK, _json_bytes({"completion": completion}), "application/json; charset=utf-8")
        except (ValueError, TypeError, json.JSONDecodeError) as exc:
            self._send(HTTPStatus.BAD_REQUEST, _json_bytes({"error": str(exc)}), "application/json; charset=utf-8")
        except RuntimeError as exc:
            self._send(HTTPStatus.BAD_GATEWAY, _json_bytes({"error": str(exc)}), "application/json; charset=utf-8")

    def log_message(self, format: str, *args: object) -> None:
        # Keep prompts, completions, and headers out of logs.
        print(f"{self.address_string()} - {format % args}")


def main() -> None:
    port = int(os.environ.get("PORT", "8080"))
    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"Code Completion UI listening on port {port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
