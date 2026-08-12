"use client";

import { useParams } from "next/navigation";
import { Tag } from "lucide-react";
import { NotesListPage } from "@/components/notes/notes-list-page";

export default function TagPage() {
  const params = useParams<{ tag: string }>();
  const tag = decodeURIComponent(params.tag);

  return (
    <NotesListPage
      title={`#${tag}`}
      description={`Notes tagged with "${tag}"`}
      emptyMessage="No notes with this tag."
      filter={(n) => !n.isArchived && n.tags.includes(tag)}
      icon={Tag}
    />
  );
}
