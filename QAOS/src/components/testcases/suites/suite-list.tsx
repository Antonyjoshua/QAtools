"use client";

import { Star, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleSuiteFavorite } from "@/lib/testcases/repo/suites-repo";
import type { Suite } from "@/lib/testcases/types";

export function SuiteList({
  suites,
  selectedSuiteId,
  onSelect,
  caseCountBySuite,
}: {
  suites: Suite[];
  selectedSuiteId: string | null;
  onSelect: (suiteId: string) => void;
  caseCountBySuite: Map<string, number>;
}) {
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
          </div>
          {suite.description && <p className="line-clamp-2 text-xs text-muted-foreground">{suite.description}</p>}
          <p className="mt-auto text-[11px] text-muted-foreground">{caseCountBySuite.get(suite.id) ?? 0} test cases</p>
        </div>
      ))}
    </div>
  );
}
