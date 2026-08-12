"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createSuite } from "@/lib/testcases/repo/suites-repo";

export function NewSuiteDialog({ projectId, folderId, disabled }: { projectId: string; folderId: string | null; disabled?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  async function handleCreate() {
    if (!name.trim() || !folderId) return;
    await createSuite(projectId, folderId, name.trim(), description.trim());
    setOpen(false);
    setName("");
    setDescription("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setOpen(true)} disabled={disabled}>
        <Plus className="size-3.5" />
        New Suite
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New test suite</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="suite-name">Name</Label>
            <Input id="suite-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Smoke Testing" autoFocus />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="suite-description">Description</Label>
            <Textarea id="suite-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Create suite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
