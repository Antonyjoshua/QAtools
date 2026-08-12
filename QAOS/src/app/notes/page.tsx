"use client";

import { FileText } from "lucide-react";
import { NotesListPage } from "@/components/notes/notes-list-page";

export default function AllNotesPage() {
  return (
    <NotesListPage
      title="All Notes"
      description="Every note in your workspace."
      emptyMessage="No notes yet. Create your first one."
      filter={(n) => !n.isArchived}
      icon={FileText}
    />
  );
}
