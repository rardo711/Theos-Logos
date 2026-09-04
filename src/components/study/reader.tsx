import { useEffect, useMemo, useRef, useState, Fragment } from "react";
import { ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { BIBLE_BOOKS, bookName, getBook } from "@/lib/bible/books";
import type { Chapter } from "@/lib/bible/types";
import { splitDropCap } from "@/lib/bible/drop-cap";
import { inRange, MAX_RANGE_VERSES } from "@/lib/bible/range";
import { t } from "@/lib/i18n";
import { markedVerses } from "@/lib/reception/notes";
import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";

function neighbor(
  bookId: string,
  chapterNum: number,
  dir: -1 | 1,
): { bookId: string; chapter: number } | null {
  const book = getBook(bookId);
  const i = BIBLE_BOOKS.findIndex((b) => b.id === bookId);
  if (dir === 1) {
    if (chapterNum < book.chapters) return { bookId, chapter: chapterNum + 1 };
    if (i >= 0 && i < BIBLE_BOOKS.length - 1)
      return { bookId: BIBLE_BOOKS[i + 1].id, chapter: 1 };
    return null;
  }
  if (chapterNum > 1) return { bookId, chapter: chapterNum - 1 };
  if (i > 0) {
    const prev = BIBLE_BOOKS[i - 1];
    return { bookId: prev.id, chapter: prev.chapters };
  }
  return null;
}

function animateScrollToTop(
  el: HTMLElement,
  anim: { id: number | null },
) {
  if (anim.id != null) cancelAnimationFrame(anim.id);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    el.scrollTop = 0;
    anim.id = null;
    return;
  }
  const start = el.scrollTop;
  if (start <= 0) {
    anim.id = null;
    return;
  }
  const t0 = performance.now();
  const dur = 420;
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / dur);
    const k = 1 - (1 - t) ** 3;
    el.scrollTop = start * (1 - k);
    if (t < 1) {
      anim.id = requestAnimationFrame(step);
    } else {
      el.scrollTop = 0;
      anim.id = null;
    }
  };
  anim.id = requestAnimationFrame(step);
}

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
  const selectedEnd = useStudy((s) => s.selectedEndVerse);
  const selectMode = useStudy((s) => s.selectMode);
  const tapVerse = useStudy((s) => s.tapVerse);
  const setVerse = useStudy((s) => s.setVerse);
  const nextChapter = useStudy((s) => s.nextChapter);
  const prevChapter = useStudy((s) => s.prevChapter);
  const notesRev = useStudy((s) => s.notesRev);
  const setReceptionOpen = useStudy((s) => s.setReceptionOpen);
  const receptionOpen = useStudy((s) => s.receptionOpen);
  const receptionPinned = useStudy((s) => s.receptionPinned);
  const locale = useStudy((s) => s.locale);
  const bookId = useStudy((s) => s.bookId);
  const chapterNum = useStudy((s) => s.chapter);
  const scrollRef = useRef<HTMLDivElement>(null);
  const verseRefs = useRef<Map<number, HTMLElement>>(new Map());
  const touch = useRef<{ x: number; y: number } | null>(null);
  const topAnim = useRef<{ id: number | null }>({ id: null });
  const [showTop, setShowTop] = useState(false);
  const [rangeNotice, setRangeNotice] = useState<"too-long" | null>(null);
  const range =
    selected == null ? null : { start: selected, end: selectedEnd ?? selected };

  const book = getBook(bookId);
  const bookIndex = BIBLE_BOOKS.findIndex((b) => b.id === bookId);
  const canPrev = bookIndex > 0 || chapterNum > 1;
  const canNext =
    bookIndex < BIBLE_BOOKS.length - 1 || chapterNum < book.chapters;
  const isEsv = (chapter?.translationName ?? "").includes("English Standard");
  const prevDest = neighbor(bookId, chapterNum, -1);
  const nextDest = neighbor(bookId, chapterNum, 1);
  const sections = chapter?.verses.filter((v) => v.title) ?? [];
  const hintUp =
    selected != null && !receptionOpen && !receptionPinned;
  const notedSet = useMemo(
    () =>
      chapter
        ? new Set(markedVerses(chapter.bookId, chapter.chapter))
        : new Set<number>(),
    [chapter, notesRev],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (topAnim.current.id != null) {
      cancelAnimationFrame(topAnim.current.id);
      topAnim.current.id = null;
    }
    el.scrollTop = 0;
    setShowTop(false);
    setRangeNotice(null);
  }, [chapter?.reference, chapter?.bookId, chapter?.chapter]);

  useEffect(() => {
    if (!selectMode) setRangeNotice(null);
  }, [selectMode]);

  useEffect(() => {
    return () => {
      if (topAnim.current.id != null) cancelAnimationFrame(topAnim.current.id);
    };
  }, []);

  useEffect(() => {
    if (selected == null) return;
    const scroller = scrollRef.current;
    if (!scroller) return;
    const head = scroller.querySelector(
      `#s-${selected}`,
    ) as HTMLElement | null;
    const verse = verseRefs.current.get(selected);
    const target = head ?? verse;
    if (!target) return;
    const vBox = target.getBoundingClientRect();
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

  function updateShowTop(el: HTMLElement) {
    const room = el.scrollHeight - el.clientHeight;
    const top = room > 200 && el.scrollTop > 280;
    setShowTop((prev) => (prev === top ? prev : top));
  }

  return (
    <div className="absolute inset-0">
      {loading ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden bg-rule"
        >
          <span className="tl-progress block h-full bg-lamp" />
        </div>
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 bottom-0 left-0 z-[1] w-px bg-lamp/30 max-sm:hidden"
      />
      <div
        ref={scrollRef}
        className="tl-scroll absolute inset-0 overflow-y-auto"
        onScroll={(e) => {
          updateShowTop(e.currentTarget);
        }}
        onTouchStart={(e) => {
          if (topAnim.current.id != null) {
            cancelAnimationFrame(topAnim.current.id);
            topAnim.current.id = null;
          }
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
          if (dx > 0 && canNext) nextChapter();
          else if (dx < 0 && canPrev) prevChapter();
        }}
        onWheel={() => {
          if (topAnim.current.id != null) {
            cancelAnimationFrame(topAnim.current.id);
            topAnim.current.id = null;
          }
        }}
      >
        <div className="mx-auto max-w-[42rem] px-5 pt-6 pb-36 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-10 sm:pt-12">
          {loading && !chapter ? (
            <div className="space-y-4" aria-busy>
              <div className="mx-auto h-3 w-28 rounded-sm bg-lamp/15" />
              <div className="mx-auto h-10 w-44 rounded-sm bg-lamp/20" />
              <div className="mt-10 space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 rounded-sm bg-lamp/10"
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
            <div
              key={`${chapter.bookId}-${chapter.chapter}`}
              className="tl-chapter"
            >
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
                  <span className="size-1.5 rounded-full bg-lamp/70" />
                  <span className="h-px w-10 bg-rule" />
                </div>
              </header>

              {sections.length > 1 ? (
                <nav
                  aria-label={t(locale, "inThisChapter")}
                  className="mb-8 rounded-md border border-rule bg-surface/80 px-4 py-3"
                >
                  <p className="mb-2 text-2xs font-semibold tracking-[0.16em] text-faint uppercase">
                    {t(locale, "inThisChapter")}
                  </p>
                  <ul className="space-y-0.5">
                    {sections.map((s) => (
                      <li key={s.verse}>
                        <button
                          type="button"
                          onClick={() => setVerse(s.verse)}
                          className={cn(
                            "flex min-h-10 w-full items-baseline gap-2 rounded-xs px-1 text-left text-sm transition-colors duration-150 ease-out",
                            selected === s.verse
                              ? "font-medium text-lamp"
                              : "text-ink hover:text-lamp",
                          )}
                        >
                          <span className="w-6 shrink-0 font-serif text-xs text-faint tabular-nums">
                            {s.verse}
                          </span>
                          <span className="font-display tracking-tight">
                            {s.title}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}

              {rangeNotice ? (
                <p
                  role="alert"
                  className="mb-3 text-2xs leading-relaxed text-oxblood italic"
                >
                  {t(locale, "rangeTooLong").replace(
                    "{n}",
                    String(MAX_RANGE_VERSES),
                  )}
                </p>
              ) : null}

              <div className="bible-prose font-serif text-[length:var(--reading-size,20px)] leading-[1.8] text-ink">
                {chapter.verses.map((v, i) => {
                  const on = inRange(range, v.verse);
                  const isRangeStart = range != null && v.verse === range.start;
                  const noted = notedSet.has(v.verse);
                  const drop = i === 0 ? splitDropCap(v.text) : null;
                  return (
                    <Fragment key={v.verse}>
                      {v.title ? (
                        <h3
                          id={`s-${v.verse}`}
                          className="bible-heading"
                          data-first={i === 0 ? "true" : undefined}
                        >
                          {v.title}
                        </h3>
                      ) : null}
                      <span
                        ref={(el) => {
                          if (el) verseRefs.current.set(v.verse, el);
                          else verseRefs.current.delete(v.verse);
                        }}
                        id={`v-${v.verse}`}
                        role="button"
                        tabIndex={0}
                        aria-current={isRangeStart ? "true" : undefined}
                        aria-selected={on ? "true" : undefined}
                        onMouseDown={(e) => {
                          if (e.shiftKey) e.preventDefault();
                        }}
                        onClick={(e) => {
                          if (selectMode || e.shiftKey) {
                            const refused = tapVerse(v.verse);
                            if (refused) setRangeNotice(refused);
                            else setRangeNotice(null);
                            return;
                          }
                          if (on) {
                            setVerse(null);
                            setReceptionOpen(false);
                            return;
                          }
                          setVerse(v.verse);
                        }}
                        onKeyDown={(e) => {
                          if (e.key !== "Enter" && e.key !== " ") return;
                          e.preventDefault();
                          e.currentTarget.click();
                        }}
                        className={cn(
                          "tl-verse cursor-pointer",
                          drop && "tl-first-verse",
                        )}
                        data-range-start={isRangeStart ? "true" : undefined}
                      >
                        {drop ? (
                          <>
                            <sup className="verse-num tl-drop-num select-none">
                              {v.verse}
                              {noted ? (
                                <span
                                  className="verse-mark"
                                  title={t(locale, "verseNotes")}
                                />
                              ) : null}
                            </sup>
                            <span className="tl-drop">{drop.letter}</span>
                            {drop.rest}{" "}
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
                      </span>
                    </Fragment>
                  );
                })}
              </div>

              <footer className="mt-16 flex items-center justify-between gap-3 border-t border-rule pt-6">
                <button
                  type="button"
                  onClick={prevChapter}
                  disabled={!canPrev}
                  className="inline-flex min-h-11 min-w-0 items-center gap-1 rounded-md px-2 py-2 text-sm text-muted transition-[color,transform] duration-150 ease-out hover:text-ink active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronLeft size={16} className="shrink-0" />
                  <span className="truncate">
                    {prevDest
                      ? `${bookName(getBook(prevDest.bookId), locale)} ${prevDest.chapter}`
                      : t(locale, "previous")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={nextChapter}
                  disabled={!canNext}
                  className="inline-flex min-h-11 min-w-0 items-center gap-1 rounded-md px-2 py-2 text-sm text-muted transition-[color,transform] duration-150 ease-out hover:text-ink active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-30"
                >
                  <span className="truncate">
                    {nextDest
                      ? `${bookName(getBook(nextDest.bookId), locale)} ${nextDest.chapter}`
                      : t(locale, "next")}
                  </span>
                  <ChevronRight size={16} className="shrink-0" />
                </button>
              </footer>
              <p className="mt-8 text-2xs leading-relaxed text-faint italic">
                {chapter.translationNote}
                {notesRev >= 0 &&
                chapter.verses.some((v) => notedSet.has(v.verse))
                  ? t(locale, "redMarks")
                  : ""}
              </p>
              {isEsv ? (
                <p className="mt-2">
                  <a
                    href="https://www.esv.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xs font-semibold tracking-wide text-lamp uppercase hover:underline"
                  >
                    {t(locale, "esvSite")}
                  </a>
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          const el = scrollRef.current;
          if (!el) return;
          animateScrollToTop(el, topAnim.current);
        }}
        className="tl-back-top"
        data-show={showTop && !hintUp ? "true" : "false"}
        aria-label={t(locale, "backToTop")}
        tabIndex={showTop && !hintUp ? 0 : -1}
        aria-hidden={!(showTop && !hintUp)}
      >
        <ArrowUp size={16} />
      </button>
    </div>
  );
}
