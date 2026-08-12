import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  PRIORITY_STYLES,
  SEVERITY_STYLES,
  STATUS_STYLES,
  AUTOMATION_STYLES,
  RESULT_STYLES,
  RUN_STATUS_STYLES,
} from "@/lib/testcases/badge-styles";
import type {
  Priority,
  Severity,
  TestCaseStatus,
  AutomationStatus,
  ExecutionResultStatus,
  RunStatus,
} from "@/lib/testcases/types";

function Chip({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <Badge variant="outline" className={cn("font-medium", className)}>
      {children}
    </Badge>
  );
}

export function PriorityBadge({ value, className }: { value: Priority; className?: string }) {
  return <Chip className={cn(PRIORITY_STYLES[value], className)}>{value}</Chip>;
}

export function SeverityBadge({ value, className }: { value: Severity; className?: string }) {
  return <Chip className={cn(SEVERITY_STYLES[value], className)}>{value}</Chip>;
}

export function StatusBadge({ value, className }: { value: TestCaseStatus; className?: string }) {
  return <Chip className={cn(STATUS_STYLES[value], className)}>{value}</Chip>;
}

export function AutomationBadge({ value, className }: { value: AutomationStatus; className?: string }) {
  return <Chip className={cn(AUTOMATION_STYLES[value], className)}>{value}</Chip>;
}

export function ResultBadge({ value, className }: { value: ExecutionResultStatus | "Not Run"; className?: string }) {
  const style = value === "Not Run" ? RESULT_STYLES["Not Executed"] : RESULT_STYLES[value];
  return <Chip className={cn(style, className)}>{value}</Chip>;
}

export function RunStatusBadge({ value, className }: { value: RunStatus; className?: string }) {
  return <Chip className={cn(RUN_STATUS_STYLES[value], className)}>{value}</Chip>;
}
