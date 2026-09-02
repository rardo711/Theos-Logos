import { useEffect } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { StudyWorkspace } from "@/components/study/workspace";
import { findBook } from "@/lib/bible/books";
import { useStudy } from "@/lib/study-store";

export const Route = createFileRoute("/$book/$chapter")({
  beforeLoad: ({ params }) => {
    const book = findBook(params.book);
    const chapter = Number.parseInt(params.chapter, 10);
    if (!book || !Number.isFinite(chapter)) {
      throw notFound();
    }
    return { bookId: book.id, chapter };
  },
  component: BookChapterDesk,
});

function BookChapterDesk() {
  const { bookId, chapter } = Route.useRouteContext();

  useEffect(() => {
    useStudy.getState().setBook(bookId, chapter);
  }, [bookId, chapter]);

  return <StudyWorkspace />;
}
