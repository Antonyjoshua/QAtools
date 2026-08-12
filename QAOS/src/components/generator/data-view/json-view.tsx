"use client";

import * as React from "react";

const PREVIEW_LIMIT = 100;

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightJson(json: string): string {
  const escaped = escapeHtml(json);
  return escaped.replace(
    /("(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false)\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "text-chart-4";
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "text-chart-1 font-medium" : "text-chart-2";
      } else if (/true|false/.test(match)) {
        cls = "text-chart-5";
      } else if (/null/.test(match)) {
        cls = "text-muted-foreground";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export function JsonView({ rows }: { rows: Record<string, unknown>[] }) {
  const preview = rows.slice(0, PREVIEW_LIMIT);
  const html = React.useMemo(() => highlightJson(JSON.stringify(preview, null, 2)), [preview]);

  return (
    <div className="flex flex-col gap-2">
      <pre className="max-h-[560px] overflow-auto rounded-lg border border-border bg-card p-4 font-mono text-[13px] leading-relaxed scrollbar-thin">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      {rows.length > PREVIEW_LIMIT && (
        <p className="text-xs text-muted-foreground">
          Showing first {PREVIEW_LIMIT} of {rows.length.toLocaleString("en-US")} records in preview — exports include the full dataset.
        </p>
      )}
    </div>
  );
}
