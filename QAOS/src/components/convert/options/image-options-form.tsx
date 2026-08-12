"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { ImageConversionOptions } from "@/lib/convert/adapters/image-adapter";

export function ImageOptionsForm({
  outputFormat,
  options,
  onChange,
}: {
  outputFormat: string;
  options: Record<string, unknown>;
  onChange: (o: Record<string, unknown>) => void;
}) {
  const opts = options as ImageConversionOptions;
  const showQuality = outputFormat === "jpg" || outputFormat === "webp";
  const showBackground = outputFormat === "jpg" || outputFormat === "ico";

  function set(patch: Partial<ImageConversionOptions>) {
    onChange({ ...opts, ...patch });
  }

  return (
    <div className="flex flex-col gap-4">
      {showQuality && (
        <div>
          <Label className="text-xs text-muted-foreground">Quality — {opts.quality ?? 90}%</Label>
          <Slider className="mt-1.5" value={[opts.quality ?? 90]} min={10} max={100} step={5} onValueChange={(v) => set({ quality: Array.isArray(v) ? v[0] : v })} />
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Width (px)</Label>
          <Input
            type="number"
            placeholder="Original"
            value={opts.width ?? ""}
            onChange={(e) => set({ width: e.target.value ? Number(e.target.value) : undefined })}
            className="mt-1.5 h-8"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Height (px)</Label>
          <Input
            type="number"
            placeholder="Original"
            value={opts.height ?? ""}
            onChange={(e) => set({ height: e.target.value ? Number(e.target.value) : undefined })}
            className="mt-1.5 h-8"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Maintain aspect ratio</Label>
        <Switch checked={opts.maintainAspectRatio ?? true} onCheckedChange={(v) => set({ maintainAspectRatio: Boolean(v) })} />
      </div>
      {showBackground && (
        <div>
          <Label className="text-xs text-muted-foreground">Background color (for transparency)</Label>
          <input
            type="color"
            value={opts.backgroundColor ?? "#ffffff"}
            onChange={(e) => set({ backgroundColor: e.target.value })}
            className="mt-1.5 h-8 w-16 cursor-pointer rounded border border-input bg-transparent p-0"
          />
        </div>
      )}
    </div>
  );
}
