"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ScreenshotAnnotator } from "@/components/notes/screenshot-studio/annotator";
import { createNote, updateNote } from "@/lib/notes/notes-repo";
import { addAttachment } from "@/lib/notes/attachments-repo";
import { EMPTY_DOC } from "@/lib/notes/content-utils";
import type { JSONContent } from "@tiptap/core";

export default function ScreenshotStudioPage() {
  const router = useRouter();

  async function handleSaveAsNote(blob: Blob) {
    const file = new File([blob], `screenshot-${Date.now()}.png`, { type: "image/png" });
    const note = await createNote({ title: "Screenshot Note", icon: "Image" });
    const attachment = await addAttachment(note.id, file);
    const content: JSONContent = {
      ...EMPTY_DOC,
      content: [
        { type: "fileEmbed", attrs: { attachmentId: attachment.id, filename: attachment.filename, mimeType: attachment.mimeType, size: attachment.size } },
        { type: "paragraph" },
      ],
    };
    await updateNote(note.id, { contentJSON: content });
    toast.success("Saved as new note");
    router.push(`/notes/${note.id}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Screenshot Studio</h1>
      <p className="mt-1 mb-8 max-w-2xl text-muted-foreground">
        Upload a screenshot, draw rectangles and arrows, highlight areas, blur sensitive info, and add comments. Download the annotated
        image or save it directly as a new note.
      </p>
      <ScreenshotAnnotator onSave={handleSaveAsNote} saveLabel="Save as new note" />
    </div>
  );
}
