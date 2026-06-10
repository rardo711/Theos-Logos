import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
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
} from "../services/geminiService";
import { BibleChapter, BIBLE_BOOKS } from "../types";
import { motion, AnimatePresence } from "motion/react";

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

const renderMarkdownText = (
  text: string,
  onCrossReference?: (book: string, chapter: number) => void,
) => {
  // Regex to match standard Bible references (e.g., Romans 8:28, 1 John 1:9, Genesis 3)
  const bibleRefRegex = /\b([1-3]?\s*[A-Za-z]+)\s+(\d+)(?::\d+(?:-\d+)?)?\b/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  const normalizedBooks = BIBLE_BOOKS.map((b) => b.name.toLowerCase());

  while ((match = bibleRefRegex.exec(text)) !== null) {
    const fullMatch = match[0];
    const bookName = match[1].trim();
    const chapterNum = parseInt(match[2], 10);

    // Validate if the matched string is actually a Bible book
    const bookNameLower = bookName.toLowerCase();
    const isValidBook = normalizedBooks.some(
      (b) => b === bookNameLower || b.startsWith(bookNameLower),
    );

    parts.push(text.substring(lastIndex, match.index));

    if (isValidBook) {
      parts.push(
        <button
          key={match.index}
          onClick={() =>
            onCrossReference && onCrossReference(bookName, chapterNum)
          }
          className="text-[#821111] font-bold hover:underline decoration-red-200 underline-offset-4 inline"
        >
          {fullMatch}
        </button>,
      );
    } else {
      // If not a valid book, just render as normal text
      parts.push(<span key={match.index}>{fullMatch}</span>);
    }

    lastIndex = match.index + fullMatch.length;
  }

  parts.push(text.substring(lastIndex));
  return parts;
};

const getMarkdownComponents = (
  onCrossReference?: (book: string, chapter: number) => void,
) => ({
  a: ({ node, ...props }: any) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#821111] dark:text-red-400 font-semibold hover:text-[#5a0b0b] dark:hover:text-red-300 underline decoration-[#821111]/30 hover:decoration-[#821111] underline-offset-4 transition-all"
    />
  ),
  blockquote: ({ node, ...props }: any) => (
    <blockquote
      {...props}
      className="border-l-4 border-[#821111] dark:border-red-900 bg-stone-100 dark:bg-stone-900 py-4 px-6 rounded-r-2xl italic text-stone-700 dark:text-stone-300 my-8 shadow-sm text-base leading-relaxed"
    />
  ),
  h1: ({ node, ...props }: any) => (
    <h1
      {...props}
      className="font-serif font-bold text-3xl text-[#821111] dark:text-red-400 border-b-2 border-[#821111]/20 pb-4 mt-12 mb-8"
    />
  ),
  h2: ({ node, ...props }: any) => (
    <h2
      {...props}
      className="font-serif font-semibold text-2xl text-stone-900 dark:text-white border-b border-stone-200 dark:border-stone-800 pb-3 mt-10 mb-6"
    />
  ),
  h3: ({ node, ...props }: any) => (
    <h3
      {...props}
      className="font-serif font-semibold text-xl text-stone-800 dark:text-stone-200 mt-8 mb-4"
    />
  ),
  h4: ({ node, ...props }: any) => (
    <h4
      {...props}
      className="font-sans font-bold text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-widest mt-6 mb-3"
    />
  ),
  ul: ({ node, ...props }: any) => (
    <ul
      {...props}
      className="list-disc list-outside ml-6 my-6 space-y-3 text-stone-700 dark:text-stone-300 marker:text-[#821111] dark:marker:text-red-800"
    />
  ),
  ol: ({ node, ...props }: any) => (
    <ol
      {...props}
      className="list-decimal list-outside ml-6 my-6 space-y-3 text-stone-700 dark:text-stone-300 marker:text-[#821111] dark:marker:text-red-800 marker:font-bold"
    />
  ),
  strong: ({ node, ...props }: any) => (
    <strong {...props} className="font-bold text-stone-900 dark:text-white" />
  ),
  p: ({ node, children, ...props }: any) => {
    if (typeof children === "string") {
      return (
        <p
          {...props}
          className="text-stone-700 dark:text-stone-300 leading-loose mb-6 text-base font-serif"
        >
          {renderMarkdownText(children, onCrossReference)}
        </p>
      );
    }
    if (Array.isArray(children)) {
      const newChildren = children.map((child: any, i: number) =>
        typeof child === "string" ? (
          <React.Fragment key={i}>
            {renderMarkdownText(child, onCrossReference)}
          </React.Fragment>
        ) : (
          child
        ),
      );
      return (
        <p
          {...props}
          className="text-stone-700 dark:text-stone-300 leading-loose mb-6 text-base font-serif"
        >
          {newChildren}
        </p>
      );
    }
    return (
      <p
        {...props}
        className="text-stone-700 dark:text-stone-300 leading-loose mb-6 text-base font-serif"
      >
        {children}
      </p>
    );
  },
  li: ({ node, children, ...props }: any) => {
    if (typeof children === "string") {
      return (
        <li
          {...props}
          className="leading-relaxed pl-1 text-stone-700 dark:text-stone-300"
        >
          {renderMarkdownText(children, onCrossReference)}
        </li>
      );
    }
    if (Array.isArray(children)) {
      const newChildren = children.map((child: any, i: number) =>
        typeof child === "string" ? (
          <React.Fragment key={i}>
            {renderMarkdownText(child, onCrossReference)}
          </React.Fragment>
        ) : (
          child
        ),
      );
      return (
        <li
          {...props}
          className="leading-relaxed pl-1 text-stone-700 dark:text-stone-300"
        >
          {newChildren}
        </li>
      );
    }
    return (
      <li
        {...props}
        className="leading-relaxed pl-1 text-stone-700 dark:text-stone-300"
      >
        {children}
      </li>
    );
  },
});

const MemoizedMarkdown = React.memo(
  ({
    content,
    onCrossReference,
  }: {
    content: string;
    onCrossReference?: (book: string, chapter: number) => void;
  }) => {
    const components = React.useMemo(
      () => getMarkdownComponents(onCrossReference),
      [onCrossReference],
    );
    return <Markdown components={components}>{content}</Markdown>;
  },
  (prevProps, nextProps) =>
    prevProps.content === nextProps.content &&
    prevProps.onCrossReference === nextProps.onCrossReference,
);

export const CommentaryPanel: React.FC<CommentaryPanelProps> = ({
  chapter,
  searchTrigger,
  state,
  setState,
  onCrossReference,
}) => {
  const lastProcessedTrigger = React.useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const commentaryContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

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
  const [followUp, setFollowUp] = useState<FollowUpState>({
    isOpen: false,
    selectedText: "",
    query: "",
    response: null,
    loading: false,
    error: null,
  });

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
  }, [searchTrigger, chapter]);

  useEffect(() => {
    if (state.text && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.text]);

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

            setSelectionRect({
              top: Math.max(10, rect.top - 45), // Position above the selection, keep on screen
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

  const handleGenerate = async (
    e?: React.FormEvent,
    overrideQuery?: string,
    overrideVerse?: number | null,
  ) => {
    if (e) e.preventDefault();
    if (!chapter) return;

    const currentQuery =
      overrideQuery !== undefined ? overrideQuery : state.query;
    const currentVerse =
      overrideVerse !== undefined ? overrideVerse : state.selectedVerse;

    setState((prev) => ({ ...prev, loading: true, error: null }));
    setSelectionRect(null); // Clear any selection when generating new content
    try {
      const result = await generateCommentary(
        chapter.text,
        chapter.reference,
        currentQuery,
        currentVerse === null ? undefined : currentVerse,
      );
      setState((prev) => ({
        ...prev,
        text: result || "No commentary generated.",
        loading: false,
      }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error:
          err.message ||
          "Failed to generate commentary. Please check your connection.",
        loading: false,
      }));
      console.error(err);
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
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[60]"
            style={{
              top: selectionRect.top,
              left: selectionRect.left,
              transform: "translateX(-50%)",
            }}
          >
            <div
              className="relative group cursor-pointer"
              onClick={openFollowUpModal}
            >
              <button className="bg-stone-900 dark:bg-stone-800 text-white px-5 py-2.5 md:px-4 md:py-2 rounded-2xl text-sm font-medium flex items-center gap-2 group-hover:bg-[#821111] dark:group-hover:bg-red-900 transition-colors shadow-2xl border border-stone-800/80 whitespace-nowrap">
                <MessageSquare
                  size={16}
                  className="text-stone-300 group-hover:text-white transition-colors"
                />
                Research this reference
              </button>
              {/* Little triangle pointer */}
              <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-stone-900 dark:bg-stone-800 group-hover:bg-[#821111] dark:group-hover:bg-red-900 transition-colors rotate-45 border-r border-b border-stone-800/80" />
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
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm p-0 md:p-6"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-stone-900 rounded-t-3xl md:rounded-2xl shadow-2xl w-full max-w-2xl h-[85vh] md:h-auto md:max-h-[85vh] flex flex-col overflow-hidden border-t md:border border-stone-200 dark:border-stone-800"
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
                    Follow-up Research
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
                    Deep Context Enabled
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2 block">
                      Referenced Text:
                    </span>
                    <blockquote className="border-l-4 border-[#821111]/40 dark:border-red-900/40 bg-stone-50 dark:bg-stone-950 py-3 px-4 rounded-r-xl italic text-stone-600 dark:text-stone-400 text-sm">
                      "{followUp.selectedText}"
                    </blockquote>
                  </div>
                </div>

                {followUp.loading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-4 text-stone-400 dark:text-stone-500">
                    <Loader2
                      className="animate-spin text-[#821111] dark:text-red-400"
                      size={32}
                    />
                    <p className="text-sm font-serif italic text-center">
                      Consulting historical sources and secondary scholarship...
                    </p>
                  </div>
                ) : followUp.error ? (
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {followUp.error}
                  </div>
                ) : followUp.response ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-3 block">
                      Synthesis:
                    </span>
                    <div className="commentary-content prose prose-stone dark:prose-invert prose-sm max-w-none">
                      <MemoizedMarkdown content={followUp.response} onCrossReference={onCrossReference} />
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-stone-400 dark:text-stone-500 font-serif italic text-sm">
                    Ask a question about the selected text above.
                  </div>
                )}
              </div>

              {/* Modal Footer (Input) */}
              <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 shrink-0">
                <form onSubmit={handleFollowUpSubmit} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Ask your follow-up research question..."
                    className="flex-1 px-4 py-3 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#821111]/20 dark:focus:ring-red-900/20 bg-white dark:bg-stone-800 text-stone-800 dark:text-white"
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

      <div className="p-5 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0 transition-colors">
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-xl">
              <MessageSquare
                className="text-[#821111] dark:text-red-400"
                size={20}
              />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-stone-800 dark:text-stone-100 leading-none">
                Research Room
              </h2>
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                Historical & Theological Synthesis
              </span>
            </div>
          </div>
        </div>
        {state.text && !state.loading && (
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  text: null,
                  query: "",
                  selectedVerse: null,
                }))
              }
              className="px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all flex items-center gap-1.5 border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
            >
              <X size={12} />
              Clear
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#821111] dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all flex items-center gap-1.5 border border-red-100 dark:border-red-900/50 shadow-sm"
            >
              <BookOpen size={12} />
              Copy
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-smooth bg-white dark:bg-stone-950 transition-colors pb-32 lg:pb-0"
      >
        <div className="p-5 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            {state.selectedVerse && (
              <div className="text-[10px] font-bold text-[#821111] dark:text-red-400 bg-red-50/50 dark:bg-red-950/30 p-3 rounded-xl border border-red-100 dark:border-red-900/50 flex justify-between items-center animate-in fade-in slide-in-from-top-2 duration-300 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#821111] dark:bg-red-500 rounded-full animate-pulse" />
                  <span>Verse {state.selectedVerse} Focus</span>
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
                placeholder="Theological question or topic..."
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
              className="w-full py-3 bg-stone-800 dark:bg-stone-700 text-white rounded-2xl text-sm font-bold hover:bg-stone-900 dark:hover:bg-stone-600 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg dark:shadow-black/20"
            >
              {state.loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <BookOpen size={18} />
              )}
              {state.loading
                ? "Consulting sources..."
                : "Synthesize Commentary"}
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
          {state.loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-stone-400 dark:text-stone-500 animate-pulse py-20">
              <Loader2
                className="animate-spin text-[#821111] dark:text-red-400"
                size={40}
              />
              <p className="text-sm font-serif italic">
                Compiling historical reception and scholarship...
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {state.error && (
                <div className="p-5 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400 text-sm leading-relaxed animate-in fade-in zoom-in-95 duration-300">
                  <p className="font-bold mb-1 uppercase tracking-widest text-[10px]">
                    Inquiry Error
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

                  <div className="mt-8 p-4 bg-stone-50 dark:bg-stone-900 border-l-4 border-stone-300 dark:border-stone-700 rounded-r-xl flex items-start gap-3">
                    <HelpCircle
                      className="text-stone-500 shrink-0 mt-0.5"
                      size={18}
                    />
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-serif">
                      <strong>Deep Research:</strong> Highlight any text in the
                      synthesis above to trigger a specific follow-up inquiry
                      focused on that context.
                    </p>
                  </div>

                  <div className="mt-4 p-4 bg-stone-50 dark:bg-stone-900 border-l-4 border-[#821111] dark:border-red-900 rounded-r-xl flex items-start gap-3">
                    <Users
                      className="text-[#821111] dark:text-red-400 shrink-0 mt-0.5"
                      size={18}
                    />
                    <p className="text-[10px] italic text-stone-500 dark:text-stone-500 leading-relaxed font-serif">
                      Historical scholarship provides analytical starting
                      points. All theological inquiry should be brought before
                      your local elders/pastors, as the Church is the primary
                      community for the interpretation of Sacred Scripture.
                    </p>
                  </div>

                  <div className="mt-12 p-6 bg-stone-900 dark:bg-stone-950 rounded-2xl text-white shadow-xl overflow-hidden relative group border border-white/5">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                      <Users size={120} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-serif font-bold text-xl mb-3">
                        Ecclesial Study
                      </h3>
                      <p className="text-stone-300 text-sm leading-relaxed mb-6 italic font-serif">
                        "The local church is the pillar and buttress of the
                        truth." These insights are research aids; the living
                        community of faith is where theology should be refined.
                      </p>
                      <div className="space-y-4">
                        <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold block">
                          Church Research Resources
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
                      Enter the Library
                    </h4>
                    <p className="text-sm font-serif italic leading-relaxed text-stone-500 dark:text-stone-500">
                      Initiate an inquiry to retrieve historical commentary,
                      lexical analysis, and theological synthesis.
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
