import Link from "next/link";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Mission } from "@/lib/playground/bug-hunter/types";

const DIFFICULTY_COLOR: Record<Mission["difficulty"], string> = {
  Beginner: "bg-status-good/15 text-status-good border-status-good/30",
  Intermediate: "bg-status-warning/15 text-status-warning border-status-warning/30",
  Advanced: "bg-status-serious/15 text-status-serious border-status-serious/30",
  Expert: "bg-status-critical/15 text-status-critical border-status-critical/30",
};

export function MissionCard({ mission }: { mission: Mission }) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold">{mission.title}</h3>
          <Badge variant="outline" className={DIFFICULTY_COLOR[mission.difficulty]}>
            {mission.difficulty}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{mission.userStory}</p>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3.5" /> {mission.timeLimitMinutes} min · {mission.scope.join(", ")}
        </div>
      </div>
      <Button
        className="mt-3"
        nativeButton={false}
        render={<Link href={`/playground/bug-hunter/missions/${mission.id}`}>Start Mission</Link>}
      />
    </div>
  );
}
