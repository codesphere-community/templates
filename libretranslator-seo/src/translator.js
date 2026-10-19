import * as cheerio from "cheerio";

const DEFAULT_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" }
];

export class TranslationError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "TranslationError";
    this.status = options.status ?? 502;
    this.cause = options.cause;
  }
}

export function createTranslationCache() {
  const store = new Map();
  return {
    get(key) {
      return store.get(key);
    },
    set(key, value) {
      store.set(key, value);
    },
    size() {
      return store.size;
    },
    clear() {
      store.clear();
    }
  };
}

export function normalizeLanguage(value, fallback) {
  if (typeof value !== "string" || value.trim() === "") return fallback;
  return value.trim().toLowerCase();
}

export function makeCacheKey({ source, target, text, glossary }) {
  const glossaryPairs = Object.entries(glossary ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([term, replacement]) => `${term}:${replacement}`)
    .join("|");
  return `${source}->${target}:${glossaryPairs}:${text}`;
}

export function applyGlossary(text, glossary = {}) {
  let result = text;
  for (const [term, replacement] of Object.entries(glossary)) {
    if (!term) continue;
    result = result.split(term).join(replacement);
  }
  return result;
}

export function buildHreflangLinks(canonicalUrl, source, target) {
  if (!canonicalUrl) return [];
  const url = new URL(canonicalUrl);
  const path = url.pathname.replace(/\/$/, "");
  const localizedPath = target === source ? path || "/" : `/${target}${path || ""}`;
  url.pathname = localizedPath;
  return [
    { rel: "canonical", href: canonicalUrl },
    { rel: "alternate", hreflang: source, href: canonicalUrl },
    { rel: "alternate", hreflang: target, href: url.toString() }
  ];
}

export async function fetchLanguages({ endpoint, fetchImpl = fetch }) {
  if (!endpoint) return { languages: DEFAULT_LANGUAGES, fallback: true };
  try {
    const response = await fetchImpl(new URL("/languages", endpoint));
    if (!response.ok) throw new TranslationError("LibreTranslate languages endpoint failed");
    return { languages: await response.json(), fallback: false };
  } catch {
    return { languages: DEFAULT_LANGUAGES, fallback: true };
  }
}

export async function translateText({
  text,
  source = "en",
  target,
  endpoint,
  apiKey,
  glossary = {},
  cache = createTranslationCache(),
  fetchImpl = fetch,
  allowMock = false
}) {
  if (typeof text !== "string") {
    throw new TranslationError("Text must be a string", { status: 400 });
  }
  if (!target) {
    throw new TranslationError("Target language is required", { status: 400 });
  }
  if (text.trim() === "") return text;

  const normalizedSource = normalizeLanguage(source, "en");
  const normalizedTarget = normalizeLanguage(target, "en");
  const key = makeCacheKey({ source: normalizedSource, target: normalizedTarget, text, glossary });
  const cached = cache.get(key);
  if (cached) return cached;

  if (!endpoint) {
    if (!allowMock) {
      throw new TranslationError("LIBRETRANSLATE_URL is not configured");
    }
    const mocked = applyGlossary(`[${normalizedTarget}] ${text}`, glossary);
    cache.set(key, mocked);
    return mocked;
  }

  const payload = {
    q: text,
    source: normalizedSource,
    target: normalizedTarget,
    format: "text"
  };
  if (apiKey) payload.api_key = apiKey;

  try {
    const response = await fetchImpl(new URL("/translate", endpoint), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new TranslationError(`LibreTranslate returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const translated = applyGlossary(data.translatedText ?? "", glossary);
    cache.set(key, translated);
    return translated;
  } catch (error) {
    if (allowMock) {
      const mocked = applyGlossary(`[${normalizedTarget}] ${text}`, glossary);
      cache.set(key, mocked);
      return mocked;
    }
    throw new TranslationError("Unable to translate text", { cause: error });
  }
}

export async function translateMany(options) {
  const values = Array.isArray(options.q) ? options.q : [options.q];
  return Promise.all(values.map((text) => translateText({ ...options, text })));
}

export async function translateHtml({
  html,
  source = "en",
  target,
  canonicalUrl,
  endpoint,
  apiKey,
  glossary = {},
  cache,
  fetchImpl = fetch,
  allowMock = false
}) {
  if (typeof html !== "string" || html.trim() === "") {
    throw new TranslationError("HTML is required", { status: 400 });
  }

  const $ = cheerio.load(html, { decodeEntities: false });
  const nodes = [];
  $("body, body *")
    .contents()
    .filter((_, node) => {
      if (node.type !== "text" || !$(node).text().trim()) return false;
      return !$(node).parent().closest("script, style, noscript, template, textarea").length;
    })
    .each((_, node) => nodes.push(node));

  const translated = await Promise.all(
    nodes.map((node) =>
      translateText({
        text: $(node).text(),
        source,
        target,
        endpoint,
        apiKey,
        glossary,
        cache,
        fetchImpl,
        allowMock
      })
    )
  );

  nodes.forEach((node, index) => {
    node.data = translated[index];
  });

  return {
    html: $.html(),
    meta: {
      source: normalizeLanguage(source, "en"),
      target: normalizeLanguage(target, "en"),
      translatedTextNodes: nodes.length,
      hreflang: buildHreflangLinks(canonicalUrl, source, target)
    }
  };
}
