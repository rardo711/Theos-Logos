/**
 * Discovers Chrysostom's homily-to-chapter mapping and Augustine's Sermon on
 * the Mount pages on New Advent.
 *
 * New Advent's per-homily numbering LOOKS uniform from the URLs already
 * confirmed in the catalog (200101=Matthew h1, 210201/210216=Romans h1/h16,
 * 220101=1 Corinthians h1, 240101=John h1) but it is not: the Galatians-
 * through-Philemon volume breaks the pattern at "23051.htm" (five digits,
 * not six), so a homily-number-to-chapter table built by incrementing a
 * guessed code would be wrong for exactly the books that most need it. This
 * reads the real per-work contents page instead and only falls back to
 * incrementing a known-good numeric seed for works where one is already
 * confirmed working in the live catalog.
 */
import { politeGet, extractLinks, parseChapterVerse } from "./lib/fetch.mjs";

const FATHERS_INDEX = "https://www.newadvent.org/fathers/";

// Confirmed first-homily URLs already live in the catalog today. Safe to
// extend by incrementing the trailing homily number IF the TOC discovery
// below doesn't find a per-homily listing for the same work — every guess
// is still verified by an actual fetch before being trusted.
const NUMERIC_SEEDS = [
  { work: "Chrysostom: Homilies on Matthew", books: ["MAT"], seed: "https://www.newadvent.org/fathers/200101.htm", maxHomilies: 90 },
  { work: "Chrysostom: Homilies on John", books: ["JHN"], seed: "https://www.newadvent.org/fathers/240101.htm", maxHomilies: 88 },
  { work: "Chrysostom: Homilies on Romans", books: ["ROM"], seed: "https://www.newadvent.org/fathers/210201.htm", maxHomilies: 32 },
  { work: "Chrysostom: Homilies on 1 Corinthians", books: ["1CO"], seed: "https://www.newadvent.org/fathers/220101.htm", maxHomilies: 44 },
  { work: "Chrysostom: Homilies on 2 Corinthians", books: ["2CO"], seed: "https://www.newadvent.org/fathers/220201.htm", maxHomilies: 30 },
  { work: "Chrysostom: Homilies on Hebrews", books: ["HEB"], seed: "https://www.newadvent.org/fathers/240201.htm", maxHomilies: 34 },
  { work: "Chrysostom: Homilies on Acts", books: ["ACT"], seed: "https://www.newadvent.org/fathers/210101.htm", maxHomilies: 55 },
];

const TARGET_BOOK_WORDS = [
  ["MAT", ["matthew"]],
  ["MRK", ["mark"]],
  ["LUK", ["luke"]],
  ["JHN", ["john"]],
  ["ACT", ["acts"]],
  ["ROM", ["romans"]],
  ["1CO", ["corinthians"]],
  ["2CO", ["corinthians"]],
  ["GAL", ["galatians"]],
  ["EPH", ["ephesians"]],
  ["PHP", ["philippians"]],
  ["COL", ["colossians"]],
  ["1TH", ["thessalonians"]],
  ["2TH", ["thessalonians"]],
  ["1TI", ["timothy"]],
  ["2TI", ["timothy"]],
  ["TIT", ["titus"]],
  ["PHM", ["philemon"]],
];

function guessBooks(anchorText) {
  const lower = anchorText.toLowerCase();
  return TARGET_BOOK_WORDS.filter(([, words]) => words.some((w) => lower.includes(w))).map(([book]) => book);
}

/** Homily suffix that matches the seed's own digit width (2-digit vs bare). */
function nextHomilyUrl(seedUrl, n) {
  const m = /^(.*?)(\d+)\.htm$/.exec(seedUrl);
  if (!m) return null;
  const width = m[2].length >= 2 ? 2 : m[2].length;
  const prefix = m[2].slice(0, m[2].length - width);
  return `${m[1]}${prefix}${String(n).padStart(width, "0")}.htm`;
}

async function walkNumericSeed(entry) {
  const homilies = [];
  let consecutiveMisses = 0;
  for (let n = 1; n <= entry.maxHomilies; n++) {
    const url = n === 1 ? entry.seed : nextHomilyUrl(entry.seed, n);
    if (!url) break;
    const res = await politeGet(url, { delayMs: 250 });
    if (!res.ok) {
      consecutiveMisses += 1;
      if (consecutiveMisses >= 3) break;
      continue;
    }
    consecutiveMisses = 0;
    const heading = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(res.text)?.[1]?.trim() ?? "";
    homilies.push({ homily: n, url: res.url, heading, parsed: parseChapterVerse(heading) });
  }
  return homilies;
}

export async function scanChrysostomNumeric() {
  const results = [];
  for (const entry of NUMERIC_SEEDS) {
    results.push({ work: entry.work, books: entry.books, method: "numeric-extrapolation", homilies: await walkNumericSeed(entry) });
  }
  return results;
}

/**
 * Reads the master Fathers index for works matching the still-unindexed NT
 * books (Galatians through Philemon, plus Mark/Luke if Chrysostom covered
 * them there). Each matched work page is fetched in turn to see whether it
 * is itself a per-homily contents page.
 */
export async function scanChrysostomFromIndex() {
  const index = await politeGet(FATHERS_INDEX);
  if (!index.ok) {
    return { status: "index-unreachable", url: FATHERS_INDEX };
  }
  const links = extractLinks(index.text, index.url, (href) => /newadvent\.org\/fathers\//.test(href));
  const chrysostomLinks = links.filter((l) => /chrysostom/i.test(l.text));
  const stillNeeded = new Set(["GAL", "EPH", "PHP", "COL", "1TH", "2TH", "1TI", "2TI", "TIT", "PHM", "MRK", "LUK"]);
  const candidates = chrysostomLinks
    .map((l) => ({ ...l, books: guessBooks(l.text) }))
    .filter((l) => l.books.some((b) => stillNeeded.has(b)));

  const works = [];
  for (const c of candidates) {
    const page = await politeGet(c.href);
    if (!page.ok) {
      works.push({ anchorText: c.text, books: c.books, url: c.href, status: "unreachable" });
      continue;
    }
    const homilyLinks = extractLinks(page.text, page.url, (href) => /newadvent\.org\/fathers\/\d+\.htm$/.test(href)).filter(
      (l) => l.text.length > 0,
    );
    works.push({
      anchorText: c.text,
      books: c.books,
      url: c.href,
      status: homilyLinks.length ? "contents-page" : "not-a-contents-page",
      homilies: homilyLinks.map((l) => ({ url: l.href, heading: l.text, parsed: parseChapterVerse(l.text) })),
    });
  }
  return { status: "ok", indexUrl: index.url, matchedLinks: chrysostomLinks.length, works };
}

/** Plan flagged 1601.htm/1602.htm as "expected pattern; verify" — check a range. */
export async function scanAugustineSermonOnTheMount() {
  const candidates = [];
  for (let n = 1590; n <= 1615; n++) candidates.push(`https://www.newadvent.org/fathers/${n}.htm`);
  const hits = [];
  for (const url of candidates) {
    const res = await politeGet(url, { delayMs: 200 });
    if (!res.ok) continue;
    const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(res.text)?.[1]?.trim() ?? "";
    if (/sermon.{0,20}mount/i.test(title) || /sermone domini/i.test(title)) {
      hits.push({ url: res.url, title });
    }
  }
  return { host: "newadvent.org", candidatesChecked: candidates.length, hits };
}

export async function scanNewAdvent() {
  return {
    host: "newadvent.org",
    generatedAt: new Date().toISOString(),
    chrysostomNumeric: await scanChrysostomNumeric(),
    chrysostomFromIndex: await scanChrysostomFromIndex(),
    augustineSermonOnTheMount: await scanAugustineSermonOnTheMount(),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await scanNewAdvent();
  console.log(JSON.stringify(result, null, 2));
}
