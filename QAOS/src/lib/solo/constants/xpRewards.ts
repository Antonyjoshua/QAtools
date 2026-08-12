/** Central XP reward table — every rewarded action in the app resolves through here. */
export const XP_REWARDS = {
  LOGIN: 5,
  COMPLETE_DAILY_GOAL: 20,
  REPORT_BUG: 25,
  COMPLETE_AUTOMATION_TASK: 50,
  FINISH_COURSE: 100,
  READ_QA_NOTES: 15,
  SOLVE_SQL_CHALLENGE: 10,
  COMPLETE_MOCK_INTERVIEW: 80,

  WRITE_TEST_CASE: 8,
  WRITE_AUTOMATION_SCRIPT: 30,
  TEST_API: 12,
  COMPLETE_PROJECT: 60,
  INTERVIEW_QUESTION_SOLVED: 6,

  JOURNAL_ENTRY: 10,
  CERTIFICATION_COMPLETE: 100,
  CERTIFICATION_PROGRESS: 20,
  ROADMAP_MILESTONE: 40,
  SKILL_PRACTICE: 10,

  DAILY_QUEST_DEFAULT: 20,
  WEEKLY_MISSION_DEFAULT: 100,
  MONTHLY_CHALLENGE_DEFAULT: 300,
  CUSTOM_QUEST_DEFAULT: 15,

  ALL_DAILY_QUESTS_BONUS: 20,
} as const;

export type XpRewardKey = keyof typeof XP_REWARDS;

export const STAT_XP_MAP: Record<string, { xp: number; label: string }> = {
  bugsReported: { xp: XP_REWARDS.REPORT_BUG, label: "Report Bug" },
  testCasesWritten: { xp: XP_REWARDS.WRITE_TEST_CASE, label: "Write Test Case" },
  automationScripts: { xp: XP_REWARDS.WRITE_AUTOMATION_SCRIPT, label: "Write Automation Script" },
  apisTested: { xp: XP_REWARDS.TEST_API, label: "Test API" },
  projects: { xp: XP_REWARDS.COMPLETE_PROJECT, label: "Complete Project" },
  coursesCompleted: { xp: XP_REWARDS.FINISH_COURSE, label: "Finish Course" },
  interviewQuestionsSolved: { xp: XP_REWARDS.INTERVIEW_QUESTION_SOLVED, label: "Solve Interview Question" },
  sqlChallengesSolved: { xp: XP_REWARDS.SOLVE_SQL_CHALLENGE, label: "Solve SQL Challenge" },
};
