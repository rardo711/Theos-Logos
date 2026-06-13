import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BIBLE_BOOKS, Book } from "../types";
import { useI18n, getBookDisplayName, Lang } from "../i18n";
import {
  ArrowRight,
  ScrollText,
  Library,
  History as HistoryIcon,
  BookMarked,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { HistoryItem } from "../App";

interface HomeScreenProps {
  currentBook: Book;
  currentChapter: number;
  history: HistoryItem[];
  onResume: () => void;
  onOpenSearch: () => void;
  onSelectBook: (book: Book) => void;
  onSelectHistory: (item: HistoryItem) => void;
}

/** Rotating Scripture passage for "The Daily Logos" — keyed to the day so it is
 *  stable for a given date. */
const DAILY_VERSES: { en: string; es: string; refEn: string; refEs: string }[] = [
  {
    en: "In the beginning was the Word, and the Word was with God, and the Word was God.",
    es: "En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.",
    refEn: "John 1:1",
    refEs: "Juan 1:1",
  },
  {
    en: "Your word is a lamp to my feet and a light to my path.",
    es: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.",
    refEn: "Psalm 119:105",
    refEs: "Salmos 119:105",
  },
  {
    en: "The grass withers, the flower fades, but the word of our God will stand forever.",
    es: "Sécase la hierba, marchítase la flor; mas la palabra del Dios nuestro permanece para siempre.",
    refEn: "Isaiah 40:8",
    refEs: "Isaías 40:8",
  },
  {
    en: "Man shall not live by bread alone, but by every word that comes from the mouth of God.",
    es: "No sólo de pan vivirá el hombre, sino de toda palabra que sale de la boca de Dios.",
    refEn: "Matthew 4:4",
    refEs: "Mateo 4:4",
  },
  {
    en: "All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness.",
    es: "Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia.",
    refEn: "2 Timothy 3:16",
    refEs: "2 Timoteo 3:16",
  },
];

/** Curated reading collections. Selecting a card opens a detail panel listing
 *  the books it contains. Gradients evoke the archival, museum-quality mood of
 *  the scriptorium. */
const COLLECTIONS: { key: string; gradient: string; bookIds: string[] }[] = [
  {
    key: "pentateuch",
    gradient: "linear-gradient(150deg,#3a2a22 0%,#1c1917 100%)",
    bookIds: ["GEN", "EXO", "LEV", "NUM", "DEU"],
  },
  {
    key: "gospels",
    gradient: "linear-gradient(150deg,#7a1414 0%,#3a0a0a 100%)",
    bookIds: ["MAT", "MRK", "LUK", "JHN"],
  },
  {
    key: "psalms",
    gradient: "linear-gradient(150deg,#2c3340 0%,#16181d 100%)",
    bookIds: ["JOB", "PSA", "PRO", "ECC", "SNG"],
  },
  {
    key: "pauline",
    gradient: "linear-gradient(150deg,#2d3a2d 0%,#161d16 100%)",
    bookIds: ["ROM", "1CO", "2CO", "GAL", "EPH", "PHP", "COL", "1TH", "2TH", "1TI", "2TI", "TIT", "PHM"],
  },
  {
    key: "prophets",
    gradient: "linear-gradient(150deg,#5a4012 0%,#2a1d08 100%)",
    bookIds: ["ISA", "JER", "LAM", "EZE", "DAN", "HOS", "JOL", "AMO", "OBA", "JON", "MIC", "NAM", "HAB", "ZEP", "HAG", "ZEC", "MAL"],
  },
];

function booksFor(bookIds: string[]): Book[] {
  return bookIds
    .map((id) => BIBLE_BOOKS.find((b) => b.id === id))
    .filter((b): b is Book => Boolean(b));
}

function relativeTime(ts: number, lang: Lang): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return lang === "es" ? "Ahora" : "Just now";
  if (mins < 60) return lang === "es" ? `Hace ${mins} min` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return lang === "es" ? `Hace ${hrs} h` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return lang === "es" ? "Ayer" : "Yesterday";
  return lang === "es" ? `Hace ${days} días` : `${days}d ago`;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentBook,
  currentChapter,
  history,
  onResume,
  onOpenSearch,
  onSelectBook,
  onSelectHistory,
}) => {
  const { lang, s } = useI18n();
  const [openCollection, setOpenCollection] = useState<string | null>(null);

  const verse = DAILY_VERSES[Math.floor(Date.now() / 86400000) % DAILY_VERSES.length];
  const progress = Math.min(
    100,
    Math.round((currentChapter / Math.max(1, currentBook.chapters)) * 100),
  );

  const detailBooks = openCollection
    ? booksFor(COLLECTIONS.find((c) => c.key === openCollection)!.bookIds)
    : [];

  return (
    <div className="relative w-full h-full overflow-hidden bg-white dark:bg-stone-950 transition-colors">
      <div className="absolute inset-0 overflow-y-auto tl-scrollbar">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-5 pb-32">
        {/* ── Hero: Continue Reading ───────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-stone-200/40 dark:border-white/10">
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(150deg,#3a1010 0%,#1c1009 60%,#0c0a09 100%)" }}
            />
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "linear-gradient(90deg,#821111 0%,rgba(130,17,17,0.4) 60%,transparent 100%)" }}
            />
            <div className="relative p-6 flex flex-col justify-end min-h-[230px]">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/70 mb-2">
                {s.home.continueReading}
              </span>
              <h2 className="font-serif font-bold text-white text-2xl leading-tight mb-5">
                {getBookDisplayName(currentBook, lang)} {currentChapter}
              </h2>
              <div className="flex flex-col gap-3">
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-[#ad322b] rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/70 font-medium">
                    {s.home.completed.replace("{n}", String(progress))}
                  </span>
                  <button
                    onClick={onResume}
                    className="bg-[#821111] hover:bg-[#9b1515] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-all flex items-center gap-2"
                  >
                    {s.home.resume}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── The Daily Logos ──────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-10"
        >
          <div className="bg-stone-50 dark:bg-stone-900 border-l-4 border-[#821111] rounded-r-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ScrollText size={16} className="text-[#821111] dark:text-red-400" />
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                {s.home.dailyLogos}
              </span>
            </div>
            <blockquote className="font-serif italic text-stone-800 dark:text-stone-100 text-lg leading-relaxed mb-3">
              &ldquo;{lang === "es" ? verse.es : verse.en}&rdquo;
            </blockquote>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              — <span className="italic">{lang === "es" ? verse.refEs : verse.refEn}</span>
            </p>
          </div>
        </motion.section>

        {/* ── Scholarly Collections ────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-10 -mx-4 sm:-mx-6"
        >
          <div className="px-4 sm:px-6 flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-xl text-[#821111] dark:text-red-400">
              {s.home.collections}
            </h3>
            <button
              onClick={onOpenSearch}
              className="text-xs font-bold text-[#821111] dark:text-red-400 hover:opacity-80 transition-opacity"
            >
              {s.home.viewAll}
            </button>
          </div>
          <div className="flex overflow-x-auto gap-4 px-4 sm:px-6 pb-2 tl-scrollbar snap-x">
            {COLLECTIONS.map(({ key, gradient }) => {
              return (
                <button
                  key={key}
                  onClick={() => setOpenCollection(key)}
                  className="group flex-shrink-0 w-44 snap-start text-left"
                >
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-stone-200/40 dark:border-white/10">
                    <div
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      style={{ background: gradient }}
                    />
                    <div
                      className="absolute inset-0 opacity-[0.08]"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                      }}
                    />
                    <BookMarked
                      size={26}
                      className="absolute top-4 left-4 text-white/40"
                      strokeWidth={1.5}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <span className="font-serif font-bold text-white text-base leading-tight block">
                        {s.collectionNames[key]}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* ── Recent Activity ──────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <h3 className="font-serif font-bold text-xl text-[#821111] dark:text-red-400 mb-4">
            {s.home.recentActivity}
          </h3>
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Library size={28} className="text-stone-300 dark:text-stone-700 mb-3" />
              <p className="font-serif italic text-sm text-stone-400 dark:text-stone-600 max-w-xs">
                {s.home.noActivity}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectHistory(item)}
                  className="w-full flex items-start gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-600 transition-colors text-left shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-full bg-[#821111]/10 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                    <HistoryIcon size={18} className="text-[#821111] dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                        {item.reference}
                        {item.state.selectedVerse ? `:${item.state.selectedVerse}` : ""}
                      </h4>
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono whitespace-nowrap mt-0.5">
                        {relativeTime(item.timestamp, lang).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                      {item.query}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.section>
      </div>
      </div>

      {/* ── Collection detail: books within the selected collection ─── */}
      <AnimatePresence>
        {openCollection && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="absolute inset-0 z-20 overflow-y-auto tl-scrollbar bg-white dark:bg-stone-950"
          >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-5 pb-32">
              <button
                onClick={() => setOpenCollection(null)}
                className="flex items-center gap-1 -ml-1 mb-5 text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors active:scale-95"
              >
                <ChevronLeft size={18} />
                {s.home.back}
              </button>
              <h2 className="font-serif font-bold text-2xl text-[#821111] dark:text-red-400 leading-tight">
                {s.collectionNames[openCollection]}
              </h2>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 mb-5">
                {s.home.bookCount.replace("{n}", String(detailBooks.length))}
              </p>
              <div className="space-y-2">
                {detailBooks.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    className="w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-600 transition-colors text-left shadow-sm hover:shadow-md active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 shrink-0 rounded-xl bg-[#821111]/10 dark:bg-red-900/20 flex items-center justify-center">
                        <BookMarked size={16} className="text-[#821111] dark:text-red-400" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                          {getBookDisplayName(book, lang)}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          {s.home.chapters.replace("{n}", String(book.chapters))}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-stone-400 dark:text-stone-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
