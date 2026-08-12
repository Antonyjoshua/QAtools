export type QuestFrequency = "daily" | "weekly" | "monthly";

export interface QuestTemplate {
  id: string;
  frequency: QuestFrequency;
  title: string;
  description: string;
  xp: number;
  skillId?: string;
  statKey?: string;
}

export interface CustomQuest {
  id: string;
  frequency: QuestFrequency;
  title: string;
  xp: number;
  createdAt: number;
  periodKey: string; // date/week/month key it belongs to
}
