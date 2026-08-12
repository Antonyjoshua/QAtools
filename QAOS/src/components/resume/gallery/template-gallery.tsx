"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { RESUME_TEMPLATES } from "@/lib/resume/templates/registry";
import { TEMPLATE_CATEGORIES } from "@/lib/resume/types";
import { useResumeSettings } from "@/lib/resume/settings-store";
import { createResumeFromTemplate } from "@/lib/resume/repo/resumes-repo";
import { TemplateCard } from "./template-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ResumeTemplate } from "@/lib/resume/types";

export function TemplateGallery() {
  const router = useRouter();
  const [category, setCategory] = React.useState<string>("All");
  const [query, setQuery] = React.useState("");
  const favoriteIds = useResumeSettings((s) => s.favoriteTemplateIds);
  const recentIds = useResumeSettings((s) => s.recentTemplateIds);
  const recordRecentTemplate = useResumeSettings((s) => s.recordRecentTemplate);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const favoriteTemplates = RESUME_TEMPLATES.filter((t) => favoriteIds.includes(t.id));
  const recentTemplates = recentIds.map((id) => RESUME_TEMPLATES.find((t) => t.id === id)).filter((t): t is ResumeTemplate => Boolean(t));

  const filtered = RESUME_TEMPLATES.filter((t) => {
    const matchesCategory = category === "All" || t.category === category;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  async function handleSelect(template: ResumeTemplate) {
    setBusyId(template.id);
    try {
      recordRecentTemplate(template.id);
      const resume = await createResumeFromTemplate(template.id);
      router.push(`/resume/${resume.id}`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates…" className="h-9 pl-8" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {["All", ...TEMPLATE_CATEGORIES].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              category === c ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent/50"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {category === "All" && !query && favoriteTemplates.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Favorites</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {favoriteTemplates.map((t) => (
              <TemplateCard key={t.id} template={t} onSelect={handleSelect} />
            ))}
          </div>
        </section>
      )}

      {category === "All" && !query && recentTemplates.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Recently used</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {recentTemplates.map((t) => (
              <TemplateCard key={t.id} template={t} onSelect={handleSelect} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          {category === "All" ? "All templates" : category} <span className="tabular-nums">({filtered.length})</span>
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((t) => (
            <TemplateCard key={t.id} template={t} onSelect={handleSelect} />
          ))}
        </div>
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No templates match your search.</p>}
      </section>

      {busyId && <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 text-sm text-muted-foreground">Creating resume…</div>}
    </div>
  );
}
