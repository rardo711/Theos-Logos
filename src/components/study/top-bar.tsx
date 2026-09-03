import { BookOpen, ChevronDown } from "lucide-react";
import { bookName, getBook } from "@/lib/bible/books";
import { t } from "@/lib/i18n";
import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";
import { TypeMenu } from "./type-menu";
import { Wordmark } from "./wordmark";

export function TopBar() {
  const bookId = useStudy((s) => s.bookId);
  const chapterNum = useStudy((s) => s.chapter);
  const libraryOpen = useStudy((s) => s.libraryOpen);
  const setLibraryOpen = useStudy((s) => s.setLibraryOpen);
  const typeOpen = useStudy((s) => s.typeOpen);
  const setTypeOpen = useStudy((s) => s.setTypeOpen);
  const locale = useStudy((s) => s.locale);
  const book = getBook(bookId);
  const title = bookName(book, locale);

  return (
    <header className="relative z-30 shrink-0 border-b border-rule bg-surface pt-[env(safe-area-inset-top)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-oxblood"
      />
      <div className="grid h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 px-2 sm:px-4">
        <div className="relative flex items-center justify-start">
          <button
            type="button"
            onClick={() => setTypeOpen(!typeOpen)}
            className="flex min-h-11 max-w-full items-center rounded-md px-1 transition-[background-color] duration-150 ease-out hover:bg-paper sm:px-1.5"
            aria-label={t(locale, "appearance")}
            aria-expanded={typeOpen}
            aria-haspopup="dialog"
          >
            <Wordmark compact active={typeOpen} />
          </button>
          <TypeMenu />
        </div>

        <button
          type="button"
          onClick={() => setLibraryOpen(true, "chapters")}
          className="flex min-h-11 max-w-[48vw] items-center gap-1 rounded-md px-2 transition-[background-color] duration-150 ease-out hover:bg-paper sm:px-3"
          aria-label={t(locale, "openLibrary", { book: title, chapter: chapterNum })}
          aria-expanded={libraryOpen}
          aria-haspopup="dialog"
        >
          <span className="font-display truncate text-[15px] font-semibold tracking-tight text-ink sm:text-base">
            {title}
          </span>
          <span className="font-serif text-[15px] font-medium text-oxblood tabular-nums sm:text-base">
            {chapterNum}
          </span>
          <ChevronDown
            size={14}
            strokeWidth={2}
            className={cn(
              "mt-px shrink-0 text-faint transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
              libraryOpen && "rotate-180",
            )}
          />
        </button>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setLibraryOpen(true, "books")}
            className="flex size-11 items-center justify-center rounded-md text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-paper active:scale-[0.96]"
            aria-label={t(locale, "books")}
            aria-expanded={libraryOpen}
          >
            <BookOpen size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
}
