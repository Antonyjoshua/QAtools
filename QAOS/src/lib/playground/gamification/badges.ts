import type { Badge } from "./types";

export const BADGES: Badge[] = [
  {
    id: "first-bug-found",
    title: "First Catch",
    description: "Find your first bug.",
    icon: "Bug",
    isUnlocked: (s) => s.bugsFound >= 1,
  },
  {
    id: "bug-hunter-10",
    title: "Bug Hunter",
    description: "Find 10 bugs.",
    icon: "Crosshair",
    isUnlocked: (s) => s.bugsFound >= 10,
  },
  {
    id: "bug-exterminator",
    title: "Bug Exterminator",
    description: "Find every canonical bug in Brightbasket.",
    icon: "Skull",
    isUnlocked: (s) => s.totalActiveBugs > 0 && s.bugsFound >= s.totalActiveBugs,
  },
  {
    id: "testcase-author-10",
    title: "Test Case Author",
    description: "Write 10 test cases.",
    icon: "FileText",
    isUnlocked: (s) => s.testCasesCreated >= 10,
  },
  {
    id: "coverage-master",
    title: "Coverage Master",
    description: "Reach 100% coverage on a requirement.",
    icon: "Target",
    isUnlocked: (s) => s.bestCoveragePercentAny >= 100,
  },
  {
    id: "challenge-climber-10",
    title: "Challenge Climber",
    description: "Pass 10 Manual Testing challenges.",
    icon: "TrendingUp",
    isUnlocked: (s) => s.challengesPassed >= 10,
  },
  {
    id: "manual-testing-master",
    title: "Manual Testing Master",
    description: "Pass every Manual Testing challenge.",
    icon: "GraduationCap",
    isUnlocked: (s) => s.totalChallenges > 0 && s.challengesPassed >= s.totalChallenges,
  },
  {
    id: "streak-3",
    title: "Getting Consistent",
    description: "Reach a 3-day streak.",
    icon: "Flame",
    isUnlocked: (s) => s.streak >= 3,
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Reach a 7-day streak.",
    icon: "Flame",
    isUnlocked: (s) => s.streak >= 7,
  },
  {
    id: "level-10",
    title: "Rising Engineer",
    description: "Reach level 10.",
    icon: "Rocket",
    isUnlocked: (s) => s.level >= 10,
  },
];
