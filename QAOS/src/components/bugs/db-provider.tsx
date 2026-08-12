"use client";

import * as React from "react";
import { ensureSeeded } from "@/lib/bugs/seed";
import { ensureReportedIssuesSeeded } from "@/lib/bugs/reported-issues-seed";

export function DbProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    ensureSeeded()
      .then(() => ensureReportedIssuesSeeded())
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading BugForge…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
