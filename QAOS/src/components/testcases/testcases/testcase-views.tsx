"use client";

import * as React from "react";
import { Table2, KanbanSquare, ListChecks, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { TestCase, TestCaseView } from "@/lib/testcases/types";
import { useTestCaseFilters, applyTestCaseFilters, deriveFacets } from "@/lib/testcases/hooks/use-filters";
import { useTestManagementShortcuts } from "@/lib/testcases/hooks/use-shortcuts";
import { FiltersPanel } from "@/components/testcases/shared/filters-panel";
import { TestCaseTable } from "./testcase-table";
import { TestCaseKanban } from "./testcase-kanban";
import { TestCaseChecklist } from "./testcase-checklist";
import { ExportMenu } from "./export-menu";
import { ImportDialog } from "./import-dialog";

const VIEW_TABS: { id: TestCaseView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "table", label: "Table", icon: Table2 },
  { id: "kanban", label: "Kanban", icon: KanbanSquare },
  { id: "checklist", label: "Checklist", icon: ListChecks },
];

export function TestCaseViews({ testCases, projectId, suiteId }: { testCases: TestCase[]; projectId: string; suiteId: string }) {
  const [view, setView] = React.useState<TestCaseView>("table");
  const { filters, setSearch, toggle, clear, activeCount } = useTestCaseFilters();
  const facets = React.useMemo(() => deriveFacets(testCases), [testCases]);
  const filtered = React.useMemo(() => applyTestCaseFilters(testCases, filters), [testCases, filters]);
  const searchRef = React.useRef<HTMLInputElement>(null);

  useTestManagementShortcuts({ onSearch: () => searchRef.current?.focus() });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-foreground/[0.02] p-0.5">
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setView(tab.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                view === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="size-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex flex-1 items-center gap-2 sm:justify-end">
          <div className="relative w-full max-w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search test cases…"
              className="h-8 pl-8 text-sm"
            />
          </div>
          <FiltersPanel facets={facets} filters={filters} onToggle={toggle} onClear={clear} activeCount={activeCount} />
          <ImportDialog projectId={projectId} suiteId={suiteId} />
          <ExportMenu testCases={filtered} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} of {testCases.length} test case{testCases.length === 1 ? "" : "s"}
      </p>

      {view === "table" && <TestCaseTable testCases={filtered} />}
      {view === "kanban" && <TestCaseKanban testCases={filtered} />}
      {view === "checklist" && <TestCaseChecklist testCases={filtered} suiteId={suiteId} />}
    </div>
  );
}
