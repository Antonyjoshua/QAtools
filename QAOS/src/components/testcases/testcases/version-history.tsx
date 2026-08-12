"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { RotateCcw, PlusCircle, Pencil, History as HistoryIcon } from "lucide-react";
import { getHistoryForTestCase } from "@/lib/testcases/repo/history-repo";
import { restoreVersion } from "@/lib/testcases/repo/history-repo";
import { useTestManagementSettings } from "@/lib/testcases/settings-store";
import { Button } from "@/components/ui/button";

const ACTION_ICON = { created: PlusCircle, updated: Pencil, restored: RotateCcw } as const;

export function VersionHistory({ testCaseId }: { testCaseId: string }) {
  const history = useLiveQuery(() => getHistoryForTestCase(testCaseId), [testCaseId]) ?? [];
  const currentUser = useTestManagementSettings((s) => s.currentUser);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <HistoryIcon className="size-6 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No changes recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border rounded-xl border border-border">
      {history.map((entry, index) => {
        const Icon = ACTION_ICON[entry.action];
        return (
          <div key={entry.id} className="flex items-center gap-3 px-3 py-2.5">
            <Icon className="size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">
                <span className="font-medium">{entry.changedBy}</span> — {entry.summary}
              </p>
              <p className="text-xs text-muted-foreground">{new Date(entry.changedAt).toLocaleString()}</p>
            </div>
            {index !== 0 && (
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => restoreVersion(entry.id, currentUser)}>
                <RotateCcw className="size-3" />
                Restore
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
