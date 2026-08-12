"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CategoryIcon } from "@/components/icon";
import { COMMON_QA_PATTERNS, type CommonPattern } from "@/lib/generator/tools/regex-reference-data";
import { cn } from "@/lib/utils";

export function RegexCommonPatternsPanel({
  currentPattern,
  isDirty,
  onLoad,
}: {
  currentPattern: string;
  isDirty: boolean;
  onLoad: (pattern: CommonPattern) => void;
}) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [pendingPattern, setPendingPattern] = React.useState<CommonPattern | null>(null);

  function requestLoad(p: CommonPattern) {
    if (isDirty && currentPattern !== p.pattern) {
      setPendingPattern(p);
    } else {
      onLoad(p);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs text-muted-foreground">Common QA Regex Patterns</Label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {COMMON_QA_PATTERNS.map((p) => {
          const expanded = expandedId === p.id;
          return (
            <div key={p.id} className="rounded-lg border border-border bg-card p-3">
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : p.id)}
                className="flex w-full items-center justify-between gap-2 text-left"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <CategoryIcon name={p.icon} className="size-4 text-muted-foreground" />
                  {p.name}
                </span>
                {expanded ? <ChevronUp className="size-3.5 shrink-0 text-muted-foreground" /> : <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />}
              </button>
              <p className={cn("mt-1 text-xs text-muted-foreground", !expanded && "line-clamp-2")}>{p.explanation}</p>
              {expanded && (
                <div className="mt-2 flex flex-col gap-2 border-t border-border pt-2">
                  <code className="block overflow-x-auto rounded bg-muted px-1.5 py-1 font-mono text-[11px]">{p.pattern}</code>
                  <div className="flex flex-wrap gap-1">
                    {p.positiveSamples.map((s) => (
                      <Badge key={s} variant="secondary" className="bg-status-good/15 font-mono text-[10px] text-status-good ring-1 ring-status-good/30">
                        {s}
                      </Badge>
                    ))}
                    {p.negativeSamples.map((s) => (
                      <Badge key={s} variant="secondary" className="bg-status-critical/15 font-mono text-[10px] text-status-critical ring-1 ring-status-critical/30">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => requestLoad(p)}>
                    Load Pattern
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AlertDialog open={pendingPattern !== null} onOpenChange={(open) => !open && setPendingPattern(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace current pattern?</AlertDialogTitle>
            <AlertDialogDescription>
              Loading &ldquo;{pendingPattern?.name}&rdquo; will overwrite the pattern you&rsquo;re currently editing. This can&rsquo;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingPattern) onLoad(pendingPattern);
                setPendingPattern(null);
              }}
            >
              Load Pattern
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
