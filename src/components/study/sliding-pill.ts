import { useLayoutEffect, useRef, useState } from "react";

export function useSlidingPill(active: string, extra?: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ x: 0, w: 0, ready: false });

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const measure = () => {
      const on = root.querySelector<HTMLElement>("[data-active='true']");
      if (!on) return;
      setBox({ x: on.offsetLeft, w: on.offsetWidth, ready: true });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [active, extra]);

  return [ref, box] as const;
}
