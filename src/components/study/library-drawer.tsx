import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Loader2, Search, X } from "lucide-react";
import {
  BIBLE_BOOKS,
  CORPUS,
  bookMatches,
  bookName,
  corpusOf,
  getBook,
  parseReference,
} from "@/lib/bible/books";
import { searchScripture } from "@/lib/bible/find";
import type { ScriptureHit } from "@/lib/bible/search";
import { markedVerses, bookHasNotes } from "@/lib/reception/notes";
import { corpusLabel, t } from "@/lib/i18n";
import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";
import { useSlidingPill } from "./sliding-pill";

function highlightMatch(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="tl-search-mark">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function LibraryDrawer() {
  const open = useStudy((s) => s.libraryOpen);
  const tab = useStudy((s) => s.libraryTab);
  const setOpen = useStudy((s) => s.setLibraryOpen);
  const bookId = useStudy((s) => s.bookId);
  const chapter = useStudy((s) => s.chapter);
  const setBook = useStudy((s) => s.setBook);
  const setChapter = useStudy((s) => s.setChapter);
  const jumpTo = useStudy((s) => s.jumpTo);
  const notesRev = useStudy((s) => s.notesRev);
  const locale = useStudy((s) => s.locale);
  const [query, setQuery] = useState("");
  const [picking, setPicking] = useState<"chapters" | "books">(tab);
  const [hits, setHits] = useState<ScriptureHit[]>([]);
  const [searchingText, setSearchingText] = useState(false);
  const [paneMotion, setPaneMotion] = useState(false);
  const [canonEnter, setCanonEnter] = useState(false);
  const readingCorpus = corpusOf(bookId)?.key ?? CORPUS[0].key;
  const [browseCorpus, setBrowseCorpus] = useState(readingCorpus);
  const listRef = useRef<HTMLDivElement>(null);
  const chapterScrollRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const corpusRailRef = useRef<HTMLDivElement>(null);
  const lockBrowse = useRef(false);

  useLayoutEffect(() => {
    if (!open) {
      setPaneMotion(false);
      setCanonEnter(false);
      searchRef.current?.blur();
      return;
    }
    setPicking(tab);
    setQuery("");
    setHits([]);
    setSearchingText(false);
    setBrowseCorpus(corpusOf(useStudy.getState().bookId)?.key ?? CORPUS[0].key);
    const id = requestAnimationFrame(() => setPaneMotion(true));
    return () => cancelAnimationFrame(id);
  }, [open, tab]);

  const current = getBook(bookId);
  const q = query.trim();
  const searching = q.length > 0;
  const view = searching ? "books" : picking;
  const parsed = searching ? parseReference(q) : null;
  const notes = useMemo(
    () => markedVerses(current.id, chapter),
    [current.id, chapter, notesRev],
  );
  const [tabBarRef, tabInk] = useSlidingPill(view);
  const [railBarRef, railInk] = useSlidingPill(browseCorpus, open && view === "books");

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

  useEffect(() => {
    if (!open || view !== "books" || searching) {
      setCanonEnter(false);
      return;
    }
    const id = requestAnimationFrame(() => setCanonEnter(true));
    return () => cancelAnimationFrame(id);
  }, [open, view, searching]);

  useEffect(() => {
    if (!open || view !== "chapters") return;
    const id = requestAnimationFrame(() => {
      chapterScrollRef.current
        ?.querySelector('[data-active-chapter="true"]')
        ?.scrollIntoView({ block: "center", behavior: "auto" });
    });
    return () => cancelAnimationFrame(id);
  }, [open, view, chapter, bookId]);

  useEffect(() => {
    if (!open || view !== "books" || searching) return;
    lockBrowse.current = true;
    const id = requestAnimationFrame(() => {
      listRef.current
        ?.querySelector('[data-active-book="true"]')
        ?.scrollIntoView({ block: "center", behavior: "auto" });
      corpusRailRef.current
        ?.querySelector("[data-active='true']")
        ?.scrollIntoView({
          inline: "center",
          block: "nearest",
          behavior: "auto",
        });
      lockBrowse.current = false;
    });
    return () => cancelAnimationFrame(id);
  }, [open, view, bookId, searching]);

  useEffect(() => {
    if (!open || view !== "books" || searching) return;
    const root = listRef.current;
    if (!root) return;

    const observed = [
      ...root.querySelectorAll<HTMLElement>("[data-corpus]"),
    ];
    if (!observed.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (lockBrowse.current) return;
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const key = hit?.target.getAttribute("data-corpus");
        if (key) setBrowseCorpus(key);
      },
      { root, rootMargin: "-12% 0px -62% 0px", threshold: [0, 0.2, 0.6] },
    );
    observed.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [open, view, searching, sections.length]);

  useEffect(() => {
    if (!open || view !== "books" || searching) return;
    const chip = corpusRailRef.current?.querySelector<HTMLElement>(
      "[data-active='true']",
    );
    chip?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [browseCorpus, open, view, searching]);

  useEffect(() => {
    if (!open) return;
    const term = q;
    if (term.length < 3 || parsed?.chapter != null) {
      setHits([]);
      setSearchingText(false);
      return;
    }
    let cancelled = false;
    setSearchingText(true);
    const timer = window.setTimeout(() => {
      void searchScripture({ data: { q: term, locale } })
        .then((rows) => {
          if (!cancelled) setHits(rows);
        })
        .catch(() => {
          if (!cancelled) setHits([]);
        })
        .finally(() => {
          if (!cancelled) setSearchingText(false);
        });
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, q, locale, parsed?.chapter]);

  function goTo(id: string, ch?: number, verse?: number) {
    if (ch != null) {
      jumpTo(id, ch, verse);
      setOpen(false);
      return;
    }
    setBook(id, id === bookId ? chapter : 1);
    setPicking("chapters");
    setQuery("");
    setHits([]);
  }

  function onSearchKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const hit = parseReference(query);
    if (!hit) return;
    e.preventDefault();
    goTo(hit.book.id, hit.chapter, hit.verse);
  }

  function jumpCorpus(key: string) {
    setQuery("");
    setPicking("books");
    setBrowseCorpus(key);
    lockBrowse.current = true;
    window.setTimeout(() => {
      lockBrowse.current = false;
    }, 520);
    requestAnimationFrame(() => {
      listRef.current
        ?.querySelector(`[data-corpus="${key}"]`)
        ?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }

  const headline =
    view === "books" && !searching
      ? corpusLabel(locale, browseCorpus, "name")
      : bookName(current, locale);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex overflow-hidden",
        !open && "pointer-events-none",
      )}
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <button
        className="tl-dim absolute inset-0"
        data-open={open ? "true" : "false"}
        tabIndex={open ? 0 : -1}
        aria-label={t(locale, "closeLibrary")}
        onClick={() => setOpen(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t(locale, "contents")}
        data-open={open ? "true" : "false"}
        className="tl-drawer relative z-10 flex h-full w-full max-w-md flex-col bg-paper shadow-soft sm:border-r sm:border-rule"
      >
        <header className="border-b border-rule bg-surface px-4 pt-3 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-2xs font-semibold tracking-[0.18em] text-faint uppercase">
                {view === "books" && !searching
                  ? t(locale, "theCanon")
                  : t(locale, "contents")}
              </p>
              <p
                key={view === "books" && !searching ? "canon" : "book"}
                className="tl-title-swap font-display mt-1 truncate text-xl leading-none font-semibold text-ink"
              >
                {view === "books" && !searching ? (
                  headline
                ) : (
                  <>
                    {headline}{" "}
                    <span className="text-lamp tabular-nums">{chapter}</span>
                  </>
                )}
              </p>
              {view === "books" && !searching ? (
                <p className="mt-1.5 text-2xs text-faint">
                  {t(locale, "readingNow", {
                    book: bookName(current, locale),
                    n: chapter,
                  })}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex size-11 items-center justify-center rounded-md text-muted transition-[background-color,color,transform] duration-150 ease-out hover:bg-paper hover:text-ink active:scale-[0.96]"
              aria-label={t(locale, "close")}
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
              placeholder={t(locale, "searchBooks")}
              inputMode="search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full rounded-md border border-rule bg-paper py-2.5 pr-10 pl-9 text-base text-ink outline-none placeholder:text-faint transition-[border-color,box-shadow] duration-150 ease-out focus:border-lamp focus:shadow-[0_0_0_3px_var(--color-lamp-soft)]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setHits([]);
                }}
                className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-xs text-faint transition-[color,transform] duration-150 ease-out hover:text-ink active:scale-[0.96]"
                aria-label={t(locale, "clearSearch")}
              >
                <X size={14} />
              </button>
            ) : null}
          </label>
          {parsed?.chapter != null ? (
            <p className="mt-2 text-2xs text-muted">
              {t(locale, "pressReturn", {
                book: bookName(parsed.book, locale),
                n: parsed.verse
                  ? `${parsed.chapter}:${parsed.verse}`
                  : parsed.chapter,
              })}
            </p>
          ) : null}
        </header>

        <div ref={tabBarRef} className="relative flex border-b border-rule px-4">
          {(
            [
              ["chapters", t(locale, "thisBook")],
              ["books", t(locale, "theCanon")],
            ] as const
          ).map(([id, label]) => {
            const on = view === id;
            return (
              <button
                key={id}
                type="button"
                data-active={on ? "true" : undefined}
                onClick={() => {
                  setQuery("");
                  setHits([]);
                  setPicking(id);
                }}
                className={cn(
                  "relative min-h-11 px-3 text-sm font-medium transition-colors duration-150 ease-out",
                  on ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {label}
              </button>
            );
          })}
          <span
            className="tl-pill-ink"
            data-ready={tabInk.ready ? "true" : "false"}
            style={{
              width: Math.max(0, tabInk.w - 16),
              transform: `translateX(${tabInk.x + 8}px)`,
            }}
          />
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div
            className="tl-pane-track"
            data-motion={paneMotion ? "true" : "false"}
            style={{
              transform:
                view === "chapters" ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <div
              className="tl-pane"
              aria-hidden={view !== "chapters"}
              inert={view !== "chapters" ? true : undefined}
            >
              <div
                ref={chapterScrollRef}
                className="tl-scroll h-full overflow-y-auto p-4"
              >
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <p className="text-sm text-muted">
                    {readingCorpus
                      ? t(locale, "chapterMetaCorpus", {
                          n: current.chapters,
                          corpus: corpusLabel(locale, readingCorpus, "name"),
                        })
                      : t(locale, "chapterMeta", { n: current.chapters })}
                    {notes.length
                      ? t(locale, "chapterMetaNotes", {
                          count: notes.length,
                          chapter,
                        })
                      : ""}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPicking("books")}
                    className="text-sm text-lamp transition-opacity duration-150 hover:opacity-80"
                  >
                    {t(locale, "anotherBook")}
                  </button>
                </div>
                <div
                  className="grid gap-1.5"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(2.75rem, 1fr))",
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
                          data-active-chapter={active ? "true" : undefined}
                          onClick={() => {
                            setChapter(n);
                            setOpen(false);
                          }}
                          className={cn(
                            "relative flex min-h-11 items-center justify-center rounded-sm text-sm font-semibold tabular-nums transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.96]",
                            active
                              ? "text-lamp shadow-[inset_0_-2px_0_0_var(--color-lamp)]"
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
            </div>

            <div
              className="tl-pane flex flex-col"
              data-enter={canonEnter ? "true" : "false"}
              aria-hidden={view !== "books"}
              inert={view !== "books" ? true : undefined}
            >
              {!searching ? (
                <nav className="tl-rail-wrap border-b border-rule">
                  <div
                    ref={corpusRailRef}
                    className="tl-rail px-2 py-1"
                    aria-label={t(locale, "theCanon")}
                  >
                    <div ref={railBarRef} className="tl-rail-inner">
                      {CORPUS.map((c) => {
                        const on = browseCorpus === c.key;
                        return (
                          <button
                            key={c.key}
                            type="button"
                            data-corpus-chip={c.key}
                            data-active={on ? "true" : undefined}
                            onClick={() => jumpCorpus(c.key)}
                            className={cn(
                              "relative z-10 min-h-10 shrink-0 snap-start rounded-sm px-2.5 text-2xs tracking-[0.12em] uppercase transition-[color,transform] duration-150 ease-out active:scale-[0.96]",
                              on
                                ? "font-semibold text-lamp"
                                : "text-muted hover:text-lamp",
                            )}
                          >
                            {corpusLabel(locale, c.key, "short")}
                          </button>
                        );
                      })}
                      <span
                        className="tl-rail-ink"
                        data-ready={railInk.ready ? "true" : "false"}
                        style={{
                          width: railInk.w,
                          transform: `translateX(${railInk.x}px)`,
                        }}
                      />
                    </div>
                  </div>
                </nav>
              ) : null}

              <div
                ref={listRef}
                className="tl-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-[max(2.5rem,env(safe-area-inset-bottom))]"
              >
                {hits.length > 0 || searchingText ? (
                  <section className="scroll-mt-2 px-2 pt-4">
                    <h3 className="mb-1 flex items-baseline justify-between border-b border-rule px-1 pb-1 text-2xs font-semibold tracking-[0.16em] text-lamp uppercase">
                      <span>{t(locale, "verseHits")}</span>
                      <span className="font-serif font-normal tracking-normal text-faint normal-case">
                        {searchingText ? (
                          <Loader2 size={12} className="inline animate-spin" />
                        ) : (
                          hits.length
                        )}
                      </span>
                    </h3>
                    {searchingText && hits.length === 0 ? (
                      <p className="px-1 py-3 text-sm text-muted italic">
                        {t(locale, "searchingText")}
                      </p>
                    ) : (
                      <ul>
                        {hits.map((hit) => (
                          <li
                            key={`${hit.bookId}-${hit.chapter}-${hit.verse}-${hit.text.slice(0, 12)}`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                goTo(hit.bookId, hit.chapter, hit.verse)
                              }
                              className="flex min-h-11 w-full flex-col items-start gap-0.5 rounded-sm px-2 py-2 text-left transition-[background-color,transform] duration-150 ease-out hover:bg-surface active:scale-[0.99]"
                            >
                              <span className="text-2xs font-semibold tracking-wide text-lamp uppercase">
                                {hit.bookName} {hit.chapter}:{hit.verse}
                              </span>
                              <span className="font-serif text-sm leading-snug text-ink">
                                {highlightMatch(hit.text, q)}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ) : null}

                {sections.length === 0 && !searchingText && hits.length === 0 ? (
                  <p className="px-3 py-10 text-center font-serif text-muted italic">
                    {q.length >= 3
                      ? t(locale, "noVerseHits", { q })
                      : t(locale, "noBook", { q })}
                  </p>
                ) : (
                  sections.map((section) => {
                    const live = section.key === browseCorpus;
                    return (
                      <section
                        key={section.key}
                        data-corpus={section.key}
                        className="tl-canon-section scroll-mt-3 px-2 pt-4"
                      >
                        <h3
                          className={cn(
                            "mb-1 flex items-baseline justify-between border-b px-1 pb-1 text-2xs font-semibold tracking-[0.16em] uppercase transition-[color,border-color] duration-200 ease-out",
                            live
                              ? "border-lamp text-lamp"
                              : "border-rule text-faint",
                          )}
                        >
                          <span>{corpusLabel(locale, section.key, "name")}</span>
                          <span className="font-serif font-normal tracking-normal text-faint normal-case">
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
                                  data-active-book={active ? "true" : undefined}
                                  onClick={() =>
                                    goTo(
                                      b.id,
                                      hinted ? parsed?.chapter : undefined,
                                      hinted ? parsed?.verse : undefined,
                                    )
                                  }
                                  className={cn(
                                    "flex min-h-11 w-full items-baseline justify-between gap-3 rounded-sm px-2 text-left transition-[background-color,transform] duration-150 ease-out active:scale-[0.99]",
                                    active || hinted
                                      ? "bg-lamp-soft"
                                      : "hover:bg-surface",
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "flex min-w-0 items-center gap-2 font-serif text-base",
                                      active || hinted
                                        ? "font-semibold text-lamp"
                                        : "text-ink",
                                    )}
                                  >
                                    <span className="truncate">
                                      {bookName(b, locale)}
                                    </span>
                                    {noted ? (
                                      <span
                                        className="size-1.5 shrink-0 rounded-full bg-oxblood"
                                        title={t(locale, "notesInBook")}
                                      />
                                    ) : null}
                                  </span>
                                  <span className="shrink-0 font-serif text-xs text-faint tabular-nums">
                                    {hinted && parsed?.chapter
                                      ? parsed.verse
                                        ? `${parsed.chapter}:${parsed.verse}`
                                        : parsed.chapter
                                      : b.chapters}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
