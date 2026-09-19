import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakFlame({ days, className }: { days: number; className?: string }) {
  if (days <= 0) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium text-status-serious",
        className
      )}
    >
      <Flame className="size-4" />
      {days} Day{days === 1 ? "" : "s"}
    </span>
  );
}
