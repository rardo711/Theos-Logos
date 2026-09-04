import type { Tradition } from "../bible/types.ts";
import { CATALOG, type CatalogEntry } from "./catalog.ts";
import { CALVIN_CCEL_SECTIONS } from "./data/calvin-ccel-sections.ts";
import { CATENA_CHAPTERS } from "./data/catena-chapters.ts";
import { CHRYSOSTOM_HOMILIES } from "./data/chrysostom-homilies.ts";

// package.json has sideEffects: false. A bare `import "./catalog-weak-nt"`
// is dropped from the Vercel server bundle. ask.ts must call attachWeakNtCatalog().

function e(
  id: string,
  voice: string,
  work: string,
  tradition: Tradition,
  locus: string,
  url: string,
  tags: string[],
  books?: string[],
  chapters?: number[],
  verses?: [number, number],
): CatalogEntry {
  return { id, voice, work, tradition, locus, url, tags, books, chapters, verses };
}

const REV_CHAPTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

const HAND: CatalogEntry[] = [
  e("manton-james-1", "Thomas Manton", "Practical Commentary on James", "puritan", "James 1", "https://www.ccel.org/ccel/manton/manton04.iv.html", ["james", "manton", "trials", "patience", "servant"], ["JAS"], [1]),
  e("manton-james-2", "Thomas Manton", "Practical Commentary on James", "puritan", "James 2", "https://www.ccel.org/ccel/manton/manton04.v.html", ["james", "manton", "faith", "works", "poor"], ["JAS"], [2]),
  e("manton-james-3", "Thomas Manton", "Practical Commentary on James", "puritan", "James 3", "https://www.ccel.org/ccel/manton/manton04.vi.html", ["james", "manton", "tongue", "wisdom"], ["JAS"], [3]),
  e("manton-james-4", "Thomas Manton", "Practical Commentary on James", "puritan", "James 4", "https://www.ccel.org/ccel/manton/manton04.vii.html", ["james", "manton", "wars", "humble", "world"], ["JAS"], [4]),
  e("manton-james-5", "Thomas Manton", "Practical Commentary on James", "puritan", "James 5", "https://www.ccel.org/ccel/manton/manton04.viii.html", ["james", "manton", "patience", "prayer", "anoint"], ["JAS"], [5]),
  e("manton-jude-1", "Thomas Manton", "Practical Commentary on Jude", "puritan", "Jude", "https://www.ccel.org/ccel/manton/manton05.v.html", ["jude", "manton", "ungodly", "faith", "contend"], ["JUD"], [1]),
  e("augustine-1john-2", "Augustine", "Homilies on the First Epistle of John 2", "patristic", "Homily 2", "https://www.newadvent.org/fathers/170202.htm", ["john", "love", "world", "augustine"], ["1JN"], [2]),
  e("augustine-1john-3", "Augustine", "Homilies on the First Epistle of John 4", "patristic", "Homily 4", "https://www.newadvent.org/fathers/170204.htm", ["john", "love", "sin", "augustine"], ["1JN"], [3]),
  e("augustine-1john-4", "Augustine", "Homilies on the First Epistle of John 7", "patristic", "Homily 7", "https://www.newadvent.org/fathers/170207.htm", ["john", "love", "god", "augustine"], ["1JN"], [4]),
  e("augustine-1john-5", "Augustine", "Homilies on the First Epistle of John 10", "patristic", "Homily 10", "https://www.newadvent.org/fathers/170210.htm", ["john", "faith", "witness", "augustine"], ["1JN"], [5]),
  e("chrysostom-acts-h4", "John Chrysostom", "Homilies on Acts 4", "patristic", "Homily 4", "https://www.newadvent.org/fathers/210104.htm", ["acts", "pentecost", "spirit", "tongues", "chrysostom"], ["ACT"], [2]),
  e("chrysostom-acts-h19", "John Chrysostom", "Homilies on Acts 19", "patristic", "Homily 19", "https://www.newadvent.org/fathers/210119.htm", ["acts", "saul", "conversion", "damascus", "chrysostom"], ["ACT"], [9]),
  e("chrysostom-acts-h32", "John Chrysostom", "Homilies on Acts 32", "patristic", "Homily 32", "https://www.newadvent.org/fathers/210132.htm", ["acts", "council", "gentiles", "yoke", "chrysostom"], ["ACT"], [15]),
  e("chrysostom-acts-h38", "John Chrysostom", "Homilies on Acts 38", "patristic", "Homily 38", "https://www.newadvent.org/fathers/210138.htm", ["acts", "athens", "unknown", "altar", "chrysostom"], ["ACT"], [17]),
  e("chrysostom-acts-h55", "John Chrysostom", "Homilies on Acts 55", "patristic", "Homily 55", "https://www.newadvent.org/fathers/210155.htm", ["acts", "rome", "paul", "kingdom", "chrysostom"], ["ACT"], [28]),
  e("chrysostom-heb-h4", "John Chrysostom", "Homilies on Hebrews 4", "patristic", "Homily 4", "https://www.newadvent.org/fathers/240204.htm", ["hebrews", "angels", "salvation", "chrysostom"], ["HEB"], [2]),
  e("chrysostom-heb-h8", "John Chrysostom", "Homilies on Hebrews 8", "patristic", "Homily 8", "https://www.newadvent.org/fathers/240208.htm", ["hebrews", "priest", "melchizedek", "chrysostom"], ["HEB"], [5]),
  e("chrysostom-heb-h13", "John Chrysostom", "Homilies on Hebrews 13", "patristic", "Homily 13", "https://www.newadvent.org/fathers/240213.htm", ["hebrews", "priest", "oath", "chrysostom"], ["HEB"], [7]),
  e("chrysostom-heb-h15", "John Chrysostom", "Homilies on Hebrews 15", "patristic", "Homily 15", "https://www.newadvent.org/fathers/240215.htm", ["hebrews", "covenant", "blood", "chrysostom"], ["HEB"], [9]),
  e("chrysostom-heb-h19", "John Chrysostom", "Homilies on Hebrews 19", "patristic", "Homily 19", "https://www.newadvent.org/fathers/240219.htm", ["hebrews", "veil", "boldness", "chrysostom"], ["HEB"], [10]),
  e("chrysostom-heb-h22", "John Chrysostom", "Homilies on Hebrews 22", "patristic", "Homily 22", "https://www.newadvent.org/fathers/240222.htm", ["hebrews", "faith", "witnesses", "chrysostom"], ["HEB"], [11]),
  e("chrysostom-heb-h28", "John Chrysostom", "Homilies on Hebrews 28", "patristic", "Homily 28", "https://www.newadvent.org/fathers/240228.htm", ["hebrews", "discipline", "zion", "chrysostom"], ["HEB"], [12]),
  e("chrysostom-heb-h33", "John Chrysostom", "Homilies on Hebrews 33", "patristic", "Homily 33", "https://www.newadvent.org/fathers/240233.htm", ["hebrews", "altar", "outside", "chrysostom"], ["HEB"], [13]),
  e("victorinus-revelation-more", "Victorinus", "Commentary on the Apocalypse", "patristic", "In Apocalypsin", "https://www.newadvent.org/fathers/0712.htm", ["revelation", "apocalypse", "victorinus"], ["REV"], REV_CHAPTERS),
  e("hippolytus-antichrist-rev", "Hippolytus", "On Christ and Antichrist", "patristic", "De Christo et Antichristo", "https://www.newadvent.org/fathers/0516.htm", ["revelation", "apocalypse", "antichrist", "beast", "hippolytus"], ["REV"], [13, 17, 20]),
  e("irenaeus-ah5-30-rev", "Irenaeus", "Against Heresies 5.30", "patristic", "Adv. Haer. 5.30", "https://www.newadvent.org/fathers/0103530.htm", ["revelation", "beast", "number", "irenaeus"], ["REV"], [13]),
  e("irenaeus-ah5-36-rev", "Irenaeus", "Against Heresies 5.36", "patristic", "Adv. Haer. 5.36", "https://www.newadvent.org/fathers/0103536.htm", ["revelation", "new", "heaven", "earth", "irenaeus"], ["REV"], [21]),
  e("augustine-civdei-20-rev", "Augustine", "City of God 20", "patristic", "De civitate Dei 20", "https://www.newadvent.org/fathers/120120.htm", ["revelation", "millennium", "thousand", "augustine"], ["REV"], [20]),
];

const BOOK_STEM: Record<string, string> = {
  MAT: "matthew",
  MRK: "mark",
  LUK: "luke",
  JHN: "john",
  ACT: "acts",
  ROM: "romans",
  "1CO": "1corinthians",
  "2CO": "2corinthians",
  GAL: "galatians",
  EPH: "ephesians",
  PHP: "philippians",
  COL: "colossians",
  "1TH": "1thessalonians",
  "2TH": "2thessalonians",
  "1TI": "1timothy",
  "2TI": "2timothy",
  TIT: "titus",
  PHM: "philemon",
  HEB: "hebrews",
  JAS: "james",
  "1PE": "1peter",
  "2PE": "2peter",
  "1JN": "1john",
  "2JN": "2john",
  "3JN": "3john",
  JUD: "jude",
  REV: "revelation",
};

const BOOK_NAME: Record<string, string> = {
  MAT: "Matthew",
  MRK: "Mark",
  LUK: "Luke",
  JHN: "John",
  ACT: "Acts",
  ROM: "Romans",
  "1CO": "1 Corinthians",
  "2CO": "2 Corinthians",
  GAL: "Galatians",
  EPH: "Ephesians",
  PHP: "Philippians",
  COL: "Colossians",
  "1TH": "1 Thessalonians",
  "2TH": "2 Thessalonians",
  "1TI": "1 Timothy",
  "2TI": "2 Timothy",
  TIT: "Titus",
  PHM: "Philemon",
  HEB: "Hebrews",
  JAS: "James",
  "1PE": "1 Peter",
  "2PE": "2 Peter",
  "1JN": "1 John",
  "2JN": "2 John",
  "3JN": "3 John",
  JUD: "Jude",
  REV: "Revelation",
};

const CHRYS_SHORT: Record<string, string> = {
  MAT: "matt",
  JHN: "john",
  ROM: "rom",
  "1CO": "1corinthians",
  "2CO": "2corinthians",
  GAL: "galatians",
  EPH: "ephesians",
  PHP: "philippians",
  COL: "col",
  "1TH": "1thessalonians",
  "2TH": "2thessalonians",
  "1TI": "1timothy",
  "2TI": "2timothy",
  TIT: "titus",
  PHM: "philemon",
  HEB: "heb",
  ACT: "acts",
};

const WEAK_NT_HUB = [
  // Gospels, Romans and the Corinthian letters. Before this they had only the
  // Matthew Henry chapter pages, so 1 Corinthians 13 mapped to a single row.
  ["matthew", "MAT", "Matthew", 28],
  ["mark", "MRK", "Mark", 16],
  ["luke", "LUK", "Luke", 24],
  ["john", "JHN", "John", 21],
  ["romans", "ROM", "Romans", 16],
  ["1_corinthians", "1CO", "1 Corinthians", 16],
  ["2_corinthians", "2CO", "2 Corinthians", 13],
  ["james", "JAS", "James", 5],
  ["1_peter", "1PE", "1 Peter", 5],
  ["2_peter", "2PE", "2 Peter", 3],
  ["1_john", "1JN", "1 John", 5],
  ["2_john", "2JN", "2 John", 1],
  ["3_john", "3JN", "3 John", 1],
  ["jude", "JUD", "Jude", 1],
  ["revelation", "REV", "Revelation", 22],
  ["hebrews", "HEB", "Hebrews", 13],
  ["acts", "ACT", "Acts", 28],
  ["galatians", "GAL", "Galatians", 6],
  ["ephesians", "EPH", "Ephesians", 6],
  ["philippians", "PHP", "Philippians", 4],
  ["colossians", "COL", "Colossians", 4],
  ["1_thessalonians", "1TH", "1 Thessalonians", 5],
  ["2_thessalonians", "2TH", "2 Thessalonians", 3],
  ["1_timothy", "1TI", "1 Timothy", 6],
  ["2_timothy", "2TI", "2 Timothy", 4],
  ["titus", "TIT", "Titus", 3],
  ["philemon", "PHM", "Philemon", 1],
] as const;

const HUB_VOICES = [
  ["gill", "John Gill", "Exposition of the Entire Bible", "reformed", "gill"],
  ["poole", "Matthew Poole", "Annotations upon the Holy Bible", "puritan", "poole"],
  ["bengel", "Johann Albrecht Bengel", "Gnomon of the New Testament", "lutheran", "bengel"],
  ["clarke", "Adam Clarke", "Commentary on the Holy Bible", "arminian", "clarke"],
] as const;

function bookTag(name: string): string {
  return name.toLowerCase().replace(/^\d+\s+/, "");
}

function calvinWork(book: string): string {
  if (book === "MAT" || book === "MRK" || book === "LUK") {
    return "Commentary on a Harmony of the Evangelists";
  }
  return `Commentary on ${BOOK_NAME[book] ?? book}`;
}

/** Collapse www / directory variants so one page cannot enter under two strings. */
function canonUrl(url: string): string {
  return url
    .replace(/^https:\/\/www\./i, "https://")
    .replace(/\/$/, "")
    .replace(/\/calvin\/(calcom\d+)\.([^/]+\.html)$/i, "/calvin/$1/$1.$2")
    .replace(/\/aquinas\/(catena\d+)\/\1\./i, "/aquinas/$1.");
}

function hubAndRevelation(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  // Revelation extras first so Wesley / Geneva are not crowded out by three Hub voices.
  for (const ch of REV_CHAPTERS) {
    const wesleyId = `wesley-revelation-${ch}`;
    if (!have.has(wesleyId)) {
      out.push(
        e(
          wesleyId,
          "John Wesley",
          "Explanatory Notes upon the New Testament",
          "reformed",
          `Revelation ${ch}`,
          `https://www.godrules.net/library/wesley/wesleyrev${ch}.htm`,
          ["revelation", "wesley"],
          ["REV"],
          [ch],
        ),
      );
    }
    const genevaId = `geneva-revelation-${ch}`;
    if (!have.has(genevaId)) {
      out.push(
        e(
          genevaId,
          "Geneva Bible",
          "Geneva Bible Notes",
          "reformed",
          `Revelation ${ch}`,
          `https://biblehub.com/geneva/revelation/${ch}.htm`,
          ["revelation", "geneva", "reformer"],
          ["REV"],
          [ch],
        ),
      );
    }
  }
  for (const [slug, bookId, name, chapters] of WEAK_NT_HUB) {
    const tag = bookTag(name);
    for (const [stem, voice, work, tradition, voiceTag] of HUB_VOICES) {
      for (let ch = 1; ch <= chapters; ch++) {
        const id = `${stem}-${slug.replace(/_/g, "")}-${ch}`;
        if (have.has(id)) continue;
        out.push(
          e(id, voice, work, tradition, `${name} ${ch}`, `https://biblehub.com/commentaries/${stem}/${slug}/${ch}.htm`, [tag, voiceTag], [bookId], [ch]),
        );
      }
    }
  }
  return out;
}

function calvinCcelSections(have: Set<string>, byUrl: Map<string, CatalogEntry>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const sec of CALVIN_CCEL_SECTIONS) {
    const existing = byUrl.get(canonUrl(sec.url));
    if (existing) {
      const hit = existing.books?.includes(sec.book)
        ? sec
        : sec.parallels.find((p) => existing.books?.includes(p.book));
      if (hit && !existing.verses) {
        existing.verses = [hit.start, hit.end];
        existing.locus = hit.locus;
      }
      continue;
    }
    const stem = BOOK_STEM[sec.book];
    if (!stem) continue;
    const id =
      sec.start === sec.end
        ? `calvin-${stem}-${sec.chapter}-${sec.start}`
        : `calvin-${stem}-${sec.chapter}-${sec.start}-${sec.end}`;
    if (have.has(id)) continue;
    out.push(
      e(
        id,
        "John Calvin",
        calvinWork(sec.book),
        "reformed",
        sec.locus,
        sec.url,
        [bookTag(BOOK_NAME[sec.book] ?? stem), "calvin"],
        [sec.book],
        [sec.chapter],
        [sec.start, sec.end],
      ),
    );
  }
  return out;
}

function catenaChapters(have: Set<string>, byUrl: Map<string, CatalogEntry>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const ch of CATENA_CHAPTERS) {
    if (byUrl.has(canonUrl(ch.url))) continue;
    const stem = BOOK_STEM[ch.book];
    if (!stem) continue;
    const id = `aquinas-catena-${stem}-${ch.chapter}`;
    if (have.has(id)) continue;
    out.push(
      e(
        id,
        "Thomas Aquinas",
        `Catena Aurea on ${BOOK_NAME[ch.book]}`,
        "catholic",
        ch.locus,
        ch.url,
        [bookTag(BOOK_NAME[ch.book] ?? stem), "aquinas", "thomas", "catena"],
        [ch.book],
        [ch.chapter],
      ),
    );
  }
  return out;
}

function chrysostomHomilies(have: Set<string>, byUrl: Map<string, CatalogEntry>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const h of CHRYSOSTOM_HOMILIES) {
    const existing = byUrl.get(canonUrl(h.url));
    if (existing) {
      if (!existing.verses && h.verses) existing.verses = h.verses;
      if (h.chapters.length && existing.books?.includes(h.book)) {
        existing.chapters = h.chapters;
      }
      if (h.locus && existing.locus.toLowerCase().startsWith("homily") && h.locus.includes(":")) {
        existing.locus = h.locus;
      }
      continue;
    }
    const short = CHRYS_SHORT[h.book] ?? BOOK_STEM[h.book];
    if (!short) continue;
    const id =
      h.kind === "chapter"
        ? `chrysostom-${BOOK_STEM[h.book]}-${h.homily}`
        : `chrysostom-${short}-h${h.homily}`;
    if (have.has(id)) continue;
    out.push(
      e(
        id,
        "John Chrysostom",
        h.work,
        "patristic",
        h.locus,
        h.url,
        [bookTag(BOOK_NAME[h.book] ?? short), "chrysostom"],
        [h.book],
        h.chapters,
        h.verses,
      ),
    );
  }
  return out;
}

/** Append weak-NT pointers onto the shared CATALOG array. mapCatalog reads CATALOG at call time. */
export function attachWeakNtCatalog(): void {
  const have = new Set(CATALOG.map((row) => row.id));
  const byUrl = new Map<string, CatalogEntry>();
  for (const row of CATALOG) {
    const key = canonUrl(row.url);
    if (!byUrl.has(key)) byUrl.set(key, row);
  }
  for (const row of HAND) {
    if (have.has(row.id)) continue;
    const key = canonUrl(row.url);
    if (byUrl.has(key)) continue;
    CATALOG.push(row);
    have.add(row.id);
    byUrl.set(key, row);
  }
  const incoming = [
    ...calvinCcelSections(have, byUrl),
    ...catenaChapters(have, byUrl),
    ...chrysostomHomilies(have, byUrl),
    ...hubAndRevelation(have),
  ];
  for (const row of incoming) {
    if (have.has(row.id)) continue;
    const key = canonUrl(row.url);
    if (byUrl.has(key)) continue;
    CATALOG.push(row);
    have.add(row.id);
    byUrl.set(key, row);
  }
}
