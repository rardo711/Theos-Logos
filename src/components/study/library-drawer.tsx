import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import {
  BIBLE_BOOKS,
  CORPUS,
  bookMatches,
  corpusOf,
  getBook,
  parseReference,
} from "@/lib/bible/books";
import { markedVerses, bookHasNotes } from "@/lib/reception/notes";
import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";

export function LibraryDrawer() {
  const open = useStudy((s) => s.libraryOpen);
  const tab = useStudy((s) => s.libraryTab);
  const setOpen = useStudy((s) => s.setLibraryOpen);
  const bookId = useStudy((s) => s.bookId);
  const chapter = useStudy((s) => s.chapter);
  const setBook = useStudy((s) => s.setBook);
  const setChapter = useStudy((s) => s.setChapter);
  const notesRev = useStudy((s) => s.notesRev);
  const [query, setQuery] = useState("");
  const [picking, setPicking] = useState<"chapters" | "books">(tab);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setPicking(tab);
    setQuery("");
  }, [open, tab]);

  useEffect(() => {
    if (open && tab === "books") {
      const id = window.setTimeout(() => searchRef.current?.focus(), 40);
      return () => window.clearTimeout(id);
    }
  }, [open, tab]);

  const current = getBook(bookId);
  const corpus = corpusOf(bookId);
  const q = query.trim();
  const searching = q.length > 0;
  const view = searching ? "books" : picking;
  const parsed = searching ? parseReference(q) : null;
  const notes = useMemo(
    () => markedVerses(current.id, chapter),
    [current.id, chapter, notesRev],
  );

  const sections = useMemo(() => {
    return CORPUS.map((c) => ({
      ...c,
      books: BIBLE_BOOKS.filter((b) => {
        if (!c.bookIds.includes(b.id)) return false;
        if (parsed?.chapter != null) return b.id === parsed.book.id;
        return bookMatches(b, q);
      }),
    })).filter((c) => c.books.length > 0);
  }, [q, parsed]);

  if (!open) return null;

  function goTo(id: string, ch?: number) {
    setBook(id, ch ?? (id === bookId ? chapter : 1));
    if (ch != null) {
      setChapter(ch);
      setOpen(false);
      return;
    }
    setPicking("chapters");
    setQuery("");
  }

  function onSearchKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const hit = parseReference(query);
    if (!hit) return;
    e.preventDefault();
    goTo(hit.book.id, hit.chapter);
  }

  function jumpCorpus(key: string) {
    setQuery("");
    setPicking("books");
    requestAnimationFrame(() => {
      listRef.current
        ?.querySelector(`[data-corpus="${key}"]`)
        ?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        className="tl-dim absolute inset-0"
        aria-label="Close library"
        onClick={() => setOpen(false)}
      />
      <aside className="tl-drawer relative z-10 flex h-full w-full max-w-md flex-col overflow-hidden bg-paper shadow-soft sm:border-r sm:border-rule">
        <header className="border-b border-rule bg-surface px-4 pt-3 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-2xs font-semibold tracking-[0.18em] text-faint uppercase">
                Contents
              </p>
              <p className="font-display mt-1 text-xl leading-none font-semibold text-ink">
                {current.name}{" "}
                <span className="text-oxblood tabular-nums">{chapter}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex size-11 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-ink"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <label className="relative mt-3 block">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint"
            />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim()) setPicking("books");
              }}
              onKeyDown={onSearchKey}
              placeholder="John, Romans, Ps 119…"
              className="w-full rounded-md border border-rule bg-paper py-2.5 pr-3 pl-9 text-base text-ink outline-none placeholder:text-faint focus:border-oxblood"
            />
          </label>
          {parsed?.chapter != null ? (
            <p className="mt-2 text-2xs text-muted">
              Press return for {parsed.book.name} {parsed.chapter}
            </p>
          ) : null}
        </header>

        <div className="flex border-b border-rule px-4">
          {(
            [
              ["chapters", "This book"],
              ["books", "The canon"],
            ] as const
          ).map(([id, label]) => {
            const on = view === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setQuery("");
                  setPicking(id);
                }}
                className={cn(
                  "relative min-h-11 px-3 text-sm font-medium",
                  on ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {label}
                {on ? (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 bg-oxblood" />
                ) : null}
              </button>
            );
          })}
        </div>

        {view === "chapters" ? (
          <div className="tl-scroll min-h-0 flex-1 overflow-y-auto p-4">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <p className="text-sm text-muted">
                {current.chapters} chapters
                {corpus ? ` · ${corpus.name}` : ""}
                {notes.length
                  ? ` · ${notes.length} with notes in ch. ${chapter}`
                  : ""}
              </p>
              <button
                type="button"
                onClick={() => setPicking("books")}
                className="text-sm text-oxblood hover:underline"
              >
                Another book
              </button>
            </div>
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(2.75rem, 1fr))",
              }}
            >
              {Array.from({ length: current.chapters }, (_, i) => i + 1).map(
                (n) => {
                  const active = n === chapter;
                  const noted = notes.includes(n);
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setChapter(n);
                        setOpen(false);
                      }}
                      className={cn(
                        "relative flex min-h-11 items-center justify-center rounded-sm text-sm font-semibold tabular-nums",
                        active
                          ? "bg-oxblood text-oxblood-fg"
                          : "text-ink hover:bg-surface",
                      )}
                    >
                      {n}
                      {noted && !active ? (
                        <span className="absolute top-1.5 right-1.5 size-1 rounded-full bg-oxblood" />
                      ) : null}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            {!searching ? (
              <nav className="border-b border-rule px-3 py-1.5">
                <div className="flex flex-wrap gap-x-0.5 gap-y-0.5">
                  {CORPUS.map((c) => {
                    const on = corpus?.key === c.key;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => jumpCorpus(c.key)}
                        className={cn(
                          "min-h-10 rounded-sm px-2 text-2xs tracking-[0.12em] uppercase",
                          on
                            ? "bg-oxblood-soft font-semibold text-oxblood"
                            : "text-muted hover:text-oxblood",
                        )}
                      >
                        {c.short}
                      </button>
                    );
                  })}
                </div>
              </nav>
            ) : null}

            <div
              ref={listRef}
              className="tl-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-[max(2.5rem,env(safe-area-inset-bottom))]"
            >
              {sections.length === 0 ? (
                <p className="px-3 py-10 text-center font-serif text-muted italic">
                  No book matches “{q}”.
                </p>
              ) : (
                sections.map((section) => (
                  <section
                    key={section.key}
                    data-corpus={section.key}
                    className="scroll-mt-2 px-2 pt-4"
                  >
                    <h3 className="mb-1 flex items-baseline justify-between border-b border-rule px-1 pb-1 text-2xs font-semibold tracking-[0.16em] text-oxblood uppercase">
                      <span>{section.name}</span>
                      <span className="font-serif font-normal text-faint tracking-normal normal-case">
                        {section.books.length}
                      </span>
                    </h3>
                    <ul>
                      {section.books.map((b) => {
                        const active = b.id === bookId;
                        const hinted = parsed?.book.id === b.id;
                        const noted = bookHasNotes(b.id);
                        return (
                          <li key={b.id}>
                            <button
                              type="button"
                              onClick={() =>
                                goTo(b.id, hinted ? parsed?.chapter : undefined)
                              }
                              className={cn(
                                "flex min-h-11 w-full items-baseline justify-between gap-3 rounded-sm px-2 text-left",
                                active || hinted
                                  ? "bg-oxblood-soft"
                                  : "hover:bg-surface",
                              )}
                            >
                              <span
                                className={cn(
                                  "flex min-w-0 items-center gap-2 font-serif text-base",
                                  active || hinted
                                    ? "font-semibold text-oxblood"
                                    : "text-ink",
                                )}
                              >
                                <span className="truncate">{b.name}</span>
                                {noted ? (
                                  <span
                                    className="size-1.5 shrink-0 rounded-full bg-oxblood"
                                    title="Desk notes in this book"
                                  />
                                ) : null}
                              </span>
                              <span className="shrink-0 font-serif text-xs text-faint tabular-nums">
                                {hinted && parsed?.chapter
                                  ? parsed.chapter
                                  : b.chapters}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
