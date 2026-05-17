# LibreTranslator SEO Webpage Translator

This template shows how to add plug-in style translation controls to an existing webpage while keeping a self-hosted LibreTranslate-compatible endpoint in the loop.

It includes:

- a Node.js proxy that talks to `LIBRETRANSLATE_URL`
- in-memory caching for repeated text segments
- glossary overrides for company-specific terminology
- a demo webpage with language buttons
- an endpoint that returns translated HTML and `hreflang` metadata for SEO previews

## Quick Start on Codesphere

1. Open the CI pipeline.
2. Run `Prepare` to install dependencies.
3. Set `LIBRETRANSLATE_URL` to your LibreTranslate service URL.
4. Run `Run`.
5. Open the deployment URL and translate the demo page.

For local demos without a translation service, set:

```bash
ALLOW_MOCK_TRANSLATION=true
```

The mock mode keeps the app usable for UI testing, but it is not a real translation engine.

## Environment

```bash
LIBRETRANSLATE_URL=http://localhost:5000
LIBRETRANSLATE_API_KEY=
PORT=3000
ALLOW_MOCK_TRANSLATION=false
```

## Running Locally

```bash
npm install
npm test
npm start
```

Then visit `http://localhost:3000`.

## Optional LibreTranslate Service

Run a LibreTranslate-compatible service in the same workspace or point the app at an existing private endpoint:

```bash
docker run -p 5000:5000 libretranslate/libretranslate
```

Then start this template with:

```bash
LIBRETRANSLATE_URL=http://localhost:5000 npm start
```

## API

### `GET /api/health`

Returns app and translator endpoint status.

### `GET /api/languages`

Returns languages from LibreTranslate. If the translator is unavailable, the app returns a small fallback list and marks it as fallback data.

### `POST /api/translate`

Translates one or more text segments.

```json
{
  "q": ["Scale support without copying pages.", "Codesphere"],
  "source": "en",
  "target": "de",
  "glossary": {
    "Codesphere": "Codesphere"
  }
}
```

### `POST /api/translate-page`

Accepts HTML, translates text nodes, preserves structure, and returns SEO metadata.

```json
{
  "html": "<main><h1>Scale support</h1><p>Translate your page.</p></main>",
  "source": "en",
  "target": "fr",
  "canonicalUrl": "https://example.com/blog/support",
  "glossary": {
    "Codesphere": "Codesphere"
  }
}
```

## Glossary Overrides

Glossary replacements are applied after translation so product names and approved terminology stay consistent. The demo includes defaults for `Codesphere`, `LibreTranslate`, and `CI pipeline`.

## Blog Draft

The issue asks for a blog article. This PR includes a ready-to-publish draft at [`BLOG_DRAFT.md`](./BLOG_DRAFT.md). It is intentionally not presented as published externally.
