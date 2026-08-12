import MiniSearch from "minisearch";
import type { Note } from "./types";

export interface SearchDoc {
  id: string;
  title: string;
  contentText: string;
  tags: string;
  categoryName: string;
}

export function buildSearchIndex(notes: Note[], categoryNameById: Map<string, string>): MiniSearch<SearchDoc> {
  const mini = new MiniSearch<SearchDoc>({
    fields: ["title", "contentText", "tags", "categoryName"],
    storeFields: ["title"],
    searchOptions: {
      boost: { title: 3, tags: 2 },
      prefix: true,
      fuzzy: 0.2,
    },
  });
  mini.addAll(
    notes.map((n) => ({
      id: n.id,
      title: n.title,
      contentText: n.contentText,
      tags: n.tags.join(" "),
      categoryName: n.categoryId ? categoryNameById.get(n.categoryId) ?? "" : "",
    }))
  );
  return mini;
}
