"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "@/lib/playground/id";
import type { PlaygroundStats, StreakState, XpLogEntry } from "./types";
import { recordActivity } from "./streak";
import { BADGES } from "./badges";

const MAX_LOG_ENTRIES = 200;

interface GamificationState {
  xp: number;
  xpLog: XpLogEntry[];
  streak: StreakState;
  unlockedBadgeIds: string[];
  recentlyUnlockedBadgeIds: string[];
  addXp: (amount: number, reason?: string) => void;
  touchActivity: () => void;
  checkBadges: (stats: PlaygroundStats) => void;
  acknowledgeNewBadges: () => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      xpLog: [],
      streak: { current: 0, longest: 0, lastActiveDate: null },
      unlockedBadgeIds: [],
      recentlyUnlockedBadgeIds: [],

      addXp: (amount, reason) =>
        set((s) => ({
          xp: s.xp + amount,
          xpLog: [
            { id: uid(), amount, reason, at: new Date().toISOString() },
            ...s.xpLog,
          ].slice(0, MAX_LOG_ENTRIES),
        })),

      touchActivity: () => set((s) => ({ streak: recordActivity(s.streak) })),

      checkBadges: (stats) => {
        const unlocked = new Set(get().unlockedBadgeIds);
        const newlyUnlocked: string[] = [];
        for (const badge of BADGES) {
          if (!unlocked.has(badge.id) && badge.isUnlocked(stats)) {
            unlocked.add(badge.id);
            newlyUnlocked.push(badge.id);
          }
        }
        if (newlyUnlocked.length > 0) {
          set({
            unlockedBadgeIds: Array.from(unlocked),
            recentlyUnlockedBadgeIds: newlyUnlocked,
          });
        }
      },

      acknowledgeNewBadges: () => set({ recentlyUnlockedBadgeIds: [] }),
    }),
    { name: "quangrade-playground-gamification" }
  )
);
