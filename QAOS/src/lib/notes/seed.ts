import { db } from "./db";
import { CATEGORY_SEED } from "./categories-seed";
import { uid } from "./id";
import type { Category, Collection } from "./types";

const DEFAULT_COLLECTIONS: { name: string; description: string; icon: string; color: string }[] = [
  { name: "Interview Preparation", description: "Common QA interview questions and answers.", icon: "MessagesSquare", color: "oklch(0.6 0.18 280)" },
  { name: "Playwright Learning", description: "Playwright concepts, snippets, and gotchas.", icon: "Bot", color: "oklch(0.58 0.135 168)" },
  { name: "Selenium Notes", description: "Selenium WebDriver reference material.", icon: "MousePointerClick", color: "oklch(0.6 0.16 45)" },
  { name: "SQL Queries", description: "Reusable SQL snippets for database testing.", icon: "Database", color: "oklch(0.6 0.18 280)" },
  { name: "API Testing", description: "REST/GraphQL testing references.", icon: "Braces", color: "oklch(0.65 0.2 25)" },
  { name: "Company Projects", description: "Project-specific QA documentation.", icon: "Building2", color: "oklch(0.75 0.16 75)" },
  { name: "Certifications", description: "Study notes for QA certifications.", icon: "Award", color: "oklch(0.6 0.14 320)" },
];

/**
 * Consolidates duplicate categories/collections down to one canonical row each,
 * reparenting anything that pointed at a duplicate before deleting it. Safe to
 * run every time — a no-op once there's nothing to merge.
 */
async function dedupeSeedData(): Promise<void> {
  const allCategories = await db.categories.toArray();
  const tops = allCategories.filter((c) => c.parentId === null);
  const children = allCategories.filter((c) => c.parentId !== null);

  const topsByName = new Map<string, Category[]>();
  for (const t of tops) topsByName.set(t.name, [...(topsByName.get(t.name) ?? []), t]);
  const topIdRemap = new Map<string, string>();
  const categoryIdsToDelete: string[] = [];
  for (const group of topsByName.values()) {
    if (group.length <= 1) continue;
    const [canonical, ...dupes] = group;
    for (const d of dupes) {
      topIdRemap.set(d.id, canonical.id);
      categoryIdsToDelete.push(d.id);
    }
  }

  const childrenByKey = new Map<string, Category[]>();
  for (const c of children) {
    const effectiveParentId = topIdRemap.get(c.parentId!) ?? c.parentId!;
    const key = `${effectiveParentId}::${c.name}`;
    childrenByKey.set(key, [...(childrenByKey.get(key) ?? []), c]);
  }
  const childIdRemap = new Map<string, string>();
  for (const [key, group] of childrenByKey) {
    const effectiveParentId = key.slice(0, key.lastIndexOf("::"));
    const [canonical, ...dupes] = group;
    if (canonical.parentId !== effectiveParentId) {
      await db.categories.update(canonical.id, { parentId: effectiveParentId });
    }
    for (const d of dupes) {
      childIdRemap.set(d.id, canonical.id);
      categoryIdsToDelete.push(d.id);
    }
  }

  const categoryIdRemap = new Map([...topIdRemap, ...childIdRemap]);
  if (categoryIdRemap.size > 0) {
    const notesToFix = (await db.notes.toArray()).filter((n) => n.categoryId && categoryIdRemap.has(n.categoryId));
    for (const n of notesToFix) {
      await db.notes.update(n.id, { categoryId: categoryIdRemap.get(n.categoryId!) });
    }
  }
  if (categoryIdsToDelete.length > 0) {
    await db.categories.bulkDelete(categoryIdsToDelete);
  }

  const allCollections = await db.collections.toArray();
  const collectionsByName = new Map<string, Collection[]>();
  for (const c of allCollections) collectionsByName.set(c.name, [...(collectionsByName.get(c.name) ?? []), c]);
  const collectionIdRemap = new Map<string, string>();
  const collectionIdsToDelete: string[] = [];
  for (const group of collectionsByName.values()) {
    if (group.length <= 1) continue;
    const [canonical, ...dupes] = group;
    for (const d of dupes) {
      collectionIdRemap.set(d.id, canonical.id);
      collectionIdsToDelete.push(d.id);
    }
  }
  if (collectionIdRemap.size > 0) {
    const allNotes = await db.notes.toArray();
    for (const n of allNotes) {
      if (!n.collectionIds.some((id) => collectionIdRemap.has(id))) continue;
      const newIds = Array.from(new Set(n.collectionIds.map((id) => collectionIdRemap.get(id) ?? id)));
      await db.notes.update(n.id, { collectionIds: newIds });
    }
  }
  if (collectionIdsToDelete.length > 0) {
    await db.collections.bulkDelete(collectionIdsToDelete);
  }
}

async function runSeed(): Promise<void> {
  await dedupeSeedData();

  const categoryCount = await db.categories.count();
  if (categoryCount === 0) {
    const rows: Category[] = [];
    let order = 0;
    for (const top of CATEGORY_SEED) {
      const topId = uid();
      rows.push({ id: topId, name: top.name, parentId: null, icon: top.icon, order: order++, isCustom: false });
      for (const child of top.children) {
        rows.push({ id: uid(), name: child, parentId: topId, icon: "Hash", order: order++, isCustom: false });
      }
    }
    await db.categories.bulkAdd(rows);
  }

  const collectionCount = await db.collections.count();
  if (collectionCount === 0) {
    await db.collections.bulkAdd(
      DEFAULT_COLLECTIONS.map((c) => ({
        id: uid(),
        name: c.name,
        description: c.description,
        icon: c.icon,
        color: c.color,
        createdAt: Date.now(),
      }))
    );
  }
}

// Memoized so React's dev-mode double-invoked effects (and any other concurrent
// caller) all await the same run instead of racing each other into creating
// duplicate categories/collections.
let seedingPromise: Promise<void> | undefined;

export function ensureSeeded(): Promise<void> {
  if (!seedingPromise) seedingPromise = runSeed();
  return seedingPromise;
}
