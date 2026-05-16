# Svelte Sprint Board

This template is a compact Svelte application for planning small product sprints. It includes a seeded task board, priority filters, owner summaries, and client-side search so the app feels useful immediately after deployment.

## Run Locally

```bash
npm install
npm run dev
```

The development server runs on port `3000`.

## Codesphere

The included `ci.yml` installs dependencies, builds the app, and serves the production preview on port `3000`.

## What This Template Demonstrates

- Reactive component state with Svelte.
- Derived board metrics without a backend.
- Responsive layouts that work for demos and starter products.
- A Vite build that can be deployed through a Codesphere CI pipeline.

## Article Draft

### Building a Lightweight Sprint Board with Svelte and Codesphere

Svelte is a strong fit for small operational tools because the mental model is direct: state lives in the component, markup reacts to that state, and the final bundle stays small. This template uses that strength to build a sprint board that is easy to understand, quick to customize, and ready to run in a Codesphere workspace.

The app starts with a small list of work items. Each item has an owner, priority, status, and estimate. From that single array, the interface renders the kanban columns, the top-line metrics, the owner summary, and the filtered search results. That keeps the example practical without hiding the important parts behind a backend or a large state library.

To deploy it in Codesphere, import the template, run the prepare pipeline, and start the run pipeline. The CI file uses `npm install`, `npm run build`, and `npm run preview -- --host 0.0.0.0 --port 3000`, so the same commands work locally and in the hosted workspace.

From here, a team can replace the seeded data with an API call, add authentication, or persist the task list in a database. The template stays intentionally small so those extensions are easy to see.
