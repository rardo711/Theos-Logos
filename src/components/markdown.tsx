import React from "react";
import Markdown from "react-markdown";
import { BIBLE_BOOKS } from "../types";

/**
 * Shared markdown rendering for the Research and Word Study panels.
 * Centralizing this keeps typography consistent across the app and
 * gives both scholars and lay readers a predictable visual hierarchy.
 */

// Match standard Bible references (e.g. Romans 8:28, 1 John 1:9, Genesis 3)
const bibleRefRegex = /\b([1-3]?\s*[A-Za-z]+)\s+(\d+)(?::\d+(?:-\d+)?)?\b/g;

export const renderMarkdownText = (
  text: string,
  onCrossReference?: (book: string, chapter: number) => void,
) => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  const normalizedBooks = BIBLE_BOOKS.map((b) => b.name.toLowerCase());

  while ((match = bibleRefRegex.exec(text)) !== null) {
    const fullMatch = match[0];
    const bookName = match[1].trim();
    const chapterNum = parseInt(match[2], 10);

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
          className="text-[#821111] dark:text-red-400 font-semibold hover:underline decoration-red-300/60 underline-offset-4 inline transition-colors"
        >
          {fullMatch}
        </button>,
      );
    } else {
      parts.push(<span key={match.index}>{fullMatch}</span>);
    }

    lastIndex = match.index + fullMatch.length;
  }

  parts.push(text.substring(lastIndex));
  return parts;
};

const withRefs = (
  children: any,
  onCrossReference?: (book: string, chapter: number) => void,
) => {
  if (typeof children === "string") {
    return renderMarkdownText(children, onCrossReference);
  }
  if (Array.isArray(children)) {
    return children.map((child: any, i: number) =>
      typeof child === "string" ? (
        <React.Fragment key={i}>
          {renderMarkdownText(child, onCrossReference)}
        </React.Fragment>
      ) : (
        child
      ),
    );
  }
  return children;
};

export const getMarkdownComponents = (
  onCrossReference?: (book: string, chapter: number) => void,
) => ({
  a: ({ node, ...props }: any) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#821111] dark:text-red-400 font-semibold hover:text-[#5a0b0b] dark:hover:text-red-300 underline decoration-[#821111]/30 hover:decoration-[#821111] underline-offset-4 transition-all break-words"
    />
  ),
  blockquote: ({ node, ...props }: any) => (
    <blockquote
      {...props}
      className="border-l-[3px] border-[#821111] dark:border-red-800 bg-stone-50 dark:bg-stone-900/60 py-3 px-5 rounded-r-xl italic text-stone-700 dark:text-stone-300 my-6 text-[15px] leading-relaxed"
    />
  ),
  // Top-level section title (e.g. a passage heading)
  h1: ({ node, ...props }: any) => (
    <h1
      {...props}
      className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-50 border-b border-stone-200 dark:border-stone-800 pb-3 mt-10 mb-5 first:mt-0"
    />
  ),
  // Major section (e.g. "Historical Reception", "Lexical Analysis")
  h2: ({ node, ...props }: any) => (
    <h2
      {...props}
      className="font-serif font-bold text-xl text-stone-900 dark:text-stone-50 mt-9 mb-4 first:mt-0 flex items-center gap-2.5 before:content-[''] before:w-1 before:h-5 before:bg-[#821111] before:dark:bg-red-800 before:rounded-full"
    />
  ),
  // Sub-section / tradition perspective (e.g. "Reformed Perspective")
  h3: ({ node, ...props }: any) => (
    <h3
      {...props}
      className="font-sans font-bold text-[11px] text-[#821111] dark:text-red-400 uppercase tracking-[0.15em] mt-7 mb-3 pb-2 border-b border-stone-200/70 dark:border-stone-800"
    />
  ),
  // Minor label
  h4: ({ node, ...props }: any) => (
    <h4
      {...props}
      className="font-sans font-bold text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-[0.18em] mt-5 mb-2"
    />
  ),
  ul: ({ node, ...props }: any) => (
    <ul
      {...props}
      className="list-disc list-outside ml-5 my-4 space-y-2 text-stone-700 dark:text-stone-300 marker:text-[#821111]/60 dark:marker:text-red-800"
    />
  ),
  ol: ({ node, ...props }: any) => (
    <ol
      {...props}
      className="list-decimal list-outside ml-5 my-4 space-y-2 text-stone-700 dark:text-stone-300 marker:text-[#821111] dark:marker:text-red-800 marker:font-bold"
    />
  ),
  hr: ({ node, ...props }: any) => (
    <hr
      {...props}
      className="my-7 border-0 h-px bg-stone-200 dark:bg-stone-800"
    />
  ),
  strong: ({ node, ...props }: any) => (
    <strong
      {...props}
      className="font-bold text-stone-900 dark:text-stone-100"
    />
  ),
  em: ({ node, ...props }: any) => (
    <em {...props} className="italic text-stone-800 dark:text-stone-200" />
  ),
  code: ({ node, ...props }: any) => (
    <code
      {...props}
      className="font-serif text-[15px] text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800/80 px-1.5 py-0.5 rounded"
    />
  ),
  table: ({ node, ...props }: any) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-stone-200 dark:border-stone-800">
      <table {...props} className="w-full text-sm border-collapse" />
    </div>
  ),
  thead: ({ node, ...props }: any) => (
    <thead
      {...props}
      className="bg-stone-100 dark:bg-stone-900 text-left"
    />
  ),
  th: ({ node, ...props }: any) => (
    <th
      {...props}
      className="px-4 py-2.5 font-sans font-bold text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800"
    />
  ),
  td: ({ node, children, ...props }: any) => (
    <td
      {...props}
      className="px-4 py-2.5 text-stone-700 dark:text-stone-300 border-b border-stone-100 dark:border-stone-800/60 align-top"
    >
      {withRefs(children, onCrossReference)}
    </td>
  ),
  p: ({ node, children, ...props }: any) => (
    <p
      {...props}
      className="text-stone-700 dark:text-stone-300 leading-[1.75] mb-4 text-[15px] font-serif"
    >
      {withRefs(children, onCrossReference)}
    </p>
  ),
  li: ({ node, children, ...props }: any) => (
    <li
      {...props}
      className="leading-relaxed pl-1 text-stone-700 dark:text-stone-300 text-[15px] font-serif"
    >
      {withRefs(children, onCrossReference)}
    </li>
  ),
});

export const MemoizedMarkdown = React.memo(
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
