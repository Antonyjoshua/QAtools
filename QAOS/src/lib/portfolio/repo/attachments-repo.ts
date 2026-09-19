import { db } from "../db";
import { uid } from "../id";
import type { PortfolioAttachment } from "../types";

export async function addAttachment(portfolioId: string, kind: "photo" | "resume", file: File): Promise<PortfolioAttachment> {
  const attachment: PortfolioAttachment = {
    id: uid(),
    portfolioId,
    kind,
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

export async function getAttachment(id: string): Promise<PortfolioAttachment | undefined> {
  return db.attachments.get(id);
}
