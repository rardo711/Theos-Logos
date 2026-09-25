import { useEffect, useMemo, useRef, useState } from "react";
import { BookMarked, ChevronDown, ChevronUp, Highlighter, Loader2, Maximize2, Minimize2, PanelRight, PanelRightClose, RotateCcw, Send, Trash2, X } from "lucide-react";
import {
  askReception,
  gatherCommentaries,
  synthesizeFromCards,
} from "@/lib/reception/ask";
import {
  clearGeneratedNotesForChapter,
  clearGeneratedNotesForVerse,
  getDeskNotes,
  hasCachedNotesInChapter,
  isCardGenerated,
  isUncachedCuratedDesk,
  markedVerses,
  mergeReceptionCards,
  rememberReception,
} from "@/lib/reception/notes";
import { getCurated, hasCurated } from "@/lib/reception/curated";
import { getCached, removeCached, saveCached } from "@/lib/reception/cache";
import {
  hasLexiconChip,
  isOtReference,
  lookupWordNow,
} from "@/lib/lexicon/stepbible";
import {
  hasHebrewBdbChip,
  lookupHebrewBdbByStrongs,
  lookupHebrewBdbWordNow,
  type HebrewBdbResult,
} from "@/lib/lexicon/hebrew-bdb";
import {
  hasSpanishHebrewChip,
  lookupSpanishHebrewByStrongs,
  lookupSpanishHebrewWordNow,
  type SpanishHebrewResult,
} from "@/lib/lexicon/spanish-hebrew";
import {
  hasSpanishLexiconChip,
  lookupSpanishByStrongs,
  lookupSpanishWordNow,
  type SpanishLexiconResult,
} from "@/lib/lexicon/spanish";
import {
  hasEnglishLexiconChip,
  lookupEnglishByStrongs,
  lookupEnglishWordNow,
  type EnglishLexiconResult,
} from "@/lib/lexicon/english";
import { formatReference } from "@/lib/bible/reference";
import { bookName, getBook } from "@/lib/bible/books";
import { t, traditionLabel } from "@/lib/i18n";
import { localizeCaution } from "@/lib/i18n-sources";
import {
  rangeIsHighlighted,
  toggleHighlights,
} from "@/lib/study/highlights";
import type { Chapter, DeskSynthesis, LexiconResult, ReceptionResult, SourceCard as Card, Tradition } from "@/lib/bible/types";
import { useStudy } from "@/lib/study-store";
import { cn } from "@/lib/utils";
import { SourceCard } from "./source-card";
import { SpanishGlossCard } from "./spanish-gloss-card";
import { EnglishGlossCard } from "./english-gloss-card";
import { HebrewBdbCard } from "./hebrew-bdb-card";
import { SpanishHebrewCard } from "./spanish-hebrew-card";

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

function wordChips(
  text: string,
  reference: string,
  locale: "en" | "es",
  isOt: boolean,
): string[] {
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
    const hit =
      locale === "es"
        ? hasSpanishLexiconChip(w) || (isOt && hasSpanishHebrewChip(w))
        : hasLexiconChip(w, reference) ||
          (!isOtReference(reference) && hasEnglishLexiconChip(w)) ||
          (isOtReference(reference) && hasHebrewBdbChip(w));
    if (!hit) continue;
    out.push(w);
    if (out.length >= 8) break;
  }
  return out;
}

export function ReceptionPanel({
  chapter,
  onClose,
  sheet,
  detent = "full",
}: {
  chapter: Chapter | null;
  onClose?: () => void;
  sheet?: boolean;
  detent?: "peek" | "mid" | "full";
}) {
  const selectedVerse = useStudy((s) => s.selectedVerse);
  const selectedEndVerse = useStudy((s) => s.selectedEndVerse);
  const setVerse = useStudy((s) => s.setVerse);
  const disclaimerSeen = useStudy((s) => s.disclaimerSeen);
  const dismissDisclaimer = useStudy((s) => s.dismissDisclaimer);
  const touchNotes = useStudy((s) => s.touchNotes);
  const notesRev = useStudy((s) => s.notesRev);
  const highlightsRev = useStudy((s) => s.highlightsRev);
  const touchHighlights = useStudy((s) => s.touchHighlights);
  const receptionPinned = useStudy((s) => s.receptionPinned);
  const setReceptionPinned = useStudy((s) => s.setReceptionPinned);
  const setReceptionOpen = useStudy((s) => s.setReceptionOpen);
  const setReceptionFull = useStudy((s) => s.setReceptionFull);
  const setSourcesPageOpen = useStudy((s) => s.setSourcesPageOpen);
  const clearSelection = useStudy((s) => s.clearSelection);
  const locale = useStudy((s) => s.locale);
  const [question, setQuestion] = useState("");
  const [selectedTradition, setSelectedTradition] = useState<Tradition | "all">("all");
  const [showAll, setShowAll] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [gatherState, setGatherState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [loading, setLoading] = useState(false);
  const [loadingKind, setLoadingKind] = useState<"commentaries" | "question" | "summary" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReceptionResult | null>(null);
  /** Verse-question answers live right under the question box; the summary
      has its own slot below the More/Summary row. Independent of each other. */
  const [qa, setQa] = useState<DeskSynthesis | null>(null);
  const [qaOpen, setQaOpen] = useState(false);
  const [qaError, setQaError] = useState<string | null>(null);
  const [summary, setSummary] = useState<DeskSynthesis | null>(null);
  const resultRef = useRef<ReceptionResult | null>(null);
  resultRef.current = result;
  /** Bump when commentary cards merge; the summary is fresh only on its own version. */
  const cardsVersion = useRef(0);
  const synthesisCardsVersion = useRef(-1);
  const [lexicon, setLexicon] = useState<LexiconResult | null>(null);
  const [spanishLexicon, setSpanishLexicon] =
    useState<SpanishLexiconResult | null>(null);
  const [englishLexicon, setEnglishLexicon] =
    useState<EnglishLexiconResult | null>(null);
  const [hebrewBdb, setHebrewBdb] = useState<HebrewBdbResult | null>(null);
  const [spanishHebrew, setSpanishHebrew] =
    useState<SpanishHebrewResult | null>(null);
  /** Bump after clearing ES cache so curated desks re-run NMT. */
  const [curatedNmtKick, setCuratedNmtKick] = useState(0);

  const verse = chapter?.verses.find((v) => v.verse === selectedVerse) ?? null;
  const highlighted = useMemo(() => {
    if (!chapter || selectedVerse == null) return false;
    return rangeIsHighlighted(
      chapter.bookId,
      chapter.chapter,
      selectedVerse,
      selectedEndVerse ?? selectedVerse,
    );
  }, [chapter, selectedVerse, selectedEndVerse, highlightsRev]);
  const reference =
    chapter == null
      ? ""
      : formatReference(
          chapter.bookName,
          chapter.chapter,
          selectedVerse,
          selectedEndVerse,
        );
  /**
   * The whole selected passage, not just its first verse. parseSynthesis
   * validates quoted spans against the desk cards plus this text, so sending
   * only the anchor verse would reject an answer that quotes the middle of the
   * range -- the same false rejection that was fixed for single verses.
   */
  const selectionText = useMemo(() => {
    if (!chapter || selectedVerse == null) return "";
    const end = selectedEndVerse ?? selectedVerse;
    return chapter.verses
      .filter((v) => v.verse >= selectedVerse && v.verse <= end)
      .map((v) => v.text)
      .join(" ");
  }, [chapter, selectedVerse, selectedEndVerse]);
  // Locale-independent OT check: isOtReference() only matches English
  // book names, but `reference` is localized in es UI.
  const isOtBook =
    chapter != null && getBook(chapter.bookId).testament === "ot";
  const chips = useMemo(
    () =>
      selectionText
        ? wordChips(selectionText, reference, locale, isOtBook)
        : verse
          ? wordChips(verse.text, reference, locale, isOtBook)
          : [],
    [selectionText, verse, reference, locale, isOtBook],
  );
  const marked = useMemo(
    () => (chapter ? markedVerses(chapter.bookId, chapter.chapter) : []),
    [chapter, notesRev],
  );
  /** Traditions actually present on this verse's cards, with counts. */
  const traditionCounts = useMemo(() => {
    const order: Tradition[] = [
      "patristic",
      "eastern-patristic",
      "western-patristic",
      "scholastic",
      "puritan",
      "arminian",
      "reformed",
      "lutheran",
      "catholic",
      "orthodox",
      "confession",
    ];
    const counts = new Map<Tradition, number>();
    for (const c of result?.cards ?? []) {
      if (!c.tradition) continue;
      counts.set(c.tradition, (counts.get(c.tradition) ?? 0) + 1);
    }
    return order
      .filter((tr) => counts.has(tr))
      .map((tr) => ({ tradition: tr, count: counts.get(tr) ?? 0 }));
  }, [result]);
  /** Selected tradition, falling back to all when it has no cards left. */
  const effectiveTradition =
    selectedTradition === "all" ||
    traditionCounts.some(({ tradition }) => tradition === selectedTradition)
      ? selectedTradition
      : "all";
  const filteredCards = useMemo(() => {
    const cards = result?.cards ?? [];
    return effectiveTradition === "all"
      ? cards
      : cards.filter((c) => c.tradition === effectiveTradition);
  }, [result, effectiveTradition]);
  const visibleCards = filteredCards.slice(0, 3);
  const hiddenCards = filteredCards.slice(3);
  /** More button shows when hidden cards exist, the gather may still add more,
      or the desk is empty (then it gathers visibly). */
  const canExpandMore =
    hiddenCards.length > 0 ||
    gatherState !== "done" ||
    (result?.cards.length ?? 0) === 0;

  useEffect(() => {
    setLexicon(null);
    setSpanishLexicon(null);
    setEnglishLexicon(null);
    setHebrewBdb(null);
    setSpanishHebrew(null);
    setError(null);
    setQuestion("");
    setSelectedTradition("all");
    setShowAll(false);
    setSummaryOpen(false);
    setGatherState("idle");
    setQa(null);
    setQaOpen(false);
    setQaError(null);
    setSummary(null);
    setLoadingKind(null);
    let cancelled = false;

    if (chapter && selectedVerse != null) {
      const desk = getDeskNotes(
        chapter.bookId,
        chapter.chapter,
        selectedVerse,
        selectedEndVerse,
        locale,
      );
      setResult(desk);

      // Curated desks load from client English getCurated; localizeCard only
      // maps voice/work chrome. When locale=es with no ES cache, NMT quote
      // bodies via the same server path as AI cards, then cache by locale.
      const needsCuratedNmt =
        locale === "es" &&
        isUncachedCuratedDesk(
          chapter.bookId,
          chapter.chapter,
          selectedVerse,
          selectedEndVerse,
          locale,
          desk,
        );

      if (needsCuratedNmt && desk) {
        const verseText = selectionText || (verse?.text ?? "");
        void (async () => {
          try {
            const data = await askReception({
              data: {
                bookId: chapter.bookId,
                bookName: chapter.bookName,
                chapter: chapter.chapter,
                verse: selectedVerse,
                verseEnd: selectedEndVerse,
                verseText,
                passage: chapter.verses
                  .slice(0, 12)
                  .map((v) => `${v.verse} ${v.text}`)
                  .join("\n"),
                mode: "reception",
                locale: "es",
              },
            });
            if (cancelled || !data.cards.length) return;
            // Only apply if still on the same verse/locale and still uncached.
            if (
              getCached(
                chapter.bookId,
                chapter.chapter,
                selectedVerse,
                selectedEndVerse,
                "es",
              )
            ) {
              return;
            }
            setResult(data);
            rememberReception(
              chapter.bookId,
              chapter.chapter,
              selectedVerse,
              data,
              selectedEndVerse,
              "es",
            );
            touchNotes();
          } catch {
            /* keep English curated until gather */
          }
        })();
      }

      // Silent preload: gather the full commentary set in the background so
      // "More commentaries" unfolds instantly. Stays silent: no spinner, no
      // lexicon clearing, no error text. Failures set gatherState=error and
      // the More button retries visibly. Skipped while the ES NMT round-trip
      // above is in flight so the two do not race.
      if (desk && !needsCuratedNmt) {
        setGatherState("loading");
        void (async () => {
          try {
            const data = await gatherCommentaries({
              data: {
                bookId: chapter.bookId,
                bookName: chapter.bookName,
                chapter: chapter.chapter,
                verse: selectedVerse,
                verseEnd: selectedEndVerse,
                verseText: selectionText || (verse?.text ?? ""),
                passage: chapter.verses
                  .slice(0, 12)
                  .map((v) => `${v.verse} ${v.text}`)
                  .join("\n"),
                mode: "reception",
                locale,
                haveCards: desk.cards.length
                  ? desk.cards.map((c) => ({
                      voice: c.voice,
                      citation: c.citation,
                      quote: c.quote,
                      url: c.url,
                    }))
                  : undefined,
              },
            });
            if (cancelled) return;
            const merged = desk.cards.length
              ? mergeReceptionCards(desk.cards, data.cards)
              : { cards: data.cards, addedCount: data.cards.length };
            const quotesRefreshed =
              Boolean(desk.cards.length) &&
              merged.cards.some(
                (c, i) => desk.cards[i] && c.quote !== desk.cards[i].quote,
              );
            if (
              !desk.cards.length ||
              merged.addedCount > 0 ||
              quotesRefreshed
            ) {
              const next: ReceptionResult = desk.cards.length
                ? {
                    source:
                      merged.addedCount || data.source === "generated"
                        ? data.source
                        : desk.source,
                    cards: merged.cards,
                    caution: data.caution ?? desk.caution,
                  }
                : data;
              setResult(next);
              if (selectedVerse != null && next.cards.length) {
                rememberReception(
                  chapter.bookId,
                  chapter.chapter,
                  selectedVerse,
                  next,
                  selectedEndVerse,
                  locale,
                );
                touchNotes();
              }
            }
            cardsVersion.current += 1;
            setGatherState("done");
          } catch {
            if (!cancelled) setGatherState("error");
          }
        })();
      }
    } else if (chapter) {
      setResult(getDeskNotes(chapter.bookId, chapter.chapter, null, null, locale));
    } else {
      setResult(null);
    }

    return () => {
      cancelled = true;
    };
  }, [chapter, selectedVerse, selectedEndVerse, locale, selectionText, verse?.text, touchNotes, curatedNmtKick]);

  async function runCommentaries() {
    if (!chapter) return;
    const prior = resultRef.current;
    setLoading(true);
    setLoadingKind("commentaries");
    setGatherState("loading");
    setError(null);
    setLexicon(null);
    setSpanishLexicon(null);
    setEnglishLexicon(null);
    setHebrewBdb(null);
    setSpanishHebrew(null);
    setQa(null);
    setQaOpen(false);
    setQaError(null);
    setSummary(null);
    setSummaryOpen(false);
    try {
      const data = await gatherCommentaries({
        data: {
          bookId: chapter.bookId,
          bookName: chapter.bookName,
          chapter: chapter.chapter,
          verse: selectedVerse,
          verseEnd: selectedEndVerse,
          verseText: selectionText || (verse?.text ?? ""),
          passage: chapter.verses
            .slice(0, 12)
            .map((v) => `${v.verse} ${v.text}`)
            .join("\n"),
          mode: "reception",
          locale,
          haveCards: prior?.cards.length
            ? prior.cards.map((c) => ({
                voice: c.voice,
                citation: c.citation,
                quote: c.quote,
                url: c.url,
              }))
            : undefined,
        },
      });
      // Prefer server bodies for matching cites so ES NMT replaces EN curated
      // quotes that were shown from client getCurated before this round-trip.
      const merged = prior?.cards.length
        ? mergeReceptionCards(prior.cards, data.cards)
        : { cards: data.cards, addedCount: data.cards.length };
      const quotesRefreshed =
        Boolean(prior?.cards.length) &&
        merged.cards.some(
          (c, i) => prior!.cards[i] && c.quote !== prior!.cards[i].quote,
        );
      if (
        prior?.cards.length &&
        merged.addedCount === 0 &&
        !quotesRefreshed
      ) {
        throw new Error("NO_MORE");
      }
      const next: ReceptionResult = prior?.cards.length
        ? {
            source:
              merged.addedCount || data.source === "generated"
                ? data.source
                : prior.source,
            cards: merged.cards,
            caution: data.caution ?? prior.caution,
          }
        : data;
      setResult(next);
      if (selectedVerse != null && next.cards.length) {
        rememberReception(
          chapter.bookId,
          chapter.chapter,
          selectedVerse,
          next,
          selectedEndVerse,
          locale,
        );
        touchNotes();
      }
      cardsVersion.current += 1;
      setGatherState("done");
    } catch (err) {
      const noMore = err instanceof Error && err.message === "NO_MORE";
      setGatherState(noMore ? "done" : "error");
      setError(
        noMore ? t(locale, "noMore") : t(locale, "receptionFailed"),
      );
    } finally {
      setLoading(false);
      setLoadingKind(null);
    }
  }

  async function runSynthesis(questionText: string) {
    if (!chapter) return;
    const isQuestion = questionText.trim().length > 0;
    const cards = resultRef.current?.cards ?? [];
    if (!cards.length) {
      const msg = t(locale, "needCommentariesFirst");
      if (isQuestion) {
        setQaError(msg);
        setQa(null);
      } else {
        setError(msg);
        setSummary(null);
      }
      return;
    }
    setLoading(true);
    setLoadingKind(isQuestion ? "question" : "summary");
    if (isQuestion) {
      setQaError(null);
    } else {
      setError(null);
    }
    setLexicon(null);
    setSpanishLexicon(null);
    setEnglishLexicon(null);
    setHebrewBdb(null);
    setSpanishHebrew(null);
    try {
      const data = await synthesizeFromCards({
        data: {
          bookName: chapter.bookName,
          chapter: chapter.chapter,
          verse: selectedVerse,
          verseEnd: selectedEndVerse,
          verseText: selectionText || (verse?.text ?? ""),
          question: questionText.trim() || undefined,
          locale,
          cards,
        },
      });
      if (!data.answer) {
        const msg = data.caution || t(locale, "synthesisFailed");
        if (isQuestion) {
          setQaError(msg);
          setQa(null);
        } else {
          setError(msg);
          setSummary(null);
        }
        return;
      }
      if (isQuestion) {
        setQa({
          question: data.question,
          answer: data.answer,
          cited: data.cited,
        });
      } else {
        setSummary({
          question: data.question,
          answer: data.answer,
          cited: data.cited,
        });
        synthesisCardsVersion.current = cardsVersion.current;
      }
      if (data.caution && resultRef.current) {
        setResult({ ...resultRef.current, caution: data.caution });
      }
    } catch {
      const msg = t(locale, "synthesisFailed");
      if (isQuestion) {
        setQaError(msg);
        setQa(null);
      } else {
        setError(msg);
        setSummary(null);
      }
    } finally {
      setLoading(false);
      setLoadingKind(null);
    }
  }

  /** Summary has its own slot now, independent of More and of the Q&A box:
      opening More no longer collapses a generated summary. */
  function handleSummary() {
    if (summaryOpen) {
      setSummaryOpen(false);
      return;
    }
    setSummaryOpen(true);
    // Re-run only when there is no fresh summary on the current cards.
    const fresh =
      summary != null &&
      synthesisCardsVersion.current === cardsVersion.current;
    if (!fresh) void runSynthesis("");
  }

  /** Reveal the remaining preloaded commentaries. With an empty desk or a
      failed gather, the button gathers visibly instead. */
  function handleMore() {
    if (showAll) {
      setShowAll(false);
      return;
    }
    if (gatherState === "loading") {
      setShowAll(true);
      return;
    }
    if (gatherState === "error" || (resultRef.current?.cards.length ?? 0) === 0) {
      setShowAll(true);
      void runCommentaries();
      return;
    }
    setShowAll(true);
  }

  function handleQuestionSubmit() {
    if (!question.trim() || loading) return;
    setQaOpen(true);
    void runSynthesis(question);
  }

  function runLexicon(word: string) {
    setError(null);
    if (locale === "es") {
      setLexicon(null);
      setEnglishLexicon(null);
      if (isOtBook) {
        // Spanish OT Hebrew card: Spanish layer first (chip words are
        // Spanish), then the BDB side by the resolved Strong's number.
        const heb = lookupSpanishHebrewWordNow(word);
        setSpanishLexicon(null);
        setSpanishHebrew(heb);
        setHebrewBdb(heb ? lookupHebrewBdbByStrongs(heb.strongs, reference) : null);
      } else {
        setHebrewBdb(null);
        setSpanishHebrew(null);
        setSpanishLexicon(lookupSpanishWordNow(word, reference));
      }
      return;
    }
    setSpanishLexicon(null);
    // UBS English NT lexicon first (NT Greek only); BDB Hebrew first for OT;
    // legacy STEPBible lookup stays as the fallback for both.
    const enHit = !isOtReference(reference)
      ? lookupEnglishWordNow(word, reference)
      : null;
    if (enHit) {
      setLexicon(null);
      setHebrewBdb(null);
      setSpanishHebrew(null);
      setEnglishLexicon(enHit);
      return;
    }
    const bdbHit = isOtReference(reference)
      ? lookupHebrewBdbWordNow(word, reference)
      : null;
    if (bdbHit) {
      setLexicon(null);
      setEnglishLexicon(null);
      setHebrewBdb(bdbHit);
      return;
    }
    setEnglishLexicon(null);
    setHebrewBdb(null);
    setSpanishHebrew(null);
    setLexicon(lookupWordNow(word, reference));
  }

  function runSpanishStrong(strongs: string) {
    setError(null);
    setLexicon(null);
    setEnglishLexicon(null);
    setHebrewBdb(null);
    setSpanishHebrew(null);
    setSpanishLexicon(lookupSpanishByStrongs(strongs, reference));
  }

  function runEnglishStrong(strongs: string) {
    setError(null);
    setLexicon(null);
    setSpanishLexicon(null);
    setHebrewBdb(null);
    setSpanishHebrew(null);
    setEnglishLexicon(lookupEnglishByStrongs(strongs, reference));
  }

  function runHebrewBdbStrong(strongs: string) {
    setError(null);
    setLexicon(null);
    setSpanishLexicon(null);
    setEnglishLexicon(null);
    setSpanishHebrew(null);
    setHebrewBdb(lookupHebrewBdbByStrongs(strongs, reference));
  }

  function runSpanishHebrewStrong(strongs: string) {
    setError(null);
    setLexicon(null);
    setSpanishLexicon(null);
    setEnglishLexicon(null);
    const heb = lookupSpanishHebrewByStrongs(strongs);
    setSpanishHebrew(heb);
    setHebrewBdb(heb ? lookupHebrewBdbByStrongs(strongs, reference) : null);
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

    const curated = getCurated(
      chapter.bookId,
      chapter.chapter,
      selectedVerse,
      selectedEndVerse,
    );
    const hasAnyCurated = curated && curated.cards.length > 0;
    const remainingGenerated = newCards.filter((c) =>
      isCardGenerated(c, chapter.bookId, chapter.chapter, selectedVerse),
    );

    if (newCards.length === 0) {
      removeCached(
        chapter.bookId,
        chapter.chapter,
        selectedVerse,
        selectedEndVerse,
        locale,
      );
      setResult(hasAnyCurated ? curated : null);
      if (locale === "es" && hasAnyCurated) setCuratedNmtKick((k) => k + 1);
    } else if (remainingGenerated.length === 0 && hasAnyCurated) {
      removeCached(
        chapter.bookId,
        chapter.chapter,
        selectedVerse,
        selectedEndVerse,
        locale,
      );
      setResult({
        ...curated,
        cards: newCards,
      });
      if (locale === "es") setCuratedNmtKick((k) => k + 1);
    } else {
      const updated: ReceptionResult = {
        ...result,
        cards: newCards,
        source: remainingGenerated.length > 0 ? "generated" : "curated",
      };
      saveCached(
        chapter.bookId,
        chapter.chapter,
        selectedVerse,
        updated,
        selectedEndVerse,
        locale,
      );
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
      selectedEndVerse,
      locale,
    );
    setResult(restored);
    setError(null);
    touchNotes();
    if (locale === "es" && restored?.cards.length) {
      setCuratedNmtKick((k) => k + 1);
    }
  }

  function handleClearChapterGenerated() {
    if (!chapter) return;
    clearGeneratedNotesForChapter(chapter.bookId, chapter.chapter);
    if (selectedVerse != null) {
      setResult(
        getDeskNotes(
          chapter.bookId,
          chapter.chapter,
          selectedVerse,
          selectedEndVerse,
          locale,
        ),
      );
    }
    touchNotes();
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col", sheet ? "bg-surface" : "bg-paper")}>
      <div
        data-sheet-chrome
        className={cn("shrink-0", sheet && detent === "peek" && "cursor-pointer")}
        onClick={
          sheet && detent === "peek" ? () => setReceptionOpen(true) : undefined
        }
      >
        {sheet ? (
          <div
            data-sheet-handle
            className="flex cursor-grab justify-center pt-3 pb-1 active:cursor-grabbing"
            aria-hidden
          >
            <span className="h-1 w-10 rounded-full bg-faint/55" />
          </div>
        ) : null}
        <header
          className={cn(
            "relative z-10 flex items-start justify-between gap-3 px-5",
            detent !== "peek" || !sheet ? "border-b border-rule py-3" : "pb-3",
          )}
        >
          <div className="min-w-0 pt-1">
            <p className="text-2xs font-semibold tracking-[0.14em] text-faint uppercase">
              {t(locale, "reception")}
            </p>
            <h2
              key={selectedVerse != null ? reference : "voices"}
              className="tl-pick-ref font-display truncate text-lg font-semibold text-ink"
            >
              {selectedVerse != null ? reference : t(locale, "historicVoices")}
            </h2>
          </div>
          <div className="flex shrink-0 items-center">
            {selectedVerse != null && chapter ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const end = selectedEndVerse ?? selectedVerse;
                  const verses: number[] = [];
                  for (let v = selectedVerse; v <= end; v++) verses.push(v);
                  toggleHighlights(chapter.bookId, chapter.chapter, verses);
                  touchHighlights();
                }}
                className={cn(
                  "flex size-11 items-center justify-center rounded-md hover:bg-paper",
                  highlighted ? "text-oxblood" : "text-muted hover:text-ink",
                )}
                aria-pressed={highlighted}
                aria-label={
                  highlighted
                    ? t(locale, "unhighlightVerse")
                    : t(locale, "highlightVerse")
                }
                title={
                  highlighted
                    ? t(locale, "unhighlightVerse")
                    : t(locale, "highlightHint")
                }
              >
                <Highlighter size={18} strokeWidth={highlighted ? 2.2 : 1.75} />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setSourcesPageOpen(true)}
              className="flex size-11 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-ink transition-colors active:scale-[0.96]"
              aria-label={t(locale, "allSavedSources")}
              title={t(locale, "allSavedSources")}
            >
              <BookMarked size={18} strokeWidth={1.75} />
            </button>
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
            {sheet ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (detent === "peek") setReceptionOpen(true);
                  else if (detent === "mid") setReceptionFull(true);
                  else setReceptionFull(false);
                }}
                className="flex size-11 items-center justify-center rounded-md text-lamp hover:bg-paper hover:text-ink"
                aria-label={
                  detent === "full"
                    ? t(locale, "midReception")
                    : detent === "mid"
                      ? t(locale, "fullReception")
                      : t(locale, "raiseReception")
                }
              >
                {detent === "full" ? (
                  <Minimize2 size={18} strokeWidth={1.75} />
                ) : detent === "mid" ? (
                  <Maximize2 size={18} strokeWidth={1.75} />
                ) : (
                  <ChevronUp size={18} strokeWidth={1.75} />
                )}
              </button>
            ) : null}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (sheet && detent === "peek") {
                  clearSelection();
                  return;
                }
                if (sheet) {
                  onClose?.();
                  return;
                }
                setReceptionPinned(false);
                onClose?.();
              }}
              className="flex size-11 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-ink"
              aria-label={
                sheet && detent === "peek"
                  ? t(locale, "clearSelection")
                  : t(locale, "closeReception")
              }
            >
              <X size={18} />
            </button>
          </div>
        </header>
      </div>

      <div
        className="tl-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-scroll overscroll-contain px-5 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        onScroll={(e) => {
          const el = e.currentTarget;
          if (el.scrollLeft !== 0) el.scrollLeft = 0;
        }}
      >
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
          <div className="tl-closed-folio flex flex-col items-start gap-4 py-6">
            <p className="font-display text-xl text-ink">{t(locale, "markVerse")}</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              {t(locale, "receptionHint")}
            </p>
            {chapter && marked.length > 0 ? (
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-2xs font-semibold tracking-[0.14em] text-faint uppercase">
                    {t(locale, "notesOnChapter")}
                  </p>
                  {hasCachedNotesInChapter(chapter.bookId, chapter.chapter) ? (
                    <button
                      type="button"
                      onClick={handleClearChapterGenerated}
                      className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-2xs font-medium text-muted hover:bg-lamp-soft hover:text-lamp transition-colors"
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
                        onClick={() => {
                          // Clear-if-same (BUG-3): retap marked chip clears.
                          if (
                            selectedVerse === n &&
                            (selectedEndVerse == null || selectedEndVerse === n)
                          ) {
                            clearSelection();
                          } else {
                            setVerse(n);
                          }
                        }}
                        className={cn(
                          "min-h-11 rounded-md border px-3 text-sm font-semibold transition-colors",
                          isGenOnly
                            ? "border-dashed border-rule bg-surface/80 text-ink hover:border-lamp hover:text-lamp"
                            : "border-rule bg-surface text-ink hover:border-lamp hover:text-lamp",
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
            {selectionText ? (
              <p className="tl-quote mb-5 pl-3 font-serif text-base leading-relaxed text-ink italic">
                {selectionText}
              </p>
            ) : verse ? (
              <p className="tl-quote mb-5 pl-3 font-serif text-base leading-relaxed text-ink italic">
                {verse.text}
              </p>
            ) : null}

            {/* Lexicon chips sit with the verse; the question box follows them. */}
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
                        lexicon?.word.toLowerCase() === w.toLowerCase() ||
                          spanishLexicon?.word.toLowerCase() ===
                            w.toLowerCase() ||
                          spanishHebrew?.word.toLowerCase() ===
                            w.toLowerCase() ||
                          englishLexicon?.word.toLowerCase() ===
                            w.toLowerCase() ||
                          hebrewBdb?.word.toLowerCase() === w.toLowerCase()
                          ? "border-lamp bg-lamp-soft text-lamp"
                          : "border-rule bg-surface text-ink hover:border-lamp hover:text-lamp",
                      )}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {locale === "es" && spanishHebrew ? (
              <div
                key={`${spanishHebrew.strongs}:${spanishHebrew.hero}`}
                className="tl-gloss-crossfade"
              >
                <SpanishHebrewCard
                  entry={spanishHebrew}
                  bdb={hebrewBdb}
                  onStrong={runSpanishHebrewStrong}
                />
              </div>
            ) : null}

            {locale === "es" && spanishLexicon ? (
              <div
                key={`${spanishLexicon.strongs}:${spanishLexicon.entryCode}:${spanishLexicon.gloss}`}
                className="tl-gloss-crossfade"
              >
                <SpanishGlossCard
                  entry={spanishLexicon}
                  onStrong={runSpanishStrong}
                />
              </div>
            ) : null}

            {locale === "en" && englishLexicon ? (
              <div
                key={`${englishLexicon.strongs}:${englishLexicon.entryCode}:${englishLexicon.gloss}`}
                className="tl-gloss-crossfade"
              >
                <EnglishGlossCard
                  entry={englishLexicon}
                  onStrong={runEnglishStrong}
                />
              </div>
            ) : null}

            {locale !== "es" && hebrewBdb ? (
              <div
                key={`${hebrewBdb.strongs}:${hebrewBdb.gloss}`}
                className="tl-gloss-crossfade"
              >
                <HebrewBdbCard
                  entry={hebrewBdb}
                  onStrong={runHebrewBdbStrong}
                />
              </div>
            ) : null}

            {locale === "en" && !englishLexicon && !hebrewBdb && lexicon ? (
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

            {/* Question box sits directly above the commentaries, after any open
                lexicon card; its short answer unfolds right beneath it. */}
            <form
              className="mb-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleQuestionSubmit();
              }}
            >
              <label className="sr-only" htmlFor="ask-verse">
                {t(locale, "askVersePlaceholder")}
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="ask-verse"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={t(locale, "askVersePlaceholder")}
                  className="min-h-11 w-full rounded-md border border-rule bg-surface px-3 py-2.5 text-base text-ink outline-none placeholder:italic placeholder:text-faint focus:border-lamp"
                />
                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  aria-label={t(locale, "inquire")}
                  className="flex size-11 shrink-0 items-center justify-center rounded-md bg-oxblood text-oxblood-fg disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>

            <div
              className="tl-unfold"
              data-open={
                qaOpen &&
                (qa != null ||
                  qaError != null ||
                  (loading && loadingKind === "question"))
              }
            >
              <div className="tl-unfold-body">
                <div className="tl-unfold-item">
                  {loading && loadingKind === "question" ? (
                    <p className="mb-4 flex items-center gap-2 font-serif text-sm text-muted italic">
                      <Loader2 size={14} className="animate-spin text-lamp" />
                      {t(locale, "synthesizing")}
                    </p>
                  ) : null}
                  {qaError && !(loading && loadingKind === "question") ? (
                    <p className="mb-4 rounded-md border border-oxblood/30 bg-oxblood-soft px-3 py-2 text-sm text-oxblood">
                      {qaError}
                    </p>
                  ) : null}
                  {qa && !(loading && loadingKind === "question") ? (
                    <div className="mb-4 border-l-2 border-lamp pl-3">
                      <p className="font-serif text-[15px] leading-relaxed text-ink">
                        {qa.answer}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Commentaries for this verse: heading, per-verse tradition filters,
                initial set, then the More / Summary row. Always mounted in the
                verse branch so an empty desk still offers gather + summary. */}
              <div className="mb-2">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-2xs font-semibold tracking-[0.14em] text-faint uppercase">
                    {t(locale, "commentariesHeading")}
                  </p>
                  {hasGeneratedCards ? (
                    <button
                      type="button"
                      onClick={handleRemoveAllGenerated}
                      className="inline-flex items-center gap-1 rounded-sm px-2 py-1 text-2xs font-medium tracking-wide text-muted hover:bg-lamp-soft hover:text-lamp transition-colors"
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
                {/* Per-verse tradition filters, right under the heading. */}
                {traditionCounts.length > 0 ? (
                  <div
                    className="mb-3 flex flex-wrap gap-1.5"
                    role="group"
                    aria-label={t(locale, "commentariesHeading")}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedTradition("all")}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm",
                        effectiveTradition === "all"
                          ? "border-lamp bg-lamp-soft text-lamp"
                          : "border-rule bg-surface text-ink hover:border-lamp hover:text-lamp",
                      )}
                    >
                      {t(locale, "filterAll")} · {result?.cards.length ?? 0}
                    </button>
                    {traditionCounts.map(({ tradition, count }) => (
                      <button
                        key={tradition}
                        type="button"
                        onClick={() => setSelectedTradition(tradition)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm",
                          effectiveTradition === tradition
                            ? "border-lamp bg-lamp-soft text-lamp"
                            : "border-rule bg-surface text-ink hover:border-lamp hover:text-lamp",
                        )}
                      >
                        {traditionLabel(locale, tradition)} · {count}
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className="space-y-3">
                {visibleCards.map((card, i) => {
                  const gen = chapter
                    ? isCardGenerated(
                        card,
                        chapter.bookId,
                        chapter.chapter,
                        selectedVerse,
                      )
                    : isCardGenerated(card);
                  return (
                    <SourceCard
                      key={`${card.voice}-${card.citation}-${i}`}
                      card={card}
                      isGenerated={gen}
                      land={i === 0}
                      onRemove={gen ? () => handleRemoveCard(card) : undefined}
                    />
                  );
                })}
                </div>
                {/* Remaining preloaded cards unfold inline. */}
                <div className="tl-unfold" data-open={showAll}>
                  <div className="tl-unfold-body">
                    <div className="space-y-3 pt-3">
                      {hiddenCards.map((card, i) => {
                        const gen = chapter
                          ? isCardGenerated(
                              card,
                              chapter.bookId,
                              chapter.chapter,
                              selectedVerse,
                            )
                          : isCardGenerated(card);
                        return (
                          <div
                            className="tl-unfold-item"
                            key={`${card.voice}-${card.citation}-more-${i}`}
                          >
                            <SourceCard
                              card={card}
                              isGenerated={gen}
                              onRemove={
                                gen ? () => handleRemoveCard(card) : undefined
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* Subtle line while the silent preload may still add cards. */}
                {gatherState === "loading" && visibleCards.length <= 3 ? (
                  <p className="mt-3 flex items-center gap-2 font-serif text-sm text-muted italic">
                    <Loader2 size={14} className="animate-spin text-lamp" />
                    {t(locale, "consulting")}
                  </p>
                ) : null}

              {/* More commentaries (left) + Summary (right). */}
              <div className="mt-3 mb-4 flex gap-2">
                {canExpandMore ? (
                  <button
                    type="button"
                    onClick={handleMore}
                    disabled={loading}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md border border-rule bg-surface px-4 text-xs font-semibold tracking-wide text-ink uppercase disabled:opacity-60"
                  >
                    {loadingKind === "commentaries"
                      ? t(locale, "consultingShort")
                      : showAll
                        ? t(locale, "showFewer")
                        : t(locale, "moreCommentaries")}
                    <ChevronDown
                      size={14}
                      className={cn(
                        "transition-transform duration-200",
                        showAll && "rotate-180",
                      )}
                    />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={handleSummary}
                  disabled={loading}
                  className="min-h-11 flex-1 rounded-md bg-oxblood px-4 text-xs font-semibold tracking-wide text-oxblood-fg uppercase disabled:opacity-60"
                >
                  {loadingKind === "summary"
                    ? t(locale, "consultingShort")
                    : t(locale, "summary")}
                </button>
              </div>

              {/* Summary unfolds inline under the buttons, in its own slot. */}
              <div className="tl-unfold" data-open={summaryOpen}>
                <div className="tl-unfold-body">
                  <div className="tl-unfold-item">
                    {loading && loadingKind === "summary" ? (
                      <p className="mb-4 flex items-center gap-2 font-serif text-sm text-muted italic">
                        <Loader2 size={14} className="animate-spin text-lamp" />
                        {t(locale, "synthesizing")}
                      </p>
                    ) : null}
                    {error && loadingKind !== "commentaries" ? (
                      <p className="mb-4 rounded-md border border-oxblood/30 bg-oxblood-soft px-3 py-2 text-sm text-oxblood">
                        {error}
                      </p>
                    ) : null}
                    {summary && !(loading && loadingKind === "summary") ? (
                      <article className="mb-2 rounded-lg border border-rule bg-surface p-4 shadow-soft">
                        <p className="text-2xs font-semibold tracking-[0.14em] text-faint uppercase">
                          {t(locale, "synthesisFromDesk")}
                        </p>
                        <p className="mt-2 font-serif text-base leading-relaxed text-ink whitespace-pre-wrap">
                          {summary.answer}
                        </p>
                        {summary.cited.length ? (
                          <p className="mt-3 text-2xs tracking-wide text-faint">
                            {summary.cited.join(" · ")}
                          </p>
                        ) : null}
                      </article>
                    ) : null}
                  </div>
                </div>
              </div>

              {result?.caution ? (
                <p className="mb-4 pt-1 text-2xs leading-relaxed text-faint italic">
                  {localizeCaution(result.caution, locale)}
                </p>
              ) : null}
              </div>

            {error && loadingKind === "commentaries" ? (
              <p className="mb-4 rounded-md border border-oxblood/30 bg-oxblood-soft px-3 py-2 text-sm text-oxblood">
                {error}
              </p>
            ) : null}

            {result && result.cards.length === 0 && result.caution ? (
              <p className="mb-4 text-sm text-muted italic">{localizeCaution(result.caution, locale)}</p>
            ) : null}

            {result?.orientation ? (
              <div className="mb-4 border-l-2 border-rule pl-3">
                <p className="text-2xs font-semibold tracking-[0.14em] text-faint uppercase">
                  {t(locale, "orientationHeading")}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink">
                  {result.orientation.question}
                </p>
                {result.orientation.divides.length ? (
                  <dl className="mt-3 space-y-2">
                    {result.orientation.divides.map((d) => (
                      <div key={d.tradition}>
                        <dt className="text-2xs font-semibold tracking-wide text-faint uppercase">
                          {d.tradition}
                        </dt>
                        <dd className="text-sm leading-relaxed text-muted">{d.position}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {result.orientation.readNext.length ? (
                  <p className="mt-3 text-xs text-muted">
                    <span className="font-semibold">{t(locale, "orientationReadNext")}: </span>
                    {result.orientation.readNext.join(" · ")}
                  </p>
                ) : null}
                <p className="pt-2 text-2xs leading-relaxed text-faint italic">
                  {t(locale, "orientationCaution")}
                </p>
              </div>
            ) : null}

          </>
        )}
      </div>
    </div>
  );
}
