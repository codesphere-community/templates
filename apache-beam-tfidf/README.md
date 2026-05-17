# Apache Beam TF-IDF Keyword Pipeline

This template ingests blog posts from a webhook, persists them in SQLite, and runs an Apache Beam pipeline that extracts TF-IDF keywords for each post. It is designed for Codesphere as a single workspace with a lightweight FastAPI webhook and a DirectRunner Beam job.

## Run Locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/init_db.py
uvicorn app.server:app --host 0.0.0.0 --port 3000
```

In another terminal:

```bash
source .venv/bin/activate
python -m app.pipeline --once
```

Submit a post:

```bash
curl -X POST http://localhost:3000/webhook/blogposts \
  -H "Content-Type: application/json" \
  -d '{"slug":"beam-intro","title":"Apache Beam Intro","body":"Apache Beam handles batch and streaming data pipelines."}'
```

Then run the pipeline again and open `http://localhost:3000/posts/beam-intro/keywords`.

## n8n

The `n8n/blogpost-to-beam-workflow.json` file contains an importable n8n workflow. It receives a blog post payload and forwards `slug`, `title`, and `body` to the FastAPI webhook at `/webhook/blogposts`.

## Codesphere

The included `ci.yml` installs dependencies, initializes the SQLite database, runs tests, and starts the webhook API on port `3000`. Run the Beam worker with:

```bash
python -m app.pipeline --watch
```

## Article Draft

### Real-Time Blog Keyword Extraction with Apache Beam, SQLite, and n8n

TF-IDF is a useful way to identify terms that matter to one document compared with the rest of a corpus. This template shows how to wrap that idea in a practical data workflow: n8n receives or forwards new blog posts, FastAPI persists those posts in SQLite, and Apache Beam calculates keywords for each document.

The Beam pipeline reads blog posts from SQLite, tokenizes each post, builds document-frequency statistics across the corpus, and writes the top weighted terms back to SQLite. The included API exposes the raw posts and generated keywords so the result can be inspected immediately.

For Codesphere, everything runs inside one workspace. The prepare step installs dependencies, initializes the database, and runs tests. The run step starts the webhook API, while the Beam worker can run in watch mode to process new content repeatedly. From here, the template can be extended with a production n8n trigger, a larger corpus import, or a scheduled Beam runner.
