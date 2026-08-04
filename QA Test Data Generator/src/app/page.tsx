import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { DashboardExplorer } from "@/components/dashboard-explorer";
import { ALL_GENERATORS } from "@/lib/generators/registry";
import { CATEGORIES } from "@/lib/generators/categories";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <FlaskConical className="size-3.5" />
          Built for QA & Automation workflows
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Test data, on demand.</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {ALL_GENERATORS.length}+ generators across {CATEGORIES.length} categories for web, mobile, API, database, and automation
          testing. Generate realistic data, export it in the format you need, and reuse your favorite configurations.
        </p>
      </div>

      <Link
        href="/category/qa"
        className="mb-8 flex items-center justify-between gap-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-5 transition-colors hover:bg-primary/10"
      >
        <div>
          <h2 className="font-medium tracking-tight">QA Test Design — the module that sets TestDataHub apart</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Boundary values, equivalence partitions, negative test data, SQL injection & XSS payloads, Unicode edge cases, and more —
            purpose-built for validation and security testing, not just fake data.
          </p>
        </div>
        <ArrowRight className="size-5 shrink-0 text-primary" />
      </Link>

      <DashboardExplorer />
    </div>
  );
}
