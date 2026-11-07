"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2, FileQuestion } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { deleteRequirement } from "@/lib/testcases/repo/requirements-repo";
import { NewRequirementDialog } from "@/components/testcases/requirements/new-requirement-dialog";
import type { Requirement } from "@/lib/testcases/types";

export function RequirementList({
  projectId,
  requirements,
  testCaseCountByRequirement,
}: {
  projectId: string;
  requirements: Requirement[];
  testCaseCountByRequirement: Map<string, number>;
}) {
  const [editing, setEditing] = React.useState<Requirement | null>(null);

  async function handleDelete(r: Requirement) {
    try {
      await deleteRequirement(r.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete requirement");
    }
  }

  if (requirements.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-14 text-center">
        <FileQuestion className="size-6 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No requirements yet — add one to start tracing test coverage back to it.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Requirement</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Test cases</TableHead>
            <TableHead className="w-20 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requirements.map((r) => {
            const count = testCaseCountByRequirement.get(r.id) ?? 0;
            return (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.requirementId}</TableCell>
                <TableCell>
                  <p className="text-sm font-medium">{r.title}</p>
                  {r.description && <p className="line-clamp-1 text-xs text-muted-foreground">{r.description}</p>}
                </TableCell>
                <TableCell>
                  {count > 0 ? (
                    <Link href={`/testcases/projects/${projectId}`} className="hover:text-primary">
                      <Badge variant="outline">{count} test case{count === 1 ? "" : "s"}</Badge>
                    </Link>
                  ) : (
                    <Badge variant="outline" className="border-warning/40 text-warning">
                      No test cases
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(r)}
                      className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label={`Edit ${r.requirementId}`}
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(r)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Delete ${r.requirementId}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {editing && (
        <NewRequirementDialog projectId={projectId} requirement={editing} open={Boolean(editing)} onOpenChange={(o) => !o && setEditing(null)} hideTrigger />
      )}
    </div>
  );
}
