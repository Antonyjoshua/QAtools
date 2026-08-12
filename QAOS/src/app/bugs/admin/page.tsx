"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus, Trash2, Pencil, Check, X, Building2 } from "lucide-react";
import { db } from "@/lib/bugs/db";
import { uid } from "@/lib/bugs/id";
import type { Module, Feature, BuildVersion, TestEnvironment } from "@/lib/bugs/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function InlineAdd({ placeholder, onAdd }: { placeholder: string; onAdd: (name: string) => void }) {
  const [value, setValue] = React.useState("");
  function submit() {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
  }
  return (
    <div className="flex gap-1.5">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
        className="h-8 text-sm"
      />
      <Button size="sm" variant="outline" className="h-8 shrink-0 gap-1" onClick={submit}>
        <Plus className="size-3.5" />
        Add
      </Button>
    </div>
  );
}

function EditableRow({
  id,
  name,
  active,
  onSelect,
  onRename,
  onDelete,
}: {
  id: string;
  name: string;
  active?: boolean;
  onSelect?: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(name);

  if (editing) {
    return (
      <div className="flex items-center gap-1.5 rounded-md border border-border bg-card p-1.5">
        <Input value={value} onChange={(e) => setValue(e.target.value)} className="h-7 text-sm" autoFocus />
        <Button
          size="icon"
          variant="ghost"
          className="size-6"
          onClick={() => {
            if (value.trim()) onRename(value.trim());
            setEditing(false);
          }}
        >
          <Check className="size-3.5" />
        </Button>
        <Button size="icon" variant="ghost" className="size-6" onClick={() => setEditing(false)}>
          <X className="size-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-center justify-between gap-1.5 rounded-md px-2.5 py-1.5 text-sm",
        active ? "bg-accent text-accent-foreground" : "hover:bg-muted"
      )}
    >
      <button onClick={onSelect} className={cn("min-w-0 flex-1 truncate text-left", !onSelect && "cursor-default")}>
        {name}
      </button>
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100">
        <Button size="icon" variant="ghost" className="size-6" onClick={() => setEditing(true)}>
          <Pencil className="size-3" />
        </Button>
        <Button size="icon" variant="ghost" className="size-6 text-destructive" onClick={onDelete}>
          <Trash2 className="size-3" />
        </Button>
      </div>
      {/* keep id referenced for key stability elsewhere */}
      <span className="hidden">{id}</span>
    </div>
  );
}

export default function AdminPage() {
  const projects = useLiveQuery(() => db.projects.toArray(), []);
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null);
  const modules = useLiveQuery(
    () => (selectedProjectId ? db.modules.where("projectId").equals(selectedProjectId).toArray() : Promise.resolve([] as Module[])),
    [selectedProjectId]
  );
  const [selectedModuleId, setSelectedModuleId] = React.useState<string | null>(null);
  const features = useLiveQuery(
    () => (selectedModuleId ? db.features.where("moduleId").equals(selectedModuleId).toArray() : Promise.resolve([] as Feature[])),
    [selectedModuleId]
  );
  const builds = useLiveQuery(
    () => (selectedProjectId ? db.buildVersions.where("projectId").equals(selectedProjectId).toArray() : Promise.resolve([] as BuildVersion[])),
    [selectedProjectId]
  );
  const environments = useLiveQuery(
    () => (selectedProjectId ? db.environments.where("projectId").equals(selectedProjectId).toArray() : Promise.resolve([] as TestEnvironment[])),
    [selectedProjectId]
  );

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- default to the first project once loaded
    if (!selectedProjectId && projects && projects.length > 0) setSelectedProjectId(projects[0].id);
  }, [projects, selectedProjectId]);

  const selectedProject = (projects ?? []).find((p) => p.id === selectedProjectId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Projects & Modules</h1>
      <p className="mt-1 text-muted-foreground">Configure projects, modules, features, build versions, and test environments.</p>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Projects</p>
          <div className="flex flex-col gap-0.5">
            {(projects ?? []).map((p) => (
              <EditableRow
                key={p.id}
                id={p.id}
                name={p.name}
                active={p.id === selectedProjectId}
                onSelect={() => setSelectedProjectId(p.id)}
                onRename={(name) => db.projects.update(p.id, { name })}
                onDelete={async () => {
                  await db.projects.delete(p.id);
                  if (selectedProjectId === p.id) setSelectedProjectId(null);
                  toast.success("Project deleted");
                }}
              />
            ))}
          </div>
          <div className="mt-2">
            <InlineAdd
              placeholder="New project name"
              onAdd={async (name) => {
                const id = uid();
                await db.projects.add({ id, name, description: "", isFavorite: false, createdAt: Date.now() });
                setSelectedProjectId(id);
              }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          {!selectedProject ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
              <Building2 className="size-6" />
              Select or create a project to configure it.
            </div>
          ) : (
            <Tabs defaultValue="modules">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium">{selectedProject.name}</p>
                <TabsList>
                  <TabsTrigger value="modules">Modules</TabsTrigger>
                  <TabsTrigger value="builds">Build Versions</TabsTrigger>
                  <TabsTrigger value="environments">Environments</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="modules">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Modules</p>
                    <div className="flex flex-col gap-0.5">
                      {(modules ?? []).map((m) => (
                        <EditableRow
                          key={m.id}
                          id={m.id}
                          name={m.name}
                          active={m.id === selectedModuleId}
                          onSelect={() => setSelectedModuleId(m.id)}
                          onRename={(name) => db.modules.update(m.id, { name })}
                          onDelete={async () => {
                            await db.modules.delete(m.id);
                            if (selectedModuleId === m.id) setSelectedModuleId(null);
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-2">
                      <InlineAdd
                        placeholder="New module name"
                        onAdd={async (name) => {
                          const id = uid();
                          await db.modules.add({ id, projectId: selectedProject.id, name, isFavorite: false });
                          setSelectedModuleId(id);
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      {selectedModuleId ? "Features / Sub-features" : "Select a module to manage features"}
                    </p>
                    {selectedModuleId && (
                      <>
                        <div className="flex flex-col gap-0.5">
                          {(features ?? []).map((f) => (
                            <EditableRow
                              key={f.id}
                              id={f.id}
                              name={f.name}
                              onRename={(name) => db.features.update(f.id, { name })}
                              onDelete={() => db.features.delete(f.id)}
                            />
                          ))}
                        </div>
                        <div className="mt-2">
                          <InlineAdd
                            placeholder="New feature name"
                            onAdd={async (name) => {
                              await db.features.add({ id: uid(), moduleId: selectedModuleId, name });
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="builds">
                <div className="flex flex-col gap-0.5">
                  {(builds ?? []).map((b) => (
                    <EditableRow
                      key={b.id}
                      id={b.id}
                      name={`${b.version} — ${b.releaseName}`}
                      onRename={(name) => db.buildVersions.update(b.id, { version: name })}
                      onDelete={() => db.buildVersions.delete(b.id)}
                    />
                  ))}
                </div>
                <div className="mt-2">
                  <InlineAdd
                    placeholder="New build version (e.g. 1.3.0)"
                    onAdd={async (version) => {
                      await db.buildVersions.add({ id: uid(), projectId: selectedProject.id, version, releaseName: "", createdAt: Date.now() });
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="environments">
                <div className="flex flex-col gap-0.5">
                  {(environments ?? []).map((e) => (
                    <EditableRow
                      key={e.id}
                      id={e.id}
                      name={e.name}
                      onRename={(name) => db.environments.update(e.id, { name })}
                      onDelete={() => db.environments.delete(e.id)}
                    />
                  ))}
                </div>
                <div className="mt-2">
                  <InlineAdd
                    placeholder="New environment name (e.g. UAT)"
                    onAdd={async (name) => {
                      await db.environments.add({ id: uid(), projectId: selectedProject.id, name, url: "" });
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
