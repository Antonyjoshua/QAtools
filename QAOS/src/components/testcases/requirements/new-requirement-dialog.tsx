"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createRequirement, updateRequirement } from "@/lib/testcases/repo/requirements-repo";
import type { Requirement } from "@/lib/testcases/types";

interface NewRequirementDialogProps {
  projectId: string;
  /** When provided, the dialog edits this requirement instead of creating a new one. */
  requirement?: Requirement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSaved?: (requirement: Requirement) => void;
  /** Hide the built-in trigger button — used when opened externally (e.g. from the test case form). */
  hideTrigger?: boolean;
}

export function NewRequirementDialog({ projectId, requirement, open: controlledOpen, onOpenChange, onSaved, hideTrigger }: NewRequirementDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [code, setCode] = React.useState(requirement?.requirementId ?? "");
  const [title, setTitle] = React.useState(requirement?.title ?? "");
  const [description, setDescription] = React.useState(requirement?.description ?? "");
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset form fields from `requirement` each time the dialog opens
      setCode(requirement?.requirementId ?? "");
      setTitle(requirement?.title ?? "");
      setDescription(requirement?.description ?? "");
      setError(null);
    }
  }, [open, requirement]);

  async function handleSave() {
    const trimmedCode = code.trim();
    const trimmedTitle = title.trim();
    if (!trimmedCode || !trimmedTitle) return;

    setSaving(true);
    setError(null);
    try {
      let saved: Requirement;
      if (requirement) {
        await updateRequirement(requirement.id, { requirementId: trimmedCode, title: trimmedTitle, description: description.trim() });
        saved = { ...requirement, requirementId: trimmedCode, title: trimmedTitle, description: description.trim() };
      } else {
        saved = await createRequirement(projectId, trimmedCode, trimmedTitle, description.trim());
      }
      setOpen(false);
      onSaved?.(saved);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save requirement");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setOpen(true)}>
          <Plus className="size-3.5" />
          New Requirement
        </Button>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{requirement ? "Edit requirement" : "New requirement"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="req-code">Requirement ID</Label>
            <Input id="req-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. REQ-101" autoFocus />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="req-title">Title</Label>
            <Input id="req-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. User can reset password" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="req-description">Description</Label>
            <Textarea id="req-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!code.trim() || !title.trim() || saving}>
            {requirement ? "Save changes" : "Create requirement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
