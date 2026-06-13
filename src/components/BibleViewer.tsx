import React, { useState, useRef, useEffect, useCallback } from "react";
import { BibleChapter } from "../types";
import { useI18n } from "../i18n";
import { Loader2, Search, X, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BibleViewerProps {
  chapter: BibleChapter | null;
  loading: boolean;
  error: string | null;
  onVerseSearch?: (verse: number | null, query: string) => void;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
  targetVerse?: number | null;
}

export const BibleViewer: React.FC<BibleViewerProps> = ({
  chapter,
  loading,
  error,
  onVerseSearch,
  onNextChapter,
  onPrevChapter,
  targetVerse,
}) => {
  const { s } = useI18n();
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const verseRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    
    // Check local scroll to top button
    setShowScrollTop(currentScrollY > 400);

    // Global mobile nav visibility
    if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        window.dispatchEvent(new CustomEvent("nav-visibility", { detail: { visible: false } }));
      } else {
        window.dispatchEvent(new CustomEvent("nav-visibility", { detail: { visible: true } }));
      }
      lastScrollY.current = currentScrollY;
    }
  };

  // Swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const [selectionRect, setSelectionRect] = useState<{
    top: number;
    left: number;
    text: string;
  } | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isPointerDown = false;

    const processSelection = () => {
      clearTimeout(timeoutId);
      if (isPointerDown) return;

      timeoutId = setTimeout(() => {
        const selection = window.getSelection();
        if (
          !selection ||
          selection.isCollapsed ||
          selection.toString().trim().length === 0
        ) {
          setSelectionRect(null);
          return;
        }

        if (
          textContainerRef.current &&
          textContainerRef.current.contains(selection.anchorNode) &&
          textContainerRef.current.contains(selection.focusNode)
        ) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          if (rect.width > 0 && rect.height > 0) {
            let selectedText = selection.toString().trim();
            if (selectedText.length > 50) {
              selectedText = selectedText.substring(0, 50) + "..."; // limit word size
            }

            setSelectionRect({
              top: Math.max(10, rect.top - 45),
              left: rect.left + rect.width / 2,
              text: selectedText,
            });
          }
        } else {
          setSelectionRect(null);
        }
      }, 250);
    };

    const handlePointerDown = () => {
      isPointerDown = true;
      setSelectionRect(null);
    };

    const handlePointerUp = () => {
      isPointerDown = false;
      processSelection();
    };

    document.addEventListener("selectionchange", processSelection);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });
    document.addEventListener("touchend", handlePointerUp);

    return () => {
      document.removeEventListener("selectionchange", processSelection);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("touchend", handlePointerUp);
      clearTimeout(timeoutId);
    };
  }, []);

  // Clear selection rect on scroll so the popover doesn't float away
  // but DO NOT clear the actual window selection as that breaks dragging on mobile.
  useEffect(() => {
    const handleScroll = () => {
      if (selectionRect) {
        setSelectionRect(null);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [selectionRect]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return;

    // Prevent swipe on horizontally scrollable elements or inputs
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    )
      return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const distanceX = touchStartX.current - touchEndX;
    const distanceY = touchStartY.current - touchEndY;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;

    // Ensure the swipe is mostly horizontal (avoid triggering on vertical scroll)
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY) * 1.5;

    if (isHorizontalSwipe) {
      if (isLeftSwipe && onNextChapter) {
        onNextChapter();
      } else if (isRightSwipe && onPrevChapter) {
        onPrevChapter();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  useEffect(() => {
    if (selectedVerse !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedVerse]);

  // When a search result navigates here, highlight and scroll to the target verse
  useEffect(() => {
    if (targetVerse != null && chapter) {
      setSelectedVerse(targetVerse);
      requestAnimationFrame(() => {
        const el = verseRefs.current.get(targetVerse);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }, [targetVerse, chapter?.reference]);

  // Reset to the top of each new chapter. The scroll container is reused
  // across chapter changes (both loading and loaded states render a root
  // <div>), so its scrollTop would otherwise persist — leaving you at the
  // bottom of the next chapter after a swipe. Skip when navigating to a
  // specific verse from search. Force instant (bypass CSS scroll-smooth).
  useEffect(() => {
    if (targetVerse != null) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = "auto";
    el.scrollTop = 0;
    el.style.scrollBehavior = prev;
  }, [chapter?.reference]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const currentScrollY = scrollContainerRef.current.scrollTop;
      setShowScrollTop(currentScrollY > 400);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onVerseSearch) {
      onVerseSearch(selectedVerse, searchQuery);
      setSelectedVerse(null);
      setSearchQuery("");
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 w-full bg-white dark:bg-stone-950 overflow-y-auto p-6 md:p-12 lg:p-16 max-w-4xl mx-auto shadow-sm border-x border-stone-100 dark:border-stone-900 transition-colors">
        <div className="mb-10 md:mb-16 text-center flex flex-col items-center">
          <div className="h-10 w-48 bg-stone-200 dark:bg-stone-800 rounded-lg animate-pulse mb-4"></div>
          <div className="h-4 w-24 bg-stone-100 dark:bg-stone-900 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-4 w-4 bg-stone-100 dark:bg-stone-900 rounded animate-pulse mt-1 shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 w-full bg-stone-100 dark:bg-stone-900 rounded animate-pulse"></div>
                <div
                  className={`h-5 bg-stone-100 dark:bg-stone-900 rounded animate-pulse ${i % 2 === 0 ? "w-5/6" : "w-full"}`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-stone-950 p-8 transition-colors">
        <div className="text-red-600 dark:text-red-400 text-center bg-red-50 dark:bg-red-950/30 p-6 rounded-2xl border border-red-100 dark:border-red-900/50 max-w-md">
          <p className="font-bold mb-2 uppercase tracking-widest text-[10px]">
            {s.failedToLoad}
          </p>
          <p className="text-sm font-serif italic">{error}</p>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-stone-950 p-8 transition-colors">
        <p className="text-stone-400 dark:text-stone-500 italic font-serif">
          {s.selectToBegin}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="flex-1 min-h-0 w-full bg-white dark:bg-stone-950 overflow-y-auto px-[max(1.5rem,env(safe-area-inset-left))] pt-6 pb-32 lg:pb-16 md:px-[max(3rem,env(safe-area-inset-left))] md:pt-12 lg:px-[max(4rem,env(safe-area-inset-left))] lg:pt-16 max-w-4xl mx-auto shadow-sm border-x border-stone-100 dark:border-stone-900 relative scroll-smooth transition-colors"
    >
      {/* Subtle oxblood left-margin rule — a nod to a physical Bible's gutter */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent 0%, #821111 10%, #821111 90%, transparent 100%)", opacity: 0.15 }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={chapter.reference}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <div className="mb-10 md:mb-16 text-center relative">
            {/* Translation eyebrow */}
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <span className="inline-block w-7 h-px bg-stone-300 dark:bg-stone-700" />
              <span className="tl-eyebrow">{chapter.translation_name}</span>
              <span className="inline-block w-7 h-px bg-stone-300 dark:bg-stone-700" />
            </div>
            <h1 className="font-serif text-3xl md:text-[52px] font-bold text-stone-900 dark:text-stone-100 leading-[1.05]" style={{ letterSpacing: "-0.03em" }}>
              {chapter.verses[0]?.book_name ?? chapter.reference.replace(/\s+\d+$/, "")}
            </h1>
            <p className="font-mono text-stone-400 dark:text-stone-500 mt-2" style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.1em" }}>
              {s.chapter} {chapter.verses[0]?.chapter ?? chapter.reference.match(/\d+$/)?.[0]}
            </p>
            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-2.5 mt-6">
              <div className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, rgb(214,211,209))" }} />
              <div className="w-[5px] h-[5px] rounded-full bg-[#821111] opacity-60" />
              <div className="h-px w-14" style={{ background: "linear-gradient(90deg, rgb(214,211,209), transparent)" }} />
            </div>
          </div>

          <div
            ref={textContainerRef}
            className="bible-text leading-relaxed md:leading-loose text-stone-800 dark:text-stone-200"
          >
            {chapter.verses.map((verse) => {
              const sel = selectedVerse === verse.verse;
              return (
                <span
                  key={verse.verse}
                  ref={(el) => { if (el) verseRefs.current.set(verse.verse, el); }}
                  className={`inline cursor-pointer transition-all duration-200 ${sel ? "verse-selected" : ""}`}
                  style={{ borderRadius: 4, padding: "2px 5px" }}
                  onClick={() => {
                    setSelectedVerse(sel ? null : verse.verse);
                    setSearchQuery("");
                  }}
                >
                  <sup className="verse-number">
                    {verse.verse}
                  </sup>
                  <span className="font-serif">{verse.text}</span>{" "}
                </span>
              );
            })}
          </div>

          {chapter.translation_note && (
            <div className="mt-16 md:mt-24 pt-8 md:pt-12 border-t border-stone-100 dark:border-stone-900 text-stone-400 dark:text-stone-500 text-xs md:text-sm italic leading-relaxed">
              {chapter.translation_note}
              {chapter.translation_id === "esv" && (
                <div className="mt-2 not-italic">
                  <a
                    href="https://www.esv.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#821111] dark:text-red-400 hover:underline font-bold"
                  >
                    ESV.org
                  </a>
                </div>
              )}
            </div>
          )}
          
          {/* Mobile Bottom Spacer */}
          <div className="h-[calc(6rem+env(safe-area-inset-bottom))] lg:hidden w-full flex-shrink-0" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>

      {/* Selection Popover for Lexical Search */}
      <AnimatePresence>
        {selectionRect && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[60]"
            style={{
              top: selectionRect.top,
              left: selectionRect.left,
              transform: "translateX(-50%)",
            }}
          >
            <div
              className="relative group cursor-pointer"
              onClick={() => {
                if (onVerseSearch) {
                  // If there's a selected text, find the nearest verse if we don't have one selected
                  // But the user might just want to define it generally.
                  onVerseSearch(
                    selectedVerse,
                    `${s.defineGreekHebrew}: "${selectionRect.text}"`,
                  );
                  window.getSelection()?.removeAllRanges();
                  setSelectionRect(null);
                }
              }}
            >
              <button className="bg-[#821111] dark:bg-red-900 text-white px-5 py-2.5 md:px-4 md:py-2 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-2 hover:bg-[#6a0d0d] dark:hover:bg-red-800 transition-colors shadow-2xl border border-red-900/80 whitespace-nowrap">
                <BookOpen size={16} className="text-red-200" />
                {s.defineGreekHebrew}
              </button>
              {/* Little triangle pointer */}
              <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-[#821111] dark:bg-red-900 rotate-45 border-r border-b border-red-900/80" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 z-40 p-3 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-full shadow-lg text-stone-400 dark:text-stone-500 hover:text-[#821111] dark:hover:text-red-400 hover:border-[#821111]/30 dark:hover:border-red-900/30 transition-all duration-300 hidden md:flex"
        >
          <Search size={20} className="rotate-180" />
        </button>
      )}

      {/* Floating Prompt Field */}
      {selectedVerse !== null && (
        <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] landscape:bottom-[calc(4rem+env(safe-area-inset-bottom))] lg:bottom-12 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl border border-stone-200 dark:border-stone-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-black/50 p-4 portrait:p-5 z-50 animate-in fade-in slide-in-from-bottom-6 duration-500 transition-colors">
          <div className="flex justify-between items-center mb-3 portrait:mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#821111] dark:bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-stone-800 dark:text-stone-100 uppercase tracking-widest">
                {s.theologicalInquiry} {selectedVerse}
              </span>
            </div>
            <button
              onClick={() => setSelectedVerse(null)}
              className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-400 dark:text-stone-500 transition-all active:scale-95"
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2 portrait:gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 portrait:left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500"
                size={18}
              />
              <input
                ref={inputRef}
                type="text"
                placeholder={s.askPlaceholder}
                className="w-full pl-9 portrait:pl-11 pr-3 portrait:pr-4 py-2.5 portrait:py-3 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm portrait:text-base focus:outline-none focus:ring-2 focus:ring-[#821111]/30 dark:focus:ring-red-900/30 bg-stone-50/50 dark:bg-stone-950/50 text-stone-800 dark:text-stone-100 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="px-5 portrait:px-6 py-2.5 portrait:py-3 bg-[#821111] dark:bg-red-900 text-white rounded-2xl text-sm md:text-base font-bold hover:bg-[#6a0d0d] dark:hover:bg-red-800 disabled:opacity-50 shadow-lg shadow-[#821111]/20 dark:shadow-black/20 transition-all active:scale-95"
            >
              {s.ask}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
