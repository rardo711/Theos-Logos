import type { ReceptionResult } from "@/lib/bible/types";

const KEY = "theos-logos-reception-v1";
const MAX = 80;

type Store = Record<string, ReceptionResult>;

function read(): Store {
  if (typeof window === "undefined") return {};
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
  if (typeof window === "undefined") return;
  const keys = Object.keys(store);
  if (keys.length > MAX) {
    for (const extra of keys.slice(0, keys.length - MAX)) delete store[extra];
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

export function getCached(
  bookId: string,
  chapter: number,
  verse: number | null,
  verseEnd?: number | null,
): ReceptionResult | null {
  if (verse == null) return null;
  return read()[verseKey(bookId, chapter, verse, verseEnd)] ?? null;
}

export function saveCached(
  bookId: string,
  chapter: number,
  verse: number,
  result: ReceptionResult,
  verseEnd?: number | null,
) {
  if (!result.cards.length) {
    removeCached(bookId, chapter, verse, verseEnd);
    return;
  }
  const store = read();
  store[verseKey(bookId, chapter, verse, verseEnd)] = {
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
): void {
  const store = read();
  const key = verseKey(bookId, chapter, verse, verseEnd);
  if (key in store) {
    delete store[key];
    write(store);
  }
}

export function clearChapterCached(bookId: string, chapter: number): void {
  const store = read();
  const prefix = `${bookId}-${chapter}-`;
  let changed = false;
  for (const k of Object.keys(store)) {
    if (k.startsWith(prefix)) {
      delete store[k];
      changed = true;
    }
  }
  if (changed) write(store);
}

export function clearAllCached(): void {
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
    if (!k.startsWith(prefix)) continue;
    const tail = k.slice(prefix.length);
    const [startStr, endStr] = tail.split("-");
    const start = Number(startStr);
    if (!Number.isFinite(start)) continue;
    const end = endStr != null && Number.isFinite(Number(endStr)) ? Number(endStr) : start;
    for (let v = start; v <= Math.max(start, end); v++) out.add(v);
  }
  return [...out];
}

export function cachedBookIds(): string[] {
  const ids = new Set<string>();
  for (const k of Object.keys(read())) {
    const id = k.split("-")[0];
    if (id) ids.add(id);
  }
  return [...ids];
}

/** Chapters in a book that have any cached desk, used for library dots. */
export function cachedChapters(bookId: string): number[] {
  const prefix = `${bookId}-`;
  const out = new Set<number>();
  for (const k of Object.keys(read())) {
    if (!k.startsWith(prefix)) continue;
    const ch = Number(k.slice(prefix.length).split("-")[0]);
    if (Number.isFinite(ch)) out.add(ch);
  }
  return [...out];
}
