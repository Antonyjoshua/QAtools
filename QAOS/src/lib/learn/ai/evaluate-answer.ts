export interface AnswerFeedback {
  feedback: string;
  suggestedRating: 1 | 2 | 3 | 4 | 5;
}

/**
 * Placeholder for AI-graded interview answers. Swap the body for a real model call (Claude/OpenAI/
 * etc.) later — the signature, call sites (Mock Interview mode), and UI around it are already in
 * place, so wiring in a real model is a one-function change, not a feature rebuild.
 */
export async function evaluateAnswer(_question: string, userAnswer: string): Promise<AnswerFeedback> {
  const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount === 0) {
    return { feedback: "You didn't write an answer yet — try explaining it in your own words before checking the model answer.", suggestedRating: 1 };
  }
  if (wordCount < 15) {
    return { feedback: "Your answer is quite brief. Compare it with the model answer below — did you cover the key reasoning, or just the conclusion?", suggestedRating: 3 };
  }
  return { feedback: "Good length and detail. Compare against the model answer below to check you covered the same key points.", suggestedRating: 4 };
}
