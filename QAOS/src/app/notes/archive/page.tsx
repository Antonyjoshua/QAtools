"use client";

import { Archive } from "lucide-react";
import { NotesListPage } from "@/components/notes/notes-list-page";

export default function ArchivePage() {
  return (
    <NotesListPage
      title="Archive"
      description="Archived notes — restore them anytime."
      emptyMessage="Archive is empty."
      filter={(n) => n.isArchived}
      icon={Archive}
    />
  );
}
