import { create } from "zustand";
import { BIBLE_BOOKS, getBook, type Locale } from "@/lib/bible/books";
import { applyVersePick, applyVerseTap, type VerseRange } from "@/lib/bible/range";
import { applyDocumentLocale } from "@/lib/i18n";

const KEY = "theos-logos-hybrid";

type Theme = "light" | "dark" | "auto";
type LibraryTab = "chapters" | "books";

interface Persisted {
  bookId: string;
  chapter: number;
  theme: Theme;
  fontSize: number;
  disclaimerSeen: boolean;
  receptionPinned: boolean;
  locale: Locale;
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Persisted>;
      const bookId = typeof p.bookId === "string" ? p.bookId : "JHN";
      const book = getBook(bookId);
      const chapter = Math.min(Math.max(1, Number(p.chapter) || 1), book.chapters);
      return {
        bookId: book.id,
        chapter,
        theme:
          p.theme === "dark" || p.theme === "light" || p.theme === "auto"
            ? p.theme
            : "auto",
        fontSize: Math.min(28, Math.max(16, Number(p.fontSize) || 20)),
        disclaimerSeen: Boolean(p.disclaimerSeen),
        receptionPinned: Boolean(p.receptionPinned),
        locale: p.locale === "es" ? "es" : "en",
      };
    }
  } catch {
    /* ignore */
  }
  return {
    bookId: "JHN",
    chapter: 1,
    theme: "auto",
    fontSize: 20,
    disclaimerSeen: false,
    receptionPinned: false,
    locale: "en",
  };
}

function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "auto" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#1c1814" : "#f6f1e8");
}

let themeBound = false;
function bindThemeListener() {
  if (themeBound) return;
  themeBound = true;
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (useStudy.getState().theme === "auto") applyTheme("auto");
    });
}

interface StudyState extends Persisted {
  /**
   * The first verse of the selection. Every reader of this field predates
   * ranges and still gets what it expects: with no range it is the selected
   * verse, and with one it is where the range begins.
   */
  selectedVerse: number | null;
  /** null when a single verse is selected. Never less than selectedVerse. */
  selectedEndVerse: number | null;
  selectMode: boolean;
  libraryOpen: boolean;
  libraryTab: LibraryTab;
  typeOpen: boolean;
  receptionOpen: boolean;
  notesRev: number;
  setBook: (bookId: string, chapter?: number) => void;
  setChapter: (chapter: number) => void;
  jumpTo: (bookId: string, chapter: number, verse?: number) => void;
  nextChapter: () => void;
  prevChapter: () => void;
  setVerse: (verse: number | null) => void;
  setSelectMode: (on: boolean) => void;
  /** Applies the select-mode tap rules. Returns "too-long" when the tap was refused. */
  tapVerse: (verse: number, opts?: { ifTooLong?: "refuse" | "jump" }) =>
    "too-long" | null;
  /** Grow the selected passage. Never clears -- that is clearSelection. */
  pickVerse: (verse: number) => void;
  clearSelection: () => void;
  setTheme: (theme: Theme) => void;
  setFontSize: (n: number) => void;
  setLocale: (locale: Locale) => void;
  setLibraryOpen: (open: boolean, tab?: LibraryTab) => void;
  setTypeOpen: (open: boolean) => void;
  setReceptionOpen: (open: boolean) => void;
  setReceptionPinned: (pinned: boolean) => void;
  touchNotes: () => void;
  dismissDisclaimer: () => void;
  hydrate: () => void;
}

function persist(s: StudyState) {
  const data: Persisted = {
    bookId: s.bookId,
    chapter: s.chapter,
    theme: s.theme,
    fontSize: s.fontSize,
    disclaimerSeen: s.disclaimerSeen,
    receptionPinned: s.receptionPinned,
    locale: s.locale,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* private mode */
  }
}

export const useStudy = create<StudyState>((set, get) => ({
  bookId: "JHN",
  chapter: 1,
  theme: "auto",
  fontSize: 20,
  disclaimerSeen: false,
  locale: "en",
  selectedVerse: null,
  selectedEndVerse: null,
  selectMode: false,
  libraryOpen: false,
  libraryTab: "chapters",
  typeOpen: false,
  receptionOpen: false,
  receptionPinned: false,
  notesRev: 0,
  hydrate: () => {
    const p = load();
    set(p);
    applyTheme(p.theme);
    applyDocumentLocale(p.locale);
    bindThemeListener();
  },
  setBook: (bookId, chapter = 1) => {
    const book = getBook(bookId);
    set({
      bookId: book.id,
      chapter: Math.min(Math.max(1, chapter), book.chapters),
      selectedVerse: null,
      selectedEndVerse: null,
      receptionOpen: get().receptionPinned ? get().receptionOpen : false,
    });
    persist(get());
  },
  setChapter: (chapter) => {
    const book = getBook(get().bookId);
    set({
      chapter: Math.min(Math.max(1, chapter), book.chapters),
      selectedVerse: null,
      selectedEndVerse: null,
      receptionOpen: get().receptionPinned ? get().receptionOpen : false,
    });
    persist(get());
  },
  jumpTo: (bookId, chapter, verse) => {
    const book = getBook(bookId);
    set({
      bookId: book.id,
      chapter: Math.min(Math.max(1, chapter), book.chapters),
      selectedVerse: verse ?? null,
      selectedEndVerse: null,
      receptionOpen: get().receptionPinned ? get().receptionOpen : false,
    });
    persist(get());
  },
  nextChapter: () => {
    const { bookId, chapter } = get();
    const book = getBook(bookId);
    if (chapter < book.chapters) {
      get().setChapter(chapter + 1);
      return;
    }
    const i = BIBLE_BOOKS.findIndex((b) => b.id === bookId);
    if (i >= 0 && i < BIBLE_BOOKS.length - 1)
      get().setBook(BIBLE_BOOKS[i + 1].id, 1);
  },
  prevChapter: () => {
    const { bookId, chapter } = get();
    if (chapter > 1) {
      get().setChapter(chapter - 1);
      return;
    }
    const i = BIBLE_BOOKS.findIndex((b) => b.id === bookId);
    if (i > 0) {
      const prev = BIBLE_BOOKS[i - 1];
      get().setBook(prev.id, prev.chapters);
    }
  },
  setVerse: (verse) => set({ selectedVerse: verse, selectedEndVerse: null }),
  setSelectMode: (selectMode) => set({ selectMode }),
  tapVerse: (verse, opts) => {
    const { selectedVerse, selectedEndVerse } = get();
    const current =
      selectedVerse == null
        ? null
        : { start: selectedVerse, end: selectedEndVerse ?? selectedVerse };
    const outcome = applyVerseTap(current, verse, opts);
    if (outcome.refused) return outcome.refused;
    set({
      selectedVerse: outcome.range?.start ?? null,
      // A single verse keeps end null so every existing single-verse code
      // path, cache key included, behaves exactly as it did before ranges.
      selectedEndVerse:
        outcome.range && outcome.range.end !== outcome.range.start
          ? outcome.range.end
          : null,
    });
    return null;
  },
  pickVerse: (verse) => {
    const { selectedVerse, selectedEndVerse } = get();
    const current =
      selectedVerse == null
        ? null
        : { start: selectedVerse, end: selectedEndVerse ?? selectedVerse };
    const next = applyVersePick(current, verse);
    set({
      selectedVerse: next.start,
      selectedEndVerse: next.end !== next.start ? next.end : null,
    });
  },
  clearSelection: () => {
    const pinned = get().receptionPinned;
    set({
      selectedVerse: null,
      selectedEndVerse: null,
      selectMode: false,
      receptionOpen: pinned ? get().receptionOpen : false,
    });
  },
  setTheme: (theme) => {
    set({ theme });
    applyTheme(theme);
    persist(get());
  },
  setFontSize: (n) => {
    set({ fontSize: Math.min(28, Math.max(16, n)) });
    persist(get());
  },
  setLocale: (locale) => {
    set({ locale });
    applyDocumentLocale(locale);
    persist(get());
  },
  setLibraryOpen: (libraryOpen, tab) =>
    set({
      libraryOpen,
      typeOpen: libraryOpen ? false : get().typeOpen,
      libraryTab: tab ?? get().libraryTab,
    }),
  setTypeOpen: (typeOpen) =>
    set({
      typeOpen,
      libraryOpen: typeOpen ? false : get().libraryOpen,
    }),
  setReceptionOpen: (receptionOpen) => set({ receptionOpen }),
  setReceptionPinned: (receptionPinned) => {
    set({
      receptionPinned,
      receptionOpen: receptionPinned ? true : get().receptionOpen,
    });
    persist(get());
  },
  touchNotes: () => set({ notesRev: get().notesRev + 1 }),
  dismissDisclaimer: () => {
    set({ disclaimerSeen: true });
    persist(get());
  },
}));

/** The selection as a normalized range, or null when nothing is selected. */
export function selectedRange(s: {
  selectedVerse: number | null;
  selectedEndVerse: number | null;
}): VerseRange | null {
  if (s.selectedVerse == null) return null;
  return {
    start: s.selectedVerse,
    end: s.selectedEndVerse ?? s.selectedVerse,
  };
}
