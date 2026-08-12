"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/solo/ui/card";
import { Button } from "@/components/solo/ui/button";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { STAT_XP_MAP } from "@/lib/solo/constants";
import type { ProfileStats } from "@/lib/solo/types";

const QUICK_ACTION_KEYS: (keyof ProfileStats)[] = [
  "bugsReported",
  "testCasesWritten",
  "automationScripts",
  "apisTested",
  "sqlChallengesSolved",
  "interviewQuestionsSolved",
  "coursesCompleted",
  "projects",
];

export function QuickActionsCard() {
  const incrementStat = useAppStore((s) => s.incrementStat);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Log real work as it happens — every action grants XP.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {QUICK_ACTION_KEYS.map((key) => {
          const reward = STAT_XP_MAP[key];
          return (
            <Button
              key={key}
              variant="secondary"
              size="sm"
              className="flex-col h-auto py-2.5 gap-0.5"
              onClick={() => incrementStat(key)}
            >
              <span className="text-xs font-medium">{reward.label}</span>
              <span className="text-[10px] text-[var(--accent)]">+{reward.xp} XP</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
