import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { searchBible, BibleSearchResult } from "../services/bibleService";
import { useI18n, Lang } from "../i18n";

interface BibleSearchProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  onNavigate: (bookName: string, chapter: number, verse: number) => void;
}

export const BibleSearch: React.FC<BibleSearchProps> = ({
  isOpen,
  onClose,
  lang,
  onNavigate,
}) => {
  const { s } = useI18n();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BibleSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translation, setTranslation] = useState<"ESV" | "RV1960">(
    lang === "es" ? "RV1960" : "ESV",
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Track visual viewport so the overlay shrinks with the iOS keyboard
  // and the card never exceeds 72% of the visible area (keyboard-aware)
  const [vpHeight, setVpHeight] = useState(() => window.visualViewport?.height ?? window.innerHeight);
  const [vpOffsetTop, setVpOffsetTop] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => { setVpHeight(vv.height); setVpOffsetTop(vv.offsetTop); };
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => { vv.removeEventListener("resize", update); vv.removeEventListener("scroll", update); };
  }, []);

  // Reset and autofocus on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setError(null);
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen]);

  // Sync translation with lang when lang changes
  useEffect(() => {
    setTranslation(lang === "es" ? "RV1960" : "ESV");
  }, [lang]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchBible(query.trim(), translation);
        setResults(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Search failed.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, translation]);

  // When the translation changes, drop the previous translation's results
  // immediately so they can't be clicked during the 400ms debounce before the
  // new-translation results arrive. Skips the initial mount.
  const didMountTx = useRef(false);
  useEffect(() => {
    if (!didMountTx.current) { didMountTx.current = true; return; }
    setResults([]);
  }, [translation]);

  // Escape key dismiss
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const highlightMatch = (text: string) => {
    const q = query.trim();
    if (!q) return <>{text}</>;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === q.toLowerCase() ? (
            <mark key={i} className="tl-search-mark">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </>
    );
  };

  const handleResult = (r: BibleSearchResult) => {
    onNavigate(r.book_name, r.chapter, r.verse);
    onClose();
  };

  const hasQuery = query.trim().length >= 2;
  const showEmpty = hasQuery && !loading && results.length === 0 && !error;
  const showCap = results.length === 50;

  // 72% of visible area on phones, hard-capped at 780px on large screens
  const cardMaxH = Math.min(Math.round(vpHeight * 0.72), 780);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Layer 1: full-screen backdrop — covers physical screen edges including
              the home-indicator zone. Separate from the card so no strip shows. */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm"
          />

          {/* Layer 2: card container — tracks the visual viewport so it sits
              above the keyboard and the card is centered in visible space.
              No pointer-events-none here: Safari needs the container to be
              a real pointer-events target or touch-scroll breaks on iPad. */}
          <div
            className="fixed left-0 right-0 z-[80] flex items-center justify-center px-4 md:px-8"
            style={{ top: vpOffsetTop, height: vpHeight }}
            onClick={onClose}
          >
            <motion.div
              key="search-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-stone-900 rounded-[24px] shadow-[0_32px_64px_rgba(0,0,0,0.22),0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[0_32px_64px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)] w-full max-w-2xl flex flex-col overflow-hidden"
              style={{ height: cardMaxH }}
            >
              {/* Header */}
              <div className="px-4 pt-4 pb-3 md:px-6 md:pt-5 md:pb-4 border-b border-stone-100 dark:border-stone-800/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={s.searchPlaceholder}
                    className="w-full pl-9 pr-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#821111]/20 dark:focus:ring-red-900/30 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 transition-all font-serif italic placeholder:text-stone-400 dark:placeholder:text-stone-500"
                  />
                </div>

                {/* Translation toggle */}
                <div className="flex shrink-0 bg-stone-100 dark:bg-stone-800 rounded-lg p-0.5 gap-0.5">
                  {(["ESV", "RV1960"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTranslation(t)}
                      className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                        translation === t
                          ? "bg-white dark:bg-stone-700 text-[#821111] dark:text-red-400 shadow-sm"
                          : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                      }`}
                    >
                      {t === "RV1960" ? "RVR" : t}
                    </button>
                  ))}
                </div>

                <button
                  onClick={onClose}
                  className="p-2 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition-colors shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Results */}
            <div
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain tl-scrollbar"
              style={{ touchAction: "pan-y" }}
            >
              {/* Loading skeletons */}
              {loading && (
                <div className="p-4 space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl">
                      <div className="tl-shimmer h-4 w-24 rounded-md shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-2">
                        <div className="tl-shimmer h-3.5 w-full rounded-md" />
                        <div className="tl-shimmer h-3.5 w-4/5 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Results list */}
              {!loading && results.length > 0 && (
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {results.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => handleResult(r)}
                      className="w-full text-left px-4 py-3.5 hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors flex gap-3 group"
                    >
                      <span
                        className="shrink-0 font-mono text-[11px] font-medium text-stone-400 dark:text-stone-500 mt-0.5 whitespace-nowrap group-hover:text-[#821111] dark:group-hover:text-red-400 transition-colors"
                        style={{ fontFamily: '"JetBrains Mono", monospace', letterSpacing: "0.02em" }}
                      >
                        {r.book_name} {r.chapter}:{r.verse}
                      </span>
                      <span className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed font-serif">
                        {highlightMatch(r.text)}
                      </span>
                    </button>
                  ))}
                  {showCap && (
                    <div className="px-4 py-3 text-center text-xs text-stone-400 dark:text-stone-500 font-serif italic">
                      {s.searchResultsCap}
                    </div>
                  )}
                </div>
              )}

              {/* Empty state */}
              {showEmpty && (
                <div className="flex flex-col items-center justify-center h-full px-6 py-20 text-center gap-3">
                  <Search size={36} className="text-stone-200 dark:text-stone-700" />
                  <p className="text-sm font-serif font-bold text-stone-600 dark:text-stone-400">
                    {s.searchNoResults.replace("{query}", query.trim())}
                  </p>
                  <p className="text-xs text-stone-400 dark:text-stone-500 font-serif italic">
                    {s.searchNoResultsHint}
                  </p>
                </div>
              )}

              {/* Idle state (no query entered yet) */}
              {!hasQuery && !loading && (
                <div className="flex flex-col items-center justify-center h-full px-6 py-16 gap-3 text-center text-stone-400 dark:text-stone-600">
                  <Search size={40} className="opacity-30" />
                  <p className="text-sm font-serif italic">
                    {s.searchPlaceholder}
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="m-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-serif italic">
                  {error}
                </div>
              )}
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
