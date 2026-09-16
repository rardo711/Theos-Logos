/**
 * Spanish gloss-first desk slip (Design brief v1 + motion/polish).
 * Hierarchy: Sentido → Glosa hero → Lema/Morfología → Dominio → Strong footer → attribution.
 * Body text = UBS source fields only. Logo untouched. Chip tap never Gemini.
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SpanishLexiconResult } from "@/lib/lexicon/spanish";

const LABEL =
  "text-[0.6875rem] font-medium tracking-[0.14em] text-faint uppercase";

/** BibleHub Greek Strong's deep link (strip leading zeros: G3956 → 3956). */
export function strongsBibleHubHref(strongs: string): string {
  const m = String(strongs ?? "")
    .toUpperCase()
    .match(/G0*(\d+)/);
  const n = m?.[1] ?? String(strongs ?? "").replace(/^G0*/i, "");
  return `https://biblehub.com/greek/${n}.htm`;
}

export function SpanishGlossCard({
  entry,
  onStrong,
  className,
}: {
  entry: SpanishLexiconResult;
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
      data-spanish-gloss-card
      data-entry-code={entry.entryCode || undefined}
    >
      {/* 1. Sentido en este versículo */}
      <p className={LABEL}>Sentido en este versículo</p>
      {entry.sentido ? (
        <p className="mt-1 text-[0.9375rem] leading-[1.35] text-ink">
          {entry.sentido}
        </p>
      ) : (
        <p className="mt-1 text-[0.9375rem] text-muted italic">
          Sin definición breve.
        </p>
      )}

      {/* 2. Glosa hero — visual king */}
      <p className={cn(LABEL, "mt-3")}>Glosa</p>
      <p className="font-display mt-1 text-[1.375rem] font-semibold leading-snug text-ink">
        {entry.gloss || "—"}
      </p>
      {entry.glossExtras.length > 0 ? (
        <p className="mt-1 text-[0.8125rem] leading-snug text-muted">
          {entry.glossExtras.join(" · ")}
        </p>
      ) : null}

      {/* 3. Lema + Morfología */}
      <div className="mt-2.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {entry.lemma ? (
          <p className="text-[0.8125rem] text-ink">
            <span className={cn(LABEL, "mr-2")}>Lema</span>
            <span className="font-serif text-[0.875rem] italic">{entry.lemma}</span>
          </p>
        ) : null}
        {entry.pos.length > 0 ? (
          <p className="text-[0.75rem] text-ink">
            <span className={cn(LABEL, "mr-2")}>Morfología</span>
            <span className="text-muted">{entry.pos.join(" · ")}</span>
          </p>
        ) : null}
      </div>

      {/* Dominio + SubDominio — tertiary, never above gloss; source strings only */}
      {domain || subdomain ? (
        <p className="mt-1.5 text-[0.75rem] text-muted">
          <span className={cn(LABEL, "mr-2")}>Dominio</span>
          {[domain, subdomain].filter(Boolean).join(" · ")}
        </p>
      ) : null}

      {entry.entryCode ? (
        <p className="mt-1 text-[0.65rem] tabular-nums text-faint">{entry.entryCode}</p>
      ) : null}

      {/* N sentidos más — expand other UBS LEXMeanings; primary sense stays hero */}
      {relatedCount > 0 ? (
        <div className="mt-2" data-related-senses>
          <button
            type="button"
            className="tl-sentidos-mas text-[0.75rem] font-medium text-gold hover:underline"
            aria-expanded={sensesOpen}
            onClick={() => setSensesOpen((o) => !o)}
          >
            {sensesOpen
              ? "Ocultar sentidos"
              : `${relatedCount} sentido${relatedCount === 1 ? "" : "s"} más`}
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

      {/* 4. Hairline + Strong footer pills (max 2 + N) — gold, open BibleHub */}
      <div className="tl-gloss-hairline mt-3 pt-2.5">
        <div className="flex flex-nowrap items-center gap-2 overflow-hidden">
          {visible.map((id) => (
            <a
              key={id}
              href={strongsBibleHubHref(id)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onStrong?.(id)}
              className={cn(
                "tl-strong-pill tl-strong-pill--gold border border-gold/40 bg-gold-soft text-gold",
                "hover:border-gold/60 hover:brightness-[0.98]",
              )}
              aria-label={`Strong ${id} (abre en pestaña nueva)`}
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
