"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createFolder } from "@/lib/testcases/repo/folders-repo";

export function NewFolderDialog({ projectId, onCreated }: { projectId: string; onCreated?: (folderId: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  async function handleCreate() {
    if (!name.trim()) return;
    const folder = await createFolder(projectId, name.trim(), null);
    setOpen(false);
    setName("");
    onCreated?.(folder.id);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={() => setOpen(true)}>
        <Plus className="size-3.5" />
        New Folder
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New folder</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1.5 py-2">
          <Label htmlFor="folder-name">Name</Label>
          <Input
            id="folder-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Regression"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Create folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
