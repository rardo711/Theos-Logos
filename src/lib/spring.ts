/**
 * One desk spring. Slightly underdamped: it arrives, settles once, and stops.
 * Not a bounce. Used where a finger lets go, and sampled into --ease-spring.
 */
export const DESK_SPRING = {
  stiffness: 280,
  damping: 38,
  mass: 1,
} as const;

/** A throw that should leave. Critically damped, so it does not bounce back. */
export const DISMISS_SPRING = {
  stiffness: 260,
  damping: 34,
  mass: 1,
} as const;

export function springStep(
  x: number,
  v: number,
  target: number,
  dt: number,
  spring: { stiffness: number; damping: number; mass: number } = DESK_SPRING,
): { x: number; v: number } {
  const accel = (-spring.stiffness * (x - target) - spring.damping * v) / spring.mass;
  const nextV = v + accel * dt;
  return { x: x + nextV * dt, v: nextV };
}

/** Drive `from` toward `to`, carrying a release velocity in px/s. Returns cancel. */
export function springTo({
  from,
  velocity,
  to,
  onUpdate,
  onRest,
  spring = DESK_SPRING,
}: {
  from: number;
  velocity: number;
  to: number;
  onUpdate: (value: number) => void;
  onRest?: () => void;
  spring?: { stiffness: number; damping: number; mass: number };
}): () => void {
  if (
    typeof window === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    onUpdate(to);
    onRest?.();
    return () => {};
  }

  let x = from;
  let v = Math.max(-2800, Math.min(2800, velocity));
  let last = performance.now();
  let frames = 0;
  let raf = 0;
  let stopped = false;

  const tick = (now: number) => {
    if (stopped) return;
    const dt = Math.min(0.032, (now - last) / 1000);
    last = now;
    frames += 1;
    const next = springStep(x, v, to, dt, spring);
    x = next.x;
    v = next.v;
    onUpdate(x);
    const rested = Math.abs(x - to) < 0.5 && Math.abs(v) < 12;
    if (rested || frames > 180) {
      onUpdate(to);
      onRest?.();
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
  };
}
