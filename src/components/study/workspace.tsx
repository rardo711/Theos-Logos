import { useEffect, useRef, useState } from "react";
import { fetchChapter } from "@/lib/bible/fetch-chapter";
import { getSeed } from "@/lib/bible/seed";
import { attachNtHeadings } from "@/lib/bible/nt-headings";
import type { Chapter } from "@/lib/bible/types";
import { initPwa, isStandalone } from "@/lib/pwa";
import { t } from "@/lib/i18n";
import { useStudy } from "@/lib/study-store";
import { LibraryDrawer } from "./library-drawer";
import { Reader } from "./reader";
import { ReceptionPanel } from "./reception-panel";
import { TopBar } from "./top-bar";

function lockAppHeight() {
  const root = document.documentElement;
  const standalone = isStandalone();
  root.classList.toggle("tl-standalone", standalone);
  if (standalone) {
    root.style.setProperty("--app-h", "100%");
    root.style.setProperty("--app-top", "0px");
    root.style.setProperty("--app-left", "0px");
    return;
  }
  const vv = window.visualViewport;
  if (vv) {
    root.style.setProperty("--app-h", `${Math.round(vv.height)}px`);
    root.style.setProperty("--app-top", `${Math.round(vv.offsetTop)}px`);
    root.style.setProperty("--app-left", `${Math.round(vv.offsetLeft)}px`);
  } else {
    root.style.setProperty("--app-h", `${Math.round(window.innerHeight)}px`);
    root.style.setProperty("--app-top", "0px");
    root.style.setProperty("--app-left", "0px");
  }
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
  const clearSelection = useStudy((s) => s.clearSelection);

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [wideDesk, setWideDesk] = useState(false);
  const [sheetShown, setSheetShown] = useState(false);
  const [sheetState, setSheetState] = useState<"hidden" | "peek" | "open">(
    "hidden",
  );
  const [sheetDrag, setSheetDrag] = useState(0);
  const [sheetDragging, setSheetDragging] = useState(false);
  const sheetRef = useRef<HTMLElement>(null);
  const sheetStateRef = useRef(sheetState);
  sheetStateRef.current = sheetState;

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
  const want: "hidden" | "peek" | "open" = docked
    ? "hidden"
    : receptionOpen
      ? "open"
      : selectedVerse != null
        ? "peek"
        : "hidden";

  useEffect(() => {
    if (want === "hidden") {
      setSheetState("hidden");
      setSheetDrag(0);
      const t = window.setTimeout(() => setSheetShown(false), 280);
      return () => window.clearTimeout(t);
    }
    setSheetShown(true);
    const id = requestAnimationFrame(() => {
      setSheetState(want);
      setSheetDrag(0);
    });
    return () => cancelAnimationFrame(id);
  }, [want]);

  useEffect(() => {
    if (!sheetShown) {
      setSheetDrag(0);
      setSheetDragging(false);
    }
  }, [sheetShown]);

  useEffect(() => {
    if (!sheetShown) return;
    const chrome = sheetRef.current?.querySelector(
      "[data-sheet-chrome]",
    ) as HTMLElement | null;
    if (!chrome) return;
    const apply = () => {
      document.documentElement.style.setProperty(
        "--sheet-peek",
        `${chrome.offsetHeight}px`,
      );
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(chrome);
    return () => ro.disconnect();
  }, [sheetShown, locale, selectedVerse, selectedEndVerse]);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el || sheetState === "hidden") return;
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
      const chrome = (e.target as HTMLElement | null)?.closest?.(
        "[data-sheet-chrome]",
      );
      const mode = sheetStateRef.current;
      if (mode === "peek") {
        pulling = true;
        const chrome = el.querySelector(
          "[data-sheet-chrome]",
        ) as HTMLElement | null;
        const rise = Math.max(80, el.offsetHeight - (chrome?.offsetHeight ?? 92));
        dy = Math.min(Math.max(delta, -rise), el.offsetHeight * 0.45);
        setSheetDragging(true);
        setSheetDrag(dy);
        if (Math.abs(delta) > 6) e.preventDefault();
        return;
      }
      if (delta > 0 && (atTop || chrome)) {
        pulling = true;
        dy = delta;
        setSheetDragging(true);
        setSheetDrag(delta);
        if (delta > 6) e.preventDefault();
      } else if (pulling && delta <= 0) {
        dy = 0;
        setSheetDrag(0);
      }
    };
    const finish = () => {
      const v = dy / Math.max(performance.now() - startT, 1);
      const mode = sheetStateRef.current;
      setSheetDragging(false);
      if (!pulling) {
        dy = 0;
        return;
      }
      if (mode === "peek") {
        if (dy < -36 || v < -0.4) setReceptionOpen(true);
        else if (dy > 40 || v > 0.45) clearSelection();
        else setSheetDrag(0);
      } else if (dy > 48 || v > 0.5) {
        setReceptionPinned(false);
        setReceptionOpen(false);
      } else {
        setSheetDrag(0);
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
  }, [
    sheetState,
    sheetShown,
    setReceptionOpen,
    setReceptionPinned,
    clearSelection,
  ]);

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
        </section>

        {docked ? (
          <aside className="flex min-h-0 w-96 min-w-0 shrink-0 border-l border-rule xl:w-[26rem]">
            <ReceptionPanel chapter={shownChapter} onClose={closeReception} />
          </aside>
        ) : null}

        {sheetShown ? (
          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end xl:hidden">
            <div
              className="tl-dim min-h-0 flex-1"
              data-open={sheetState === "open" ? "true" : "false"}
              aria-hidden
              style={{
                ["--dim-o" as string]:
                  sheetState === "open"
                    ? String(Math.max(0, 1 - Math.max(0, sheetDrag) / 320))
                    : "0",
              }}
            />
            <aside
              ref={sheetRef}
              className="tl-sheet-up flex h-[min(72dvh,42rem)] w-full flex-col overflow-hidden rounded-t-2xl border-t border-rule bg-surface shadow-soft md:mx-auto md:h-[min(68dvh,46rem)] md:w-[min(40rem,100%)]"
              data-state={sheetState}
              data-dragging={sheetDragging ? "true" : "false"}
              style={{
                ["--sheet-drag" as string]: `${sheetDrag}px`,
              }}
            >
              <div className="min-h-0 flex-1">
                <ReceptionPanel
                  chapter={shownChapter}
                  onClose={closeReception}
                  sheet
                  expanded={sheetState === "open"}
                />
              </div>
            </aside>
          </div>
        ) : null}

        {receptionOpen && !docked ? (
          <div className="pointer-events-none absolute inset-0 z-20 hidden xl:flex">
            <button
              type="button"
              className="tl-dim min-w-0 flex-1"
              data-open="true"
              aria-label={t(locale, "closeReception")}
              onClick={closeReception}
            />
            <aside
              className="tl-sheet flex h-full w-full max-w-md flex-col border-l border-rule bg-paper shadow-soft"
              data-open="true"
            >
              <ReceptionPanel chapter={shownChapter} onClose={closeReception} />
            </aside>
          </div>
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
