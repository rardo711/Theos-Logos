import { Trash2 } from "lucide-react";
import type { SourceCard as Card } from "@/lib/bible/types";
import { t, traditionLabel } from "@/lib/i18n";
import { localizeCard } from "@/lib/i18n-sources";
import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";

export function SourceCard({
  card,
  isGenerated,
  onRemove,
}: {
  card: Card;
  isGenerated?: boolean;
  onRemove?: () => void;
}) {
  const locale = useStudy((s) => s.locale);
  const shown = localizeCard(card, locale);
  return (
    <article className="group rounded-lg border border-rule bg-surface p-4 shadow-soft tl-chapter">
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold leading-tight text-ink">
            {shown.voice}
          </h3>
          <p className="mt-0.5 flex min-w-0 items-center gap-1.5">
            <span className="truncate text-xs text-muted">{shown.work}</span>
            {card.grounded ? (
              <span className="shrink-0 rounded px-1 py-px text-[9px] font-medium leading-4 tracking-wide text-oxblood uppercase">
                {t(locale, "groundedBadge")}
              </span>
            ) : isGenerated ? (
              <span className="shrink-0 rounded px-1 py-px text-[9px] font-medium leading-4 tracking-wide text-faint uppercase">
                {t(locale, "generatedBadge")}
              </span>
            ) : (
              <span className="shrink-0 rounded px-1 py-px text-[9px] font-medium leading-4 tracking-wide text-faint uppercase">
                {t(locale, "curatedBadge")}
              </span>
            )}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              "shrink-0 border-l-2 border-oxblood pl-2 text-2xs font-semibold tracking-[0.14em] text-muted uppercase",
            )}
          >
            {traditionLabel(locale, shown.tradition)}
          </span>
          {onRemove ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="flex size-7 items-center justify-center rounded-sm text-faint hover:bg-oxblood-soft hover:text-oxblood transition-colors duration-150"
              title={t(locale, "removeCard")}
              aria-label={t(locale, "removeCard")}
            >
              <Trash2 size={13} />
            </button>
          ) : null}
        </div>
      </header>
      {shown.contextBridge ? (
        <p className="mb-2 text-xs leading-relaxed text-muted font-sans">
          {shown.contextBridge}
        </p>
      ) : null}
      <blockquote className="rounded-sm border-l-[3px] border-oxblood bg-oxblood-soft/60 py-2.5 pr-3 pl-3 font-serif text-base leading-relaxed text-ink italic">
        “{shown.quote}”
      </blockquote>
      {shown.note && shown.note !== shown.contextBridge ? (
        <p className="mt-2.5 text-sm leading-relaxed text-muted">{shown.note}</p>
      ) : null}
      <p className="mt-3 text-2xs tracking-wide text-faint">
        {shown.citation}
        {shown.paraphrased ? ` · ${t(locale, "paraphrased")}` : ""}
      </p>
      {shown.url ? (
        <a
          href={shown.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-2xs font-semibold tracking-wide text-oxblood uppercase"
        >
          {t(locale, "openSource")}
        </a>
      ) : null}
    </article>
  );
}
