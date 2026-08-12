"use client";

import { Zap, ListChecks, Percent, Bug, Bot, Flame } from "lucide-react";
import { StatTile } from "@/components/solo/shared/stat-tile";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { aggregateXpByDay } from "@/lib/solo/services/analytics";
import { lastNDays } from "@/lib/solo/utils/date";

export function StatisticsOverview() {
  const totalXp = useAppStore((s) => s.xp.total);
  const log = useAppStore((s) => s.xp.log);
  const questsCompletedTotal = useAppStore((s) => s.questsCompletedTotal);
  const streak = useAppStore((s) => s.streak.current);
  const bugsReported = useAppStore((s) => s.profile.stats.bugsReported);
  const automationScripts = useAppStore((s) => s.profile.stats.automationScripts);

  const last30 = lastNDays(30);
  const daily = aggregateXpByDay(log, last30);
  const activeDays = daily.filter((d) => d.xp > 0).length;
  const consistency = Math.round((activeDays / last30.length) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
      <StatTile icon={Zap} label="Total XP" value={totalXp.toLocaleString()} />
      <StatTile icon={ListChecks} label="Quests Completed" value={questsCompletedTotal} />
      <StatTile icon={Percent} label="Consistency" value={`${consistency}%`} sublabel="Last 30 days" />
      <StatTile icon={Flame} label="Current Streak" value={streak} sublabel="days" />
      <StatTile icon={Bug} label="Bugs Reported" value={bugsReported} />
      <StatTile icon={Bot} label="Automation Scripts" value={automationScripts} />
    </div>
  );
}
