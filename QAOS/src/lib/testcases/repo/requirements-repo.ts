import { db } from "../db";
import { uid } from "../id";
import type { Requirement } from "../types";

export async function listRequirements(projectId: string): Promise<Requirement[]> {
  return db.requirements.where("projectId").equals(projectId).sortBy("requirementId");
}

export async function getRequirement(id: string): Promise<Requirement | undefined> {
  return db.requirements.get(id);
}

async function assertUniqueCode(projectId: string, requirementId: string, excludeId?: string): Promise<void> {
  const siblings = await db.requirements.where("projectId").equals(projectId).toArray();
  const clash = siblings.some((r) => r.id !== excludeId && r.requirementId.toLowerCase() === requirementId.toLowerCase());
  if (clash) {
    throw new Error(`A requirement with code "${requirementId}" already exists in this project.`);
  }
}

export async function createRequirement(projectId: string, requirementId: string, title: string, description = ""): Promise<Requirement> {
  await assertUniqueCode(projectId, requirementId);
  const requirement: Requirement = { id: uid(), projectId, requirementId, title, description, createdAt: Date.now() };
  await db.requirements.add(requirement);
  return requirement;
}

export async function updateRequirement(id: string, patch: Partial<Requirement>): Promise<void> {
  if (patch.requirementId) {
    const current = await db.requirements.get(id);
    if (current) await assertUniqueCode(current.projectId, patch.requirementId, id);
  }
  await db.requirements.update(id, patch);
}

export async function deleteRequirement(id: string): Promise<void> {
  const linkedCount = await db.testCases.where("requirementId").equals(id).count();
  if (linkedCount > 0) {
    throw new Error(`Cannot delete — ${linkedCount} test case${linkedCount === 1 ? "" : "s"} still reference this requirement.`);
  }
  await db.requirements.delete(id);
}
