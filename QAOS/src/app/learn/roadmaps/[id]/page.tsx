import { notFound } from "next/navigation";
import { getRoadmap } from "@/lib/learn/content/registry";
import { RoadmapView } from "@/components/learn/roadmaps/roadmap-view";

export default async function RoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const roadmap = getRoadmap(id);
  if (!roadmap) notFound();

  return <RoadmapView roadmap={roadmap} />;
}
