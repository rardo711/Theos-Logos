import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";

const THEMES = [
  { id: "light", label: "Day" },
  { id: "dark", label: "Night" },
  { id: "auto", label: "Auto" },
] as const;

export function TypeMenu() {
  const open = useStudy((s) => s.typeOpen);
  const setOpen = useStudy((s) => s.setTypeOpen);
  const fontSize = useStudy((s) => s.fontSize);
  const setFontSize = useStudy((s) => s.setFontSize);
  const theme = useStudy((s) => s.theme);
  const setTheme = useStudy((s) => s.setTheme);

  if (!open) return null;

  return (
    <>
      <button
        className="fixed inset-0 z-40"
        aria-label="Close appearance"
        onClick={() => setOpen(false)}
      />
      <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-72 rounded-lg border border-rule bg-surface p-4 shadow-soft">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-t-lg bg-oxblood"
        />
        <p className="mb-1 text-2xs font-semibold tracking-[0.16em] text-faint uppercase">
          The desk
        </p>
        <p className="mb-4 text-xs text-muted">Type and lamp for the scripture column.</p>

        <p className="mb-2 text-xs font-medium text-muted">Scripture size</p>
        <div className="mb-1 flex items-center gap-2">
          <button
            type="button"
            className="flex size-11 items-center justify-center text-sm text-muted"
            onClick={() => setFontSize(fontSize - 2)}
            aria-label="Smaller"
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
            aria-label="Larger"
          >
            A
          </button>
        </div>
        <p
          className="mb-4 border-l-[3px] border-oxblood py-1 pl-3 font-serif text-ink italic"
          style={{ fontSize: Math.min(fontSize, 22) }}
        >
          In the beginning was the Word.
        </p>
        {fontSize !== 20 ? (
          <button
            type="button"
            onClick={() => setFontSize(20)}
            className="mb-4 block text-2xs font-medium tracking-wide text-oxblood uppercase hover:underline"
          >
            Default size
          </button>
        ) : null}

        <p className="mb-2 text-xs font-medium text-muted">Lamp</p>
        <div className="flex rounded-md border border-rule p-0.5">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={cn(
                "min-h-11 flex-1 rounded-xs text-xs font-semibold",
                theme === t.id ? "bg-oxblood text-oxblood-fg" : "text-muted hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
