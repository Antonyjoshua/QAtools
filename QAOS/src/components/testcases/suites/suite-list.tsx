"use client";

import type { MouseEvent } from "react";
import { Star, Layers, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleSuiteFavorite, deleteSuite } from "@/lib/testcases/repo/suites-repo";
import type { Suite } from "@/lib/testcases/types";

export function SuiteList({
  suites,
  selectedSuiteId,
  onSelect,
  caseCountBySuite,
  onDeleted,
}: {
  suites: Suite[];
  selectedSuiteId: string | null;
  onSelect: (suiteId: string) => void;
  caseCountBySuite: Map<string, number>;
  onDeleted?: (suiteId: string) => void;
}) {
  async function handleDelete(e: MouseEvent, suite: Suite) {
    e.stopPropagation();
    const count = caseCountBySuite.get(suite.id) ?? 0;
    const message =
      count > 0
        ? `Delete "${suite.name}" and its ${count} test case${count === 1 ? "" : "s"}? This cannot be undone.`
        : `Delete "${suite.name}"?`;
    if (!window.confirm(message)) return;
    await deleteSuite(suite.id);
    onDeleted?.(suite.id);
  }

  if (suites.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-10 text-center">
        <Layers className="size-6 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No suites in this folder yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {suites.map((suite) => (
        <div
          key={suite.id}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(suite.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(suite.id);
            }
          }}
          className={cn(
            "flex cursor-pointer flex-col gap-1.5 rounded-xl border p-3.5 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            selectedSuiteId === suite.id ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30 hover:bg-accent/40"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium">{suite.name}</p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  void toggleSuiteFavorite(suite.id);
                }}
                aria-label={suite.isFavorite ? "Remove favorite" : "Add favorite"}
              >
                <Star className={cn("size-3.5", suite.isFavorite ? "fill-yellow-400 text-yellow-500" : "text-muted-foreground/50")} />
              </button>
              <button
                type="button"
                onClick={(e) => handleDelete(e, suite)}
                aria-label={`Delete ${suite.name}`}
                className="text-muted-foreground/50 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
          {suite.description && <p className="line-clamp-2 text-xs text-muted-foreground">{suite.description}</p>}
          <p className="mt-auto text-[11px] text-muted-foreground">{caseCountBySuite.get(suite.id) ?? 0} test cases</p>
        </div>
      ))}
    </div>
  );
}
