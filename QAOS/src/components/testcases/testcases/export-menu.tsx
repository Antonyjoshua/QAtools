"use client";

import { Download } from "lucide-react";
import { exportTestCases, type ExportFileFormat } from "@/lib/testcases/services/import-export";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { TestCase } from "@/lib/testcases/types";

const FORMATS: { id: ExportFileFormat; label: string }[] = [
  { id: "csv", label: "CSV" },
  { id: "excel", label: "Excel (.xlsx)" },
  { id: "pdf", label: "PDF" },
  { id: "json", label: "JSON" },
];

export function ExportMenu({ testCases, baseName = "test-cases" }: { testCases: TestCase[]; baseName?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5" disabled={testCases.length === 0}>
            <Download className="size-3.5" />
            Export
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {FORMATS.map((f) => (
          <DropdownMenuItem key={f.id} onClick={() => exportTestCases(testCases, f.id, baseName)}>
            {f.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
