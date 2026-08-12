"use client";

import { Download, Printer } from "lucide-react";
import { exportReport, type ExportFileFormat } from "@/lib/testcases/services/import-export";
import { ResultBadge } from "@/components/testcases/shared/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ReportData } from "@/lib/testcases/services/reports";

const FORMATS: { id: ExportFileFormat; label: string }[] = [
  { id: "csv", label: "CSV" },
  { id: "excel", label: "Excel (.xlsx)" },
  { id: "pdf", label: "PDF" },
  { id: "json", label: "JSON" },
];

export function ReportView({ report }: { report: ReportData }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{report.title}</h2>
          <p className="text-xs text-muted-foreground">
            {report.description} · Generated {new Date(report.generatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
            <Printer className="size-3.5" />
            Print
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button size="sm" className="gap-1.5">
                  <Download className="size-3.5" />
                  Export
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              {FORMATS.map((f) => (
                <DropdownMenuItem key={f.id} onClick={() => exportReport(report, f.id)}>
                  {f.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="no-print grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {report.stats.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardContent className="flex flex-col gap-1">
              <span className="text-xl font-semibold tabular-nums">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="no-print overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Module</th>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Last Result</th>
            </tr>
          </thead>
          <tbody>
            {report.rows.map((row) => (
              <tr key={row.displayId} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{row.displayId}</td>
                <td className="px-3 py-2">{row.title}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{row.module || "—"}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{row.priority}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{row.status}</td>
                <td className="px-3 py-2">
                  <ResultBadge value={row.lastResult} />
                </td>
              </tr>
            ))}
            {report.rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  No test cases match this report.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="print-only mx-auto max-w-3xl p-8 text-black">
        <h1 className="text-2xl font-bold">{report.title}</h1>
        <p className="text-sm text-gray-600">
          {report.description} · Generated {new Date(report.generatedAt).toLocaleString()}
        </p>
        <table className="mt-4 w-full border-collapse text-sm">
          <tbody>
            {report.stats.map((stat) => (
              <tr key={stat.label}>
                <th className="border border-gray-300 bg-gray-100 px-2 py-1 text-left">{stat.label}</th>
                <td className="border border-gray-300 px-2 py-1">{stat.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="mt-4 w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 px-2 py-1 text-left">ID</th>
              <th className="border border-gray-300 bg-gray-100 px-2 py-1 text-left">Title</th>
              <th className="border border-gray-300 bg-gray-100 px-2 py-1 text-left">Status</th>
              <th className="border border-gray-300 bg-gray-100 px-2 py-1 text-left">Last Result</th>
            </tr>
          </thead>
          <tbody>
            {report.rows.map((row) => (
              <tr key={row.displayId}>
                <td className="border border-gray-300 px-2 py-1">{row.displayId}</td>
                <td className="border border-gray-300 px-2 py-1">{row.title}</td>
                <td className="border border-gray-300 px-2 py-1">{row.status}</td>
                <td className="border border-gray-300 px-2 py-1">{row.lastResult}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
