"use client";

import * as React from "react";
import { Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PRESETS = [
  { label: "Profile Photo (400×400)", value: "profile", width: 400, height: 400 },
  { label: "Product Image (800×800)", value: "product", width: 800, height: 800 },
  { label: "Avatar (128×128)", value: "avatar", width: 128, height: 128 },
  { label: "Banner (1200×300)", value: "banner", width: 1200, height: 300 },
  { label: "Thumbnail (300×200)", value: "thumbnail", width: 300, height: 200 },
  { label: "Custom", value: "custom", width: 600, height: 400 },
];

const PALETTES: [string, string][] = [
  ["#635bff", "#8a7dff"],
  ["#22c55e", "#16a34a"],
  ["#f59e0b", "#ef4444"],
  ["#06b6d4", "#3b82f6"],
  ["#ec4899", "#a855f7"],
  ["#64748b", "#334155"],
];

export function ImageStudioClient() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [preset, setPreset] = React.useState("profile");
  const [width, setWidth] = React.useState(400);
  const [height, setHeight] = React.useState(400);
  const [label, setLabel] = React.useState("TD");
  const [paletteIndex, setPaletteIndex] = React.useState(0);
  const [format, setFormat] = React.useState<"png" | "jpeg">("png");

  React.useEffect(() => {
    const found = PRESETS.find((p) => p.value === preset);
    if (found && found.value !== "custom") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync width/height to selected preset
      setWidth(found.width);
      setHeight(found.height);
    }
  }, [preset]);

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const [c1, c2] = PALETTES[paletteIndex];
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, c1);
    gradient.addColorStop(1, c2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = Math.max(1, Math.min(width, height) * 0.01);
    for (let x = -height; x < width; x += Math.max(20, Math.min(width, height) * 0.08)) {
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.lineTo(x + height, 0);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    const fontSize = Math.max(14, Math.min(width, height) * 0.22);
    ctx.font = `700 ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label.slice(0, 6) || `${width}×${height}`, width / 2, height / 2);

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = `500 ${Math.max(10, fontSize * 0.3)}px Arial, sans-serif`;
    ctx.fillText(`${width} × ${height}`, width / 2, height / 2 + fontSize * 0.75);
  }, [width, height, label, paletteIndex]);

  React.useEffect(() => {
    draw();
  }, [draw]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mime = format === "png" ? "image/png" : "image/jpeg";
    const url = canvas.toDataURL(mime, 0.92);
    const a = document.createElement("a");
    a.href = url;
    a.download = `placeholder-${width}x${height}.${format}`;
    a.click();
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_1fr]">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Preset</Label>
          <Select value={preset} onValueChange={(v) => v !== null && setPreset(v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRESETS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Width (px)</Label>
            <Input type="number" min={16} max={4000} value={width} onChange={(e) => setWidth(Number(e.target.value) || 16)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Height (px)</Label>
            <Input type="number" min={16} max={4000} value={height} onChange={(e) => setHeight(Number(e.target.value) || 16)} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Overlay label</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={6} placeholder="e.g. TD" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Color palette</Label>
          <div className="flex flex-wrap gap-2">
            {PALETTES.map(([c1, c2], i) => (
              <button
                key={i}
                onClick={() => setPaletteIndex(i)}
                className="size-8 rounded-full border-2 transition-transform hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${c1}, ${c2})`,
                  borderColor: paletteIndex === i ? "var(--primary)" : "transparent",
                }}
                aria-label={`Palette ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Format</Label>
          <Select value={format} onValueChange={(v) => v !== null && setFormat(v as "png" | "jpeg")}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleDownload} className="mt-2 gap-1.5">
          <Download className="size-3.5" />
          Download image
        </Button>
      </div>

      <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8">
        {width > 0 && height > 0 ? (
          <canvas ref={canvasRef} className="max-h-[520px] max-w-full rounded-lg shadow-lg" style={{ aspectRatio: `${width} / ${height}` }} />
        ) : (
          <ImageIcon className="size-8 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
