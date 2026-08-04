"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Trash2, Star, Pencil, Download, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHistoryStore, type HistoryEntry } from "@/store/history-store";
import { CATEGORY_META } from "@/lib/calculators/types";

function summaryToText(entry: HistoryEntry) {
  return entry.summary.map((s) => `${s.label}: ${s.value}`).join("\n");
}

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function HistoryPageInner() {
  const searchParams = useSearchParams();
  const entries = useHistoryStore((s) => s.entries);
  const removeEntry = useHistoryStore((s) => s.removeEntry);
  const toggleFavorite = useHistoryStore((s) => s.toggleFavorite);
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  const [filter, setFilter] = React.useState<"all" | "favorites">(
    searchParams.get("filter") === "favorites" ? "favorites" : "all"
  );

  const visible = filter === "favorites" ? entries.filter((e) => e.favorite) : entries;

  function handleCopy(entry: HistoryEntry) {
    navigator.clipboard.writeText(summaryToText(entry));
    toast.success("Copied to clipboard");
  }

  function handleExportAllCsv() {
    if (!visible.length) return;
    const rows = [["Calculator", "Category", "Date", "Result"]];
    for (const e of visible) {
      rows.push([e.calculatorName, CATEGORY_META[e.category]?.label ?? e.category, new Date(e.timestamp).toLocaleString(), summaryToText(e).replace(/\n/g, "; ")]);
    }
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadFile("qa-calculator-history.csv", csv, "text/csv");
    toast.success("History exported as CSV");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every calculation you&apos;ve saved, with edit, favorite, copy and export.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportAllCsv} disabled={!visible.length}>
            <Download className="mr-1.5 size-4" /> Export CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearHistory();
              toast.info("History cleared");
            }}
            disabled={!entries.length}
          >
            Clear all
          </Button>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "favorites")} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All ({entries.length})</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({entries.filter((e) => e.favorite).length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {visible.length === 0 ? (
        <div className="glass-card flex flex-col items-center gap-3 rounded-2xl p-12 text-center text-muted-foreground">
          <Inbox className="size-8" />
          <p>No calculations yet. Results you save will show up here.</p>
          <Button size="sm" nativeButton={false} render={<Link href="/">Browse calculators</Link>} />
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {visible.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="glass-card">
                  <CardContent className="flex flex-wrap items-start justify-between gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{entry.calculatorName}</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {CATEGORY_META[entry.category]?.label ?? entry.category}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        {entry.summary.slice(0, 4).map((s, i) => (
                          <span key={i} className="text-muted-foreground">
                            {s.label}: <span className="font-medium text-foreground">{s.value}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => toggleFavorite(entry.id)}
                        aria-label="Toggle favorite"
                      >
                        <Star className={entry.favorite ? "size-4 fill-yellow-400 text-yellow-500" : "size-4"} />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => handleCopy(entry)} aria-label="Copy">
                        <Copy className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label="Edit"
                        nativeButton={false}
                        render={
                          <Link
                            href={`/calculators/${entry.calculatorSlug}?state=${btoa(
                              encodeURIComponent(JSON.stringify(entry.inputs))
                            )}`}
                          >
                            <Pencil className="size-4" />
                          </Link>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 hover:text-destructive"
                        onClick={() => {
                          removeEntry(entry.id);
                          toast.info("Entry deleted");
                        }}
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  return (
    <React.Suspense fallback={null}>
      <HistoryPageInner />
    </React.Suspense>
  );
}
