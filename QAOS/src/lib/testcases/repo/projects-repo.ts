import { db } from "../db";
import { uid } from "../id";
import type { Project } from "../types";

export async function createProject(name: string, description = ""): Promise<Project> {
  const now = Date.now();
  const project: Project = { id: uid(), name, description, isFavorite: false, createdAt: now, updatedAt: now };
  await db.projects.add(project);
  return project;
}

export async function updateProject(id: string, patch: Partial<Project>): Promise<void> {
  await db.projects.update(id, { ...patch, updatedAt: Date.now() });
}

export async function toggleProjectFavorite(id: string): Promise<void> {
  const project = await db.projects.get(id);
  if (!project) return;
  await db.projects.update(id, { isFavorite: !project.isFavorite });
}

export async function deleteProject(id: string): Promise<void> {
  const testCases = await db.testCases.where("projectId").equals(id).toArray();
  const testCaseIds = testCases.map((tc) => tc.id);

  await db.transaction(
    "rw",
    [db.projects, db.folders, db.suites, db.testCases, db.steps, db.executions, db.executionResults, db.comments, db.history, db.requirements, db.tags],
    async () => {
      await db.projects.delete(id);
      await db.folders.where("projectId").equals(id).delete();
      await db.suites.where("projectId").equals(id).delete();
      await db.testCases.where("projectId").equals(id).delete();
      if (testCaseIds.length) {
        await db.steps.where("testCaseId").anyOf(testCaseIds).delete();
        await db.comments.where("testCaseId").anyOf(testCaseIds).delete();
        await db.history.where("entityId").anyOf(testCaseIds).delete();
      }
      const executions = await db.executions.where("projectId").equals(id).toArray();
      const executionIds = executions.map((e) => e.id);
      await db.executions.where("projectId").equals(id).delete();
      if (executionIds.length) {
        await db.executionResults.where("executionId").anyOf(executionIds).delete();
      }
      await db.requirements.where("projectId").equals(id).delete();
      await db.tags.where("projectId").equals(id).delete();
    }
  );
}
