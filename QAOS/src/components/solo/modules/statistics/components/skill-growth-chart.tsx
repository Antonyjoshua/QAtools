"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@/components/solo/shared/chart-card";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { getSkillLevelInfo } from "@/lib/solo/services/level";
import { SKILLS } from "@/lib/solo/constants";

export function SkillGrowthChart() {
  const skills = useAppStore((s) => s.skills);
  const data = SKILLS.map((skill) => ({
    name: skill.name,
    level: getSkillLevelInfo(skills[skill.id]?.xp ?? 0).level,
  })).sort((a, b) => b.level - a.level);

  return (
    <ChartCard title="Skill Growth" description="Current level per skill" heightClassName="h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.08)" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={130}
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
          <Bar dataKey="level" fill="var(--accent)" radius={[0, 4, 4, 0]} maxBarSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
