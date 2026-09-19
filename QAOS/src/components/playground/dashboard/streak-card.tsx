import { Flame } from "lucide-react";

export function StreakCard({ current, longest }: { current: number; longest: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Flame className="size-5 text-status-serious" />
        <span className="text-2xl font-bold tabular-nums">{current}</span>
        <span className="text-sm text-muted-foreground">day streak</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Longest streak: {longest} days</p>
    </div>
  );
}
