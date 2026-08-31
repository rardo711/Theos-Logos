import { useEffect, useState } from "react";
import { fetchChapter } from "@/lib/bible/fetch-chapter";
import { getSeed } from "@/lib/bible/seed";
import type { Chapter } from "@/lib/bible/types";
import { initPwa } from "@/lib/pwa";
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

export function StudyWorkspace() {
  const hydrate = useStudy((s) => s.hydrate);
  const bookId = useStudy((s) => s.bookId);
  const chapterNum = useStudy((s) => s.chapter);
  const fontSize = useStudy((s) => s.fontSize);
  const setLibraryOpen = useStudy((s) => s.setLibraryOpen);
  const setTypeOpen = useStudy((s) => s.setTypeOpen);
  const receptionOpen = useStudy((s) => s.receptionOpen);
  const setReceptionOpen = useStudy((s) => s.setReceptionOpen);
  const receptionPinned = useStudy((s) => s.receptionPinned);
  const setReceptionPinned = useStudy((s) => s.setReceptionPinned);
  const setVerse = useStudy((s) => s.setVerse);
  const selectedVerse = useStudy((s) => s.selectedVerse);
  const notesRev = useStudy((s) => s.notesRev);

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [wideDesk, setWideDesk] = useState(false);

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

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchChapter({ data: { bookId, chapter: chapterNum } })
      .then((data) => {
        if (!cancelled) {
          setChapter(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const fallback = getSeed(bookId, chapterNum);
        if (fallback) {
          setChapter(fallback);
          setError(null);
          return;
        }
        setChapter(null);
        setError(
          err instanceof Error ? err.message : "Could not load this chapter.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated, bookId, chapterNum]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "ArrowRight") useStudy.getState().nextChapter();
      if (e.key === "ArrowLeft") useStudy.getState().prevChapter();
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
    setLibraryOpen,
    setTypeOpen,
    setReceptionOpen,
    setReceptionPinned,
    setVerse,
  ]);

  const verseHasNotes =
    notesRev >= 0 &&
    chapter != null &&
    selectedVerse != null &&
    hasNotes(chapter.bookId, chapter.chapter, selectedVerse);

  function closeReception() {
    setReceptionPinned(false);
    setReceptionOpen(false);
  }

  const docked = receptionPinned && wideDesk && receptionOpen;
  const waitingOnFetch =
    loading &&
    (chapter == null ||
      chapter.bookId !== bookId ||
      chapter.chapter !== chapterNum);

  return (
    <div className="tl-shell flex flex-col overflow-hidden bg-paper text-ink">
      <TopBar />

      <div className="relative flex min-h-0 flex-1">
        <section className="relative min-h-0 min-w-0 flex-1">
          <Reader
            chapter={waitingOnFetch ? null : chapter}
            loading={loading}
            error={error}
          />
          <VerseHint
            noted={verseHasNotes}
            onInquire={() => {
              if (selectedVerse != null) setReceptionOpen(true);
            }}
          />
        </section>

        {docked ? (
          <aside className="flex min-h-0 w-96 min-w-0 shrink-0 border-l border-rule xl:w-[26rem]">
            <ReceptionPanel chapter={chapter} onClose={closeReception} />
          </aside>
        ) : null}

        {receptionOpen && !docked ? (
          <>
            <div className="absolute inset-0 z-20 flex flex-col md:hidden">
              <div className="relative h-[34%] min-h-32 overflow-hidden border-b border-rule bg-paper">
                <Reader chapter={chapter} loading={false} error={null} />
              </div>
              <div className="relative min-h-0 flex-1 bg-paper">
                <ReceptionPanel chapter={chapter} onClose={closeReception} />
              </div>
            </div>

            <div className="absolute inset-0 z-20 hidden md:flex">
              <button
                type="button"
                className="tl-dim min-w-0 flex-1"
                aria-label="Close reception"
                onClick={closeReception}
              />
              <aside className="tl-sheet flex h-full w-full max-w-md flex-col border-l border-rule bg-paper shadow-soft">
                <ReceptionPanel chapter={chapter} onClose={closeReception} />
              </aside>
            </div>
          </>
        ) : null}
      </div>

      <LibraryDrawer />
    </div>
  );
}
