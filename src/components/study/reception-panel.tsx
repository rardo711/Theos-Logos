import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Loader2, PanelRight, PanelRightClose, RotateCcw, Trash2, X } from "lucide-react";
import { askReception } from "@/lib/reception/ask";
import {
  additionalSourceCards,
  clearGeneratedNotesForChapter,
  clearGeneratedNotesForVerse,
  getDeskNotes,
  hasCachedNotesInChapter,
  isCardGenerated,
  markedVerses,
  rememberReception,
} from "@/lib/reception/notes";
import { getCurated, hasCurated } from "@/lib/reception/curated";
import { removeCached, saveCached } from "@/lib/reception/cache";
import { hasLexiconChip, lookupWordNow } from "@/lib/lexicon/stepbible";
import { t } from "@/lib/i18n";
import { localizeCaution } from "@/lib/i18n-sources";
import type { Chapter, LexiconResult, ReceptionResult, SourceCard as Card } from "@/lib/bible/types";
import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";
import { SourceCard } from "./source-card";

const STOP = new Set([
  "the", "and", "of", "to", "a", "in", "that", "is", "was", "he", "for", "it",
  "with", "as", "his", "on", "be", "at", "by", "this", "from", "or", "an", "are",
  "not", "but", "they", "you", "we", "him", "her", "them", "i", "my", "me",
  "their", "unto", "shall", "hath", "had", "have", "been", "were", "who", "whom",
  "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "al", "y",
  "o", "que", "en", "es", "se", "no", "por", "con", "para", "como", "mas", "más",
  "su", "sus", "lo", "le", "les", "ya", "si", "sí", "pero", "porque", "cuando",
  "este", "esta", "estos", "estas", "eso", "esa", "hay", "ser", "son", "fue",
  "era", "muy", "sin", "sobre", "entre", "hasta", "desde",
]);

function wordChips(text: string, reference: string): string[] {
  const words = text
    .replace(/[“”‘’]/g, "")
    .split(/[^\p{L}-]+/u)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOP.has(w.toLowerCase()));
  const seen = new Set<string>();
  const out: string[] = [];
  for (const w of words) {
    const key = w.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    if (!hasLexiconChip(w, reference)) continue;
    out.push(w);
    if (out.length >= 8) break;
  }
  return out;
}

export function ReceptionPanel({
  chapter,
  onClose,
}: {
  chapter: Chapter | null;
  onClose?: () => void;
}) {
  const selectedVerse = useStudy((s) => s.selectedVerse);
  const setVerse = useStudy((s) => s.setVerse);
  const disclaimerSeen = useStudy((s) => s.disclaimerSeen);
  const dismissDisclaimer = useStudy((s) => s.dismissDisclaimer);
  const touchNotes = useStudy((s) => s.touchNotes);
  const notesRev = useStudy((s) => s.notesRev);
  const receptionPinned = useStudy((s) => s.receptionPinned);
  const setReceptionPinned = useStudy((s) => s.setReceptionPinned);
  const locale = useStudy((s) => s.locale);
  const [question, setQuestion] = useState("");
  const [aimOpen, setAimOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReceptionResult | null>(null);
  const resultRef = useRef<ReceptionResult | null>(null);
  resultRef.current = result;
  const [lexicon, setLexicon] = useState<LexiconResult | null>(null);

  const verse = chapter?.verses.find((v) => v.verse === selectedVerse) ?? null;
  const reference =
    chapter == null
      ? ""
      : selectedVerse != null
        ? `${chapter.bookName} ${chapter.chapter}:${selectedVerse}`
        : `${chapter.bookName} ${chapter.chapter}`;
  const chips = useMemo(
    () => (verse ? wordChips(verse.text, reference) : []),
    [verse, reference],
  );
  const marked = useMemo(
    () => (chapter ? markedVerses(chapter.bookId, chapter.chapter) : []),
    [chapter, notesRev],
  );

  useEffect(() => {
    setLexicon(null);
    setError(null);
    setQuestion("");
    setAimOpen(false);
    if (chapter && selectedVerse != null) {
      setResult(getDeskNotes(chapter.bookId, chapter.chapter, selectedVerse));
    } else if (chapter) {
      setResult(getDeskNotes(chapter.bookId, chapter.chapter, null));
    } else {
      setResult(null);
    }
  }, [chapter, selectedVerse]);

  async function run(mode: "reception" | "traditions") {
    if (!chapter) return;
    const focus = question.trim();
    const emptyInquire = mode === "reception" && !focus;
    const prior = resultRef.current;

    // If empty inquire and we already have curated cards for this exact verse on desk, show them cleanly
    if (emptyInquire && prior?.cards.length && prior.source === "curated") {
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setLexicon(null);
    try {
      const data = await askReception({
        data: {
          bookId: chapter.bookId,
          bookName: chapter.bookName,
          chapter: chapter.chapter,
          verse: selectedVerse,
          verseText: verse?.text ?? "",
          passage: chapter.verses
            .slice(0, 12)
            .map((v) => `${v.verse} ${v.text}`)
            .join("\n"),
          question: focus || undefined,
          mode,
          locale,
          haveCards:
            (focus || mode === "traditions") && prior?.cards.length
              ? prior.cards.map((c) => ({
                  voice: c.voice,
                  citation: c.citation,
                  quote: c.quote,
                  url: c.url,
                }))
              : undefined,
        },
      });

      let next = data;
      if (data.source === "curated") {
        // Direct established primary sources addressing the question or verse
        next = data;
      } else if (Boolean(prior?.cards.length) && (mode === "traditions" || Boolean(focus))) {
        const added = additionalSourceCards(prior.cards, data.cards);
        if (!added.length && !data.cards.length) {
          throw new Error("NO_MORE");
        }
        next = {
          source: data.source,
          cards: added.length ? [...prior.cards, ...added] : data.cards,
          caution: data.caution ?? prior.caution,
        };
      }

      setResult(next);
      if (selectedVerse != null && next.cards.length) {
        rememberReception(
          chapter.bookId,
          chapter.chapter,
          selectedVerse,
          next,
        );
        touchNotes();
      }
    } catch (err) {
      setError(
        err instanceof Error && err.message === "NO_MORE"
          ? t(locale, "noMore")
          : t(locale, "receptionFailed"),
      );
    } finally {
      setLoading(false);
    }
  }

  function runLexicon(word: string) {
    setError(null);
    setLexicon(lookupWordNow(word, reference));
  }

  const hasGeneratedCards = useMemo(() => {
    if (!result || !chapter || selectedVerse == null) return false;
    return result.cards.some((c) =>
      isCardGenerated(c, chapter.bookId, chapter.chapter, selectedVerse),
    );
  }, [result, chapter, selectedVerse]);

  const hasCuratedForVerse = useMemo(() => {
    if (!chapter || selectedVerse == null) return false;
    return hasCurated(chapter.bookId, chapter.chapter, selectedVerse);
  }, [chapter, selectedVerse]);

  function handleRemoveCard(cardToRemove: Card) {
    if (!chapter || selectedVerse == null || !result) return;
    const newCards = result.cards.filter(
      (c) =>
        !(
          c.voice === cardToRemove.voice &&
          c.citation === cardToRemove.citation &&
          c.quote.trim().slice(0, 50) === cardToRemove.quote.trim().slice(0, 50)
        ),
    );

    const curated = getCurated(chapter.bookId, chapter.chapter, selectedVerse);
    const hasAnyCurated = curated && curated.cards.length > 0;
    const remainingGenerated = newCards.filter((c) =>
      isCardGenerated(c, chapter.bookId, chapter.chapter, selectedVerse),
    );

    if (newCards.length === 0) {
      removeCached(chapter.bookId, chapter.chapter, selectedVerse);
      setResult(hasAnyCurated ? curated : null);
    } else if (remainingGenerated.length === 0 && hasAnyCurated) {
      removeCached(chapter.bookId, chapter.chapter, selectedVerse);
      setResult({
        ...curated,
        cards: newCards,
      });
    } else {
      const updated: ReceptionResult = {
        ...result,
        cards: newCards,
        source: remainingGenerated.length > 0 ? "generated" : "curated",
      };
      saveCached(chapter.bookId, chapter.chapter, selectedVerse, updated);
      setResult(updated);
    }
    touchNotes();
  }

  function handleRemoveAllGenerated() {
    if (!chapter || selectedVerse == null) return;
    const restored = clearGeneratedNotesForVerse(
      chapter.bookId,
      chapter.chapter,
      selectedVerse,
    );
    setResult(restored);
    setError(null);
    touchNotes();
  }

  function handleClearChapterGenerated() {
    if (!chapter) return;
    clearGeneratedNotesForChapter(chapter.bookId, chapter.chapter);
    if (selectedVerse != null) {
      setResult(getDeskNotes(chapter.bookId, chapter.chapter, selectedVerse));
    }
    touchNotes();
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-paper">
      <header className="relative z-10 flex items-start justify-between gap-3 border-b border-rule px-5 py-3">
        <div className="min-w-0 pt-1">
          <p className="text-2xs font-semibold tracking-[0.14em] text-faint uppercase">
            {t(locale, "reception")}
          </p>
          <h2 className="font-display truncate text-lg font-semibold text-ink">
            {selectedVerse != null ? reference : t(locale, "historicVoices")}
          </h2>
        </div>
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={() => setReceptionPinned(!receptionPinned)}
            className="hidden size-11 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-ink xl:flex"
            aria-label={
              receptionPinned
                ? t(locale, "collapseSources")
                : t(locale, "keepSources")
            }
            title={
              receptionPinned
                ? t(locale, "collapseSources")
                : t(locale, "keepSources")
            }
          >
            {receptionPinned ? (
              <PanelRightClose size={18} />
            ) : (
              <PanelRight size={18} />
            )}
          </button>
          {onClose ? (
            <button
              type="button"
              onClick={() => {
                setReceptionPinned(false);
                onClose();
              }}
              className="flex size-11 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-ink"
              aria-label={t(locale, "closeReception")}
            >
              <X size={18} />
            </button>
          ) : null}
        </div>
      </header>

      <div className="tl-scroll min-h-0 flex-1 overflow-y-auto px-5 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        {!disclaimerSeen ? (
          <div className="mb-4 rounded-lg border border-rule bg-surface p-3 shadow-soft">
            <p className="text-sm leading-relaxed text-muted">
              {t(locale, "disclaimer")}
            </p>
            <button
              type="button"
              onClick={dismissDisclaimer}
              className="mt-2 min-h-11 text-xs font-semibold tracking-wide text-oxblood uppercase"
            >
              {t(locale, "understood")}
            </button>
          </div>
        ) : null}

        {selectedVerse == null ? (
          <div className="flex flex-col items-start gap-4 py-6">
            <p className="font-display text-xl text-ink">{t(locale, "markVerse")}</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              {t(locale, "receptionHint")}
            </p>
            {marked.length > 0 ? (
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-2xs font-semibold tracking-[0.14em] text-faint uppercase">
                    {t(locale, "notesOnChapter")}
                  </p>
                  {hasCachedNotesInChapter(chapter.bookId, chapter.chapter) ? (
                    <button
                      type="button"
                      onClick={handleClearChapterGenerated}
                      className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-2xs font-medium text-muted hover:bg-oxblood-soft hover:text-oxblood transition-colors"
                      title={t(locale, "clearChapterGenerated")}
                    >
                      <Trash2 size={11} />
                      <span>{t(locale, "clearChapterGenerated")}</span>
                    </button>
                  ) : null}
                </div>
                <p className="mb-2 text-sm text-muted">
                  {t(locale, "markedOpen")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {marked.map((n) => {
                    const isGenOnly = !hasCurated(chapter.bookId, chapter.chapter, n);
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setVerse(n)}
                        className={cn(
                          "min-h-11 rounded-md border px-3 text-sm font-semibold transition-colors",
                          isGenOnly
                            ? "border-dashed border-rule bg-surface/80 text-ink hover:border-oxblood hover:text-oxblood"
                            : "border-rule bg-surface text-ink hover:border-oxblood hover:text-oxblood",
                        )}
                        title={isGenOnly ? t(locale, "generatedBadge") : t(locale, "curatedBadge")}
                      >
                        v. {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted italic">
                {t(locale, "noNotesYet")}
              </p>
            )}
          </div>
        ) : (
          <>
            {verse ? (
              <p className="mb-5 border-l-[3px] border-oxblood pl-3 font-serif text-base leading-relaxed text-ink italic">
                {verse.text}
              </p>
            ) : null}

            {chips.length > 0 ? (
              <div className="mb-4">
                <p className="mb-2 text-2xs font-semibold tracking-[0.14em] text-faint uppercase">
                  {t(locale, "lexicon")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {chips.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => runLexicon(w)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm",
                        lexicon?.word.toLowerCase() === w.toLowerCase()
                          ? "border-oxblood bg-oxblood-soft text-oxblood"
                          : "border-rule bg-surface text-ink hover:border-oxblood hover:text-oxblood",
                      )}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {lexicon ? (
              <article className="mb-5 rounded-lg border border-rule bg-surface p-4 shadow-soft">
                <p className="text-2xs font-semibold tracking-[0.14em] text-faint uppercase">
                  {[lexicon.language, lexicon.strongs]
                    .filter(Boolean)
                    .join(" · ") || t(locale, "lexicalNote")}
                </p>
                <h3 className="font-display mt-1 text-lg font-semibold text-ink">
                  {lexicon.word}
                  {lexicon.lemma ? (
                    <span className="ml-2 font-serif text-base font-normal text-muted italic">
                      {lexicon.lemma}
                    </span>
                  ) : null}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink">
                  {lexicon.gloss}
                </p>
                {lexicon.range ? (
                  <p className="mt-2 text-sm text-muted">{lexicon.range}</p>
                ) : null}
                <p className="mt-3 text-2xs text-faint">
                  {[lexicon.citation, lexicon.caution].filter(Boolean).join(" · ")}
                </p>
              </article>
            ) : null}

            {loading ? (
              <p className="mb-4 flex items-center gap-2 font-serif text-sm text-muted italic">
                <Loader2 size={14} className="animate-spin text-oxblood" />
                {t(locale, "consulting")}
              </p>
            ) : null}

            {error ? (
              <p className="mb-4 rounded-md border border-oxblood/30 bg-oxblood-soft px-3 py-2 text-sm text-oxblood">
                {error}
              </p>
            ) : null}

            {result?.cards.length ? (
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-2xs font-semibold tracking-[0.14em] text-faint uppercase">
                    {result.source === "curated" && !hasGeneratedCards
                      ? t(locale, "deskNotes")
                      : t(locale, "gathered")}
                  </p>
                  {hasGeneratedCards ? (
                    <button
                      type="button"
                      onClick={handleRemoveAllGenerated}
                      className="inline-flex items-center gap-1 rounded-sm px-2 py-1 text-2xs font-medium tracking-wide text-muted hover:bg-oxblood-soft hover:text-oxblood transition-colors"
                      title={
                        hasCuratedForVerse
                          ? t(locale, "resetToDeskNotes")
                          : t(locale, "removeGenerated")
                      }
                    >
                      {hasCuratedForVerse ? (
                        <RotateCcw size={12} />
                      ) : (
                        <Trash2 size={12} />
                      )}
                      <span>
                        {hasCuratedForVerse
                          ? t(locale, "resetToDeskNotes")
                          : t(locale, "removeGenerated")}
                      </span>
                    </button>
                  ) : null}
                </div>
                {result.cards.map((card, i) => {
                  const gen = isCardGenerated(
                    card,
                    chapter.bookId,
                    chapter.chapter,
                    selectedVerse,
                  );
                  return (
                    <SourceCard
                      key={`${card.voice}-${card.citation}-${i}`}
                      card={card}
                      isGenerated={gen}
                      onRemove={gen ? () => handleRemoveCard(card) : undefined}
                    />
                  );
                })}
                {result.caution ? (
                  <p className="pt-1 text-2xs leading-relaxed text-faint italic">
                    {localizeCaution(result.caution, locale)}
                  </p>
                ) : null}
              </div>
            ) : null}

            {result && result.cards.length === 0 && result.caution ? (
              <p className="mb-4 text-sm text-muted italic">{localizeCaution(result.caution, locale)}</p>
            ) : null}

            {!result?.cards.length && !loading ? (
              <p className="mb-4 text-sm leading-relaxed text-muted">
                {t(locale, "noNotesInquire")}
              </p>
            ) : null}

            <div className="border-t border-rule pt-3">
              <button
                type="button"
                onClick={() => setAimOpen((v) => !v)}
                className="flex min-h-11 w-full items-center justify-between text-left text-2xs font-semibold tracking-[0.14em] text-faint uppercase"
              >
                {t(locale, "aim")}
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-200",
                    aimOpen && "rotate-180",
                  )}
                />
              </button>
              {aimOpen ? (
                <form
                  className="pt-2 pb-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void run("reception");
                  }}
                >
                  <label className="sr-only" htmlFor="ask-verse">
                    {t(locale, "aim")}
                  </label>
                  <input
                    id="ask-verse"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t(locale, "aimPlaceholder")}
                    className="w-full rounded-md border border-rule bg-surface px-3 py-2.5 text-base text-ink outline-none placeholder:italic placeholder:text-faint focus:border-oxblood"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="min-h-11 rounded-md bg-oxblood px-4 text-xs font-semibold tracking-wide text-oxblood-fg uppercase disabled:opacity-60"
                    >
                      {loading ? t(locale, "consultingShort") : t(locale, "inquire")}
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => void run("traditions")}
                      className="min-h-11 rounded-md border border-rule px-4 text-xs font-semibold tracking-wide text-ink uppercase hover:border-ink/30 disabled:opacity-60"
                    >
                      {t(locale, "compare")}
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function VerseHint({
  onInquire,
  noted,
}: {
  onInquire: () => void;
  noted?: boolean;
}) {
  const selected = useStudy((s) => s.selectedVerse);
  const receptionOpen = useStudy((s) => s.receptionOpen);
  const receptionPinned = useStudy((s) => s.receptionPinned);
  const locale = useStudy((s) => s.locale);
  if (selected == null || receptionOpen || receptionPinned) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="tl-hint pointer-events-auto flex items-center gap-1 rounded-md border border-rule bg-surface px-1.5 py-1 shadow-soft">
        <span className="px-2.5 font-serif text-sm font-medium text-oxblood tabular-nums">
          {selected}
        </span>
        <button
          type="button"
          onClick={onInquire}
          className="rounded-sm bg-oxblood px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-oxblood-fg uppercase transition-transform duration-150 ease-out active:scale-[0.96]"
        >
          {noted ? t(locale, "deskNotes") : t(locale, "sources")}
        </button>
      </div>
    </div>
  );
}
