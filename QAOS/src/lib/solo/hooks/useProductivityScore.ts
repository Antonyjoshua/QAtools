"use client";

import { useAppStore } from "@/lib/solo/store/useAppStore";
import { DAILY_QUEST_TEMPLATES, WEEKLY_MISSION_TEMPLATES } from "@/lib/solo/constants";
import { computeProductivityScore } from "@/lib/solo/services/analytics";

export function useProductivityScore() {
  const dailyCompleted = useAppStore((s) => s.quests.dailyCompleted.length);
  const weeklyCompleted = useAppStore((s) => s.quests.weeklyCompleted.length);
  const streak = useAppStore((s) => s.streak.current);

  const dailyCompletionRate = Math.min(1, dailyCompleted / DAILY_QUEST_TEMPLATES.length);
  const weeklyCompletionRate = Math.min(1, weeklyCompleted / WEEKLY_MISSION_TEMPLATES.length);

  return {
    score: computeProductivityScore({ dailyCompletionRate, weeklyCompletionRate, streak }),
    dailyCompletionRate,
    weeklyCompletionRate,
  };
}
