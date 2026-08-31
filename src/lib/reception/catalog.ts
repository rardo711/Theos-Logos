import type { Tradition } from "../bible/types.ts";

/** Committed public-page index. Nothing is downloaded at build time. */
export type CatalogEntry = {
  id: string;
  voice: string;
  work: string;
  tradition: Tradition;
  locus: string;
  url: string;
  altUrl?: string;
  tags: string[];
  books?: string[];
  chapters?: number[];
};

export const CATALOG: CatalogEntry[] = [
  {
    id: "augustine-john-tr1",
    voice: "Augustine",
    work: "Tractates on the Gospel of John 1",
    tradition: "patristic",
    locus: "Tractate 1",
    url: "https://www.newadvent.org/fathers/1701001.htm",
    tags: ["word", "logos", "beginning", "john", "incarnation"],
    books: ["JHN"],
    chapters: [1],
  },
  {
    id: "chrysostom-john-h1",
    voice: "John Chrysostom",
    work: "Homilies on John 1",
    tradition: "patristic",
    locus: "Homily 1",
    url: "https://www.newadvent.org/fathers/240101.htm",
    tags: ["word", "logos", "beginning", "john"],
    books: ["JHN"],
    chapters: [1],
  },
  {
    id: "chrysostom-john-h2",
    voice: "John Chrysostom",
    work: "Homilies on John 2",
    tradition: "patristic",
    locus: "Homily 2",
    url: "https://www.newadvent.org/fathers/240102.htm",
    tags: ["word", "was", "eternity", "john"],
    books: ["JHN"],
    chapters: [1],
  },
  {
    id: "calvin-john-1",
    voice: "John Calvin",
    work: "Commentary on John",
    tradition: "reformed",
    locus: "John 1:1–5",
    url: "https://ccel.org/ccel/calvin/calcom34/calcom34.vii.i.html",
    tags: ["word", "logos", "beginning", "john", "calvin"],
    books: ["JHN"],
    chapters: [1],
  },
  {
    id: "aquinas-catena-john-1",
    voice: "Thomas Aquinas",
    work: "Catena Aurea on John",
    tradition: "catholic",
    locus: "John 1",
    url: "https://www.ccel.org/ccel/aquinas/catena2.ii.i.html",
    tags: ["word", "logos", "john", "aquinas", "thomas"],
    books: ["JHN"],
    chapters: [1],
  },
  {
    id: "athanasius-incarnation",
    voice: "Athanasius",
    work: "On the Incarnation",
    tradition: "patristic",
    locus: "De Incarnatione",
    url: "https://www.newadvent.org/fathers/2802.htm",
    tags: ["word", "flesh", "incarnation", "made", "athanasius"],
    books: ["JHN"],
    chapters: [1],
  },
  {
    id: "wcf-schaff",
    voice: "Westminster Confession",
    work: "Westminster Confession of Faith",
    tradition: "confession",
    locus: "Schaff, Creeds of Christendom III",
    url: "https://ccel.org/ccel/schaff/creeds3.iv.xviii.html",
    tags: ["election", "predestination", "son", "incarnation", "westminster"],
  },
  {
    id: "aquinas-st-predestination",
    voice: "Thomas Aquinas",
    work: "Summa Theologiae I q.23",
    tradition: "catholic",
    locus: "ST I q.23",
    url: "https://www.newadvent.org/summa/1023.htm",
    tags: ["predestination", "election", "providence", "reprobation", "aquinas", "thomas"],
  },
  {
    id: "augustine-predestination",
    voice: "Augustine",
    work: "On the Predestination of the Saints",
    tradition: "patristic",
    locus: "Book 1",
    url: "https://www.newadvent.org/fathers/15121.htm",
    tags: ["predestination", "election", "grace", "saints", "augustine"],
  },
  {
    id: "calvin-inst-predestination",
    voice: "John Calvin",
    work: "Institutes of the Christian Religion",
    tradition: "reformed",
    locus: "Institutes 3.21",
    url: "https://ccel.org/ccel/calvin/institutes/institutes.v.xxii.html",
    tags: ["predestination", "election", "reprobation", "providence", "calvin"],
  },
  {
    id: "dort-first-head",
    voice: "Canons of Dort",
    work: "Canons of Dort, First Head",
    tradition: "confession",
    locus: "First Head of Doctrine",
    url: "https://www.ccel.org/ccel/schaff/creeds3.iv.xvi.html",
    tags: ["election", "predestination", "grace", "dort"],
  },
  {
    id: "augustine-spirit-letter",
    voice: "Augustine",
    work: "On the Spirit and the Letter",
    tradition: "patristic",
    locus: "De spiritu et littera",
    url: "https://www.newadvent.org/fathers/1502.htm",
    tags: ["grace", "law", "letter", "spirit", "sin"],
  },
  {
    id: "augsburg",
    voice: "Augsburg Confession",
    work: "Augsburg Confession",
    tradition: "lutheran",
    locus: "CA",
    url: "https://bookofconcord.org/augsburg-confession/",
    tags: ["grace", "sin", "justification", "luther", "augsburg", "concord"],
  },
];

const STOP = new Set([
  "the", "and", "of", "to", "a", "in", "that", "is", "was", "he", "for", "it",
  "with", "as", "his", "on", "be", "at", "by", "this", "what", "did", "say",
  "about", "every", "source", "quote", "find",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

export function scoreEntry(
  entry: CatalogEntry,
  tokens: string[],
  bookId?: string,
  chapter?: number,
): number {
  let score = 0;
  const tags = new Set(entry.tags);
  const voice = entry.voice.toLowerCase();
  for (const t of tokens) {
    if (tags.has(t)) score += 4;
    if (voice.includes(t)) score += 5;
    if (entry.work.toLowerCase().includes(t)) score += 1;
  }
  if (bookId && entry.books?.includes(bookId)) score += 3;
  if (
    bookId &&
    chapter != null &&
    entry.books?.includes(bookId) &&
    entry.chapters?.includes(chapter)
  ) {
    score += 3;
  }
  return score;
}

export function mapCatalog(opts: {
  question: string;
  bookId?: string;
  chapter?: number;
  verseText?: string;
  mode?: "reception" | "traditions";
  limit?: number;
}): CatalogEntry[] {
  const tokens = tokenize(
    [opts.question, opts.verseText, opts.bookId, String(opts.chapter ?? "")].join(
      " ",
    ),
  );
  const ranked = CATALOG.map((entry) => ({
    entry,
    score: scoreEntry(entry, tokens, opts.bookId, opts.chapter),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked: CatalogEntry[] = [];
  const voices = new Set<string>();
  const needDiverse = opts.mode === "traditions";

  for (const r of ranked) {
    if (picked.length >= (opts.limit ?? 4)) break;
    if (needDiverse && voices.has(r.entry.voice)) continue;
    voices.add(r.entry.voice);
    picked.push(r.entry);
  }

  if (!picked.length && opts.bookId === "JHN" && opts.chapter === 1) {
    return CATALOG.filter((e) => e.books?.includes("JHN")).slice(0, 4);
  }
  return picked;
}
