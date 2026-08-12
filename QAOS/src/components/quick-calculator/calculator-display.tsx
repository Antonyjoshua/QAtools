"use client";

import * as React from "react";
import { Delete, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { UseCalculatorReturn } from "@/lib/quick-calculator/use-calculator";

export function CalculatorDisplay({ calc }: { calc: UseCalculatorReturn }) {
  const { displayExpression, displayResult, hasError, state, actions } = calc;

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(displayResult);
      toast.success("Copied result", { description: displayResult });
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  }

  const resultLength = displayResult.length;
  const resultSizeClass =
    resultLength > 16 ? "text-2xl" : resultLength > 11 ? "text-3xl" : resultLength > 8 ? "text-4xl" : "text-5xl";

  return (
    <div className="relative flex flex-col justify-end gap-1 rounded-2xl border border-border/60 bg-foreground/[0.03] px-4 pb-4 pt-3 min-h-[112px]">
      <div className="flex items-start justify-between gap-2">
        <p className="min-h-[20px] flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-right font-mono text-sm text-muted-foreground">
          {displayExpression || " "}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 shrink-0 text-muted-foreground"
          onClick={actions.backspace}
          aria-label="Backspace"
        >
          <Delete className="size-3.5" />
        </Button>
      </div>

      <div className="flex items-center justify-end gap-2">
        {!hasError && state.expression && (
          <button
            type="button"
            onClick={copyResult}
            className="rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
            aria-label="Copy result"
          >
            <Copy className="size-3.5" />
          </button>
        )}
        <p
          className={cn(
            "truncate text-right font-mono font-semibold tabular-nums transition-all",
            resultSizeClass,
            hasError ? "text-destructive" : "text-foreground"
          )}
        >
          {displayResult}
        </p>
      </div>
    </div>
  );
}
