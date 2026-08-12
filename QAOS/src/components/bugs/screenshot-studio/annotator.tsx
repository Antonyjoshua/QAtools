"use client";

import * as React from "react";
import * as fabric from "fabric";
import {
  MousePointer2,
  Square,
  ArrowUpRight,
  Highlighter,
  EyeOff,
  Type,
  Trash2,
  Undo2,
  Redo2,
  Upload,
  Download,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Tool = "select" | "rect" | "arrow" | "highlight" | "blur" | "text";

const COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ffffff", "#111111"];

interface AnnotatorProps {
  initialImage?: Blob | null;
  onSave: (blob: Blob) => void | Promise<void>;
  saveLabel?: string;
}

export function ScreenshotAnnotator({ initialImage, onSave, saveLabel = "Download PNG" }: AnnotatorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasElRef = React.useRef<HTMLCanvasElement>(null);
  const fabricRef = React.useRef<fabric.Canvas | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const bgImageRef = React.useRef<fabric.FabricImage | null>(null);

  const [tool, setTool] = React.useState<Tool>("select");
  const [color, setColor] = React.useState(COLORS[0]);
  const [hasImage, setHasImage] = React.useState(false);
  const historyRef = React.useRef<{ stack: string[]; index: number; suspend: boolean }>({ stack: [], index: -1, suspend: false });
  const [historyState, setHistoryState] = React.useState({ canUndo: false, canRedo: false });
  const drawingRef = React.useRef<{ origin: { x: number; y: number } | null; obj: fabric.Object | null }>({ origin: null, obj: null });

  const updateHistoryState = React.useCallback(() => {
    const h = historyRef.current;
    setHistoryState({ canUndo: h.index > 0, canRedo: h.index < h.stack.length - 1 });
  }, []);

  const pushHistory = React.useCallback(() => {
    const canvas = fabricRef.current;
    const h = historyRef.current;
    if (!canvas || h.suspend) return;
    const json = JSON.stringify(canvas.toJSON());
    h.stack = h.stack.slice(0, h.index + 1);
    h.stack.push(json);
    h.index = h.stack.length - 1;
    updateHistoryState();
  }, [updateHistoryState]);

  React.useEffect(() => {
    if (!canvasElRef.current || !containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const canvas = new fabric.Canvas(canvasElRef.current, {
      width,
      height: Math.round(width * 0.6),
      backgroundColor: "#1a1a1a",
      preserveObjectStacking: true,
    });
    fabricRef.current = canvas;

    canvas.on("object:added", pushHistory);
    canvas.on("object:modified", pushHistory);
    canvas.on("object:removed", pushHistory);

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadImage = React.useCallback(async (blobOrUrl: Blob | string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const url = typeof blobOrUrl === "string" ? blobOrUrl : URL.createObjectURL(blobOrUrl);
    const img = await fabric.FabricImage.fromURL(url, { crossOrigin: "anonymous" });
    const containerWidth = containerRef.current?.clientWidth ?? 800;
    const scale = Math.min(1, containerWidth / (img.width ?? containerWidth));
    const height = Math.round((img.height ?? 600) * scale);
    canvas.setDimensions({ width: containerWidth, height });
    img.set({ left: 0, top: 0, scaleX: scale, scaleY: scale, selectable: false, evented: false });
    canvas.backgroundImage = img;
    bgImageRef.current = img;
    canvas.renderAll();
    setHasImage(true);
    historyRef.current = { stack: [], index: -1, suspend: false };
    pushHistory();
  }, [pushHistory]);

  React.useEffect(() => {
    if (initialImage) loadImage(initialImage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialImage]);

  React.useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.isDrawingMode = false;
    canvas.selection = tool === "select";
    canvas.forEachObject((o) => (o.selectable = tool === "select"));
    canvas.defaultCursor = tool === "select" ? "default" : "crosshair";
  }, [tool]);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) loadImage(file);
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (tool === "select" || !hasImage) return;
    const canvas = fabricRef.current;
    if (!canvas) return;
    const rect = canvasElRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawingRef.current.origin = { x, y };

    if (tool === "text") {
      const text = new fabric.IText("Comment", {
        left: x,
        top: y,
        fill: color,
        fontSize: 18,
        fontWeight: "600",
        backgroundColor: "rgba(0,0,0,0.55)",
        padding: 6,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      text.enterEditing();
      setTool("select");
      return;
    }

    let obj: fabric.Object;
    if (tool === "rect") {
      obj = new fabric.Rect({ left: x, top: y, width: 1, height: 1, fill: "transparent", stroke: color, strokeWidth: 3, rx: 4, ry: 4 });
    } else if (tool === "highlight") {
      obj = new fabric.Rect({ left: x, top: y, width: 1, height: 1, fill: color, opacity: 0.35 });
    } else if (tool === "arrow") {
      obj = new fabric.Line([x, y, x, y], { stroke: color, strokeWidth: 4, strokeLineCap: "round" });
    } else {
      obj = new fabric.Rect({ left: x, top: y, width: 1, height: 1, fill: "rgba(120,120,120,0.5)", stroke: "#999", strokeDashArray: [4, 4] });
    }
    canvas.add(obj);
    drawingRef.current.obj = obj;
  }

  function handlePointerMove(e: React.PointerEvent) {
    const { origin, obj } = drawingRef.current;
    if (!origin || !obj) return;
    const canvas = fabricRef.current;
    if (!canvas) return;
    const rect = canvasElRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (obj.type === "line") {
      (obj as fabric.Line).set({ x2: x, y2: y });
    } else {
      obj.set({
        left: Math.min(origin.x, x),
        top: Math.min(origin.y, y),
        width: Math.abs(x - origin.x),
        height: Math.abs(y - origin.y),
      });
    }
    canvas.requestRenderAll();
  }

  async function handlePointerUp() {
    const { obj } = drawingRef.current;
    const canvas = fabricRef.current;
    drawingRef.current = { origin: null, obj: null };
    if (!obj || !canvas) return;

    if (tool === "arrow") {
      const line = obj as fabric.Line;
      const x1 = line.x1 ?? 0, y1 = line.y1 ?? 0, x2 = line.x2 ?? 0, y2 = line.y2 ?? 0;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLength = 14;
      const head = new fabric.Triangle({
        left: x2,
        top: y2,
        originX: "center",
        originY: "center",
        angle: (angle * 180) / Math.PI + 90,
        width: headLength,
        height: headLength,
        fill: color,
      });
      canvas.remove(obj);
      const group = new fabric.Group([new fabric.Line([x1, y1, x2, y2], { stroke: color, strokeWidth: 4, strokeLineCap: "round" }), head]);
      canvas.add(group);
      canvas.setActiveObject(group);
    } else if (tool === "blur") {
      const rect = obj as fabric.Rect;
      const left = rect.left ?? 0, top = rect.top ?? 0, w = rect.width ?? 0, h = rect.height ?? 0;
      canvas.remove(obj);
      if (w > 4 && h > 4 && bgImageRef.current) {
        await applyPixelatedRegion(canvas, bgImageRef.current, left, top, w, h);
      }
    } else {
      canvas.setActiveObject(obj);
    }
    setTool("select");
    canvas.requestRenderAll();
  }

  async function applyPixelatedRegion(canvas: fabric.Canvas, bg: fabric.FabricImage, left: number, top: number, w: number, h: number) {
    const scaleX = bg.scaleX ?? 1;
    const scaleY = bg.scaleY ?? 1;
    const cropX = (left - (bg.left ?? 0)) / scaleX;
    const cropY = (top - (bg.top ?? 0)) / scaleY;
    const cropW = w / scaleX;
    const cropH = h / scaleY;

    const srcEl = bg.getElement() as HTMLImageElement;
    const off = document.createElement("canvas");
    off.width = cropW;
    off.height = cropH;
    const ctx = off.getContext("2d")!;
    ctx.drawImage(srcEl, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    const cropped = await fabric.FabricImage.fromURL(off.toDataURL());
    cropped.filters = [new fabric.filters.Pixelate({ blocksize: Math.max(6, Math.round(cropW / 20)) })];
    cropped.applyFilters();
    cropped.set({ left, top, selectable: true });
    canvas.add(cropped);
    canvas.setActiveObject(cropped);
  }

  function handleDelete() {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObjects();
    active.forEach((o) => canvas.remove(o));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  function applyHistory(index: number) {
    const canvas = fabricRef.current;
    const h = historyRef.current;
    if (!canvas || index < 0 || index >= h.stack.length) return;
    h.suspend = true;
    canvas.loadFromJSON(JSON.parse(h.stack[index])).then(() => {
      canvas.renderAll();
      h.index = index;
      h.suspend = false;
      updateHistoryState();
    });
  }

  function handleUndo() {
    applyHistory(historyRef.current.index - 1);
  }
  function handleRedo() {
    applyHistory(historyRef.current.index + 1);
  }

  async function handleSave() {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    await onSave(blob);
  }

  function handleDownload() {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "screenshot-annotated.png";
    a.click();
  }

  const tools: { id: Tool; label: string; icon: React.ElementType }[] = [
    { id: "select", label: "Select / Move", icon: MousePointer2 },
    { id: "rect", label: "Rectangle", icon: Square },
    { id: "arrow", label: "Arrow", icon: ArrowUpRight },
    { id: "highlight", label: "Highlight", icon: Highlighter },
    { id: "blur", label: "Blur / Redact", icon: EyeOff },
    { id: "text", label: "Comment", icon: Type },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-1.5">
        {tools.map((t) => (
          <Button
            key={t.id}
            type="button"
            variant="ghost"
            size="icon"
            title={t.label}
            onClick={() => setTool(t.id)}
            className={cn("size-8", tool === t.id && "bg-accent text-accent-foreground")}
          >
            <t.icon className="size-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="mx-1 h-6" />

        <div className="flex items-center gap-1 px-1">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn("size-5 rounded-full border-2 transition-transform hover:scale-110", color === c ? "border-primary" : "border-transparent")}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button type="button" variant="ghost" size="icon" title="Undo" disabled={!historyState.canUndo} onClick={handleUndo} className="size-8">
          <Undo2 className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" title="Redo" disabled={!historyState.canRedo} onClick={handleRedo} className="size-8">
          <Redo2 className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" title="Delete selected" onClick={handleDelete} className="size-8">
          <Trash2 className="size-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button type="button" variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => fileInputRef.current?.click()}>
          <Upload className="size-3.5" />
          Upload
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

        <div className="ml-auto flex items-center gap-1.5">
          <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={handleDownload} disabled={!hasImage}>
            <Download className="size-3.5" />
            PNG
          </Button>
          <Button type="button" size="sm" className="h-8 gap-1.5 text-xs" onClick={handleSave} disabled={!hasImage}>
            <Save className="size-3.5" />
            {saveLabel}
          </Button>
        </div>
      </div>

      <div ref={containerRef} className="relative overflow-hidden rounded-lg border border-border bg-[#1a1a1a]">
        {!hasImage && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-sm text-white/60">
            <Upload className="size-6" />
            Upload a screenshot to begin annotating
          </div>
        )}
        <canvas
          ref={canvasElRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      </div>
    </div>
  );
}
