import { create } from "zustand";
import { BIBLE_BOOKS, getBook, type Locale } from "@/lib/bible/books";
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
  selectedVerse: number | null;
  libraryOpen: boolean;
  libraryTab: LibraryTab;
  typeOpen: boolean;
  receptionOpen: boolean;
  notesRev: number;
  setBook: (bookId: string, chapter?: number) => void;
  setChapter: (chapter: number) => void;
  nextChapter: () => void;
  prevChapter: () => void;
  setVerse: (verse: number | null) => void;
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
      receptionOpen: get().receptionPinned ? get().receptionOpen : false,
    });
    persist(get());
  },
  setChapter: (chapter) => {
    const book = getBook(get().bookId);
    set({
      chapter: Math.min(Math.max(1, chapter), book.chapters),
      selectedVerse: null,
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
  setVerse: (verse) => set({ selectedVerse: verse }),
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
