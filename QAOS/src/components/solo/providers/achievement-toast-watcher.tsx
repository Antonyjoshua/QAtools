"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { ACHIEVEMENTS } from "@/lib/solo/constants";

export function AchievementToastWatcher() {
  const recentlyUnlocked = useAppStore((s) => s.achievements.recentlyUnlocked);
  const clearRecentAchievement = useAppStore((s) => s.clearRecentAchievement);

  useEffect(() => {
    if (recentlyUnlocked.length === 0) return;
    for (const id of recentlyUnlocked) {
      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      if (achievement) {
        toast.success(`Achievement Unlocked: ${achievement.name}`, {
          description: `${achievement.description} (+${achievement.xp} XP)`,
        });
      }
      clearRecentAchievement(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentlyUnlocked]);

  return null;
}
