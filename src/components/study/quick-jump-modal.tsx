import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, BookOpen, ScrollText, Search, X } from "lucide-react";
import { parseReference, bookName, getBook } from "@/lib/bible/books";
import { searchScripture } from "@/lib/bible/find";
import type { ScriptureHit } from "@/lib/bible/search";
import { useStudy } from "@/lib/study-store";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { formatReference } from "@/lib/bible/reference";
import { LampMark } from "./thinking-mark";

function highlightMatch(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Highlight the whole word containing the match: a prefix query like
  // "fait" lights up "faith" instead of leaving a dangling "fait"+"h".
  const regex = new RegExp(`([A-Za-zÀ-ÿ']*${escaped}[A-Za-zÀ-ÿ']*)`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="bg-lamp-soft text-lamp rounded-xs px-0.5 font-semibold">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function QuickJumpModal() {
  const open = useStudy((s) => s.quickJumpOpen);
  const setOpen = useStudy((s) => s.setQuickJumpOpen);
  const setSourcesPageOpen = useStudy((s) => s.setSourcesPageOpen);
  const jumpTo = useStudy((s) => s.jumpTo);
  const locale = useStudy((s) => s.locale);

  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<ScriptureHit[]>([]);
  const [loadingHits, setLoadingHits] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Exit choreography — when the store closes the modal, play the
  // tl-dialog-out animation before unmounting (180ms), instead of
  // vanishing mid-frame.
  const [renderOpen, setRenderOpen] = useState(open);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (open) {
      setRenderOpen(true);
      setClosing(false);
      return;
    }
    if (!renderOpen) return;
    setClosing(true);
    const t = window.setTimeout(() => {
      setRenderOpen(false);
      setClosing(false);
    }, 180);
    return () => window.clearTimeout(t);
  }, [open, renderOpen]);

  // Concordance tally — the hit count glides from the previous value
  // instead of snapping (and never restarts from zero mid-typing).
  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [tally, setTally] = useState(hits.length);
  const tallyRef = useRef(hits.length);
  useEffect(() => {
    const to = hits.length;
    if (reduceMotion) {
      tallyRef.current = to;
      setTally(to);
      return;
    }
    const from = tallyRef.current;
    if (from === to) return;
    let raf = 0;
    const start = performance.now();
    const duration = 400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const val = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      tallyRef.current = val;
      setTally(val);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hits.length, reduceMotion]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (!open) {
      setQuery("");
      setHits([]);
      setSelectedIndex(0);
      return;
    }
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [open]);

  // Handle global / modal Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  // Reference parsing
  const q = query.trim();
  const parsed = q ? parseReference(q) : null;

  // Debounced search for keywords
  useEffect(() => {
    if (!open) return;
    if (q.length < 3 || parsed?.chapter != null) {
      setHits([]);
      setLoadingHits(false);
      return;
    }
    let cancelled = false;
    setLoadingHits(true);
    const timer = window.setTimeout(() => {
      void searchScripture({ data: { q, locale } })
        .then((rows) => {
          if (!cancelled) {
            setHits(rows);
            setSelectedIndex(0);
          }
        })
        .catch(() => {
          if (!cancelled) setHits([]);
        })
        .finally(() => {
          if (!cancelled) setLoadingHits(false);
        });
    }, 320);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, q, locale, parsed?.chapter]);

  if (!renderOpen) return null;

  function handleSelectReference(bId: string, ch?: number, v?: number) {
    jumpTo(bId, ch ?? 1, v);
    setOpen(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (parsed) {
        handleSelectReference(parsed.book.id, parsed.chapter, parsed.verse);
      } else if (hits.length > 0 && hits[selectedIndex]) {
        const hit = hits[selectedIndex];
        handleSelectReference(hit.bookId, hit.chapter, hit.verse);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, hits.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
      return;
    }
  }

  const parsedLabel =
    parsed && parsed.chapter != null
      ? formatReference(bookName(parsed.book, locale), parsed.chapter, parsed.verse)
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-12 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={t(locale, "quickJump")}
    >
      {/* Dimmed backdrop */}
      <button
        type="button"
        className="tl-dim fixed inset-0"
        data-open="true"
        aria-label={t(locale, "close")}
        onClick={() => setOpen(false)}
      />

      {/* Dialog card */}
      <div
        data-closing={closing ? "true" : undefined}
        className="tl-dialog relative z-10 w-full max-w-xl rounded-xl border border-rule bg-paper shadow-2xl overflow-hidden"
      >
        {/* Input bar */}
        <div className="flex items-center border-b border-rule px-4 py-3 bg-surface">
          <Search size={18} className="text-faint shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t(locale, "quickJumpPlaceholder")}
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-base text-ink outline-none placeholder:text-faint font-sans"
          />
          {loadingHits ? (
            <LampMark className="ml-2 shrink-0" />
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setHits([]);
              }}
              className="flex size-7 items-center justify-center rounded-xs text-faint hover:text-ink transition-colors ml-2"
              aria-label={t(locale, "clearSearch")}
            >
              <X size={14} />
            </button>
          ) : null}
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-rule/40">
          {/* 1. Parsed Reference Match */}
          {parsed && parsedLabel ? (
            <button
              type="button"
              onClick={() =>
                handleSelectReference(
                  parsed.book.id,
                  parsed.chapter,
                  parsed.verse,
                )
              }
              className="w-full flex items-center justify-between p-3.5 rounded-lg bg-lamp-soft/50 hover:bg-lamp-soft text-left transition-colors group mb-1.5"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-md bg-paper border border-rule flex items-center justify-center text-lamp shadow-2xs">
                  <BookOpen size={16} />
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-ink group-hover:text-lamp transition-colors">
                    {t(locale, "jumpToReference", { reference: parsedLabel })}
                  </p>
                  <p className="text-xs text-muted">
                    {bookName(parsed.book, locale)}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-medium text-lamp bg-paper px-2 py-1 rounded-sm border border-rule/80">
                ↵ Enter
              </span>
            </button>
          ) : null}

          {/* 2. Text Search Hits */}
          {hits.length > 0 ? (
            <div className="pt-1.5 space-y-1">
              <p className="px-3 py-1 text-3xs font-semibold tracking-wider text-faint uppercase font-mono">
                {t(locale, "verseHits")} ({tally})
              </p>
              {hits.map((hit, idx) => (
                <button
                  key={`${hit.bookId}-${hit.chapter}-${hit.verse}`}
                  type="button"
                  onClick={() =>
                    handleSelectReference(hit.bookId, hit.chapter, hit.verse)
                  }
                  className={cn(
                    "tl-hit w-full text-left p-3 rounded-md transition-colors duration-100 flex flex-col gap-1",
                    idx === selectedIndex ? "bg-surface-raised" : "hover:bg-surface",
                  )}
                  style={{ animationDelay: `${Math.min(idx, 10) * 60}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-semibold text-ink">
                      {hit.bookName} {hit.chapter}:{hit.verse}
                    </span>
                  </div>
                  <p className="font-serif text-xs text-muted line-clamp-2 leading-relaxed">
                    {highlightMatch(hit.text, q)}
                  </p>
                </button>
              ))}
            </div>
          ) : null}

          {/* 3. Empty / Initial State: Quick Actions */}
          {!q ? (
            <div className="p-3 space-y-3">
              <p className="text-2xs font-semibold tracking-wider text-faint uppercase font-mono px-1">
                {t(locale, "theDesk")}
              </p>

              {/* Shortcut to Sources Page */}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setSourcesPageOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-rule bg-surface hover:bg-surface-raised transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-md bg-paper border border-rule flex items-center justify-center text-oxblood shadow-2xs">
                    <ScrollText size={16} />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-ink group-hover:text-oxblood transition-colors">
                      {t(locale, "sourcesOnDevice")}
                    </p>
                    <p className="text-xs text-muted">
                      {t(locale, "sourcesOnDeviceDesc")}
                    </p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-muted group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ) : null}

          {/* No results message */}
          {q && !parsed && hits.length === 0 && !loadingHits ? (
            <div className="py-8 text-center text-sm text-muted">
              {t(locale, "noVerseHits", { q })}
            </div>
          ) : null}
        </div>

        {/* Footer with keyboard shortcuts hints */}
        <div className="flex items-center justify-between border-t border-rule bg-surface/60 px-4 py-2 text-2xs text-faint font-mono">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <div>Theos Logos</div>
        </div>
      </div>
    </div>
  );
}
