import { Progress } from "@/components/ui/progress";
import type { PlaygroundStats } from "@/lib/playground/gamification/types";

export function CategoryBreakdown({ stats }: { stats: PlaygroundStats }) {
  const bugHunterPct =
    stats.totalActiveBugs > 0 ? Math.round((stats.bugsFound / stats.totalActiveBugs) * 100) : 0;
  const manualPct =
    stats.totalChallenges > 0 ? Math.round((stats.challengesPassed / stats.totalChallenges) * 100) : 0;
  const testCaseLabPct = stats.bestCoveragePercentAny;

  const rows = [
    { label: "Bug Hunter", value: bugHunterPct },
    { label: "Test Case Lab", value: testCaseLabPct },
    { label: "Manual Testing", value: manualPct },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">Category Strength</h3>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="mb-1 flex justify-between text-xs">
              <span>{r.label}</span>
              <span className="tabular-nums text-muted-foreground">{r.value}%</span>
            </div>
            <Progress value={r.value} />
          </div>
        ))}
      </div>
    </div>
  );
}
