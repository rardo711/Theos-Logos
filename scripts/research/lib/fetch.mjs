/**
 * Shared fetch/parse helpers for the source-discovery scanners
 * (scripts/research/scan-*.mjs). These run in GitHub Actions, which has
 * ordinary internet access — the Claude sandbox that authored them does not,
 * so nothing here has been exercised against the live sites. Every scanner
 * built on top of this treats a fetch as ground truth only when it actually
 * returns 200; a plausible-looking URL that was never fetched is never
 * written to output as if it were confirmed.
 */

const USER_AGENT =
  "TheosLogosResearch/1.0 (+https://github.com/rardo711/Theos-Logos; one-off source-discovery run, not a standing crawler)";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** GET with a timeout, one retry, and a politeness delay before the request. */
export async function politeGet(url, { timeoutMs = 15_000, retries = 1, delayMs = 350 } = {}) {
  await sleep(delayMs);
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
        redirect: "follow",
        signal: AbortSignal.timeout(timeoutMs),
      });
      const text = res.ok ? await res.text() : "";
      return { url, status: res.status, ok: res.ok, text };
    } catch (err) {
      lastError = err;
      if (attempt < retries) await sleep(1000 * (attempt + 1));
    }
  }
  return { url, status: 0, ok: false, text: "", error: lastError?.message ?? "fetch failed" };
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");
}

export function extractTitle(html) {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return m ? decodeEntities(m[1]).replace(/\s+/g, " ").trim() : "";
}

export function extractHeadings(html, limit = 10) {
  const out = [];
  const re = /<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi;
  let m;
  while ((m = re.exec(html)) && out.length < limit) {
    const text = decodeEntities(m[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (text) out.push(text);
  }
  return out;
}

/**
 * Every link on the page as {href, text}, href resolved against `base`.
 * `filter` narrows to hrefs worth keeping (e.g. same volume, same host) —
 * TOC pages carry a lot of chrome (nav, footer, "buy this book") that isn't.
 */
export function extractLinks(html, base, filter) {
  const out = [];
  const re = /<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    let href;
    try {
      href = new URL(m[1], base).toString();
    } catch {
      continue;
    }
    if (filter && !filter(href)) continue;
    const text = decodeEntities(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    out.push({ href, text });
  }
  return out;
}

/** "9:6-13", "IX. 6-13", "Rom. 9:6" -> {chapter, startVerse, endVerse} or null. */
export function parseChapterVerse(text) {
  const numeric = /\b(\d{1,3}):(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?\b/.exec(text);
  if (numeric) {
    const chapter = Number(numeric[1]);
    const start = Number(numeric[2]);
    const end = numeric[3] ? Number(numeric[3]) : start;
    return { chapter, startVerse: start, endVerse: end };
  }
  return null;
}

export async function politeGetMany(urls, opts) {
  const out = [];
  for (const url of urls) {
    out.push(await politeGet(url, opts));
  }
  return out;
}
