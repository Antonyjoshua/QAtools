import { db } from "../db";
import { uid } from "../id";
import type { Requirement } from "../types";

export async function createRequirement(projectId: string, requirementId: string, title: string, description = ""): Promise<Requirement> {
  const requirement: Requirement = { id: uid(), projectId, requirementId, title, description, createdAt: Date.now() };
  await db.requirements.add(requirement);
  return requirement;
}

export async function updateRequirement(id: string, patch: Partial<Requirement>): Promise<void> {
  await db.requirements.update(id, patch);
}

export async function deleteRequirement(id: string): Promise<void> {
  await db.requirements.delete(id);
}
