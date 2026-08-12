import { db } from "../db";

/** Toggles a milestone and returns whether it was just marked complete (vs. un-checked). */
export async function toggleRoadmapMilestone(roadmapId: string, milestoneId: string): Promise<boolean> {
  const existing = await db.roadmapProgress.get(roadmapId);
  const completedIds = existing?.completedMilestoneIds ?? [];
  const isCompleting = !completedIds.includes(milestoneId);
  const next = isCompleting ? [...completedIds, milestoneId] : completedIds.filter((id) => id !== milestoneId);
  await db.roadmapProgress.put({ roadmapId, completedMilestoneIds: next });
  return isCompleting;
}
