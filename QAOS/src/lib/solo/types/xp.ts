export interface XpLogEntry {
  id: string;
  date: string; // yyyy-mm-dd
  timestamp: number;
  amount: number;
  reason: string;
  category: XpCategory;
}

export type XpCategory =
  | "login"
  | "quest"
  | "mission"
  | "challenge"
  | "stat"
  | "skill"
  | "journal"
  | "certification"
  | "roadmap"
  | "achievement"
  | "manual";

export interface LevelInfo {
  level: number;
  title: string;
  rank: string;
  currentLevelXp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  totalXpForCurrentLevel: number;
  totalXpForNextLevel: number;
  progress: number; // 0-1
  isMaxLevel: boolean;
}
