"use client";

import * as React from "react";
import { Delete, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { UseCalculatorReturn } from "@/lib/quick-calculator/use-calculator";

export function CalculatorDisplay({ calc }: { calc: UseCalculatorReturn }) {
  const { displayExpression, displayResult, hasError, state, actions } = calc;
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // The small expression line is the only real <input>, but visually the big bold result
  // below it reads as "the entered value" — it's what a user naturally clicks or tries to
  // paste into. Route a click anywhere on the display card (except the backspace/copy
  // buttons, which have their own job) to that input, so typing/pasting works no matter
  // which part of the display you actually click.
  function focusExpressionUnlessButton(e: React.MouseEvent) {
    if (e.target instanceof Element && e.target.closest("button")) return;
    inputRef.current?.focus();
  }

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
    <div
      className="relative flex flex-col justify-end gap-1 rounded-2xl border border-border/60 bg-foreground/[0.03] px-4 pb-4 pt-3 min-h-[112px]"
      onClick={focusExpressionUnlessButton}
    >
      <div className="flex items-start justify-between gap-2">
        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          aria-label="Expression"
          // Raw (comma-free) while actively editing so inserted thousands separators can't
          // shift the string length under the cursor; the nicer grouped format only applies
          // once focus leaves, matching how the keypad-driven display always looked before.
          value={focused ? state.expression : displayExpression}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => actions.setExpression(e.target.value.replace(/,/g, ""))}
          placeholder="0"
          className="min-h-[20px] w-full flex-1 bg-transparent text-right font-mono text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/60"
        />
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
