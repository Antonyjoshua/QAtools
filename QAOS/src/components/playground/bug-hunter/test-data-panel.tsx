import { Database } from "lucide-react";
import type { Mission } from "@/lib/playground/bug-hunter/types";

export function TestDataPanel({ mission }: { mission: Mission }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-sm">
      <div className="mb-1 flex items-center gap-1.5 font-medium">
        <Database className="size-4" /> Test Data
      </div>
      <ul className="space-y-0.5 text-muted-foreground">
        {mission.testData.map((d) => (
          <li key={d.label}>
            <span className="font-medium text-foreground">{d.label}:</span> {d.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
