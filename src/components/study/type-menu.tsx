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
      <div className="absolute top-[calc(100%+8px)] right-0 z-50 w-64 rounded-lg border border-rule bg-surface p-4 shadow-soft">
        <p className="mb-3 text-2xs font-semibold tracking-[0.16em] text-faint uppercase">
          Appearance
        </p>
        <p className="mb-2 text-xs font-medium text-muted">Scripture size</p>
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            className="flex size-10 items-center justify-center text-sm text-muted"
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
            className="font-display flex size-10 items-center justify-center text-lg text-ink"
            onClick={() => setFontSize(fontSize + 2)}
            aria-label="Larger"
          >
            A
          </button>
        </div>
        <p className="mb-2 text-xs font-medium text-muted">Theme</p>
        <div className="flex rounded-md border border-rule p-0.5">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={cn(
                "min-h-10 flex-1 rounded-xs text-xs font-semibold",
                theme === t.id ? "bg-oxblood text-oxblood-fg" : "text-muted",
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
