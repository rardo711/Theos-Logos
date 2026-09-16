/**
 * Spanish gloss-first desk slip (Design brief v1).
 * Hierarchy: Sentido → Glosa hero → Lema/Morfología → Dominio → Strong footer → attribution.
 * Body text = UBS source fields only. Logo untouched. Chip tap never Gemini.
 */
import { cn } from "@/lib/utils";
import type { SpanishLexiconResult } from "@/lib/lexicon/spanish";

const LABEL =
  "text-2xs font-semibold tracking-[0.14em] text-faint uppercase";

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
        "mb-5 rounded-lg border border-rule bg-surface p-4 shadow-soft",
        className,
      )}
      data-spanish-gloss-card
      data-entry-code={entry.entryCode || undefined}
    >
      {/* 1. Sentido en este versículo */}
      <p className={LABEL}>Sentido en este versículo</p>
      {entry.sentido ? (
        <p className="mt-1 text-sm leading-relaxed text-ink">{entry.sentido}</p>
      ) : (
        <p className="mt-1 text-sm text-muted italic">Sin definición breve.</p>
      )}

      {/* 2. Glosa hero */}
      <p className={cn(LABEL, "mt-4")}>Glosa</p>
      <p className="font-display mt-1 text-2xl font-semibold leading-snug text-ink">
        {entry.gloss || "—"}
      </p>
      {entry.glossExtras.length > 0 ? (
        <p className="mt-1 text-sm text-muted">
          {entry.glossExtras.join(" · ")}
        </p>
      ) : null}

      {/* 3. Lema + Morfología */}
      <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {entry.lemma ? (
          <p className="text-sm text-ink">
            <span className={cn(LABEL, "mr-2")}>Lema</span>
            <span className="font-serif italic">{entry.lemma}</span>
          </p>
        ) : null}
        {entry.pos.length > 0 ? (
          <p className="text-sm text-ink">
            <span className={cn(LABEL, "mr-2")}>Morfología</span>
            <span className="text-muted">{entry.pos.join(" · ")}</span>
          </p>
        ) : null}
      </div>

      {/* Dominio + SubDominio — tertiary, never above gloss; source strings only */}
      {domain || subdomain ? (
        <p className="mt-2 text-sm text-muted">
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

      {/* 4. Hairline + Strong footer pills */}
      <div className="mt-4 border-t border-rule pt-3">
        <div className="flex flex-wrap items-center gap-2">
          {visible.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onStrong?.(id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm",
                id === entry.strongs
                  ? "border-lamp bg-lamp-soft text-lamp"
                  : "border-rule bg-surface text-ink hover:border-lamp hover:text-lamp",
              )}
              aria-label={`Strong ${id}`}
            >
              <span className="font-medium tabular-nums">{id}</span>
              <span className="text-2xs font-semibold tracking-[0.12em] uppercase opacity-80">
                Strong
              </span>
            </button>
          ))}
          {overflow > 0 ? (
            <span className="text-2xs text-faint">+{overflow}</span>
          ) : null}
        </div>
        {/* 5. Micro attribution */}
        <p className="mt-2 text-[0.65rem] leading-snug text-faint">
          {entry.attribution}
        </p>
      </div>
    </article>
  );
}
