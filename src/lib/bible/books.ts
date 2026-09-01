export interface Book {
  id: string;
  name: string;
  chapters: number;
  testament: "ot" | "nt";
}

export const BIBLE_BOOKS: Book[] = [
  { id: "GEN", name: "Genesis", chapters: 50, testament: "ot" },
  { id: "EXO", name: "Exodus", chapters: 40, testament: "ot" },
  { id: "LEV", name: "Leviticus", chapters: 27, testament: "ot" },
  { id: "NUM", name: "Numbers", chapters: 36, testament: "ot" },
  { id: "DEU", name: "Deuteronomy", chapters: 34, testament: "ot" },
  { id: "JOS", name: "Joshua", chapters: 24, testament: "ot" },
  { id: "JDG", name: "Judges", chapters: 21, testament: "ot" },
  { id: "RUT", name: "Ruth", chapters: 4, testament: "ot" },
  { id: "1SA", name: "1 Samuel", chapters: 31, testament: "ot" },
  { id: "2SA", name: "2 Samuel", chapters: 24, testament: "ot" },
  { id: "1KI", name: "1 Kings", chapters: 22, testament: "ot" },
  { id: "2KI", name: "2 Kings", chapters: 25, testament: "ot" },
  { id: "1CH", name: "1 Chronicles", chapters: 29, testament: "ot" },
  { id: "2CH", name: "2 Chronicles", chapters: 36, testament: "ot" },
  { id: "EZR", name: "Ezra", chapters: 10, testament: "ot" },
  { id: "NEH", name: "Nehemiah", chapters: 13, testament: "ot" },
  { id: "EST", name: "Esther", chapters: 10, testament: "ot" },
  { id: "JOB", name: "Job", chapters: 42, testament: "ot" },
  { id: "PSA", name: "Psalms", chapters: 150, testament: "ot" },
  { id: "PRO", name: "Proverbs", chapters: 31, testament: "ot" },
  { id: "ECC", name: "Ecclesiastes", chapters: 12, testament: "ot" },
  { id: "SNG", name: "Song of Solomon", chapters: 8, testament: "ot" },
  { id: "ISA", name: "Isaiah", chapters: 66, testament: "ot" },
  { id: "JER", name: "Jeremiah", chapters: 52, testament: "ot" },
  { id: "LAM", name: "Lamentations", chapters: 5, testament: "ot" },
  { id: "EZE", name: "Ezekiel", chapters: 48, testament: "ot" },
  { id: "DAN", name: "Daniel", chapters: 12, testament: "ot" },
  { id: "HOS", name: "Hosea", chapters: 14, testament: "ot" },
  { id: "JOL", name: "Joel", chapters: 3, testament: "ot" },
  { id: "AMO", name: "Amos", chapters: 9, testament: "ot" },
  { id: "OBA", name: "Obadiah", chapters: 1, testament: "ot" },
  { id: "JON", name: "Jonah", chapters: 4, testament: "ot" },
  { id: "MIC", name: "Micah", chapters: 7, testament: "ot" },
  { id: "NAM", name: "Nahum", chapters: 3, testament: "ot" },
  { id: "HAB", name: "Habakkuk", chapters: 3, testament: "ot" },
  { id: "ZEP", name: "Zephaniah", chapters: 3, testament: "ot" },
  { id: "HAG", name: "Haggai", chapters: 2, testament: "ot" },
  { id: "ZEC", name: "Zechariah", chapters: 14, testament: "ot" },
  { id: "MAL", name: "Malachi", chapters: 4, testament: "ot" },
  { id: "MAT", name: "Matthew", chapters: 28, testament: "nt" },
  { id: "MRK", name: "Mark", chapters: 16, testament: "nt" },
  { id: "LUK", name: "Luke", chapters: 24, testament: "nt" },
  { id: "JHN", name: "John", chapters: 21, testament: "nt" },
  { id: "ACT", name: "Acts", chapters: 28, testament: "nt" },
  { id: "ROM", name: "Romans", chapters: 16, testament: "nt" },
  { id: "1CO", name: "1 Corinthians", chapters: 16, testament: "nt" },
  { id: "2CO", name: "2 Corinthians", chapters: 13, testament: "nt" },
  { id: "GAL", name: "Galatians", chapters: 6, testament: "nt" },
  { id: "EPH", name: "Ephesians", chapters: 6, testament: "nt" },
  { id: "PHP", name: "Philippians", chapters: 4, testament: "nt" },
  { id: "COL", name: "Colossians", chapters: 4, testament: "nt" },
  { id: "1TH", name: "1 Thessalonians", chapters: 5, testament: "nt" },
  { id: "2TH", name: "2 Thessalonians", chapters: 3, testament: "nt" },
  { id: "1TI", name: "1 Timothy", chapters: 6, testament: "nt" },
  { id: "2TI", name: "2 Timothy", chapters: 4, testament: "nt" },
  { id: "TIT", name: "Titus", chapters: 3, testament: "nt" },
  { id: "PHM", name: "Philemon", chapters: 1, testament: "nt" },
  { id: "HEB", name: "Hebrews", chapters: 13, testament: "nt" },
  { id: "JAS", name: "James", chapters: 5, testament: "nt" },
  { id: "1PE", name: "1 Peter", chapters: 5, testament: "nt" },
  { id: "2PE", name: "2 Peter", chapters: 3, testament: "nt" },
  { id: "1JN", name: "1 John", chapters: 5, testament: "nt" },
  { id: "2JN", name: "2 John", chapters: 1, testament: "nt" },
  { id: "3JN", name: "3 John", chapters: 1, testament: "nt" },
  { id: "JUD", name: "Jude", chapters: 1, testament: "nt" },
  { id: "REV", name: "Revelation", chapters: 22, testament: "nt" },
];

export const CORPUS: {
  key: string;
  name: string;
  short: string;
  bookIds: string[];
}[] = [
  { key: "law", name: "The Law", short: "Law", bookIds: ["GEN", "EXO", "LEV", "NUM", "DEU"] },
  { key: "history", name: "History", short: "History", bookIds: ["JOS", "JDG", "RUT", "1SA", "2SA", "1KI", "2KI", "1CH", "2CH", "EZR", "NEH", "EST"] },
  { key: "wisdom", name: "Wisdom", short: "Wisdom", bookIds: ["JOB", "PSA", "PRO", "ECC", "SNG"] },
  { key: "prophets", name: "The Prophets", short: "Prophets", bookIds: ["ISA", "JER", "LAM", "EZE", "DAN", "HOS", "JOL", "AMO", "OBA", "JON", "MIC", "NAM", "HAB", "ZEP", "HAG", "ZEC", "MAL"] },
  { key: "gospels", name: "The Gospels", short: "Gospels", bookIds: ["MAT", "MRK", "LUK", "JHN"] },
  { key: "acts", name: "Acts", short: "Acts", bookIds: ["ACT"] },
  { key: "paul", name: "Paul", short: "Paul", bookIds: ["ROM", "1CO", "2CO", "GAL", "EPH", "PHP", "COL", "1TH", "2TH", "1TI", "2TI", "TIT", "PHM"] },
  { key: "letters", name: "The Letters", short: "Letters", bookIds: ["HEB", "JAS", "1PE", "2PE", "1JN", "2JN", "3JN", "JUD"] },
  { key: "revelation", name: "Revelation", short: "Rev", bookIds: ["REV"] },
];

export const COLLECTIONS = CORPUS;

const ALIAS_TO_ID: Record<string, string> = {
  ge: "GEN", gn: "GEN", gen: "GEN",
  ex: "EXO", exo: "EXO",
  le: "LEV", lev: "LEV",
  nu: "NUM", num: "NUM", nm: "NUM",
  dt: "DEU", deu: "DEU", deut: "DEU",
  jos: "JOS", josh: "JOS",
  jdg: "JDG", judg: "JDG",
  ru: "RUT", rut: "RUT",
  "1sa": "1SA", "1sam": "1SA",
  "2sa": "2SA", "2sam": "2SA",
  "1ki": "1KI", "1kgs": "1KI",
  "2ki": "2KI", "2kgs": "2KI",
  "1ch": "1CH", "1chr": "1CH",
  "2ch": "2CH", "2chr": "2CH",
  ezr: "EZR",
  ne: "NEH", neh: "NEH",
  es: "EST", est: "EST",
  jb: "JOB",
  ps: "PSA", psa: "PSA", psalm: "PSA", psalms: "PSA",
  pr: "PRO", pro: "PRO", prov: "PRO",
  ec: "ECC", ecc: "ECC", qoh: "ECC",
  so: "SNG", sos: "SNG", song: "SNG",
  is: "ISA", isa: "ISA",
  je: "JER", jer: "JER",
  la: "LAM", lam: "LAM",
  eze: "EZE", ezek: "EZE",
  da: "DAN", dan: "DAN",
  ho: "HOS", hos: "HOS",
  joe: "JOL", joel: "JOL",
  am: "AMO", amo: "AMO",
  ob: "OBA", oba: "OBA",
  jon: "JON",
  mi: "MIC", mic: "MIC",
  na: "NAM", nah: "NAM",
  hab: "HAB",
  zep: "ZEP", zeph: "ZEP",
  hag: "HAG",
  zec: "ZEC", zech: "ZEC",
  mal: "MAL",
  mt: "MAT", mat: "MAT", matt: "MAT",
  mk: "MRK", mrk: "MRK", mar: "MRK",
  lk: "LUK", luk: "LUK",
  jn: "JHN", jhn: "JHN", joh: "JHN",
  ac: "ACT", act: "ACT",
  ro: "ROM", rom: "ROM",
  "1co": "1CO", "1cor": "1CO",
  "2co": "2CO", "2cor": "2CO",
  ga: "GAL", gal: "GAL",
  eph: "EPH",
  php: "PHP", phil: "PHP",
  col: "COL",
  "1th": "1TH", "1thess": "1TH",
  "2th": "2TH", "2thess": "2TH",
  "1ti": "1TI", "1tim": "1TI",
  "2ti": "2TI", "2tim": "2TI",
  tit: "TIT",
  phm: "PHM", phile: "PHM",
  heb: "HEB",
  jas: "JAS", jam: "JAS",
  "1pe": "1PE", "1pet": "1PE",
  "2pe": "2PE", "2pet": "2PE",
  "1jn": "1JN", "1jo": "1JN",
  "2jn": "2JN",
  "3jn": "3JN",
  jud: "JUD",
  rev: "REV", apoc: "REV",
  // Spanish
  genesis: "GEN",
  exodo: "EXO",
  levitico: "LEV",
  numeros: "NUM",
  deuteronomio: "DEU",
  josue: "JOS",
  jueces: "JDG",
  reyes: "1KI",
  cronicas: "1CH",
  esdras: "EZR",
  nehemias: "NEH",
  ester: "EST",
  salmo: "PSA",
  salmos: "PSA",
  proverbios: "PRO",
  eclesiastes: "ECC",
  cantares: "SNG",
  isaias: "ISA",
  jeremias: "JER",
  lamentaciones: "LAM",
  ezequiel: "EZE",
  oseas: "HOS",
  amos: "AMO",
  abdias: "OBA",
  jonas: "JON",
  miqueas: "MIC",
  nahum: "NAM",
  habacuc: "HAB",
  sofonias: "ZEP",
  hageo: "HAG",
  zacarias: "ZEC",
  malaquias: "MAL",
  mateo: "MAT",
  marcos: "MRK",
  lucas: "LUK",
  juan: "JHN",
  hechos: "ACT",
  romanos: "ROM",
  corintios: "1CO",
  galatas: "GAL",
  efesios: "EPH",
  filipenses: "PHP",
  colosenses: "COL",
  tesalonicenses: "1TH",
  timoteo: "1TI",
  filemon: "PHM",
  hebreos: "HEB",
  santiago: "JAS",
  pedro: "1PE",
  judas: "JUD",
  apocalipsis: "REV",
};

function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

const BOOK_NAME_ES: Record<string, string> = {
  GEN: "Génesis", EXO: "Éxodo", LEV: "Levítico", NUM: "Números", DEU: "Deuteronomio",
  JOS: "Josué", JDG: "Jueces", RUT: "Rut", "1SA": "1 Samuel", "2SA": "2 Samuel",
  "1KI": "1 Reyes", "2KI": "2 Reyes", "1CH": "1 Crónicas", "2CH": "2 Crónicas",
  EZR: "Esdras", NEH: "Nehemías", EST: "Ester", JOB: "Job", PSA: "Salmos",
  PRO: "Proverbios", ECC: "Eclesiastés", SNG: "Cantares", ISA: "Isaías",
  JER: "Jeremías", LAM: "Lamentaciones", EZE: "Ezequiel", DAN: "Daniel",
  HOS: "Oseas", JOL: "Joel", AMO: "Amós", OBA: "Abdías", JON: "Jonás",
  MIC: "Miqueas", NAM: "Nahúm", HAB: "Habacuc", ZEP: "Sofonías", HAG: "Hageo",
  ZEC: "Zacarías", MAL: "Malaquías", MAT: "Mateo", MRK: "Marcos", LUK: "Lucas",
  JHN: "Juan", ACT: "Hechos", ROM: "Romanos", "1CO": "1 Corintios",
  "2CO": "2 Corintios", GAL: "Gálatas", EPH: "Efesios", PHP: "Filipenses",
  COL: "Colosenses", "1TH": "1 Tesalonicenses", "2TH": "2 Tesalonicenses",
  "1TI": "1 Timoteo", "2TI": "2 Timoteo", TIT: "Tito", PHM: "Filemón",
  HEB: "Hebreos", JAS: "Santiago", "1PE": "1 Pedro", "2PE": "2 Pedro",
  "1JN": "1 Juan", "2JN": "2 Juan", "3JN": "3 Juan", JUD: "Judas",
  REV: "Apocalipsis",
};

export type Locale = "en" | "es";

export function bookName(book: Book, locale: Locale = "en"): string {
  if (locale === "es") return BOOK_NAME_ES[book.id] ?? book.name;
  return book.name;
}

/** Protestant canonical number used by bolls.life (Genesis = 1). */
export function bollsBookId(bookId: string): number {
  const i = bookIndex(bookId);
  return i >= 0 ? i + 1 : 1;
}

export function getBook(id: string): Book {
  return BIBLE_BOOKS.find((b) => b.id === id) ?? BIBLE_BOOKS[0];
}

export function bookIndex(id: string): number {
  return BIBLE_BOOKS.findIndex((b) => b.id === id);
}

export function corpusOf(bookId: string) {
  return CORPUS.find((c) => c.bookIds.includes(bookId)) ?? null;
}

export function bookMatches(book: Book, query: string): boolean {
  const q = norm(query);
  if (!q) return true;
  if (norm(book.name).includes(q)) return true;
  const es = BOOK_NAME_ES[book.id];
  if (es && norm(es).includes(q)) return true;
  if (book.id.toLowerCase() === q) return true;
  if (ALIAS_TO_ID[q] === book.id) return true;
  return false;
}

export function findBook(query: string): Book | undefined {
  const q = query.trim();
  if (!q) return undefined;
  const exact = BIBLE_BOOKS.find((b) => norm(b.name) === norm(q));
  if (exact) return exact;
  const exactEs = BIBLE_BOOKS.find((b) => norm(BOOK_NAME_ES[b.id] ?? "") === norm(q));
  if (exactEs) return exactEs;
  const aliased = ALIAS_TO_ID[norm(q)];
  if (aliased) return getBook(aliased);
  const hits = BIBLE_BOOKS.filter((b) => bookMatches(b, q));
  return hits.length === 1 ? hits[0] : undefined;
}

export function parseReference(
  raw: string,
): { book: Book; chapter?: number; verse?: number } | null {
  const q = raw.trim();
  if (!q) return null;
  const withVerse = q.match(/^(.*?)\s+(\d+)\s*[:.]\s*(\d+)$/);
  if (withVerse) {
    const book = findBook(withVerse[1]);
    if (book) {
      const chapter = Math.min(
        Math.max(1, Number(withVerse[2])),
        book.chapters,
      );
      return { book, chapter, verse: Math.max(1, Number(withVerse[3])) };
    }
  }
  const withChapter = q.match(/^(.*?)\s+(\d+)$/);
  if (withChapter) {
    const book = findBook(withChapter[1]);
    if (book) {
      const chapter = Math.min(
        Math.max(1, Number(withChapter[2])),
        book.chapters,
      );
      return { book, chapter };
    }
  }
  const book = findBook(q);
  return book ? { book } : null;
}
