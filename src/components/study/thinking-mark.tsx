import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type LampWait = "composing" | "searching" | "breathing";

/**
 * The small lamp, for a search or a chapter that is still arriving.
 * The long-answer mark waits before it shows; this one does not.
 */
export function LampMark({
  state = "searching",
  className,
}: {
  state?: LampWait;
  className?: string;
}) {
  return (
    <span className={cn("tl-lamp-wait", `tl-lamp-wait-${state}`, className)} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

/**
 * Desk lamp while a long answer is written. Not a generic orb:
 * composing breathes three wicks, searching draws a gold rule,
 * breathing is one slow flame. Stays hidden for the first moment
 * so a cached answer never flashes.
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
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) {
      setShow(false);
      return;
    }
    const timer = window.setTimeout(() => setShow(true), 800);
    return () => window.clearTimeout(timer);
  }, [active]);

  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-serif text-sm text-muted italic",
        className,
      )}
      role="status"
    >
      {show ? (
        <span className={cn("tl-lamp-wait", `tl-lamp-wait-${state}`)} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      ) : null}
      {label}
    </p>
  );
}
