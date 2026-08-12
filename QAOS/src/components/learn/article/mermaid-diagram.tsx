"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function MermaidDiagram({ title, code }: { title: string; code: string }) {
  const { resolvedTheme } = useTheme();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const reactId = React.useId();
  const idRef = React.useRef(`mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme: resolvedTheme === "dark" ? "dark" : "default", securityLevel: "strict" });
        const { svg } = await mermaid.render(idRef.current, code);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to render diagram");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, resolvedTheme]);

  return (
    <figure className="my-3 overflow-hidden rounded-lg border border-border">
      <figcaption className="border-b border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">{title}</figcaption>
      <div className="flex justify-center overflow-x-auto bg-background p-4">
        {error ? <p className="text-xs text-destructive">Diagram failed to render: {error}</p> : <div ref={containerRef} />}
      </div>
    </figure>
  );
}
