import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { StudyWorkspace } from "@/components/study/workspace";
import { useStudy } from "@/lib/study-store";

export const Route = createFileRoute("/sources")({ component: SourcesRoute });

function SourcesRoute() {
  useEffect(() => {
    useStudy.getState().setSourcesPageOpen(true);
  }, []);

  return <StudyWorkspace />;
}
