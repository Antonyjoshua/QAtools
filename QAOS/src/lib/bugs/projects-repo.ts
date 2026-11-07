import { db } from "./db";

/** Deletes a project and everything under it: modules, their features, every bug in the
 * project (with that bug's own attachments/comments/versions), build versions, and
 * environments. Mirrors the cascade-delete convention already established in Test
 * Management's `deleteProject` — a Project is the root container here too. */
export async function deleteProject(id: string): Promise<void> {
  const modules = await db.modules.where("projectId").equals(id).toArray();
  const moduleIds = modules.map((m) => m.id);
  const features = moduleIds.length ? await db.features.where("moduleId").anyOf(moduleIds).toArray() : [];
  const bugs = await db.bugs.where("projectId").equals(id).toArray();
  const bugIds = bugs.map((b) => b.id);

  await db.transaction(
    "rw",
    [db.projects, db.modules, db.features, db.bugs, db.buildVersions, db.environments, db.attachments, db.comments, db.versions],
    async () => {
      await db.projects.delete(id);
      if (moduleIds.length) await db.modules.bulkDelete(moduleIds);
      if (features.length) await db.features.bulkDelete(features.map((f) => f.id));
      if (bugIds.length) {
        await db.bugs.bulkDelete(bugIds);
        await db.attachments.where("bugId").anyOf(bugIds).delete();
        await db.comments.where("bugId").anyOf(bugIds).delete();
        await db.versions.where("bugId").anyOf(bugIds).delete();
      }
      await db.buildVersions.where("projectId").equals(id).delete();
      await db.environments.where("projectId").equals(id).delete();
    }
  );
}

export async function countProjectBugs(id: string): Promise<number> {
  return db.bugs.where("projectId").equals(id).count();
}

/** Deletes a module and its features. Bugs tagged with this module (or one of its
 * features) are NOT deleted — a bug report is a standalone record, not something a
 * module owns — they're just unlinked (moduleId/featureId cleared) so they become
 * "no module" instead of silently vanishing. */
export async function deleteModule(id: string): Promise<void> {
  const features = await db.features.where("moduleId").equals(id).toArray();
  const featureIds = features.map((f) => f.id);
  const bugs = await db.bugs.where("moduleId").equals(id).toArray();

  await db.transaction("rw", [db.modules, db.features, db.bugs], async () => {
    await db.modules.delete(id);
    if (featureIds.length) await db.features.bulkDelete(featureIds);
    for (const bug of bugs) {
      await db.bugs.update(bug.id, { moduleId: null, featureId: null });
    }
  });
}

export async function countModuleBugs(id: string): Promise<number> {
  return db.bugs.where("moduleId").equals(id).count();
}

export async function countFeatureBugs(id: string): Promise<number> {
  return db.bugs.where("featureId").equals(id).count();
}

/** Deletes a feature, unlinking (not deleting) any bugs tagged with it. */
export async function deleteFeature(id: string): Promise<void> {
  const bugs = await db.bugs.where("featureId").equals(id).toArray();
  await db.transaction("rw", [db.features, db.bugs], async () => {
    await db.features.delete(id);
    for (const bug of bugs) {
      await db.bugs.update(bug.id, { featureId: null });
    }
  });
}
