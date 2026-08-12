export const MAX_LEVEL = 100;

/** XP required to advance FROM `level` TO `level + 1`. */
export function xpToNextLevel(level: number): number {
  return 100 + (level - 1) * 125;
}

export interface LevelBreakpoint {
  level: number;
  title: string;
  rank: string;
}

/** Career title + Hunter-rank flavor, unlocked at these level breakpoints. */
export const LEVEL_BREAKPOINTS: LevelBreakpoint[] = [
  { level: 1, title: "QA Trainee", rank: "E-Rank Hunter" },
  { level: 10, title: "Junior QA", rank: "D-Rank Hunter" },
  { level: 20, title: "QA Engineer", rank: "C-Rank Hunter" },
  { level: 30, title: "Senior QA", rank: "B-Rank Hunter" },
  { level: 40, title: "Automation Engineer", rank: "A-Rank Hunter" },
  { level: 50, title: "QA Lead", rank: "S-Rank Hunter" },
  { level: 75, title: "QA Architect", rank: "National Level Hunter" },
  { level: 100, title: "Legendary QA Hunter", rank: "Monarch" },
];

export function getBreakpointForLevel(level: number): LevelBreakpoint {
  let current = LEVEL_BREAKPOINTS[0];
  for (const bp of LEVEL_BREAKPOINTS) {
    if (level >= bp.level) current = bp;
  }
  return current;
}

export function getNextBreakpoint(level: number): LevelBreakpoint | null {
  return LEVEL_BREAKPOINTS.find((bp) => bp.level > level) ?? null;
}
