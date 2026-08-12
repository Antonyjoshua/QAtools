"use client";

import * as React from "react";
import type { Editor } from "@tiptap/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScreenshotAnnotator } from "./annotator";
import { addAttachment } from "@/lib/notes/attachments-repo";
import { toast } from "sonner";

export function ScreenshotInsertDialog({
  open,
  onOpenChange,
  editor,
  noteId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editor: Editor;
  noteId: string;
}) {
  async function handleSave(blob: Blob) {
    const file = new File([blob], `screenshot-${Date.now()}.png`, { type: "image/png" });
    const attachment = await addAttachment(noteId, file);
    editor
      .chain()
      .focus()
      .insertFileEmbed({
        attachmentId: attachment.id,
        filename: attachment.filename,
        mimeType: attachment.mimeType,
        size: attachment.size,
      })
      .run();
    toast.success("Screenshot inserted into note");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Screenshot Studio</DialogTitle>
          <DialogDescription>Upload a screenshot, annotate it, then insert it into your note.</DialogDescription>
        </DialogHeader>
        <ScreenshotAnnotator onSave={handleSave} saveLabel="Insert into note" />
      </DialogContent>
    </Dialog>
  );
}
