import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BibleViewer } from "./components/BibleViewer";
import { CommentaryPanel, CommentaryState } from "./components/CommentaryPanel";
import {
  WordStudyPanel,
  WordStudyState,
  defaultWordStudyState,
} from "./components/WordStudyPanel";
import { FloatingBibleNav } from "./components/FloatingBibleNav";
import { BIBLE_BOOKS, Book, BibleChapter } from "./types";
import { fetchBibleChapter } from "./services/bibleService";
import {
  BookOpen,
  Search,
  X,
  ArrowRight,
  ChevronDown,
  Type,
  History as HistoryIcon,
  Languages,
} from "lucide-react";

export interface HistoryItem {
  id: string;
  reference: string;
  query: string;
  state: CommentaryState;
  timestamp: number;
}

export default function App() {
  const [currentBook, setCurrentBook] = useState<Book>(() => {
    const saved = localStorage.getItem("theos_logos_book");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const book = BIBLE_BOOKS.find((b) => b.id === parsed.id);
        if (book) return book;
      } catch (e) {
        console.error("Failed to parse saved book", e);
      }
    }
    return BIBLE_BOOKS[0];
  });

  const [currentChapter, setCurrentChapter] = useState<number>(() => {
    const saved = localStorage.getItem("theos_logos_chapter");
    if (saved) {
      try {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse saved chapter", e);
      }
    }
    return 1;
  });

  const [chapterData, setChapterData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInstallHint, setShowInstallHint] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [viewMode, setViewMode] = useState<
    "bible" | "commentary" | "wordstudy"
  >("bible");
  // Desktop right-hand panel toggle (mobile uses viewMode instead)
  const [desktopPanel, setDesktopPanel] = useState<"commentary" | "wordstudy">(
    "commentary",
  );
  const [searchTrigger, setSearchTrigger] = useState<{
    query: string;
    verse: number | null;
    timestamp: number;
  } | null>(null);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [isCommentaryVisible, setIsCommentaryVisible] = useState(true);
  const [commentaryWidth, setCommentaryWidth] = useState(450);
  const [isResizing, setIsResizing] = useState(false);
  const resizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      // Reverse calculation because panel is on the right
      const newWidth = document.body.clientWidth - e.clientX;
      if (newWidth > 300 && newWidth < 800) {
        setCommentaryWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);
    
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // New features
  const [showTypography, setShowTypography] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [typography, setTypography] = useState<{
    size: number;
    font: "serif" | "sans";
    theme: "light" | "dark" | "auto";
  }>(() => {
    const saved = localStorage.getItem("theos_logos_typography");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { size: 1, font: "serif", theme: "auto" };
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem("theos_logos_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [commentaryState, setCommentaryState] = useState<CommentaryState>(
    () => {
      const saved = localStorage.getItem("theos_logos_commentary");
      const defaultState: CommentaryState = {
        text: null,
        loading: false,
        error: null,
        query: "",
        selectedVerse: null,
      };

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            return { ...defaultState, ...parsed, loading: false };
          }
        } catch (e) {
          console.error("Failed to parse saved commentary state", e);
        }
      }
      return defaultState;
    },
  );

  useEffect(() => {
    // Skip writes while streaming — the text updates on every chunk and
    // partial commentary shouldn't be persisted anyway.
    if (commentaryState.loading) return;
    localStorage.setItem(
      "theos_logos_commentary",
      JSON.stringify(commentaryState),
    );
  }, [commentaryState]);

  const [wordStudyState, setWordStudyState] = useState<WordStudyState>(() => {
    const saved = localStorage.getItem("theos_logos_wordstudy");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          return { ...defaultWordStudyState, ...parsed, loading: false };
        }
      } catch (e) {
        console.error("Failed to parse saved word study state", e);
      }
    }
    return defaultWordStudyState;
  });

  useEffect(() => {
    localStorage.setItem(
      "theos_logos_wordstudy",
      JSON.stringify(wordStudyState),
    );
  }, [wordStudyState]);

  useEffect(() => {
    localStorage.setItem("theos_logos_book", JSON.stringify(currentBook));
  }, [currentBook]);

  useEffect(() => {
    localStorage.setItem("theos_logos_chapter", currentChapter.toString());
  }, [currentChapter]);

  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    const handleNavVisibility = (e: Event) => {
      const customEvent = e as CustomEvent<{ visible: boolean }>;
      setNavVisible(customEvent.detail.visible);
    };
    window.addEventListener("nav-visibility", handleNavVisibility);
    return () => window.removeEventListener("nav-visibility", handleNavVisibility);
  }, []);

  // Handle typography changes
  useEffect(() => {
    const updateTheme = () => {
      localStorage.setItem("theos_logos_typography", JSON.stringify(typography));
      const sizes = ["14px", "16px", "18px", "20px", "24px", "28px", "32px"]; // 7 sizes
      document.documentElement.style.setProperty("--reading-font-size", sizes[typography.size] || "18px");

      if (typography.font === "sans") {
        document.documentElement.classList.add("force-sans");
      } else {
        document.documentElement.classList.remove("force-sans");
      }

      if (typography.theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else if (typography.theme === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.remove("dark", "light");
        if (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          document.documentElement.classList.add("dark");
        }
      }
      
      // Update theme-color meta tag
      let themeColor = '#fafaf9'; // light (stone-50)
      if (document.documentElement.classList.contains('dark')) {
        themeColor = '#0c0a09'; // dark (stone-950)
      }
      
      const existingMetaTags = document.querySelectorAll('meta[name="theme-color"]');
      existingMetaTags.forEach(tag => tag.remove());
      
      let metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      metaThemeColor.setAttribute('content', themeColor);
      document.head.appendChild(metaThemeColor);
    };

    updateTheme();
    
    // Listen for system theme changes if set to auto
    if (typography.theme === 'auto' && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => updateTheme();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [typography]);

  // Handle history persist
  useEffect(() => {
    localStorage.setItem("theos_logos_history", JSON.stringify(history));
  }, [history]);

  // Capture history on new commentary
  useEffect(() => {
    if (!commentaryState.loading && commentaryState.text && chapterData) {
      setHistory((prev) => {
        const isDuplicate =
          prev.length > 0 &&
          prev[0].query === commentaryState.query &&
          prev[0].reference === chapterData.reference &&
          prev[0].state.selectedVerse === commentaryState.selectedVerse;

        if (isDuplicate) return prev;

        const newItem: HistoryItem = {
          id: Date.now().toString(),
          reference: chapterData.reference,
          query: commentaryState.query || "General Commentary",
          state: { ...commentaryState },
          timestamp: Date.now(),
        };

        return [newItem, ...prev].slice(0, 20); // keep last 20
      });
    }
  }, [
    commentaryState.loading,
    commentaryState.text,
    chapterData,
    commentaryState.query,
    commentaryState.selectedVerse,
  ]);

  useEffect(() => {
    // Check local storage for disclaimer
    if (!localStorage.getItem("theos_logos_disclaimer_seen")) {
      setShowDisclaimer(true);
    }

    // On mobile/tablet portrait, start with bible view
    if (window.innerWidth < 1024) {
      setViewMode("bible");
    }

    // Check if it's iOS and not already in standalone mode
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;

    if (isIOS && !isStandalone) {
      setShowInstallHint(true);
    }
  }, []);

  const dismissDisclaimer = () => {
    localStorage.setItem("theos_logos_disclaimer_seen", "true");
    setShowDisclaimer(false);
  };

  useEffect(() => {
    const loadChapter = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBibleChapter(currentBook.id, currentChapter);
        setChapterData(data);

        // Scroll to top on chapter change
        const mainElement = document.querySelector("main");
        if (mainElement) mainElement.scrollTo({ top: 0, behavior: "smooth" });

        // Optimistically pre-fetch the next chapter in the background
        if (currentChapter < currentBook.chapters) {
          fetchBibleChapter(currentBook.id, currentChapter + 1).catch(() => {});
        } else {
          // pre-fetch next book's first chapter
          const currentIndex = BIBLE_BOOKS.findIndex(
            (b) => b.id === currentBook.id,
          );
          if (currentIndex >= 0 && currentIndex < BIBLE_BOOKS.length - 1) {
            fetchBibleChapter(BIBLE_BOOKS[currentIndex + 1].id, 1).catch(
              () => {},
            );
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load Bible text. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadChapter();
  }, [currentBook, currentChapter]);

  const handleBookChange = (book: Book) => {
    setCurrentBook(book);
    setCurrentChapter(1);
    setSearchTrigger(null);
    setCommentaryState((prev) => ({
      ...prev,
      text: null,
      query: "",
      error: null,
    }));
    if (window.innerWidth < 1024) {
      setViewMode("bible");
    }
  };

  const handleChapterChange = (chapter: number) => {
    setCurrentChapter(chapter);
    setSearchTrigger(null);
    setCommentaryState((prev) => ({
      ...prev,
      text: null,
      query: "",
      error: null,
    }));
  };

  const handleCrossReference = useCallback(
    (bookName: string, chapter: number) => {
      const book = BIBLE_BOOKS.find(
        (b) =>
          b.name.toLowerCase() === bookName.toLowerCase() ||
          b.id === bookName.toLowerCase(),
      );
      if (book) {
        setCurrentBook(book);
        setCurrentChapter(chapter);
        setViewMode("bible");
      }
    },
    [],
  );

  const handleNextChapter = useCallback(() => {
    if (!currentBook) return;

    // Clear commentary & search state when changing chapters manually
    setSearchTrigger(null);
    setCommentaryState((prev) => ({
      ...prev,
      text: null,
      query: "",
      error: null,
    }));

    if (currentChapter < currentBook.chapters) {
      setCurrentChapter((prev) => prev + 1);
    } else {
      // Move to next book if possible
      const currentIndex = BIBLE_BOOKS.findIndex(
        (b) => b.id === currentBook.id,
      );
      if (currentIndex >= 0 && currentIndex < BIBLE_BOOKS.length - 1) {
        setCurrentBook(BIBLE_BOOKS[currentIndex + 1]);
        setCurrentChapter(1);
      }
    }
  }, [currentBook, currentChapter]);

  const handlePrevChapter = useCallback(() => {
    if (!currentBook) return;

    // Clear commentary & search state when changing chapters manually
    setSearchTrigger(null);
    setCommentaryState((prev) => ({
      ...prev,
      text: null,
      query: "",
      error: null,
    }));

    if (currentChapter > 1) {
      setCurrentChapter((prev) => prev - 1);
    } else {
      // Move to previous book if possible
      const currentIndex = BIBLE_BOOKS.findIndex(
        (b) => b.id === currentBook.id,
      );
      if (currentIndex > 0) {
        const prevBook = BIBLE_BOOKS[currentIndex - 1];
        setCurrentBook(prevBook);
        setCurrentChapter(prevBook.chapters);
      }
    }
  }, [currentBook, currentChapter]);

  return (
    <div className="absolute inset-0 w-full h-full flex bg-white dark:bg-stone-950 overflow-hidden flex-col md:flex-row transition-colors duration-300">
      {/* Noise Texture */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Disclaimer Modal */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 dark:bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 dark:border-stone-800"
            >
              <div className="relative h-32 bg-stone-900 dark:bg-black flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900 via-transparent to-transparent" />
                </div>
                <BookOpen className="text-white relative z-10" size={40} />
              </div>
              <div className="p-8 md:p-10">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4 text-center">
                  A Research Tool, Not a Teacher
                </h2>
                <div className="space-y-4 mb-8">
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-center">
                    THEOS LOGOS surfaces historical commentary and scholarship
                    to support your Bible study. It is not a substitute for your
                    pastor, your local church, or the community of believers.
                  </p>
                  <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-100 dark:border-stone-800">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2">
                      Our Methodology
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed text-center">
                      We prioritize the{" "}
                      <span className="text-[#821111] dark:text-red-400 font-bold">
                        Grammatical-Historical method
                      </span>
                      , drawing from Church Fathers, Reformers, and Puritans to
                      provide objective, scholarly insights.
                    </p>
                  </div>
                </div>
                <button
                  onClick={dismissDisclaimer}
                  className="w-full py-4 bg-stone-900 dark:bg-stone-800 text-white rounded-2xl font-bold tracking-wide hover:bg-[#821111] dark:hover:bg-red-900 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Enter Library
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Drawer */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white dark:bg-stone-950 border-l border-stone-200 dark:border-stone-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 pt-[max(env(safe-area-inset-top),1rem)] border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 shrink-0">
                <div className="flex items-center gap-2">
                  <HistoryIcon className="text-stone-500" size={18} />
                  <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-stone-100">
                    Study History
                  </h3>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 pb-[max(env(safe-area-inset-bottom),1rem)] space-y-3">
                {history.length === 0 ? (
                  <div className="text-center py-10 text-stone-400 dark:text-stone-600 font-serif italic text-sm">
                    No study history yet. Generate commentary to save it here.
                  </div>
                ) : (
                  history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        // Book names can contain spaces ("1 John", "Song of
                        // Solomon") — the chapter is everything after the
                        // last space.
                        const lastSpace = item.reference.lastIndexOf(" ");
                        handleCrossReference(
                          item.reference.slice(0, lastSpace),
                          parseInt(
                            item.reference.slice(lastSpace + 1).split(":")[0],
                            10,
                          ),
                        );
                        setCommentaryState(item.state);
                        setViewMode("commentary");
                        setShowHistory(false);
                      }}
                      className="w-full text-left p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-600 transition-colors group shadow-sm hover:shadow-md"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-[#821111] dark:text-red-400 uppercase tracking-wider">
                          {item.reference}
                          {item.state.selectedVerse
                            ? `:${item.state.selectedVerse}`
                            : ""}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-serif text-stone-800 dark:text-stone-200 text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
                        <span className="font-semibold">{item.query}: </span>
                        <span className="italic text-stone-500 dark:text-stone-400">
                          {item.state.text
                            ?.replace(/[#_*\[\]`]/g, "")
                            .substring(0, 100)}
                          ...
                        </span>
                      </p>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="pt-[env(safe-area-inset-top)] bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 z-10 shrink-0 transition-colors relative shadow-[0_1px_0_rgb(231,229,228),0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_0_rgb(41,37,36),0_4px_16px_rgba(0,0,0,0.08)]">
          {/* Oxblood authority stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
            style={{ background: "linear-gradient(90deg, #821111 0%, rgba(130,17,17,0.4) 60%, transparent 100%)" }}
          />
          <div className="h-14 flex items-center px-3 md:px-4">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {/* Logo mark with gradient + inner highlight */}
              <div
                className="flex items-center justify-center w-8 h-8 shrink-0"
                style={{
                  borderRadius: 9,
                  background: "linear-gradient(145deg, #9b1515 0%, #821111 50%, #6a0d0d 100%)",
                  boxShadow: "0 1px 3px rgba(130,17,17,0.5), inset 0 1px 0 rgba(255,255,255,0.18)",
                  border: "1px solid rgba(60,5,5,0.4)",
                }}
              >
                <span
                  className="font-serif font-bold text-white leading-none"
                  style={{ fontSize: 13, letterSpacing: "-0.04em", paddingTop: 1, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                >TL</span>
              </div>
              {/* Brand name — hidden on mobile */}
              <div className="hidden sm:flex flex-col gap-[1px]">
                <span className="font-serif font-bold text-stone-900 dark:text-stone-100 leading-none" style={{ fontSize: 15, letterSpacing: "-0.02em" }}>
                  Theos Logos
                </span>
                <span className="tl-eyebrow leading-none">Scholarly Study</span>
              </div>
            </div>

            <div className="flex justify-center shrink-0 mx-2">
              <button
                onClick={() => setShowFloatingNav(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full transition-colors border border-stone-200 dark:border-stone-700 shadow-sm whitespace-nowrap"
              >
                <span className="font-serif font-bold text-stone-800 dark:text-stone-100 text-xs sm:text-sm">
                  {currentBook.name} {currentChapter}
                </span>
                <ChevronDown size={14} className="text-stone-500 shrink-0" />
              </button>
            </div>

            <div className="flex items-center justify-end flex-1 gap-2 min-w-0">
              <div className="hidden lg:flex items-center gap-3 mr-2">
                <div className="flex items-center gap-2 px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-stone-500 dark:text-stone-400 text-[10px] font-medium border border-stone-200 dark:border-stone-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  <span>Web Grounded</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-stone-500 dark:text-stone-400 text-[10px] font-medium border border-stone-200 dark:border-stone-700">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span>Gemini AI Active</span>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setShowTypography(!showTypography);
                    setShowHistory(false);
                  }}
                  className={`p-2 rounded-lg transition-colors border ${showTypography ? "bg-[#821111] border-[#821111] text-white" : "bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300"}`}
                  title="Typography Settings"
                >
                  <Type size={16} />
                </button>
                {showTypography && (
                  <>
                    <div
                      className="fixed inset-0 z-40 lg:hidden"
                      onClick={() => setShowTypography(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute right-0 top-12 w-64 bg-white/80 dark:bg-stone-900/80 backdrop-blur-2xl backdrop-saturate-200 border border-white/50 dark:border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] z-50 p-6"
                    >
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-4">
                        Reading Appearance
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                            Font Size
                          </p>
                          <div className="flex items-center gap-4 bg-stone-100/50 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-200/50 dark:border-stone-700/50">
                            <button
                              onClick={() => setTypography(prev => ({...prev, size: Math.max(0, prev.size - 1)}))}
                              disabled={typography.size === 0}
                              className="text-sm font-serif text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              A
                            </button>
                            <div className="relative flex-1 flex items-center mx-2">
                              <input
                                type="range"
                                min="0"
                                max="6"
                                step="1"
                                value={typography.size}
                                onChange={(e) =>
                                  setTypography((prev) => ({
                                    ...prev,
                                    size: parseInt(e.target.value),
                                  }))
                                }
                                className="w-full appearance-none bg-stone-300 dark:bg-stone-600 h-1 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[#821111] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                              />
                            </div>
                            <button
                              onClick={() => setTypography(prev => ({...prev, size: Math.min(6, prev.size + 1)}))}
                              disabled={typography.size === 6}
                              className="text-2xl font-serif text-stone-800 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              A
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                            Typeface
                          </p>
                          <div className="flex bg-stone-100/50 dark:bg-stone-800/50 rounded-xl p-1 backdrop-blur-sm border border-stone-200/50 dark:border-stone-700/50">
                            <button
                              onClick={() =>
                                setTypography((prev) => ({
                                  ...prev,
                                  font: "serif",
                                }))
                              }
                              className={`flex-1 py-1.5 rounded-lg text-sm font-serif transition-all duration-300 ${typography.font === "serif" ? "bg-white dark:bg-stone-700 shadow-sm text-[#821111] dark:text-red-400 font-bold scale-[1.02]" : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"}`}
                            >
                              Serif
                            </button>
                            <button
                              onClick={() =>
                                setTypography((prev) => ({
                                  ...prev,
                                  font: "sans",
                                }))
                              }
                              className={`flex-1 py-1.5 rounded-lg text-sm font-sans transition-all duration-300 ${typography.font === "sans" ? "bg-white dark:bg-stone-700 shadow-sm text-[#821111] dark:text-red-400 font-bold scale-[1.02]" : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"}`}
                            >
                              Sans
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                            Theme
                          </p>
                          <div className="flex bg-stone-100/50 dark:bg-stone-800/50 rounded-xl p-1 backdrop-blur-sm border border-stone-200/50 dark:border-stone-700/50">
                            {["auto", "light", "dark"].map((t) => (
                              <button
                                key={t}
                                onClick={() =>
                                  setTypography((prev) => ({
                                    ...prev,
                                    theme: t as any,
                                  }))
                                }
                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-300 ${typography.theme === t ? "bg-white dark:bg-stone-700 shadow-sm text-[#821111] dark:text-red-400 scale-[1.02]" : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"}`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setShowHistory(!showHistory);
                    setShowTypography(false);
                  }}
                  className={`p-2 rounded-lg transition-colors border ${showHistory ? "bg-[#821111] border-[#821111] text-white" : "bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300"}`}
                  title="Study History"
                >
                  <HistoryIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content - Mobile Responsive */}
        <main className="flex-1 flex overflow-hidden relative">
          {/* Mobile/Tablet Layout (Animated) */}
          <div className="flex-1 flex lg:hidden relative overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Bible Viewer */}
              {viewMode === "bible" && (
                <motion.div
                  key="bible"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 w-full h-full overflow-hidden flex flex-col relative"
                >
                  <FloatingBibleNav
                    currentBook={currentBook}
                    currentChapter={currentChapter}
                    onBookChange={handleBookChange}
                    onChapterChange={handleChapterChange}
                    isVisible={showFloatingNav}
                    onClose={() => setShowFloatingNav(false)}
                  />
                  <BibleViewer
                    chapter={chapterData}
                    loading={loading}
                    error={error}
                    onVerseSearch={(verse, query) => {
                      setSearchTrigger({ query, verse, timestamp: Date.now() });
                      setViewMode("commentary");
                    }}
                    onNextChapter={handleNextChapter}
                    onPrevChapter={handlePrevChapter}
                  />
                </motion.div>
              )}

              {/* Commentary Panel */}
              {viewMode === "commentary" && (
                <motion.div
                  key="commentary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full h-full overflow-hidden flex flex-col"
                >
                  <CommentaryPanel
                    chapter={chapterData}
                    searchTrigger={searchTrigger}
                    state={commentaryState}
                    setState={setCommentaryState}
                    onCrossReference={handleCrossReference}
                  />
                </motion.div>
              )}

              {/* Word Study Panel */}
              {viewMode === "wordstudy" && (
                <motion.div
                  key="wordstudy"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full h-full overflow-hidden flex flex-col"
                >
                  <WordStudyPanel
                    chapter={chapterData}
                    state={wordStudyState}
                    setState={setWordStudyState}
                    onCrossReference={handleCrossReference}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Layout (Static) */}
          <div className="hidden lg:flex flex-1 h-full overflow-hidden relative">
            <div className="flex-1 h-full overflow-hidden relative">
              <FloatingBibleNav
                currentBook={currentBook}
                currentChapter={currentChapter}
                onBookChange={handleBookChange}
                onChapterChange={handleChapterChange}
                isVisible={showFloatingNav}
                onClose={() => setShowFloatingNav(false)}
              />
              <BibleViewer
                chapter={chapterData}
                loading={loading}
                error={error}
                onVerseSearch={(verse, query) => {
                  setSearchTrigger({ query, verse, timestamp: Date.now() });
                  setDesktopPanel("commentary");
                  if (!isCommentaryVisible) setIsCommentaryVisible(true);
                }}
                onNextChapter={handleNextChapter}
                onPrevChapter={handlePrevChapter}
              />
            </div>
            {isCommentaryVisible && (
              <>
                <div
                  ref={resizerRef}
                  onMouseDown={() => setIsResizing(true)}
                  className={`w-2 cursor-col-resize flex flex-col items-center justify-center hover:bg-[#821111]/5 dark:hover:bg-red-900/10 transition-colors z-20 relative group ${isResizing ? "bg-[#821111]/5 dark:bg-red-900/10" : "bg-transparent"}`}
                >
                  <div className={`w-1 h-8 rounded-full transition-colors duration-300 ${isResizing ? "bg-[#821111] dark:bg-red-800" : "bg-stone-300 dark:bg-stone-700 group-hover:bg-[#821111]/50 dark:group-hover:bg-red-900/50"}`} />
                </div>
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: commentaryWidth, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="h-full overflow-hidden border-l border-stone-200 dark:border-stone-800 transition-colors flex flex-col"
                >
                  {/* Desktop panel switcher */}
                  <div className="shrink-0 flex items-center gap-1 p-2 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
                    <button
                      onClick={() => setDesktopPanel("commentary")}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${desktopPanel === "commentary" ? "bg-stone-100 dark:bg-stone-800 text-[#821111] dark:text-red-400 shadow-sm" : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"}`}
                    >
                      <Search size={13} />
                      Research
                    </button>
                    <button
                      onClick={() => setDesktopPanel("wordstudy")}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${desktopPanel === "wordstudy" ? "bg-stone-100 dark:bg-stone-800 text-[#821111] dark:text-red-400 shadow-sm" : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"}`}
                    >
                      <Languages size={13} />
                      Word Study
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    {desktopPanel === "commentary" ? (
                      <CommentaryPanel
                        chapter={chapterData}
                        searchTrigger={searchTrigger}
                        state={commentaryState}
                        setState={setCommentaryState}
                        onCrossReference={handleCrossReference}
                      />
                    ) : (
                      <WordStudyPanel
                        chapter={chapterData}
                        state={wordStudyState}
                        setState={setWordStudyState}
                        onCrossReference={handleCrossReference}
                      />
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </main>

        {/* Mobile Bottom Navigation - iOS 26 Floating Pill Style */}
        <div
          className={`lg:hidden fixed left-0 right-0 flex justify-center z-50 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${navVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-[150%] opacity-0 scale-95"}`}
          style={{ bottom: "calc(16px + env(safe-area-inset-bottom))" }}
        >
          <nav className="bg-white/30 dark:bg-stone-900/30 backdrop-blur-2xl backdrop-saturate-200 border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center justify-center p-1 rounded-full pointer-events-auto max-w-max transition-colors">
            <button
              onClick={() => setViewMode("bible")}
              className={`flex flex-row items-center justify-center gap-1.5 px-3.5 py-1.5 transition-all duration-400 rounded-full ${viewMode === "bible" ? "bg-white/90 dark:bg-white/20 shadow-sm text-[#821111] dark:text-red-300" : "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"}`}
            >
              <BookOpen
                size={14}
                strokeWidth={viewMode === "bible" ? 2.5 : 2}
              />
              <span
                className={`text-[9px] font-bold uppercase tracking-[0.2em] mt-[1px] ${viewMode === "bible" ? "opacity-100" : "opacity-80"}`}
              >
                Bible
              </span>
            </button>
            <button
              onClick={() => setViewMode("commentary")}
              className={`flex flex-row items-center justify-center gap-1.5 px-3.5 py-1.5 transition-all duration-400 rounded-full ${viewMode === "commentary" ? "bg-white/90 dark:bg-white/20 shadow-sm text-[#821111] dark:text-red-300" : "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"}`}
            >
              <Search
                size={14}
                strokeWidth={viewMode === "commentary" ? 2.5 : 2}
              />
              <span
                className={`text-[9px] font-bold uppercase tracking-[0.2em] mt-[1px] ${viewMode === "commentary" ? "opacity-100" : "opacity-80"}`}
              >
                Research
              </span>
            </button>
            <button
              onClick={() => setViewMode("wordstudy")}
              className={`flex flex-row items-center justify-center gap-1.5 px-3.5 py-1.5 transition-all duration-400 rounded-full ${viewMode === "wordstudy" ? "bg-white/90 dark:bg-white/20 shadow-sm text-[#821111] dark:text-red-300" : "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"}`}
            >
              <Languages
                size={14}
                strokeWidth={viewMode === "wordstudy" ? 2.5 : 2}
              />
              <span
                className={`text-[9px] font-bold uppercase tracking-[0.2em] mt-[1px] ${viewMode === "wordstudy" ? "opacity-100" : "opacity-80"}`}
              >
                Words
              </span>
            </button>
          </nav>
        </div>

        {/* iOS Install Hint */}
        {showInstallHint && (
          <div
            className="fixed left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors text-stone-950 dark:text-stone-50"
            style={{ bottom: "calc(env(safe-area-inset-bottom) + 80px)" }}
          >
            <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-xl">
              <BookOpen
                className="text-[#821111] dark:text-red-400"
                size={24}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Install THEOS LOGOS</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Tap the share icon and select "Add to Home Screen" for the best
                experience.
              </p>
            </div>
            <button
              onClick={() => setShowInstallHint(false)}
              className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full"
            >
              <X size={16} className="text-stone-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
