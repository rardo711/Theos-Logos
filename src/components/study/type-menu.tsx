import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Liquid } from "liquid-gooey";
import { t } from "@/lib/i18n";
import { canInstallPwa, installPwa, subscribePwa } from "@/lib/pwa";
import { useStudy } from "@/lib/study-store";
import { DISMISS_SPRING, springTo } from "@/lib/spring";
import { cn } from "@/lib/utils";
import { useSlidingPill } from "./sliding-pill";

const EXIT_MS = 620;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function DeskInk({
  ink,
}: {
  ink: { x: number; w: number; ready: boolean };
}) {
  const reduced = useReducedMotion();
  const mark = (
    <span
      className="tl-seg-ink"
      data-liquid={reduced ? undefined : "true"}
      data-ready={ink.ready ? "true" : "false"}
      style={{
        width: ink.w,
        transform: `translateX(${ink.x}px)`,
      }}
    />
  );
  if (reduced) return mark;
  return (
    <Liquid
      fill="var(--color-lamp-soft)"
      blur={8}
      contrast={15}
      className="pointer-events-none"
      style={{ position: "absolute", inset: 0 }}
    >
      <Liquid.Item
        effect="move"
        move={{ stretch: 0.28, trail: 0.22, springiness: 0.4, wobble: 0.1 }}
      >
        {mark}
      </Liquid.Item>
    </Liquid>
  );
}

export function TypeMenu() {
  const open = useStudy((s) => s.typeOpen);
  const setOpen = useStudy((s) => s.setTypeOpen);
  const fontSize = useStudy((s) => s.fontSize);
  const setFontSize = useStudy((s) => s.setFontSize);
  const theme = useStudy((s) => s.theme);
  const setTheme = useStudy((s) => s.setTheme);
  const locale = useStudy((s) => s.locale);
  const setLocale = useStudy((s) => s.setLocale);
  const [installable, setInstallable] = useState(false);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);
  const [localeRef, localeInk] = useSlidingPill(locale, visible);
  const [lampRef, lampInk] = useSlidingPill(theme, visible);
  const dragRef = useRef({ active: false, y: 0, lastY: 0, lastT: 0, velocity: 0 });
  const springStop = useRef<(() => void) | null>(null);
  const [dragging, setDragging] = useState(false);
  const [springing, setSpringing] = useState(false);
  const [dragY, setDragY] = useState(0);

  useEffect(() => () => springStop.current?.(), []);

  function onDragStart(e: PointerEvent<HTMLDivElement>) {
    if (!window.matchMedia("(max-width: 639px)").matches) return;
    springStop.current?.();
    setSpringing(false);
    const now = performance.now();
    dragRef.current = {
      active: true,
      y: e.clientY,
      lastY: e.clientY,
      lastT: now,
      velocity: 0,
    };
    setDragging(true);
    setDragY(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onDragMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return;
    const now = performance.now();
    const dt = Math.max(now - dragRef.current.lastT, 1);
    dragRef.current.velocity = ((e.clientY - dragRef.current.lastY) / dt) * 1000;
    dragRef.current.lastY = e.clientY;
    dragRef.current.lastT = now;
    setDragY(Math.max(0, e.clientY - dragRef.current.y));
  }

  function onDragEnd(e: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return;
    const dy = Math.max(0, e.clientY - dragRef.current.y);
    const velocity = dragRef.current.velocity;
    dragRef.current.active = false;
    setDragging(false);
    const menu = e.currentTarget.closest(".tl-menu");
    const height = menu instanceof HTMLElement ? menu.offsetHeight : 480;
    const dismiss = dy > 72 || velocity > 850;
    setSpringing(true);
    springStop.current?.();
    springStop.current = springTo({
      from: dy,
      velocity,
      to: dismiss ? height + 40 : 0,
      spring: dismiss ? DISMISS_SPRING : undefined,
      onUpdate: setDragY,
      onRest: () => {
        if (dismiss) {
          setOpen(false);
          return;
        }
        setSpringing(false);
        setDragY(0);
      },
    });
  }

  useEffect(() => {
    const sync = () => setInstallable(canInstallPwa());
    sync();
    return subscribePwa(sync);
  }, []);

  // Keep mounted through exit so .tl-menu[data-open] can animate out (BUG-9).
  useEffect(() => {
    if (open) {
      springStop.current?.();
      setSpringing(false);
      setDragY(0);
      setMounted(true);
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        if (inner) cancelAnimationFrame(inner);
      };
    }
    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, setOpen]);

  if (!mounted) return null;

  const lamps = [
    { id: "light" as const, label: t(locale, "day") },
    { id: "dark" as const, label: t(locale, "night") },
    { id: "auto" as const, label: t(locale, "auto") },
  ];
  const rangeP = `${((fontSize - 16) / 12) * 100}%`;

  return (
    <>
      <button
        type="button"
        className={cn(
          "fixed inset-0 z-40",
          !visible && "pointer-events-none",
        )}
        aria-label={t(locale, "closeAppearance")}
        tabIndex={visible ? 0 : -1}
        onClick={() => setOpen(false)}
      />
      <div
        className="tl-menu fixed inset-x-0 bottom-0 z-50 w-full overflow-hidden rounded-t-xl border-t border-rule bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-soft sm:absolute sm:inset-x-auto sm:bottom-auto sm:top-[calc(100%+6px)] sm:left-0 sm:w-72 sm:rounded-lg sm:border sm:pb-4"
        data-open={visible ? "true" : "false"}
        data-dragging={dragging ? "true" : "false"}
        data-spring={springing ? "true" : "false"}
        style={
          dragging || springing
            ? { ["--menu-drag" as string]: `${dragY}px` }
            : undefined
        }
        role="dialog"
        aria-label={t(locale, "theDesk")}
        aria-hidden={!visible}
        inert={!visible ? true : undefined}
      >
        <div
          className="tl-menu-handle flex justify-center pt-2 pb-3 touch-none sm:hidden"
          aria-hidden
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
        >
          <span className="h-1 w-10 rounded-full bg-faint/70" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-t-lg bg-oxblood"
        />
        <p className="mb-1 text-2xs font-semibold tracking-[0.16em] text-faint uppercase">
          {t(locale, "theDesk")}
        </p>
        <p className="mb-4 text-xs text-muted">{t(locale, "deskHint")}</p>

        <p className="mb-2 text-xs font-medium text-muted">
          {t(locale, "scriptureSize")}
        </p>
        <div className="mb-1 flex items-center gap-2">
          <button
            type="button"
            className="flex size-11 items-center justify-center text-sm text-muted transition-[color,transform] duration-150 ease-out hover:text-ink active:scale-[0.96]"
            onClick={() => setFontSize(fontSize - 2)}
            aria-label={t(locale, "smaller")}
          >
            A
          </button>
          <input
            type="range"
            min={16}
            max={28}
            step={2}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="tl-range"
            style={{ ["--range-p" as string]: rangeP }}
            aria-label={t(locale, "scriptureSize")}
          />
          <button
            type="button"
            className="font-display flex size-11 items-center justify-center text-lg text-ink transition-transform duration-150 ease-out active:scale-[0.96]"
            onClick={() => setFontSize(fontSize + 2)}
            aria-label={t(locale, "larger")}
          >
            A
          </button>
        </div>
        <p
          className="tl-quote mb-4 py-1 pl-3 font-serif text-ink italic"
          style={{ fontSize: Math.min(fontSize, 22) }}
        >
          {locale === "es"
            ? "En el principio era el Verbo."
            : "In the beginning was the Word."}
        </p>
        {fontSize !== 20 ? (
          <button
            type="button"
            onClick={() => setFontSize(20)}
            className="mb-4 block text-2xs font-medium tracking-wide text-lamp uppercase hover:underline"
          >
            {t(locale, "defaultSize")}
          </button>
        ) : null}

        <p className="mb-2 mt-4 text-xs font-medium text-muted">
          {t(locale, "scripture")}
        </p>
        <div
          ref={localeRef}
          className="relative mb-4 flex rounded-md border border-rule p-0.5"
        >
          <DeskInk ink={localeInk} />
          {(
            [
              ["en", t(locale, "english")],
              ["es", t(locale, "spanish")],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              data-active={locale === id ? "true" : undefined}
              onClick={() => setLocale(id)}
              className={cn(
                "relative z-10 min-h-11 flex-1 rounded-xs text-xs font-semibold transition-colors duration-150 ease-out",
                locale === id
                  ? "text-lamp"
                  : "text-muted hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="mb-2 text-xs font-medium text-muted">{t(locale, "lamp")}</p>
        <div
          ref={lampRef}
          className="relative flex rounded-md border border-rule p-0.5"
        >
          <DeskInk ink={lampInk} />
          {lamps.map((lamp) => (
            <button
              key={lamp.id}
              type="button"
              data-active={theme === lamp.id ? "true" : undefined}
              onClick={() => setTheme(lamp.id)}
              className={cn(
                "relative z-10 min-h-11 flex-1 rounded-xs text-xs font-semibold transition-colors duration-150 ease-out",
                theme === lamp.id
                  ? "text-lamp"
                  : "text-muted hover:text-ink",
              )}
            >
              {lamp.label}
            </button>
          ))}
        </div>

        {installable ? (
          <button
            type="button"
            onClick={() => {
              void installPwa().then((ok) => {
                if (ok) setOpen(false);
              });
            }}
            className="mt-4 flex min-h-11 w-full items-center justify-center rounded-md bg-oxblood px-3 text-xs font-semibold tracking-[0.12em] text-oxblood-fg uppercase transition-transform duration-150 ease-out active:scale-[0.96]"
          >
            {t(locale, "install")}
          </button>
        ) : null}
      </div>
    </>
  );
}
