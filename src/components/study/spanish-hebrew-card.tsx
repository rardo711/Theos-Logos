/**
 * Spanish OT Hebrew desk slip. Mirrors hebrew-bdb-card.tsx.
 * Hierarchy: Glosa hero (human Spanish gloss, honestly labeled — never a
 * "definition", never "Strong's en español") → Cómo la traduce
 * Reina-Valera (1909) → Lema/Morfología → Sentido en este versículo
 * (English BDB, labeled) → entrada BDB completa (expandable, English) →
 * Strong footer (Midvash ES) → micro attribution.
 * Body text = source fields only, verbatim, each source under its own
 * attribution. No machine translation anywhere. Chip tap never Gemini.
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SpanishHebrewResult } from "@/lib/lexicon/spanish-hebrew";
import {
  rv09Attribution,
  spanishHebrewAttribution,
} from "@/lib/lexicon/spanish-hebrew";
import type { HebrewBdbResult } from "@/lib/lexicon/hebrew-bdb";
import { hebrewBdbAttribution, strongsAttribution } from "@/lib/lexicon/hebrew-bdb";
import { strongsMidvashHref } from "@/lib/lexicon/midvash";

const LABEL =
  "text-[0.6875rem] font-medium tracking-[0.14em] text-faint uppercase";

export function SpanishHebrewCard({
  entry,
  bdb,
  onStrong,
  className,
}: {
  entry: SpanishHebrewResult;
  /** BDB side (lemma, morphology, verse sense, full entry). Null-safe. */
  bdb: HebrewBdbResult | null;
  /** Optional secondary: in-app Strong re-focus (pill primary action is external link). */
  onStrong?: (strongs: string) => void;
  className?: string;
}) {
  const [sensesOpen, setSensesOpen] = useState(false);
  const [senseFullOpen, setSenseFullOpen] = useState(false);

  // Hero: the human Spanish gloss when the entry has one; else the top
  // RV09 rendering (still human Spanish); else labeled BDB English —
  // never blank, never mislabeled.
  const heroText = entry.hero || bdb?.gloss || "";
  const heroLabel =
    entry.heroKind === "gloss"
      ? "Glosa"
      : entry.heroKind === "rv09"
        ? "Traducción RV09"
        : "Significado";
  const heroSub =
    entry.heroKind === "gloss"
      ? "Glosa del léxico hebreo · bcv-data/strongs, CC BY-SA 4.0"
      : entry.heroKind === "rv09"
        ? "Forma más frecuente · Reina-Valera (1909), dominio público"
        : bdb?.strongsDefinition
          ? strongsAttribution
          : hebrewBdbAttribution;

  const related = (bdb?.senses ?? []).filter(
    (_, i) => i !== (bdb?.selectedSenseIndex ?? 0),
  );
  const relatedCount = bdb?.relatedSenseCount ?? 0;

  return (
    <article
      className={cn(
        "tl-gloss-slip mb-5 rounded-[0.875rem] border border-rule bg-surface shadow-soft",
        className,
      )}
      data-spanish-hebrew-card
      data-strongs={entry.strongs}
    >
      {/* 1. Hero — the Spanish gloss, honestly labeled as a gloss */}
      <div className="flex flex-wrap items-center gap-2">
        <p className={LABEL}>{heroLabel}</p>
        {bdb?.isAramaic ? (
          <span className="rounded-full border border-gold/40 bg-gold-soft px-2 py-0.5 text-[0.625rem] font-semibold tracking-[0.12em] text-gold uppercase">
            Arameo bíblico
          </span>
        ) : null}
      </div>
      <p className="font-display mt-1 text-[1.375rem] font-semibold leading-snug text-ink">
        {heroText || "—"}
      </p>
      <p className="mt-1 text-[0.6875rem] text-faint">{heroSub}</p>

      {/* 2. Lemma (Hebrew, RTL) + Morphology */}
      {bdb ? (
        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          {bdb.lemma ? (
            <p className="text-[0.8125rem] text-ink">
              <span className={cn(LABEL, "mr-2")}>Lema</span>
              <span dir="rtl" lang="he" className="font-serif text-[1rem]">
                {bdb.lemma}
              </span>
            </p>
          ) : null}
          {bdb.pos.length > 0 ? (
            <p className="text-[0.75rem] text-ink">
              <span className={cn(LABEL, "mr-2")}>Morfología</span>
              <span className="text-muted">{bdb.pos.join(" · ")}</span>
            </p>
          ) : null}
          {bdb.occurrences ? (
            <p className="text-[0.75rem] text-muted">
              <span className={cn(LABEL, "mr-2")}>Apariciones</span>
              <span className="tabular-nums">{bdb.occurrences}×</span>
            </p>
          ) : null}
        </div>
      ) : null}

      {/* 3. Cómo la traduce Reina-Valera (1909) */}
      {entry.rv09.length > 0 ? (
        <>
          <p className={cn(LABEL, "mt-3")}>
            Cómo la traduce Reina-Valera (1909)
          </p>
          <ul className="mt-1 space-y-0.5">
            {entry.rv09.map(({ rendering, count }) => (
              <li
                key={rendering}
                className="flex items-baseline justify-between gap-3 text-[0.9375rem] leading-[1.35]"
              >
                <span className="text-ink">{rendering}</span>
                <span className="shrink-0 text-[0.75rem] text-faint tabular-nums">
                  {count}×
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-1 text-[0.6875rem] text-faint">{rv09Attribution}</p>
        </>
      ) : null}

      {/* 4. Sentido en este versículo — verbatim BDB English, labeled */}
      {bdb ? (
        <>
          <p className={cn(LABEL, "mt-3")}>
            Sentido en este versículo{" "}
            <span className="normal-case tracking-normal">(en inglés · BDB)</span>
          </p>
          {bdb.senseLine ? (
            <p className="mt-1 text-[0.9375rem] leading-[1.35] text-ink">
              {bdb.senseLine}
            </p>
          ) : (
            <p className="mt-1 text-[0.9375rem] text-muted italic">
              Sin texto de sentido BDB.
            </p>
          )}
          {bdb.sense && bdb.sense !== bdb.senseLine ? (
            <div className="mt-1" data-sense-full>
              <button
                type="button"
                className="tl-sentidos-mas text-[0.75rem] font-medium text-gold hover:underline"
                aria-expanded={senseFullOpen}
                onClick={() => setSenseFullOpen((o) => !o)}
              >
                {senseFullOpen
                  ? "Ocultar entrada completa"
                  : "Leer entrada completa BDB"}
              </button>
              {senseFullOpen ? (
                <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted">
                  {bdb.sense}
                </p>
              ) : null}
            </div>
          ) : null}
          {bdb.senseMatchedByReference ? (
            <p className="mt-1 text-[0.6875rem] text-faint">
              Elegido porque BDB cita este versículo aquí.
            </p>
          ) : null}

          {/* 5. More BDB senses — full verbatim blocks, collapsed */}
          {relatedCount > 0 ? (
            <div className="mt-2" data-related-senses>
              <button
                type="button"
                className="tl-sentidos-mas text-[0.75rem] font-medium text-gold hover:underline"
                aria-expanded={sensesOpen}
                onClick={() => setSensesOpen((o) => !o)}
              >
                {sensesOpen
                  ? "Ocultar sentidos BDB"
                  : `${relatedCount} sentido${relatedCount === 1 ? "" : "s"} BDB más`}
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
        </>
      ) : null}

      {/* 6. Hairline + Strong footer pill — gold, opens Midvash ES */}
      <div className="tl-gloss-hairline mt-3 pt-2.5">
        <div className="flex flex-nowrap items-center gap-2 overflow-hidden">
          <a
            href={strongsMidvashHref(entry.strongs, "es")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onStrong?.(entry.strongs)}
            className={cn(
              "tl-strong-pill tl-strong-pill--gold border border-gold/40 bg-gold-soft text-gold",
              "hover:border-gold/60 hover:brightness-[0.98]",
            )}
            aria-label={`Strong ${entry.strongs} (abre en pestaña nueva)`}
          >
            <span className="font-medium tabular-nums">{entry.strongs}</span>
            <span className="text-[0.625rem] font-semibold tracking-[0.12em] uppercase opacity-80">
              Strong
            </span>
          </a>
        </div>
        {/* 7. Micro attribution — each source separately, never mixed */}
        <p className="mt-2 text-[0.625rem] leading-snug text-faint">
          {spanishHebrewAttribution} Traducciones: {rv09Attribution}{" "}
          {bdb ? `BDB: ${hebrewBdbAttribution}` : null}
        </p>
      </div>
    </article>
  );
}
