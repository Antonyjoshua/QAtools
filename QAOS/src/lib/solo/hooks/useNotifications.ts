"use client";

import { useAppStore } from "@/lib/solo/store/useAppStore";
import { isStreakAtRisk } from "@/lib/solo/services/analytics";
import { todayKey } from "@/lib/solo/utils/date";
import { DAILY_QUEST_TEMPLATES, WEEKLY_MISSION_TEMPLATES } from "@/lib/solo/constants";
import type { NotificationItem } from "@/lib/solo/types";

export function useNotifications(): NotificationItem[] {
  const streak = useAppStore((s) => s.streak);
  const dailyCompletedCount = useAppStore((s) => s.quests.dailyCompleted.length);
  const weeklyCompletedCount = useAppStore((s) => s.quests.weeklyCompleted.length);
  const today = todayKey();

  const items: NotificationItem[] = [];

  if (isStreakAtRisk(streak, today)) {
    items.push({
      id: "streak-risk",
      message: `Your ${streak.current}-day streak is at risk — complete a quest today!`,
      tone: "warning",
      createdAt: 0,
    });
  }

  if (dailyCompletedCount < DAILY_QUEST_TEMPLATES.length) {
    items.push({
      id: "daily-remaining",
      message: `${DAILY_QUEST_TEMPLATES.length - dailyCompletedCount} daily quest(s) remaining today.`,
      tone: "info",
      createdAt: 0,
    });
  } else {
    items.push({
      id: "daily-complete",
      message: "All daily quests complete. Well fought, Hunter.",
      tone: "success",
      createdAt: 0,
    });
  }

  if (weeklyCompletedCount < WEEKLY_MISSION_TEMPLATES.length) {
    items.push({
      id: "weekly-remaining",
      message: `${WEEKLY_MISSION_TEMPLATES.length - weeklyCompletedCount} weekly mission(s) still open.`,
      tone: "info",
      createdAt: 0,
    });
  }

  return items;
}
