import MiniSearch from "minisearch";
import type { BugReport } from "./types";

export interface SearchDoc {
  id: string;
  displayId: string;
  title: string;
  descriptionText: string;
  moduleName: string;
  projectName: string;
  severity: string;
  priority: string;
  status: string;
  reporter: string;
}

export function buildBugSearchIndex(
  bugs: BugReport[],
  projectNameById: Map<string, string>,
  moduleNameById: Map<string, string>
): MiniSearch<SearchDoc> {
  const mini = new MiniSearch<SearchDoc>({
    fields: ["displayId", "title", "descriptionText", "moduleName", "projectName", "severity", "priority", "status", "reporter"],
    storeFields: ["title", "displayId", "status"],
    searchOptions: { boost: { title: 3, displayId: 4 }, prefix: true, fuzzy: 0.2 },
  });
  mini.addAll(
    bugs.map((b) => ({
      id: b.id,
      displayId: b.displayId,
      title: b.title,
      descriptionText: b.descriptionText,
      moduleName: b.moduleId ? moduleNameById.get(b.moduleId) ?? "" : "",
      projectName: b.projectId ? projectNameById.get(b.projectId) ?? "" : "",
      severity: b.severity ?? "",
      priority: b.priority ?? "",
      status: b.status,
      reporter: b.reporter,
    }))
  );
  return mini;
}
