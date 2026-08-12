"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { PdfConversionOptions, PdfOperation } from "@/lib/convert/adapters/pdf-adapter";

const OPERATIONS: { value: PdfOperation; label: string }[] = [
  { value: "compress", label: "Compress" },
  { value: "merge", label: "Merge" },
  { value: "split", label: "Split" },
  { value: "rotate", label: "Rotate" },
  { value: "reorder", label: "Extract / Rearrange" },
];

export function PdfOperationOptionsForm({
  options,
  onChange,
  fileCount,
}: {
  options: Record<string, unknown>;
  onChange: (o: Record<string, unknown>) => void;
  fileCount: number;
}) {
  const opts = options as PdfConversionOptions;
  const operation = opts.operation ?? (fileCount > 1 ? "merge" : "compress");

  function set(patch: Partial<PdfConversionOptions>) {
    onChange({ ...opts, ...patch });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label className="mb-1.5 block text-xs text-muted-foreground">Operation</Label>
        <div className="flex flex-wrap gap-1.5">
          {OPERATIONS.filter((o) => o.value !== "merge" || fileCount > 1).map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => set({ operation: o.value })}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium",
                operation === o.value ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent/50"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {operation === "split" && (
        <div>
          <Label className="text-xs text-muted-foreground">Page ranges (optional)</Label>
          <Input
            placeholder="e.g. 1-3,4,5-6 — leave blank to split every page"
            value={opts.pageRanges ?? ""}
            onChange={(e) => set({ pageRanges: e.target.value })}
            className="mt-1.5 h-8"
          />
        </div>
      )}

      {operation === "rotate" && (
        <>
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">Rotate by</Label>
            <div className="flex gap-1.5">
              {([90, 180, 270] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => set({ rotateDegrees: d })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium",
                    (opts.rotateDegrees ?? 90) === d ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent/50"
                  )}
                >
                  {d}°
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Pages (optional)</Label>
            <Input
              placeholder="All pages — or e.g. 1,3,5"
              onChange={(e) =>
                set({ rotatePages: e.target.value ? e.target.value.split(",").map((s) => Number(s.trim())).filter(Boolean) : "all" })
              }
              className="mt-1.5 h-8"
            />
          </div>
        </>
      )}

      {operation === "reorder" && (
        <div>
          <Label className="text-xs text-muted-foreground">Page order</Label>
          <Input
            placeholder="e.g. 3,1,2 — pages to keep, in the order you want"
            onChange={(e) => set({ pageOrder: e.target.value.split(",").map((s) => Number(s.trim())).filter(Boolean) })}
            className="mt-1.5 h-8"
          />
        </div>
      )}

      {operation === "compress" && (
        <p className="text-xs text-muted-foreground">Re-saves the PDF with a more compact internal structure — works best on PDFs with many form fields or annotations.</p>
      )}
      {operation === "merge" && <p className="text-xs text-muted-foreground">All {fileCount} files will be combined into one PDF, in the order they were added.</p>}
    </div>
  );
}
