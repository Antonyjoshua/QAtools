"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { getChallengeById } from "@/lib/playground/manual-testing/challenges-seed";
import { ChallengeShell } from "@/components/playground/manual-testing/challenge-shell";
import { BvaMechanic } from "@/components/playground/manual-testing/mechanics/bva-mechanic";
import { EpMechanic } from "@/components/playground/manual-testing/mechanics/ep-mechanic";
import { DecisionTableMechanic } from "@/components/playground/manual-testing/mechanics/decision-table-mechanic";
import { StateTransitionMechanic } from "@/components/playground/manual-testing/mechanics/state-transition-mechanic";
import { ErrorGuessingMechanic } from "@/components/playground/manual-testing/mechanics/error-guessing-mechanic";
import { ScenarioMechanic } from "@/components/playground/manual-testing/mechanics/scenario-mechanic";

export default function ChallengeWorkspacePage({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}) {
  const { challengeId } = use(params);
  const challenge = getChallengeById(challengeId);

  if (!challenge) return notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-xl font-bold">{challenge.title}</h1>
        <p className="text-sm text-muted-foreground">
          {challenge.technique} · {challenge.difficulty} · {challenge.xp} XP
        </p>
      </div>
      <ChallengeShell challenge={challenge}>
        {({ onSubmit, submitted }) => {
          switch (challenge.mechanic) {
            case "bva":
              return <BvaMechanic challenge={challenge} onSubmit={onSubmit} submitted={submitted} />;
            case "equivalence-partitioning":
              return <EpMechanic challenge={challenge} onSubmit={onSubmit} submitted={submitted} />;
            case "decision-table":
              return (
                <DecisionTableMechanic challenge={challenge} onSubmit={onSubmit} submitted={submitted} />
              );
            case "state-transition":
              return (
                <StateTransitionMechanic challenge={challenge} onSubmit={onSubmit} submitted={submitted} />
              );
            case "error-guessing":
              return (
                <ErrorGuessingMechanic challenge={challenge} onSubmit={onSubmit} submitted={submitted} />
              );
            case "scenario":
              return <ScenarioMechanic challenge={challenge} onSubmit={onSubmit} submitted={submitted} />;
            default:
              return null;
          }
        }}
      </ChallengeShell>
    </div>
  );
}
