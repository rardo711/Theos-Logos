/**
 * English gloss-first desk slip. Mirrors SpanishGlossCard (design brief v1 + motion/polish).
 * Hierarchy: Sense → Gloss hero → Lemma/Morphology → Domain → Strong footer → attribution.
 * Body text = UBS source fields only. Logo untouched. Chip tap never Gemini.
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { EnglishLexiconResult } from "@/lib/lexicon/english";
import { strongsMidvashHref } from "@/lib/lexicon/midvash";

const LABEL =
  "text-[0.6875rem] font-medium tracking-[0.14em] text-faint uppercase";

export function EnglishGlossCard({
  entry,
  onStrong,
  className,
}: {
  entry: EnglishLexiconResult;
  /** Optional secondary: in-app Strong re-focus (pill primary action is external link). */
  onStrong?: (strongs: string) => void;
  className?: string;
}) {
  const [sensesOpen, setSensesOpen] = useState(false);
  const strongs = entry.strongsAll.length ? entry.strongsAll : [entry.strongs];
  const visible = strongs.slice(0, 2);
  const overflow = strongs.length - visible.length;
  const domain = entry.domains[0];
  const subdomain = entry.subdomains[0];
  const related = entry.senses.filter((_, i) => i !== entry.selectedSenseIndex);
  const relatedCount = entry.relatedSenseCount;

  return (
    <article
      className={cn(
        "tl-gloss-slip mb-5 rounded-[0.875rem] border border-rule bg-surface shadow-soft",
        className,
      )}
      data-english-gloss-card
      data-entry-code={entry.entryCode || undefined}
    >
      {/* 1. Sense in this verse */}
      <p className={LABEL}>Sense in this verse</p>
      {entry.sense ? (
        <p className="mt-1 text-[0.9375rem] leading-[1.35] text-ink">
          {entry.sense}
        </p>
      ) : (
        <p className="mt-1 text-[0.9375rem] text-muted italic">
          No short definition.
        </p>
      )}

      {/* 2. Gloss hero — visual king */}
      <p className={cn(LABEL, "mt-3")}>Gloss</p>
      <p className="font-display mt-1 text-[1.375rem] font-semibold leading-snug text-ink">
        {entry.gloss || "—"}
      </p>
      {entry.glossExtras.length > 0 ? (
        <p className="mt-1 text-[0.8125rem] leading-snug text-muted">
          {entry.glossExtras.join(" · ")}
        </p>
      ) : null}

      {/* 3. Lemma + Morphology */}
      <div className="mt-2.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {entry.lemma ? (
          <p className="text-[0.8125rem] text-ink">
            <span className={cn(LABEL, "mr-2")}>Lemma</span>
            <span className="font-serif text-[0.875rem] italic">{entry.lemma}</span>
          </p>
        ) : null}
        {entry.pos.length > 0 ? (
          <p className="text-[0.75rem] text-ink">
            <span className={cn(LABEL, "mr-2")}>Morphology</span>
            <span className="text-muted">{entry.pos.join(" · ")}</span>
          </p>
        ) : null}
      </div>

      {/* Domain + SubDomain — tertiary, never above gloss; source strings only */}
      {domain || subdomain ? (
        <p className="mt-1.5 text-[0.75rem] text-muted">
          <span className={cn(LABEL, "mr-2")}>Domain</span>
          {[domain, subdomain].filter(Boolean).join(" · ")}
        </p>
      ) : null}

      {entry.entryCode ? (
        <p className="mt-1 text-[0.65rem] tabular-nums text-faint">{entry.entryCode}</p>
      ) : null}

      {/* N more senses — expand other UBS LEXMeanings; primary sense stays hero */}
      {relatedCount > 0 ? (
        <div className="mt-2" data-related-senses>
          <button
            type="button"
            className="tl-sentidos-mas text-[0.75rem] font-medium text-gold hover:underline"
            aria-expanded={sensesOpen}
            onClick={() => setSensesOpen((o) => !o)}
          >
            {sensesOpen
              ? "Hide senses"
              : `${relatedCount} more sense${relatedCount === 1 ? "" : "s"}`}
          </button>
          {sensesOpen ? (
            <ul className="tl-related-senses mt-2 space-y-2.5 border-l-2 border-gold/25 pl-3">
              {related.map((sense, i) => {
                const d = sense.domains[0];
                const s = sense.subdomains[0];
                return (
                  <li
                    key={sense.entryCode || `rel-${i}`}
                    className="text-[0.8125rem] leading-snug text-ink"
                    data-sense-code={sense.entryCode || undefined}
                  >
                    {sense.definitionShort ? (
                      <p className="text-ink">{sense.definitionShort}</p>
                    ) : null}
                    {sense.glosses.length > 0 ? (
                      <p className="mt-0.5 text-muted">
                        {sense.glosses.join(" · ")}
                      </p>
                    ) : null}
                    {d || s ? (
                      <p className="mt-0.5 text-[0.6875rem] text-faint">
                        {[d, s].filter(Boolean).join(" · ")}
                        {sense.entryCode ? (
                          <span className="ml-1.5 tabular-nums opacity-80">
                            {sense.entryCode}
                          </span>
                        ) : null}
                      </p>
                    ) : sense.entryCode ? (
                      <p className="mt-0.5 text-[0.6875rem] tabular-nums text-faint">
                        {sense.entryCode}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      ) : null}

      {/* 4. Hairline + Strong footer pills (max 2 + N) — gold, open Midvash EN */}
      <div className="tl-gloss-hairline mt-3 pt-2.5">
        <div className="flex flex-nowrap items-center gap-2 overflow-hidden">
          {visible.map((id) => (
            <a
              key={id}
              href={strongsMidvashHref(id, "en")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onStrong?.(id)}
              className={cn(
                "tl-strong-pill tl-strong-pill--gold border border-gold/40 bg-gold-soft text-gold",
                "hover:border-gold/60 hover:brightness-[0.98]",
              )}
              aria-label={`Strong ${id} (opens in new tab)`}
            >
              <span className="font-medium tabular-nums">{id}</span>
              <span className="text-[0.625rem] font-semibold tracking-[0.12em] uppercase opacity-80">
                Strong
              </span>
            </a>
          ))}
          {overflow > 0 ? (
            <span className="shrink-0 text-[0.6875rem] text-faint">
              +{overflow}
            </span>
          ) : null}
        </div>
        {/* 5. Micro attribution */}
        <p className="mt-2 text-[0.625rem] leading-snug text-faint">
          {entry.attribution}
        </p>
      </div>
    </article>
  );
}
