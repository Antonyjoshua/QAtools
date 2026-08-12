import { db } from "../db";
import { uid } from "../id";
import type { Attachment } from "../types";

export async function addAttachment(parentType: Attachment["parentType"], parentId: string, file: File): Promise<Attachment> {
  const attachment: Attachment = {
    id: uid(),
    parentType,
    parentId,
    filename: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    blob: file,
    createdAt: Date.now(),
  };
  await db.attachments.add(attachment);
  return attachment;
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
