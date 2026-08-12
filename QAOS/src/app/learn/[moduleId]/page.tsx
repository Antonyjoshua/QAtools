import { notFound } from "next/navigation";
import { getModuleMeta } from "@/lib/learn/content/registry";
import { ModuleTopicList } from "@/components/learn/library/module-topic-list";

export default async function LearnModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  if (!getModuleMeta(moduleId)) notFound();

  return <ModuleTopicList moduleId={moduleId} />;
}
