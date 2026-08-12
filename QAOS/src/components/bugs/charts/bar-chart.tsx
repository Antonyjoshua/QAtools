"use client";

export interface BarDatum {
  label: string;
  value: number;
}

/**
 * Horizontal magnitude-comparison bar chart. Single sequential hue (brand
 * primary) — identity isn't the job here, comparing counts is, so per the
 * dataviz method this stays one hue rather than a categorical rainbow.
 */
export function HorizontalBarChart({ data, emptyLabel = "No data yet" }: { data: BarDatum[]; emptyLabel?: string }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex flex-col gap-2.5">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-xs text-muted-foreground" title={d.label}>
            {d.label}
          </span>
          <div className="h-4 flex-1 overflow-hidden rounded bg-muted">
            <div
              className="h-full rounded bg-primary transition-all"
              style={{ width: `${Math.max(3, (d.value / max) * 100)}%` }}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-xs font-medium tabular-nums text-foreground">{d.value}</span>
        </div>
      ))}
    </div>
  );
}
