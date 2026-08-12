import { db } from "../db";
import { uid } from "../id";
import type { ResumeAttachment } from "../types";

export async function addAttachment(resumeId: string, file: File): Promise<ResumeAttachment> {
  const attachment: ResumeAttachment = {
    id: uid(),
    resumeId,
    filename: file.name,
    mimeType: file.type,
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

export async function getAttachment(id: string): Promise<ResumeAttachment | undefined> {
  return db.attachments.get(id);
}
