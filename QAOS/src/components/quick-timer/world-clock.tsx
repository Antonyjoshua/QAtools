"use client";

import { Globe2 } from "lucide-react";

export function WorldClock() {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <Globe2 className="size-6 text-muted-foreground/40" />
      <p className="text-sm font-medium">World Clock</p>
      <p className="max-w-56 text-xs text-muted-foreground">Coming soon — track time across your team&apos;s time zones right from here.</p>
    </div>
  );
}
