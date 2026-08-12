import { db } from "../db";
import type { MockInterviewSession } from "../types";

export async function recordInterviewAnswer(questionId: string, userAnswer: string, selfRating: 1 | 2 | 3 | 4 | 5 | null): Promise<void> {
  await db.interviewAnswers.put({ questionId, userAnswer, selfRating, answeredAt: Date.now() });
}

export async function startMockSession(id: string, level: string, questionIds: string[]): Promise<void> {
  const session: MockInterviewSession = { id, level, questionIds, answers: {}, startedAt: Date.now(), completedAt: null };
  await db.mockSessions.add(session);
}

export async function updateMockSessionAnswers(id: string, answers: MockInterviewSession["answers"]): Promise<void> {
  await db.mockSessions.update(id, { answers });
}

export async function completeMockSession(id: string, answers: MockInterviewSession["answers"]): Promise<void> {
  await db.mockSessions.update(id, { answers, completedAt: Date.now() });
}
