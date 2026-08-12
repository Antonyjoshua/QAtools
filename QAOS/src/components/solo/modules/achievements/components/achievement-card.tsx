"use client";

import { Lock } from "lucide-react";
import { Card } from "@/components/solo/ui/card";
import { Progress } from "@/components/solo/ui/progress";
import { Badge } from "@/components/solo/ui/badge";
import { cn } from "@/lib/utils";
import type { AchievementDefinition } from "@/lib/solo/types";
import { getConditionProgress, type AchievementContext } from "@/lib/solo/services/achievements";

export function AchievementCard({
  achievement,
  unlocked,
  ctx,
}: {
  achievement: AchievementDefinition;
  unlocked: boolean;
  ctx: AchievementContext;
}) {
  const { current, target } = getConditionProgress(achievement.condition, ctx);
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 100;

  return (
    <Card className={cn("p-4 space-y-2", unlocked ? "border-[var(--accent)]/30" : "opacity-80")}>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl",
            unlocked
              ? "bg-[var(--accent)]/15 border border-[var(--accent)]/30"
              : "bg-white/5 border border-white/10"
          )}
        >
          {unlocked ? achievement.icon : <Lock className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold truncate">{achievement.name}</div>
          <div className="text-xs text-muted-foreground truncate">{achievement.description}</div>
        </div>
        <Badge variant={unlocked ? "success" : "locked"}>+{achievement.xp} XP</Badge>
      </div>
      {!unlocked && (
        <div className="space-y-1">
          <Progress value={pct} className="h-1.5" />
          <div className="text-[10px] text-muted-foreground text-right">
            {Math.min(current, target)} / {target}
          </div>
        </div>
      )}
    </Card>
  );
}
