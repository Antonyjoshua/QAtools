"use client";

import { Trophy, CalendarRange, CalendarCheck2, Gauge, CheckCircle2 } from "lucide-react";
import { StatTile } from "@/components/solo/shared/stat-tile";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { useProductivityScore } from "@/lib/solo/hooks/useProductivityScore";
import { ACHIEVEMENTS, DAILY_QUEST_TEMPLATES, WEEKLY_MISSION_TEMPLATES, MONTHLY_CHALLENGE_TEMPLATES } from "@/lib/solo/constants";

export function DashboardStatGrid() {
  const dailyCompleted = useAppStore((s) => s.quests.dailyCompleted.length);
  const weeklyCompleted = useAppStore((s) => s.quests.weeklyCompleted.length);
  const monthlyCompleted = useAppStore((s) => s.quests.monthlyCompleted.length);
  const unlockedAchievements = useAppStore((s) => s.achievements.unlockedIds.length);
  const { score } = useProductivityScore();

  const completionPct = Math.round((dailyCompleted / DAILY_QUEST_TEMPLATES.length) * 100);
  const weeklyPct = Math.round((weeklyCompleted / WEEKLY_MISSION_TEMPLATES.length) * 100);
  const monthlyPct = Math.round((monthlyCompleted / MONTHLY_CHALLENGE_TEMPLATES.length) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <StatTile
        icon={CheckCircle2}
        label="Completion"
        value={`${completionPct}%`}
        sublabel={`${dailyCompleted}/${DAILY_QUEST_TEMPLATES.length} daily quests`}
      />
      <StatTile
        icon={CalendarRange}
        label="Weekly Progress"
        value={`${weeklyPct}%`}
        sublabel={`${weeklyCompleted}/${WEEKLY_MISSION_TEMPLATES.length} missions`}
      />
      <StatTile
        icon={CalendarCheck2}
        label="Monthly Progress"
        value={`${monthlyPct}%`}
        sublabel={`${monthlyCompleted}/${MONTHLY_CHALLENGE_TEMPLATES.length} challenges`}
      />
      <StatTile
        icon={Trophy}
        label="Achievements"
        value={`${unlockedAchievements}/${ACHIEVEMENTS.length}`}
        sublabel="Unlocked"
      />
      <StatTile icon={Gauge} label="Productivity" value={score} sublabel="Score / 100" />
    </div>
  );
}
