import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import { canInstallPwa, installPwa, subscribePwa } from "@/lib/pwa";
import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    const sync = () => setInstallable(canInstallPwa());
    sync();
    return subscribePwa(sync);
  }, []);

  if (!open) return null;

  const lamps = [
    { id: "light" as const, label: t(locale, "day") },
    { id: "dark" as const, label: t(locale, "night") },
    { id: "auto" as const, label: t(locale, "auto") },
  ];

  return (
    <>
      <button
        className="fixed inset-0 z-40"
        aria-label={t(locale, "closeAppearance")}
        onClick={() => setOpen(false)}
      />
      <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-72 rounded-lg border border-rule bg-surface p-4 shadow-soft">
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
            className="flex size-11 items-center justify-center text-sm text-muted"
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
            className="w-full accent-oxblood"
          />
          <button
            type="button"
            className="font-display flex size-11 items-center justify-center text-lg text-ink"
            onClick={() => setFontSize(fontSize + 2)}
            aria-label={t(locale, "larger")}
          >
            A
          </button>
        </div>
        <p
          className="mb-4 border-l-[3px] border-oxblood py-1 pl-3 font-serif text-ink italic"
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
            className="mb-4 block text-2xs font-medium tracking-wide text-oxblood uppercase hover:underline"
          >
            {t(locale, "defaultSize")}
          </button>
        ) : null}

        <p className="mb-2 mt-4 text-xs font-medium text-muted">
          {t(locale, "scripture")}
        </p>
        <div className="mb-4 flex rounded-md border border-rule p-0.5">
          {(
            [
              ["en", t(locale, "english")],
              ["es", t(locale, "spanish")],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setLocale(id)}
              className={cn(
                "min-h-11 flex-1 rounded-xs text-xs font-semibold",
                locale === id
                  ? "bg-oxblood text-oxblood-fg"
                  : "text-muted hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="mb-2 text-xs font-medium text-muted">{t(locale, "lamp")}</p>
        <div className="flex rounded-md border border-rule p-0.5">
          {lamps.map((lamp) => (
            <button
              key={lamp.id}
              type="button"
              onClick={() => setTheme(lamp.id)}
              className={cn(
                "min-h-11 flex-1 rounded-xs text-xs font-semibold",
                theme === lamp.id
                  ? "bg-oxblood text-oxblood-fg"
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
            className="mt-4 flex min-h-11 w-full items-center justify-center rounded-md bg-oxblood px-3 text-xs font-semibold tracking-[0.12em] text-oxblood-fg uppercase"
          >
            {t(locale, "install")}
          </button>
        ) : null}
      </div>
    </>
  );
}
