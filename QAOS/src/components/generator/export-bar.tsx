"use client";

import * as React from "react";
import { toast } from "sonner";
import { Copy, FileJson, FileSpreadsheet, FileCode2, FileText, FileType, FileOutput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard, downloadBlob, downloadTextAsPDF, exportRows, rowsToCSV, type ExportFormat } from "@/lib/generator/export";
import type { OutputKind } from "@/lib/generator/types";

const LANG_EXT: Record<string, string> = {
  sql: "sql",
  java: "java",
  robotframework: "robot",
  bash: "sh",
  json: "json",
};

interface ExportBarProps {
  outputKind: OutputKind;
  tableRows: Record<string, unknown>[] | null;
  textLines: string[] | null;
  baseName: string;
  title: string;
  language?: string;
}

function ExportButton({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" className="gap-1.5" onClick={onClick}>
      {icon}
      {label}
    </Button>
  );
}

export function ExportBar({ outputKind, tableRows, textLines, baseName, title, language }: ExportBarProps) {
  const isTabular = outputKind === "table" || outputKind === "json";

  async function handleCopy() {
    try {
      if (isTabular && tableRows) {
        const text = outputKind === "table" ? rowsToCSV(tableRows) : JSON.stringify(tableRows, null, 2);
        await copyToClipboard(text);
      } else if (textLines) {
        await copyToClipboard(textLines.join("\n\n"));
      }
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed — your browser may be blocking clipboard access");
    }
  }

  function handleTabularExport(format: ExportFormat) {
    if (!tableRows || tableRows.length === 0) return;
    try {
      exportRows(tableRows, format, baseName, title);
      toast.success(`Exported ${tableRows.length.toLocaleString("en-US")} rows as ${format.toUpperCase()}`);
    } catch {
      toast.error("Export failed");
    }
  }

  function handleTextDownload() {
    if (!textLines) return;
    const ext = language ? (LANG_EXT[language] ?? "txt") : "txt";
    downloadBlob(textLines.join("\n\n"), `${baseName}.${ext}`, "text/plain");
    toast.success(`Downloaded .${ext} file`);
  }

  function handleTextPdf() {
    if (!textLines) return;
    downloadTextAsPDF(textLines.join("\n\n"), `${baseName}.pdf`, title);
    toast.success("Downloaded PDF");
  }

  if (isTabular) {
    const rows = tableRows ?? [];
    const disabled = rows.length === 0;
    return (
      <div className="flex flex-wrap items-center gap-2">
        <ExportButton label="Copy" icon={<Copy className="size-3.5" />} onClick={handleCopy} />
        <ExportButton label="CSV" icon={<FileText className="size-3.5" />} onClick={() => handleTabularExport("csv")} />
        <ExportButton label="Excel" icon={<FileSpreadsheet className="size-3.5" />} onClick={() => handleTabularExport("excel")} />
        <ExportButton label="JSON" icon={<FileJson className="size-3.5" />} onClick={() => handleTabularExport("json")} />
        <ExportButton label="XML" icon={<FileCode2 className="size-3.5" />} onClick={() => handleTabularExport("xml")} />
        <ExportButton label="YAML" icon={<FileCode2 className="size-3.5" />} onClick={() => handleTabularExport("yaml")} />
        <ExportButton label="SQL" icon={<FileOutput className="size-3.5" />} onClick={() => handleTabularExport("sql")} />
        <ExportButton label="PDF" icon={<FileType className="size-3.5" />} onClick={() => handleTabularExport("pdf")} />
        {disabled && <span className="text-xs text-muted-foreground">Generate data to enable exports</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ExportButton label="Copy" icon={<Copy className="size-3.5" />} onClick={handleCopy} />
      <ExportButton label="Download" icon={<FileText className="size-3.5" />} onClick={handleTextDownload} />
      <ExportButton label="PDF" icon={<FileType className="size-3.5" />} onClick={handleTextPdf} />
    </div>
  );
}
