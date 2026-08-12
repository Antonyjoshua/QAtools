"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { SpreadsheetConversionOptions } from "@/lib/convert/adapters/spreadsheet-adapter";

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium",
        active ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent/50"
      )}
    >
      {children}
    </button>
  );
}

export function SpreadsheetPdfOptionsForm({ options, onChange }: { options: Record<string, unknown>; onChange: (o: Record<string, unknown>) => void }) {
  const opts = options as SpreadsheetConversionOptions;
  function set(patch: Partial<SpreadsheetConversionOptions>) {
    onChange({ ...opts, ...patch });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label className="mb-1.5 block text-xs text-muted-foreground">Orientation</Label>
        <div className="flex gap-1.5">
          <Pill active={(opts.orientation ?? "landscape") === "portrait"} onClick={() => set({ orientation: "portrait" })}>
            Portrait
          </Pill>
          <Pill active={(opts.orientation ?? "landscape") === "landscape"} onClick={() => set({ orientation: "landscape" })}>
            Landscape
          </Pill>
        </div>
      </div>
      <div>
        <Label className="mb-1.5 block text-xs text-muted-foreground">Paper size</Label>
        <div className="flex gap-1.5">
          <Pill active={(opts.paperSize ?? "a4") === "a4"} onClick={() => set({ paperSize: "a4" })}>
            A4
          </Pill>
          <Pill active={(opts.paperSize ?? "a4") === "letter"} onClick={() => set({ paperSize: "letter" })}>
            Letter
          </Pill>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Fit to page</Label>
        <Switch checked={opts.fitToPage ?? false} onCheckedChange={(v) => set({ fitToPage: Boolean(v) })} />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Repeat headers on every page</Label>
        <Switch checked={opts.repeatHeaders ?? true} onCheckedChange={(v) => set({ repeatHeaders: Boolean(v) })} />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Include gridlines</Label>
        <Switch checked={opts.includeGridlines ?? true} onCheckedChange={(v) => set({ includeGridlines: Boolean(v) })} />
      </div>
    </div>
  );
}
