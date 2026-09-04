/**
 * Adam Clarke's Commentary (1810-1826) is the better target than expanding
 * Wesley's Notes past Revelation: Wesley says in his own preface that his
 * New Testament notes draw heavily on Bengel's Gnomon, already indexed
 * separately, so "more Wesley" would mostly duplicate a voice already on the
 * desk. Clarke is a full, independent Methodist/Arminian commentary and the
 * catalog currently has no Arminian voice at all.
 *
 * PUBLIC-COMMENTARY-SOURCES.md already names two candidate locations from
 * earlier research; these are checked here rather than trusted outright,
 * same as everything else this scanner set touches.
 */
import { politeGet, extractLinks, extractHeadings } from "./lib/fetch.mjs";

/** Matches the Gill/Poole/Bengel path shape already proven on this host. */
export async function checkBibleHub() {
  const url = "https://biblehub.com/commentaries/clarke/romans/9.htm";
  const res = await politeGet(url);
  if (!res.ok) return { host: "biblehub.com", found: false, url, status: res.status };
  return {
    host: "biblehub.com",
    found: true,
    url: res.url,
    headings: extractHeadings(res.text, 6),
  };
}

/**
 * A landing page, not a per-chapter page -- if it resolves, its own links
 * are the real discovery (same technique as the Calvin/Catena TOC crawl in
 * scan-ccel.mjs), so this doesn't need to guess CCEL's deeper path shape.
 */
export async function checkCcel() {
  const candidates = [
    "https://ccel.org/ccel/clarke/commentary",
    "https://ccel.org/ccel/clarke/commentary.html",
    "https://ccel.org/ccel/clarke/commentary/commentary.html",
  ];
  for (const url of candidates) {
    const res = await politeGet(url);
    if (!res.ok) continue;
    const links = extractLinks(res.text, res.url, (href) => href.includes("/clarke/")).filter(
      (l) => l.text.length > 0,
    );
    return { host: "ccel.org", found: true, url: res.url, linkCount: links.length, links: links.slice(0, 40) };
  }
  return { host: "ccel.org", found: false, tried: candidates };
}

/** Lower confidence: mirrors the Wesley path shape on the same host, unconfirmed for Clarke. */
export async function checkGodrules() {
  const candidates = [
    "https://www.godrules.net/library/clarke/clarkerom9.htm",
    "https://www.godrules.net/library/clarke/clarke1.htm",
  ];
  const results = [];
  for (const url of candidates) {
    const res = await politeGet(url, { delayMs: 300 });
    results.push({ url, status: res.status, ok: res.ok });
  }
  return { host: "godrules.net", checked: results };
}

export async function scanAdamClarke() {
  return {
    voice: "Adam Clarke",
    generatedAt: new Date().toISOString(),
    bibleHub: await checkBibleHub(),
    ccel: await checkCcel(),
    godrules: await checkGodrules(),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await scanAdamClarke();
  console.log(JSON.stringify(result, null, 2));
}
