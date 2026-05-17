# Building an SEO-Friendly Webpage Translator on Codesphere with LibreTranslate

Language support is often treated as a large rewrite: clone the page, translate every string, rebuild navigation, and keep all versions updated forever. This template takes a lighter path. It keeps the original page as the source of truth, sends text segments through a self-hosted LibreTranslate-compatible service, and returns translated HTML plus metadata that can be used for SEO previews.

The project is made of two pieces:

- a small Node.js proxy that calls LibreTranslate, caches repeated text, and applies glossary rules
- a browser widget that adds language buttons to an existing webpage

The result is useful for prototypes, blogs, product documentation, and content sites where the team wants to test multilingual reach without adopting a hosted translation SaaS.

## Why Self-Host Translation?

Hosted translation platforms are convenient, but they can become expensive and may raise compliance concerns for private product copy. A self-hosted LibreTranslate service gives teams more control over where content goes. Codesphere is a good fit because the app, proxy, and translation service can live close together in one workspace.

## How the Template Works

The demo page marks translatable content with `data-i18n` attributes. When a user selects a target language, the browser sends those text segments to the local proxy:

```http
POST /api/translate
```

The proxy forwards text to LibreTranslate, stores repeated translations in an in-memory cache, and applies glossary overrides. Product names such as `Codesphere` can stay unchanged, while terms like `CI pipeline` can follow approved wording.

For SEO-oriented workflows, the app also exposes:

```http
POST /api/translate-page
```

That endpoint accepts HTML, translates text nodes with a structured parser, preserves the page shape, and returns `hreflang` metadata that can be used when generating static translated pages.

## Deploying on Codesphere

1. Create a workspace from the template.
2. Configure `LIBRETRANSLATE_URL`.
3. Run the CI pipeline `Prepare` stage.
4. Run the `Run` stage.
5. Open the deployment URL.

For local UI testing, enable mock mode:

```bash
ALLOW_MOCK_TRANSLATION=true npm start
```

Mock mode is intentionally labeled as a demo fallback and should not be used as real translation proof.

## What This Template Is Good For

This template is a starting point for:

- translating blog pages without manually duplicating content
- testing multilingual landing pages
- adding terminology feedback through glossary overrides
- generating translated HTML previews for editors

It is not a full translation management system. Production sites should persist translated output, review translations with native speakers, and serve localized URLs with stable canonical and alternate links.

## Next Steps

The next improvements would be persistent translation storage, authenticated editor feedback, a build-time static export command, and automatic sitemap generation for translated routes.
