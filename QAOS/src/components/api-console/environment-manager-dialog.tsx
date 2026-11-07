"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Settings2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { db } from "@/lib/api-console/db";
import { createEnvironment, updateEnvironment, deleteEnvironment } from "@/lib/api-console/repo/environments-repo";
import { KeyValueEditor } from "@/components/api-console/key-value-editor";
import type { Environment } from "@/lib/api-console/types";

const EMPTY_ENVIRONMENTS: Environment[] = [];

export function EnvironmentManagerDialog() {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const environments = useLiveQuery(() => db.environments.orderBy("createdAt").toArray(), []) ?? EMPTY_ENVIRONMENTS;
  const selected = environments.find((e) => e.id === selectedId) ?? environments[0] ?? null;

  async function handleAdd() {
    const env = await createEnvironment(`Environment ${environments.length + 1}`);
    setSelectedId(env.id);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => setOpen(true)}>
        <Settings2 className="size-3.5" />
        Manage
      </Button>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Environments</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-[160px_1fr] gap-4">
          <div className="flex flex-col gap-1">
            {environments.map((env) => (
              <button
                key={env.id}
                type="button"
                onClick={() => setSelectedId(env.id)}
                className={`rounded-md px-2 py-1.5 text-left text-sm ${
                  (selected?.id ?? "") === env.id ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                }`}
              >
                {env.name}
              </button>
            ))}
            <Button size="sm" variant="ghost" className="mt-1 justify-start gap-1.5 text-xs" onClick={handleAdd}>
              <Plus className="size-3.5" />
              New environment
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {!selected ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No environments yet.</p>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">Name</Label>
                    <Input value={selected.name} onChange={(e) => updateEnvironment(selected.id, { name: e.target.value })} className="h-8" />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="mt-5 size-8 text-destructive"
                    onClick={async () => {
                      await deleteEnvironment(selected.id);
                      setSelectedId(null);
                    }}
                    aria-label="Delete environment"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">Variables — use as {"{{key}}"} in requests</Label>
                  <KeyValueEditor
                    rows={selected.variables}
                    onChange={(rows) => updateEnvironment(selected.id, { variables: rows })}
                    keyPlaceholder="baseUrl"
                    valuePlaceholder="https://api.example.com"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
