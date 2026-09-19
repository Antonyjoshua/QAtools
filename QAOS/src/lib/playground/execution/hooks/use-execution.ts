"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";

export function useExecutionsForRequirement(requirementId: string) {
  return (
    useLiveQuery(async () => {
      const list = await db.executions.where("requirementId").equals(requirementId).toArray();
      return list.sort((a, b) => (a.startedAt < b.startedAt ? -1 : 1));
    }, [requirementId]) ?? []
  );
}

export function useExecutionResults(executionId: string | null) {
  return (
    useLiveQuery(
      () => (executionId ? db.executionResults.where("executionId").equals(executionId).toArray() : []),
      [executionId]
    ) ?? []
  );
}
