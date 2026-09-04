#!/usr/bin/env node
/**
 * Build committed Phase C catalog data from live TOCs / opening lemmas.
 *
 *   node scripts/research/build-phase-c-data.mjs
 *
 * Writes:
 *   src/lib/reception/data/calvin-ccel-sections.ts
 *   src/lib/reception/data/catena-chapters.ts
 *   src/lib/reception/data/chrysostom-homilies.ts
 *
 * Never invents a URL. A page that does not return 200 is omitted.
 * Re-run this script when CCEL or New Advent renumber a volume; do not
 * hand-edit the generated files.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const OUT_DIR = join(ROOT, "src/lib/reception/data");
const UA =
  "Mozilla/5.0 (compatible; TheosLogosBot/1.0; +https://github.com/rardo711/Theos-Logos; one-off catalog TOC crawl)";

const BOOKS = [
  ["1 Thessalonians", "1TH"],
  ["2 Thessalonians", "2TH"],
  ["I Thessalonians", "1TH"],
  ["II Thessalonians", "2TH"],
  ["1 Corinthians", "1CO"],
  ["2 Corinthians", "2CO"],
  ["I Corinthians", "1CO"],
  ["II Corinthians", "2CO"],
  ["1 Timothy", "1TI"],
  ["2 Timothy", "2TI"],
  ["I Timothy", "1TI"],
  ["II Timothy", "2TI"],
  ["1 Peter", "1PE"],
  ["2 Peter", "2PE"],
  ["I Peter", "1PE"],
  ["II Peter", "2PE"],
  ["1 John", "1JN"],
  ["2 John", "2JN"],
  ["3 John", "3JN"],
  ["I John", "1JN"],
  ["II John", "2JN"],
  ["III John", "3JN"],
  ["Philemon", "PHM"],
  ["Philippians", "PHP"],
  ["Colossians", "COL"],
  ["Galatians", "GAL"],
  ["Ephesians", "EPH"],
  ["Hebrews", "HEB"],
  ["Heb", "HEB"],
  ["Matthew", "MAT"],
  ["Mark", "MRK"],
  ["Luke", "LUK"],
  ["John", "JHN"],
  ["Acts", "ACT"],
  ["Romans", "ROM"],
  ["Titus", "TIT"],
  ["James", "JAS"],
  ["Jude", "JUD"],
  ["Revelation", "REV"],
];

const BOOK_BY_ID = {};
for (const [n, id] of BOOKS) {
  if (!BOOK_BY_ID[id]) BOOK_BY_ID[id] = n;
}

const NA_BOOK_SLUG = {
  mat: "MAT",
  mrk: "MRK",
  mar: "MRK",
  luk: "LUK",
  joh: "JHN",
  jhn: "JHN",
  act: "ACT",
  rom: "ROM",
  "1co": "1CO",
  "2co": "2CO",
  gal: "GAL",
  eph: "EPH",
  phi: "PHP",
  php: "PHP",
  col: "COL",
  "1th": "1TH",
  "2th": "2TH",
  "1ti": "1TI",
  "2ti": "2TI",
  tit: "TIT",
  phm: "PHM",
  heb: "HEB",
  jam: "JAS",
  jas: "JAS",
  "1pe": "1PE",
  "2pe": "2PE",
  "1jo": "1JN",
  "2jo": "2JN",
  "3jo": "3JN",
  jud: "JUD",
  rev: "REV",
};

const ROMAN_INT = {
  i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10,
  xi: 11, xii: 12, xiii: 13, xiv: 14, xv: 15, xvi: 16, xvii: 17, xviii: 18,
  xix: 19, xx: 20, xxi: 21, xxii: 22, xxiii: 23, xxiv: 24, xxv: 25, xxvi: 26,
  xxvii: 27, xxviii: 28, xxix: 29, xxx: 30, xxxi: 31, xxxii: 32, xxxiii: 33,
  xxxiv: 34, xxxv: 35, xxxvi: 36, xxxvii: 37, xxxviii: 38, xxxix: 39, xl: 40,
  xli: 41, xlii: 42, xliii: 43, xliv: 44, xlv: 45, xlvi: 46, xlvii: 47,
  xlviii: 48, xlix: 49, l: 50, li: 51, lii: 52, liii: 53, liv: 54, lv: 55,
  lx: 60, lxx: 70, lxxx: 80, xc: 90,
};

const CALVIN_VOLUMES = [
  "calcom31", "calcom32", "calcom33", "calcom34", "calcom35",
  "calcom36", "calcom37", "calcom38", "calcom39", "calcom40",
  "calcom41", "calcom42", "calcom43", "calcom44", "calcom45",
];

const CATENA_VOLUMES = [
  { vol: "catena1", book: "MAT" },
  { vol: "catena2", book: "MRK" },
  { vol: "catena3", book: "LUK" },
  { vol: "catena4", book: "JHN" },
];

const CHRYSOSTOM_INDEXES = [
  { book: "MAT", url: "https://www.newadvent.org/fathers/2001.htm", work: "Homilies on Matthew" },
  { book: "JHN", url: "https://www.newadvent.org/fathers/2401.htm", work: "Homilies on John" },
  { book: "ROM", url: "https://www.newadvent.org/fathers/2102.htm", work: "Homilies on Romans" },
  { book: "1CO", url: "https://www.newadvent.org/fathers/2201.htm", work: "Homilies on First Corinthians" },
  { book: "2CO", url: "https://www.newadvent.org/fathers/2202.htm", work: "Homilies on Second Corinthians" },
  { book: "HEB", url: "https://www.newadvent.org/fathers/2402.htm", work: "Homilies on Hebrews" },
  { book: "ACT", url: "https://www.newadvent.org/fathers/2101.htm", work: "Homilies on Acts" },
  { book: "GAL", url: "https://www.newadvent.org/fathers/2310.htm", work: "Commentary on Galatians" },
  { book: "EPH", url: "https://www.newadvent.org/fathers/2301.htm", work: "Homilies on Ephesians" },
  { book: "PHP", url: "https://www.newadvent.org/fathers/2302.htm", work: "Homilies on Philippians" },
  { book: "COL", url: "https://www.newadvent.org/fathers/2303.htm", work: "Homilies on Colossians" },
  { book: "1TH", url: "https://www.newadvent.org/fathers/2304.htm", work: "Homilies on First Thessalonians" },
  { book: "2TH", url: "https://www.newadvent.org/fathers/2305.htm", work: "Homilies on Second Thessalonians" },
  { book: "1TI", url: "https://www.newadvent.org/fathers/2306.htm", work: "Homilies on First Timothy" },
  { book: "2TI", url: "https://www.newadvent.org/fathers/2307.htm", work: "Homilies on Second Timothy" },
  { book: "TIT", url: "https://www.newadvent.org/fathers/2308.htm", work: "Homilies on Titus" },
  { book: "PHM", url: "https://www.newadvent.org/fathers/2309.htm", work: "Homilies on Philemon" },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function decodeEntities(s) {
  return s
    .replace(/&/g, "&")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

async function get(url, { timeoutMs = 20_000, retries = 2, delayMs = 120 } = {}) {
  await sleep(delayMs);
  let last;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "text/html" },
        redirect: "follow",
        signal: AbortSignal.timeout(timeoutMs),
      });
      const text = res.ok ? await res.text() : "";
      return { url, finalUrl: res.url, status: res.status, ok: res.ok, text };
    } catch (err) {
      last = err;
      if (attempt < retries) await sleep(800 * (attempt + 1));
    }
  }
  return { url, finalUrl: url, status: 0, ok: false, text: "", error: last?.message };
}

function extractLinks(html, base) {
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
    const text = stripTags(m[2]);
    if (text) out.push({ href, text });
  }
  return out;
}

function parseRefs(text) {
  const refs = [];
  for (const [name, book] of BOOKS) {
    const re = new RegExp(
      `\\b${name}\\s+(\\d{1,3}):(\\d{1,3})(?:\\s*[-–—]\\s*(\\d{1,3}))?`,
      "gi",
    );
    let m;
    while ((m = re.exec(text))) {
      const chapter = Number(m[1]);
      const start = Number(m[2]);
      const end = m[3] ? Number(m[3]) : start;
      if (end < start) continue;
      refs.push({
        book,
        chapter,
        start,
        end,
        locus: `${BOOK_BY_ID[book]} ${chapter}:${start}${end !== start ? `-${end}` : ""}`,
        index: m.index,
      });
    }
  }
  // Single-chapter books print "Jude 1-2" / "Philemon 1-7" with no chapter colon.
  for (const [name, book] of [
    ["Philemon", "PHM"],
    ["Jude", "JUD"],
    ["2 John", "2JN"],
    ["3 John", "3JN"],
  ]) {
    const re = new RegExp(
      `\\b${name}\\s+(\\d{1,3})(?:\\s*[-–—]\\s*(\\d{1,3}))?(?!\\s*:)`,
      "gi",
    );
    let m;
    while ((m = re.exec(text))) {
      const start = Number(m[1]);
      const end = m[2] ? Number(m[2]) : start;
      if (end < start) continue;
      refs.push({
        book,
        chapter: 1,
        start,
        end,
        locus: `${name} ${start}${end !== start ? `-${end}` : ""}`,
        index: m.index,
      });
    }
  }
  refs.sort((a, b) => a.index - b.index);
  return refs.map(({ index: _i, ...r }) => r);
}

function canonCalvinUrl(vol, href) {
  const m = href.match(new RegExp(`(${vol}\\.[a-z0-9.]+\\.html)$`, "i"));
  if (!m) return null;
  return `https://ccel.org/ccel/calvin/${vol}/${m[1]}`;
}

function canonCatenaUrl(vol, href) {
  const m = href.match(new RegExp(`(${vol}\\.[a-z0-9.]+\\.html)$`, "i"));
  if (!m) return null;
  return `https://www.ccel.org/ccel/aquinas/${m[1]}`;
}

function parseChapterHeading(text) {
  const m = /^Chapter\s+(\d{1,3})\b/i.exec(text.trim());
  return m ? Number(m[1]) : null;
}

async function crawlCalvin() {
  const sections = [];
  const seen = new Set();
  for (const vol of CALVIN_VOLUMES) {
    const toc = `https://ccel.org/ccel/calvin/${vol}.toc.html`;
    const res = await get(toc, { delayMs: 180 });
    if (!res.ok) {
      console.warn(`[calvin] TOC miss ${res.status} ${toc}`);
      continue;
    }
    const links = extractLinks(res.text, res.finalUrl);
    let n = 0;
    for (const l of links) {
      const url = canonCalvinUrl(vol, l.href);
      if (!url || seen.has(url)) continue;
      const refs = parseRefs(l.text);
      if (!refs.length) continue;
      seen.add(url);
      const primary = refs[0];
      sections.push({
        book: primary.book,
        chapter: primary.chapter,
        start: primary.start,
        end: primary.end,
        url,
        locus: primary.locus,
        parallels: refs.slice(1).map((r) => ({
          book: r.book,
          chapter: r.chapter,
          start: r.start,
          end: r.end,
          locus: r.locus,
        })),
      });
      n += 1;
    }
    console.log(`[calvin] ${vol} ${n} pericopes`);
  }
  return sections;
}

async function crawlCatena() {
  const chapters = [];
  for (const { vol, book } of CATENA_VOLUMES) {
    const toc = `https://ccel.org/ccel/aquinas/${vol}.toc.html`;
    const res = await get(toc, { delayMs: 180 });
    if (!res.ok) {
      console.warn(`[catena] TOC miss ${res.status} ${toc}`);
      continue;
    }
    const links = extractLinks(res.text, res.finalUrl);
    let n = 0;
    for (const l of links) {
      const ch = parseChapterHeading(l.text);
      if (!ch) continue;
      const url = canonCatenaUrl(vol, l.href);
      if (!url) continue;
      chapters.push({ book, chapter: ch, url, locus: `${BOOK_BY_ID[book]} ${ch}` });
      n += 1;
    }
    console.log(`[catena] ${vol} ${book} ${n} chapters`);
  }
  return chapters;
}

function parseHomilyNum(text) {
  const h = /\bHomily\s+(\d{1,3})\b/i.exec(text);
  if (h) return { n: Number(h[1]), kind: "homily" };
  const c = /\bChapter\s+(\d{1,3})\b/i.exec(text);
  if (c) return { n: Number(c[1]), kind: "chapter" };
  return null;
}

function romanToInt(s) {
  return ROMAN_INT[s.toLowerCase()] ?? null;
}

const LEMMA_NAMES = {
  MAT: ["Matthew", "Matt"],
  MRK: ["Mark"],
  LUK: ["Luke"],
  JHN: ["John", "Joh"],
  ACT: ["Acts"],
  ROM: ["Romans", "Rom"],
  "1CO": ["1 Corinthians", "1 Cor", "I Cor"],
  "2CO": ["2 Corinthians", "2 Cor", "II Cor"],
  GAL: ["Galatians", "Gal"],
  EPH: ["Ephesians", "Eph"],
  PHP: ["Philippians", "Phil", "Phi"],
  COL: ["Colossians", "Col"],
  "1TH": ["1 Thessalonians", "1 Thess", "1 Thes"],
  "2TH": ["2 Thessalonians", "2 Thess", "2 Thes"],
  "1TI": ["1 Timothy", "1 Tim"],
  "2TI": ["2 Timothy", "2 Tim"],
  TIT: ["Titus", "Tit"],
  PHM: ["Philemon", "Philem"],
  HEB: ["Hebrews", "Heb"],
  JAS: ["James", "Jas"],
};

function parseLemmaText(text, book) {
  const names = LEMMA_NAMES[book] ?? [BOOK_BY_ID[book]];
  for (const name of names) {
    const arabic = new RegExp(
      `\\b${name}\\.?\\s+(\\d{1,3}):(\\d{1,3})(?:\\s*[-–—]\\s*(\\d{1,3}))?`,
      "i",
    );
    const m = arabic.exec(text);
    if (m) return { chapter: Number(m[1]), verse: Number(m[2]) };
    const roman = new RegExp(`\\b${name}\\.?\\s+([IVXLC]+)\\.\\s*(\\d{1,3})\\b`, "i");
    const r = roman.exec(text);
    if (r) {
      const chapter = romanToInt(r[1]);
      const verse = Number(r[2]);
      if (chapter && verse) return { chapter, verse };
    }
  }
  return null;
}

function parseLemmaFromHtml(html, book) {
  const donation = /please help support the mission of new advent/i;
  const paras = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
  for (const raw of paras) {
    const text = stripTags(raw);
    if (!text || donation.test(text)) continue;
    // Only the opening of the first real paragraph. Later citations in a
    // long preface are not the homily's lemma.
    const head = text.slice(0, 90);
    const chHead =
      /^Chapter\s+([IVXLC]+|\d+)\.?\s+Verses?\s+(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?/i.exec(
        head,
      );
    if (chHead) {
      const chapter = /^\d+$/.test(chHead[1])
        ? Number(chHead[1])
        : romanToInt(chHead[1]);
      if (chapter) return { chapter, verse: Number(chHead[2]) };
    }
    const lemma = parseLemmaText(head, book);
    if (lemma) return lemma;
    return null;
  }
  return null;
}

async function pool(items, size, worker) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await worker(items[i], i);
      }
    }),
  );
  return out;
}

async function crawlChrysostom() {
  const homilies = [];
  for (const work of CHRYSOSTOM_INDEXES) {
    const res = await get(work.url, { delayMs: 150 });
    if (!res.ok) {
      console.warn(`[chrysostom] index miss ${res.status} ${work.url}`);
      continue;
    }
    const links = extractLinks(res.text, res.finalUrl).filter((l) =>
      /newadvent\.org\/fathers\/\d+\.htm$/i.test(l.href),
    );
    const entries = [];
    const seen = new Set();
    for (const l of links) {
      const parsed = parseHomilyNum(l.text);
      if (!parsed) continue;
      const url = l.href.replace(/http:\/\//, "https://");
      if (seen.has(url)) continue;
      seen.add(url);
      entries.push({ ...parsed, url, book: work.book, work: work.work });
    }
    entries.sort((a, b) => a.n - b.n);
    console.log(`[chrysostom] ${work.book} index: ${entries.length} pages, fetching lemmas…`);
    const fetched = await pool(entries, 4, async (entry) => {
      const page = await get(entry.url, { delayMs: 80, retries: 1 });
      if (!page.ok) {
        console.warn(`[chrysostom] miss ${page.status} ${entry.url}`);
        return null;
      }
      const lemma = parseLemmaFromHtml(page.text, entry.book);
      return { ...entry, lemma };
    });
    const live = fetched.filter(Boolean);
    for (let i = 0; i < live.length; i++) {
      const cur = live[i];
      const next = cur.lemma
        ? live.slice(i + 1).find(
            (x) =>
              x.lemma &&
              (x.lemma.chapter > cur.lemma.chapter ||
                (x.lemma.chapter === cur.lemma.chapter &&
                  x.lemma.verse > cur.lemma.verse)),
          )
        : live.slice(i + 1).find((x) => x.lemma);
      let chapters;
      let verses;
      let locus;
      if (cur.kind === "chapter") {
        chapters = [cur.n];
        locus = `${BOOK_BY_ID[cur.book]} ${cur.n}`;
      } else if (cur.lemma) {
        const startCh = cur.lemma.chapter;
        const startV = cur.lemma.verse;
        if (next?.lemma) {
          const endCh = next.lemma.chapter;
          const endV = next.lemma.verse;
          if (endCh === startCh) {
            chapters = [startCh];
            const end = Math.max(startV, endV - 1);
            verses = [startV, end];
            locus = `${BOOK_BY_ID[cur.book]} ${startCh}:${startV}${end !== startV ? `-${end}` : ""}`;
          } else if (endCh > startCh) {
            const span = endCh - startCh + (endV > 1 ? 1 : 0);
            // A span of many chapters almost always means a missed lemma,
            // not a homily that actually covers half a gospel.
            if (span > 2) {
              chapters = [startCh];
              verses = [startV, 999];
              locus = `${BOOK_BY_ID[cur.book]} ${startCh}:${startV}–end`;
            } else {
              chapters = [];
              for (let c = startCh; c < endCh; c++) chapters.push(c);
              if (endV > 1) chapters.push(endCh);
              if (chapters.length === 1) {
                verses = [startV, 999];
                locus = `${BOOK_BY_ID[cur.book]} ${startCh}:${startV}–end`;
              } else {
                locus = `Homily ${cur.n} (${BOOK_BY_ID[cur.book]} ${chapters[0]}–${chapters.at(-1)})`;
              }
            }
          } else {
            chapters = [startCh];
            verses = [startV, 999];
            locus = `${BOOK_BY_ID[cur.book]} ${startCh}:${startV}`;
          }
        } else {
          chapters = [startCh];
          verses = [startV, 999];
          locus = `${BOOK_BY_ID[cur.book]} ${startCh}:${startV}–end`;
        }
      } else if (cur.n === 1) {
        chapters = [1];
        locus = `Homily 1`;
      } else {
        continue;
      }
      homilies.push({
        book: cur.book,
        homily: cur.n,
        kind: cur.kind,
        url: cur.url,
        chapters,
        ...(verses ? { verses } : {}),
        locus,
        work: cur.work,
      });
    }
    console.log(`[chrysostom] ${work.book} kept ${live.length} live pages`);
  }
  return homilies;
}

function tsFile(comment, typeName, typeBody, exportName, rows) {
  return `/** ${comment} */
export type ${typeName} = ${typeBody};

export const ${exportName}: ${typeName}[] = ${JSON.stringify(rows, null, 2)};
`;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const generatedAt = new Date().toISOString().slice(0, 10);
  console.log(`Phase C crawl ${generatedAt}`);

  const calvin = await crawlCalvin();
  const catena = await crawlCatena();
  const chrysostom = await crawlChrysostom();

  writeFileSync(
    join(OUT_DIR, "calvin-ccel-sections.ts"),
    tsFile(
      `Calvin Translation Society pericopes, crawled from each volume's .toc.html on ${generatedAt}. One row per unique URL; harmony pages keep later gospels in \`parallels\`. Regenerate with scripts/research/build-phase-c-data.mjs.`,
      "CalvinCcelSection",
      `{
  book: string;
  chapter: number;
  start: number;
  end: number;
  url: string;
  locus: string;
  parallels: Array<{
    book: string;
    chapter: number;
    start: number;
    end: number;
    locus: string;
  }>;
}`,
      "CALVIN_CCEL_SECTIONS",
      calvin,
    ),
  );
  writeFileSync(
    join(OUT_DIR, "catena-chapters.ts"),
    tsFile(
      `Catena Aurea per-chapter pages, crawled from each volume's .toc.html on ${generatedAt}. CCEL currently hosts Matthew (catena1) and Mark (catena2); Luke and John volumes 404'd. Regenerate with scripts/research/build-phase-c-data.mjs.`,
      "CatenaChapter",
      `{
  book: string;
  chapter: number;
  url: string;
  locus: string;
}`,
      "CATENA_CHAPTERS",
      catena,
    ),
  );
  writeFileSync(
    join(OUT_DIR, "chrysostom-homilies.ts"),
    tsFile(
      `Chrysostom homily (or Galatians chapter) pages from New Advent, lemmas parsed from each page's opening bible link on ${generatedAt}. End verse is inferred from the next homily's start. Regenerate with scripts/research/build-phase-c-data.mjs.`,
      "ChrysostomHomily",
      `{
  book: string;
  homily: number;
  kind: "homily" | "chapter";
  url: string;
  chapters: number[];
  verses?: [number, number];
  locus: string;
  work: string;
}`,
      "CHRYSOSTOM_HOMILIES",
      chrysostom,
    ),
  );

  console.log(
    `wrote ${calvin.length} calvin, ${catena.length} catena, ${chrysostom.length} chrysostom`,
  );
}

await main();
