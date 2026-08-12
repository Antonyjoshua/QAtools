"use client";

import Link from "next/link";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { exportCheatSheetToPDF } from "@/lib/learn/export/cheatsheet-pdf";
import { Button } from "@/components/ui/button";
import type { CheatSheet } from "@/lib/learn/content/types";

export function CheatSheetView({ sheet }: { sheet: CheatSheet }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="no-print">
        <Link href="/learn/cheatsheets" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Cheat Sheets
        </Link>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{sheet.title}</h1>
            <p className="mt-1 text-muted-foreground">{sheet.description}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
              <Printer className="size-3.5" />
              Print
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => exportCheatSheetToPDF(sheet)}>
              <Download className="size-3.5" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="print-only mb-4">
        <h1 className="text-xl font-bold">{sheet.title}</h1>
        <p className="text-sm text-muted-foreground">{sheet.description}</p>
      </div>

      <div className="flex flex-col gap-6">
        {sheet.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">{section.heading}</h2>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {section.items.map((item, i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-muted/30" : undefined}>
                      <td className="w-1/3 border-b border-border/60 px-3 py-2 font-mono text-xs font-medium whitespace-pre-wrap">{item.term}</td>
                      <td className="border-b border-border/60 px-3 py-2 text-muted-foreground">{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
