"use client";

import { useAppStore } from "@/lib/solo/store/useAppStore";
import { JournalEntryForm } from "./components/journal-entry-form";
import { JournalEntryCard } from "./components/journal-entry-card";

export function JournalPage() {
  const entries = useAppStore((s) => s.journal);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Journal</h1>
        <p className="text-sm text-muted-foreground">Log learnings, mistakes, and wins day by day.</p>
      </div>
      <JournalEntryForm />
      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No entries yet. Write your first one above.</p>
        ) : (
          entries.map((entry) => <JournalEntryCard key={entry.id} entry={entry} />)
        )}
      </div>
    </div>
  );
}
