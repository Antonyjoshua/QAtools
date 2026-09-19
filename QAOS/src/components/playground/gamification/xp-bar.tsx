import { Progress } from "@/components/ui/progress";
import { getLevelInfo } from "@/lib/playground/gamification/levels";
import { cn } from "@/lib/utils";

export function XpBar({ totalXp, className }: { totalXp: number; className?: string }) {
  const info = getLevelInfo(totalXp);
  const pct = info.xpForNextLevel > 0 ? Math.round(info.progress * 100) : 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-semibold">
          Level {info.level} — {info.title}
        </span>
        <span className="tabular-nums text-muted-foreground">
          {info.xpForNextLevel > 0
            ? `${info.xpIntoLevel} / ${info.xpForNextLevel} XP`
            : "Max level"}
        </span>
      </div>
      <Progress value={pct} className="mt-1.5" />
    </div>
  );
}
