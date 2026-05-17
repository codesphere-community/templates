from app import database
from app.pipeline import BlogPost, compute_tfidf, run_pipeline, tokenize


def test_tokenize_removes_stopwords() -> None:
    assert tokenize("Apache Beam and streaming data") == ["apache", "beam", "streaming", "data"]


def test_compute_tfidf_prioritizes_distinct_terms() -> None:
    posts = [
        BlogPost(
            slug="beam",
            title="Apache Beam streaming",
            body="Apache Beam streaming pipelines process events in real time.",
        ),
        BlogPost(
            slug="sqlite",
            title="SQLite persistence",
            body="SQLite stores local application data with simple database files.",
        ),
    ]

    results = compute_tfidf(posts, limit=3)
    beam_keywords = {row["keyword"] for row in results if row["slug"] == "beam"}
    sqlite_keywords = {row["keyword"] for row in results if row["slug"] == "sqlite"}

    assert "beam" in beam_keywords
    assert "sqlite" in sqlite_keywords


def test_run_pipeline_persists_keywords(tmp_path, monkeypatch) -> None:
    monkeypatch.setattr(database, "DATABASE_PATH", tmp_path / "beam_tfidf.db")
    database.init_db()
    database.upsert_post(
        "beam-streaming",
        "Apache Beam streaming",
        "Apache Beam streaming pipelines process events in real time.",
    )
    database.upsert_post(
        "sqlite-corpus",
        "SQLite corpus",
        "SQLite stores blog posts and keyword scores for the local corpus.",
    )

    assert run_pipeline() > 0
    keywords = database.list_keywords("beam-streaming")

    assert any(row["keyword"] == "beam" for row in keywords)
