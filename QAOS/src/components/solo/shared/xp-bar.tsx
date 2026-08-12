import { Progress } from "@/components/solo/ui/progress";
import { cn } from "@/lib/utils";

export function XpBar({
  current,
  max,
  label,
  className,
}: {
  current: number;
  max: number;
  label?: string;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 100;
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate">{label}</span>
          <span className="tabular-nums shrink-0 ml-2">
            {current.toLocaleString()} / {max.toLocaleString()} XP
          </span>
        </div>
      )}
      <Progress value={pct} />
    </div>
  );
}
