"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TEMPLATES } from "@/lib/notes/templates";
import { createNote } from "@/lib/notes/notes-repo";
import { DynamicIcon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";

const CATEGORY_ORDER = ["Testing", "Checklists", "Reporting"] as const;

export default function TemplatesPage() {
  const router = useRouter();
  const [creatingId, setCreatingId] = React.useState<string | null>(null);

  async function applyTemplate(templateId: string) {
    setCreatingId(templateId);
    try {
      const template = TEMPLATES.find((t) => t.id === templateId);
      if (!template) return;
      const note = await createNote({
        title: template.name,
        contentJSON: template.build(),
        icon: template.icon,
        templateId: template.id,
      });
      router.push(`/notes/${note.id}`);
    } finally {
      setCreatingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
      <p className="mt-1 text-muted-foreground">Start from a ready-to-use QA document structure.</p>

      {CATEGORY_ORDER.map((cat) => (
        <div key={cat} className="mt-8">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">{cat}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.filter((t) => t.category === cat).map((t) => (
              <button
                key={t.id}
                onClick={() => applyTemplate(t.id)}
                disabled={creatingId !== null}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 disabled:opacity-60"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <DynamicIcon name={t.icon} className="size-4.5" />
                  </div>
                  <h3 className="font-medium tracking-tight">{t.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{t.description}</p>
                <Badge variant="secondary" className="w-fit text-[10px] font-normal">
                  {creatingId === t.id ? "Creating…" : "Use template"}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
