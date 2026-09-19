"use client";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { BUG_REGISTRY } from "@/lib/playground/bug-registry/registry";
import { useBugToggleStore } from "@/lib/playground/bug-registry/toggle-store";

export function BugToggleTable() {
  const overrides = useBugToggleStore((s) => s.overrides);
  const setActive = useBugToggleStore((s) => s.setActive);

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
            <th className="p-2">ID</th>
            <th className="p-2">Title</th>
            <th className="p-2">Module</th>
            <th className="p-2">Severity</th>
            <th className="p-2">Category</th>
            <th className="p-2 text-right">Active</th>
          </tr>
        </thead>
        <tbody>
          {BUG_REGISTRY.map((bug) => {
            const active = overrides[bug.id] ?? true;
            return (
              <tr key={bug.id} className="border-b border-border last:border-0">
                <td className="p-2 font-mono text-xs">{bug.id}</td>
                <td className="p-2">{bug.title}</td>
                <td className="p-2 text-muted-foreground">{bug.module}</td>
                <td className="p-2">
                  <Badge variant="outline">{bug.severity}</Badge>
                </td>
                <td className="p-2 text-muted-foreground">{bug.category}</td>
                <td className="p-2 text-right">
                  <Switch checked={active} onCheckedChange={(checked) => setActive(bug.id, checked)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
