"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import type { JSONContent } from "@tiptap/core";
import { Plus, Trash2, ListChecks } from "lucide-react";
import { db } from "@/lib/bugs/db";
import { uid } from "@/lib/bugs/id";
import { EMPTY_DOC } from "@/lib/bugs/content-utils";
import { RichTextField } from "@/components/bugs/editor/rich-text-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { extractText } from "@/lib/bugs/content-utils";

export default function ReusableStepsPage() {
  const steps = useLiveQuery(() => db.reusableSteps.orderBy("createdAt").reverse().toArray(), []);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [content, setContent] = React.useState<JSONContent>(EMPTY_DOC);

  async function handleCreate() {
    if (!name.trim()) return;
    await db.reusableSteps.add({ id: uid(), name: name.trim(), contentJSON: content, contentText: extractText(content), createdAt: Date.now() });
    setName("");
    setContent(EMPTY_DOC);
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reusable Steps</h1>
          <p className="mt-1 text-muted-foreground">Save common step sequences (Login, Checkout, Submit Form) to reuse across bug reports.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-1.5">
          <Plus className="size-4" />
          New Step Set
        </Button>
      </div>

      {(steps ?? []).length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <ListChecks className="size-8 text-muted-foreground" />
          <p className="text-muted-foreground">No reusable steps yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(steps ?? []).map((s) => (
            <div key={s.id} className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{s.name}</p>
                <Button variant="ghost" size="icon" className="size-6 text-destructive" onClick={() => db.reusableSteps.delete(s.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <p className="line-clamp-3 text-xs text-muted-foreground">{s.contentText}</p>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Reusable Step Set</DialogTitle>
            <DialogDescription>These will be available to insert into any bug&apos;s &ldquo;Steps to Reproduce&rdquo; field.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name — e.g. Login, Checkout" />
            <RichTextField content={content} onChange={setContent} placeholder="1. Step one... 2. Step two..." minHeight={140} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!name.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
