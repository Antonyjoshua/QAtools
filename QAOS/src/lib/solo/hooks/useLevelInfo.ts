"use client";

import { useAppStore } from "@/lib/solo/store/useAppStore";
import { getLevelInfo } from "@/lib/solo/services/level";

export function useLevelInfo() {
  const totalXp = useAppStore((s) => s.xp.total);
  return getLevelInfo(totalXp);
}
