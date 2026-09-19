"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, RefreshCw, Eraser, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DomainGeneratorConfig } from "@/components/generator/domains/domain-generator-config";
import { ExportBar } from "@/components/generator/export-bar";
import { DataTable } from "@/components/generator/data-view/data-table";
import { getDomain } from "@/lib/generator/domains/domains";
import { generateDomainRecords, defaultConfig } from "@/lib/generator/domains/engine";
import type { DomainCategoryDef, DomainGenConfig } from "@/lib/generator/domains/types";

export function DomainGeneratorRunner({ category }: { category: DomainCategoryDef }) {
  const domain = getDomain(category.domainId);
  const [config, setConfig] = React.useState<DomainGenConfig>(() => defaultConfig(category));
  const [rows, setRows] = React.useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = React.useState(false);

  function handleConfigChange(patch: Partial<DomainGenConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function runGenerate() {
    setLoading(true);
    window.requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          setRows(generateDomainRecords(category, config));
        } catch {
          toast.error("Generation failed — check your configuration");
        } finally {
          setLoading(false);
        }
      }, 10);
    });
  }

  function handleClear() {
    setRows(null);
  }

  const columns = category.fields.filter((f) => f.required || config.selectedFieldKeys.includes(f.key)).map((f) => f.key);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <Link href="/generator" className="hover:text-foreground">
          Test Data Generator
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/generator/domain" className="hover:text-foreground">
          Domain-wise Generator
        </Link>
        <ChevronRight className="size-3" />
        <Link href={`/generator/domain/${category.domainId}`} className="hover:text-foreground">
          {domain?.name ?? category.domainId}
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground">{category.name}</span>
      </div>

      <Link href={`/generator/domain/${category.domainId}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to {domain?.name ?? "domain"}
      </Link>

      <div className="mb-6">
        <Badge variant="secondary" className="mb-1 text-[10px] font-normal">
          {domain?.name}
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight">{category.name}</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">{category.description}</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
        <DomainGeneratorConfig category={category} config={config} onChange={handleConfigChange} />

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <Button onClick={runGenerate} disabled={loading} className="gap-1.5">
            <RefreshCw className={loading ? "size-3.5 animate-spin" : "size-3.5"} />
            {loading ? "Generating…" : rows ? "Regenerate" : "Generate"}
          </Button>
          <Button variant="outline" onClick={handleClear} disabled={!rows} className="gap-1.5">
            <Eraser className="size-3.5" />
            Clear
          </Button>
          {rows && rows.length > 0 && <span className="text-xs text-muted-foreground">{rows.length.toLocaleString("en-US")} generated</span>}
        </div>
      </div>

      <div className="mb-4">
        <ExportBar outputKind="table" tableRows={rows} textLines={null} baseName={`${category.domainId}-${category.id}`} title={category.name} />
      </div>

      <div>{rows && <DataTable rows={rows} columns={columns} />}</div>
    </div>
  );
}
