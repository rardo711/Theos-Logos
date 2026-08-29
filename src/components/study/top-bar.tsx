import { BookOpen, ChevronDown, Type } from "lucide-react";
import { getBook } from "@/lib/bible/books";
import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";
import { TypeMenu } from "./type-menu";
import { Wordmark } from "./wordmark";

export function TopBar() {
  const bookId = useStudy((s) => s.bookId);
  const chapterNum = useStudy((s) => s.chapter);
  const setLibraryOpen = useStudy((s) => s.setLibraryOpen);
  const typeOpen = useStudy((s) => s.typeOpen);
  const setTypeOpen = useStudy((s) => s.setTypeOpen);
  const book = getBook(bookId);

  return (
    <header className="relative z-30 shrink-0 border-b border-rule bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-oxblood"
      />
      <div className="grid h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 px-2 sm:px-4">
        <Wordmark compact />

        <button
          type="button"
          onClick={() => setLibraryOpen(true, "chapters")}
          className="flex min-h-11 max-w-[48vw] items-center gap-1 rounded-md px-2 hover:bg-paper sm:px-3"
          aria-label={`Open library, ${book.name} ${chapterNum}`}
        >
          <span className="font-display truncate text-[15px] font-semibold tracking-tight text-ink sm:text-base">
            {book.name}
          </span>
          <span className="font-serif text-[15px] font-medium text-oxblood tabular-nums sm:text-base">
            {chapterNum}
          </span>
          <ChevronDown
            size={14}
            strokeWidth={2}
            className="mt-px shrink-0 text-faint"
          />
        </button>

        <div className="relative flex items-center justify-end">
          <div className="flex items-center rounded-md bg-paper p-0.5 shadow-border">
            <button
              type="button"
              onClick={() => setTypeOpen(!typeOpen)}
              className={cn(
                "flex size-10 items-center justify-center rounded-xs text-ink hover:bg-surface",
                typeOpen && "bg-surface",
              )}
              aria-label="Appearance"
              aria-expanded={typeOpen}
            >
              <Type size={16} strokeWidth={1.75} />
            </button>
            <span aria-hidden className="h-4 w-px bg-rule" />
            <button
              type="button"
              onClick={() => setLibraryOpen(true, "books")}
              className="flex size-10 items-center justify-center rounded-xs text-ink hover:bg-surface"
              aria-label="Books"
            >
              <BookOpen size={16} strokeWidth={1.75} />
            </button>
          </div>
          <TypeMenu />
        </div>
      </div>
    </header>
  );
}
