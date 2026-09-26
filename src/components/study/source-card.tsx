import { Trash2 } from "lucide-react";
import type { SourceCard as Card } from "@/lib/bible/types";
import { t, traditionLabel } from "@/lib/i18n";
import { localizeCard } from "@/lib/i18n-sources";
import { decodeHtmlEntities } from "@/lib/reception/retrieve-html";
import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";

export function SourceCard({
  card,
  isGenerated,
  onRemove,
  land = false,
}: {
  card: Card;
  isGenerated?: boolean;
  onRemove?: () => void;
  land?: boolean;
}) {
  const locale = useStudy((s) => s.locale);
  const shown = localizeCard(card, locale);
  return (
    <article
      className={cn(
        "group tl-slip min-w-0 max-w-full px-4 pt-4 pb-3.5",
        land && "tl-slip-land",
      )}
    >
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-[13px] font-semibold leading-tight tracking-[0.14em] text-ink uppercase">
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
          <span className="shrink-0 pl-2 text-2xs font-semibold tracking-[0.14em] text-faint uppercase">
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
        <p className="mb-2 text-xs leading-relaxed text-muted">
          {decodeHtmlEntities(shown.contextBridge)}
        </p>
      ) : null}
      <blockquote className="tl-quote min-w-0 break-words border-l border-oxblood py-0.5 pr-1 pl-3 font-serif text-base leading-relaxed text-ink italic [overflow-wrap:anywhere] [word-break:break-word]">
        “{decodeHtmlEntities(shown.quote)}”
      </blockquote>
      {shown.note && shown.note !== shown.contextBridge ? (
        <p className="mt-2.5 text-sm leading-relaxed text-muted">{shown.note}</p>
      ) : null}
      <p className="tl-cite mt-3 text-2xs text-faint">
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
