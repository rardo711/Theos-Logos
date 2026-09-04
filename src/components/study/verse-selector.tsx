import { useLayoutEffect, useRef } from "react";
import { inRange } from "@/lib/bible/range";
import { t } from "@/lib/i18n";
import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";

export function VerseSelector({
  count,
  selected,
  selectedEnd,
  noted,
  layout,
  onPick,
  label,
  selectMode = false,
  onToggleSelect,
}: {
  count: number;
  selected: number | null;
  selectedEnd: number | null;
  noted: ReadonlySet<number>;
  layout: "grid" | "rail";
  onPick: (verse: number, extend: boolean) => void;
  label: string;
  selectMode?: boolean;
  onToggleSelect?: () => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const locale = useStudy((s) => s.locale);
  const range =
    selected == null ? null : { start: selected, end: selectedEnd ?? selected };

  useLayoutEffect(() => {
    if (layout !== "rail" || selected == null) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    railRef.current
      ?.querySelector<HTMLElement>("[data-verse-start='true']")
      ?.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: reduce ? "auto" : "smooth",
      });
  }, [layout, selected, selectedEnd, count]);

  if (count < 1) return null;

  const buttons = Array.from({ length: count }, (_, i) => i + 1).map((n) => {
    const on = inRange(range, n);
    const start = range != null && n === range.start;
    return (
      <button
        key={n}
        type="button"
        data-active-verse={on ? "true" : undefined}
        data-verse-start={start ? "true" : undefined}
        aria-current={start ? "true" : undefined}
        aria-selected={on ? "true" : undefined}
        onMouseDown={(e) => {
          if (e.shiftKey) e.preventDefault();
        }}
        onClick={(e) => onPick(n, e.shiftKey)}
        className={cn(
          "relative flex min-h-11 items-center justify-center rounded-sm text-sm font-semibold tabular-nums transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.96] max-sm:min-h-10",
          layout === "rail" && "min-w-10 shrink-0 snap-start px-2.5",
          start
            ? "text-lamp shadow-[inset_0_-2px_0_0_var(--color-lamp)]"
            : on
              ? "bg-lamp-soft text-lamp"
              : "text-ink hover:bg-surface",
        )}
      >
        {n}
        {noted.has(n) && !on ? (
          <span className="absolute top-1.5 right-1.5 size-1 rounded-full bg-oxblood" />
        ) : null}
      </button>
    );
  });

  if (layout === "rail") {
    return (
      <nav
        className="tl-verse-rail tl-rail-wrap z-[2] shrink-0 border-b border-rule bg-paper"
        aria-label={label}
      >
        <div className="flex items-stretch">
          <div ref={railRef} className="tl-rail min-w-0 flex-1 px-1 py-0.5 sm:px-2">
            {buttons}
          </div>
          {onToggleSelect ? (
            <button
              type="button"
              onClick={onToggleSelect}
              aria-pressed={selectMode}
              className={cn(
                "sm:hidden shrink-0 self-center px-2.5 text-2xs font-semibold tracking-[0.12em] uppercase",
                selectMode ? "text-lamp" : "text-faint",
              )}
            >
              {selectMode
                ? t(locale, "selectPassageDone")
                : t(locale, "passage")}
            </button>
          ) : null}
        </div>
      </nav>
    );
  }

  return (
    <div className="mt-6">
      <p className="mb-2 text-2xs font-semibold tracking-[0.16em] text-faint uppercase">
        {label}
      </p>
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(2.75rem, 1fr))",
        }}
      >
        {buttons}
      </div>
    </div>
  );
}
