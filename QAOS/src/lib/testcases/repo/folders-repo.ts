import { db } from "../db";
import { uid } from "../id";
import type { Folder } from "../types";

export interface FolderNode extends Folder {
  children: FolderNode[];
}

export async function createFolder(projectId: string, name: string, parentId: string | null = null): Promise<Folder> {
  const siblings = await db.folders.where("projectId").equals(projectId).toArray();
  const order = siblings.filter((f) => f.parentId === parentId).length;
  const folder: Folder = { id: uid(), projectId, parentId, name, order, createdAt: Date.now() };
  await db.folders.add(folder);
  return folder;
}

export async function renameFolder(id: string, name: string): Promise<void> {
  await db.folders.update(id, { name });
}

export async function moveFolder(id: string, newParentId: string | null, newOrder: number): Promise<void> {
  await db.folders.update(id, { parentId: newParentId, order: newOrder });
}

export async function reorderFolders(updates: { id: string; order: number; parentId: string | null }[]): Promise<void> {
  await db.transaction("rw", db.folders, async () => {
    for (const u of updates) {
      await db.folders.update(u.id, { order: u.order, parentId: u.parentId });
    }
  });
}

export async function deleteFolder(id: string): Promise<void> {
  const all = await db.folders.toArray();
  const toDelete = collectDescendantIds(all, id);
  await db.transaction("rw", [db.folders, db.suites, db.testCases, db.steps], async () => {
    await db.folders.bulkDelete(toDelete);
    const suites = await db.suites.where("folderId").anyOf(toDelete).toArray();
    const suiteIds = suites.map((s) => s.id);
    await db.suites.where("folderId").anyOf(toDelete).delete();
    if (suiteIds.length) {
      const cases = await db.testCases.where("suiteId").anyOf(suiteIds).toArray();
      const caseIds = cases.map((c) => c.id);
      await db.testCases.where("suiteId").anyOf(suiteIds).delete();
      if (caseIds.length) await db.steps.where("testCaseId").anyOf(caseIds).delete();
    }
  });
}

function collectDescendantIds(all: Folder[], rootId: string): string[] {
  const result = [rootId];
  let frontier = [rootId];
  while (frontier.length) {
    const children = all.filter((f) => frontier.includes(f.parentId ?? ""));
    if (!children.length) break;
    result.push(...children.map((c) => c.id));
    frontier = children.map((c) => c.id);
  }
  return result;
}

export function buildFolderTree(folders: Folder[]): FolderNode[] {
  const byParent = new Map<string | null, Folder[]>();
  for (const f of folders) {
    const key = f.parentId;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(f);
  }
  function build(parentId: string | null): FolderNode[] {
    const children = (byParent.get(parentId) ?? []).slice().sort((a, b) => a.order - b.order);
    return children.map((f) => ({ ...f, children: build(f.id) }));
  }
  return build(null);
}
