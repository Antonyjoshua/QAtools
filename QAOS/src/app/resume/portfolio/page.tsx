"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { Globe, Plus, FolderKanban } from "lucide-react";
import { db } from "@/lib/portfolio/db";
import { PortfolioCard } from "@/components/portfolio/dashboard/portfolio-card";
import { Button } from "@/components/ui/button";

export default function PortfolioDashboardPage() {
  const portfolios = useLiveQuery(() => db.portfolios.orderBy("updatedAt").reverse().toArray());

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Globe className="size-3.5" />
            Portfolio
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Build a personal site that shows the work.</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {portfolios ? `${portfolios.length} portfolio${portfolios.length === 1 ? "" : "s"}` : "…"} — 4 fully editable templates, live preview as you type.
          </p>
        </div>
        <Button className="gap-1.5" nativeButton={false} render={<Link href="/resume/portfolio/new" />}>
          <Plus className="size-4" />
          New Portfolio
        </Button>
      </div>

      {portfolios && portfolios.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
          <FolderKanban className="size-8 text-muted-foreground" />
          <p className="font-medium">No portfolios yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">Pick a template to get started — every field is editable afterward.</p>
          <Button className="mt-2 gap-1.5" nativeButton={false} render={<Link href="/resume/portfolio/new" />}>
            <Plus className="size-4" />
            Create your first portfolio
          </Button>
        </div>
      )}

      {portfolios && portfolios.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {portfolios.map((p) => (
            <PortfolioCard key={p.id} portfolio={p} />
          ))}
        </div>
      )}
    </div>
  );
}
