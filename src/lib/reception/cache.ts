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

export function verseKey(bookId: string, chapter: number, verse: number) {
  return `${bookId}-${chapter}-${verse}`;
}

export function getCached(
  bookId: string,
  chapter: number,
  verse: number | null,
): ReceptionResult | null {
  if (verse == null) return null;
  return read()[verseKey(bookId, chapter, verse)] ?? null;
}

export function saveCached(
  bookId: string,
  chapter: number,
  verse: number,
  result: ReceptionResult,
) {
  if (!result.cards.length) {
    removeCached(bookId, chapter, verse);
    return;
  }
  const store = read();
  store[verseKey(bookId, chapter, verse)] = {
    ...result,
    source: "generated",
  };
  write(store);
}

export function removeCached(
  bookId: string,
  chapter: number,
  verse: number,
): void {
  const store = read();
  const key = verseKey(bookId, chapter, verse);
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

export function cachedVerses(bookId: string, chapter: number): number[] {
  const prefix = `${bookId}-${chapter}-`;
  return Object.keys(read())
    .filter((k) => k.startsWith(prefix))
    .map((k) => Number(k.slice(prefix.length)))
    .filter((n) => Number.isFinite(n));
}

export function cachedBookIds(): string[] {
  const ids = new Set<string>();
  for (const k of Object.keys(read())) {
    const id = k.split("-")[0];
    if (id) ids.add(id);
  }
  return [...ids];
}
