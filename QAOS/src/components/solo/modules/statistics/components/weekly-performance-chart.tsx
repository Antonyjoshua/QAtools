"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@/components/solo/shared/chart-card";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { aggregateXpByDay } from "@/lib/solo/services/analytics";
import { lastNDays } from "@/lib/solo/utils/date";

export function WeeklyPerformanceChart() {
  const log = useAppStore((s) => s.xp.log);
  const days = lastNDays(7);
  const data = aggregateXpByDay(log, days).map((d) => {
    const [y, m, dd] = d.date.split("-").map(Number);
    const localDate = new Date(y, m - 1, dd);
    return { label: localDate.toLocaleDateString(undefined, { weekday: "short" }), xp: d.xp };
  });

  return (
    <ChartCard title="Weekly Performance" description="XP earned per day, last 7 days">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={36}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--panel-solid)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          <Bar dataKey="xp" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
