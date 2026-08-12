"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { format } from "date-fns";
import { History, RotateCcw } from "lucide-react";
import { db } from "@/lib/notes/db";
import { restoreVersion } from "@/lib/notes/notes-repo";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export function VersionHistoryDialog({ noteId, open, onOpenChange }: { noteId: string; open: boolean; onOpenChange: (v: boolean) => void }) {
  const versions = useLiveQuery(() => db.versions.where("noteId").equals(noteId).reverse().sortBy("createdAt"), [noteId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="size-4" /> Version History
          </DialogTitle>
          <DialogDescription>Restore this note to an earlier snapshot.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-96">
          <div className="flex flex-col gap-1.5 pr-3">
            {(versions ?? []).length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No earlier versions yet.</p>}
            {(versions ?? []).map((v) => (
              <div key={v.id} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{v.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(v.createdAt, "MMM d, yyyy h:mm a")} &middot; {v.wordCount} words
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 shrink-0 gap-1 text-xs"
                  onClick={async () => {
                    await restoreVersion(noteId, v.id);
                    toast.success("Restored version");
                    onOpenChange(false);
                  }}
                >
                  <RotateCcw className="size-3" /> Restore
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
