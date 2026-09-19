"use client";

import { Bug, ClipboardList, FlaskConical, Trophy } from "lucide-react";
import { StatTile } from "@/components/playground/dashboard/stat-tile";
import { XpProgressCard } from "@/components/playground/dashboard/xp-progress-card";
import { StreakCard } from "@/components/playground/dashboard/streak-card";
import { BadgesShelf } from "@/components/playground/dashboard/badges-shelf";
import { CategoryBreakdown } from "@/components/playground/dashboard/category-breakdown";
import { RecommendedChallengeCard } from "@/components/playground/dashboard/recommended-challenge-card";
import { useGamificationStore } from "@/lib/playground/gamification/store";
import { usePlaygroundStats } from "@/lib/playground/gamification/hooks/use-playground-stats";

export default function DashboardPage() {
  const xp = useGamificationStore((s) => s.xp);
  const streak = useGamificationStore((s) => s.streak);
  const unlockedBadgeIds = useGamificationStore((s) => s.unlockedBadgeIds);
  const stats = usePlaygroundStats();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">QuanGrade Playground</h1>
        <p className="text-sm text-muted-foreground">
          Practice Testing. Find Bugs. Build Automation. Become a Better QA.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Bugs Found" value={stats.bugsFound} icon={Bug} />
        <StatTile label="Test Cases Written" value={stats.testCasesCreated} icon={FlaskConical} />
        <StatTile label="Challenges Passed" value={stats.challengesPassed} icon={ClipboardList} />
        <StatTile label="Badges Earned" value={unlockedBadgeIds.length} icon={Trophy} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <XpProgressCard totalXp={xp} />
        <StreakCard current={streak.current} longest={streak.longest} />
        <RecommendedChallengeCard stats={stats} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CategoryBreakdown stats={stats} />
        <BadgesShelf unlockedIds={unlockedBadgeIds} />
      </div>
    </div>
  );
}
