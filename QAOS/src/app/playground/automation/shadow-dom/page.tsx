"use client";

import { useEffect, useRef } from "react";

function ShadowDomDemo() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || host.shadowRoot) return;

    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        .box { padding: 16px; border: 1px solid var(--border, #999); border-radius: 8px; }
        button { padding: 6px 12px; border-radius: 6px; border: 1px solid #999; cursor: pointer; }
      </style>
      <div class="box">
        <p>This button and its result text live inside a real shadow root.</p>
        <button id="shadow-btn" data-testid="shadow-button">Click me (in shadow DOM)</button>
        <p id="shadow-result" data-testid="shadow-result"></p>
      </div>
    `;

    const btn = shadow.getElementById("shadow-btn");
    const result = shadow.getElementById("shadow-result");
    btn?.addEventListener("click", () => {
      if (result) result.textContent = "Shadow button clicked!";
    });
  }, []);

  return <div ref={hostRef} data-testid="shadow-host" />;
}

export default function ShadowDomPage() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Standard <code className="rounded bg-muted px-1">document.querySelector</code> can&apos;t
        reach into a shadow root — your tool needs shadow-piercing selectors (e.g. Playwright
        pierces automatically; Selenium needs{" "}
        <code className="rounded bg-muted px-1">shadowRoot</code>).
      </p>
      <ShadowDomDemo />
    </div>
  );
}
