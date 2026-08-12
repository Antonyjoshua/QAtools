"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { TextDataConversionOptions } from "@/lib/convert/adapters/text-data-adapter";

export function JsonModeOptionsForm({ options, onChange }: { options: Record<string, unknown>; onChange: (o: Record<string, unknown>) => void }) {
  const opts = options as TextDataConversionOptions;
  return (
    <div>
      <Label className="mb-1.5 block text-xs text-muted-foreground">Mode</Label>
      <div className="flex gap-1.5">
        {(["format", "minify"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onChange({ ...opts, mode: m })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium capitalize",
              (opts.mode ?? "format") === m ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent/50"
            )}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
