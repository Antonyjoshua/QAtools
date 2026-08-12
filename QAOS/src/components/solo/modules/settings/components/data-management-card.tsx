"use client";

import { useRef } from "react";
import { Download, Upload, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/solo/ui/card";
import { Button } from "@/components/solo/ui/button";
import { useAppStore } from "@/lib/solo/store/useAppStore";

export function DataManagementCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resetProgress = useAppStore((s) => s.resetProgress);

  function handleExport() {
    const state = useAppStore.getState();
    const exportable = Object.fromEntries(
      Object.entries(state).filter(([key, value]) => typeof value !== "function" && key !== "hasHydrated")
    );
    const blob = new Blob([JSON.stringify(exportable, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qa-level-up-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      useAppStore.setState(parsed);
      toast.success("Progress imported.");
    } catch {
      toast.error("Couldn't read that file.");
    } finally {
      e.target.value = "";
    }
  }

  function handleReset() {
    if (window.confirm("Reset all progress? This cannot be undone.")) {
      resetProgress();
      toast.success("Progress reset.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data</CardTitle>
        <CardDescription>
          Everything is stored locally in this browser. Back it up before clearing site data, or
          start fresh.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" />
          Export Backup
        </Button>
        <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-3.5 w-3.5" />
          Import Backup
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button variant="destructive" size="sm" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Progress
        </Button>
      </CardContent>
    </Card>
  );
}
