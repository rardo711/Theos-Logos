import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BIBLE_BOOKS, Book } from "../types";
import { useI18n, getBookDisplayName, ES_BOOK_NAMES } from "../i18n";
import { ChevronDown, X } from "lucide-react";

interface FloatingBibleNavProps {
  currentBook: Book;
  currentChapter: number;
  onBookChange: (book: Book) => void;
  onChapterChange: (chapter: number) => void;
  isVisible: boolean;
  onClose: () => void;
}

export const FloatingBibleNav: React.FC<FloatingBibleNavProps> = ({
  currentBook,
  currentChapter,
  onBookChange,
  onChapterChange,
  isVisible,
  onClose
}) => {
  const { lang, s } = useI18n();
  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const chapterContainerRef = useRef<HTMLDivElement>(null);

  const filteredBooks = BIBLE_BOOKS.filter((book) => {
    const q = searchQuery.toLowerCase();
    return (
      book.name.toLowerCase().includes(q) ||
      (ES_BOOK_NAMES[book.id] ?? "").toLowerCase().includes(q)
    );
  });

  const oldTestament = filteredBooks.filter(book => BIBLE_BOOKS.indexOf(book) < 39);
  const newTestament = filteredBooks.filter(book => BIBLE_BOOKS.indexOf(book) >= 39);

  // Auto-scroll to current chapter
  useEffect(() => {
    if (chapterContainerRef.current && isVisible) {
      const activeChapter = chapterContainerRef.current.querySelector('.active-chapter') as HTMLElement;
      if (activeChapter) {
        activeChapter.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentChapter, isVisible, isBookDropdownOpen]);

  // Close dropdown when nav hides
  useEffect(() => {
    if (!isVisible) {
      setIsBookDropdownOpen(false);
      setSearchQuery("");
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] md:pt-[15vh] px-4 backdrop-blur-sm pointer-events-auto">
          {/* Backdrop (clicks close modal) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/30 dark:bg-black/50 transition-colors"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl rounded-2xl overflow-hidden pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Book Selector Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50">
              <div 
                className="flex items-center gap-2 cursor-pointer group flex-1"
                onClick={() => setIsBookDropdownOpen(!isBookDropdownOpen)}
              >
                <div className="flex items-center text-[#821111] dark:text-red-400">
                  <span className="font-serif font-bold text-xl text-stone-800 dark:text-stone-100 group-hover:text-[#821111] dark:group-hover:text-red-400 transition-colors">{getBookDisplayName(currentBook, lang)}</span>
                  <ChevronDown size={20} className={`ml-2 transition-transform duration-300 ${isBookDropdownOpen ? 'rotate-180 text-[#821111] dark:text-red-400' : 'text-stone-400'}`} />
                </div>
              </div>
              <div className="flex justify-end items-center gap-4 shrink-0">
                <span className="text-[10px] font-bold text-[#821111] dark:text-red-400 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-full uppercase tracking-widest border border-stone-200 dark:border-stone-700">{s.chapterAbbrev} {currentChapter}</span>
                <button 
                  onClick={onClose} 
                  className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 transition-colors active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Book Dropdown */}
            <AnimatePresence>
              {isBookDropdownOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-b border-stone-100 dark:border-stone-800"
                >
                  <div className="max-h-[50vh] overflow-y-auto p-5 bg-stone-50 dark:bg-stone-900 hide-scrollbar">
                    {/* Search Input */}
                    <div className="mb-5 sticky top-0 z-10">
                      <input 
                        type="text"
                        placeholder={s.searchBooks}
                        autoFocus
                        className="w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#821111]/20 dark:focus:ring-red-400/20 text-stone-800 dark:text-stone-100 placeholder:font-serif placeholder:italic shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {oldTestament.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#821111] dark:text-red-400 mb-3 px-1">{s.oldTestament}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {oldTestament.map((book) => (
                            <button
                              key={book.id}
                              onClick={() => {
                                onBookChange(book);
                                setIsBookDropdownOpen(false);
                                setSearchQuery("");
                              }}
                              className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                                currentBook.id === book.id 
                                  ? 'bg-[#821111] dark:bg-red-900 border border-[#821111] dark:border-red-800 text-white font-bold shadow-md' 
                                  : 'text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border border-transparent hover:border-stone-200 dark:hover:border-stone-700 shadow-sm hover:shadow-md'
                              }`}
                            >
                              {getBookDisplayName(book, lang)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {newTestament.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#821111] dark:text-red-400 mb-3 px-1">{s.newTestament}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {newTestament.map((book) => (
                            <button
                              key={book.id}
                              onClick={() => {
                                onBookChange(book);
                                setIsBookDropdownOpen(false);
                                setSearchQuery("");
                              }}
                              className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                                currentBook.id === book.id 
                                  ? 'bg-[#821111] dark:bg-red-900 border border-[#821111] dark:border-red-800 text-white font-bold shadow-md' 
                                  : 'text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border border-transparent hover:border-stone-200 dark:hover:border-stone-700 shadow-sm hover:shadow-md'
                              }`}
                            >
                              {getBookDisplayName(book, lang)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredBooks.length === 0 && (
                      <div className="py-10 text-center">
                        <p className="text-stone-400 dark:text-stone-500 italic font-serif">{s.noBooksFound} "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chapter Slider */}
            <div 
              ref={chapterContainerRef}
              className="flex overflow-x-auto p-4 gap-3 hide-scrollbar items-center scroll-smooth bg-white dark:bg-stone-900"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((ch) => (
                <button
                  key={ch}
                  onClick={() => {
                     onChapterChange(ch);
                     onClose();
                  }}
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border ${
                    currentChapter === ch 
                      ? 'bg-[#821111] dark:bg-red-900 border-[#821111] dark:border-red-800 text-white shadow-lg scale-110 active-chapter ring-2 ring-[#821111]/20 dark:ring-red-900/40 ring-offset-2 dark:ring-offset-stone-900' 
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
