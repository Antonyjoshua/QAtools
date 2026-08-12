"use client";

import { useHydrated } from "@/lib/solo/hooks/useHydrated";

export function HydrationGate({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)] animate-spin" />
          <p className="text-sm text-muted-foreground">Loading Hunter data…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
