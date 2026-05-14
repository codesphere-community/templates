# Reflex Twitter Clone Template

This template is a small social feed built with Reflex. It includes a single-page timeline, local sign-in state, post composer, like/repost counters, profile cards, trending topics, and a Codesphere `ci.yml` pipeline.

## Features

- Reflex full-stack Python app
- Local demo sign-in and profile switching
- Compose posts from the browser
- Like and repost interactions
- Responsive three-column social layout
- Codesphere-ready CI pipeline

## Run locally

```bash
pip install -r requirements.txt
reflex init
reflex run
```

Open the Reflex frontend URL printed by the command. By default Reflex serves the app on port `3000`.

## Deploy on Codesphere

1. Create a Codesphere workspace from this template.
2. Open the CI pipeline view.
3. Run the prepare step to install dependencies and initialize Reflex.
4. Run the app service. The pipeline binds Reflex to `0.0.0.0` and exposes the frontend on port `3000`.

The template uses only local demo state, so no external API keys or databases are required.

## Blog article outline

Use this outline for the requested article:

1. Why Reflex is useful for Python-first web prototypes.
2. How the template models a social timeline with a single `rx.State` class.
3. How Codesphere runs the app from `ci.yml`.
4. Ideas for extending the clone with persistence, authentication, and media uploads.
