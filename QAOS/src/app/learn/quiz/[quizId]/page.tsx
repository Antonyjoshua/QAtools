import { notFound } from "next/navigation";
import { getQuiz } from "@/lib/learn/content/registry";
import { QuizRunner } from "@/components/learn/quiz/quiz-runner";

export default async function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const quiz = getQuiz(quizId);
  if (!quiz) notFound();

  return <QuizRunner quiz={quiz} />;
}
