/**
 * Premium first-run v3 (ES refine): language gate → 4 how-to screens → desk.
 * Look briefs v2 structure + LOOK-BRIEF-first-run-onboarding-es-v3.md — LIVE prod seal only.
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

type Phase = "language" | "crossing" | "intro" | "exiting";

const SCREEN_COUNT = 4;

const COPY = {
  en: {
    langTitle: "Choose your language",
    langTitleEs: "Elige tu idioma",
    enLabel: "English",
    enSub: "Read and study in English",
    esLabel: "Español",
    esSub: "Escritura, glosas y Recepción",
    back: "Back",
    next: "Next",
    stepOf: (n: number, total: number) => `${n} / ${total}`,
    screens: [
      {
        title: "Open a verse",
        body: "Pick a book and chapter, then open any verse on the desk. The Word stays front and center.",
        hint: "",
      },
      {
        title: "Tap a word for Glosa",
        body: "On a verse, tap a word. A desk slip opens: sense, Glosa (main meaning), lemma, and a Strong chip in the footer.",
        hint: "",
      },
      {
        title: "Reception is your slip stack",
        body: "Stay on the verse. Reception brings commentary and study voices as slips on the same desk — go deeper without leaving the text.",
        hint: "",
      },
      {
        title: "Your desk is ready",
        body: "Language is saved. You can change it later in settings. Open a verse and begin.",
        hint: "",
      },
    ],
    begin: "Begin studying",
    moreSenses: "2 more senses",
    sense: "Sense",
    glosa: "Glosa",
    lemma: "Lemma",
  },
  es: {
    langTitle: "Choose your language",
    langTitleEs: "Elige tu idioma",
    enLabel: "English",
    enSub: "Read and study in English",
    esLabel: "Español",
    esSub: "Escritura, glosas y Recepción",
    back: "Atrás",
    next: "Siguiente",
    stepOf: (n: number, total: number) => `${n} de ${total}`,
    screens: [
      {
        title: "Abrir un versículo",
        body: "Elige libro y capítulo. Abre un versículo del NT. La Escritura queda al centro del escritorio.",
        hint: "Puedes cambiar de pasaje cuando quieras.",
      },
      {
        title: "Toca una palabra",
        body: "En el versículo, toca una palabra. Se abre una ficha: sentido, Glosa (significado principal), lema y el chip Strong abajo (en oro del escritorio).",
        hint: "La Glosa es lo más importante de la ficha.",
      },
      {
        title: "Recepción y comentarios",
        body: "Sin salir del versículo, Recepción trae voces y comentarios como fichas en el mismo escritorio. Lee la Palabra; profundiza al lado.",
        hint: "Recepción = comentarios y estudio, no otra app.",
      },
      {
        title: "Ya puedes empezar",
        body: "El español quedó guardado. Ábrelo en ajustes si quieres cambiarlo. Abre un versículo y toca una palabra para ver la Glosa.",
        hint: "",
      },
    ],
    begin: "Empezar",
    moreSenses: "2 sentidos más",
    sense: "Sentido",
    glosa: "Glosa",
    lemma: "Lema",
  },
} as const;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** LIVE prod seal — exact public asset (favicon.svg matches icon/PWA brand). */
function LiveSeal({ size = 64 }: { size?: number }) {
  return (
    <img
      src="/favicon.svg"
      alt=""
      width={size}
      height={size}
      className="tl-seal shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.22),
      }}
      draggable={false}
    />
  );
}

function PathMock({ locale }: { locale: Locale }) {
  const steps =
    locale === "es"
      ? ["Libro", "Capítulo", "Versículo"]
      : ["Book", "Chapter", "Verse"];
  const ref = locale === "es" ? "Juan 1:1" : "John 1:1";
  return (
    <div className="mx-auto flex w-full max-w-[360px] flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span className="rounded-md border border-rule bg-surface px-2.5 py-1.5 text-[0.6875rem] font-medium tracking-[0.08em] text-muted uppercase shadow-border">
              {label}
            </span>
            {i < steps.length - 1 ? (
              <span className="text-faint" aria-hidden>
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="tl-onboard-verse w-full rounded-lg border border-rule bg-surface px-4 py-3 shadow-border">
        <p className="text-2xs font-medium tracking-[0.14em] text-faint uppercase">
          {ref}
        </p>
        <p className="font-serif mt-2 text-[0.9375rem] leading-relaxed text-ink">
          {locale === "es"
            ? "En el principio era el Verbo…"
            : "In the beginning was the Word…"}
        </p>
      </div>
    </div>
  );
}

function GlossMock({
  locale,
  copy,
}: {
  locale: Locale;
  copy: (typeof COPY)["en"] | (typeof COPY)["es"];
}) {
  const word = locale === "es" ? "Verbo" : "Word";
  const gloss = locale === "es" ? "palabra" : "word";
  const lemma = locale === "es" ? "λόγος" : "λόγος";
  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      <p className="font-serif mb-3 text-center text-sm text-ink">
        {locale === "es" ? (
          <>
            …era el{" "}
            <span className="rounded-sm bg-oxblood-soft px-1 text-oxblood underline decoration-oxblood/40 underline-offset-2">
              {word}
            </span>
            …
          </>
        ) : (
          <>
            …the{" "}
            <span className="rounded-sm bg-oxblood-soft px-1 text-oxblood underline decoration-oxblood/40 underline-offset-2">
              {word}
            </span>{" "}
            was…
          </>
        )}
      </p>
      <div className="tl-gloss-slip rounded-[0.875rem] border border-rule bg-surface px-3.5 py-3 shadow-soft">
        <p className="text-[0.6875rem] font-medium tracking-[0.14em] text-faint uppercase">
          {copy.sense}
        </p>
        <p className="mt-1 text-[0.8125rem] text-ink">
          {locale === "es" ? "discurso · mensaje" : "speech · message"}
        </p>
        <div className="tl-onboard-gold-line mt-2.5 pt-2">
          <p className="text-[0.6875rem] font-medium tracking-[0.14em] text-faint uppercase">
            {copy.glosa}
          </p>
          <p className="font-display mt-0.5 text-lg font-semibold text-ink">
            {gloss}
          </p>
        </div>
        <p className="mt-2 text-[0.6875rem] font-medium tracking-[0.14em] text-faint uppercase">
          {copy.lemma}
        </p>
        <p className="font-serif mt-0.5 text-sm text-muted">{lemma}</p>
        <div className="tl-gloss-hairline mt-2.5 flex flex-wrap items-center gap-2 pt-2">
          <span className="tl-strong-pill tl-strong-pill--gold border border-gold/40 bg-gold-soft text-gold">
            <span className="font-medium tabular-nums">G3056</span>
            <span className="text-[0.625rem] font-semibold tracking-[0.12em] uppercase opacity-80">
              Strong
            </span>
          </span>
          <span className="text-[0.75rem] font-medium text-gold">
            {copy.moreSenses}
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
  const ref = locale === "es" ? "Juan 1:1" : "John 1:1";
  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      <p className="mb-3 text-center text-2xs font-medium tracking-[0.14em] text-faint uppercase">
        {ref}
      </p>
      <div className="relative mx-auto h-36 w-full">
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
    </div>
  );
}

function ReadyMock() {
  return (
    <div className="mx-auto flex w-full max-w-[360px] flex-col items-center gap-4">
      <div className="tl-onboard-desk-sil relative h-28 w-full max-w-[280px] rounded-xl border border-rule bg-surface shadow-border">
        <div className="absolute inset-x-6 top-3 h-px bg-gold/35" aria-hidden />
        <div className="absolute inset-x-8 top-8 bottom-8 rounded-md border border-rule/80 bg-paper/80" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <LiveSeal size={36} />
        </div>
      </div>
    </div>
  );
}

function ScreenVisual({
  page,
  locale,
  copy,
}: {
  page: number;
  locale: Locale;
  copy: (typeof COPY)["en"] | (typeof COPY)["es"];
}) {
  if (page === 0) return <PathMock locale={locale} />;
  if (page === 1) return <GlossMock locale={locale} copy={copy} />;
  if (page === 2) return <ReceptionMock locale={locale} />;
  return <ReadyMock />;
}

export function Onboarding({ onFinished }: { onFinished: () => void }) {
  const setLocale = useStudy((s) => s.setLocale);
  const locale = useStudy((s) => s.locale);
  const [phase, setPhase] = useState<Phase>("language");
  const [page, setPage] = useState(0);
  const [gateReady, setGateReady] = useState(false);
  const [picking, setPicking] = useState<Locale | null>(null);
  const [swipeDir, setSwipeDir] = useState<1 | -1>(1);
  const [pageKey, setPageKey] = useState(0);
  const touchX = useRef<number | null>(null);
  const timers = useRef<number[]>([]);
  const copy = COPY[locale === "es" ? "es" : "en"];

  useEffect(() => {
    const id = requestAnimationFrame(() => setGateReady(true));
    return () => {
      cancelAnimationFrame(id);
      for (const t of timers.current) window.clearTimeout(t);
    };
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  const pickLocale = useCallback(
    (next: Locale) => {
      if (picking) return;
      setPicking(next);
      setLocale(next);
      const reduce = prefersReducedMotion();
      if (reduce) {
        setPhase("intro");
        setPage(0);
        setSwipeDir(1);
        setPageKey((k) => k + 1);
        setPicking(null);
        return;
      }
      // 90ms scale + 40ms hold, then 280ms crossfade to intro
      schedule(() => {
        setPhase("crossing");
        schedule(() => {
          setPhase("intro");
          setPage(0);
          setSwipeDir(1);
          setPageKey((k) => k + 1);
          setPicking(null);
        }, 280);
      }, 130);
    },
    [picking, schedule, setLocale],
  );

  const goPage = useCallback((next: number, dir: 1 | -1) => {
    if (next < 0 || next >= SCREEN_COUNT) return;
    setSwipeDir(dir);
    setPage(next);
    setPageKey((k) => k + 1);
  }, []);

  const finish = useCallback(() => {
    completeOnboarding();
    setPhase("exiting");
    const reduce = prefersReducedMotion();
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
    if (dx < 0 && page < SCREEN_COUNT - 1) goPage(page + 1, 1);
    else if (dx > 0 && page > 0) goPage(page - 1, -1);
  };

  const showLanguage = phase === "language" || phase === "crossing";
  const showIntro = phase === "intro" || phase === "exiting" || phase === "crossing";
  const lastPage = page === SCREEN_COUNT - 1;

  return (
    <div
      className={cn(
        "tl-onboard fixed inset-0 z-[80] flex flex-col overflow-hidden bg-paper text-ink",
        phase === "exiting" && "tl-onboard-exit",
      )}
      role="dialog"
      aria-modal="true"
      aria-label={
        phase === "language" || phase === "crossing"
          ? "Choose your language"
          : "How it works"
      }
    >
      <div className="pointer-events-none absolute inset-0 tl-onboard-wash" aria-hidden />

      {showLanguage ? (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center px-6 pb-16 pt-10",
            phase === "crossing" && "tl-onboard-gate-out pointer-events-none",
          )}
        >
          <div
            className={cn(
              "tl-onboard-gate-hero flex flex-col items-center",
              gateReady && "tl-onboard-gate-ready",
            )}
          >
            <LiveSeal size={64} />
            <div className="tl-onboard-logo-hairline mt-5 w-16" aria-hidden />
            <h1 className="tl-onboard-gate-title font-display mt-5 text-center text-[1.375rem] font-semibold tracking-tight text-ink sm:text-2xl">
              {COPY.en.langTitle}
            </h1>
            <p className="tl-onboard-gate-sub mt-1.5 text-center text-[0.8125rem] text-muted">
              {COPY.en.langTitleEs}
            </p>
          </div>

          <div className="tl-onboard-lang-row mt-10 flex w-full max-w-sm flex-col gap-3 min-[360px]:max-w-md min-[360px]:flex-row min-[360px]:gap-3">
            {(
              [
                {
                  id: "en" as const,
                  label: COPY.en.enLabel,
                  sub: COPY.en.enSub,
                  delay: 0,
                },
                {
                  id: "es" as const,
                  label: COPY.en.esLabel,
                  sub: COPY.en.esSub,
                  delay: 1,
                },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => pickLocale(opt.id)}
                disabled={!!picking}
                className={cn(
                  "tl-onboard-lang-card group flex w-full flex-1 flex-col items-start rounded-xl border bg-surface px-5 py-4 text-left transition-[transform,background-color,border-color,box-shadow] duration-[90ms] ease-out",
                  "border-ink/[0.12] shadow-border",
                  "hover:border-oxblood/40 hover:bg-surface",
                  picking === opt.id && "tl-onboard-lang-press border-oxblood/50",
                  picking && picking !== opt.id && "opacity-60",
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

      {showIntro ? (
        <div
          className={cn(
            "relative flex min-h-0 flex-1 flex-col",
            phase === "crossing" && "tl-onboard-intro-in pointer-events-none",
          )}
        >
          <div className="px-6 pt-[max(1.25rem,env(safe-area-inset-top))]">
            <p
              className="text-center text-[0.6875rem] tabular-nums tracking-[0.06em] text-muted"
              aria-live="polite"
            >
              {copy.stepOf(page + 1, SCREEN_COUNT)}
            </p>
          </div>

          <div
            className="flex min-h-0 flex-1 flex-col px-6 pt-6 pb-4"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              key={pageKey}
              className={cn(
                "tl-onboard-page mx-auto flex w-full max-w-[360px] flex-1 flex-col",
                swipeDir > 0 ? "tl-onboard-page-fwd" : "tl-onboard-page-back",
              )}
            >
              <div className="flex min-h-[10.5rem] items-center justify-center">
                <ScreenVisual page={page} locale={locale} copy={copy} />
              </div>
              <h2 className="font-display mt-7 text-center text-2xl font-semibold tracking-tight text-ink">
                {copy.screens[page]?.title}
              </h2>
              <div className="tl-onboard-title-hairline mx-auto mt-3 w-10" aria-hidden />
              <p className="mt-3 text-center text-[0.9375rem] leading-relaxed text-muted">
                {copy.screens[page]?.body}
              </p>
              {copy.screens[page]?.hint ? (
                <p className="mt-2 text-center text-[0.8125rem] leading-snug text-faint">
                  {copy.screens[page]?.hint}
                </p>
              ) : null}
            </div>
          </div>

          <div className="shrink-0 border-t border-rule/80 bg-surface/80 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm">
            <div className="mx-auto flex max-w-[360px] items-center justify-between gap-2">
              <button
                type="button"
                className={cn(
                  "min-h-12 min-w-[4.5rem] rounded-md px-2 text-sm font-medium text-muted transition-colors hover:text-ink",
                  page === 0 && "invisible pointer-events-none",
                )}
                onClick={() => goPage(page - 1, -1)}
                tabIndex={page === 0 ? -1 : 0}
              >
                {copy.back}
              </button>

              <div className="flex items-center gap-1.5" aria-hidden>
                {Array.from({ length: SCREEN_COUNT }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "tl-onboard-dot rounded-full",
                      i === page ? "tl-onboard-dot-active bg-oxblood" : "bg-ink/20",
                    )}
                  />
                ))}
              </div>

              {!lastPage ? (
                <button
                  type="button"
                  className="min-h-12 min-w-[4.5rem] rounded-md px-2 text-sm font-semibold text-oxblood transition-colors hover:text-oxblood/80"
                  onClick={() => goPage(page + 1, 1)}
                >
                  {copy.next}
                </button>
              ) : (
                <button
                  type="button"
                  className="tl-onboard-begin min-h-12 rounded-xl bg-oxblood px-4 text-sm font-semibold text-oxblood-fg shadow-border active:opacity-[0.92]"
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
