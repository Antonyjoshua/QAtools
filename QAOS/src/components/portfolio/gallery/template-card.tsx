"use client";

import type { PortfolioTemplateDefinition } from "@/lib/portfolio/templates/registry";

export function TemplateCard({ template, onSelect }: { template: PortfolioTemplateDefinition; onSelect: (template: PortfolioTemplateDefinition) => void }) {
  return (
    <button type="button" onClick={() => onSelect(template)} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-colors hover:border-primary/40">
      <div className="relative flex h-32 items-center justify-center" style={{ background: template.gradient }}>
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
          <span className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">Use this template</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 p-3">
        <p className="text-sm font-medium">{template.name}</p>
        <p className="text-xs text-muted-foreground">{template.description}</p>
      </div>
    </button>
  );
}
