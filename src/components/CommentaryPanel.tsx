import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  Search,
  BookOpen,
  MessageSquare,
  X,
  Users,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import {
  generateCommentary,
  generateFollowUp,
  generateTraditions,
} from "../services/geminiService";
import { BibleChapter } from "../types";
import { useI18n } from "../i18n";
import { motion, AnimatePresence } from "motion/react";
import { MemoizedMarkdown } from "./markdown";

export interface CommentaryState {
  text: string | null;
  loading: boolean;
  error: string | null;
  query: string;
  selectedVerse?: number | null;
}

interface FollowUpState {
  isOpen: boolean;
  selectedText: string;
  query: string;
  response: string | null;
  loading: boolean;
  error: string | null;
}

interface CommentaryPanelProps {
  chapter: BibleChapter | null;
  searchTrigger?: {
    query: string;
    verse: number | null;
    timestamp: number;
  } | null;
  state: CommentaryState;
  setState: React.Dispatch<React.SetStateAction<CommentaryState>>;
  onCrossReference?: (book: string, chapter: number) => void;
}

export const CommentaryPanel: React.FC<CommentaryPanelProps> = ({
  chapter,
  searchTrigger,
  state,
  setState,
  onCrossReference,
}) => {
  const { s, lang } = useI18n();
  const lastProcessedTrigger = React.useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const commentaryContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  // Monotonic id for the active commentary generation. A streamed response that
  // is no longer current (superseded by a new request, or a chapter change) must
  // not write its text into state. Incremented on each new generation and on
  // passage change.
  const genId = useRef(0);
  // Cancels the in-flight commentary request (network + server work) when it is
  // superseded or the panel unmounts.
  const abortRef = useRef<AbortController | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    
    // Global mobile nav visibility
    if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        window.dispatchEvent(new CustomEvent("nav-visibility", { detail: { visible: false } }));
      } else {
        window.dispatchEvent(new CustomEvent("nav-visibility", { detail: { visible: true } }));
      }
      lastScrollY.current = currentScrollY;
    }
  };

  const [selectionRect, setSelectionRect] = useState<{
    top: number;
    left: number;
    text: string;
  } | null>(null);

  const [traditionsAvailable, setTraditionsAvailable] = useState(true);
  const [traditions, setTraditions] = useState<{
    text: string | null;
    loading: boolean;
    error: string | null;
    visible: boolean;
    cacheKey: string | null;
  }>({ text: null, loading: false, error: null, visible: false, cacheKey: null });

  const [followUp, setFollowUp] = useState<FollowUpState>({
    isOpen: false,
    selectedText: "",
    query: "",
    response: null,
    loading: false,
    error: null,
  });

  const stripMarker = (text: string) =>
    text.replace(/\s*<!--TRADITIONS:(DISPUTED|NONE)-->\s*$/, "").trimEnd();

  const handleGenerate = useCallback(async (
    e?: React.FormEvent,
    overrideQuery?: string,
    overrideVerse?: number | null,
  ) => {
    if (e) e.preventDefault();
    if (!chapter) return;

    const myId = ++genId.current; // supersede any in-flight generation
    abortRef.current?.abort(); // cancel a still-running previous request
    const ac = new AbortController();
    abortRef.current = ac;

    const currentQuery =
      overrideQuery !== undefined ? overrideQuery : state.query;
    const currentVerse =
      overrideVerse !== undefined ? overrideVerse : state.selectedVerse;

    setState((prev) => ({ ...prev, loading: true, error: null, text: null }));
    setSelectionRect(null);
    setTraditions({ text: null, loading: false, error: null, visible: false, cacheKey: null });
    setTraditionsAvailable(true);
    try {
      const result = await generateCommentary(
        chapter.text,
        chapter.reference,
        currentQuery,
        currentVerse === null ? undefined : currentVerse,
        (partial) => {
          if (genId.current !== myId) return; // a newer request/passage took over
          setState((prev) => ({ ...prev, text: stripMarker(partial) }));
        },
        lang,
        ac.signal,
      );
      if (genId.current !== myId) return; // stale — don't overwrite the current view
      const markerMatch = result.match(/<!--TRADITIONS:(DISPUTED|NONE)-->/);
      setTraditionsAvailable(!markerMatch || markerMatch[1] === "DISPUTED");
      setState((prev) => ({
        ...prev,
        text: stripMarker(result) || "No commentary generated.",
        loading: false,
      }));
    } catch (err: any) {
      if (err?.name === "AbortError" || genId.current !== myId) return; // cancelled/stale — ignore
      setState((prev) => ({
        ...prev,
        error:
          err.message ||
          "Failed to generate commentary. Please check your connection.",
        loading: false,
      }));
      console.error(err);
    }
  }, [chapter, lang, setState, state.query, state.selectedVerse]);

  // Invalidate and cancel any in-flight generation when the passage changes, so
  // a slow stream from the previous chapter can't write into the new one.
  useEffect(() => {
    genId.current++;
    abortRef.current?.abort();
  }, [chapter?.reference]);

  // Cancel any in-flight request when the panel unmounts.
  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (
      searchTrigger &&
      chapter &&
      searchTrigger.timestamp > lastProcessedTrigger.current
    ) {
      lastProcessedTrigger.current = searchTrigger.timestamp;
      setState((prev) => ({
        ...prev,
        query: searchTrigger.query,
        selectedVerse: searchTrigger.verse,
      }));
      handleGenerate(undefined, searchTrigger.query, searchTrigger.verse);
    }
  }, [searchTrigger, chapter, handleGenerate]);

  // Scroll to top when a new generation starts (not on every streamed chunk)
  useEffect(() => {
    if (state.loading && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.loading]);

  // Handle text selection for follow-up questions
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isPointerDown = false;

    const processSelection = () => {
      clearTimeout(timeoutId);
      if (isPointerDown) return;

      timeoutId = setTimeout(() => {
        const selection = window.getSelection();
        if (
          !selection ||
          selection.isCollapsed ||
          selection.toString().trim().length === 0
        ) {
          setSelectionRect(null);
          return;
        }

        if (
          commentaryContainerRef.current &&
          commentaryContainerRef.current.contains(selection.anchorNode) &&
          commentaryContainerRef.current.contains(selection.focusNode)
        ) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          // Ensure the selection is actually visible and has width
          if (rect.width > 0 && rect.height > 0) {
            let selectedText = selection.toString().trim();
            if (selectedText.length > 400) {
              selectedText = selectedText.substring(0, 400) + "...";
            }

            // Anchor BELOW the selection: iOS renders its own copy/look-up
            // callout directly above a highlight, which would otherwise hide
            // this "Research this reference" button behind the system menu.
            setSelectionRect({
              top: rect.bottom + 12,
              left: rect.left + rect.width / 2,
              text: selectedText,
            });
          }
        } else {
          setSelectionRect(null);
        }
      }, 250);
    };

    const handlePointerDown = () => {
      isPointerDown = true;
      setSelectionRect(null); // Hide popup while dragging
    };

    const handlePointerUp = () => {
      isPointerDown = false;
      processSelection();
    };

    document.addEventListener("selectionchange", processSelection);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });
    document.addEventListener("touchend", handlePointerUp);

    return () => {
      document.removeEventListener("selectionchange", processSelection);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("touchend", handlePointerUp);
      clearTimeout(timeoutId);
    };
  }, []);

  // Clear selection rect on scroll so the popover doesn't float away
  // but DO NOT clear the actual window selection as that breaks dragging on mobile.
  useEffect(() => {
    const handleScroll = () => {
      if (selectionRect) {
        setSelectionRect(null);
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [selectionRect]);

  // Hide the floating bottom-nav pill while the deep-research modal is open so
  // it doesn't linger on top of (or behind) the sheet. Restored on close.
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("nav-visibility", { detail: { visible: !followUp.isOpen } }),
    );
  }, [followUp.isOpen]);

  const handleTraditions = async () => {
    if (!chapter) return;
    const cacheKey = `${chapter.reference}:${state.selectedVerse ?? "all"}`;
    if (traditions.text !== null && traditions.cacheKey === cacheKey) {
      setTraditions((prev) => ({ ...prev, visible: !prev.visible }));
      return;
    }
    setTraditions({ text: null, loading: true, error: null, visible: true, cacheKey });
    try {
      const result = await generateTraditions(
        chapter.text,
        chapter.reference,
        state.selectedVerse === null ? undefined : state.selectedVerse,
        state.text ? state.text.slice(0, 800) : undefined,
        lang,
        (partial) => {
          setTraditions((prev) => ({ ...prev, text: partial }));
        },
      );
      setTraditions((prev) => ({ ...prev, text: result, loading: false }));
    } catch (err: any) {
      setTraditions((prev) => ({
        ...prev,
        error: err.message || "Failed to load traditions.",
        loading: false,
      }));
    }
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapter || !followUp.query.trim() || followUp.loading) return;

    setFollowUp((prev) => ({
      ...prev,
      loading: true,
      error: null,
      response: null,
    }));
    try {
      const result = await generateFollowUp(
        chapter.text,
        chapter.reference,
        followUp.selectedText,
        followUp.query,
        state.text || undefined,
        lang,
        (partial) => {
          setFollowUp((prev) => ({ ...prev, response: partial }));
        },
        state.selectedVerse === null ? undefined : state.selectedVerse,
      );
      setFollowUp((prev) => ({ ...prev, response: result, loading: false }));
    } catch (err: any) {
      setFollowUp((prev) => ({
        ...prev,
        error: err.message || "Failed to generate answer.",
        loading: false,
      }));
    }
  };

  const openFollowUpModal = () => {
    if (selectionRect) {
      setFollowUp({
        isOpen: true,
        selectedText: selectionRect.text,
        query: "",
        response: null,
        loading: false,
        error: null,
      });
      setSelectionRect(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  const copyToClipboard = () => {
    if (state.text) {
      navigator.clipboard.writeText(state.text);
    }
  };



  return (
    <div className="w-full h-full flex flex-col bg-stone-50 dark:bg-stone-950 relative transition-colors duration-300">
      {/* Selection Popover */}
      <AnimatePresence>
        {selectionRect && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[60]"
            style={{
              top: selectionRect.top,
              left: selectionRect.left,
              transform: "translateX(-50%)",
            }}
            // Stop the document-level selection handlers from clearing the
            // popover on the same gesture that taps it — otherwise the tap
            // never reaches onClick and the follow-up never opens.
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div
              className="relative group cursor-pointer"
              onClick={openFollowUpModal}
            >
              {/* Triangle pointer — on top, since the bar sits below the selection */}
              <div className="absolute left-1/2 -top-1.5 -translate-x-1/2 w-3 h-3 bg-stone-900 dark:bg-stone-800 group-hover:bg-[#821111] dark:group-hover:bg-red-900 transition-colors rotate-45 border-l border-t border-stone-800/80" />
              <button className="relative bg-stone-900 dark:bg-stone-800 text-white px-5 py-2.5 md:px-4 md:py-2 rounded-2xl text-sm font-medium flex items-center gap-2 group-hover:bg-[#821111] dark:group-hover:bg-red-900 transition-colors shadow-2xl border border-stone-800/80 whitespace-nowrap">
                <MessageSquare
                  size={16}
                  className="text-stone-300 group-hover:text-white transition-colors"
                />
                {s.researchReference}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Follow-up Modal */}
      <AnimatePresence>
        {followUp.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm p-0 md:p-6"
            style={{ paddingBottom: "var(--keyboard-height, 0px)" }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-stone-900 rounded-t-3xl md:rounded-2xl shadow-2xl w-full max-w-2xl md:h-auto md:max-h-[85vh] flex flex-col overflow-hidden border-t md:border border-stone-200 dark:border-stone-800"
              // On mobile the sheet shrinks when the keyboard opens so the header
              // (and close button) always stay on-screen. --keyboard-height is
              // kept up-to-date by App.tsx via the VisualViewport API.
              style={{ height: "calc(85vh - var(--keyboard-height, 0px))" }}
            >
              {/* Mobile Drag Indicator */}
              <div className="w-full flex justify-center pt-3 pb-1 md:hidden bg-stone-50 dark:bg-stone-900">
                <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full" />
              </div>

              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 shrink-0">
                <div className="flex items-center gap-3 text-[#821111] dark:text-red-400">
                  <div className="bg-red-50 dark:bg-red-950/30 p-2 rounded-xl">
                    <MessageSquare size={20} />
                  </div>
                  <h3 className="font-serif font-bold text-lg md:text-xl">
                    {s.followUpTitle}
                  </h3>
                </div>
                <button
                  onClick={() =>
                    setFollowUp((prev) => ({ ...prev, isOpen: false }))
                  }
                  className="text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors active:bg-stone-300"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-white dark:bg-stone-900">
                <div className="mb-6 space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 bg-stone-50 dark:bg-stone-950 px-3 py-1.5 rounded-lg w-fit border border-stone-100 dark:border-stone-800">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    {s.deepContext}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2 block">
                      {s.referencedText}
                    </span>
                    <blockquote className="border-l-4 border-[#821111]/40 dark:border-red-900/40 bg-stone-50 dark:bg-stone-950 py-3 px-4 rounded-r-xl italic text-stone-600 dark:text-stone-400 text-sm">
                      "{followUp.selectedText}"
                    </blockquote>
                  </div>
                </div>

                {followUp.loading && !followUp.response ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-4 text-stone-400 dark:text-stone-500">
                    <Loader2
                      className="animate-spin text-[#821111] dark:text-red-400"
                      size={32}
                    />
                    <p className="text-sm font-serif italic text-center">
                      {s.followUpLoading}
                    </p>
                  </div>
                ) : followUp.error ? (
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {followUp.error}
                  </div>
                ) : followUp.response ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-3 block">
                      {s.synthesisLabel}
                    </span>
                    <div className="commentary-content prose prose-stone dark:prose-invert prose-sm max-w-none">
                      <MemoizedMarkdown content={followUp.response} onCrossReference={onCrossReference} />
                    </div>
                    {followUp.loading && (
                      <div className="mt-4 flex items-center gap-2 text-stone-400 dark:text-stone-500">
                        <Loader2 className="animate-spin text-[#821111] dark:text-red-400" size={14} />
                        <span className="text-xs font-serif italic">{s.streaming}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-stone-400 dark:text-stone-500 font-serif italic text-sm">
                    {s.followUpEmpty}
                  </div>
                )}
              </div>

              {/* Modal Footer (Input) */}
              <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 shrink-0">
                <form onSubmit={handleFollowUpSubmit} className="flex gap-3">
                  <input
                    type="text"
                    placeholder={s.followUpPlaceholder}
                    autoComplete="off"
                    autoCorrect="on"
                    autoCapitalize="sentences"
                    enterKeyHint="search"
                    // text-base (≥16px) prevents iOS from auto-zooming on focus.
                    // No autoFocus: the modal shows the highlighted-text context
                    // first so the user can read before typing; they tap to open
                    // the keyboard when ready.
                    className="flex-1 px-4 py-3 border border-stone-200 dark:border-stone-800 rounded-xl text-base font-medium caret-[#821111] dark:caret-red-400 focus:outline-none focus:ring-2 focus:ring-[#821111]/20 dark:focus:ring-red-900/20 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    value={followUp.query}
                    onChange={(e) =>
                      setFollowUp((prev) => ({
                        ...prev,
                        query: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="submit"
                    disabled={followUp.loading || !followUp.query.trim()}
                    className="px-5 py-3 bg-stone-900 dark:bg-stone-700 text-white rounded-xl text-sm font-bold hover:bg-[#821111] dark:hover:bg-red-900 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {followUp.loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <ArrowRight size={18} />
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between shrink-0 transition-colors">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-serif font-bold text-stone-900 dark:text-stone-100 leading-none" style={{ fontSize: 19, letterSpacing: "-0.02em" }}>
            {s.researchRoom}
          </h2>
          <span className="tl-eyebrow" style={{ fontSize: 8 }}>{s.historicalSynthesis}</span>
        </div>
        {state.text && !state.loading && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setState((prev) => ({
                  ...prev,
                  text: null,
                  query: "",
                  selectedVerse: null,
                }));
                setTraditions({ text: null, loading: false, error: null, visible: false, cacheKey: null });
                setTraditionsAvailable(true);
              }}
              className="px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all flex items-center gap-1.5 border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
            >
              <X size={12} />
              {s.clear}
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#821111] dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all flex items-center gap-1.5 border border-red-100 dark:border-red-900/50 shadow-sm"
            >
              <BookOpen size={12} />
              {s.copy}
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto tl-scrollbar scroll-smooth bg-white dark:bg-stone-950 transition-colors pb-32 lg:pb-0"
      >
        <div className="p-5 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            {state.selectedVerse && (
              <div className="text-[10px] font-bold text-[#821111] dark:text-red-400 bg-red-50/50 dark:bg-red-950/30 p-3 rounded-xl border border-red-100 dark:border-red-900/50 flex justify-between items-center animate-in fade-in slide-in-from-top-2 duration-300 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#821111] dark:bg-red-500 rounded-full animate-pulse" />
                  <span>{s.verseFocus.replace("{n}", String(state.selectedVerse))}</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setState((prev) => ({ ...prev, selectedVerse: null }))
                  }
                  className="text-stone-400 dark:text-stone-500 hover:text-[#821111] dark:hover:text-red-400 transition-colors p-2 -mr-2 active:scale-95"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 group-focus-within:text-[#821111] dark:group-focus-within:text-red-400 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder={s.questionPlaceholder}
                className="w-full pl-11 pr-4 py-3 border border-stone-200 dark:border-stone-800 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-[#821111]/20 dark:focus:ring-red-900/20 bg-stone-50/50 dark:bg-stone-950/50 text-stone-800 dark:text-stone-100 transition-all font-serif italic"
                value={state.query}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, query: e.target.value }))
                }
              />
            </div>
            <button
              type="submit"
              disabled={state.loading || !chapter}
              className="w-full py-3 bg-[#821111] text-white rounded-2xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-[#821111]/20"
              style={{ boxShadow: "0 8px 32px rgba(130,17,17,0.2)" }}
            >
              {state.loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <BookOpen size={18} />
              )}
              {state.loading ? s.consultingSources : s.synthesizeCommentary}
            </button>

            <div className="flex items-center justify-center gap-3 text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-green-400 rounded-full" />
                WEB
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-purple-400 rounded-full" />
                AI
              </div>
            </div>
          </form>
        </div>

        <div className="pt-6 px-6">
          {state.loading && !state.text ? (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex items-center gap-2.5 mb-1">
                <Loader2 className="animate-spin text-[#821111] dark:text-red-400 shrink-0" size={15} />
                <span className="font-serif italic text-stone-400 dark:text-stone-500" style={{ fontSize: 13 }}>
                  {s.compiling}
                </span>
              </div>
              {/* Skeleton shimmer blocks */}
              <div className="tl-shimmer h-[18px] w-3/5 rounded-md" />
              <div className="tl-shimmer h-[13px] w-full rounded-md" />
              <div className="tl-shimmer h-[13px] w-[92%] rounded-md" />
              <div className="tl-shimmer h-[13px] w-[85%] rounded-md" />
              <div className="rounded-lg border border-stone-100 dark:border-stone-800 border-l-[3px] border-l-stone-300 dark:border-l-stone-700 p-4 flex flex-col gap-2 mt-1">
                <div className="tl-shimmer h-[12px] w-4/5 rounded-md" />
                <div className="tl-shimmer h-[12px] w-[55%] rounded-md" />
              </div>
              <div className="tl-shimmer h-[13px] w-full rounded-md" />
              <div className="tl-shimmer h-[13px] w-3/4 rounded-md" />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {state.error && (
                <div className="p-5 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400 text-sm leading-relaxed animate-in fade-in zoom-in-95 duration-300">
                  <p className="font-bold mb-1 uppercase tracking-widest text-[10px]">
                    {s.inquiryError}
                  </p>
                  <p className="font-serif italic">{state.error}</p>
                </div>
              )}

              {state.text && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div
                    ref={commentaryContainerRef}
                    className="commentary-content prose prose-stone dark:prose-invert prose-sm max-w-none"
                  >
                    <MemoizedMarkdown content={state.text} onCrossReference={onCrossReference} />
                  </div>

                  {state.loading && (
                    <div className="mt-4 flex items-center gap-2 text-stone-400 dark:text-stone-500">
                      <Loader2
                        className="animate-spin text-[#821111] dark:text-red-400"
                        size={16}
                      />
                      <span className="text-xs font-serif italic">
                        {s.streaming}
                      </span>
                    </div>
                  )}

                  {!state.loading && (
                  <>
                  {traditionsAvailable && (
                    <div className="mt-6">
                      <button
                        onClick={handleTraditions}
                        disabled={traditions.loading}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-[#821111] hover:text-[#821111] dark:hover:border-red-700 dark:hover:text-red-400 disabled:opacity-50 transition-all"
                      >
                        {traditions.loading ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Users size={13} />
                        )}
                        {traditions.text !== null && traditions.cacheKey === `${chapter?.reference}:${state.selectedVerse ?? "all"}`
                          ? (traditions.visible ? s.hideOtherTraditions : s.otherTraditions)
                          : s.otherTraditions}
                      </button>

                      <AnimatePresence>
                        {traditions.visible && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden">
                              <div className="px-4 py-3 bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center gap-2">
                                <Users size={13} className="text-stone-500 dark:text-stone-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                                  {s.otherTraditions}
                                </span>
                              </div>
                              <div className="p-5 bg-white dark:bg-stone-950">
                                {traditions.loading && !traditions.text ? (
                                  <div className="flex flex-col gap-3 py-2">
                                    <div className="flex items-center gap-2.5 mb-1">
                                      <Loader2 className="animate-spin text-[#821111] dark:text-red-400 shrink-0" size={14} />
                                      <span className="font-serif italic text-stone-400 dark:text-stone-500 text-xs">{s.compiling}</span>
                                    </div>
                                    <div className="tl-shimmer h-[16px] w-2/5 rounded-md" />
                                    <div className="tl-shimmer h-[12px] w-full rounded-md" />
                                    <div className="tl-shimmer h-[12px] w-[88%] rounded-md" />
                                    <div className="tl-shimmer h-[16px] w-2/5 rounded-md mt-2" />
                                    <div className="tl-shimmer h-[12px] w-full rounded-md" />
                                    <div className="tl-shimmer h-[12px] w-[75%] rounded-md" />
                                  </div>
                                ) : traditions.error ? (
                                  <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-serif italic">
                                    {traditions.error}
                                  </div>
                                ) : traditions.text ? (
                                  <div className="commentary-content prose prose-stone dark:prose-invert prose-sm max-w-none">
                                    <MemoizedMarkdown content={traditions.text} onCrossReference={onCrossReference} />
                                    {traditions.loading && (
                                      <div className="mt-3 flex items-center gap-2 text-stone-400 dark:text-stone-500">
                                        <Loader2 className="animate-spin text-[#821111] dark:text-red-400" size={13} />
                                        <span className="text-xs font-serif italic">{s.streaming}</span>
                                      </div>
                                    )}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <div className="mt-8 p-4 bg-stone-50 dark:bg-stone-900 border-l-4 border-stone-300 dark:border-stone-700 rounded-r-xl flex items-start gap-3">
                    <HelpCircle
                      className="text-stone-500 shrink-0 mt-0.5"
                      size={18}
                    />
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-serif">
                      <strong>{s.deepResearchTitle}</strong> {s.deepResearchBody}
                    </p>
                  </div>

                  <div className="mt-4 p-4 bg-stone-50 dark:bg-stone-900 border-l-4 border-[#821111] dark:border-red-900 rounded-r-xl flex items-start gap-3">
                    <Users
                      className="text-[#821111] dark:text-red-400 shrink-0 mt-0.5"
                      size={18}
                    />
                    <p className="text-[10px] italic text-stone-500 dark:text-stone-500 leading-relaxed font-serif">
                      {s.eldersNote}
                    </p>
                  </div>

                  <div className="mt-12 p-6 bg-stone-900 dark:bg-stone-950 rounded-2xl text-white shadow-xl overflow-hidden relative group border border-white/5">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                      <Users size={120} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-serif font-bold text-xl mb-3">
                        {s.ecclesialTitle}
                      </h3>
                      <p className="text-stone-300 text-sm leading-relaxed mb-6 italic font-serif">
                        {s.ecclesialBody}
                      </p>
                      <div className="space-y-4">
                        <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold block">
                          {s.churchResources}
                        </span>
                        <div className="flex flex-wrap gap-2 text-[10px]">
                          <a
                            href="https://www.9marks.org/church-search/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-colors border border-white/10"
                          >
                            9Marks
                          </a>
                          <a
                            href="https://www.thegospelcoalition.org/churches/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-colors border border-white/10"
                          >
                            TGC
                          </a>
                          <a
                            href="https://founders.org/church-search/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-colors border border-white/10"
                          >
                            Founders
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
                  )}
                </div>
              )}
              {!state.text && !state.error && (
                <div className="flex flex-col items-center justify-center h-full text-stone-400 dark:text-stone-600 text-center gap-6 px-6 py-20">
                  <div className="bg-stone-100 dark:bg-stone-900 p-8 rounded-full shadow-inner border border-stone-200/50 dark:border-stone-800">
                    <BookOpen
                      size={48}
                      className="text-stone-300 dark:text-stone-700"
                    />
                  </div>
                  <div className="max-w-xs space-y-2">
                    <h4 className="font-serif font-bold text-stone-700 dark:text-stone-300 text-lg tracking-tight">
                      {s.enterLibrary}
                    </h4>
                    <p className="text-sm font-serif italic leading-relaxed text-stone-500 dark:text-stone-500">
                      {s.emptyResearchBody}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Mobile Bottom Spacer */}
          <div className="h-[calc(6rem+env(safe-area-inset-bottom))] lg:hidden w-full flex-shrink-0" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};
