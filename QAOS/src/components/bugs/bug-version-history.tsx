"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { format } from "date-fns";
import { History } from "lucide-react";
import { db } from "@/lib/bugs/db";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function BugVersionHistoryDialog({ bugId, open, onOpenChange }: { bugId: string; open: boolean; onOpenChange: (v: boolean) => void }) {
  const versions = useLiveQuery(() => db.versions.where("bugId").equals(bugId).reverse().sortBy("createdAt"), [bugId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="size-4" /> Version History
          </DialogTitle>
          <DialogDescription>Every edit made to this bug report.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-96">
          <div className="flex flex-col gap-2 pr-3">
            {(versions ?? []).length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No edits recorded yet.</p>}
            {(versions ?? []).map((v) => (
              <div key={v.id} className="rounded-lg border border-border p-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{v.editor}</span>
                  <span className="text-muted-foreground">{format(v.createdAt, "MMM d, yyyy h:mm a")}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Modified: {v.modifiedFields.join(", ")}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
