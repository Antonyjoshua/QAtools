"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@/components/solo/shared/chart-card";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { aggregateXpByDay } from "@/lib/solo/services/analytics";
import { lastNDays } from "@/lib/solo/utils/date";

export function XpTrendChart() {
  const log = useAppStore((s) => s.xp.log);
  const days = lastNDays(30);
  const data = aggregateXpByDay(log, days).map((d) => {
    const [, m, dd] = d.date.split("-").map(Number);
    return { label: `${m}/${dd}`, xp: d.xp };
  });

  return (
    <ChartCard title="XP Over Time" description="Last 30 days">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            interval={4}
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
            labelStyle={{ color: "var(--muted-foreground)" }}
          />
          <Area type="monotone" dataKey="xp" stroke="var(--accent)" strokeWidth={2} fill="url(#xpFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
