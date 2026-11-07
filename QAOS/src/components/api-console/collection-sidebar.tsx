"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronRight, ChevronDown, Plus, Trash2, FolderOpen } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/api-console/db";
import { deleteCollection } from "@/lib/api-console/repo/collections-repo";
import { deleteRequest } from "@/lib/api-console/repo/requests-repo";
import { setActiveEnvironment } from "@/lib/api-console/repo/environments-repo";
import { NewCollectionDialog } from "@/components/api-console/new-collection-dialog";
import { EnvironmentManagerDialog } from "@/components/api-console/environment-manager-dialog";
import { cn } from "@/lib/utils";
import type { Collection, SavedRequest, Environment } from "@/lib/api-console/types";

const METHOD_COLOR: Record<string, string> = {
  GET: "text-success",
  POST: "text-chart-2",
  PUT: "text-warning",
  PATCH: "text-warning",
  DELETE: "text-destructive",
  HEAD: "text-muted-foreground",
  OPTIONS: "text-muted-foreground",
};

function CollectionGroup({
  collection,
  selectedRequestId,
  onSelectRequest,
  onNewRequest,
}: {
  collection: Collection;
  selectedRequestId: string | null;
  onSelectRequest: (request: SavedRequest) => void;
  onNewRequest: (collectionId: string) => void;
}) {
  const [expanded, setExpanded] = React.useState(true);
  const requests = useLiveQuery(() => db.requests.where("collectionId").equals(collection.id).sortBy("createdAt"), [collection.id]) ?? [];

  return (
    <div className="flex flex-col">
      <div className="group flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-accent/50">
        <button type="button" onClick={() => setExpanded((v) => !v)} className="flex flex-1 items-center gap-1 text-left text-sm font-medium">
          {expanded ? <ChevronDown className="size-3.5 text-muted-foreground" /> : <ChevronRight className="size-3.5 text-muted-foreground" />}
          <span className="truncate">{collection.name}</span>
        </button>
        <button
          type="button"
          onClick={() => onNewRequest(collection.id)}
          className="text-muted-foreground opacity-0 hover:text-foreground group-hover:opacity-100"
          aria-label="New request"
        >
          <Plus className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete collection "${collection.name}" and its ${requests.length} request(s)?`)) void deleteCollection(collection.id);
          }}
          className="text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
          aria-label="Delete collection"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
      {expanded && (
        <div className="ml-4 flex flex-col gap-0.5 border-l border-border pl-2">
          {requests.length === 0 && <p className="px-2 py-1 text-xs text-muted-foreground">No requests yet.</p>}
          {requests.map((r) => (
            <div key={r.id} className="group flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSelectRequest(r)}
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1 text-left text-xs hover:bg-accent/50",
                  selectedRequestId === r.id && "bg-accent"
                )}
              >
                <span className={cn("w-12 shrink-0 font-mono font-semibold", METHOD_COLOR[r.method])}>{r.method}</span>
                <span className="truncate">{r.name}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete request "${r.name}"?`)) void deleteRequest(r.id);
                }}
                className="text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
                aria-label="Delete request"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CollectionSidebar({
  selectedRequestId,
  onSelectRequest,
  onNewRequest,
}: {
  selectedRequestId: string | null;
  onSelectRequest: (request: SavedRequest) => void;
  onNewRequest: (collectionId: string) => void;
}) {
  const collections = useLiveQuery(() => db.collections.orderBy("createdAt").toArray(), []) ?? [];
  const environments = useLiveQuery(() => db.environments.orderBy("createdAt").toArray(), []) ?? [];
  const activeEnvironment = environments.find((e) => e.isActive) ?? null;

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto border-r border-border p-3">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Environment</Label>
          <EnvironmentManagerDialog />
        </div>
        <Select
          value={activeEnvironment?.id ?? "none"}
          onValueChange={(v) => v !== null && setActiveEnvironment(v === "none" ? null : v)}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue>{(v: string) => (v === "none" ? "No environment" : (environments.find((e) => e.id === v)?.name ?? v))}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No environment</SelectItem>
            {environments.map((e: Environment) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Collections</Label>
        {collections.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-6 text-center">
            <FolderOpen className="size-5 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No collections yet.</p>
          </div>
        )}
        {collections.map((c) => (
          <CollectionGroup key={c.id} collection={c} selectedRequestId={selectedRequestId} onSelectRequest={onSelectRequest} onNewRequest={onNewRequest} />
        ))}
        <NewCollectionDialog />
      </div>
    </div>
  );
}
