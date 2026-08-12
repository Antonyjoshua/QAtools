export interface ProfileStats {
  bugsReported: number;
  testCasesWritten: number;
  automationScripts: number;
  apisTested: number;
  certifications: number;
  projects: number;
  coursesCompleted: number;
  interviewQuestionsSolved: number;
  sqlChallengesSolved: number;
}

export interface UserProfile {
  username: string;
  avatar: string; // emoji or icon key
  badge: string; // equipped title id
  bio: string;
  careerGoal: string;
  company: string;
  yearsExperience: number;
  stats: ProfileStats;
}

export const DEFAULT_PROFILE_STATS: ProfileStats = {
  bugsReported: 0,
  testCasesWritten: 0,
  automationScripts: 0,
  apisTested: 0,
  certifications: 0,
  projects: 0,
  coursesCompleted: 0,
  interviewQuestionsSolved: 0,
  sqlChallengesSolved: 0,
};

export const DEFAULT_PROFILE: UserProfile = {
  username: "New Hunter",
  avatar: "🧑‍💻",
  badge: "title-qa-trainee",
  bio: "Rising through the ranks, one test case at a time.",
  careerGoal: "Become a QA Architect",
  company: "",
  yearsExperience: 0,
  stats: DEFAULT_PROFILE_STATS,
};
