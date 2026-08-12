"use client";

import { useAppStore } from "@/lib/solo/store/useAppStore";
import { useAchievementContext } from "@/lib/solo/hooks/useAchievementContext";
import { ACHIEVEMENTS } from "@/lib/solo/constants";
import { AchievementCard } from "./components/achievement-card";

export function AchievementsPage() {
  const unlockedIds = useAppStore((s) => s.achievements.unlockedIds);
  const ctx = useAchievementContext();
  const unlockedSet = new Set(unlockedIds);

  const sorted = [...ACHIEVEMENTS].sort(
    (a, b) => Number(unlockedSet.has(b.id)) - Number(unlockedSet.has(a.id))
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Achievements</h1>
        <p className="text-sm text-muted-foreground">
          {unlockedIds.length} / {ACHIEVEMENTS.length} unlocked
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {sorted.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            unlocked={unlockedSet.has(achievement.id)}
            ctx={ctx}
          />
        ))}
      </div>
    </div>
  );
}
