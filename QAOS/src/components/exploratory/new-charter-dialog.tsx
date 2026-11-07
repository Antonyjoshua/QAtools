"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createCharter } from "@/lib/exploratory/repo/charters-repo";
import type { Charter } from "@/lib/exploratory/types";

export function NewCharterDialog({ onCreated }: { onCreated?: (charter: Charter) => void }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [mission, setMission] = React.useState("");
  const [areaDraft, setAreaDraft] = React.useState("");
  const [areas, setAreas] = React.useState<string[]>([]);
  const [targetDurationMinutes, setTargetDurationMinutes] = React.useState(60);

  function addArea() {
    const value = areaDraft.trim();
    if (!value || areas.includes(value)) {
      setAreaDraft("");
      return;
    }
    setAreas([...areas, value]);
    setAreaDraft("");
  }

  function reset() {
    setTitle("");
    setMission("");
    setAreaDraft("");
    setAreas([]);
    setTargetDurationMinutes(60);
  }

  async function handleCreate() {
    if (!title.trim() || !mission.trim()) return;
    const charter = await createCharter({ title: title.trim(), mission: mission.trim(), areas, targetDurationMinutes });
    setOpen(false);
    reset();
    onCreated?.(charter);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        New Charter
      </Button>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New session charter</DialogTitle>
        </DialogHeader>
        <div className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto py-2 pr-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="charter-title">Title</Label>
            <Input id="charter-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Checkout edge cases" autoFocus />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="charter-mission">Mission</Label>
            <Textarea
              id="charter-mission"
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              rows={2}
              placeholder="Explore the checkout flow to discover edge cases using invalid coupon codes."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="charter-area">Areas to explore</Label>
            <div className="flex gap-1.5">
              <Input
                id="charter-area"
                value={areaDraft}
                onChange={(e) => setAreaDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addArea();
                  }
                }}
                placeholder="e.g. Coupon validation"
              />
              <Button type="button" variant="outline" onClick={addArea}>
                Add
              </Button>
            </div>
            {areas.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {areas.map((a) => (
                  <span key={a} className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                    {a}
                    <button type="button" onClick={() => setAreas(areas.filter((x) => x !== a))} aria-label={`Remove ${a}`}>
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="charter-duration">Target duration (minutes)</Label>
            <Input
              id="charter-duration"
              type="number"
              min={5}
              value={targetDurationMinutes}
              onChange={(e) => setTargetDurationMinutes(Number(e.target.value) || 60)}
              className="w-28"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim() || !mission.trim()}>
            Create charter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
