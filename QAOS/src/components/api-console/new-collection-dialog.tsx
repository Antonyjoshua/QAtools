"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createCollection } from "@/lib/api-console/repo/collections-repo";
import type { Collection } from "@/lib/api-console/types";

export function NewCollectionDialog({ onCreated }: { onCreated?: (collection: Collection) => void }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  async function handleCreate() {
    if (!name.trim()) return;
    const collection = await createCollection(name.trim(), description.trim());
    setOpen(false);
    setName("");
    setDescription("");
    onCreated?.(collection);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={() => setOpen(true)}>
        <Plus className="size-3.5" />
        New Collection
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New collection</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="collection-name">Name</Label>
            <Input id="collection-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. User API" autoFocus />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="collection-description">Description</Label>
            <Textarea id="collection-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
