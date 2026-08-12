"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/solo/ui/card";
import { Button } from "@/components/solo/ui/button";
import { Progress } from "@/components/solo/ui/progress";
import { ScrollArea } from "@/components/solo/ui/scroll-area";
import { SKILLS } from "@/lib/solo/constants";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { getSkillLevelInfo } from "@/lib/solo/services/level";

export function SkillLevelsCard() {
  const skills = useAppStore((s) => s.skills);

  const ranked = [...SKILLS]
    .map((skill) => ({ skill, info: getSkillLevelInfo(skills[skill.id]?.xp ?? 0) }))
    .sort((a, b) => b.info.level - a.info.level || b.info.xpIntoLevel - a.info.xpIntoLevel);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Skill Levels</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/journey/skills">View tree</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64 px-5 pb-5">
          <div className="space-y-3">
            {ranked.map(({ skill, info }) => (
              <div key={skill.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span>{skill.icon}</span>
                    {skill.name}
                  </span>
                  <span className="text-xs text-muted-foreground">Lv. {info.level}</span>
                </div>
                <Progress value={info.progress * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
