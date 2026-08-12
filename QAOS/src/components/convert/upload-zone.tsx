"use client";

import * as React from "react";
import { Upload, FilePlus, Clipboard } from "lucide-react";
import { MAX_FILE_SIZE_MB } from "@/lib/convert/services/file-validation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UploadZone({ onFilesSelected }: { onFilesSelected: (files: File[]) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [pasteSupported, setPasteSupported] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only feature detection, SSR has no navigator.clipboard
    setPasteSupported(typeof navigator !== "undefined" && "clipboard" in navigator && "read" in navigator.clipboard);
  }, []);

  function handleFiles(fileList: FileList | File[] | null) {
    if (!fileList) return;
    const files = Array.from(fileList);
    if (files.length > 0) onFilesSelected(files);
  }

  async function handlePasteButton() {
    try {
      const items = await navigator.clipboard.read();
      const files: File[] = [];
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type);
            files.push(new File([blob], `pasted.${type.split("/")[1] ?? "png"}`, { type }));
          }
        }
      }
      if (files.length > 0) handleFiles(files);
    } catch {
      // Clipboard permission denied or nothing to paste — silently no-op, the keyboard
      // paste listener below is the more common path anyway.
    }
  }

  React.useEffect(() => {
    function onWindowPaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files: File[] = [];
      for (const item of Array.from(items)) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) handleFiles(files);
    }
    window.addEventListener("paste", onWindowPaste);
    return () => window.removeEventListener("paste", onWindowPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 text-center transition-colors",
        dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Upload className="size-6" />
      </div>
      <div>
        <p className="text-lg font-semibold">Drop your file here</p>
        <p className="text-sm text-muted-foreground">or browse from your device</p>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <Button onClick={() => inputRef.current?.click()} className="gap-1.5">
          <FilePlus className="size-4" />
          Browse Files
        </Button>
        {pasteSupported && (
          <Button variant="outline" onClick={() => void handlePasteButton()} className="gap-1.5">
            <Clipboard className="size-4" />
            Paste File
          </Button>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Maximum file size: {MAX_FILE_SIZE_MB}MB — or press Ctrl+V to paste an image</p>
      <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
    </div>
  );
}
