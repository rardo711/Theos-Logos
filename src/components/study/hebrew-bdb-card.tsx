/**
 * Hebrew BDB desk slip. Mirrors EnglishGlossCard (design brief v1 + motion/polish).
 * Hierarchy: Meaning hero → Sense in this verse → Lemma/Morphology →
 * more BDB senses (expandable) → Strong footer → attribution.
 * Body text = BDB source fields only, verbatim. Chip tap never Gemini.
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { HebrewBdbResult } from "@/lib/lexicon/hebrew-bdb";
import { strongsMidvashHref } from "@/lib/lexicon/midvash";

const LABEL =
  "text-[0.6875rem] font-medium tracking-[0.14em] text-faint uppercase";

export function HebrewBdbCard({
  entry,
  onStrong,
  className,
}: {
  entry: HebrewBdbResult;
  /** Optional secondary: in-app Strong re-focus (pill primary action is external link). */
  onStrong?: (strongs: string) => void;
  className?: string;
}) {
  const [sensesOpen, setSensesOpen] = useState(false);
  const [senseFullOpen, setSenseFullOpen] = useState(false);
  const related = entry.senses.filter((_, i) => i !== entry.selectedSenseIndex);
  const relatedCount = entry.relatedSenseCount;

  return (
    <article
      className={cn(
        "tl-gloss-slip mb-5 rounded-[0.875rem] border border-rule bg-surface shadow-soft",
        className,
      )}
      data-hebrew-bdb-card
      data-strongs={entry.strongs}
    >
      {/* 1. Meaning hero — the readable gloss stays in the card */}
      <div className="flex flex-wrap items-center gap-2">
        <p className={LABEL}>Meaning</p>
        {entry.isAramaic ? (
          <span className="rounded-full border border-gold/40 bg-gold-soft px-2 py-0.5 text-[0.625rem] font-semibold tracking-[0.12em] text-gold uppercase">
            Biblical Aramaic
          </span>
        ) : null}
      </div>
      <p className="font-display mt-1 text-[1.375rem] font-semibold leading-snug text-ink">
        {entry.gloss || "—"}
      </p>
      {entry.glossExtras.length > 0 ? (
        <p className="mt-1 text-[0.8125rem] leading-snug text-muted">
          {entry.glossExtras.join(" · ")}
        </p>
      ) : null}

      {/* 2. Lemma (Hebrew, RTL) + Morphology */}
      <div className="mt-2.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {entry.lemma ? (
          <p className="text-[0.8125rem] text-ink">
            <span className={cn(LABEL, "mr-2")}>Lemma</span>
            <span dir="rtl" lang="he" className="font-serif text-[1rem]">
              {entry.lemma}
            </span>
          </p>
        ) : null}
        {entry.pos.length > 0 ? (
          <p className="text-[0.75rem] text-ink">
            <span className={cn(LABEL, "mr-2")}>Morphology</span>
            <span className="text-muted">{entry.pos.join(" · ")}</span>
          </p>
        ) : null}
        {entry.occurrences ? (
          <p className="text-[0.75rem] text-muted">
            <span className={cn(LABEL, "mr-2")}>Occurs</span>
            <span className="tabular-nums">{entry.occurrences}×</span>
          </p>
        ) : null}
      </div>

      {/* 3. Sense in this verse — one verbatim line; full entry behind a tap */}
      <p className={cn(LABEL, "mt-3")}>Sense in this verse</p>
      {entry.senseLine ? (
        <p className="mt-1 text-[0.9375rem] leading-[1.35] text-ink">
          {entry.senseLine}
        </p>
      ) : (
        <p className="mt-1 text-[0.9375rem] text-muted italic">
          No BDB sense text.
        </p>
      )}
      {entry.sense && entry.sense !== entry.senseLine ? (
        <div className="mt-1" data-sense-full>
          <button
            type="button"
            className="tl-sentidos-mas text-[0.75rem] font-medium text-gold hover:underline"
            aria-expanded={senseFullOpen}
            onClick={() => setSenseFullOpen((o) => !o)}
          >
            {senseFullOpen ? "Hide full entry" : "Read full BDB entry"}
          </button>
          {senseFullOpen ? (
            <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted">
              {entry.sense}
            </p>
          ) : null}
        </div>
      ) : null}
      {entry.senseMatchedByReference ? (
        <p className="mt-1 text-[0.6875rem] text-faint">
          Chosen because BDB cites this verse here.
        </p>
      ) : null}

      {/* 4. More BDB senses — full verbatim blocks, collapsed for phones */}
      {relatedCount > 0 ? (
        <div className="mt-2" data-related-senses>
          <button
            type="button"
            className="tl-sentidos-mas text-[0.75rem] font-medium text-gold hover:underline"
            aria-expanded={sensesOpen}
            onClick={() => setSensesOpen((o) => !o)}
          >
            {sensesOpen
              ? "Hide BDB senses"
              : `${relatedCount} more BDB sense${relatedCount === 1 ? "" : "s"}`}
          </button>
          {sensesOpen ? (
            <ul className="tl-related-senses mt-2 space-y-2.5 border-l-2 border-gold/25 pl-3">
              {related.map((sense, i) => (
                <li
                  key={`rel-${i}`}
                  className="text-[0.8125rem] leading-snug text-ink"
                >
                  {sense.glosses.length > 0 ? (
                    <p className="font-medium text-gold">
                      {sense.glosses.join(" · ")}
                    </p>
                  ) : null}
                  <p className="mt-0.5">{sense.text}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {/* 5. Hairline + Strong footer pill — gold, opens Midvash EN */}
      <div className="tl-gloss-hairline mt-3 pt-2.5">
        <div className="flex flex-nowrap items-center gap-2 overflow-hidden">
          <a
            href={strongsMidvashHref(entry.strongs, "en")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onStrong?.(entry.strongs)}
            className={cn(
              "tl-strong-pill tl-strong-pill--gold border border-gold/40 bg-gold-soft text-gold",
              "hover:border-gold/60 hover:brightness-[0.98]",
            )}
            aria-label={`Strong ${entry.strongs} (opens in new tab)`}
          >
            <span className="font-medium tabular-nums">{entry.strongs}</span>
            <span className="text-[0.625rem] font-semibold tracking-[0.12em] uppercase opacity-80">
              Strong
            </span>
          </a>
        </div>
        {/* 6. Micro attribution */}
        <p className="mt-2 text-[0.625rem] leading-snug text-faint">
          {entry.attribution}
        </p>
      </div>
    </article>
  );
}
