"use client";

import { Card } from "@/components/solo/ui/card";
import { Badge } from "@/components/solo/ui/badge";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { getLevelInfo } from "@/lib/solo/services/level";
import { cn } from "@/lib/utils";

const DEMO_HUNTERS = [
  { name: "ShadowStriker99", avatar: "🥷", xp: 48210, isYou: false },
  { name: "BugSlayerX", avatar: "🐛", xp: 31890, isYou: false },
  { name: "QA_Prime", avatar: "🤖", xp: 22040, isYou: false },
  { name: "NightTester", avatar: "🌙", xp: 9120, isYou: false },
  { name: "FreshHunter", avatar: "🧑‍💻", xp: 640, isYou: false },
];

export function LeaderboardPage() {
  const username = useAppStore((s) => s.profile.username);
  const avatar = useAppStore((s) => s.profile.avatar);
  const totalXp = useAppStore((s) => s.xp.total);

  const rows = [...DEMO_HUNTERS, { name: username, avatar, xp: totalXp, isYou: true }].sort(
    (a, b) => b.xp - a.xp
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">
          Local preview with sample Hunters — connect friends once a backend is wired up.
        </p>
      </div>
      <Card className="divide-y divide-white/5">
        {rows.map((row, i) => {
          const info = getLevelInfo(row.xp);
          return (
            <div
              key={`${row.name}-${i}`}
              className={cn("flex items-center gap-3 px-4 py-3", row.isYou && "bg-[var(--accent)]/[0.06]")}
            >
              <div
                className={cn(
                  "w-6 text-sm font-bold text-center",
                  i < 3 ? "text-[var(--accent)]" : "text-muted-foreground"
                )}
              >
                {i + 1}
              </div>
              <span className="text-xl">{row.avatar}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate flex items-center gap-2">
                  {row.name}
                  {row.isYou && <Badge>You</Badge>}
                </div>
                <div className="text-xs text-muted-foreground">
                  Level {info.level} · {info.rank}
                </div>
              </div>
              <div className="text-sm font-semibold tabular-nums">{row.xp.toLocaleString()} XP</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
