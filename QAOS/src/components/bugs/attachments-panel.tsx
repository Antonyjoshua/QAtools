"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { UploadCloud, Trash2, Download, FileText, FileArchive, FileSpreadsheet, ImagePlus } from "lucide-react";
import { db } from "@/lib/bugs/db";
import { addAttachment, deleteAttachment, updateAttachmentCaption, formatBytes } from "@/lib/bugs/attachments-repo";
import type { Attachment } from "@/lib/bugs/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScreenshotAnnotator } from "@/components/bugs/screenshot-studio/annotator";

function useObjectUrl(blob: Blob | undefined): string | null {
  const [url, setUrl] = React.useState<string | null>(null);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset object URL when blob is cleared
    if (!blob) return setUrl(null);
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);
  return url;
}

function fileIconFor(mime: string) {
  if (mime.includes("zip")) return FileArchive;
  if (mime.includes("sheet") || mime.includes("excel")) return FileSpreadsheet;
  return FileText;
}

function DropZone({ label, hint, onFiles, accept }: { label: string; hint: string; onFiles: (files: File[]) => void; accept: string }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        onFiles(Array.from(e.dataTransfer.files));
      }}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed p-5 text-center transition-colors ${
        dragOver ? "border-primary bg-accent/50" : "border-border hover:border-primary/40"
      }`}
    >
      <UploadCloud className="size-5 text-muted-foreground" />
      <p className="text-xs font-medium">{label}</p>
      <p className="text-[11px] text-muted-foreground">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(e) => {
          onFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
    </div>
  );
}

function ScreenshotCard({ attachment }: { attachment: Attachment }) {
  const url = useObjectUrl(attachment.blob);
  const [caption, setCaption] = React.useState(attachment.caption);
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-card p-2">
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={attachment.filename} className="h-32 w-full rounded-md object-cover" />
      )}
      <Input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        onBlur={() => updateAttachmentCaption(attachment.id, caption)}
        placeholder="Add caption…"
        className="h-7 text-xs"
      />
      <div className="flex items-center justify-between">
        <span className="truncate text-[10px] text-muted-foreground">{formatBytes(attachment.size)}</span>
        <Button variant="ghost" size="icon" className="size-6 text-destructive" onClick={() => deleteAttachment(attachment.id)}>
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

function VideoCard({ attachment }: { attachment: Attachment }) {
  const url = useObjectUrl(attachment.blob);
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-card p-2">
      {url && <video src={url} controls className="h-32 w-full rounded-md bg-black object-contain" />}
      <div className="flex items-center justify-between">
        <span className="truncate text-[10px] text-muted-foreground">{attachment.filename} &middot; {formatBytes(attachment.size)}</span>
        <Button variant="ghost" size="icon" className="size-6 text-destructive" onClick={() => deleteAttachment(attachment.id)}>
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

function FileCard({ attachment }: { attachment: Attachment }) {
  const url = useObjectUrl(attachment.blob);
  const Icon = fileIconFor(attachment.mimeType);
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5">
      {/* eslint-disable-next-line react-hooks/static-components -- fileIconFor is a stable lookup, not a fresh component */}
      <Icon className="size-6 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium">{attachment.filename}</p>
        <p className="text-[10px] text-muted-foreground">{formatBytes(attachment.size)}</p>
      </div>
      {url && (
        <a href={url} download={attachment.filename}>
          <Button variant="ghost" size="icon" className="size-7">
            <Download className="size-3.5" />
          </Button>
        </a>
      )}
      <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => deleteAttachment(attachment.id)}>
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}

export function AttachmentsPanel({ bugId }: { bugId: string }) {
  const attachments = useLiveQuery(() => db.attachments.where("bugId").equals(bugId).toArray(), [bugId]);
  const [pendingScreenshot, setPendingScreenshot] = React.useState<File | null>(null);

  const screenshots = (attachments ?? []).filter((a) => a.kind === "screenshot");
  const videos = (attachments ?? []).filter((a) => a.kind === "video");
  const files = (attachments ?? []).filter((a) => a.kind === "file");

  async function handleScreenshotFiles(fileList: File[]) {
    if (fileList.length === 0) return;
    setPendingScreenshot(fileList[0]);
  }

  async function handleAnnotatorSave(blob: Blob) {
    const file = new File([blob], pendingScreenshot?.name ?? `screenshot-${Date.now()}.png`, { type: "image/png" });
    await addAttachment(bugId, file, "screenshot");
    setPendingScreenshot(null);
  }

  async function handleVideoFiles(fileList: File[]) {
    for (const f of fileList) await addAttachment(bugId, f, "video");
  }

  async function handleFileFiles(fileList: File[]) {
    for (const f of fileList) await addAttachment(bugId, f, "file");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Screenshots</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {screenshots.map((a) => (
            <ScreenshotCard key={a.id} attachment={a} />
          ))}
          <DropZone label="Add screenshot" hint="Drag & drop or click — annotate before saving" onFiles={handleScreenshotFiles} accept="image/*" />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Video Attachments</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {videos.map((a) => (
            <VideoCard key={a.id} attachment={a} />
          ))}
          <DropZone label="Add video" hint="MP4, MOV, AVI" onFiles={handleVideoFiles} accept="video/mp4,video/quicktime,video/x-msvideo,.mov,.avi" />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">File Attachments</p>
        <div className="flex flex-col gap-2">
          {files.map((a) => (
            <FileCard key={a.id} attachment={a} />
          ))}
          <DropZone
            label="Add file"
            hint="PDF, DOCX, Excel, ZIP, Log, JSON, XML"
            onFiles={handleFileFiles}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.log,.json,.xml,application/pdf"
          />
        </div>
      </div>

      <Dialog open={!!pendingScreenshot} onOpenChange={(v) => !v && setPendingScreenshot(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImagePlus className="size-4" /> Annotate Screenshot
            </DialogTitle>
            <DialogDescription>Draw rectangles, arrows, highlights, or blur sensitive info before saving.</DialogDescription>
          </DialogHeader>
          {pendingScreenshot && <ScreenshotAnnotator initialImage={pendingScreenshot} onSave={handleAnnotatorSave} saveLabel="Save Screenshot" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
