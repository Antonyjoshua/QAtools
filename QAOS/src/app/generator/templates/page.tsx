"use client";

import Link from "next/link";
import { LayoutTemplate, Trash2, Play } from "lucide-react";
import { useAppStore } from "@/lib/generator/store";
import { Button } from "@/components/ui/button";

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function TemplatesPage() {
  const templates = useAppStore((s) => s.templates);
  const deleteTemplate = useAppStore((s) => s.deleteTemplate);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
      <p className="mt-1 text-muted-foreground">Saved generator configurations you can reuse anytime.</p>

      {templates.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <LayoutTemplate className="size-8 text-muted-foreground" />
          <p className="text-muted-foreground">No saved templates yet. Save one from any generator page.</p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-2">
          {templates.map((tpl) => {
            const query = encodeURIComponent(JSON.stringify({ count: tpl.count, options: tpl.options }));
            return (
              <div key={tpl.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{tpl.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {tpl.generatorName} &middot; {tpl.count.toLocaleString("en-US")} rows &middot; saved {formatTime(tpl.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5"
                    render={
                      <Link href={`/generator/g/${tpl.slug}?tpl=${query}`}>
                        <Play className="size-3.5" />
                        Use
                      </Link>
                    }
                  />
                  <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => deleteTemplate(tpl.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
