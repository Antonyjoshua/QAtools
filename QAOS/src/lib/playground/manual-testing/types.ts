export type ChallengeDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";

interface ChallengeCommon {
  id: string;
  title: string;
  technique: string;
  difficulty: ChallengeDifficulty;
  xp: number;
  prompt: string;
  hints: [string, string, string];
  explanation: string;
  whyItMatters: string;
  commonMistakes: string;
}

export interface BvaChallenge extends ChallengeCommon {
  mechanic: "bva";
  fieldLabel: string;
  min: number;
  max: number;
}

export interface EpItem {
  id: string;
  label: string;
  correctValid: boolean;
}

export interface EpChallenge extends ChallengeCommon {
  mechanic: "equivalence-partitioning";
  items: EpItem[];
}

export interface DecisionTableRule {
  id: string;
  conditions: Record<string, boolean>;
  action: string;
}

export interface DecisionTableChallenge extends ChallengeCommon {
  mechanic: "decision-table";
  conditionLabels: string[];
  actionOptions: string[];
  rules: DecisionTableRule[];
}

export interface TransitionPair {
  id: string;
  from: string;
  to: string;
  expectedValid: boolean;
}

export interface StateTransitionChallenge extends ChallengeCommon {
  mechanic: "state-transition";
  states: string[];
  diagramDescription: string;
  transitions: TransitionPair[];
}

export interface ErrorGuessingChallenge extends ChallengeCommon {
  mechanic: "error-guessing";
  context: string;
  keywordGroups: string[][];
}

export interface ScenarioOption {
  id: string;
  label: string;
  correct: boolean;
}

export interface ScenarioMultiSelectChallenge extends ChallengeCommon {
  mechanic: "scenario";
  mode: "multi-select";
  options: ScenarioOption[];
}

export interface ScenarioShortAnswerChallenge extends ChallengeCommon {
  mechanic: "scenario";
  mode: "short-answer";
  keywordGroups: string[][];
}

export type ScenarioChallenge = ScenarioMultiSelectChallenge | ScenarioShortAnswerChallenge;

export type Challenge =
  | BvaChallenge
  | EpChallenge
  | DecisionTableChallenge
  | StateTransitionChallenge
  | ErrorGuessingChallenge
  | ScenarioChallenge;

export interface ChallengeAttempt {
  id: string;
  challengeId: string;
  mechanic: Challenge["mechanic"];
  technique: string;
  score: number;
  passed: boolean;
  xpAwarded: number;
  attemptedAt: string;
}
