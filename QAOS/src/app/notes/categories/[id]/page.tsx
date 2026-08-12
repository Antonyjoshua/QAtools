"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/notes/db";
import { NotesListPage } from "@/components/notes/notes-list-page";
import { DynamicIcon } from "@/components/icon";

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const categoryId = params.id;
  const category = useLiveQuery(() => db.categories.get(categoryId), [categoryId]);
  const childIds = useLiveQuery(
    () => db.categories.where("parentId").equals(categoryId).primaryKeys(),
    [categoryId]
  );

  const relevantIds = React.useMemo(() => new Set([categoryId, ...(childIds ?? [])]), [categoryId, childIds]);

  if (!category) return null;

  return (
    <NotesListPage
      title={category.name}
      description={category.parentId ? "Sub-category" : "Category and all its sub-categories"}
      emptyMessage="No notes in this category yet."
      filter={(n) => !n.isArchived && !!n.categoryId && relevantIds.has(n.categoryId)}
      icon={(props) => <DynamicIcon name={category.icon} {...props} />}
    />
  );
}
