import { useEffect, useState } from "react";
import { fetchChapter } from "@/lib/bible/fetch-chapter";
import { getSeed } from "@/lib/bible/seed";
import type { Chapter } from "@/lib/bible/types";
import { hasNotes } from "@/lib/reception/notes";
import { useStudy } from "@/lib/study-store";
import { LibraryDrawer } from "./library-drawer";
import { Reader } from "./reader";
import { ReceptionPanel, VerseHint } from "./reception-panel";
import { TopBar } from "./top-bar";

export function StudyWorkspace() {
  const hydrate = useStudy((s) => s.hydrate);
  const bookId = useStudy((s) => s.bookId);
  const chapterNum = useStudy((s) => s.chapter);
  const fontSize = useStudy((s) => s.fontSize);
  const setLibraryOpen = useStudy((s) => s.setLibraryOpen);
  const setTypeOpen = useStudy((s) => s.setTypeOpen);
  const receptionOpen = useStudy((s) => s.receptionOpen);
  const setReceptionOpen = useStudy((s) => s.setReceptionOpen);
  const setVerse = useStudy((s) => s.setVerse);
  const selectedVerse = useStudy((s) => s.selectedVerse);
  const notesRev = useStudy((s) => s.notesRev);

  const [chapter, setChapter] = useState<Chapter | null>(() =>
    getSeed("JHN", 1),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    hydrate();
    setHydrated(true);
  }, [hydrate]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--reading-size",
      `${fontSize}px`,
    );
  }, [fontSize]);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    const seed = getSeed(bookId, chapterNum);
    if (seed) {
      setChapter(seed);
      setError(null);
      setLoading(false);
      return;
    }
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
        if (!cancelled) {
          setChapter(null);
          setError(
            err instanceof Error ? err.message : "Could not load this chapter.",
          );
        }
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
        setReceptionOpen(false);
        setVerse(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setLibraryOpen, setTypeOpen, setReceptionOpen, setVerse]);

  const verseHasNotes =
    notesRev >= 0 &&
    chapter != null &&
    selectedVerse != null &&
    hasNotes(chapter.bookId, chapter.chapter, selectedVerse);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-paper text-ink">
      <TopBar />

      <div className="relative flex min-h-0 flex-1">
        <section className="relative min-w-0 flex-1">
          <Reader chapter={chapter} loading={loading} error={error} />
          <VerseHint
            noted={verseHasNotes}
            onInquire={() => {
              if (selectedVerse != null) setReceptionOpen(true);
            }}
          />
        </section>

        <aside className="hidden min-w-0 border-l border-rule lg:block lg:w-96 xl:w-lg">
          <ReceptionPanel chapter={chapter} />
        </aside>

        {receptionOpen ? (
          <div className="absolute inset-0 z-20 flex flex-col lg:hidden">
            <div className="h-[34%] min-h-32 overflow-hidden border-b border-rule bg-paper">
              <Reader chapter={chapter} loading={false} error={null} />
            </div>
            <div className="min-h-0 flex-1 bg-paper">
              <ReceptionPanel
                chapter={chapter}
                onClose={() => setReceptionOpen(false)}
              />
            </div>
          </div>
        ) : null}
      </div>

      <LibraryDrawer />
    </div>
  );
}
