"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/solo/ui/card";
import { Checkbox } from "@/components/solo/ui/checkbox";
import { Badge } from "@/components/solo/ui/badge";
import { Button } from "@/components/solo/ui/button";
import { DAILY_QUEST_TEMPLATES } from "@/lib/solo/constants";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { cn } from "@/lib/utils";

export function ActiveQuestsCard() {
  const dailyCompleted = useAppStore((s) => s.quests.dailyCompleted);
  const completeDailyQuest = useAppStore((s) => s.completeDailyQuest);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Active Daily Quests</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/journey/quests">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {DAILY_QUEST_TEMPLATES.map((quest) => {
          const done = dailyCompleted.includes(quest.id);
          return (
            <label
              key={quest.id}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer transition-colors",
                done ? "bg-white/[0.03] opacity-60" : "hover:bg-white/5"
              )}
            >
              <Checkbox
                checked={done}
                disabled={done}
                onCheckedChange={() => !done && completeDailyQuest(quest.id)}
              />
              <span className={cn("flex-1 text-sm", done && "line-through")}>{quest.title}</span>
              <Badge variant={done ? "success" : "default"}>+{quest.xp} XP</Badge>
            </label>
          );
        })}
      </CardContent>
    </Card>
  );
}
