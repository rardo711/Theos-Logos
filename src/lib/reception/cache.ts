import type { Locale } from "@/lib/bible/books";
import type { ReceptionResult } from "@/lib/bible/types";

/** v2: desk bodies keyed by verse + locale so ES NMT never sticks after EN switch. */
const KEY = "theos-logos-reception-v2";
const MAX = 80;

type Store = Record<string, ReceptionResult>;

/** SSR / node:test memory mirror of localStorage when window is absent. */
let memoryStore: Store = {};

function normLocale(locale?: Locale | null): "en" | "es" {
  return locale === "es" ? "es" : "en";
}

function read(): Store {
  if (typeof window === "undefined") return memoryStore;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Store;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function write(store: Store) {
  const keys = Object.keys(store);
  if (keys.length > MAX) {
    for (const extra of keys.slice(0, keys.length - MAX)) delete store[extra];
  }
  if (typeof window === "undefined") {
    memoryStore = { ...store };
    return;
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* quota */
  }
}

/**
 * A single verse keeps the key shape it has always had, so every desk cached
 * before ranges existed still resolves. A range appends its end verse.
 */
export function verseKey(
  bookId: string,
  chapter: number,
  verse: number,
  verseEnd?: number | null,
) {
  return verseEnd != null && verseEnd > verse
    ? `${bookId}-${chapter}-${verse}-${verseEnd}`
    : `${bookId}-${chapter}-${verse}`;
}

/** Storage key: verse identity + locale (display must follow current locale). */
export function storageKey(
  bookId: string,
  chapter: number,
  verse: number,
  verseEnd?: number | null,
  locale?: Locale | null,
) {
  return `${verseKey(bookId, chapter, verse, verseEnd)}|${normLocale(locale)}`;
}

/** Strip optional `|en` / `|es` suffix from a store key. */
export function versePartOfStoreKey(storeKey: string): string {
  const m = storeKey.match(/^(.*)\|(en|es)$/);
  return m ? m[1] : storeKey;
}

export function getCached(
  bookId: string,
  chapter: number,
  verse: number | null,
  verseEnd?: number | null,
  locale?: Locale | null,
): ReceptionResult | null {
  if (verse == null) return null;
  return (
    read()[storageKey(bookId, chapter, verse, verseEnd, locale)] ?? null
  );
}

export function saveCached(
  bookId: string,
  chapter: number,
  verse: number,
  result: ReceptionResult,
  verseEnd?: number | null,
  locale?: Locale | null,
) {
  if (!result.cards.length) {
    removeCached(bookId, chapter, verse, verseEnd, locale);
    return;
  }
  const store = read();
  store[storageKey(bookId, chapter, verse, verseEnd, locale)] = {
    ...result,
    source: "generated",
  };
  write(store);
}

export function removeCached(
  bookId: string,
  chapter: number,
  verse: number,
  verseEnd?: number | null,
  locale?: Locale | null,
): void {
  const store = read();
  const key = storageKey(bookId, chapter, verse, verseEnd, locale);
  if (key in store) {
    delete store[key];
    write(store);
  }
}

/** Drop every locale variant for this verse/range. */
export function removeCachedAllLocales(
  bookId: string,
  chapter: number,
  verse: number,
  verseEnd?: number | null,
): void {
  removeCached(bookId, chapter, verse, verseEnd, "en");
  removeCached(bookId, chapter, verse, verseEnd, "es");
}

export function clearChapterCached(bookId: string, chapter: number): void {
  const store = read();
  const prefix = `${bookId}-${chapter}-`;
  let changed = false;
  for (const k of Object.keys(store)) {
    const versePart = versePartOfStoreKey(k);
    if (versePart.startsWith(prefix)) {
      delete store[k];
      changed = true;
    }
  }
  if (changed) write(store);
}

export function clearAllCached(): void {
  memoryStore = {};
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Every verse that has a saved desk, ranges expanded. A range cached as
 * "ROM-9-14-16" marks 14, 15 and 16, so a reader scrolling past sees the whole
 * studied block flagged rather than nothing at all.
 */
export function cachedVerses(bookId: string, chapter: number): number[] {
  const prefix = `${bookId}-${chapter}-`;
  const out = new Set<number>();
  for (const k of Object.keys(read())) {
    const versePart = versePartOfStoreKey(k);
    if (!versePart.startsWith(prefix)) continue;
    const tail = versePart.slice(prefix.length);
    const [startStr, endStr] = tail.split("-");
    const start = Number(startStr);
    if (!Number.isFinite(start)) continue;
    const end =
      endStr != null && Number.isFinite(Number(endStr)) ? Number(endStr) : start;
    for (let v = start; v <= Math.max(start, end); v++) out.add(v);
  }
  return [...out];
}

export function cachedBookIds(): string[] {
  const ids = new Set<string>();
  for (const k of Object.keys(read())) {
    const id = versePartOfStoreKey(k).split("-")[0];
    if (id) ids.add(id);
  }
  return [...ids];
}

/** Chapters in a book that have any cached desk, used for library dots. */
export function cachedChapters(bookId: string): number[] {
  const prefix = `${bookId}-`;
  const out = new Set<number>();
  for (const k of Object.keys(read())) {
    const versePart = versePartOfStoreKey(k);
    if (!versePart.startsWith(prefix)) continue;
    const ch = Number(versePart.slice(prefix.length).split("-")[0]);
    if (Number.isFinite(ch)) out.add(ch);
  }
  return [...out];
}
