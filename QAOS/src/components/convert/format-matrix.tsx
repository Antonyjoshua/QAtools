"use client";

import * as React from "react";
import { Check, X, Lock } from "lucide-react";
import { FORMATS, CATEGORY_LABELS } from "@/lib/convert/core/format-registry";
import { getConversionAvailability } from "@/lib/convert/core/engine";
import { cn } from "@/lib/utils";

export function FormatMatrix() {
  const [selected, setSelected] = React.useState(FORMATS[0].id);
  const selectedFormat = FORMATS.find((f) => f.id === selected) ?? FORMATS[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setSelected(f.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium uppercase",
              selected === f.id ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent/50"
            )}
          >
            {f.id}
          </button>
        ))}
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          {selectedFormat.label} ({CATEGORY_LABELS[selectedFormat.category]}) can convert to:
        </p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4">
          {FORMATS.filter((f) => f.id !== selected).map((target) => {
            const { supported, requiresBackend } = getConversionAvailability(selected, target.id);
            return (
              <div
                key={target.id}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-xs",
                  supported ? "border-success/30 bg-success/5" : requiresBackend ? "border-border bg-muted/20" : "border-border/50 opacity-50"
                )}
              >
                <span className="font-medium uppercase">{target.id}</span>
                {supported && <Check className="size-3.5 text-success" />}
                {!supported && requiresBackend && <Lock className="size-3.5 text-muted-foreground" />}
                {!supported && !requiresBackend && <X className="size-3.5 text-muted-foreground/50" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
