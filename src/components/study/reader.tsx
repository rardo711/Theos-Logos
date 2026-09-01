import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Chapter } from "@/lib/bible/types";
import { t } from "@/lib/i18n";
import { hasNotes } from "@/lib/reception/notes";
import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";

export function Reader({
  chapter,
  loading,
  error,
}: {
  chapter: Chapter | null;
  loading: boolean;
  error: string | null;
}) {
  const selected = useStudy((s) => s.selectedVerse);
  const setVerse = useStudy((s) => s.setVerse);
  const nextChapter = useStudy((s) => s.nextChapter);
  const prevChapter = useStudy((s) => s.prevChapter);
  const notesRev = useStudy((s) => s.notesRev);
  const setReceptionOpen = useStudy((s) => s.setReceptionOpen);
  const locale = useStudy((s) => s.locale);
  const scrollRef = useRef<HTMLDivElement>(null);
  const verseRefs = useRef<Map<number, HTMLElement>>(new Map());
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = 0;
  }, [chapter?.reference]);

  useEffect(() => {
    if (selected == null) return;
    const verse = verseRefs.current.get(selected);
    const scroller = scrollRef.current;
    if (!verse || !scroller) return;
    const vBox = verse.getBoundingClientRect();
    const sBox = scroller.getBoundingClientRect();
    const pad = 48;
    if (vBox.top >= sBox.top + pad && vBox.bottom <= sBox.bottom - pad) return;
    const next =
      scroller.scrollTop +
      (vBox.top - sBox.top) -
      sBox.height / 2 +
      vBox.height / 2;
    scroller.scrollTo({ top: Math.max(0, next), behavior: "smooth" });
  }, [selected, chapter?.reference]);

  return (
    <div
      ref={scrollRef}
      className="tl-scroll absolute inset-0 overflow-y-auto"
      onTouchStart={(e) => {
        touch.current = {
          x: e.targetTouches[0].clientX,
          y: e.targetTouches[0].clientY,
        };
      }}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const dx = touch.current.x - e.changedTouches[0].clientX;
        const dy = touch.current.y - e.changedTouches[0].clientY;
        touch.current = null;
        if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
        if (dx > 0) nextChapter();
        else prevChapter();
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 bottom-0 left-0 w-px bg-oxblood/30"
      />
      <div className="mx-auto max-w-[42rem] px-5 pt-6 pb-36 sm:px-10 sm:pt-12">
        {loading && !chapter ? (
          <div className="space-y-4" aria-busy>
            <div className="mx-auto h-3 w-28 rounded-sm bg-oxblood/15" />
            <div className="mx-auto h-10 w-44 rounded-sm bg-oxblood/20" />
            <div className="mt-10 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 rounded-sm bg-oxblood/10"
                  style={{ width: `${80 - (i % 3) * 12}%` }}
                />
              ))}
            </div>
          </div>
        ) : error && !chapter ? (
          <p className="font-display text-center text-lg text-oxblood italic">
            {error}
          </p>
        ) : chapter ? (
          <>
            <header className="mb-8 text-center sm:mb-10">
              <p className="text-2xs font-medium tracking-[0.22em] text-muted uppercase">
                {chapter.translationName}
              </p>
              <h1 className="font-display mt-2 text-[2rem] leading-none font-semibold tracking-tight text-ink sm:text-5xl">
                {chapter.bookName}
              </h1>
              <p className="mt-1.5 text-xs tracking-[0.18em] text-faint uppercase">
                {t(locale, "chapter", { n: chapter.chapter })}
              </p>
              <div className="mt-5 flex items-center justify-center gap-2">
                <span className="h-px w-10 bg-rule" />
                <span className="size-1.5 rounded-full bg-oxblood/70" />
                <span className="h-px w-10 bg-rule" />
              </div>
            </header>

            <div className="bible-prose font-serif text-[length:var(--reading-size,20px)] leading-[1.8] text-ink">
              {chapter.verses.map((v) => {
                const on = selected === v.verse;
                const noted = hasNotes(
                  chapter.bookId,
                  chapter.chapter,
                  v.verse,
                );
                return (
                  <span
                    key={v.verse}
                    ref={(el) => {
                      if (el) verseRefs.current.set(v.verse, el);
                    }}
                    onClick={() => {
                      if (on) {
                        setVerse(null);
                        setReceptionOpen(false);
                        return;
                      }
                      setVerse(v.verse);
                      if (
                        noted &&
                        !useStudy.getState().receptionPinned
                      ) {
                        setReceptionOpen(true);
                      }
                    }}
                    className={cn(
                      "cursor-pointer transition-colors duration-200",
                      on
                        ? "bg-oxblood-soft"
                        : "hover:bg-oxblood-soft/55",
                    )}
                  >
                    <sup className="verse-num mr-1 select-none">
                      {v.verse}
                      {noted ? (
                        <span
                          className="verse-mark"
                          title={t(locale, "verseNotes")}
                        />
                      ) : null}
                    </sup>
                    {v.text}{" "}
                  </span>
                );
              })}
            </div>

            <footer className="mt-16 flex items-center justify-between border-t border-rule pt-6">
              <button
                type="button"
                onClick={prevChapter}
                className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 py-2 text-sm text-muted hover:text-ink"
              >
                <ChevronLeft size={16} />
                {t(locale, "previous")}
              </button>
              <button
                type="button"
                onClick={nextChapter}
                className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 py-2 text-sm text-muted hover:text-ink"
              >
                {t(locale, "next")}
                <ChevronRight size={16} />
              </button>
            </footer>
            <p className="mt-8 text-2xs leading-relaxed text-faint italic">
              {chapter.translationNote}
              {notesRev >= 0 &&
              chapter.verses.some((v) =>
                hasNotes(chapter.bookId, chapter.chapter, v.verse),
              )
                ? t(locale, "redMarks")
                : ""}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
