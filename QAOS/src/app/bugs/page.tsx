"use client";

import { BugsListPage } from "@/components/bugs/bugs-list-page";

export default function AllBugsPage() {
  return (
    <BugsListPage
      title="All Bug Reports"
      description="Every bug report across all projects."
      emptyMessage="No bug reports yet. Create your first one."
      filter={() => true}
    />
  );
}
