import { notFound } from "next/navigation";
import { getFlashcardSet } from "@/lib/learn/content/registry";
import { FlashcardDeck } from "@/components/learn/flashcards/flashcard-deck";

export default async function FlashcardsPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = await params;
  const set = getFlashcardSet(setId);
  if (!set) notFound();

  return <FlashcardDeck set={set} />;
}
