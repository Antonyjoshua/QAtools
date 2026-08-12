"use client";

import * as React from "react";
import { ensureSeeded } from "@/lib/testcases/repo/seed";

export function DbProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    ensureSeeded().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading Test Management…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
