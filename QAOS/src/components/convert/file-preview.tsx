"use client";

import * as React from "react";
import { EyeOff } from "lucide-react";

const PREVIEWABLE_TEXT_FORMATS = new Set(["txt", "json", "xml", "yaml", "html", "md", "csv"]);
const PREVIEWABLE_IMAGE_FORMATS = new Set(["jpg", "png", "webp", "gif", "bmp", "svg", "ico"]);

function CsvTablePreview({ text }: { text: string }) {
  const rows = React.useMemo(() => text.split(/\r?\n/).filter((r) => r.length > 0).slice(0, 50).map((r) => r.split(",")), [text]);
  if (rows.length === 0) return <p className="p-4 text-sm text-muted-foreground">Empty file.</p>;
  const [header, ...body] = rows;
  return (
    <div className="overflow-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-muted/40">
            {header.map((h, i) => (
              <th key={i} className="border-b border-border px-2 py-1.5 text-left font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-muted/20" : undefined}>
              {row.map((cell, j) => (
                <td key={j} className="border-b border-border/60 px-2 py-1.5 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FilePreview({ blob, format }: { blob: Blob; format: string }) {
  const [text, setText] = React.useState<string | null>(null);
  const [objectUrl, setObjectUrl] = React.useState<string | null>(null);

  // Object URLs are created and revoked within the same effect run (not via a separate useMemo)
  // so React's dev-mode double-invoke can't revoke a URL a different mount is still rendering —
  // that mismatch previously left <img>/<iframe> pointing at an already-revoked blob URL.
  React.useEffect(() => {
    const url = URL.createObjectURL(blob);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must set in the same effect that creates the URL, or dev-mode double-invoke can revoke a URL a different mount is still rendering
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  React.useEffect(() => {
    if (PREVIEWABLE_TEXT_FORMATS.has(format)) {
      void blob.text().then(setText);
    }
  }, [blob, format]);

  if (!objectUrl) return null;

  if (format === "pdf") {
    return <iframe src={objectUrl} title="PDF preview" className="h-full min-h-96 w-full rounded-lg border border-border" />;
  }

  if (PREVIEWABLE_IMAGE_FORMATS.has(format)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={objectUrl} alt="Converted result preview" className="mx-auto max-h-96 max-w-full rounded-lg border border-border object-contain" />;
  }

  if (format === "csv") {
    if (text === null) return null;
    return (
      <div className="rounded-lg border border-border">
        <CsvTablePreview text={text} />
      </div>
    );
  }

  if (format === "json") {
    if (text === null) return null;
    let pretty = text;
    try {
      pretty = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      // leave as-is
    }
    return <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-muted/20 p-3 text-xs">{pretty}</pre>;
  }

  if (PREVIEWABLE_TEXT_FORMATS.has(format)) {
    if (text === null) return null;
    return <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-muted/20 p-3 text-xs whitespace-pre-wrap">{text}</pre>;
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
      <EyeOff className="size-6" />
      <p className="text-sm">Preview unavailable for this file type — you can still download it.</p>
    </div>
  );
}
