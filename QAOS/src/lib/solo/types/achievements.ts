export type AchievementCondition =
  | { type: "stat"; statKey: string; target: number }
  | { type: "streak"; target: number }
  | { type: "level"; target: number }
  | { type: "questsCompleted"; target: number }
  | { type: "skillLevel"; skillId: string; target: number }
  | { type: "journalEntries"; target: number }
  | { type: "certifications"; target: number };

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  condition: AchievementCondition;
}
