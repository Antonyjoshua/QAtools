import { Monitor } from "lucide-react";
import type { Mission } from "@/lib/playground/bug-hunter/types";

export function EnvironmentPanel({ mission }: { mission: Mission }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-sm">
      <div className="mb-1 flex items-center gap-1.5 font-medium">
        <Monitor className="size-4" /> Environment
      </div>
      <p className="text-muted-foreground">{mission.environment}</p>
      <p className="text-muted-foreground">{mission.browser}</p>
    </div>
  );
}
