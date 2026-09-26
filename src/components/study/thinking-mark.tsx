import { cn } from "@/lib/utils";

type LampWait = "composing" | "searching" | "breathing";

function Bible({
  state,
  className,
}: {
  state: LampWait;
  className?: string;
}) {
  return (
    <span className={cn("tl-bible", `tl-bible-${state}`, className)} aria-hidden="true">
      <span className="tl-bible-stage">
        <span className="tl-bible-board" />
        <span className="tl-bible-sheet" />
        <span className="tl-bible-gilt" />
        <span className="tl-bible-leaf">
          <span className="tl-bible-face" />
          <span className="tl-bible-face tl-bible-face-back" />
        </span>
        <span className="tl-bible-leaf tl-bible-leaf-2">
          <span className="tl-bible-face" />
          <span className="tl-bible-face tl-bible-face-back" />
        </span>
      </span>
    </span>
  );
}

/** Small Bible for a search or a written answer. Chapter opening does not use this. */
export function LampMark({
  state = "searching",
  className,
}: {
  state?: LampWait;
  className?: string;
}) {
  return <Bible state={state} className={className} />;
}

/**
 * The Bible while a long answer is written. Stays hidden for the first
 * moment so a cached answer never flashes.
 */
export function ThinkingMark({
  active,
  state,
  label,
  className,
}: {
  active: boolean;
  state: LampWait;
  label: string;
  className?: string;
}) {
  if (!active) return null;

  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-serif text-sm text-muted italic",
        className,
      )}
      role="status"
    >
      <Bible state={state} className="tl-bible-lg" />
      {label}
    </p>
  );
}