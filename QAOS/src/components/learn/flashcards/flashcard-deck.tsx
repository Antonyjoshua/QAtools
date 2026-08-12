"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { recordFlashcardReview } from "@/lib/learn/repo/flashcard-repo";
import { awardXp } from "@/lib/learn/gamification/award-xp";
import { XP_REWARDS } from "@/lib/learn/gamification/levels";
import { getModuleMeta } from "@/lib/learn/content/registry";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FlashcardSet } from "@/lib/learn/content/types";

const CONFIDENCE_OPTIONS: { value: "again" | "hard" | "good" | "easy"; label: string; className: string }[] = [
  { value: "again", label: "Again", className: "border-destructive/40 text-destructive hover:bg-destructive/10" },
  { value: "hard", label: "Hard", className: "border-amber-500/40 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400" },
  { value: "good", label: "Good", className: "border-primary/40 text-primary hover:bg-primary/10" },
  { value: "easy", label: "Easy", className: "border-success/40 text-success hover:bg-success/10" },
];

export function FlashcardDeck({ set }: { set: FlashcardSet }) {
  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const moduleMeta = getModuleMeta(set.moduleId);
  const card = set.cards[index];

  async function handleConfidence(confidence: "again" | "hard" | "good" | "easy") {
    await recordFlashcardReview(card.id, confidence);
    if (index + 1 >= set.cards.length) {
      await awardXp(XP_REWARDS.flashcardSetReviewed, `reviewed "${set.title}"`);
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  }

  function handleRestart() {
    setIndex(0);
    setFlipped(false);
    setDone(false);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href={`/learn/${set.moduleId}`} className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        {moduleMeta?.title ?? set.moduleId}
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">{set.title}</h1>

      {done ? (
        <div className="my-8 flex flex-col items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-8 text-center">
          <p className="text-lg font-semibold">Deck complete!</p>
          <p className="text-sm text-muted-foreground">You reviewed all {set.cards.length} cards.</p>
          <Button variant="outline" size="sm" className="mt-2 gap-1.5" onClick={handleRestart}>
            <RotateCcw className="size-3.5" />
            Review again
          </Button>
        </div>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted-foreground">
            Card {index + 1} of {set.cards.length}
          </p>

          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="mt-6 flex min-h-56 w-full items-center justify-center rounded-xl border border-border bg-card p-8 text-center transition-colors hover:border-primary/40"
          >
            <p className="text-lg leading-relaxed">{flipped ? card.back : card.front}</p>
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {flipped ? "Answer — click to flip back" : "Click the card to reveal the answer"}
          </p>

          {flipped && (
            <div className="mt-6 grid grid-cols-4 gap-2">
              {CONFIDENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => void handleConfidence(opt.value)}
                  className={cn("rounded-md border px-2 py-2 text-xs font-medium transition-colors", opt.className)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
