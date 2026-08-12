"use client";

import { Lock, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/solo/ui/card";
import { Progress } from "@/components/solo/ui/progress";
import { Button } from "@/components/solo/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { useSkillLevel } from "@/lib/solo/hooks/useSkillLevel";
import { XP_REWARDS } from "@/lib/solo/constants";
import type { SkillDefinition } from "@/lib/solo/types";

export function SkillCard({ skill }: { skill: SkillDefinition }) {
  const info = useSkillLevel(skill.id);
  const practiceSkill = useAppStore((s) => s.practiceSkill);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="text-xl">{skill.icon}</span>
            {skill.name}
          </CardTitle>
          <CardDescription className="mt-1">{skill.description}</CardDescription>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-bold text-[var(--accent)]">Lv. {info.level}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>
              {info.xpIntoLevel} / {info.xpForNextLevel} XP
            </span>
          </div>
          <Progress value={info.progress * 100} />
        </div>

        <div className="space-y-1.5">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Unlocks</div>
          {skill.unlocks.map((unlock) => {
            const unlocked = info.level >= unlock.requiredLevel;
            return (
              <div
                key={unlock.id}
                className={cn(
                  "flex items-center gap-2 text-sm",
                  unlocked ? "text-foreground/90" : "text-muted-foreground"
                )}
              >
                {unlocked ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Lock className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className={cn(!unlocked && "opacity-70")}>{unlock.label}</span>
                {!unlocked && (
                  <span className="ml-auto text-[10px] text-muted-foreground">Lv. {unlock.requiredLevel}</span>
                )}
              </div>
            );
          })}
        </div>

        <Button variant="secondary" size="sm" className="w-full" onClick={() => practiceSkill(skill.id)}>
          Practice (+{XP_REWARDS.SKILL_PRACTICE} XP)
        </Button>
      </CardContent>
    </Card>
  );
}
