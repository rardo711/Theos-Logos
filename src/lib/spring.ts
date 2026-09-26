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

/** How fast a throw bleeds off, per second. Distance coasted is about v / COAST_K. */
export const COAST_K = 4.6;

export type SheetStop = "full" | "mid" | "peek" | "hidden";

/**
 * Where a release should land. A slow lift stays. A swipe carries
 * to the next stop, and a hard one can skip a stop or shut the sheet.
 */
export function coastTarget(
  y: number,
  velocity: number,
  stops: { full: number; mid: number; peek: number; hidden: number },
): SheetStop {
  const v = Math.max(-4600, Math.min(4600, velocity));
  const projected = y + v / COAST_K;
  const ordered: { mode: SheetStop; y: number }[] = [
    { mode: "full", y: stops.full },
    { mode: "mid", y: stops.mid },
    { mode: "peek", y: stops.peek },
  ];
  const nearest = (): SheetStop => {
    let best = ordered[0];
    for (const stop of ordered) {
      if (Math.abs(stop.y - y) < Math.abs(best.y - y)) best = stop;
    }
    return best.mode;
  };
  if (Math.abs(v) < 420) return nearest();

  const gap = stops.hidden - stops.peek;
  const shutting =
    v > 0 &&
    (projected > stops.peek + gap * 0.38 || (v > 1750 && projected > stops.peek));
  if (shutting && (y > stops.mid - 8 || v > 1750)) return "hidden";

  const ahead = v < 0
    ? ordered.filter((stop) => stop.y < y - 6)
    : ordered.filter((stop) => stop.y > y + 6);
  let chosen: (typeof ordered)[number] | null = null;
  for (const stop of ahead) {
    const reached = v < 0 ? projected <= stop.y + 42 : projected >= stop.y - 42;
    if (!reached) continue;
    if (!chosen || (v < 0 ? stop.y < chosen.y : stop.y > chosen.y)) chosen = stop;
  }
  if (!chosen && Math.abs(v) > 720 && ahead.length > 0) {
    chosen = v < 0 ? ahead[ahead.length - 1] : ahead[0];
  }
  return chosen?.mode ?? nearest();
}

/** A finger has lifted. Coast on the release speed, then sit down without bouncing. */
export function glideTo({
  from,
  velocity,
  to,
  onUpdate,
  onRest,
}: {
  from: number;
  velocity: number;
  to: number;
  onUpdate: (value: number) => void;
  onRest?: () => void;
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
  let v = Math.max(-4600, Math.min(4600, velocity));
  let last = performance.now();
  let frames = 0;
  let raf = 0;
  let stopped = false;
  let settling = false;
  const settle = { stiffness: 420, damping: 42, mass: 1 };

  const tick = (now: number) => {
    if (stopped) return;
    const dt = Math.min(0.032, (now - last) / 1000);
    last = now;
    frames += 1;
    const toward = to - x;
    const coasting = !settling && Math.abs(v) > 70 && Math.abs(toward) > 16 && v * toward > 0;
    if (coasting) {
      const decay = Math.exp(-COAST_K * dt);
      x += v * dt;
      v *= decay;
      if ((to - x) * v < 0) settling = true;
    } else {
      settling = true;
      const next = springStep(x, v, to, dt, settle);
      x = next.x;
      v = next.v;
    }
    onUpdate(x);
    const rested = Math.abs(x - to) < 0.6 && Math.abs(v) < 14;
    if ((settling && rested) || frames > 180) {
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
