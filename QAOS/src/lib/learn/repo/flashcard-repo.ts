import { db } from "../db";
import type { FlashcardReview } from "../types";

export async function recordFlashcardReview(cardId: string, confidence: FlashcardReview["confidence"]): Promise<void> {
  const existing = await db.flashcardReviews.get(cardId);
  await db.flashcardReviews.put({
    cardId,
    confidence,
    reviewCount: (existing?.reviewCount ?? 0) + 1,
    lastReviewedAt: Date.now(),
  });
}
