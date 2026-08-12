import { db } from "../db";
import { uid } from "../id";
import type { Tag } from "../types";

const PALETTE = ["#5B4CDB", "#2FAE6B", "#EAB308", "#EF4444", "#0EA5E9", "#EC4899", "#8B5CF6", "#F97316"];

export async function createTag(projectId: string, name: string): Promise<Tag> {
  const existing = await db.tags.where("projectId").equals(projectId).toArray();
  const color = PALETTE[existing.length % PALETTE.length];
  const tag: Tag = { id: uid(), projectId, name, color };
  await db.tags.add(tag);
  return tag;
}

export async function deleteTag(id: string): Promise<void> {
  await db.tags.delete(id);
}

export async function ensureTagsExist(projectId: string, names: string[]): Promise<void> {
  const existing = await db.tags.where("projectId").equals(projectId).toArray();
  const existingNames = new Set(existing.map((t) => t.name));
  for (const name of names) {
    if (!existingNames.has(name)) {
      await createTag(projectId, name);
      existingNames.add(name);
    }
  }
}
