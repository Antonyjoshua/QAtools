import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Requirement } from "@/lib/playground/testcase-lab/types";

const DIFFICULTY_COLOR: Record<Requirement["difficulty"], string> = {
  Beginner: "bg-status-good/15 text-status-good border-status-good/30",
  Intermediate: "bg-status-warning/15 text-status-warning border-status-warning/30",
  Advanced: "bg-status-serious/15 text-status-serious border-status-serious/30",
  Expert: "bg-status-critical/15 text-status-critical border-status-critical/30",
};

export function RequirementCard({ requirement }: { requirement: Requirement }) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold">{requirement.title}</h3>
          <Badge variant="outline" className={DIFFICULTY_COLOR[requirement.difficulty]}>
            {requirement.difficulty}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{requirement.statement}</p>
      </div>
      <Button
        className="mt-3"
        nativeButton={false}
        render={<Link href={`/playground/testcase-lab/requirements/${requirement.id}`}>Write Test Cases</Link>}
      />
    </div>
  );
}
