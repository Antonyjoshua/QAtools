"use client";

import { Pin } from "lucide-react";
import { NotesListPage } from "@/components/notes/notes-list-page";

export default function PinnedPage() {
  return (
    <NotesListPage
      title="Pinned"
      description="Notes pinned for quick access at the top of mind."
      emptyMessage="Nothing pinned yet."
      filter={(n) => n.isPinned && !n.isArchived}
      icon={Pin}
    />
  );
}
