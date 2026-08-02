# Local Code Completion

This Codesphere template provides a small, dependency-free web UI for code
completion backed by a self-hosted OpenAI-compatible model. The model stays under
the operator's control: the browser sends source to this local app, and the app
forwards it only to `MODEL_BASE_URL`.

## Quick start

1. Start a local model server, such as `llama.cpp`, with its OpenAI-compatible
   `/v1/completions` endpoint on port `8080`.
2. Set `MODEL_BASE_URL` if the model server uses another internal URL, then run
   `python3 app.py` (or `./start.sh`).
3. Open the Codesphere deployment URL and click **Suggest completion**.

Example `llama.cpp` server command:

```bash
./llama-server -m ./models/code-model.gguf --host 0.0.0.0 --port 8080
```

The model file is intentionally not bundled. Use a model and license approved by
your deployment, and configure `MODEL_API_KEY` as a secret only when the model
server requires it. Never commit a model, key, or private source file.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `8080` | Web application port exposed by Codesphere |
| `MODEL_BASE_URL` | `http://127.0.0.1:8080/v1` | Internal model API base URL |
| `MODEL_API_KEY` | empty | Optional bearer token, read only from the environment |

The app accepts both completion responses (`choices[0].text`) and chat-style
responses (`choices[0].message.content`). It limits completion size and source
payloads, clamps temperature, uses a short timeout, and does not log prompts or
authorization headers.

## Tests

```bash
python3 -m unittest discover -s tests -v
```

The tests use a fake local model response and make no network requests.

## Codesphere deployment

Create a workspace from this folder, set the start command to `python3 app.py`,
expose port `8080`, and point `MODEL_BASE_URL` at the self-hosted model service in
the same workspace or private network. The frontend is plain HTML/CSS/JavaScript,
so no package installation or external CDN is required.
