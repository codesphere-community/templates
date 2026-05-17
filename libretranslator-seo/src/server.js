import express from "express";
import { fileURLToPath } from "node:url";
import {
  createTranslationCache,
  fetchLanguages,
  translateHtml,
  translateMany,
  TranslationError
} from "./translator.js";

const app = express();
const cache = createTranslationCache();
const port = Number(process.env.PORT ?? 3000);
const endpoint = process.env.LIBRETRANSLATE_URL;
const apiKey = process.env.LIBRETRANSLATE_API_KEY;
const allowMock = process.env.ALLOW_MOCK_TRANSLATION === "true";
const publicDir = fileURLToPath(new URL("../public", import.meta.url));

app.use(express.json({ limit: "1mb" }));
app.use(express.static(publicDir));

app.get("/api/health", async (_req, res) => {
  const languages = await fetchLanguages({ endpoint });
  res.json({
    ok: true,
    translatorConfigured: Boolean(endpoint),
    languageFallback: languages.fallback,
    cacheEntries: cache.size()
  });
});

app.get("/api/languages", async (_req, res) => {
  const result = await fetchLanguages({ endpoint });
  res.json(result);
});

app.post("/api/translate", async (req, res, next) => {
  try {
    const translated = await translateMany({
      q: req.body.q,
      source: req.body.source,
      target: req.body.target,
      glossary: req.body.glossary,
      endpoint,
      apiKey,
      cache,
      allowMock
    });
    res.json({ translated, cacheEntries: cache.size(), mock: allowMock && !endpoint });
  } catch (error) {
    next(error);
  }
});

app.post("/api/translate-page", async (req, res, next) => {
  try {
    const result = await translateHtml({
      html: req.body.html,
      source: req.body.source,
      target: req.body.target,
      canonicalUrl: req.body.canonicalUrl,
      glossary: req.body.glossary,
      endpoint,
      apiKey,
      cache,
      allowMock
    });
    res.json({ ...result, cacheEntries: cache.size(), mock: allowMock && !endpoint });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  const status = error instanceof TranslationError ? error.status : 500;
  res.status(status).json({
    error: error.message,
    hint:
      status === 502
        ? "Check LIBRETRANSLATE_URL or enable ALLOW_MOCK_TRANSLATION=true for local UI testing."
        : undefined
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`LibreTranslator SEO template listening on http://localhost:${port}`);
  });
}

export default app;
