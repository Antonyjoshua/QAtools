import { JobDetailPage } from "@/components/jobs/job-detail-page";

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JobDetailPage key={id} jobId={id} />;
}
