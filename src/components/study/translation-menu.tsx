import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { t } from "@/lib/i18n";
import {
  translationsFor,
  translationInfo,
} from "@/lib/bible/translations";
import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";

/**
 * Classic translation picker: a small chip in the chapter header that drops
 * a compact menu. Opens with a bouncy bubble pop, not a snap.
 */
export function TranslationMenu() {
  const locale = useStudy((s) => s.locale);
  const enTranslation = useStudy((s) => s.enTranslation);
  const esTranslation = useStudy((s) => s.esTranslation);
  const setEnTranslation = useStudy((s) => s.setEnTranslation);
  const setEsTranslation = useStudy((s) => s.setEsTranslation);

  const available = translationsFor(locale);
  const activeId = locale === "es" ? esTranslation : enTranslation;
  const active = translationInfo(locale, activeId);

  const [open, setOpen] = useState(false);
  // Keep mounted through the quick shrink-out so it doesn't just vanish.
  const [rendered, setRendered] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLSpanElement>(null);

  const openGen = useRef(0);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    const gen = ++openGen.current;
    setRendered(true);
    setOpen(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (openGen.current === gen) setOpen(true);
      });
    });
  };
  const hide = () => {
    openGen.current += 1;
    setOpen(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setRendered(false), 200);
  };

  useEffect(() => {
    if (!rendered) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        hide();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [rendered]);

  const pick = (id: string) => {
    if (locale === "es") setEsTranslation(id as typeof esTranslation);
    else setEnTranslation(id as typeof enTranslation);
    hide();
  };

  return (
    <span ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => (open ? hide() : show())}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t(locale, "translation")}
        title={active.name}
        className="tl-press tl-folio-kicker inline-flex cursor-pointer items-center gap-1 rounded-full border border-lamp/70 px-3 py-1 text-2xs font-semibold tracking-[0.22em] text-muted uppercase hover:border-lamp hover:text-ink"
      >
        {active.short}
        <ChevronDown
          className={cn(
            "size-3 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {rendered && (
        <span className="absolute top-full left-1/2 z-40 mt-3 block w-60 -translate-x-1/2">
          <span
            data-open={open ? "true" : "false"}
            className="tl-tx-pop block overflow-hidden rounded-xl border border-rule bg-surface shadow-soft"
          >
            <ul role="menu" aria-label={t(locale, "translation")} className="py-1.5">
              {available.map((tr) => {
                const selected = tr.id === activeId;
                return (
                  <li key={tr.id} role="none">
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={selected}
                      onClick={() => pick(tr.id)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors duration-100",
                        selected ? "bg-lamp/10" : "hover:bg-ink/5",
                      )}
                    >
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "block text-sm font-semibold",
                            selected ? "text-lamp" : "text-ink",
                          )}
                        >
                          {tr.short}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {tr.name}
                        </span>
                      </span>
                      {selected && (
                        <Check className="size-4 shrink-0 text-lamp" aria-hidden />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </span>
        </span>
      )}
    </span>
  );
}
