"use client";

import { useAppStore } from "@/lib/solo/store/useAppStore";
import { useLevelInfo } from "./useLevelInfo";
import { getSkillLevelInfo } from "@/lib/solo/services/level";
import { SKILLS } from "@/lib/solo/constants";
import type { AchievementContext } from "@/lib/solo/services/achievements";

export function useAchievementContext(): AchievementContext {
  const stats = useAppStore((s) => s.profile.stats);
  const streak = useAppStore((s) => s.streak.current);
  const skills = useAppStore((s) => s.skills);
  const questsCompletedTotal = useAppStore((s) => s.questsCompletedTotal);
  const journalCount = useAppStore((s) => s.journal.length);
  const certificationsCount = useAppStore(
    (s) => s.certifications.filter((c) => c.status === "completed").length
  );
  const levelInfo = useLevelInfo();

  const skillLevels: Record<string, number> = {};
  for (const skill of SKILLS) {
    skillLevels[skill.id] = getSkillLevelInfo(skills[skill.id]?.xp ?? 0).level;
  }

  return {
    stats: stats as unknown as Record<string, number>,
    streak,
    level: levelInfo.level,
    skillLevels,
    questsCompletedTotal,
    journalCount,
    certificationsCount,
  };
}
