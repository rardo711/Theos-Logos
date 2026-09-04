import { useEffect, useRef, useState } from "react";
import { fetchChapter } from "@/lib/bible/fetch-chapter";
import { getSeed } from "@/lib/bible/seed";
import { attachNtHeadings } from "@/lib/bible/nt-headings";
import type { Chapter } from "@/lib/bible/types";
import { initPwa } from "@/lib/pwa";
import { t } from "@/lib/i18n";
import { hasNotes } from "@/lib/reception/notes";
import { useStudy } from "@/lib/study-store";
import { LibraryDrawer } from "./library-drawer";
import { Reader } from "./reader";
import { ReceptionPanel, VerseHint } from "./reception-panel";
import { TopBar } from "./top-bar";

function lockAppHeight() {
  const h = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty("--app-h", `${Math.round(h)}px`);
}

function chapterFitsLocale(ch: Chapter, locale: string): boolean {
  const name = ch.translationName ?? "";
  const english =
    name.includes("English Standard") || name.includes("World English");
  return locale === "es" ? !english : english;
}

export function StudyWorkspace() {
  const hydrate = useStudy((s) => s.hydrate);
  const bookId = useStudy((s) => s.bookId);
  const chapterNum = useStudy((s) => s.chapter);
  const fontSize = useStudy((s) => s.fontSize);
  const locale = useStudy((s) => s.locale);
  const setLibraryOpen = useStudy((s) => s.setLibraryOpen);
  const setTypeOpen = useStudy((s) => s.setTypeOpen);
  const receptionOpen = useStudy((s) => s.receptionOpen);
  const setReceptionOpen = useStudy((s) => s.setReceptionOpen);
  const receptionPinned = useStudy((s) => s.receptionPinned);
  const setReceptionPinned = useStudy((s) => s.setReceptionPinned);
  const setVerse = useStudy((s) => s.setVerse);
  const tapVerse = useStudy((s) => s.tapVerse);
  const selectedVerse = useStudy((s) => s.selectedVerse);
  const selectedEndVerse = useStudy((s) => s.selectedEndVerse);
  const notesRev = useStudy((s) => s.notesRev);

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [wideDesk, setWideDesk] = useState(false);
  const [sheetShown, setSheetShown] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetDy, setSheetDy] = useState(0);
  const [sheetDragging, setSheetDragging] = useState(false);
  const sheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    hydrate();
    setHydrated(true);
    initPwa();
  }, [hydrate]);

  useEffect(() => {
    lockAppHeight();
    const vv = window.visualViewport;
    vv?.addEventListener("resize", lockAppHeight);
    vv?.addEventListener("scroll", lockAppHeight);
    window.addEventListener("resize", lockAppHeight);
    window.addEventListener("orientationchange", lockAppHeight);
    return () => {
      vv?.removeEventListener("resize", lockAppHeight);
      vv?.removeEventListener("scroll", lockAppHeight);
      window.removeEventListener("resize", lockAppHeight);
      window.removeEventListener("orientationchange", lockAppHeight);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const sync = () => setWideDesk(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--reading-size",
      `${fontSize}px`,
    );
  }, [fontSize]);

  const docked = receptionPinned && wideDesk && receptionOpen;
  const sheetWanted = receptionOpen && !docked;

  useEffect(() => {
    if (sheetWanted) {
      setSheetShown(true);
      const id = requestAnimationFrame(() => setSheetOpen(true));
      return () => cancelAnimationFrame(id);
    }
    setSheetOpen(false);
    const t = window.setTimeout(() => setSheetShown(false), 280);
    return () => window.clearTimeout(t);
  }, [sheetWanted]);

  useEffect(() => {
    if (!sheetShown) {
      setSheetDy(0);
      setSheetDragging(false);
    }
  }, [sheetShown]);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el || !sheetOpen) return;
    let startY = 0;
    let startT = 0;
    let pulling = false;
    let dy = 0;
    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startT = performance.now();
      pulling = false;
      dy = 0;
    };
    const onMove = (e: TouchEvent) => {
      const delta = e.touches[0].clientY - startY;
      const scroller = el.querySelector(".tl-scroll") as HTMLElement | null;
      const atTop = !scroller || scroller.scrollTop <= 1;
      const handle = (e.target as HTMLElement | null)?.closest?.(
        "[data-sheet-handle]",
      );
      if (delta > 0 && (atTop || handle)) {
        pulling = true;
        dy = delta;
        setSheetDragging(true);
        setSheetDy(delta);
        if (delta > 6) e.preventDefault();
      } else if (pulling && delta <= 0) {
        dy = 0;
        setSheetDy(0);
      }
    };
    const finish = () => {
      const v = dy / Math.max(performance.now() - startT, 1);
      setSheetDragging(false);
      if (pulling && (dy > 48 || v > 0.5)) {
        setReceptionPinned(false);
        setReceptionOpen(false);
      } else {
        setSheetDy(0);
      }
      pulling = false;
      dy = 0;
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", finish);
    el.addEventListener("touchcancel", finish);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", finish);
      el.removeEventListener("touchcancel", finish);
    };
  }, [sheetOpen, setReceptionOpen, setReceptionPinned]);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setChapter((prev) => {
      if (
        prev == null ||
        prev.bookId !== bookId ||
        prev.chapter !== chapterNum ||
        !chapterFitsLocale(prev, locale)
      ) {
        return null;
      }
      return prev;
    });
    fetchChapter({ data: { bookId, chapter: chapterNum, locale } })
      .then((data) => {
        if (!cancelled) {
          setChapter(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const fallback =
          locale === "en" ? getSeed(bookId, chapterNum) : undefined;
        if (fallback) {
          setChapter(attachNtHeadings(fallback, locale));
          setError(null);
          return;
        }
        setChapter(null);
        setError(
          err instanceof Error ? err.message : t(locale, "loadFailed"),
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated, bookId, chapterNum, locale]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setLibraryOpen(true, "books");
        return;
      }
      if (e.key === "ArrowRight") useStudy.getState().nextChapter();
      if (e.key === "ArrowLeft") useStudy.getState().prevChapter();
      if (e.key === "j" || e.key === "ArrowDown") {
        const ch = chapter;
        if (!ch?.verses.length) return;
        e.preventDefault();
        const cur = selectedVerse;
        const end = selectedEndVerse ?? selectedVerse;
        if (e.shiftKey) {
          const last = ch.verses[ch.verses.length - 1]?.verse ?? 1;
          const from = end ?? ch.verses[0]?.verse ?? 1;
          tapVerse(Math.min(last, from + 1));
          return;
        }
        const idx =
          cur == null
            ? 0
            : Math.min(
                ch.verses.length - 1,
                ch.verses.findIndex((v) => v.verse === cur) + 1,
              );
        setVerse(ch.verses[Math.max(0, idx)]?.verse ?? null);
        return;
      }
      if (e.key === "k" || e.key === "ArrowUp") {
        const ch = chapter;
        if (!ch?.verses.length) return;
        e.preventDefault();
        const cur = selectedVerse;
        if (e.shiftKey) {
          const first = ch.verses[0]?.verse ?? 1;
          const from = cur ?? first;
          tapVerse(Math.max(first, from - 1));
          return;
        }
        if (cur == null) {
          setVerse(ch.verses[0]?.verse ?? null);
          return;
        }
        const idx = ch.verses.findIndex((v) => v.verse === cur);
        if (idx <= 0) {
          setVerse(null);
          return;
        }
        setVerse(ch.verses[idx - 1]?.verse ?? null);
        return;
      }
      if (e.key === "Escape") {
        setLibraryOpen(false);
        setTypeOpen(false);
        setReceptionPinned(false);
        setReceptionOpen(false);
        setVerse(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    chapter,
    selectedVerse,
    selectedEndVerse,
    setLibraryOpen,
    setTypeOpen,
    setReceptionOpen,
    setReceptionPinned,
    setVerse,
    tapVerse,
  ]);

  const verseHasNotes =
    notesRev >= 0 &&
    chapter != null &&
    selectedVerse != null &&
    (() => {
      const end = selectedEndVerse ?? selectedVerse;
      for (let v = selectedVerse; v <= end; v++) {
        if (hasNotes(chapter.bookId, chapter.chapter, v)) return true;
      }
      return false;
    })();

  function closeReception() {
    setReceptionPinned(false);
    setReceptionOpen(false);
  }

  const staleChapter =
    chapter != null &&
    (chapter.bookId !== bookId ||
      chapter.chapter !== chapterNum ||
      !chapterFitsLocale(chapter, locale));
  const waitingOnFetch = staleChapter || (loading && chapter == null);
  const shownChapter = waitingOnFetch ? null : chapter;

  return (
    <div className="tl-shell flex flex-col overflow-hidden bg-paper text-ink">
      <TopBar />

      <div className="relative flex min-h-0 flex-1">
        <section className="relative min-h-0 min-w-0 flex-1">
          <Reader
            chapter={shownChapter}
            loading={waitingOnFetch || loading}
            error={error}
          />
          <VerseHint
            noted={verseHasNotes}
            heldBack={sheetShown}
            onInquire={() => {
              if (selectedVerse != null) setReceptionOpen(true);
            }}
          />
        </section>

        {docked ? (
          <aside className="flex min-h-0 w-96 min-w-0 shrink-0 border-l border-rule xl:w-[26rem]">
            <ReceptionPanel chapter={shownChapter} onClose={closeReception} />
          </aside>
        ) : null}

        {sheetShown ? (
          <>
            <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end md:hidden">
              <button
                type="button"
                className="tl-dim min-h-0 flex-1"
                data-open={sheetOpen ? "true" : "false"}
                aria-label={t(locale, "closeReception")}
                onClick={closeReception}
                style={{
                  ["--dim-o" as string]: sheetOpen
                    ? String(Math.max(0.12, 1 - sheetDy / 320))
                    : "0",
                }}
              />
              <aside
                ref={sheetRef}
                className="tl-sheet-up flex h-[min(72dvh,42rem)] w-full flex-col rounded-t-xl border-t border-rule bg-paper shadow-soft"
                data-open={sheetOpen ? "true" : "false"}
                data-dragging={sheetDragging ? "true" : "false"}
                style={{
                  ["--sheet-dy" as string]: `${Math.max(0, sheetDy)}px`,
                }}
              >
                <div
                  data-sheet-handle
                  className="flex shrink-0 cursor-grab justify-center pt-3 pb-2 active:cursor-grabbing"
                  aria-hidden
                >
                  <span className="h-1 w-10 rounded-full bg-lamp/50" />
                </div>
                <div className="min-h-0 flex-1">
                  <ReceptionPanel
                    chapter={shownChapter}
                    onClose={closeReception}
                  />
                </div>
              </aside>
            </div>

            <div className="pointer-events-none absolute inset-0 z-20 hidden md:flex">
              <button
                type="button"
                className="tl-dim min-w-0 flex-1"
                data-open={sheetOpen ? "true" : "false"}
                aria-label={t(locale, "closeReception")}
                onClick={closeReception}
              />
              <aside
                className="tl-sheet flex h-full w-full max-w-md flex-col border-l border-rule bg-paper shadow-soft"
                data-open={sheetOpen ? "true" : "false"}
              >
                <ReceptionPanel chapter={shownChapter} onClose={closeReception} />
              </aside>
            </div>
          </>
        ) : null}
      </div>

      <LibraryDrawer
        verseCount={
          shownChapter &&
          shownChapter.bookId === bookId &&
          shownChapter.chapter === chapterNum
            ? shownChapter.verses.length
            : 0
        }
      />
    </div>
  );
}
