"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, RefreshCw, Star, BookmarkPlus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { OptionsForm } from "@/components/generator/options-form";
import { ExportBar } from "@/components/generator/export-bar";
import { DataTable } from "@/components/generator/data-view/data-table";
import { JsonView } from "@/components/generator/data-view/json-view";
import { CodeView } from "@/components/generator/data-view/code-view";
import { getCategory } from "@/lib/generator/categories";
import { getGeneratorBySlug } from "@/lib/generator/registry";
import type { GeneratorModule, OptionValues } from "@/lib/generator/types";
import { useAppStore } from "@/lib/generator/store";

const COUNT_PRESETS = [10, 25, 50, 100, 1000, 10000, 100000];

function defaultOptionValues(generator: GeneratorModule): OptionValues {
  const values: OptionValues = {};
  for (const opt of generator.options ?? []) {
    if (opt.default !== undefined) values[opt.key] = opt.default;
  }
  return values;
}

function readTemplateFromUrl(): { count?: number; options?: OptionValues } | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("tpl");
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

export function GeneratorRunner({ slug }: { slug: string }) {
  const generator = getGeneratorBySlug(slug);
  if (!generator) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Generator not found.</p>
      </div>
    );
  }
  return <GeneratorRunnerInner generator={generator} />;
}

function GeneratorRunnerInner({ generator }: { generator: GeneratorModule }) {
  const category = getCategory(generator.category);
  const [options, setOptions] = React.useState<OptionValues>(() => defaultOptionValues(generator));
  const [count, setCount] = React.useState<number>(generator.defaultCount ?? (generator.supportsBulk ? 25 : 1));
  const [tableRows, setTableRows] = React.useState<Record<string, unknown>[] | null>(null);
  const [textLines, setTextLines] = React.useState<string[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = React.useState(false);
  const [templateName, setTemplateName] = React.useState(generator.name);

  const isFavorite = useAppStore((s) => s.isFavorite(generator.slug));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const pushHistory = useAppStore((s) => s.pushHistory);
  const saveTemplate = useAppStore((s) => s.saveTemplate);

  const maxCount = generator.maxCount ?? 100000;
  const isTabular = generator.outputKind === "table" || generator.outputKind === "json";

  const runGenerateWith = React.useCallback(
    (effectiveOptions: OptionValues, effectiveCount: number) => {
      setLoading(true);
      window.requestAnimationFrame(() => {
        setTimeout(() => {
          const n = generator.supportsBulk ? Math.min(Math.max(1, Number(effectiveCount) || 1), maxCount) : 1;
          try {
            if (isTabular) {
              const rows: Record<string, unknown>[] = [];
              for (let i = 0; i < n; i++) {
                rows.push(generator.generate({ options: effectiveOptions, index: i, count: n }) as Record<string, unknown>);
              }
              setTableRows(rows);
              setTextLines(null);
            } else {
              const lines: string[] = [];
              for (let i = 0; i < n; i++) {
                lines.push(generator.generate({ options: effectiveOptions, index: i, count: n }) as string);
              }
              setTextLines(lines);
              setTableRows(null);
            }
            pushHistory({ slug: generator.slug, generatorName: generator.name, count: n, options: effectiveOptions });
          } catch {
            toast.error("Generation failed — check your option values");
          } finally {
            setLoading(false);
          }
        }, 10);
      });
    },
    [generator, maxCount, isTabular, pushHistory]
  );

  const runGenerate = React.useCallback(() => runGenerateWith(options, count), [runGenerateWith, options, count]);

  React.useEffect(() => {
    const tpl = readTemplateFromUrl();
    const effectiveOptions = { ...defaultOptionValues(generator), ...(tpl?.options ?? {}) };
    const effectiveCount = tpl?.count ?? generator.defaultCount ?? (generator.supportsBulk ? 25 : 1);
    if (tpl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill from ?tpl= URL param on mount
      setOptions(effectiveOptions);
      setCount(effectiveCount);
    }
    runGenerateWith(effectiveOptions, effectiveCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generator.slug]);

  function handleOptionChange(key: string, value: string | number | boolean) {
    setOptions((prev) => ({ ...prev, [key]: value }));
  }

  function handleSaveTemplate() {
    saveTemplate({ name: templateName || generator.name, slug: generator.slug, generatorName: generator.name, count, options });
    setTemplateDialogOpen(false);
    toast.success("Template saved");
  }

  const columns = generator.columns ?? (tableRows && tableRows[0] ? Object.keys(tableRows[0]) : []);
  const resultCount = tableRows?.length ?? textLines?.length ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href={`/generator/category/${generator.category}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to {category?.name ?? "category"}
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] font-normal">
              {category?.name}
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-normal capitalize">
              {generator.outputKind}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{generator.name}</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">{generator.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setTemplateDialogOpen(true)}>
            <BookmarkPlus className="size-3.5" />
            Save template
          </Button>
          <Button
            variant={isFavorite ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => toggleFavorite(generator.slug)}
          >
            <Star className={isFavorite ? "size-3.5 fill-current" : "size-3.5"} />
            {isFavorite ? "Favorited" : "Favorite"}
          </Button>
        </div>
      </div>

      {generator.note && (
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
          <p className="text-foreground/90">{generator.note}</p>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
        <OptionsForm options={generator.options ?? []} values={options} onChange={handleOptionChange} />

        <div className="flex flex-wrap items-end gap-3 border-t border-border pt-4">
          {generator.supportsBulk && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Row count</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  className="w-28"
                  min={1}
                  max={maxCount}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value) || 1)}
                />
                <div className="flex flex-wrap gap-1">
                  {COUNT_PRESETS.filter((p) => p <= maxCount).map((p) => (
                    <Button key={p} type="button" size="sm" variant={count === p ? "secondary" : "ghost"} className="h-7 px-2 text-xs" onClick={() => setCount(p)}>
                      {p.toLocaleString("en-US")}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <Button onClick={runGenerate} disabled={loading} className="gap-1.5">
            <RefreshCw className={loading ? "size-3.5 animate-spin" : "size-3.5"} />
            {loading ? "Generating…" : "Generate"}
          </Button>
          {resultCount > 0 && <span className="text-xs text-muted-foreground">{resultCount.toLocaleString("en-US")} generated</span>}
        </div>
      </div>

      <div className="mb-4">
        <ExportBar
          outputKind={generator.outputKind}
          tableRows={tableRows}
          textLines={textLines}
          baseName={generator.slug}
          title={generator.name}
          language={generator.language}
        />
      </div>

      <div>
        {generator.outputKind === "table" && tableRows && <DataTable rows={tableRows} columns={columns} />}
        {generator.outputKind === "json" && tableRows && <JsonView rows={tableRows} />}
        {(generator.outputKind === "text" || generator.outputKind === "sql" || generator.outputKind === "code") && textLines && (
          <CodeView lines={textLines} language={generator.language} />
        )}
      </div>

      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as template</DialogTitle>
            <DialogDescription>Reuse this generator configuration later from your Templates page.</DialogDescription>
          </DialogHeader>
          <Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Template name" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
