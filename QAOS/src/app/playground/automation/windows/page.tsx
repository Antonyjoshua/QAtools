"use client";

import { Button } from "@/components/ui/button";

export default function WindowsPage() {
  function openWindow(label: string) {
    window.open(
      `/playground/window-target?label=${encodeURIComponent(label)}`,
      "_blank",
      "width=480,height=360"
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Each control below opens a new browser window/tab. Practice enumerating window handles /
        pages and switching context to interact with the new one, then switch back here.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <a
              href="/playground/window-target?label=Tab%20A"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="open-tab-link"
            >
              Open New Tab (link)
            </a>
          }
        />
        <Button data-testid="open-window-a" onClick={() => openWindow("Window A")}>
          Open New Window A
        </Button>
        <Button data-testid="open-window-b" onClick={() => openWindow("Window B")}>
          Open New Window B
        </Button>
      </div>
    </div>
  );
}
