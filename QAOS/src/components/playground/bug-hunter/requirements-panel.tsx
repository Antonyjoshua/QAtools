import { FileText } from "lucide-react";
import type { Mission } from "@/lib/playground/bug-hunter/types";

export function RequirementsPanel({ mission }: { mission: Mission }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-sm">
      <div className="mb-1 flex items-center gap-1.5 font-medium">
        <FileText className="size-4" /> User Story &amp; Acceptance Criteria
      </div>
      <p className="text-muted-foreground">{mission.userStory}</p>
      <ul className="mt-2 list-disc space-y-0.5 pl-4 text-muted-foreground">
        {mission.acceptanceCriteria.map((ac) => (
          <li key={ac}>{ac}</li>
        ))}
      </ul>
    </div>
  );
}
