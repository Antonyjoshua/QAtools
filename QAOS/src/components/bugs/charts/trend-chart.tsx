"use client";

export interface TrendDatum {
  label: string;
  value: number;
}

/** Single-series time trend as columns — one hue, direct value labels on the cap. */
export function TrendChart({ data }: { data: TrendDatum[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-40 items-end gap-3 sm:gap-4">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
          <span className="text-xs font-medium tabular-nums text-foreground">{d.value}</span>
          <div className="flex h-28 w-full items-end">
            <div
              className="w-full rounded-t bg-primary transition-all"
              style={{ height: `${Math.max(2, (d.value / max) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
