import type { Priority, Severity, TestCaseStatus, AutomationStatus, ExecutionResultStatus, RunStatus } from "./types";

export const PRIORITY_STYLES: Record<Priority, string> = {
  Critical: "bg-destructive/15 text-destructive border-destructive/30",
  High: "bg-primary/15 text-primary border-primary/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  Low: "bg-muted text-muted-foreground border-border",
};

export const SEVERITY_STYLES: Record<Severity, string> = {
  Blocker: "bg-destructive/15 text-destructive border-destructive/30",
  Critical: "bg-destructive/15 text-destructive border-destructive/30",
  Major: "bg-warning/15 text-warning border-warning/30",
  Minor: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  Trivial: "bg-muted text-muted-foreground border-border",
};

export const STATUS_STYLES: Record<TestCaseStatus, string> = {
  Draft: "bg-muted text-muted-foreground border-border",
  Ready: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  "In Review": "bg-warning/15 text-warning border-warning/30",
  Approved: "bg-success/15 text-success border-success/30",
  Deprecated: "bg-destructive/10 text-destructive/70 border-destructive/20",
};

export const AUTOMATION_STYLES: Record<AutomationStatus, string> = {
  "Not Automated": "bg-muted text-muted-foreground border-border",
  "To Be Automated": "bg-warning/15 text-warning border-warning/30",
  Automated: "bg-success/15 text-success border-success/30",
  "Cannot Automate": "bg-destructive/10 text-destructive/70 border-destructive/20",
};

export const RESULT_STYLES: Record<ExecutionResultStatus, string> = {
  Pass: "bg-success/15 text-success border-success/30",
  Fail: "bg-destructive/15 text-destructive border-destructive/30",
  Blocked: "bg-warning/15 text-warning border-warning/30",
  Skipped: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  "Not Executed": "bg-muted text-muted-foreground border-border",
  Retest: "bg-chart-2/15 text-chart-2 border-chart-2/30",
};

export const RUN_STATUS_STYLES: Record<RunStatus, string> = {
  Planned: "bg-muted text-muted-foreground border-border",
  "In Progress": "bg-warning/15 text-warning border-warning/30",
  Completed: "bg-success/15 text-success border-success/30",
  Aborted: "bg-destructive/15 text-destructive border-destructive/30",
};
