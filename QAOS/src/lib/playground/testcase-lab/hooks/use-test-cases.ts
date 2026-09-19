"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";

export function useTestCasesForRequirement(requirementId: string) {
  return (
    useLiveQuery(
      () => db.testCases.where("requirementId").equals(requirementId).toArray(),
      [requirementId]
    ) ?? []
  );
}

export function useAllTestCases() {
  return useLiveQuery(() => db.testCases.toArray(), []) ?? [];
}
