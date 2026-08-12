"use client";

import { Trash2 } from "lucide-react";
import { Card } from "@/components/solo/ui/card";
import { Button } from "@/components/solo/ui/button";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { formatDisplayDate } from "@/lib/solo/utils/date";
import type { JournalEntry } from "@/lib/solo/types";

const SECTIONS: { key: keyof JournalEntry; label: string; emoji: string }[] = [
  { key: "learning", label: "Learning", emoji: "📘" },
  { key: "challenges", label: "Challenges", emoji: "🧩" },
  { key: "mistakes", label: "Mistakes", emoji: "⚠️" },
  { key: "lessons", label: "Lessons", emoji: "💡" },
  { key: "goals", label: "Goals", emoji: "🎯" },
  { key: "wins", label: "Wins", emoji: "🏆" },
];

export function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const removeJournalEntry = useAppStore((s) => s.removeJournalEntry);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {formatDisplayDate(entry.date)}
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeJournalEntry(entry.id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SECTIONS.filter((s) => String(entry[s.key]).trim().length > 0).map((section) => (
          <div key={section.key} className="text-sm">
            <div className="text-xs font-medium text-[var(--accent)] mb-0.5">
              {section.emoji} {section.label}
            </div>
            <p className="text-foreground/80 whitespace-pre-wrap">{String(entry[section.key])}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
