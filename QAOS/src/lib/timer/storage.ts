import { downloadBlob, rowsToCSV, type Row } from "@/lib/generator/export";
import { formatDurationLabel } from "./time-formatter";
import type { SessionHistoryEntry } from "./types";

function historyRowToCsvRow(entry: SessionHistoryEntry): Row {
  const completed = new Date(entry.completedAt);
  return {
    Name: entry.name,
    "Session Type": entry.sessionType,
    Duration: formatDurationLabel(entry.durationMs),
    "Completed Date": completed.toLocaleDateString(),
    "Completed Time": completed.toLocaleTimeString(),
  };
}

export function exportSessionHistoryToCSV(entries: SessionHistoryEntry[]): void {
  const rows = entries.map(historyRowToCsvRow);
  downloadBlob(rowsToCSV(rows), "timer-session-history.csv", "text/csv");
}
