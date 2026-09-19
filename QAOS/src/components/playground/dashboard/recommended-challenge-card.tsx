import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PlaygroundStats } from "@/lib/playground/gamification/types";

export function RecommendedChallengeCard({ stats }: { stats: PlaygroundStats }) {
  const bugHunterPct = stats.totalActiveBugs > 0 ? stats.bugsFound / stats.totalActiveBugs : 0;
  const manualPct = stats.totalChallenges > 0 ? stats.challengesPassed / stats.totalChallenges : 0;
  const testCaseLabPct = stats.bestCoveragePercentAny / 100;

  const candidates = [
    { label: "Hunt more bugs in Brightbasket", href: "/playground/bug-hunter", pct: bugHunterPct },
    { label: "Write more test cases in the Test Case Lab", href: "/playground/testcase-lab", pct: testCaseLabPct },
    { label: "Take on a Manual Testing challenge", href: "/playground/manual-testing", pct: manualPct },
  ];
  const weakest = candidates.reduce((a, b) => (b.pct < a.pct ? b : a));

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-1 text-sm font-semibold">Recommended Next</h3>
      <p className="mb-3 text-sm text-muted-foreground">
        Your weakest area right now — a good place to focus next.
      </p>
      <Button nativeButton={false} render={<Link href={weakest.href}>{weakest.label}</Link>} />
    </div>
  );
}
