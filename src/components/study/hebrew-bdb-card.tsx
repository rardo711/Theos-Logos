/**
 * Hebrew BDB desk slip. Mirrors EnglishGlossCard (design brief v1 + motion/polish).
 * Hierarchy: Meaning hero (Strong's concise definition when present, with its
 * own attribution) → Sense in this verse (BDB) → Lemma/Morphology →
 * more BDB senses (expandable) → Strong footer → attribution.
 * Body text = source fields only, verbatim, each source under its own
 * attribution. Chip tap never Gemini.
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { HebrewBdbResult } from "@/lib/lexicon/hebrew-bdb";
import { strongsAttribution } from "@/lib/lexicon/hebrew-bdb";
import { strongsMidvashHref } from "@/lib/lexicon/midvash";
import { transliterateLemma } from "@/lib/lexicon/transliterate";

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
  // Sibling lexemes under the same Strong's number (homograph split).
  const siblings = (entry.siblings ?? []).filter((s) => s.key !== entry.splitKey);
  const [lexemesOpen, setLexemesOpen] = useState(!!entry.redirectedFromStub);
  const lemmaTranslit = transliterateLemma(entry.lemma ?? "");

  return (
    <article
      className={cn(
        "tl-gloss-slip mb-5 rounded-[0.875rem] border border-rule bg-surface shadow-soft",
        className,
      )}
      data-hebrew-bdb-card
      data-strongs={entry.strongs}
    >
      {/* 1. Meaning hero — Strong's concise definition when the entry has
          one (attributed to Strong's right below); otherwise the BDB-gloss
          hero as before. BDB gloss extras are hidden under a Strong's hero
          so the two sources never read as one text. */}
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
      {entry.glossSource === "strongs" && entry.strongsDefinition ? (
        <p className="mt-1 text-[0.6875rem] text-faint">{strongsAttribution}</p>
      ) : null}
      {entry.glossSource === "bdb" && entry.isSplit ? (
        <p className="mt-1 text-[0.6875rem] text-faint">{entry.attribution}</p>
      ) : null}
      {entry.needsReview ? (
        <p className="mt-1 text-[0.6875rem] text-faint italic">
          Lexeme boundary under review.
        </p>
      ) : null}
      {(entry.glossSource === "bdb" || !entry.strongsDefinition) &&
      entry.glossExtras.length > 0 ? (
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
            {lemmaTranslit ? (
              <span dir="ltr" className="ml-2 text-[0.75rem] text-faint">
                {lemmaTranslit}
              </span>
            ) : null}
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

      {/* 5. Related lexemes — homograph split siblings under this Strong's
          number. Stub (head-only) lexemes live here, never as own cards. */}
      {siblings.length > 0 ? (
        <div className="mt-2" data-related-lexemes>
          <button
            type="button"
            className="tl-sentidos-mas text-[0.75rem] font-medium text-gold hover:underline"
            aria-expanded={lexemesOpen}
            onClick={() => setLexemesOpen((o) => !o)}
          >
            {lexemesOpen
              ? "Hide related lexemes"
              : `${siblings.length} related lexeme${siblings.length === 1 ? "" : "s"}`}
          </button>
          {lexemesOpen ? (
            <ul className="mt-2 space-y-1.5 border-l-2 border-gold/25 pl-3">
              {siblings.map((sib) => (
                <li key={sib.key} className="text-[0.8125rem] leading-snug">
                  {sib.stub ? (
                    <p className="text-muted">
                      {sib.sec ? <span className="font-medium text-gold">{sib.sec}. </span> : null}
                      <span dir="rtl" lang="he" className="font-serif">{sib.lemma}</span>
                      {transliterateLemma(sib.lemma ?? "") ? (
                        <span dir="ltr" className="ml-1.5 text-[0.75rem] text-faint">
                          {transliterateLemma(sib.lemma ?? "")}
                        </span>
                      ) : null}
                      {sib.headwordGloss ? <span> — {sib.headwordGloss}</span> : null}
                      <span className="text-faint"> · brief entry</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      className="text-left text-gold hover:underline"
                      onClick={() => onStrong?.(sib.key)}
                      aria-label={`Open ${sib.key}`}
                    >
                      {sib.sec ? <span className="font-medium">{sib.sec}. </span> : null}
                      <span dir="rtl" lang="he" className="font-serif text-ink">{sib.lemma}</span>
                      {transliterateLemma(sib.lemma ?? "") ? (
                        <span dir="ltr" className="ml-1.5 text-[0.75rem] text-faint">
                          {transliterateLemma(sib.lemma ?? "")}
                        </span>
                      ) : null}
                      {sib.headwordGloss ? <span className="text-muted"> — {sib.headwordGloss}</span> : null}
                    </button>
                  )}
                  {sib.needsReview ? (
                    <p className="text-[0.6875rem] text-faint italic">Boundary under review.</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {/* 6. See also — cross-lexeme pointers (tappable) */}
      {entry.seeAlso.length > 0 ? (
        <div className="mt-2 flex flex-wrap items-center gap-2" data-see-also>
          <p className={cn(LABEL, "mr-1")}>See also</p>
          {entry.seeAlso.map((id) => (
            <button
              key={id}
              type="button"
              className="rounded-full border border-gold/40 bg-gold-soft px-2 py-0.5 text-[0.75rem] font-medium text-gold hover:border-gold/60"
              onClick={() => onStrong?.(id)}
              aria-label={`Open ${id}`}
            >
              <span className="tabular-nums">{id}</span>
            </button>
          ))}
        </div>
      ) : null}

      {/* 7. Hairline + Strong footer pill — gold, opens Midvash EN */}
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
        {/* 8. Micro attribution */}
        <p className="mt-2 text-[0.625rem] leading-snug text-faint">
          {entry.attribution}
        </p>
      </div>
    </article>
  );
}
