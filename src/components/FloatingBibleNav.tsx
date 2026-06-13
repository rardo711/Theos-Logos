import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BIBLE_BOOKS, Book } from "../types";
import { useI18n, getBookDisplayName, ES_BOOK_NAMES } from "../i18n";
import { ChevronDown, X, Search } from "lucide-react";

interface FloatingBibleNavProps {
  currentBook: Book;
  currentChapter: number;
  onBookChange: (book: Book) => void;
  onChapterChange: (chapter: number) => void;
  isVisible: boolean;
  onClose: () => void;
}

const OT = BIBLE_BOOKS.slice(0, 39);
const NT = BIBLE_BOOKS.slice(39);

export const FloatingBibleNav: React.FC<FloatingBibleNavProps> = ({
  currentBook,
  currentChapter,
  onBookChange,
  onChapterChange,
  isVisible,
  onClose,
}) => {
  const { lang, s } = useI18n();
  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const chapterContainerRef = useRef<HTMLDivElement>(null);

  const q = searchQuery.trim().toLowerCase();
  const matches = useCallback(
    (book: Book) =>
      !q ||
      book.name.toLowerCase().includes(q) ||
      (ES_BOOK_NAMES[book.id] ?? "").toLowerCase().includes(q),
    [q],
  );
  const oldTestament = OT.filter(matches);
  const newTestament = NT.filter(matches);
  const firstMatch = oldTestament[0] ?? newTestament[0];

  // Center the active chapter when the sheet opens or the book changes.
  // Runs after paint (rAF) so it isn't fighting the entrance animation.
  useEffect(() => {
    if (!isVisible || isBookDropdownOpen) return;
    const id = requestAnimationFrame(() => {
      const el = chapterContainerRef.current?.querySelector(
        '[data-active="true"]',
      ) as HTMLElement | null;
      el?.scrollIntoView({ block: "center", behavior: "auto" });
    });
    return () => cancelAnimationFrame(id);
  }, [isVisible, isBookDropdownOpen, currentBook.id]);

  // Reset transient state whenever the sheet hides.
  useEffect(() => {
    if (!isVisible) {
      setIsBookDropdownOpen(false);
      setSearchQuery("");
    }
  }, [isVisible]);

  // Escape closes the dropdown first, then the whole sheet.
  useEffect(() => {
    if (!isVisible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isBookDropdownOpen) setIsBookDropdownOpen(false);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVisible, isBookDropdownOpen, onClose]);

  const selectBook = (book: Book) => {
    onBookChange(book);
    setIsBookDropdownOpen(false);
    setSearchQuery("");
  };

  // Plain render helper (not a nested component) so book buttons aren't
  // remounted on every keystroke in the search box.
  const renderBook = (book: Book) => {
    const active = currentBook.id === book.id;
    return (
      <button
        key={book.id}
        onClick={() => selectBook(book)}
        aria-current={active ? "true" : undefined}
        className={`text-left px-3.5 py-3 rounded-xl text-sm transition-all duration-200 truncate ${
          active
            ? "bg-[#821111] dark:bg-red-900 border border-[#821111] dark:border-red-800 text-white font-bold shadow-md"
            : "text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border border-transparent hover:border-stone-200 dark:hover:border-stone-700 shadow-sm hover:shadow-md active:scale-[0.97]"
        }`}
      >
        {getBookDisplayName(book, lang)}
      </button>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[8vh] md:pt-[12vh] px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${getBookDisplayName(currentBook, lang)} ${currentChapter}`}
        >
          {/* Backdrop (clicks close) */}
          <div
            className="absolute inset-0 bg-stone-900/30 dark:bg-black/50 transition-colors"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: -40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -24, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl rounded-2xl overflow-hidden"
          >
            {/* Header — book toggle + chapter pill + close */}
            <div className="shrink-0 flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50">
              <button
                className="flex items-center gap-2 group min-w-0"
                onClick={() => setIsBookDropdownOpen((v) => !v)}
                aria-expanded={isBookDropdownOpen}
              >
                <span className="font-serif font-bold text-xl text-stone-800 dark:text-stone-100 group-hover:text-[#821111] dark:group-hover:text-red-400 transition-colors truncate">
                  {getBookDisplayName(currentBook, lang)}
                </span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 transition-transform duration-300 ${isBookDropdownOpen ? "rotate-180 text-[#821111] dark:text-red-400" : "text-stone-400"}`}
                />
              </button>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span className="text-[10px] font-bold text-[#821111] dark:text-red-400 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-full uppercase tracking-widest border border-stone-200 dark:border-stone-700">
                  {s.chapterAbbrev} {currentChapter}
                </span>
                <button
                  onClick={onClose}
                  aria-label={lang === "es" ? "Cerrar" : "Close"}
                  className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 transition-colors active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Book picker (collapsible) */}
            <AnimatePresence initial={false}>
              {isBookDropdownOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                  className="shrink-0 overflow-hidden border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                >
                  <div className="max-h-[48vh] overflow-y-auto tl-scrollbar p-5">
                    {/* Search */}
                    <div className="relative mb-5">
                      <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                      />
                      <input
                        type="text"
                        placeholder={s.searchBooks}
                        autoFocus
                        enterKeyHint="go"
                        className="w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl pl-11 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#821111]/30 dark:focus:ring-red-400/30 text-stone-800 dark:text-stone-100 placeholder:font-serif placeholder:italic shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && firstMatch) {
                            e.preventDefault();
                            selectBook(firstMatch);
                          }
                        }}
                      />
                    </div>

                    {oldTestament.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#821111] dark:text-red-400 mb-3 px-1">
                          {s.oldTestament}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {oldTestament.map(renderBook)}
                        </div>
                      </div>
                    )}

                    {newTestament.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#821111] dark:text-red-400 mb-3 px-1">
                          {s.newTestament}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {newTestament.map(renderBook)}
                        </div>
                      </div>
                    )}

                    {oldTestament.length === 0 && newTestament.length === 0 && (
                      <div className="py-10 text-center">
                        <p className="text-stone-400 dark:text-stone-500 italic font-serif">
                          {s.noBooksFound} "{searchQuery}"
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chapter grid — responsive, wraps, scrolls vertically */}
            <div
              ref={chapterContainerRef}
              className="flex-1 min-h-0 overflow-y-auto tl-scrollbar p-4 bg-white dark:bg-stone-900"
            >
              <div
                className="grid gap-2.5"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(3rem, 1fr))" }}
              >
                {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map(
                  (ch) => {
                    const active = currentChapter === ch;
                    return (
                      <button
                        key={ch}
                        data-active={active}
                        aria-label={`${s.chapter} ${ch}`}
                        aria-current={active ? "true" : undefined}
                        onClick={() => {
                          onChapterChange(ch);
                          onClose();
                        }}
                        className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 border ${
                          active
                            ? "bg-[#821111] dark:bg-red-900 border-[#821111] dark:border-red-800 text-white shadow-lg ring-2 ring-[#821111]/20 dark:ring-red-900/40"
                            : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 hover:border-stone-300 dark:hover:border-stone-600 active:scale-95"
                        }`}
                      >
                        {ch}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
