import type { QuestTemplate } from "@/lib/solo/types";
import { XP_REWARDS } from "./xpRewards";

export const DAILY_QUEST_TEMPLATES: QuestTemplate[] = [
  { id: "d-write-5-test-cases", frequency: "daily", title: "Write 5 Test Cases", description: "Draft five new test cases for any feature you're covering.", xp: 25, skillId: "manual-testing" },
  { id: "d-report-2-bugs", frequency: "daily", title: "Report 2 Bugs", description: "File two clear, reproducible bug reports.", xp: 40, skillId: "manual-testing", statKey: "bugsReported" },
  { id: "d-solve-10-sql", frequency: "daily", title: "Solve 10 SQL Queries", description: "Practice ten SQL query challenges.", xp: 20, skillId: "sql" },
  { id: "d-read-20-min", frequency: "daily", title: "Read 20 Minutes", description: "Read QA notes, docs, or a testing book for 20 minutes.", xp: XP_REWARDS.READ_QA_NOTES },
  { id: "d-automation-exercise", frequency: "daily", title: "Complete 1 Automation Exercise", description: "Finish one hands-on automation exercise.", xp: 30, skillId: "automation" },
  { id: "d-watch-qa-content", frequency: "daily", title: "Watch 30 Minutes of QA Content", description: "Watch a tutorial, talk, or course video.", xp: 15 },
  { id: "d-practice-api", frequency: "daily", title: "Practice API Testing", description: "Test or explore an API endpoint.", xp: 20, skillId: "api-testing", statKey: "apisTested" },
];

export const WEEKLY_MISSION_TEMPLATES: QuestTemplate[] = [
  { id: "w-playwright-chapter", frequency: "weekly", title: "Finish Playwright Chapter", description: "Complete one chapter/module of a Playwright course.", xp: 100, skillId: "playwright" },
  { id: "w-regression-checklist", frequency: "weekly", title: "Complete Regression Checklist", description: "Run through a full regression checklist.", xp: 90, skillId: "manual-testing" },
  { id: "w-interview-questions", frequency: "weekly", title: "Practice 50 Interview Questions", description: "Work through fifty interview prep questions.", xp: 120 },
  { id: "w-read-book", frequency: "weekly", title: "Read Testing Book", description: "Finish a chunk of a testing book this week.", xp: 80 },
  { id: "w-api-project", frequency: "weekly", title: "Complete API Project", description: "Ship a small API testing project.", xp: 130, skillId: "api-testing" },
];

export const MONTHLY_CHALLENGE_TEMPLATES: QuestTemplate[] = [
  { id: "m-selenium-course", frequency: "monthly", title: "Complete Selenium Course", description: "Finish an entire Selenium course.", xp: 300, skillId: "selenium" },
  { id: "m-automation-framework", frequency: "monthly", title: "Create Automation Framework", description: "Build an automation framework from scratch.", xp: 350, skillId: "automation" },
  { id: "m-earn-certification", frequency: "monthly", title: "Earn Certification", description: "Complete and earn a QA certification.", xp: 300 },
  { id: "m-write-100-test-cases", frequency: "monthly", title: "Write 100 Test Cases", description: "Author one hundred test cases this month.", xp: 250, skillId: "manual-testing" },
  { id: "m-report-50-bugs", frequency: "monthly", title: "Report 50 Bugs", description: "File fifty bug reports this month.", xp: 250, skillId: "manual-testing" },
];

export const QUEST_TEMPLATES_BY_FREQUENCY = {
  daily: DAILY_QUEST_TEMPLATES,
  weekly: WEEKLY_MISSION_TEMPLATES,
  monthly: MONTHLY_CHALLENGE_TEMPLATES,
};
