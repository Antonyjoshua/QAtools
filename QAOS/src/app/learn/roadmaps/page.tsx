import Link from "next/link";
import { ArrowLeft, Map } from "lucide-react";
import { ROADMAPS } from "@/lib/learn/content/registry";

export default function RoadmapsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/learn" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Learn
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Career Roadmaps</h1>
      <p className="mt-1 text-muted-foreground">Step-by-step paths for every QA specialization, from Manual Tester to Test Architect.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROADMAPS.map((r) => (
          <Link key={r.id} href={`/learn/roadmaps/${r.id}`} className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
            <Map className="size-5 text-primary" />
            <p className="font-medium group-hover:text-primary">{r.title}</p>
            <p className="text-xs text-muted-foreground">{r.description}</p>
            <p className="mt-auto text-xs text-muted-foreground">{r.milestones.length} milestones</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
