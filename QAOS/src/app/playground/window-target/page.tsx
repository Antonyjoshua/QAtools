"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

function WindowTargetContent() {
  const params = useSearchParams();
  const label = params.get("label") ?? "New Window";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center">
      <h1 data-testid="target-heading" className="text-2xl font-bold">
        {label}
      </h1>
      <p className="text-sm text-muted-foreground">
        This is a separate window/tab. Switch back to the original page, or close this one.
      </p>
      <Button data-testid="close-window" onClick={() => window.close()}>
        Close This Window
      </Button>
    </div>
  );
}

export default function WindowTargetPage() {
  return (
    <Suspense fallback={null}>
      <WindowTargetContent />
    </Suspense>
  );
}
