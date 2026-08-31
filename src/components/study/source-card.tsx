import type { SourceCard as Card, Tradition } from "@/lib/bible/types";
import { cn } from "@/lib/utils";

const TRADITION_LABEL: Record<Tradition, string> = {
  patristic: "Patristic",
  reformed: "Reformed",
  lutheran: "Lutheran",
  catholic: "Catholic",
  orthodox: "Orthodox",
  confession: "Confession",
};

export function SourceCard({ card }: { card: Card }) {
  return (
    <article className="rounded-lg border border-rule bg-surface p-4 shadow-soft">
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold leading-tight text-ink">
            {card.voice}
          </h3>
          <p className="mt-0.5 truncate text-xs text-muted">{card.work}</p>
        </div>
        <span
          className={cn(
            "shrink-0 border-l-2 border-oxblood pl-2 text-2xs font-semibold tracking-[0.14em] text-muted uppercase",
          )}
        >
          {TRADITION_LABEL[card.tradition]}
        </span>
      </header>
      <blockquote className="rounded-sm border-l-[3px] border-oxblood bg-oxblood-soft/60 py-2.5 pr-3 pl-3 font-serif text-base leading-relaxed text-ink italic">
        “{card.quote}”
      </blockquote>
      {card.note ? (
        <p className="mt-2.5 text-sm leading-relaxed text-muted">{card.note}</p>
      ) : null}
      <p className="mt-3 text-2xs tracking-wide text-faint">
        {card.citation}
        {card.paraphrased ? " · paraphrased" : ""}
      </p>
      {card.url ? (
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-2xs font-semibold tracking-wide text-oxblood uppercase"
        >
          Open source
        </a>
      ) : null}
    </article>
  );
}
