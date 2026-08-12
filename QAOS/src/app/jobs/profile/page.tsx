"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Sparkles, X } from "lucide-react";
import { db } from "@/lib/jobs/db";
import { updateProfile } from "@/lib/jobs/repo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QA_CATEGORIES, type QACategory } from "@/lib/jobs/types";

function TagInput({ values, onChange, placeholder }: { values: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [draft, setDraft] = React.useState("");
  function add() {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft("");
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" onClick={add}>
          Add
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v) => (
            <Badge key={v} variant="secondary" className="gap-1">
              {v}
              <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} aria-label={`Remove ${v}`}>
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export default function JobProfilePage() {
  const profile = useLiveQuery(() => db.profile.get("local-user"), []);

  if (!profile) {
    return <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Job Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">These preferences power personalized matching once AI matching ships.</p>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
        <div className="flex items-start gap-2 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
          <Sparkles className="mt-0.5 size-3.5 shrink-0" />
          Nothing here is used for matching yet — AI job matching, resume-to-job matching, and skill-gap analysis are on the roadmap (see the future-AI
          service interfaces already scaffolded for them). For now this is just where your preferences live.
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Years of experience</Label>
            <Input
              type="number"
              min={0}
              value={profile.experienceYears ?? ""}
              onChange={(e) => updateProfile({ experienceYears: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Notice period (days)</Label>
            <Input
              type="number"
              min={0}
              value={profile.noticePeriodDays ?? ""}
              onChange={(e) => updateProfile({ noticePeriodDays: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Remote preference</Label>
          <Select value={profile.remotePreference} onValueChange={(v) => v !== null && updateProfile({ remotePreference: v as typeof profile.remotePreference })}>
            <SelectTrigger className="w-56">
              <SelectValue>
                {(v: string) =>
                  ({ any: "No preference", remote: "Remote only", hybrid: "Hybrid", onsite: "On-site" })[v] ?? v
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">No preference</SelectItem>
              <SelectItem value="remote">Remote only</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="onsite">On-site</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Expected salary (min)</Label>
            <Input
              type="number"
              min={0}
              value={profile.expectedSalaryMin ?? ""}
              onChange={(e) => updateProfile({ expectedSalaryMin: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Currency</Label>
            <Select value={profile.expectedSalaryCurrency ?? "INR"} onValueChange={(v) => v !== null && updateProfile({ expectedSalaryCurrency: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Skills</Label>
          <TagInput values={profile.skills} onChange={(v) => updateProfile({ skills: v })} placeholder="e.g. Playwright" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Preferred technologies</Label>
          <TagInput values={profile.preferredTechnologies} onChange={(v) => updateProfile({ preferredTechnologies: v })} placeholder="e.g. TypeScript" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Preferred locations</Label>
          <TagInput values={profile.preferredLocations} onChange={(v) => updateProfile({ preferredLocations: v })} placeholder="e.g. Bangalore" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Preferred roles</Label>
          <div className="flex flex-wrap gap-1.5">
            {QA_CATEGORIES.map((c: QACategory) => {
              const active = profile.preferredRoles.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    updateProfile({ preferredRoles: active ? profile.preferredRoles.filter((r) => r !== c) : [...profile.preferredRoles, c] })
                  }
                >
                  <Badge variant={active ? "default" : "outline"} className="cursor-pointer font-normal">
                    {c}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
