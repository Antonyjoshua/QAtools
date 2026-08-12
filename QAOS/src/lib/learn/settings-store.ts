import { create } from "zustand";
import { persist } from "zustand/middleware";
import { recordActivity, type StreakState } from "./gamification/streak";
import { evaluateNewAchievements, type AchievementStats } from "./gamification/achievements";
import { getLevelInfo } from "./gamification/levels";

interface LearnSettingsState {
  xp: number;
  streak: StreakState;
  unlockedAchievementIds: string[];
  recentlyUnlockedIds: string[];
  recentArticleIds: string[];

  addXp: (amount: number) => void;
  touchActivity: () => void;
  recordRecentArticle: (id: string) => void;
  checkAchievements: (stats: Omit<AchievementStats, "level" | "streakCurrent">) => void;
  acknowledgeNewAchievements: () => void;
}

export const useLearnSettings = create<LearnSettingsState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: { current: 0, longest: 0, lastActiveDate: null },
      unlockedAchievementIds: [],
      recentlyUnlockedIds: [],
      recentArticleIds: [],

      addXp: (amount) => set((s) => ({ xp: s.xp + amount })),
      touchActivity: () => set((s) => ({ streak: recordActivity(s.streak) })),
      recordRecentArticle: (id) => set((s) => ({ recentArticleIds: [id, ...s.recentArticleIds.filter((a) => a !== id)].slice(0, 10) })),

      checkAchievements: (partial) => {
        const state = get();
        const stats: AchievementStats = { ...partial, level: getLevelInfo(state.xp).level, streakCurrent: state.streak.current };
        const newly = evaluateNewAchievements(stats, state.unlockedAchievementIds);
        if (newly.length === 0) return;
        set({
          unlockedAchievementIds: [...state.unlockedAchievementIds, ...newly],
          recentlyUnlockedIds: [...state.recentlyUnlockedIds, ...newly],
        });
      },
      acknowledgeNewAchievements: () => set({ recentlyUnlockedIds: [] }),
    }),
    { name: "qaos-learn-settings" }
  )
);
