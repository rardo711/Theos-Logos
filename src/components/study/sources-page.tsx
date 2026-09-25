import { useMemo, useState, useEffect } from "react";
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  Check,
  ExternalLink,
  Filter,
  Search,
  X,
} from "lucide-react";
import { useStudy } from "@/lib/study-store";
import { t, traditionLabel } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  getAllDeviceSources,
  type DeviceSourceGroup,
} from "@/lib/reception/device-sources";
import type { SourceCard, Tradition } from "@/lib/bible/types";

export function SourcesPage({
  onClose,
  animOpen = true,
}: {
  onClose: () => void;
  /** Controlled by the parent for the enter/exit animation. */
  animOpen?: boolean;
}) {
  const locale = useStudy((s) => s.locale);
  const jumpTo = useStudy((s) => s.jumpTo);
  const setReceptionOpen = useStudy((s) => s.setReceptionOpen);

  const [query, setQuery] = useState("");
  const [selectedTradition, setSelectedTradition] = useState<string>("all");
  const [selectedVoice, setSelectedVoice] = useState<string>("all");
  const [pageLimit, setPageLimit] = useState(40);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Aggregate all device sources
  const summary = useMemo(() => getAllDeviceSources(locale), [locale]);

  // Fast in-memory filtering
  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return summary.groups
      .map((g) => {
        const matchingCards = g.cards.filter((c) => {
          if (
            selectedTradition !== "all" &&
            (c.tradition ?? "other").toLowerCase() !== selectedTradition.toLowerCase()
          ) {
            return false;
          }
          if (selectedVoice !== "all" && c.voice !== selectedVoice) {
            return false;
          }
          if (!q) return true;

          const refMatch = g.displayReference.toLowerCase().includes(q);
          const voiceMatch = c.voice.toLowerCase().includes(q);
          const workMatch = c.work.toLowerCase().includes(q);
          const quoteMatch = c.quote.toLowerCase().includes(q);
          const noteMatch = (c.note ?? "").toLowerCase().includes(q);
          const citeMatch = c.citation.toLowerCase().includes(q);

          return (
            refMatch || voiceMatch || workMatch || quoteMatch || noteMatch || citeMatch
          );
        });

        if (matchingCards.length === 0) return null;
        return {
          ...g,
          cards: matchingCards,
        };
      })
      .filter((g): g is DeviceSourceGroup => g !== null);
  }, [summary.groups, query, selectedTradition, selectedVoice]);

  const displayedGroups = filteredGroups.slice(0, pageLimit);

  function handleJump(group: DeviceSourceGroup) {
    jumpTo(group.bookId, group.chapter, group.verse);
    setReceptionOpen(true);
    onClose();
  }

  return (
    <div
      className="tl-sources fixed inset-0 z-50 flex flex-col overflow-hidden bg-paper text-ink"
      data-open={animOpen ? "true" : "false"}
    >
      {/* Top Oxblood Accent Line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-oxblood z-20"
      />

      {/* Main Page Header */}
      <header className="tl-sources-settle shrink-0 border-b border-rule bg-surface px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 shadow-xs">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-ink transition-colors duration-150 hover:bg-paper active:scale-[0.97]"
              aria-label={t(locale, "backToScripture")}
            >
              <ArrowLeft size={16} strokeWidth={2} />
              <span className="hidden sm:inline">{t(locale, "backToScripture")}</span>
            </button>
            <div className="h-4 w-px bg-rule hidden sm:block" />
            <div className="min-w-0">
              <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-ink flex items-center gap-2">
                <span>{t(locale, "reception")}</span>
                <span className="inline-flex items-center rounded-full bg-surface-raised px-2 py-0.5 text-xs font-serif font-medium text-muted border border-rule tabular-nums">
                  {summary.totalCards}
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Clear / Close */}
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-paper hover:text-ink active:scale-[0.96]"
            aria-label={t(locale, "close")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar & Primary Filters */}
        <div className="mx-auto mt-3 max-w-5xl">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-faint"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPageLimit(40);
              }}
              placeholder={t(locale, "filterSources")}
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-md border border-rule bg-paper py-2.5 pr-10 pl-10 text-sm sm:text-base text-ink outline-none placeholder:text-faint transition-[border-color,box-shadow] duration-150 ease-out focus:border-lamp focus:shadow-[0_0_0_3px_var(--color-lamp-soft)]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-xs text-faint transition-colors hover:text-ink"
                aria-label={t(locale, "clearSearch")}
              >
                <X size={14} />
              </button>
            ) : null}
          </div>

          {/* Filter Chips Bar */}
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setSelectedTradition("all");
                setSelectedVoice("all");
              }}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 font-medium transition-colors duration-150",
                selectedTradition === "all" && selectedVoice === "all"
                  ? "bg-ink text-paper"
                  : "border border-rule bg-surface hover:bg-surface-raised text-muted",
              )}
            >
              {t(locale, "filterAll")} ({summary.totalCards})
            </button>

            {summary.traditions.patristic > 0 ? (
              <button
                type="button"
                onClick={() =>
                  setSelectedTradition(
                    selectedTradition === "patristic" ? "all" : "patristic",
                  )
                }
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 font-medium transition-colors duration-150",
                  selectedTradition === "patristic"
                    ? "bg-ink text-paper"
                    : "border border-rule bg-surface hover:bg-surface-raised text-muted",
                )}
              >
                {traditionLabel(locale, "patristic")} ({summary.traditions.patristic})
              </button>
            ) : null}

            {summary.traditions.reformed > 0 ? (
              <button
                type="button"
                onClick={() =>
                  setSelectedTradition(
                    selectedTradition === "reformed" ? "all" : "reformed",
                  )
                }
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 font-medium transition-colors duration-150",
                  selectedTradition === "reformed"
                    ? "bg-ink text-paper"
                    : "border border-rule bg-surface hover:bg-surface-raised text-muted",
                )}
              >
                {traditionLabel(locale, "reformed")} ({summary.traditions.reformed})
              </button>
            ) : null}

            {summary.traditions.confession > 0 ? (
              <button
                type="button"
                onClick={() =>
                  setSelectedTradition(
                    selectedTradition === "confession" ? "all" : "confession",
                  )
                }
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 font-medium transition-colors duration-150",
                  selectedTradition === "confession"
                    ? "bg-ink text-paper"
                    : "border border-rule bg-surface hover:bg-surface-raised text-muted",
                )}
              >
                {traditionLabel(locale, "confession")} ({summary.traditions.confession})
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="tl-sources-settle flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          {displayedGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookMarked size={36} className="text-faint mb-3 stroke-[1.25]" />
              <p className="font-display text-lg font-semibold text-ink">
                {query ? t(locale, "noMore") : t(locale, "noSavedSources")}
              </p>
              <p className="mt-1 text-sm text-muted max-w-sm">
                {t(locale, "sourcesOnDeviceDesc")}
              </p>
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSelectedTradition("all");
                  }}
                  className="mt-4 rounded-md border border-rule bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-surface-raised transition-colors"
                >
                  {t(locale, "clearSearch")}
                </button>
              ) : null}
            </div>
          ) : (
            <div className="space-y-8">
              {displayedGroups.map((group) => (
                <article
                  key={group.passageKey}
                  className="rounded-lg border border-rule bg-surface overflow-hidden shadow-xs transition-shadow duration-150 hover:shadow-soft"
                >
                  {/* Group Header (Passage + Jump Button) */}
                  <div className="flex items-center justify-between border-b border-rule bg-surface-raised/40 px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-2.5">
                      <span className="size-2 rounded-full bg-oxblood" />
                      <h2 className="font-display text-base sm:text-lg font-bold tracking-tight text-ink">
                        {group.displayReference}
                      </h2>
                      <span className="text-xs font-serif text-muted">
                        · {group.cards.length} {group.cards.length === 1 ? "source" : "sources"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleJump(group)}
                      className="flex items-center gap-1.5 rounded-md bg-paper px-3 py-1.5 text-xs font-medium text-lamp hover:bg-surface-raised hover:text-ink border border-rule transition-colors active:scale-[0.97]"
                      aria-label={`${t(locale, "readInScripture")} - ${group.displayReference}`}
                    >
                      <BookOpen size={13} />
                      <span>{t(locale, "readInScripture")}</span>
                    </button>
                  </div>

                  {/* Cards inside this passage */}
                  <div className="divide-y divide-rule/60 p-1 sm:p-2">
                    {group.cards.map((card, i) => (
                      <div
                        key={`${card.voice}-${card.citation}-${i}`}
                        className="p-3 sm:p-4 transition-colors hover:bg-paper/40 rounded-sm"
                      >
                        {/* Card metadata: Author + Tradition */}
                        <div className="flex items-baseline justify-between gap-2">
                          <div>
                            <span className="font-display text-base font-semibold text-ink">
                              {card.voice}
                            </span>
                            <span className="ml-2 font-serif text-xs text-muted">
                              {card.work}
                            </span>
                          </div>
                          {card.tradition ? (
                            <span className="shrink-0 rounded-xs border border-rule/80 px-1.5 py-0.5 text-3xs font-medium uppercase tracking-wider text-faint">
                              {traditionLabel(locale, card.tradition as Tradition)}
                            </span>
                          ) : null}
                        </div>

                        {/* Citation */}
                        <p className="mt-0.5 font-sans text-2xs uppercase tracking-wider text-faint">
                          {card.citation}
                        </p>

                        {/* Quote body */}
                        <blockquote className="font-serif mt-2.5 text-sm sm:text-base leading-relaxed text-ink/90 border-l-2 border-lamp/30 pl-3 italic">
                          “{card.quote}”
                        </blockquote>

                        {/* Theological Note */}
                        {card.note ? (
                          <p className="mt-2 text-xs text-muted leading-normal pl-3">
                            {card.note}
                          </p>
                        ) : null}

                        {/* External Link if verified */}
                        {card.url ? (
                          <div className="mt-2 flex justify-end">
                            <a
                              href={card.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-2xs font-medium text-lamp hover:underline"
                            >
                              <span>{t(locale, "openSource")}</span>
                              <ExternalLink size={10} />
                            </a>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </article>
              ))}

              {/* Pagination / Load More if many results */}
              {filteredGroups.length > displayedGroups.length ? (
                <div className="flex justify-center pt-2 pb-6">
                  <button
                    type="button"
                    onClick={() => setPageLimit((p) => p + 40)}
                    className="rounded-md border border-rule bg-surface px-5 py-2 text-sm font-medium text-ink hover:bg-surface-raised transition-colors active:scale-[0.98]"
                  >
                    {t(locale, "loadMoreSources", {
                      n: filteredGroups.length - displayedGroups.length,
                    })}
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
