import { db } from "../db";
import { uid } from "../id";
import type { QuizAttempt } from "../types";

export async function submitQuizAttempt(quizId: string, answers: Record<string, number>, score: number, total: number): Promise<QuizAttempt> {
  const attempt: QuizAttempt = { id: uid(), quizId, score, total, answers, takenAt: Date.now() };
  await db.quizAttempts.add(attempt);
  return attempt;
}
