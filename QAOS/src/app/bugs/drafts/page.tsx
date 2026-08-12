"use client";

import { BugsListPage } from "@/components/bugs/bugs-list-page";

export default function DraftsPage() {
  return (
    <BugsListPage
      title="Drafts"
      description="Bug reports you've started but haven't submitted yet."
      emptyMessage="No drafts. New bug reports start as drafts until you change their status."
      filter={(b) => b.status === "Draft"}
    />
  );
}
