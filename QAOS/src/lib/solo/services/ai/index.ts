/**
 * AI service layer — intentionally empty of real model calls.
 *
 * Every future AI module (career coach, skill-gap analysis, quest generation,
 * interview coach, resume review, bug/test-case review, learning recommendations,
 * weekly summaries, personalized roadmaps) plugs in here behind `AiModuleResult`
 * without any other layer (modules/, components/, store/) needing to change shape.
 */

export interface AiModuleResult<T = string> {
  available: boolean;
  message: string;
  data?: T;
}

function notConfigured<T>(moduleName: string): Promise<AiModuleResult<T>> {
  return Promise.resolve({
    available: false,
    message: `${moduleName} isn't connected yet. This slot is wired up and ready for a future AI provider.`,
  });
}

export function getCareerCoachAdvice(): Promise<AiModuleResult> {
  return notConfigured("AI Career Coach");
}

export function analyzeSkillGaps(): Promise<AiModuleResult> {
  return notConfigured("AI Skill Gap Analysis");
}

export function generateDailyQuests(): Promise<AiModuleResult> {
  return notConfigured("AI Daily Quest Generator");
}

export function getInterviewCoachFeedback(): Promise<AiModuleResult> {
  return notConfigured("AI Interview Coach");
}

export function reviewResume(): Promise<AiModuleResult> {
  return notConfigured("AI Resume Review");
}

export function reviewBugReport(): Promise<AiModuleResult> {
  return notConfigured("AI Bug Report Review");
}

export function reviewTestCase(): Promise<AiModuleResult> {
  return notConfigured("AI Test Case Review");
}

export function getLearningRecommendations(): Promise<AiModuleResult> {
  return notConfigured("AI Learning Recommendations");
}

export function getWeeklyProgressSummary(): Promise<AiModuleResult> {
  return notConfigured("AI Weekly Progress Summary");
}

export function getPersonalizedRoadmap(): Promise<AiModuleResult> {
  return notConfigured("AI Personalized Roadmap");
}

export const AI_MODULES = [
  { id: "career-coach", name: "AI Career Coach", run: getCareerCoachAdvice },
  { id: "skill-gap", name: "AI Skill Gap Analysis", run: analyzeSkillGaps },
  { id: "quest-generator", name: "AI Daily Quest Generator", run: generateDailyQuests },
  { id: "interview-coach", name: "AI Interview Coach", run: getInterviewCoachFeedback },
  { id: "resume-review", name: "AI Resume Review", run: reviewResume },
  { id: "bug-review", name: "AI Bug Report Review", run: reviewBugReport },
  { id: "test-case-review", name: "AI Test Case Review", run: reviewTestCase },
  { id: "learning-recs", name: "AI Learning Recommendations", run: getLearningRecommendations },
  { id: "weekly-summary", name: "AI Weekly Progress Summary", run: getWeeklyProgressSummary },
  { id: "personalized-roadmap", name: "AI Personalized Roadmap", run: getPersonalizedRoadmap },
] as const;
