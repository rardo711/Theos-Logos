import { BIBLE_BOOKS, bookName, getBook, type Locale } from "@/lib/bible/books";
import type { SourceCard, Tradition } from "@/lib/bible/types";
import { formatReference } from "@/lib/bible/reference";
import { getCached, cachedBookIds, cachedChapters, cachedVerses } from "./cache";
import { curatedBookIds, markedChapters, markedVerses, getCuratedCardsForVerse } from "./curated";

export interface DeviceSourceGroup {
  passageKey: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  verseEnd?: number | null;
  displayReference: string;
  cards: SourceCard[];
}

export interface DeviceSourcesSummary {
  groups: DeviceSourceGroup[];
  totalCards: number;
  totalPassages: number;
  voices: string[];
  traditions: {
    patristic: number;
    reformed: number;
    confession: number;
    other: number;
  };
}

const STORAGE_KEY = "theos-logos-reception-v2";

interface StoredDesk {
  cards?: SourceCard[];
  source?: "curated" | "generated";
  caution?: string;
}

function parseStoreKey(k: string): {
  bookId: string;
  chapter: number;
  verse: number;
  verseEnd?: number | null;
  locale: "en" | "es";
} | null {
  const [versePart, loc] = k.split("|");
  const parts = (versePart ?? "").split("-");
  if (parts.length < 3) return null;
  const bookId = parts[0];
  const chapter = Number(parts[1]);
  const verse = Number(parts[2]);
  const verseEnd = parts[3] ? Number(parts[3]) : null;
  if (!bookId || !Number.isFinite(chapter) || !Number.isFinite(verse)) return null;
  return {
    bookId,
    chapter,
    verse,
    verseEnd: Number.isFinite(verseEnd) ? verseEnd : null,
    locale: loc === "es" ? "es" : "en",
  };
}

/**
 * Aggregates all commentaries stored on this device:
 * 1. User-inquired / saved commentary cards from localStorage.
 * 2. Pre-bundled curated commentaries across the canon.
 */
export function getAllDeviceSources(locale: Locale = "en"): DeviceSourcesSummary {
  const groupMap = new Map<string, DeviceSourceGroup>();

  // 1. Read localStorage (saved on this device)
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const store = JSON.parse(raw) as Record<string, StoredDesk>;
        for (const [k, desk] of Object.entries(store)) {
          if (!desk || !Array.isArray(desk.cards) || desk.cards.length === 0) continue;
          const parsed = parseStoreKey(k);
          if (!parsed) continue;
          // Match current locale or fallback to English if none for locale
          if (parsed.locale !== locale && parsed.locale !== "en") continue;

          const baseKey = `${parsed.bookId}-${parsed.chapter}-${parsed.verse}${parsed.verseEnd ? `-${parsed.verseEnd}` : ""}`;
          const existing = groupMap.get(baseKey);

          // If we already have a record for this key from the exact current locale, don't overwrite with 'en'
          if (existing && parsed.locale !== locale) continue;

          const book = getBook(parsed.bookId);
          const bName = bookName(book, locale);
          const displayRef = formatReference(
            bName,
            parsed.chapter,
            parsed.verse,
            parsed.verseEnd,
          );

          groupMap.set(baseKey, {
            passageKey: baseKey,
            bookId: parsed.bookId,
            bookName: bName,
            chapter: parsed.chapter,
            verse: parsed.verse,
            verseEnd: parsed.verseEnd,
            displayReference: displayRef,
            cards: desk.cards.map((c) => ({
              ...c,
              source: c.source ?? "generated",
            })),
          });
        }
      }
    } catch {
      /* ignore storage read errors */
    }
  }

  // 2. Read Curated Sources (built-in offline desk notes)
  const curatedIds = curatedBookIds();
  for (const bId of curatedIds) {
    const book = getBook(bId);
    const bName = bookName(book, locale);
    const chs = markedChapters(bId);
    for (const ch of chs) {
      const vs = markedVerses(bId, ch);
      for (const v of vs) {
        const baseKey = `${bId}-${ch}-${v}`;
        const existing = groupMap.get(baseKey);

        const curatedCards = getCuratedCardsForVerse(bId, ch, v);
        if (!curatedCards.length) continue;

        if (existing) {
          // Merge cards without duplicates
          const seenCites = new Set(existing.cards.map((c) => `${c.voice}\0${c.citation}`));
          const added = curatedCards.filter((c) => !seenCites.has(`${c.voice}\0${c.citation}`));
          existing.cards.push(...added);
        } else {
          const displayRef = formatReference(bName, ch, v);
          groupMap.set(baseKey, {
            passageKey: baseKey,
            bookId: bId,
            bookName: bName,
            chapter: ch,
            verse: v,
            displayReference: displayRef,
            cards: curatedCards,
          });
        }
      }
    }
  }

  // 3. Sort groups canonically
  const bookIndexMap = new Map<string, number>();
  BIBLE_BOOKS.forEach((b, i) => bookIndexMap.set(b.id, i));

  const sortedGroups = Array.from(groupMap.values()).sort((a, b) => {
    const bA = bookIndexMap.get(a.bookId) ?? 999;
    const bB = bookIndexMap.get(b.bookId) ?? 999;
    if (bA !== bB) return bA - bB;
    if (a.chapter !== bB) return a.chapter - b.chapter;
    return a.verse - b.verse;
  });

  // 4. Compute analytics / totals
  let totalCards = 0;
  const voiceSet = new Set<string>();
  const traditions = {
    patristic: 0,
    reformed: 0,
    confession: 0,
    other: 0,
  };

  for (const g of sortedGroups) {
    totalCards += g.cards.length;
    for (const c of g.cards) {
      if (c.voice) voiceSet.add(c.voice);
      const trad = (c.tradition ?? "other").toLowerCase();
      if (trad === "patristic") traditions.patristic++;
      else if (trad === "reformed") traditions.reformed++;
      else if (trad === "confession") traditions.confession++;
      else traditions.other++;
    }
  }

  return {
    groups: sortedGroups,
    totalCards,
    totalPassages: sortedGroups.length,
    voices: Array.from(voiceSet).sort((a, b) => a.localeCompare(b)),
    traditions,
  };
}
