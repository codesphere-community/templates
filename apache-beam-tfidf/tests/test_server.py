from fastapi.testclient import TestClient

from app.server import app


client = TestClient(app)


def test_health() -> None:
    assert client.get("/health").json() == {"status": "ok"}


def test_ingest_blogpost() -> None:
    response = client.post(
        "/webhook/blogposts",
        json={
            "slug": "codesphere-beam",
            "title": "Codesphere Beam",
            "body": "Apache Beam can extract keywords from blog posts in near real time.",
        },
    )

    assert response.status_code == 200
    assert response.json()["accepted"] is True
    assert any(post["slug"] == "codesphere-beam" for post in client.get("/posts").json())
