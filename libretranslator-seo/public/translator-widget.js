const sourceLanguage = "en";
const originals = new Map();
const glossary = {
  Codesphere: "Codesphere",
  LibreTranslate: "LibreTranslate",
  "CI pipeline": "CI pipeline"
};

const status = document.querySelector("#status");
const cache = document.querySelector("#cache");
const buttons = Array.from(document.querySelectorAll(".lang-button"));
const translatableNodes = Array.from(document.querySelectorAll("[data-i18n]"));
const previewButton = document.querySelector("#preview-button");
const previewOutput = document.querySelector("#preview-output");

for (const node of translatableNodes) {
  originals.set(node, node.textContent.trim());
}

async function updateHealth() {
  const response = await fetch("/api/health");
  const data = await response.json();
  status.textContent = data.translatorConfigured
    ? data.languageFallback
      ? "Fallback languages"
      : "Connected"
    : "Mock or unconfigured";
  cache.textContent = `Cache entries: ${data.cacheEntries}`;
}

async function translatePage(target) {
  buttons.forEach((button) => button.classList.toggle("active", button.dataset.lang === target));

  if (target === sourceLanguage) {
    for (const [node, text] of originals.entries()) {
      node.textContent = text;
    }
    await updateHealth();
    return;
  }

  status.textContent = "Translating...";
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: Array.from(originals.values()),
      source: sourceLanguage,
      target,
      glossary
    })
  });

  if (!response.ok) {
    const error = await response.json();
    status.textContent = "Needs translator";
    previewOutput.style.display = "block";
    previewOutput.textContent = error.hint ?? error.error;
    return;
  }

  const data = await response.json();
  Array.from(originals.keys()).forEach((node, index) => {
    node.textContent = data.translated[index];
  });
  cache.textContent = `Cache entries: ${data.cacheEntries}`;
  status.textContent = data.mock ? "Mock mode" : "Connected";
}

async function buildPreview() {
  const html = document.querySelector("main").outerHTML;
  const activeLanguage = document.querySelector(".lang-button.active")?.dataset.lang ?? "de";
  const target = activeLanguage === sourceLanguage ? "de" : activeLanguage;

  const response = await fetch("/api/translate-page", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      html,
      source: sourceLanguage,
      target,
      canonicalUrl: "https://example.com/blog/global-support",
      glossary
    })
  });

  const data = await response.json();
  previewOutput.style.display = "block";
  previewOutput.textContent = JSON.stringify(data.meta ?? data, null, 2);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => translatePage(button.dataset.lang));
});

previewButton.addEventListener("click", buildPreview);

updateHealth();
