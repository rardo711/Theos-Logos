/**
 * Premium first-run: language gate → 3 how-it-works screens → desk.
 * Look brief LOOK-BRIEF-first-run-onboarding-v1.md — LIVE prod seal only.
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";
import type { Locale } from "@/lib/bible/books";
import { completeOnboarding } from "@/lib/onboarding";
import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";

type Phase = "language" | "intro" | "exiting";

const COPY = {
  en: {
    langTitle: "Choose your language",
    langTitleEs: "Elige tu idioma",
    enLabel: "English",
    enSub: "Scripture desk",
    esLabel: "Español",
    esSub: "Escritura y glosas",
    back: "Back",
    next: "Next",
    screens: [
      {
        title: "Scripture first",
        body: "The desk opens on the Word. Read the verse before anything else.",
      },
      {
        title: "Tap a word",
        body: "Gloss and study tools open as a desk slip — sense, Spanish/English gloss, Strong’s when you need it.",
      },
      {
        title: "Reception at hand",
        body: "Voices and notes arrive as slips on the same desk. Stay with the verse; go deeper without leaving.",
      },
    ],
    begin: "Begin studying",
  },
  es: {
    langTitle: "Choose your language",
    langTitleEs: "Elige tu idioma",
    enLabel: "English",
    enSub: "Scripture desk",
    esLabel: "Español",
    esSub: "Escritura y glosas",
    back: "Atrás",
    next: "Siguiente",
    screens: [
      {
        title: "Primero la Escritura",
        body: "El escritorio abre en la Palabra. Lee el versículo antes que nada.",
      },
      {
        title: "Toca una palabra",
        body: "Glosa y herramientas salen como una ficha del escritorio — sentido, glosa, Strong cuando haga falta.",
      },
      {
        title: "Recepción a mano",
        body: "Voces y notas llegan como fichas en el mismo escritorio. Quédate con el versículo; profundiza sin salir.",
      },
    ],
    begin: "Empezar",
  },
} as const;

function LiveSeal({ size = 56 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="tl-seal relative flex shrink-0 items-center justify-center overflow-hidden text-oxblood-fg"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.16) }}
    >
      <span
        className="absolute inset-y-0 left-0 bg-black/30"
        style={{ width: Math.max(5, Math.round(size * 0.14)) }}
      />
      <span
        className="absolute inset-y-0 bg-white/20"
        style={{
          left: Math.max(5, Math.round(size * 0.14)),
          width: 1,
        }}
      />
      <span
        className="absolute right-0 rounded-l-sm bg-oxblood-fg/85"
        style={{
          top: Math.round(size * 0.18),
          bottom: Math.round(size * 0.18),
          width: Math.max(3, Math.round(size * 0.08)),
        }}
      />
      <span
        className="font-display relative ml-px font-bold leading-none tracking-tight"
        style={{ fontSize: Math.round(size * 0.32) }}
      >
        TL
      </span>
    </span>
  );
}

function VerseMock({ locale }: { locale: Locale }) {
  const ref = locale === "es" ? "Juan 1:1" : "John 1:1";
  const text =
    locale === "es"
      ? "En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios."
      : "In the beginning was the Word, and the Word was with God, and the Word was God.";
  return (
    <div className="tl-onboard-verse rounded-lg border border-rule bg-surface px-4 py-3 shadow-border">
      <p className="text-2xs font-medium tracking-[0.14em] text-faint uppercase">
        {ref}
      </p>
      <p className="font-serif mt-2 text-[0.9375rem] leading-relaxed text-ink">
        {text}
      </p>
    </div>
  );
}

function GlossMock({ locale }: { locale: Locale }) {
  const label = locale === "es" ? "Sentido" : "Sense";
  const gloss = locale === "es" ? "palabra" : "word";
  const word = locale === "es" ? "Verbo" : "Word";
  return (
    <div className="relative mx-auto w-full max-w-xs">
      <p className="font-serif mb-3 text-center text-sm text-ink">
        …the{" "}
        <span className="rounded-sm bg-oxblood-soft px-1 text-oxblood underline decoration-oxblood/40 underline-offset-2">
          {word}
        </span>{" "}
        was…
      </p>
      <div className="tl-gloss-slip rounded-[0.875rem] border border-rule bg-surface px-3.5 py-3 shadow-soft">
        <p className="text-[0.6875rem] font-medium tracking-[0.14em] text-faint uppercase">
          {label}
        </p>
        <p className="mt-1 text-[0.8125rem] text-ink">
          {locale === "es" ? "discurso · mensaje" : "speech · message"}
        </p>
        <p className="mt-2.5 text-[0.6875rem] font-medium tracking-[0.14em] text-faint uppercase">
          {locale === "es" ? "Glosa" : "Gloss"}
        </p>
        <p className="font-display mt-0.5 text-lg font-semibold text-ink">{gloss}</p>
        <div className="tl-gloss-hairline mt-2.5 flex gap-2 pt-2">
          <span className="tl-strong-pill border border-oxblood/35 bg-oxblood-soft text-oxblood">
            <span className="font-medium tabular-nums">G3056</span>
            <span className="text-[0.625rem] font-semibold tracking-[0.12em] uppercase opacity-80">
              Strong
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function ReceptionMock({ locale }: { locale: Locale }) {
  const slips =
    locale === "es"
      ? [
          { who: "Agustín", hint: "Sobre Juan" },
          { who: "Calvino", hint: "Comentario" },
          { who: "Confesión", hint: "Westminster" },
        ]
      : [
          { who: "Augustine", hint: "On John" },
          { who: "Calvin", hint: "Commentary" },
          { who: "Confession", hint: "Westminster" },
        ];
  return (
    <div className="relative mx-auto h-36 w-full max-w-xs">
      {slips.map((s, i) => (
        <div
          key={s.who}
          className="absolute inset-x-2 rounded-lg border border-rule bg-surface px-3 py-2.5 shadow-soft"
          style={{
            top: i * 18,
            transform: `rotate(${(i - 1) * 1.4}deg)`,
            zIndex: i,
            opacity: 0.55 + i * 0.2,
          }}
        >
          <p className="text-2xs font-medium tracking-[0.12em] text-faint uppercase">
            {s.hint}
          </p>
          <p className="font-display text-sm font-semibold text-ink">{s.who}</p>
        </div>
      ))}
    </div>
  );
}

export function Onboarding({ onFinished }: { onFinished: () => void }) {
  const setLocale = useStudy((s) => s.setLocale);
  const locale = useStudy((s) => s.locale);
  const [phase, setPhase] = useState<Phase>("language");
  const [page, setPage] = useState(0);
  const [gateReady, setGateReady] = useState(false);
  const [swipeDir, setSwipeDir] = useState<1 | -1>(1);
  const [pageKey, setPageKey] = useState(0);
  const touchX = useRef<number | null>(null);
  const copy = COPY[locale === "es" ? "es" : "en"];

  useEffect(() => {
    const id = requestAnimationFrame(() => setGateReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const pickLocale = useCallback(
    (next: Locale) => {
      setLocale(next);
      setPhase("intro");
      setPage(0);
      setSwipeDir(1);
      setPageKey((k) => k + 1);
    },
    [setLocale],
  );

  const goPage = useCallback((next: number, dir: 1 | -1) => {
    setSwipeDir(dir);
    setPage(next);
    setPageKey((k) => k + 1);
  }, []);

  const finish = useCallback(() => {
    completeOnboarding();
    setPhase("exiting");
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => {
        onFinished();
      },
      reduce ? 120 : 240,
    );
  }, [onFinished]);

  const onTouchStart = (e: ReactTouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    const start = touchX.current;
    touchX.current = null;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX;
    if (end == null) return;
    const dx = end - start;
    if (Math.abs(dx) < 48) return;
    if (dx < 0 && page < 2) goPage(page + 1, 1);
    else if (dx > 0 && page > 0) goPage(page - 1, -1);
  };

  return (
    <div
      className={cn(
        "tl-onboard fixed inset-0 z-[80] flex flex-col overflow-hidden bg-paper text-ink",
        phase === "exiting" && "tl-onboard-exit",
      )}
      role="dialog"
      aria-modal="true"
      aria-label={phase === "language" ? "Choose your language" : "How it works"}
    >
      <div className="pointer-events-none absolute inset-0 tl-onboard-wash" aria-hidden />

      {phase === "language" ? (
        <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-6 pb-16 pt-10">
          <div
            className={cn(
              "tl-onboard-gate-hero flex flex-col items-center",
              gateReady && "tl-onboard-gate-ready",
            )}
          >
            <LiveSeal size={64} />
            <h1 className="font-display mt-7 text-center text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
              {COPY.en.langTitle}
            </h1>
            <p className="mt-1.5 text-center text-sm text-muted">{COPY.en.langTitleEs}</p>
          </div>

          <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
            {(
              [
                { id: "en" as const, label: COPY.en.enLabel, sub: COPY.en.enSub, delay: 0 },
                { id: "es" as const, label: COPY.en.esLabel, sub: COPY.en.esSub, delay: 1 },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => pickLocale(opt.id)}
                className={cn(
                  "tl-onboard-lang-card group flex w-full flex-col items-start rounded-xl border border-rule bg-surface px-5 py-4 text-left shadow-border transition-[transform,background-color,border-color] duration-[80ms] ease-out",
                  "hover:border-oxblood/30 hover:bg-surface active:scale-[0.98]",
                  gateReady && "tl-onboard-lang-ready",
                )}
                style={{ ["--stagger" as string]: String(opt.delay) }}
              >
                <span className="font-display text-lg font-semibold text-ink">
                  {opt.label}
                </span>
                <span className="mt-0.5 text-sm text-muted">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {phase === "intro" || phase === "exiting" ? (
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div
            className="flex min-h-0 flex-1 flex-col px-6 pt-14 pb-4"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              key={pageKey}
              className={cn(
                "tl-onboard-page mx-auto flex w-full max-w-md flex-1 flex-col",
                swipeDir > 0 ? "tl-onboard-page-fwd" : "tl-onboard-page-back",
              )}
            >
              <div className="flex min-h-[9.5rem] items-center justify-center">
                {page === 0 ? <VerseMock locale={locale} /> : null}
                {page === 1 ? <GlossMock locale={locale} /> : null}
                {page === 2 ? <ReceptionMock locale={locale} /> : null}
              </div>
              <h2 className="font-display mt-8 text-center text-2xl font-semibold tracking-tight text-ink">
                {copy.screens[page]?.title}
              </h2>
              <p className="mt-3 text-center text-[0.9375rem] leading-relaxed text-muted">
                {copy.screens[page]?.body}
              </p>
            </div>
          </div>

          <div className="shrink-0 border-t border-rule/80 bg-surface/80 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm">
            <div className="mx-auto flex max-w-md items-center justify-between gap-2">
              <button
                type="button"
                className={cn(
                  "min-h-11 min-w-[4.5rem] rounded-md px-2 text-sm font-medium text-muted transition-colors hover:text-ink",
                  page === 0 && "invisible pointer-events-none",
                )}
                onClick={() => goPage(page - 1, -1)}
                tabIndex={page === 0 ? -1 : 0}
              >
                {copy.back}
              </button>

              <div className="flex items-center gap-2" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "tl-onboard-dot size-2 rounded-full transition-opacity duration-150",
                      i === page ? "bg-oxblood opacity-100" : "bg-ink/25 opacity-100",
                    )}
                  />
                ))}
              </div>

              {page < 2 ? (
                <button
                  type="button"
                  className="min-h-11 min-w-[4.5rem] rounded-md px-2 text-sm font-semibold text-oxblood transition-colors hover:text-oxblood/80"
                  onClick={() => goPage(page + 1, 1)}
                >
                  {copy.next}
                </button>
              ) : (
                <button
                  type="button"
                  className="tl-onboard-begin min-h-11 rounded-lg bg-oxblood px-4 text-sm font-semibold text-oxblood-fg shadow-border"
                  onClick={finish}
                >
                  {copy.begin}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
