import { db } from "./db";
import { CATEGORY_SEED } from "./categories-seed";
import { uid } from "./id";
import type { Category } from "./types";

const DEFAULT_COLLECTIONS: { name: string; description: string; icon: string; color: string }[] = [
  { name: "Interview Preparation", description: "Common QA interview questions and answers.", icon: "MessagesSquare", color: "oklch(0.6 0.18 280)" },
  { name: "Playwright Learning", description: "Playwright concepts, snippets, and gotchas.", icon: "Bot", color: "oklch(0.58 0.135 168)" },
  { name: "Selenium Notes", description: "Selenium WebDriver reference material.", icon: "MousePointerClick", color: "oklch(0.6 0.16 45)" },
  { name: "SQL Queries", description: "Reusable SQL snippets for database testing.", icon: "Database", color: "oklch(0.6 0.18 280)" },
  { name: "API Testing", description: "REST/GraphQL testing references.", icon: "Braces", color: "oklch(0.65 0.2 25)" },
  { name: "Company Projects", description: "Project-specific QA documentation.", icon: "Building2", color: "oklch(0.75 0.16 75)" },
  { name: "Certifications", description: "Study notes for QA certifications.", icon: "Award", color: "oklch(0.6 0.14 320)" },
];

export async function ensureSeeded(): Promise<void> {
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
