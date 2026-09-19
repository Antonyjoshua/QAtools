import { Progress } from "@/components/ui/progress";
import type { CoverageResult } from "@/lib/playground/testcase-lab/scoring";

export function CoverageScorePanel({ result }: { result: CoverageResult }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-semibold">Coverage Score</span>
        <span className="text-lg font-bold">{result.overall}/100</span>
      </div>
      <div className="space-y-2.5">
        {result.categories.map((c) => (
          <div key={c.type}>
            <div className="mb-1 flex justify-between text-xs">
              <span>{c.type} Coverage</span>
              <span className="tabular-nums text-muted-foreground">{c.percent}%</span>
            </div>
            <Progress value={c.totalGroups === 0 ? 100 : c.percent} />
          </div>
        ))}
      </div>
    </div>
  );
}
