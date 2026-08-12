"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { BellRing, Mail, Monitor, Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/jobs/db";
import { createAlert, deleteAlert, matchAlertJobs, setAlertActive } from "@/lib/jobs/repo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AlertFrequency } from "@/lib/jobs/types";

export default function JobAlertsPage() {
  const alerts = useLiveQuery(() => db.alerts.orderBy("createdAt").reverse().toArray(), []) ?? [];
  const jobs = useLiveQuery(() => db.jobs.toArray(), []) ?? [];

  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [location, setLocation] = React.useState<"india" | "international" | "all">("all");
  const [frequency, setFrequency] = React.useState<AlertFrequency>("Daily");
  const [emailEnabled, setEmailEnabled] = React.useState(false);

  async function handleCreate() {
    if (!name.trim() || !query.trim()) return;
    await createAlert({
      name: name.trim(),
      query: query.trim(),
      filters: { location },
      frequency,
      channels: emailEnabled ? ["in-app", "email"] : ["in-app"],
    });
    setOpen(false);
    setName("");
    setQuery("");
    setLocation("all");
    setFrequency("Daily");
    setEmailEnabled(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Job Alerts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Get notified when new jobs match a saved search.</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> New Alert
        </Button>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <BellRing className="size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No alerts yet — create one like &ldquo;Playwright + Remote India&rdquo; to get notified.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {alerts.map((alert) => {
            const matchCount = matchAlertJobs(alert, jobs).length;
            return (
              <div key={alert.id} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{alert.name}</p>
                  <p className="text-xs text-muted-foreground">
                    &ldquo;{alert.query}&rdquo; · {alert.frequency} ·{" "}
                    {alert.filters.location === "india" ? "India" : alert.filters.location === "international" ? "International Remote" : "All locations"}
                  </p>
                  <p className="mt-1 text-xs font-medium text-primary">{matchCount} matching job{matchCount === 1 ? "" : "s"} right now</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Monitor className="size-3" /> In-app
                    {alert.channels.includes("email") && (
                      <>
                        <span>·</span>
                        <Mail className="size-3" /> Email
                      </>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Switch checked={alert.active} onCheckedChange={(v) => setAlertActive(alert.id, Boolean(v))} />
                  <Button variant="ghost" size="icon-sm" title="Delete alert" onClick={() => deleteAlert(alert.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New job alert</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Alert name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Playwright + Remote India" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Search query</Label>
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Playwright remote India" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Location</Label>
                <Select value={location} onValueChange={(v) => v !== null && setLocation(v as typeof location)}>
                  <SelectTrigger>
                    <SelectValue>
                      {(v: string) => ({ all: "All", india: "India", international: "International Remote" })[v] ?? v}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="international">International Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Frequency</Label>
                <Select value={frequency} onValueChange={(v) => v !== null && setFrequency(v as AlertFrequency)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instant">Instant</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 rounded-lg border border-border p-3">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked disabled />
                In-app notifications
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox checked={emailEnabled} onCheckedChange={(v) => setEmailEnabled(Boolean(v))} disabled />
                Email notifications <span className="text-xs">(coming soon — no email service connected yet)</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!name.trim() || !query.trim()}>
              Create alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
