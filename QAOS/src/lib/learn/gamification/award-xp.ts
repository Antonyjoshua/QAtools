import { toast } from "sonner";
import { useLearnSettings } from "../settings-store";
import { getLearnStats } from "../hooks/use-learn-stats";
import { ACHIEVEMENTS } from "./achievements";
import { getLevelInfo } from "./levels";

/** Awards XP, records the daily streak, and checks for newly-unlocked achievements — the one
 * call site every feature (articles, quizzes, flashcards, interview prep, roadmaps) uses instead
 * of duplicating this sequence. Reads/writes the zustand store imperatively via getState() since
 * this runs from event handlers, not render. */
export async function awardXp(amount: number, reason?: string): Promise<void> {
  const before = useLearnSettings.getState();
  const beforeLevel = getLevelInfo(before.xp).level;
  const beforeUnlocked = before.unlockedAchievementIds;

  before.addXp(amount);
  before.touchActivity();

  const stats = await getLearnStats();
  useLearnSettings.getState().checkAchievements(stats);

  const after = useLearnSettings.getState();
  const afterLevel = getLevelInfo(after.xp).level;

  if (afterLevel > beforeLevel) {
    toast.success(`Level up! You're now level ${afterLevel} — ${getLevelInfo(after.xp).title}.`);
  } else if (reason) {
    toast.success(`+${amount} XP — ${reason}`);
  }

  const newlyUnlocked = after.unlockedAchievementIds.filter((id) => !beforeUnlocked.includes(id));
  for (const id of newlyUnlocked) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === id);
    if (achievement) toast.success(`Achievement unlocked: ${achievement.title}`);
  }
}
