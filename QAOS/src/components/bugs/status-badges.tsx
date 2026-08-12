import { cn } from "@/lib/utils";
import { SEVERITY_STYLES, PRIORITY_STYLES, STATUS_STYLES } from "@/lib/bugs/badge-styles";
import type { Severity, Priority, BugStatus } from "@/lib/bugs/types";

function Chip({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium leading-none", className)}>
      {children}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: Severity | null }) {
  if (!severity) return null;
  return <Chip className={SEVERITY_STYLES[severity]}>{severity}</Chip>;
}

export function PriorityBadge({ priority }: { priority: Priority | null }) {
  if (!priority) return null;
  return <Chip className={PRIORITY_STYLES[priority]}>{priority}</Chip>;
}

export function StatusBadge({ status }: { status: BugStatus }) {
  return <Chip className={STATUS_STYLES[status]}>{status}</Chip>;
}
