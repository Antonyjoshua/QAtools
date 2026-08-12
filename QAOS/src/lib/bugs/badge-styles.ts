import type { Severity, Priority, BugStatus } from "./types";

export const SEVERITY_STYLES: Record<Severity, string> = {
  Critical: "bg-destructive/15 text-destructive border-destructive/30",
  High: "bg-primary/15 text-primary border-primary/30",
  Major: "bg-warning/15 text-warning border-warning/30",
  Medium: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  Minor: "bg-muted text-muted-foreground border-border",
  Cosmetic: "bg-muted text-muted-foreground border-border",
};

export const PRIORITY_STYLES: Record<Priority, string> = {
  P0: "bg-destructive/15 text-destructive border-destructive/30",
  P1: "bg-primary/15 text-primary border-primary/30",
  P2: "bg-warning/15 text-warning border-warning/30",
  P3: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  P4: "bg-muted text-muted-foreground border-border",
};

export const STATUS_STYLES: Record<BugStatus, string> = {
  Draft: "bg-muted text-muted-foreground border-border",
  Open: "bg-primary/15 text-primary border-primary/30",
  Assigned: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  "In Progress": "bg-warning/15 text-warning border-warning/30",
  Fixed: "bg-success/15 text-success border-success/30",
  Retest: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  Reopened: "bg-destructive/15 text-destructive border-destructive/30",
  Closed: "bg-success/15 text-success border-success/30",
  Rejected: "bg-muted text-muted-foreground border-border",
  Duplicate: "bg-muted text-muted-foreground border-border",
  Deferred: "bg-chart-5/15 text-chart-5 border-chart-5/30",
};
