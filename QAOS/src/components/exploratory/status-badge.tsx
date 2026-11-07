import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SessionStatus } from "@/lib/exploratory/types";

export const STATUS_BADGE_CLASS: Record<SessionStatus, string> = {
  Planned: "border-border text-muted-foreground",
  "In Progress": "border-success/40 text-success",
  Paused: "border-warning/40 text-warning",
  Completed: "border-chart-2/40 text-chart-2",
};

export function SessionStatusBadge({ status, className }: { status: SessionStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn(STATUS_BADGE_CLASS[status], className)}>
      {status}
    </Badge>
  );
}
