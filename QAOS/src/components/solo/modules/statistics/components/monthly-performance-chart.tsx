"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@/components/solo/shared/chart-card";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { aggregateXpByMonth } from "@/lib/solo/services/analytics";
import { lastNMonths } from "@/lib/solo/utils/date";

export function MonthlyPerformanceChart() {
  const log = useAppStore((s) => s.xp.log);
  const months = lastNMonths(6);
  const data = aggregateXpByMonth(log, months).map((d) => {
    const [y, m] = d.month.split("-").map(Number);
    return { label: new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: "short" }), xp: d.xp };
  });

  return (
    <ChartCard title="Monthly Performance" description="XP earned per month, last 6 months">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
          <Bar dataKey="xp" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
