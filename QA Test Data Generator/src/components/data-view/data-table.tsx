"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PREVIEW_LIMIT = 300;

function cellDisplay(value: unknown): React.ReactNode {
  if (value === null) return <span className="text-muted-foreground italic">null</span>;
  if (value === undefined) return <span className="text-muted-foreground italic">undefined</span>;
  if (typeof value === "boolean") return <span className={value ? "text-success" : "text-destructive"}>{String(value)}</span>;
  if (typeof value === "object") return <code className="text-xs">{JSON.stringify(value)}</code>;
  return String(value);
}

export function DataTable({ rows, columns }: { rows: Record<string, unknown>[]; columns: string[] }) {
  const visible = rows.slice(0, PREVIEW_LIMIT);

  return (
    <div className="flex flex-col gap-2">
      <div className="max-h-[560px] overflow-auto rounded-lg border border-border scrollbar-thin">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card">
            <TableRow>
              <TableHead className="w-12 text-right text-muted-foreground">#</TableHead>
              {columns.map((c) => (
                <TableHead key={c} className="whitespace-nowrap font-mono text-xs">
                  {c}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="text-right text-xs text-muted-foreground">{i + 1}</TableCell>
                {columns.map((c) => (
                  <TableCell key={c} className="whitespace-nowrap text-sm">
                    {cellDisplay(row[c])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {rows.length > PREVIEW_LIMIT && (
        <p className="text-xs text-muted-foreground">
          Showing first {PREVIEW_LIMIT.toLocaleString("en-US")} of {rows.length.toLocaleString("en-US")} rows in preview — exports include the full
          dataset.
        </p>
      )}
    </div>
  );
}
