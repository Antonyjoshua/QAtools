"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type {
  UserProfile,
  ProfileStats,
  XpLogEntry,
  XpCategory,
  SkillState,
  QuestFrequency,
  CustomQuest,
  JournalEntry,
  Certification,
} from "@/lib/solo/types";
import { DEFAULT_PROFILE } from "@/lib/solo/types/profile";
import {
  SKILLS,
  DAILY_QUEST_TEMPLATES,
  WEEKLY_MISSION_TEMPLATES,
  MONTHLY_CHALLENGE_TEMPLATES,
  ACHIEVEMENTS,
  TITLES,
  THEMES,
  ROADMAP_MILESTONES,
  XP_REWARDS,
  STAT_XP_MAP,
  DEFAULT_THEME_ID,
} from "@/lib/solo/constants";
import { getLevelInfo, getSkillLevelInfo } from "@/lib/solo/services/level";
import { createXpLogEntry } from "@/lib/solo/services/xp";
import { updateStreakOnActivity, type StreakState } from "@/lib/solo/services/analytics";
import { evaluateNewAchievements, type AchievementContext } from "@/lib/solo/services/achievements";
import { todayKey, weekKey, monthKey } from "@/lib/solo/utils/date";

interface AppState {
  hasHydrated: boolean;
  lastLoginDate: string | null;
  profile: UserProfile;
  xp: { total: number; log: XpLogEntry[] };
  streak: StreakState;
  skills: Record<string, SkillState>;
  quests: {
    dailyDate: string;
    dailyCompleted: string[];
    weeklyKey: string;
    weeklyCompleted: string[];
    monthlyKey: string;
    monthlyCompleted: string[];
    custom: CustomQuest[];
  };
  questsCompletedTotal: number;
  achievements: { unlockedIds: string[]; recentlyUnlocked: string[] };
  settings: { accentTheme: string };
  journal: JournalEntry[];
  certifications: Certification[];
  roadmap: { completedMilestoneIds: string[]; rewardedIds: string[] };
}

interface AppActions {
  setHasHydrated: (value: boolean) => void;
  awardXp: (amount: number, reason: string, category: XpCategory) => void;
  ensurePeriodsFresh: () => void;
  recordLogin: () => void;
  completeDailyQuest: (id: string) => void;
  completeWeeklyMission: (id: string) => void;
  completeMonthlyChallenge: (id: string) => void;
  addCustomQuest: (input: { frequency: QuestFrequency; title: string; xp?: number }) => void;
  completeCustomQuest: (id: string) => void;
  removeCustomQuest: (id: string) => void;
  incrementStat: (statKey: keyof ProfileStats, amount?: number) => void;
  practiceSkill: (skillId: string) => void;
  addJournalEntry: (input: Omit<JournalEntry, "id" | "date" | "timestamp">) => void;
  removeJournalEntry: (id: string) => void;
  addCertification: (input: Omit<Certification, "id" | "createdAt">) => void;
  updateCertification: (id: string, patch: Partial<Omit<Certification, "id" | "createdAt">>) => void;
  removeCertification: (id: string) => void;
  toggleRoadmapMilestone: (id: string) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  equipTitle: (titleId: string) => void;
  equipTheme: (themeId: string) => void;
  clearRecentAchievement: (id: string) => void;
  resetProgress: () => void;
}

type QaStore = AppState & AppActions;

function createInitialSkillsState(): Record<string, SkillState> {
  const map: Record<string, SkillState> = {};
  for (const skill of SKILLS) map[skill.id] = { xp: 0 };
  return map;
}

function createInitialState(): AppState {
  return {
    hasHydrated: false,
    lastLoginDate: null,
    profile: DEFAULT_PROFILE,
    xp: { total: 0, log: [] },
    streak: { current: 0, longest: 0, lastActiveDate: null },
    skills: createInitialSkillsState(),
    quests: {
      dailyDate: todayKey(),
      dailyCompleted: [],
      weeklyKey: weekKey(),
      weeklyCompleted: [],
      monthlyKey: monthKey(),
      monthlyCompleted: [],
      custom: [],
    },
    questsCompletedTotal: 0,
    achievements: { unlockedIds: [], recentlyUnlocked: [] },
    settings: { accentTheme: DEFAULT_THEME_ID },
    journal: [],
    certifications: [],
    roadmap: { completedMilestoneIds: [], rewardedIds: [] },
  };
}

function bumpStat(profile: UserProfile, statKey: string, amount: number): UserProfile {
  const stats = profile.stats as unknown as Record<string, number>;
  return {
    ...profile,
    stats: { ...stats, [statKey]: (stats[statKey] ?? 0) + amount } as unknown as ProfileStats,
  };
}

function bumpSkill(
  skills: Record<string, SkillState>,
  skillId: string,
  amount: number
): Record<string, SkillState> {
  const prev = skills[skillId] ?? { xp: 0 };
  return { ...skills, [skillId]: { xp: prev.xp + amount } };
}

export const useAppStore = create<QaStore>()(
  persist(
    (set, get) => {
      function evaluateAndUnlockAchievements() {
        const state = get();
        const levelInfo = getLevelInfo(state.xp.total);
        const skillLevels: Record<string, number> = {};
        for (const skill of SKILLS) {
          skillLevels[skill.id] = getSkillLevelInfo(state.skills[skill.id]?.xp ?? 0).level;
        }
        const ctx: AchievementContext = {
          stats: state.profile.stats as unknown as Record<string, number>,
          streak: state.streak.current,
          level: levelInfo.level,
          skillLevels,
          questsCompletedTotal: state.questsCompletedTotal,
          journalCount: state.journal.length,
          certificationsCount: state.certifications.filter((c) => c.status === "completed").length,
        };
        const newly = evaluateNewAchievements(ctx, state.achievements.unlockedIds);
        if (newly.length === 0) return;

        set((s) => ({
          achievements: {
            unlockedIds: [...s.achievements.unlockedIds, ...newly],
            recentlyUnlocked: [...s.achievements.recentlyUnlocked, ...newly],
          },
        }));

        const bonusXp = newly.reduce(
          (sum, id) => sum + (ACHIEVEMENTS.find((a) => a.id === id)?.xp ?? 0),
          0
        );
        if (bonusXp > 0) {
          get().awardXp(bonusXp, "Achievement Unlocked", "achievement");
        }
      }

      return {
        ...createInitialState(),

        setHasHydrated: (value) => set({ hasHydrated: value }),

        awardXp: (amount, reason, category) => {
          if (amount === 0) return;
          const today = todayKey();
          set((s) => ({
            xp: {
              total: s.xp.total + amount,
              log: [...s.xp.log, createXpLogEntry(amount, reason, category, today)],
            },
            streak: updateStreakOnActivity(s.streak, today),
          }));
          evaluateAndUnlockAchievements();
        },

        ensurePeriodsFresh: () => {
          const today = todayKey();
          const week = weekKey();
          const month = monthKey();
          set((s) => {
            if (
              s.quests.dailyDate === today &&
              s.quests.weeklyKey === week &&
              s.quests.monthlyKey === month
            ) {
              return {};
            }
            return {
              quests: {
                dailyDate: today,
                dailyCompleted: s.quests.dailyDate === today ? s.quests.dailyCompleted : [],
                weeklyKey: week,
                weeklyCompleted: s.quests.weeklyKey === week ? s.quests.weeklyCompleted : [],
                monthlyKey: month,
                monthlyCompleted: s.quests.monthlyKey === month ? s.quests.monthlyCompleted : [],
                custom: s.quests.custom.filter((c) => {
                  if (c.frequency === "daily") return c.periodKey === today;
                  if (c.frequency === "weekly") return c.periodKey === week;
                  return c.periodKey === month;
                }),
              },
            };
          });
        },

        recordLogin: () => {
          get().ensurePeriodsFresh();
          const today = todayKey();
          if (get().lastLoginDate === today) return;
          set({ lastLoginDate: today });
          get().awardXp(XP_REWARDS.LOGIN, "Daily Login", "login");
        },

        completeDailyQuest: (id) => {
          get().ensurePeriodsFresh();
          const state = get();
          if (state.quests.dailyCompleted.includes(id)) return;
          const template = DAILY_QUEST_TEMPLATES.find((t) => t.id === id);
          if (!template) return;
          set((s) => ({
            quests: { ...s.quests, dailyCompleted: [...s.quests.dailyCompleted, id] },
            questsCompletedTotal: s.questsCompletedTotal + 1,
            profile: template.statKey ? bumpStat(s.profile, template.statKey, 1) : s.profile,
            skills: template.skillId
              ? bumpSkill(s.skills, template.skillId, Math.round(template.xp * 0.5))
              : s.skills,
          }));
          get().awardXp(template.xp, template.title, "quest");
          if (DAILY_QUEST_TEMPLATES.every((t) => get().quests.dailyCompleted.includes(t.id))) {
            get().awardXp(XP_REWARDS.ALL_DAILY_QUESTS_BONUS, "All Daily Quests Complete", "quest");
          }
        },

        completeWeeklyMission: (id) => {
          get().ensurePeriodsFresh();
          const state = get();
          if (state.quests.weeklyCompleted.includes(id)) return;
          const template = WEEKLY_MISSION_TEMPLATES.find((t) => t.id === id);
          if (!template) return;
          set((s) => ({
            quests: { ...s.quests, weeklyCompleted: [...s.quests.weeklyCompleted, id] },
            questsCompletedTotal: s.questsCompletedTotal + 1,
            skills: template.skillId
              ? bumpSkill(s.skills, template.skillId, Math.round(template.xp * 0.5))
              : s.skills,
          }));
          get().awardXp(template.xp, template.title, "mission");
        },

        completeMonthlyChallenge: (id) => {
          get().ensurePeriodsFresh();
          const state = get();
          if (state.quests.monthlyCompleted.includes(id)) return;
          const template = MONTHLY_CHALLENGE_TEMPLATES.find((t) => t.id === id);
          if (!template) return;
          set((s) => ({
            quests: { ...s.quests, monthlyCompleted: [...s.quests.monthlyCompleted, id] },
            questsCompletedTotal: s.questsCompletedTotal + 1,
            skills: template.skillId
              ? bumpSkill(s.skills, template.skillId, Math.round(template.xp * 0.5))
              : s.skills,
          }));
          get().awardXp(template.xp, template.title, "challenge");
        },

        addCustomQuest: (input) => {
          const periodKey =
            input.frequency === "daily"
              ? todayKey()
              : input.frequency === "weekly"
                ? weekKey()
                : monthKey();
          const quest: CustomQuest = {
            id: crypto.randomUUID(),
            frequency: input.frequency,
            title: input.title,
            xp: input.xp ?? XP_REWARDS.CUSTOM_QUEST_DEFAULT,
            createdAt: Date.now(),
            periodKey,
          };
          set((s) => ({ quests: { ...s.quests, custom: [...s.quests.custom, quest] } }));
        },

        completeCustomQuest: (id) => {
          const custom = get().quests.custom.find((c) => c.id === id);
          if (!custom) return;
          set((s) => ({
            quests: { ...s.quests, custom: s.quests.custom.filter((c) => c.id !== id) },
            questsCompletedTotal: s.questsCompletedTotal + 1,
          }));
          const category =
            custom.frequency === "daily" ? "quest" : custom.frequency === "weekly" ? "mission" : "challenge";
          get().awardXp(custom.xp, custom.title, category);
        },

        removeCustomQuest: (id) =>
          set((s) => ({ quests: { ...s.quests, custom: s.quests.custom.filter((c) => c.id !== id) } })),

        incrementStat: (statKey, amount = 1) => {
          set((s) => ({ profile: bumpStat(s.profile, statKey, amount) }));
          const reward = STAT_XP_MAP[statKey];
          if (reward) get().awardXp(reward.xp * amount, reward.label, "stat");
        },

        practiceSkill: (skillId) => {
          const skill = SKILLS.find((s) => s.id === skillId);
          if (!skill) return;
          set((s) => ({ skills: bumpSkill(s.skills, skillId, XP_REWARDS.SKILL_PRACTICE) }));
          get().awardXp(XP_REWARDS.SKILL_PRACTICE, `Practiced ${skill.name}`, "skill");
        },

        addJournalEntry: (input) => {
          const entry: JournalEntry = {
            id: crypto.randomUUID(),
            date: todayKey(),
            timestamp: Date.now(),
            ...input,
          };
          set((s) => ({ journal: [entry, ...s.journal] }));
          get().awardXp(XP_REWARDS.JOURNAL_ENTRY, "Journal Entry", "journal");
        },

        removeJournalEntry: (id) => set((s) => ({ journal: s.journal.filter((j) => j.id !== id) })),

        addCertification: (input) => {
          const cert: Certification = { id: crypto.randomUUID(), createdAt: Date.now(), ...input };
          set((s) => ({ certifications: [cert, ...s.certifications] }));
          if (cert.status === "completed") {
            get().awardXp(XP_REWARDS.CERTIFICATION_COMPLETE, `Certified: ${cert.courseName}`, "certification");
            get().incrementStat("certifications", 1);
          }
        },

        updateCertification: (id, patch) => {
          const prev = get().certifications.find((c) => c.id === id);
          if (!prev) return;
          const wasCompleted = prev.status === "completed";
          set((s) => ({
            certifications: s.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)),
          }));
          const nowCompleted = (patch.status ?? prev.status) === "completed";
          if (!wasCompleted && nowCompleted) {
            get().awardXp(XP_REWARDS.CERTIFICATION_COMPLETE, `Certified: ${prev.courseName}`, "certification");
            get().incrementStat("certifications", 1);
          }
        },

        removeCertification: (id) =>
          set((s) => ({ certifications: s.certifications.filter((c) => c.id !== id) })),

        toggleRoadmapMilestone: (id) => {
          const state = get();
          const isDone = state.roadmap.completedMilestoneIds.includes(id);
          set((s) => ({
            roadmap: {
              ...s.roadmap,
              completedMilestoneIds: isDone
                ? s.roadmap.completedMilestoneIds.filter((x) => x !== id)
                : [...s.roadmap.completedMilestoneIds, id],
            },
          }));
          if (!isDone && !state.roadmap.rewardedIds.includes(id)) {
            set((s) => ({ roadmap: { ...s.roadmap, rewardedIds: [...s.roadmap.rewardedIds, id] } }));
            const milestone = ROADMAP_MILESTONES.find((m) => m.id === id);
            get().awardXp(
              XP_REWARDS.ROADMAP_MILESTONE,
              milestone ? `Roadmap: ${milestone.title}` : "Roadmap Milestone",
              "roadmap"
            );
          }
        },

        updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

        equipTitle: (titleId) => {
          const levelInfo = getLevelInfo(get().xp.total);
          const title = TITLES.find((t) => t.id === titleId);
          if (!title || title.unlockLevel > levelInfo.level) return;
          set((s) => ({ profile: { ...s.profile, badge: titleId } }));
        },

        equipTheme: (themeId) => {
          const levelInfo = getLevelInfo(get().xp.total);
          const theme = THEMES.find((t) => t.id === themeId);
          if (!theme || theme.unlockLevel > levelInfo.level) return;
          set((s) => ({ settings: { ...s.settings, accentTheme: themeId } }));
        },

        clearRecentAchievement: (id) =>
          set((s) => ({
            achievements: {
              ...s.achievements,
              recentlyUnlocked: s.achievements.recentlyUnlocked.filter((x) => x !== id),
            },
          })),

        resetProgress: () => set((s) => ({ ...createInitialState(), hasHydrated: s.hasHydrated })),
      };
    },
    {
      name: "qa-level-up-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
