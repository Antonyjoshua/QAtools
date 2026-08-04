"use client";

const PREVIEW_LIMIT = 200;

export function CodeView({ lines, language }: { lines: string[]; language?: string }) {
  const preview = lines.slice(0, PREVIEW_LIMIT);
  return (
    <div className="flex flex-col gap-2">
      <div className="max-h-[560px] overflow-auto rounded-lg border border-border bg-card scrollbar-thin">
        {language && (
          <div className="sticky top-0 border-b border-border bg-card px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {language}
          </div>
        )}
        <pre className="p-4 font-mono text-[13px] leading-relaxed">
          <code>{preview.join("\n\n")}</code>
        </pre>
      </div>
      {lines.length > PREVIEW_LIMIT && (
        <p className="text-xs text-muted-foreground">
          Showing first {PREVIEW_LIMIT} of {lines.length.toLocaleString("en-US")} entries in preview — exports include the full dataset.
        </p>
      )}
    </div>
  );
}
