"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { Briefcase, Globe2, MapPin, Search, SlidersHorizontal, Sparkles, TrendingUp } from "lucide-react";
import { db } from "@/lib/jobs/db";
import { applyFilters, saveJob, unsaveJob } from "@/lib/jobs/repo";
import { emptyFilterState, type JobFilterState, type SortOption } from "@/lib/jobs/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { FilterPanel } from "@/components/jobs/filter-panel";
import { JobCard } from "@/components/jobs/shared/job-card";
import type { Job, SavedJob } from "@/lib/jobs/types";

const EMPTY_JOBS: Job[] = [];
const EMPTY_SAVED_JOBS: SavedJob[] = [];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "relevance", label: "Relevance" },
  { value: "salary", label: "Salary" },
  { value: "experience", label: "Experience" },
  { value: "company", label: "Company" },
  { value: "remote-first", label: "Remote first" },
];

function StatTile({ label, value, icon: Icon }: { label: string; value: number | string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function JobsDashboardPage() {
  const searchParams = useSearchParams();
  const jobs = useLiveQuery(() => db.jobs.toArray(), []) ?? EMPTY_JOBS;
  const savedJobs = useLiveQuery(() => db.savedJobs.toArray(), []) ?? EMPTY_SAVED_JOBS;
  const savedJobIds = React.useMemo(() => new Set(savedJobs.map((s) => s.jobId)), [savedJobs]);

  const [filters, setFilters] = React.useState<JobFilterState>(() => {
    const state = emptyFilterState();
    const q = searchParams.get("q");
    if (q) state.query = q;
    return state;
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  const activeJobs = React.useMemo(() => jobs.filter((j) => j.status === "ACTIVE"), [jobs]);
  const filtered = React.useMemo(() => applyFilters(jobs, filters), [jobs, filters]);

  const availableCities = React.useMemo(() => Array.from(new Set(activeJobs.map((j) => j.city).filter((c): c is string => Boolean(c)))).sort(), [activeJobs]);
  const availableCompanies = React.useMemo(() => Array.from(new Set(activeJobs.map((j) => j.companyName))).sort(), [activeJobs]);
  const availableSources = React.useMemo(() => Array.from(new Set(activeJobs.map((j) => j.sourceName))).sort(), [activeJobs]);
  const availableTechnologies = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const j of activeJobs) for (const t of j.technologies) counts.set(t, (counts.get(t) ?? 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([t]) => t);
  }, [activeJobs]);

  const stats = React.useMemo(() => {
    const indiaJobs = activeJobs.filter((j) => j.isIndiaLocation).length;
    const remoteIndiaJobs = activeJobs.filter((j) => j.remoteStatus === "REMOTE_INDIA").length;
    // eslint-disable-next-line react-hooks/purity -- reading "now" to bucket "posted in the last 24h" is a benign use of wall-clock time, not something that needs render-to-render identity
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const newToday = activeJobs.filter((j) => new Date(j.postedDate).getTime() >= dayAgo).length;
    return { total: activeJobs.length, indiaJobs, remoteIndiaJobs, newToday };
  }, [activeJobs]);

  function handleFilterChange(patch: Partial<JobFilterState>) {
    setFilters((f) => ({ ...f, ...patch }));
  }
  function handleReset() {
    setFilters((f) => ({ ...emptyFilterState(), query: f.query, location: f.location, sort: f.sort }));
  }
  async function handleToggleSave(jobId: string) {
    if (savedJobIds.has(jobId)) await unsaveJob(jobId);
    else await saveJob(jobId);
  }

  const filterPanel = (
    <FilterPanel
      filters={filters}
      onChange={handleFilterChange}
      onReset={handleReset}
      availableCities={availableCities}
      availableCompanies={availableCompanies}
      availableSources={availableSources}
      availableTechnologies={availableTechnologies}
    />
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Briefcase className="size-6 text-primary" />
          Quangrade Jobs
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Find your next QA opportunity.</p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Active jobs" value={stats.total} icon={Briefcase} />
        <StatTile label="India jobs" value={stats.indiaJobs} icon={MapPin} />
        <StatTile label="Remote — India" value={stats.remoteIndiaJobs} icon={Globe2} />
        <StatTile label="New today" value={stats.newToday} icon={Sparkles} />
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(e) => handleFilterChange({ query: e.target.value })}
            placeholder="Search job title, skill, company…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {(
              [
                { id: "all", label: "All" },
                { id: "india", label: "India" },
                { id: "international", label: "International Remote" },
              ] as const
            ).map((opt) => (
              <Button
                key={opt.id}
                size="sm"
                variant={filters.location === opt.id ? "default" : "ghost"}
                onClick={() => handleFilterChange({ location: opt.id })}
              >
                {opt.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger render={<Button variant="outline" size="sm" className="gap-1.5 lg:hidden" />}>
                <SlidersHorizontal className="size-3.5" />
                Filters
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto p-4">
                <SheetHeader className="p-0 pb-2">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                {filterPanel}
              </SheetContent>
            </Sheet>

            <Select value={filters.sort} onValueChange={(v) => v !== null && handleFilterChange({ sort: v as SortOption })}>
              <SelectTrigger className="w-40">
                <SelectValue>{(v: SortOption) => SORT_OPTIONS.find((o) => o.value === v)?.label ?? v}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-xl border border-border bg-card p-4">{filterPanel}</div>
        </aside>

        <div>
          <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filtered.length} job{filtered.length === 1 ? "" : "s"} found
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
              <TrendingUp className="size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No jobs match your filters yet — try widening your search or clearing a filter.</p>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3")}>
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} isSaved={savedJobIds.has(job.id)} onToggleSave={() => handleToggleSave(job.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
