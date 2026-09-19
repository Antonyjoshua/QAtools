"use client";

import { toast } from "sonner";
import { useGamificationStore } from "./store";
import { getLevelInfo } from "./levels";
import { getPlaygroundStats } from "./stats";
import { BADGES } from "./badges";

/** The single entry point every module calls to award XP. */
export async function awardXp(amount: number, reason?: string): Promise<void> {
  const before = useGamificationStore.getState();
  const beforeLevel = getLevelInfo(before.xp).level;

  before.addXp(amount, reason);
  before.touchActivity();

  const stats = await getPlaygroundStats();
  useGamificationStore.getState().checkBadges(stats);

  const after = useGamificationStore.getState();
  const afterLevelInfo = getLevelInfo(after.xp);

  if (afterLevelInfo.level > beforeLevel) {
    toast.success(`Level up! You're now level ${afterLevelInfo.level} — ${afterLevelInfo.title}.`);
  } else if (amount > 0) {
    toast.success(reason ? `+${amount} XP — ${reason}` : `+${amount} XP`);
  }

  if (after.recentlyUnlockedBadgeIds.length > 0) {
    for (const badgeId of after.recentlyUnlockedBadgeIds) {
      const badge = BADGES.find((b) => b.id === badgeId);
      if (badge) toast.success(`🏅 Badge unlocked: ${badge.title}`);
    }
    useGamificationStore.getState().acknowledgeNewBadges();
  }
}
