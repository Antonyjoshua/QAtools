import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Challenge } from "@/lib/playground/manual-testing/types";

const DIFFICULTY_COLOR: Record<Challenge["difficulty"], string> = {
  Beginner: "bg-status-good/15 text-status-good border-status-good/30",
  Intermediate: "bg-status-warning/15 text-status-warning border-status-warning/30",
  Advanced: "bg-status-serious/15 text-status-serious border-status-serious/30",
  Expert: "bg-status-critical/15 text-status-critical border-status-critical/30",
};

export function ChallengeCard({ challenge, passed }: { challenge: Challenge; passed: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{challenge.title}</span>
          {passed && <CheckCircle2 className="size-4 text-status-good" />}
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className={DIFFICULTY_COLOR[challenge.difficulty]}>
            {challenge.difficulty}
          </Badge>
          <span>{challenge.xp} XP</span>
        </div>
      </div>
      <Button
        size="sm"
        variant={passed ? "outline" : "default"}
        nativeButton={false}
        render={
          <Link href={`/playground/manual-testing/challenges/${challenge.id}`}>{passed ? "Retry" : "Start"}</Link>
        }
      />
    </div>
  );
}
