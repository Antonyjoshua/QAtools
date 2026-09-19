import { MissionCard } from "@/components/playground/bug-hunter/mission-card";
import { MISSIONS } from "@/lib/playground/bug-hunter/missions-seed";

export default function BugHunterPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold">🐞 Bug Hunter</h1>
        <p className="text-sm text-muted-foreground">
          Pick a mission and find as many real bugs in Brightbasket as you can.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {MISSIONS.map((m) => (
          <MissionCard key={m.id} mission={m} />
        ))}
      </div>
    </div>
  );
}
