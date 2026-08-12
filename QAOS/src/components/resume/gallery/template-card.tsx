"use client";

import { Star, ShieldCheck } from "lucide-react";
import { TemplateThumbnail } from "@/components/resume/shared/template-thumbnail";
import { useResumeSettings } from "@/lib/resume/settings-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ResumeTemplate } from "@/lib/resume/types";

export function TemplateCard({ template, onSelect }: { template: ResumeTemplate; onSelect: (template: ResumeTemplate) => void }) {
  const isFavorite = useResumeSettings((s) => s.isFavoriteTemplate(template.id));
  const toggleFavorite = useResumeSettings((s) => s.toggleFavoriteTemplate);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      <button type="button" onClick={() => onSelect(template)} className="relative flex justify-center border-b border-border bg-muted/40 p-3">
        <TemplateThumbnail template={template} />
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
          <span className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">Use this template</span>
        </div>
      </button>
      <div className="flex items-start justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{template.name}</p>
          <p className="truncate text-xs text-muted-foreground">{template.category}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(template.id);
          }}
        >
          <Star className={cn("size-4", isFavorite && "fill-yellow-400 text-yellow-500")} />
        </Button>
      </div>
      {template.atsFriendly && (
        <div className="flex items-center gap-1 px-3 pb-3 text-[11px] text-success">
          <ShieldCheck className="size-3" />
          ATS-friendly
        </div>
      )}
    </div>
  );
}
