/**
 * Two jobs on Bible Hub:
 *  1. Spot-check the seven book slugs (matthew, mark, luke, john, romans,
 *     1_corinthians, 2_corinthians) added to WEAK_NT_HUB by pattern-matching
 *     the twenty already in use, without ever fetching one — see
 *     catalog-weak-nt.ts and RECEPTION-PLAN.md Phase C5.
 *  2. Probe whether a per-verse page (romans/9-11.htm) exists at all, and if
 *     so dump its raw heading structure. This is deliberately a report, not
 *     a generator: committing a splitter for markup nobody has looked at
 *     would repeat the exact mistake this whole project has been correcting.
 */
import { politeGet, extractHeadings } from "./lib/fetch.mjs";

const NEW_SLUGS = [
  ["matthew", "MAT"],
  ["mark", "MRK"],
  ["luke", "LUK"],
  ["john", "JHN"],
  ["romans", "ROM"],
  ["1_corinthians", "1CO"],
  ["2_corinthians", "2CO"],
];
const VOICES = ["gill", "poole", "bengel"];

export async function verifyNewSlugs() {
  const results = [];
  for (const [slug, bookId] of NEW_SLUGS) {
    for (const voice of VOICES) {
      const url = `https://biblehub.com/commentaries/${voice}/${slug}/1.htm`;
      const res = await politeGet(url, { delayMs: 300 });
      results.push({ voice, slug, bookId, url, status: res.status, ok: res.ok });
    }
  }
  return results;
}

const VERSE_PAGE_CANDIDATES = [
  "https://biblehub.com/commentaries/romans/9-11.htm",
  "https://biblehub.com/romans/9-11.htm",
];

export async function probeVersePage() {
  for (const url of VERSE_PAGE_CANDIDATES) {
    const res = await politeGet(url);
    if (res.ok) {
      return {
        found: true,
        url: res.url,
        headings: extractHeadings(res.text, 20),
        bodyLength: res.text.length,
      };
    }
  }
  return { found: false, tried: VERSE_PAGE_CANDIDATES };
}

export async function scanBibleHub() {
  return {
    host: "biblehub.com",
    generatedAt: new Date().toISOString(),
    newSlugVerification: await verifyNewSlugs(),
    versePageProbe: await probeVersePage(),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await scanBibleHub();
  console.log(JSON.stringify(result, null, 2));
}
