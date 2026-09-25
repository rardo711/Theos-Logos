import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import { canInstallPwa, installPwa, subscribePwa } from "@/lib/pwa";
import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";
import { useSlidingPill } from "./sliding-pill";

const EXIT_MS = 320;

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

  useEffect(() => {
    const sync = () => setInstallable(canInstallPwa());
    sync();
    return subscribePwa(sync);
  }, []);

  // Keep mounted through exit so .tl-menu[data-open] can animate out (BUG-9).
  useEffect(() => {
    if (open) {
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
        role="dialog"
        aria-label={t(locale, "theDesk")}
        aria-hidden={!visible}
        inert={!visible ? true : undefined}
      >
        <div
          className="flex justify-center pt-0.5 pb-3 sm:hidden"
          aria-hidden
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
          className="relative mb-4 flex overflow-hidden rounded-md border border-rule p-0.5"
        >
          <span
            className="tl-seg-ink"
            data-ready={localeInk.ready ? "true" : "false"}
            style={{
              width: localeInk.w,
              transform: `translateX(${localeInk.x}px)`,
            }}
          />
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
          className="relative flex overflow-hidden rounded-md border border-rule p-0.5"
        >
          <span
            className="tl-seg-ink"
            data-ready={lampInk.ready ? "true" : "false"}
            style={{
              width: lampInk.w,
              transform: `translateX(${lampInk.x}px)`,
            }}
          />
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
