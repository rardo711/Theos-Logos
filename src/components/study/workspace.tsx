import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { fetchChapter } from "@/lib/bible/fetch-chapter";
import { getSeed } from "@/lib/bible/seed";
import { attachNtHeadings } from "@/lib/bible/nt-headings";
import type { Chapter } from "@/lib/bible/types";
import { translationInfo } from "@/lib/bible/translations";
import type { Locale } from "@/lib/bible/books";
import { initPwa, isStandalone, lockPhoneClass, lockSafeBottom, lockSafeTop } from "@/lib/pwa";
import { t } from "@/lib/i18n";
import { useStudy } from "@/lib/study-store";
import { isOnboardingComplete } from "@/lib/onboarding";
import { LibraryDrawer } from "./library-drawer";
import { Onboarding } from "./onboarding";
import { QuickJumpModal } from "./quick-jump-modal";
import { Reader } from "./reader";
import { ReceptionPanel } from "./reception-panel";
import { SourcesPage } from "./sources-page";
import { TopBar } from "./top-bar";
import { DiagOverlay } from "./diag-overlay";

function lockAppHeight() {
  const root = document.documentElement;
  const standalone = isStandalone();
  root.classList.toggle("tl-standalone", standalone);
  lockPhoneClass();
  lockSafeTop();
  lockSafeBottom();
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

function chapterFitsSelection(
  ch: Chapter,
  locale: Locale,
  translationId: string,
): boolean {
  const info = translationInfo(locale, translationId);
  return (ch.translationName ?? "") === info.name;
}

export function StudyWorkspace() {
  const hydrate = useStudy((s) => s.hydrate);
  const bookId = useStudy((s) => s.bookId);
  const chapterNum = useStudy((s) => s.chapter);
  const fontSize = useStudy((s) => s.fontSize);
  const locale = useStudy((s) => s.locale);
  const enTranslation = useStudy((s) => s.enTranslation);
  const esTranslation = useStudy((s) => s.esTranslation);
  const translationId = locale === "es" ? esTranslation : enTranslation;
  const setLibraryOpen = useStudy((s) => s.setLibraryOpen);
  const setTypeOpen = useStudy((s) => s.setTypeOpen);
  const receptionOpen = useStudy((s) => s.receptionOpen);
  const setReceptionOpen = useStudy((s) => s.setReceptionOpen);
  const receptionFull = useStudy((s) => s.receptionFull);
  const setReceptionFull = useStudy((s) => s.setReceptionFull);
  const receptionPinned = useStudy((s) => s.receptionPinned);
  const setReceptionPinned = useStudy((s) => s.setReceptionPinned);
  const sourcesPageOpen = useStudy((s) => s.sourcesPageOpen);
  const setSourcesPageOpen = useStudy((s) => s.setSourcesPageOpen);
  const setQuickJumpOpen = useStudy((s) => s.setQuickJumpOpen);
  const setVerse = useStudy((s) => s.setVerse);
  const tapVerse = useStudy((s) => s.tapVerse);
  const selectedVerse = useStudy((s) => s.selectedVerse);
  const selectedEndVerse = useStudy((s) => s.selectedEndVerse);
  const clearSelection = useStudy((s) => s.clearSelection);

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  /** pending until hydrate; then show | done */
  const [onboarding, setOnboarding] = useState<"pending" | "show" | "done">(
    "pending",
  );
  const [wideDesk, setWideDesk] = useState(false);
  /** Hidden on-device diagnostic: 5 quick taps on the top bar toggles it. */
  const [showDiag, setShowDiag] = useState(false);
  const diagTaps = useRef(0);
  const diagTimer = useRef<number | null>(null);
  const handleTopBarTap = () => {
    diagTaps.current += 1;
    if (diagTimer.current) window.clearTimeout(diagTimer.current);
    if (diagTaps.current >= 5) {
      diagTaps.current = 0;
      setShowDiag((v) => !v);
    } else {
      diagTimer.current = window.setTimeout(() => {
        diagTaps.current = 0;
      }, 800);
    }
  };
  const [sheetShown, setSheetShown] = useState(false);
  const [sheetState, setSheetState] = useState<
    "hidden" | "peek" | "mid" | "full"
  >("hidden");
  const [sheetDrag, setSheetDrag] = useState(0);
  const [sheetDragging, setSheetDragging] = useState(false);
  // xl side desk: keep mounted through exit slide (BUG-10)
  const [deskShown, setDeskShown] = useState(false);
  const [deskOpen, setDeskOpen] = useState(false);
  // Desktop source desk: raised automatically by verse selection on wide
  // screens. Tracks whether this session's desk open came from selection
  // (vs. the user opening/pinning it deliberately).
  const autoDesk = useRef(false);
  // Sources page: keep mounted through its exit animation.
  const [sourcesShown, setSourcesShown] = useState(false);
  const [sourcesAnimOpen, setSourcesAnimOpen] = useState(false);
  const sheetRef = useRef<HTMLElement>(null);
  const sheetStateRef = useRef(sheetState);
  sheetStateRef.current = sheetState;

  useEffect(() => {
    hydrate();
    setHydrated(true);
    initPwa();
    setOnboarding(isOnboardingComplete() ? "done" : "show");
  }, [hydrate]);

  useLayoutEffect(() => {
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
  const want: "hidden" | "peek" | "mid" | "full" = docked
    ? "hidden"
    : selectedVerse == null
      ? "hidden"
      : receptionFull
        ? "full"
        : receptionOpen
          ? "mid"
          : "peek";

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

  // Desktop source desk: selecting a verse on a wide screen raises the
  // desk (side panel) so commentaries are one tap away. Deselecting lowers
  // it again. Mobile keeps its bottom-sheet behavior untouched — this
  // effect never fires below the xl breakpoint.
  useEffect(() => {
    if (!wideDesk) {
      // Fell back under the breakpoint: hand control back to the sheet.
      if (autoDesk.current) {
        autoDesk.current = false;
        setReceptionOpen(false);
      }
      return;
    }
    if (selectedVerse != null && !receptionOpen && !receptionPinned) {
      autoDesk.current = true;
      setReceptionOpen(true);
    } else if (
      selectedVerse == null &&
      autoDesk.current &&
      receptionOpen &&
      !receptionPinned
    ) {
      autoDesk.current = false;
      setReceptionOpen(false);
    }
  }, [wideDesk, selectedVerse, receptionOpen, receptionPinned, setReceptionOpen]);

  // Sources page enter/exit — calm fade + rise, no snap.
  useEffect(() => {
    if (sourcesPageOpen) {
      setSourcesShown(true);
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setSourcesAnimOpen(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        if (inner) cancelAnimationFrame(inner);
      };
    }
    setSourcesAnimOpen(false);
    const t = window.setTimeout(() => setSourcesShown(false), 340);
    return () => window.clearTimeout(t);
  }, [sourcesPageOpen]);

  // BUG-10: xl reception overlay — mount for enter, stay for exit slide.
  useEffect(() => {
    const wantDesk = receptionOpen && !docked;
    if (wantDesk) {
      setDeskShown(true);
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setDeskOpen(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        if (inner) cancelAnimationFrame(inner);
      };
    }
    setDeskOpen(false);
    const t = window.setTimeout(() => setDeskShown(false), 280);
    return () => window.clearTimeout(t);
  }, [receptionOpen, docked]);

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
    const root = document.documentElement;
    if (sheetState === "mid") {
      root.style.setProperty("--pick-stack", "var(--sheet-mid)");
    } else {
      root.style.setProperty("--pick-stack", "var(--sheet-peek)");
    }
  }, [sheetState]);

  useEffect(() => {
    const el = sheetRef.current;
    const chrome = el?.querySelector("[data-sheet-chrome]") as HTMLElement | null;
    if (!el || !chrome || sheetState === "hidden") return;
    let startY = 0;
    let startT = 0;
    let pulling = false;
    let dy = 0;
    const COMMIT = 56;
    const FLING = 0.55;
    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startT = performance.now();
      pulling = false;
      dy = 0;
    };
    const onMove = (e: TouchEvent) => {
      const delta = e.touches[0].clientY - startY;
      const mode = sheetStateRef.current;
      const room = el.parentElement?.clientHeight ?? window.innerHeight;
      pulling = true;
      if (mode === "peek") {
        dy = Math.min(Math.max(delta, -(room - el.offsetHeight)), room * 0.35);
      } else if (mode === "mid") {
        dy = Math.min(Math.max(delta, -(room - el.offsetHeight)), el.offsetHeight * 0.9);
      } else {
        dy = Math.min(Math.max(delta, 0), el.offsetHeight * 0.92);
      }
      setSheetDragging(true);
      setSheetDrag(dy);
      if (Math.abs(delta) > 4) e.preventDefault();
    };
    const finish = () => {
      const v = dy / Math.max(performance.now() - startT, 1);
      const mode = sheetStateRef.current;
      const H = el.offsetHeight;
      const room = el.parentElement?.clientHeight ?? window.innerHeight;
      setSheetDragging(false);
      if (!pulling) {
        dy = 0;
        return;
      }
      if (mode === "peek") {
        if (dy < -room * 0.28 || v < -1.05) setReceptionFull(true);
        else if (dy < -COMMIT || v < -FLING) setReceptionOpen(true);
        else if (dy > COMMIT || v > FLING) clearSelection();
        else setSheetDrag(0);
      } else if (mode === "mid") {
        if (dy < -COMMIT || v < -FLING) setReceptionFull(true);
        else if (dy > COMMIT || v > FLING) {
          setReceptionFull(false);
          setReceptionOpen(false);
        } else setSheetDrag(0);
      } else if (dy > H * 0.28 || v > 1.1) {
        setReceptionFull(false);
        setReceptionOpen(false);
      } else if (dy > COMMIT || v > FLING) {
        setReceptionFull(false);
      } else {
        setSheetDrag(0);
      }
      pulling = false;
      dy = 0;
    };
    chrome.addEventListener("touchstart", onStart, { passive: true });
    chrome.addEventListener("touchmove", onMove, { passive: false });
    chrome.addEventListener("touchend", finish);
    chrome.addEventListener("touchcancel", finish);
    return () => {
      chrome.removeEventListener("touchstart", onStart);
      chrome.removeEventListener("touchmove", onMove);
      chrome.removeEventListener("touchend", finish);
      chrome.removeEventListener("touchcancel", finish);
    };
  }, [
    sheetState,
    sheetShown,
    setReceptionOpen,
    setReceptionFull,
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
        !chapterFitsSelection(prev, locale, translationId)
      ) {
        return null;
      }
      return prev;
    });
    fetchChapter({ data: { bookId, chapter: chapterNum, locale, translation: translationId } })
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
  }, [hydrated, bookId, chapterNum, locale, translationId]);

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
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setQuickJumpOpen(true);
        return;
      }
      if (e.key === "Escape") {
        // Close topmost overlay first (sources / quickJump / library / type / reception), then clear.
        const st = useStudy.getState();
        if (st.sourcesPageOpen) {
          e.preventDefault();
          setSourcesPageOpen(false);
          return;
        }
        if (st.quickJumpOpen) {
          e.preventDefault();
          setQuickJumpOpen(false);
          return;
        }
        if (st.libraryOpen) {
          e.preventDefault();
          setLibraryOpen(false);
          return;
        }
        if (st.typeOpen) {
          e.preventDefault();
          setTypeOpen(false);
          return;
        }
        if (st.receptionFull || st.receptionOpen) {
          e.preventDefault();
          setReceptionFull(false);
          setReceptionOpen(false);
          setReceptionPinned(false);
          return;
        }
        if (st.selectedVerse != null) {
          e.preventDefault();
          setVerse(null);
        }
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
    setReceptionFull,
    setReceptionPinned,
    setSourcesPageOpen,
    setQuickJumpOpen,
    setVerse,
    tapVerse,
  ]);

  function closeReception() {
    // Desktop auto-raised desk: closing it also clears the verse selection,
    // so the desk fully lowers instead of springing back open.
    if (autoDesk.current) {
      autoDesk.current = false;
      clearSelection();
    }
    setReceptionPinned(false);
    setReceptionFull(false);
    setReceptionOpen(false);
  }

  const staleChapter =
    chapter != null &&
    (chapter.bookId !== bookId ||
      chapter.chapter !== chapterNum ||
      !chapterFitsSelection(chapter, locale, translationId));
  const waitingOnFetch = staleChapter || (loading && chapter == null);
  const shownChapter = waitingOnFetch ? null : chapter;

  if (onboarding === "pending") {
    return (
      <div className="tl-shell flex flex-col overflow-hidden bg-paper text-ink" />
    );
  }

  if (onboarding === "show") {
    return (
      <div className="tl-shell flex flex-col overflow-hidden text-ink">
        <Onboarding onFinished={() => setOnboarding("done")} />
      </div>
    );
  }

  return (
    <div className="tl-shell tl-view flex flex-col overflow-hidden text-ink">
      <div onClick={handleTopBarTap}>
        <TopBar />
      </div>
      {showDiag ? <DiagOverlay /> : null}

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
          <div className="pointer-events-none absolute inset-0 z-20 xl:hidden">
            <button
              type="button"
              className="tl-dim absolute inset-0"
              data-sheet="true"
              data-open={
                sheetState === "mid" || sheetState === "full" ? "true" : "false"
              }
              aria-label={t(locale, "closeReception")}
              tabIndex={
                sheetState === "mid" || sheetState === "full" ? 0 : -1
              }
              onClick={() => {
                /* BUG-8: tap outside dismisses — same exit path as ✕ */
                closeReception();
              }}
              style={{
                ["--dim-o" as string]:
                  sheetState === "mid" || sheetState === "full"
                    ? String(Math.max(0, 1 - Math.max(0, sheetDrag) / 420))
                    : "0",
              }}
            />
            <aside
              ref={sheetRef}
              className="tl-sheet-up absolute inset-x-0 bottom-0 flex w-full flex-col overflow-hidden border-t border-rule bg-surface shadow-soft md:mx-auto md:w-[min(40rem,100%)]"
              data-state={sheetState}
              data-dragging={sheetDragging ? "true" : "false"}
              style={{
                ["--sheet-drag" as string]: `${sheetDrag}px`,
              }}
            >
              <div className="flex min-h-0 flex-1 flex-col">
                <ReceptionPanel
                  chapter={shownChapter}
                  onClose={closeReception}
                  sheet
                  detent={
                    sheetState === "hidden" ? "peek" : sheetState
                  }
                />
              </div>
            </aside>
          </div>
        ) : null}

        {deskShown ? (
          <div className="pointer-events-none absolute inset-0 z-20 hidden xl:flex">
            <button
              type="button"
              className="tl-dim min-w-0 flex-1"
              data-sheet="true"
              data-open={deskOpen ? "true" : "false"}
              aria-label={t(locale, "closeReception")}
              tabIndex={deskOpen ? 0 : -1}
              onClick={closeReception}
            />
            <aside
              className="tl-sheet flex h-full w-full max-w-md flex-col border-l border-rule bg-paper shadow-soft"
              data-open={deskOpen ? "true" : "false"}
              aria-hidden={!deskOpen}
              inert={!deskOpen ? true : undefined}
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

      {sourcesShown ? (
        <SourcesPage
          onClose={() => setSourcesPageOpen(false)}
          animOpen={sourcesAnimOpen}
        />
      ) : null}

      <QuickJumpModal />
    </div>
  );
}
