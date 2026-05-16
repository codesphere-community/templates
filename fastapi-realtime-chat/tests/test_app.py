from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def login_token() -> str:
    response = client.post("/login", json={"username": "ada", "password": "codesphere"})
    assert response.status_code == 200
    return response.json()["token"]


def test_health_check() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_login_and_rooms() -> None:
    token = login_token()
    response = client.get("/rooms", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert "general" in response.json()["rooms"]


def test_rejects_bad_login() -> None:
    response = client.post("/login", json={"username": "ada", "password": "wrong"})
    assert response.status_code == 401


def test_websocket_saves_and_broadcasts_message() -> None:
    token = login_token()
    with client.websocket_connect(f"/ws/general?token={token}") as websocket:
        websocket.receive_json()
        websocket.send_json({"body": "Hello from tests"})
        message = websocket.receive_json()

    assert message["username"] == "ada"
    assert message["body"] == "Hello from tests"

    response = client.get("/messages/general", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert any(item["body"] == "Hello from tests" for item in response.json())
