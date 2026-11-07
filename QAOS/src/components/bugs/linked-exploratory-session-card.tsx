"use client";

import Link from "next/link";
import { Radar } from "lucide-react";

export function LinkedExploratorySessionCard({
  sessionId,
  charterTitle,
}: {
  sessionId: string | null;
  charterTitle: string | null;
}) {
  if (!sessionId) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
      <p className="mb-2 flex items-center gap-1.5 font-medium text-foreground">
        <Radar className="size-3.5" />
        Filed from exploratory session
      </p>
      <Link href={`/exploratory/session/${sessionId}`} className="flex flex-col items-start gap-1 hover:text-foreground">
        <span className="text-foreground">{charterTitle ?? "Unknown charter"}</span>
        <span>View session</span>
      </Link>
    </div>
  );
}
