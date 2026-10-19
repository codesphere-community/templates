import test from "node:test";
import assert from "node:assert/strict";
import {
  applyGlossary,
  buildHreflangLinks,
  createTranslationCache,
  fetchLanguages,
  makeCacheKey,
  translateHtml,
  translateText
} from "../src/translator.js";

test("applyGlossary preserves approved terms", () => {
  assert.equal(
    applyGlossary("Use Kodesphere with Libre Translate", {
      Kodesphere: "Codesphere",
      "Libre Translate": "LibreTranslate"
    }),
    "Use Codesphere with LibreTranslate"
  );
});

test("makeCacheKey is stable for glossary order", () => {
  const first = makeCacheKey({
    source: "en",
    target: "de",
    text: "Hello",
    glossary: { b: "B", a: "A" }
  });
  const second = makeCacheKey({
    source: "en",
    target: "de",
    text: "Hello",
    glossary: { a: "A", b: "B" }
  });
  assert.equal(first, second);
});

test("translateText caches successful translations", async () => {
  const cache = createTranslationCache();
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return Response.json({ translatedText: "Hallo Codesphere" });
  };

  const options = {
    text: "Hello Codesphere",
    source: "en",
    target: "de",
    endpoint: "http://translator.local",
    glossary: { Kodesphere: "Codesphere" },
    cache,
    fetchImpl
  };

  assert.equal(await translateText(options), "Hallo Codesphere");
  assert.equal(await translateText(options), "Hallo Codesphere");
  assert.equal(calls, 1);
});

test("fetchLanguages falls back clearly when endpoint is unavailable", async () => {
  const result = await fetchLanguages({
    endpoint: "http://translator.local",
    fetchImpl: async () => {
      throw new Error("offline");
    }
  });

  assert.equal(result.fallback, true);
  assert.ok(result.languages.some((language) => language.code === "en"));
});

test("translateHtml preserves markup while translating text nodes", async () => {
  const result = await translateHtml({
    html: "<main><h1>Hello</h1><p>Codesphere helps teams.</p><script>keep()</script></main>",
    source: "en",
    target: "es",
    endpoint: "http://translator.local",
    canonicalUrl: "https://example.com/blog/demo",
    fetchImpl: async (_url, init) => {
      const payload = JSON.parse(init.body);
      return Response.json({ translatedText: `es:${payload.q}` });
    }
  });

  assert.match(result.html, /<h1>es:Hello<\/h1>/);
  assert.match(result.html, /<p>es:Codesphere helps teams\.<\/p>/);
  assert.match(result.html, /<script>keep\(\)<\/script>/);
  assert.equal(result.meta.translatedTextNodes, 2);
  assert.equal(result.meta.hreflang[2].hreflang, "es");
});

test("buildHreflangLinks returns canonical and localized alternate", () => {
  const links = buildHreflangLinks("https://example.com/blog/demo", "en", "fr");
  assert.equal(links[0].rel, "canonical");
  assert.equal(links[2].href, "https://example.com/fr/blog/demo");
});
