import { createFileRoute } from "@tanstack/react-router";
import { StudyWorkspace } from "@/components/study/workspace";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <StudyWorkspace />;
}
