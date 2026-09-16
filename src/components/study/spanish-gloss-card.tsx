/**
 * Spanish gloss-first desk slip (Design brief v1 + motion/polish).
 * Hierarchy: Sentido → Glosa hero → Lema/Morfología → Dominio → Strong footer → attribution.
 * Body text = UBS source fields only. Logo untouched. Chip tap never Gemini.
 */
import { cn } from "@/lib/utils";
import type { SpanishLexiconResult } from "@/lib/lexicon/spanish";

const LABEL =
  "text-[0.6875rem] font-medium tracking-[0.14em] text-faint uppercase";

export function SpanishGlossCard({
  entry,
  onStrong,
  className,
}: {
  entry: SpanishLexiconResult;
  /** Tap Strong pill — deeper Strong / same-card re-focus. */
  onStrong?: (strongs: string) => void;
  className?: string;
}) {
  const strongs = entry.strongsAll.length ? entry.strongsAll : [entry.strongs];
  const visible = strongs.slice(0, 2);
  const overflow = strongs.length - visible.length;
  const domain = entry.domains[0];
  const subdomain = entry.subdomains[0];

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

      {entry.entryCode || entry.relatedSenseCount > 0 ? (
        <p className="mt-1 text-[0.65rem] text-faint">
          {entry.entryCode ? (
            <span className="tabular-nums">{entry.entryCode}</span>
          ) : null}
          {entry.entryCode && entry.relatedSenseCount > 0 ? " · " : null}
          {entry.relatedSenseCount > 0
            ? `${entry.relatedSenseCount} sentido${entry.relatedSenseCount === 1 ? "" : "s"} más`
            : null}
        </p>
      ) : null}

      {/* 4. Hairline + Strong footer pills (max 2 + N) */}
      <div className="tl-gloss-hairline mt-3 pt-2.5">
        <div className="flex flex-nowrap items-center gap-2 overflow-hidden">
          {visible.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onStrong?.(id)}
              className={cn(
                "tl-strong-pill border",
                id === entry.strongs
                  ? "border-oxblood/35 bg-oxblood-soft text-oxblood"
                  : "border-rule bg-surface text-ink hover:border-oxblood/35 hover:text-oxblood",
              )}
              aria-label={`Strong ${id}`}
            >
              <span className="font-medium tabular-nums">{id}</span>
              <span className="text-[0.625rem] font-semibold tracking-[0.12em] uppercase opacity-80">
                Strong
              </span>
            </button>
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
