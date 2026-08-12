import { cn } from "@/lib/utils";
import type { ExecutionStats } from "@/lib/testcases/types";

const SEGMENTS: { key: keyof ExecutionStats; className: string; label: string }[] = [
  { key: "pass", className: "bg-success", label: "Pass" },
  { key: "fail", className: "bg-destructive", label: "Fail" },
  { key: "blocked", className: "bg-warning", label: "Blocked" },
  { key: "retest", className: "bg-chart-2", label: "Retest" },
  { key: "skipped", className: "bg-chart-5", label: "Skipped" },
];

/** Segmented bar over ExecutionStats; the uncolored remainder is "Not Executed". */
export function StackedProgress({ stats, className }: { stats: ExecutionStats; className?: string }) {
  const total = stats.total || 1;
  return (
    <div className={cn("flex h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      {SEGMENTS.map((seg) => {
        const value = stats[seg.key] as number;
        if (!value) return null;
        return (
          <div
            key={seg.key}
            className={seg.className}
            style={{ width: `${(value / total) * 100}%` }}
            title={`${seg.label}: ${value}`}
          />
        );
      })}
    </div>
  );
}
