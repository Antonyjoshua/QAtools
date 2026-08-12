import { BugDetailPage } from "@/components/bugs/bug-detail-page";

export default async function BugPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // key forces a full remount per bug id — otherwise React reuses the same
  // component instance across SPA navigations between bugs, and its local
  // draft state (title, pending autosave patch) can race the newly loaded
  // bug's data instead of resetting cleanly.
  return <BugDetailPage key={id} bugId={id} />;
}
