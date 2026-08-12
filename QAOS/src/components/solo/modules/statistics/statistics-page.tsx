"use client";

import { StatisticsOverview } from "./components/statistics-overview";
import { XpTrendChart } from "./components/xp-trend-chart";
import { WeeklyPerformanceChart } from "./components/weekly-performance-chart";
import { MonthlyPerformanceChart } from "./components/monthly-performance-chart";
import { SkillGrowthChart } from "./components/skill-growth-chart";

export function StatisticsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Statistics</h1>
        <p className="text-sm text-muted-foreground">Your growth, quantified.</p>
      </div>
      <StatisticsOverview />
      <XpTrendChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeeklyPerformanceChart />
        <MonthlyPerformanceChart />
      </div>
      <SkillGrowthChart />
    </div>
  );
}
