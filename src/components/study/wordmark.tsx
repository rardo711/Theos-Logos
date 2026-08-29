export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center bg-oxblood text-oxblood-fg"
        style={{
          borderRadius: 4,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22)",
        }}
      >
        <span className="font-display text-[13px] font-bold leading-none tracking-tight">
          TL
        </span>
      </span>
      <span className={compact ? "hidden min-w-0 sm:block" : "min-w-0"}>
        <span className="font-display block text-sm font-semibold leading-none tracking-tight text-ink">
          Theos Logos
        </span>
        <span className="mt-0.5 block text-2xs font-medium tracking-[0.16em] text-faint uppercase">
          Scripture first
        </span>
      </span>
    </div>
  );
}
