"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";

export function useBugReportsForMission(missionId: string) {
  return (
    useLiveQuery(async () => {
      const list = await db.bugReports.where("missionId").equals(missionId).toArray();
      return list.sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
    }, [missionId]) ?? []
  );
}

export function useAllBugReports() {
  return useLiveQuery(() => db.bugReports.toArray(), []) ?? [];
}

export function useDistinctBugsFoundCount(): number {
  const reports = useAllBugReports();
  const distinctIds = new Set(
    reports.filter((r) => r.matchedBugId).map((r) => r.matchedBugId as string)
  );
  return distinctIds.size;
}
