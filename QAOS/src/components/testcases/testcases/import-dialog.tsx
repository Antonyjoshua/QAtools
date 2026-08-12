"use client";

import * as React from "react";
import { Upload, CheckCircle2, XCircle } from "lucide-react";
import { importTestCasesFromFile, type ImportRowResult } from "@/lib/testcases/services/import-export";
import { useTestManagementSettings } from "@/lib/testcases/settings-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export function ImportDialog({ projectId, suiteId }: { projectId: string; suiteId: string }) {
  const currentUser = useTestManagementSettings((s) => s.currentUser);
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [results, setResults] = React.useState<ImportRowResult[] | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setResults(null);
    try {
      const rows = await importTestCasesFromFile(file, projectId, suiteId, currentUser);
      setResults(rows);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const successCount = results?.filter((r) => r.ok).length ?? 0;
  const failCount = results ? results.length - successCount : 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setResults(null);
      }}
    >
      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setOpen(true)}>
        <Upload className="size-3.5" />
        Import
      </Button>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import test cases</DialogTitle>
          <DialogDescription>Import from CSV, Excel, or JSON into this suite. Rows need at least a Title.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.json,.xlsx,.xls"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex flex-col items-center gap-1.5 rounded-lg border border-dashed border-border py-8 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-60"
          >
            <Upload className="size-5" />
            <span className="text-sm font-medium">{busy ? "Importing…" : "Choose a file"}</span>
            <span className="text-xs">.csv, .xlsx, or .json</span>
          </button>

          {results && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">
                <span className="text-success">{successCount} imported</span>
                {failCount > 0 && <span className="text-destructive"> · {failCount} failed</span>}
              </p>
              <div className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-lg border border-border p-2">
                {results.map((r) => (
                  <div key={r.row} className="flex items-center gap-2 text-xs">
                    {r.ok ? (
                      <CheckCircle2 className="size-3.5 shrink-0 text-success" />
                    ) : (
                      <XCircle className="size-3.5 shrink-0 text-destructive" />
                    )}
                    <span className="truncate">
                      Row {r.row}: {r.title}
                    </span>
                    {r.error && <span className="shrink-0 text-destructive">— {r.error}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {results ? "Done" : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
