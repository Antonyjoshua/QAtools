import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { JOB_LEVEL_STYLES, JOB_STATUS_STYLES, REMOTE_STATUS_LABEL, REMOTE_STATUS_STYLES, SAVED_STATUS_STYLES } from "@/lib/jobs/badge-styles";
import type { JobLevel, JobStatus, RemoteStatus, SavedJobStatus } from "@/lib/jobs/types";

function Chip({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <Badge variant="outline" className={cn("font-medium", className)}>
      {children}
    </Badge>
  );
}

export function RemoteBadge({ value, className }: { value: RemoteStatus; className?: string }) {
  return <Chip className={cn(REMOTE_STATUS_STYLES[value], className)}>{REMOTE_STATUS_LABEL[value]}</Chip>;
}

export function LevelBadge({ value, className }: { value: JobLevel; className?: string }) {
  return <Chip className={cn(JOB_LEVEL_STYLES[value], className)}>{value}</Chip>;
}

export function JobStatusBadge({ value, className }: { value: JobStatus; className?: string }) {
  return <Chip className={cn(JOB_STATUS_STYLES[value], className)}>{value}</Chip>;
}

export function SavedStatusBadge({ value, className }: { value: SavedJobStatus; className?: string }) {
  return <Chip className={cn(SAVED_STATUS_STYLES[value], className)}>{value}</Chip>;
}

export function QualityScoreBadge({ score, label, className }: { score: number; label: string; className?: string }) {
  const tone = score >= 85 ? "bg-success/15 text-success border-success/30" : score >= 65 ? "bg-primary/15 text-primary border-primary/30" : score >= 45 ? "bg-warning/15 text-warning border-warning/30" : "bg-destructive/15 text-destructive border-destructive/30";
  return (
    <Chip className={cn(tone, className)}>
      {score}/100 · {label}
    </Chip>
  );
}
