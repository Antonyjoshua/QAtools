import { db } from "./db";
import { uid } from "./id";
import type { Attachment } from "./types";

export async function addAttachment(bugId: string, file: File, kind: Attachment["kind"], caption = ""): Promise<Attachment> {
  const attachment: Attachment = {
    id: uid(),
    bugId,
    kind,
    filename: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    blob: file,
    caption,
    createdAt: Date.now(),
  };
  await db.attachments.add(attachment);
  return attachment;
}

export async function updateAttachmentBlob(id: string, blob: Blob): Promise<void> {
  await db.attachments.update(id, { blob });
}

export async function updateAttachmentCaption(id: string, caption: string): Promise<void> {
  await db.attachments.update(id, { caption });
}

export async function deleteAttachment(id: string): Promise<void> {
  await db.attachments.delete(id);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
