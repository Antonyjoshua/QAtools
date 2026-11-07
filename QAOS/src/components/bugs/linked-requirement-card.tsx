"use client";

import * as React from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { GitBranch, Link2, X } from "lucide-react";
import { db as testcasesDb } from "@/lib/testcases/db";
import { updateBug } from "@/lib/bugs/bugs-repo";
import { Button } from "@/components/ui/button";

export function LinkedRequirementCard({
  bugId,
  requirementId,
  requirementCode,
  onRequestLink,
}: {
  bugId: string;
  requirementId: string | null;
  requirementCode: string | null;
  onRequestLink: () => void;
}) {
  const requirement = useLiveQuery(() => (requirementId ? testcasesDb.requirements.get(requirementId) : undefined), [requirementId]);

  async function handleUnlink() {
    await updateBug(bugId, { linkedRequirementId: null, linkedRequirementCode: null });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-1.5 font-medium text-foreground">
          <GitBranch className="size-3.5" />
          Linked requirement
        </p>
        {requirementId && (
          <button type="button" onClick={handleUnlink} className="text-muted-foreground hover:text-destructive" aria-label="Unlink requirement">
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {!requirementId ? (
        <Button variant="outline" size="sm" className="gap-1.5" onClick={onRequestLink}>
          <Link2 className="size-3.5" />
          Link a requirement
        </Button>
      ) : requirement ? (
        <div className="flex flex-col gap-2">
          <Link href="/testcases/requirements" className="flex flex-col items-start gap-1 hover:text-foreground">
            <span className="font-mono text-foreground">{requirement.requirementId}</span>
            <span className="line-clamp-2 text-foreground">{requirement.title}</span>
          </Link>
          <button type="button" onClick={onRequestLink} className="self-start text-xs text-muted-foreground hover:text-foreground">
            Change link
          </button>
        </div>
      ) : (
        <p>{requirementCode ?? "Unknown requirement"} (no longer exists)</p>
      )}
    </div>
  );
}
