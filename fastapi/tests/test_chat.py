from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]

def test_login_valid():
    from requests.auth import HTTPBasicAuth
    # Test with valid credentials
    response = client.post("/login", auth=("alice", "password123"))
    assert response.status_code == 200
    assert response.json()["username"] == "alice"

def test_login_invalid():
    response = client.post("/login", auth=("alice", "wrongpass"))
    assert response.status_code == 401
