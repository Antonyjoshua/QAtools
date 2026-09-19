export interface XpLogEntry {
  id: string;
  amount: number;
  reason?: string;
  at: string;
}

export interface StreakState {
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

export interface LevelBreakpoint {
  level: number;
  title: string;
}

export interface LevelInfo {
  level: number;
  title: string;
  xpIntoLevel: number;
  xpForNextLevel: number;
  totalXp: number;
  progress: number;
}

export interface PlaygroundStats {
  bugsFound: number;
  totalActiveBugs: number;
  testCasesCreated: number;
  bestCoveragePercentAny: number;
  challengesPassed: number;
  totalChallenges: number;
  streak: number;
  level: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: (stats: PlaygroundStats) => boolean;
}
