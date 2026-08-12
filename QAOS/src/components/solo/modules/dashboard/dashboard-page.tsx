"use client";

import { HunterStatusCard } from "./components/hunter-status-card";
import { DashboardStatGrid } from "./components/dashboard-stat-grid";
import { ActiveQuestsCard } from "./components/active-quests-card";
import { SkillLevelsCard } from "./components/skill-levels-card";
import { QuickActionsCard } from "./components/quick-actions-card";
import { AiCoachTeaser } from "./components/ai-coach-teaser";

export function DashboardPage() {
  return (
    <div className="space-y-4">
      <HunterStatusCard />
      <DashboardStatGrid />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActiveQuestsCard />
        <SkillLevelsCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <QuickActionsCard />
        </div>
        <AiCoachTeaser />
      </div>
    </div>
  );
}
