"use client";

import * as React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TestCaseFilters } from "@/lib/testcases/types";
import type { FacetOptions } from "@/lib/testcases/hooks/use-filters";

const GROUPS: { key: keyof FacetOptions; label: string }[] = [
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "severity", label: "Severity" },
  { key: "type", label: "Type" },
  { key: "module", label: "Module" },
  { key: "feature", label: "Feature" },
  { key: "sprint", label: "Sprint" },
  { key: "author", label: "Author" },
  { key: "reviewer", label: "Reviewer" },
  { key: "automationStatus", label: "Automation Status" },
  { key: "browser", label: "Browser" },
  { key: "os", label: "OS" },
  { key: "tags", label: "Tags" },
];

export function FiltersPanel({
  facets,
  filters,
  onToggle,
  onClear,
  activeCount,
}: {
  facets: FacetOptions;
  filters: TestCaseFilters;
  onToggle: (key: keyof TestCaseFilters, value: string) => void;
  onClear: () => void;
  activeCount: number;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="size-3.5" />
            Filters
            {activeCount > 0 && (
              <span className="ml-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent align="start" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Filters</p>
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" className="h-6 gap-1 px-1.5 text-xs" onClick={onClear}>
              <X className="size-3" />
              Clear
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-96">
          <div className="divide-y divide-border">
            {GROUPS.filter((g) => facets[g.key].length > 0).map((g) => (
              <div key={g.key} className="p-3">
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">{g.label}</p>
                <div className="flex flex-col gap-1.5">
                  {facets[g.key].map((value) => {
                    const checked = (filters[g.key] as string[]).includes(value);
                    return (
                      <label key={value} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={checked} onCheckedChange={() => onToggle(g.key, value)} />
                        <span className="truncate">{value}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
