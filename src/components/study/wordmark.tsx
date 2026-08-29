import { cn } from "@/lib/utils";

export function Wordmark({
  compact = false,
  active = false,
}: {
  compact?: boolean;
  active?: boolean;
}) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span
        aria-hidden
        className={cn(
          "relative flex size-9 shrink-0 items-center justify-center overflow-hidden bg-oxblood text-oxblood-fg",
          active && "ring-1 ring-oxblood/50",
        )}
        style={{ borderRadius: 5 }}
      >
        <span className="absolute inset-y-0 left-0 w-[5px] bg-black/30" />
        <span className="absolute inset-y-0 left-[5px] w-px bg-white/20" />
        <span className="absolute inset-y-1.5 right-0 w-[3px] rounded-l-sm bg-oxblood-fg/85" />
        <span className="font-display relative ml-px text-xs font-bold leading-none tracking-tight">
          TL
        </span>
      </span>
      <span className={compact ? "hidden min-w-0 text-left sm:block" : "min-w-0 text-left"}>
        <span className="font-display block text-sm font-semibold leading-none tracking-tight text-ink">
          Theos Logos
        </span>
        <span className="mt-0.5 block text-2xs font-medium tracking-[0.16em] text-faint uppercase">
          Scripture first
        </span>
      </span>
    </span>
  );
}
