"use client";

import * as React from "react";
import { RotateCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { OcrConversionOptions } from "@/lib/convert/adapters/ocr-adapter";

export function OcrOptionsForm({
  options,
  onChange,
  previewFile,
}: {
  options: Record<string, unknown>;
  onChange: (o: Record<string, unknown>) => void;
  previewFile?: File;
}) {
  const opts = options as OcrConversionOptions;
  const rotate = opts.rotateDegrees ?? 0;
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!previewFile) return;
    const url = URL.createObjectURL(previewFile);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must set in the same effect that creates the URL, or dev-mode double-invoke can revoke a URL a different mount is still rendering
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [previewFile]);

  function set(patch: Partial<OcrConversionOptions>) {
    onChange({ ...opts, ...patch });
  }

  return (
    <div className="flex flex-col gap-4">
      {previewUrl && (
        <div className="flex items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/20 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Rotation preview"
            className="max-h-40 max-w-full object-contain transition-transform"
            style={{ transform: `rotate(${rotate}deg)` }}
          />
        </div>
      )}

      <div>
        <Label className="mb-1.5 block text-xs text-muted-foreground">Rotate before reading{rotate ? ` — ${rotate}°` : ""}</Label>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => set({ rotateDegrees: (((rotate + 90) % 360) as OcrConversionOptions["rotateDegrees"]) })}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-accent/50"
          >
            <RotateCw className="size-3" /> Rotate 90°
          </button>
          {rotate !== 0 && (
            <button
              type="button"
              onClick={() => set({ rotateDegrees: 0 })}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-accent/50"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Label className="text-sm font-normal">Handwriting mode</Label>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Boosts contrast and sharpness for pen/pencil strokes. Works best on clear block/print handwriting on plain paper — cursive or messy
            handwriting still won&rsquo;t be reliable; there&rsquo;s no offline model for that.
          </p>
        </div>
        <Switch checked={opts.handwriting ?? false} onCheckedChange={(v) => set({ handwriting: Boolean(v) })} />
      </div>
    </div>
  );
}
