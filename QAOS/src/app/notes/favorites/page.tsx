"use client";

import { Star } from "lucide-react";
import { NotesListPage } from "@/components/notes/notes-list-page";

export default function FavoritesPage() {
  return (
    <NotesListPage
      title="Favorites"
      description="Notes you've starred for quick access."
      emptyMessage="No favorites yet. Star a note to see it here."
      filter={(n) => n.isFavorite && !n.isArchived}
      icon={Star}
    />
  );
}
