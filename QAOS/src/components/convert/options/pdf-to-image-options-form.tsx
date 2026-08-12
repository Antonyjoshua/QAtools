"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { PdfConversionOptions } from "@/lib/convert/adapters/pdf-adapter";

export function PdfToImageOptionsForm({
  outputFormat,
  options,
  onChange,
}: {
  outputFormat: string;
  options: Record<string, unknown>;
  onChange: (o: Record<string, unknown>) => void;
}) {
  const opts = options as PdfConversionOptions;
  function set(patch: Partial<PdfConversionOptions>) {
    onChange({ ...opts, ...patch });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label className="text-xs text-muted-foreground">Pages</Label>
        <Input
          placeholder="All pages — or e.g. 1,3,5"
          onChange={(e) => set({ pages: e.target.value ? e.target.value.split(",").map((s) => Number(s.trim())).filter(Boolean) : "all" })}
          className="mt-1.5 h-8"
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Resolution — {opts.resolution ?? 150} DPI</Label>
        <Slider className="mt-1.5" value={[opts.resolution ?? 150]} min={72} max={300} step={6} onValueChange={(v) => set({ resolution: Array.isArray(v) ? v[0] : v })} />
      </div>
      {outputFormat === "jpg" && (
        <div>
          <Label className="text-xs text-muted-foreground">Image quality — {opts.quality ?? 90}%</Label>
          <Slider className="mt-1.5" value={[opts.quality ?? 90]} min={10} max={100} step={5} onValueChange={(v) => set({ quality: Array.isArray(v) ? v[0] : v })} />
        </div>
      )}
    </div>
  );
}
