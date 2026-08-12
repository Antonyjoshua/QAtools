"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/solo/ui/card";
import { Textarea } from "@/components/solo/ui/textarea";
import { Label } from "@/components/solo/ui/label";
import { Button } from "@/components/solo/ui/button";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { XP_REWARDS } from "@/lib/solo/constants";

const FIELDS: { key: keyof FormState; label: string; placeholder: string }[] = [
  { key: "learning", label: "Today's Learning", placeholder: "What did you learn today?" },
  { key: "challenges", label: "Today's Challenges", placeholder: "What was hard today?" },
  { key: "mistakes", label: "Mistakes", placeholder: "What went wrong?" },
  { key: "lessons", label: "Lessons Learned", placeholder: "What will you do differently?" },
  { key: "goals", label: "Goals", placeholder: "What's next?" },
  { key: "wins", label: "Wins", placeholder: "What went well?" },
];

interface FormState {
  learning: string;
  challenges: string;
  mistakes: string;
  lessons: string;
  goals: string;
  wins: string;
}

const EMPTY: FormState = { learning: "", challenges: "", mistakes: "", lessons: "", goals: "", wins: "" };

export function JournalEntryForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const addJournalEntry = useAppStore((s) => s.addJournalEntry);

  const hasContent = Object.values(form).some((v) => v.trim().length > 0);

  function handleSubmit() {
    if (!hasContent) return;
    addJournalEntry(form);
    setForm(EMPTY);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Journal Entry</CardTitle>
        <CardDescription>Reflect on today — earn +{XP_REWARDS.JOURNAL_ENTRY} XP.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Textarea
              id={field.key}
              rows={2}
              placeholder={field.placeholder}
              value={form[field.key]}
              onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
            />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={!hasContent}>
          Save Entry
        </Button>
      </CardFooter>
    </Card>
  );
}
