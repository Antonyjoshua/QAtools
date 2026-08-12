"use client";

import { useAppStore } from "@/lib/solo/store/useAppStore";
import { getSkillLevelInfo } from "@/lib/solo/services/level";

export function useSkillLevel(skillId: string) {
  const xp = useAppStore((s) => s.skills[skillId]?.xp ?? 0);
  return getSkillLevelInfo(xp);
}
