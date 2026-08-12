"use client";

import { useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/notes/db";
import { NotesListPage } from "@/components/notes/notes-list-page";
import { DynamicIcon } from "@/components/icon";

export default function CollectionPage() {
  const params = useParams<{ id: string }>();
  const collectionId = params.id;
  const collection = useLiveQuery(() => db.collections.get(collectionId), [collectionId]);

  if (!collection) return null;

  return (
    <NotesListPage
      title={collection.name}
      description={collection.description || "Collection"}
      emptyMessage="No notes in this collection yet. Add notes from the note editor's Collections field."
      filter={(n) => !n.isArchived && n.collectionIds.includes(collectionId)}
      icon={(props) => <DynamicIcon name={collection.icon || "FolderOpen"} {...props} />}
    />
  );
}
