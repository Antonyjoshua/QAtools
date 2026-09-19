"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PORTFOLIO_TEMPLATES } from "@/lib/portfolio/templates/registry";
import { createPortfolioFromTemplate } from "@/lib/portfolio/repo/portfolios-repo";
import { TemplateCard } from "./template-card";
import type { PortfolioTemplateDefinition } from "@/lib/portfolio/templates/registry";

export function TemplateGallery() {
  const router = useRouter();
  const [busyId, setBusyId] = React.useState<string | null>(null);

  async function handleSelect(template: PortfolioTemplateDefinition) {
    setBusyId(template.id);
    try {
      const portfolio = await createPortfolioFromTemplate(template.id);
      router.push(`/resume/portfolio/${portfolio.id}`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PORTFOLIO_TEMPLATES.map((t) => (
          <TemplateCard key={t.id} template={t} onSelect={handleSelect} />
        ))}
      </div>
      {busyId && <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 text-sm text-muted-foreground">Creating portfolio…</div>}
    </div>
  );
}
