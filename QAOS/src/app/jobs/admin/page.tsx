"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { AlertTriangle, CheckCircle2, Clock, Copy, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { db } from "@/lib/jobs/db";
import { reviewQueueAction, setSourceEnabled, triggerSync } from "@/lib/jobs/repo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { formatRelativeTime } from "@/lib/jobs/format";
import type { Job, JobSourceConfig } from "@/lib/jobs/types";

const EMPTY_SOURCES: JobSourceConfig[] = [];
const EMPTY_JOBS: Job[] = [];

function StatTile({ label, value, icon: Icon, tone }: { label: string; value: number | string; icon: React.ElementType; tone?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className={`flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground ${tone ?? ""}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function JobsAdminPage() {
  const sources = useLiveQuery(() => db.sources.toArray(), []) ?? EMPTY_SOURCES;
  const jobs = useLiveQuery(() => db.jobs.toArray(), []) ?? EMPTY_JOBS;
  const syncRuns = useLiveQuery(() => db.syncRuns.orderBy("startedAt").reverse().limit(20).toArray(), []) ?? [];
  const reviewQueue = useLiveQuery(() => db.reviewQueue.where("status").equals("pending").toArray(), []) ?? [];
  const jobById = React.useMemo(() => new Map(jobs.map((j) => [j.id, j])), [jobs]);
  const sourceById = React.useMemo(() => new Map(sources.map((s) => [s.id, s])), [sources]);

  const [syncingId, setSyncingId] = React.useState<string | null>(null);

  async function handleSync(sourceId: string) {
    setSyncingId(sourceId);
    try {
      await triggerSync(sourceId);
    } finally {
      setSyncingId(null);
    }
  }

  const expiredCount = jobs.filter((j) => j.status === "EXPIRED").length;
  const totalImported = sources.reduce((sum, s) => sum + s.jobsImported, 0);
  const totalFailed = sources.reduce((sum, s) => sum + s.failedJobs, 0);
  const totalDuplicates = sources.reduce((sum, s) => sum + s.duplicatesFound, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <ShieldCheck className="size-6 text-primary" /> Jobs Admin
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage ingestion sources, review flagged listings, and monitor sync health.</p>
      </div>

      <div className="mb-3 flex items-start gap-2 rounded-xl border border-dashed border-warning/40 bg-warning/5 p-3 text-xs text-muted-foreground">
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" />
        <span>
          No source is connected to a live API yet — every job below is sample data. Clicking <strong className="text-foreground">Sync now</strong>{" "}
          genuinely calls the source adapter and will honestly fail until real API access is configured; that failure is what populates the sync log
          and error state below, demonstrating the real error-handling path.
        </span>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Jobs imported" value={totalImported} icon={CheckCircle2} />
        <StatTile label="Failed jobs" value={totalFailed} icon={XCircle} />
        <StatTile label="Duplicates found" value={totalDuplicates} icon={Copy} />
        <StatTile label="Expired jobs" value={expiredCount} icon={Clock} />
      </div>

      <Tabs defaultValue="sources">
        <TabsList>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="sync-log">Sync Log</TabsTrigger>
          <TabsTrigger value="review">Review Queue {reviewQueue.length > 0 ? `(${reviewQueue.length})` : ""}</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="mt-4">
          <div className="flex flex-col gap-2">
            {sources.map((s) => (
              <div key={s.id} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{s.name}</p>
                    <Badge variant="outline" className="text-[10px]">
                      {s.type}
                    </Badge>
                    <Badge variant="secondary" className="bg-warning/15 text-warning text-[10px] ring-1 ring-warning/30">
                      Not connected — sample data
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={s.enabled} onCheckedChange={(v) => setSourceEnabled(s.id, Boolean(v))} />
                    <Button variant="outline" size="sm" className="gap-1.5" disabled={syncingId === s.id} onClick={() => handleSync(s.id)}>
                      <RefreshCw className={`size-3.5 ${syncingId === s.id ? "animate-spin" : ""}`} />
                      Sync now
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-5">
                  <span>Priority: {s.priority}</span>
                  <span>Refresh: every {s.refreshIntervalMinutes}m</span>
                  <span>Imported: {s.jobsImported}</span>
                  <span>Last sync: {s.lastSyncAt ? formatRelativeTime(s.lastSyncAt) : "never"}</span>
                  <span>
                    Status:{" "}
                    <span className={s.lastSyncStatus === "error" ? "text-destructive" : s.lastSyncStatus === "success" ? "text-success" : ""}>
                      {s.lastSyncStatus}
                    </span>
                  </span>
                </div>
                {s.errors.length > 0 && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
                    Latest error: {s.errors[0].message}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sync-log" className="mt-4">
          <div className="flex flex-col gap-2">
            {syncRuns.length === 0 && <p className="text-sm text-muted-foreground">No sync runs yet.</p>}
            {syncRuns.map((run) => (
              <div key={run.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-xs">
                <div className="flex items-center gap-2">
                  {run.status === "success" ? (
                    <CheckCircle2 className="size-3.5 text-success" />
                  ) : run.status === "error" ? (
                    <XCircle className="size-3.5 text-destructive" />
                  ) : (
                    <RefreshCw className="size-3.5 animate-spin text-muted-foreground" />
                  )}
                  <span className="font-medium">{sourceById.get(run.sourceId)?.name ?? "Unknown source"}</span>
                  <span className="text-muted-foreground">{formatRelativeTime(run.startedAt)}</span>
                </div>
                <div className="text-muted-foreground">
                  {run.status === "error" ? run.errorMessage : `${run.jobsNew} new · ${run.jobsUpdated} updated · ${run.jobsDuplicate} duplicate · ${run.jobsFailed} failed`}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="review" className="mt-4">
          <div className="flex flex-col gap-2">
            {reviewQueue.length === 0 && <p className="text-sm text-muted-foreground">Nothing needs review right now.</p>}
            {reviewQueue.map((item) => {
              const job = jobById.get(item.jobId);
              if (!job) return null;
              return (
                <div key={item.id} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{job.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.companyName} · {job.country}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => reviewQueueAction(item.id, "approved")}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => reviewQueueAction(item.id, "rejected")}>
                        Reject
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.reasons.map((r) => (
                      <Badge key={r} variant="secondary" className="bg-warning/15 text-warning text-[10px] ring-1 ring-warning/30">
                        {r.replaceAll("_", " ")}
                      </Badge>
                    ))}
                  </div>
                  {job.remoteEvidence && <p className="text-xs text-muted-foreground">Remote evidence text: &ldquo;{job.remoteEvidence}&rdquo;</p>}
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
