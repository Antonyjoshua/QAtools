"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/solo/ui/dialog";
import { Button } from "@/components/solo/ui/button";
import { Input } from "@/components/solo/ui/input";
import { Label } from "@/components/solo/ui/label";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import type { QuestFrequency } from "@/lib/solo/types";
import { XP_REWARDS } from "@/lib/solo/constants";

export function AddCustomQuestDialog({ frequency }: { frequency: QuestFrequency }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [xp, setXp] = useState(String(XP_REWARDS.CUSTOM_QUEST_DEFAULT));
  const addCustomQuest = useAppStore((s) => s.addCustomQuest);

  function handleAdd() {
    if (!title.trim()) return;
    addCustomQuest({
      frequency,
      title: title.trim(),
      xp: Number(xp) || XP_REWARDS.CUSTOM_QUEST_DEFAULT,
    });
    setTitle("");
    setXp(String(XP_REWARDS.CUSTOM_QUEST_DEFAULT));
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-3.5 w-3.5" />
          Add Custom Quest
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="capitalize">New {frequency} quest</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="quest-title">Title</Label>
            <Input
              id="quest-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Refactor login test suite"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quest-xp">XP Reward</Label>
            <Input id="quest-xp" type="number" min={1} value={xp} onChange={(e) => setXp(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd}>Add Quest</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
