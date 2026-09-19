"use client";

import { CHALLENGES, TECHNIQUES } from "@/lib/playground/manual-testing/challenges-seed";
import { ChallengeCard } from "@/components/playground/manual-testing/challenge-card";
import { usePassedChallengeIds } from "@/lib/playground/manual-testing/hooks/use-attempts";

export default function ManualTestingPage() {
  const passedIds = usePassedChallengeIds();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">🧪 Manual Testing Playground</h1>
        <p className="text-sm text-muted-foreground">
          {CHALLENGES.length} challenges across {TECHNIQUES.length} testing techniques.
        </p>
      </div>
      {TECHNIQUES.map((technique) => (
        <div key={technique}>
          <h2 className="mb-2 font-semibold">{technique}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {CHALLENGES.filter((c) => c.technique === technique).map((c) => (
              <ChallengeCard key={c.id} challenge={c} passed={passedIds.has(c.id)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
