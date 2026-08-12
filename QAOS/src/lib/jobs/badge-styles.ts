import type { RemoteStatus, JobLevel, JobStatus, SavedJobStatus, EmploymentType } from "./types";

export const REMOTE_STATUS_LABEL: Record<RemoteStatus, string> = {
  ONSITE: "On-site",
  HYBRID: "Hybrid",
  REMOTE_INDIA: "Remote — India",
  REMOTE_WORLDWIDE: "Remote — Worldwide",
  REMOTE_REGION: "Remote — Regional",
  REMOTE_UNKNOWN: "Remote (unconfirmed)",
};

export const REMOTE_STATUS_STYLES: Record<RemoteStatus, string> = {
  ONSITE: "bg-muted text-muted-foreground border-border",
  HYBRID: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  REMOTE_INDIA: "bg-success/15 text-success border-success/30",
  REMOTE_WORLDWIDE: "bg-primary/15 text-primary border-primary/30",
  REMOTE_REGION: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  REMOTE_UNKNOWN: "bg-warning/15 text-warning border-warning/30",
};

export const JOB_LEVEL_STYLES: Record<JobLevel, string> = {
  Intern: "bg-muted text-muted-foreground border-border",
  Fresher: "bg-muted text-muted-foreground border-border",
  Junior: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  "Mid-Level": "bg-primary/15 text-primary border-primary/30",
  Senior: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  Lead: "bg-warning/15 text-warning border-warning/30",
  Manager: "bg-destructive/15 text-destructive border-destructive/30",
  Architect: "bg-chart-5/15 text-chart-5 border-chart-5/30",
};

export const JOB_STATUS_STYLES: Record<JobStatus, string> = {
  ACTIVE: "bg-success/15 text-success border-success/30",
  EXPIRED: "bg-muted text-muted-foreground border-border",
  REMOVED: "bg-destructive/15 text-destructive border-destructive/30",
  UNKNOWN: "bg-warning/15 text-warning border-warning/30",
};

export const SAVED_STATUS_STYLES: Record<SavedJobStatus, string> = {
  Saved: "bg-muted text-muted-foreground border-border",
  Applied: "bg-primary/15 text-primary border-primary/30",
  Interview: "bg-warning/15 text-warning border-warning/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
  Archived: "bg-muted text-muted-foreground border-border",
};

export const EMPLOYMENT_TYPE_LABEL: Record<EmploymentType, string> = {
  "Full-time": "Full-time",
  "Part-time": "Part-time",
  Contract: "Contract",
  Internship: "Internship",
  Freelance: "Freelance",
};
