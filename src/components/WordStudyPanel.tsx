import React, { useRef } from "react";
import {
  Loader2,
  Languages,
  X,
  Copy,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { generateWordStudy } from "../services/geminiService";
import { BibleChapter } from "../types";
import { useI18n } from "../i18n";
import { MemoizedMarkdown } from "./markdown";

export interface WordStudyState {
  text: string | null;
  loading: boolean;
  error: string | null;
  word: string;
  studiedWord: string | null;
  useVerseContext: boolean;
}

export const defaultWordStudyState: WordStudyState = {
  text: null,
  loading: false,
  error: null,
  word: "",
  studiedWord: null,
  useVerseContext: true,
};

interface WordStudyPanelProps {
  chapter: BibleChapter | null;
  state: WordStudyState;
  setState: React.Dispatch<React.SetStateAction<WordStudyState>>;
  onCrossReference?: (book: string, chapter: number) => void;
}

const EXAMPLE_WORDS: Record<string, string[]> = {
  en: ["agape", "logos", "chesed", "propitiation", "shalom"],
  es: ["agape", "logos", "chesed", "propiciación", "shalom"],
};

export const WordStudyPanel: React.FC<WordStudyPanelProps> = ({
  chapter,
  state,
  setState,
  onCrossReference,
}) => {
  const { s, lang } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        window.dispatchEvent(
          new CustomEvent("nav-visibility", { detail: { visible: false } }),
        );
      } else {
        window.dispatchEvent(
          new CustomEvent("nav-visibility", { detail: { visible: true } }),
        );
      }
      lastScrollY.current = currentScrollY;
    }
  };

  const handleStudy = async (e?: React.FormEvent, override?: string) => {
    if (e) e.preventDefault();
    const word = (override ?? state.word).trim();
    if (!word || state.loading) return;

    const reference =
      state.useVerseContext && chapter ? chapter.reference : "";

    setState((prev) => ({
      ...prev,
      word,
      loading: true,
      error: null,
      studiedWord: word,
    }));

    try {
      const result = await generateWordStudy(word, reference, lang);
      setState((prev) => ({
        ...prev,
        text: result || "No analysis generated.",
        loading: false,
      }));
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error: err.message || "Failed to generate word study.",
        loading: false,
      }));
    }
  };

  const clear = () =>
    setState((prev) => ({
      ...prev,
      text: null,
      error: null,
      word: "",
      studiedWord: null,
    }));

  const copy = () => {
    if (state.text) navigator.clipboard.writeText(state.text);
  };

  return (
    <div className="w-full h-full flex flex-col bg-stone-50 dark:bg-stone-950 relative transition-colors duration-300">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between shrink-0 transition-colors">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-serif font-bold text-stone-900 dark:text-stone-100 leading-none" style={{ fontSize: 19, letterSpacing: "-0.02em" }}>
            {s.wordStudy}
          </h2>
          <span className="tl-eyebrow" style={{ fontSize: 8 }}>{s.originalLanguageLexicon}</span>
        </div>
        {state.text && !state.loading && (
          <div className="flex items-center gap-2">
            <button
              onClick={clear}
              className="px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all flex items-center gap-1.5 border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
            >
              <X size={12} />
              {s.clear}
            </button>
            <button
              onClick={copy}
              className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#821111] dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all flex items-center gap-1.5 border border-red-100 dark:border-red-900/50 shadow-sm"
            >
              <Copy size={12} />
              {s.copy}
            </button>
          </div>
        )}
      </div>

      {/* Scrollable body */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-smooth bg-white dark:bg-stone-950 transition-colors pb-32 lg:pb-0"
      >
        {/* Search form */}
        <div className="p-5 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
          <form onSubmit={handleStudy} className="flex flex-col gap-4">
            <div className="relative group">
              <ScrollText
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 group-focus-within:text-[#821111] dark:group-focus-within:text-red-400 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder={s.wordPlaceholder}
                className="w-full pl-11 pr-4 py-3 border border-stone-200 dark:border-stone-800 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-[#821111]/20 dark:focus:ring-red-900/20 bg-stone-50/50 dark:bg-stone-950/50 text-stone-800 dark:text-stone-100 transition-all font-serif"
                value={state.word}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, word: e.target.value }))
                }
              />
            </div>

            {chapter && (
              <label className="flex items-center gap-2.5 text-[11px] font-medium text-stone-500 dark:text-stone-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={state.useVerseContext}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      useVerseContext: e.target.checked,
                    }))
                  }
                  className="accent-[#821111] w-4 h-4"
                />
                {s.anchorTo}
                <span className="font-bold text-[#821111] dark:text-red-400">
                  {chapter.reference}
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={state.loading || !state.word.trim()}
              className="w-full py-3 bg-stone-800 dark:bg-stone-700 text-white rounded-2xl text-sm font-bold hover:bg-stone-900 dark:hover:bg-stone-600 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg dark:shadow-black/20"
            >
              {state.loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Languages size={18} />
              )}
              {state.loading ? s.consultingLexicons : s.studyWord}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="pt-6 px-6">
          {state.loading ? (
            <div className="flex flex-col items-center justify-center gap-5 text-stone-400 dark:text-stone-500 animate-pulse py-20">
              <Loader2
                className="animate-spin text-[#821111] dark:text-red-400"
                size={40}
              />
              <p className="text-sm font-serif italic">
                {s.parsingLanguages}
              </p>
            </div>
          ) : state.error ? (
            <div className="p-5 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400 text-sm leading-relaxed">
              <p className="font-bold mb-1 uppercase tracking-widest text-[10px]">
                {s.lexiconError}
              </p>
              <p className="font-serif italic">{state.error}</p>
            </div>
          ) : state.text ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="commentary-content prose prose-stone dark:prose-invert prose-sm max-w-none">
                <MemoizedMarkdown
                  content={state.text}
                  onCrossReference={onCrossReference}
                />
              </div>
              <div className="mt-8 p-4 bg-stone-50 dark:bg-stone-900 border-l-4 border-stone-300 dark:border-stone-700 rounded-r-xl text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-serif">
                <strong>{s.verifySourcesTitle}</strong> {s.verifySourcesBody}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-6 px-6 py-16">
              <div className="bg-stone-100 dark:bg-stone-900 p-8 rounded-full shadow-inner border border-stone-200/50 dark:border-stone-800">
                <Languages
                  size={44}
                  className="text-stone-300 dark:text-stone-700"
                />
              </div>
              <div className="max-w-xs space-y-2">
                <h4 className="font-serif font-bold text-stone-700 dark:text-stone-300 text-lg tracking-tight">
                  {s.defineAWord}
                </h4>
                <p className="text-sm font-serif italic leading-relaxed text-stone-500 dark:text-stone-500">
                  {s.wordEmptyBody}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm">
                <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-600 w-full">
                  {s.tryLabel}
                </span>
                {(EXAMPLE_WORDS[lang] ?? EXAMPLE_WORDS.en).map((w) => (
                  <button
                    key={w}
                    onClick={() => handleStudy(undefined, w)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-[#821111] hover:text-white dark:hover:bg-red-900 transition-colors border border-stone-200 dark:border-stone-800 flex items-center gap-1.5"
                  >
                    <Sparkles size={11} />
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div
            className="h-[calc(6rem+env(safe-area-inset-bottom))] lg:hidden w-full flex-shrink-0"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};
