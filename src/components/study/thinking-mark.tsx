import { useEffect, useState } from "react";
import { ThinkingOrb, type OrbState } from "thinking-orbs";
import { cn } from "@/lib/utils";

/**
 * AI waits only. The orb stays off for the first moment so a cached
 * answer never flashes a canvas. thinking-orbs, size 20, beside the label.
 */
export function ThinkingMark({
  active,
  state,
  label,
  className,
}: {
  active: boolean;
  state: Extract<OrbState, "composing" | "searching" | "breathing">;
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
        "flex items-center gap-2 font-serif text-sm text-muted italic",
        className,
      )}
      role="status"
    >
      {show ? (
        <ThinkingOrb
          state={state}
          size={20}
          theme="auto"
          aria-hidden="true"
        />
      ) : null}
      {label}
    </p>
  );
}
