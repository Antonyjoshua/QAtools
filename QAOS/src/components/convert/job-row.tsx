"use client";

import * as React from "react";
import { CheckCircle2, XCircle, Loader2, Download, Eye, EyeOff, Trash2 } from "lucide-react";
import { downloadOutput } from "@/lib/convert/services/conversion-service";
import { formatFileSize } from "@/lib/convert/services/format-detection";
import { FilePreview } from "./file-preview";
import { Button } from "@/components/ui/button";
import type { ConversionProgressEvent, ConversionResult } from "@/lib/convert/core/types";

export interface ConversionJobState {
  id: string;
  file: File;
  progress: ConversionProgressEvent | null;
  result: ConversionResult | null;
}

export function JobRow({ job, onRemove }: { job: ConversionJobState; onRemove?: () => void }) {
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const primaryOutput = job.result?.outputs[0];

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 p-3">
        <div className="shrink-0">
          {!job.result && <Loader2 className="size-5 animate-spin text-primary" />}
          {job.result?.success && <CheckCircle2 className="size-5 text-success" />}
          {job.result && !job.result.success && <XCircle className="size-5 text-destructive" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{job.file.name}</p>
          {!job.result && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary transition-[width]" style={{ width: `${job.progress?.percent ?? 0}%` }} />
              </div>
              <span className="w-24 shrink-0 text-xs text-muted-foreground capitalize">{job.progress?.stage ?? "waiting"}…</span>
            </div>
          )}
          {job.result?.success && (
            <p className="text-xs text-muted-foreground">
              {formatFileSize(job.file.size)} → {job.result.outputs.length > 1 ? `${job.result.outputs.length} files` : formatFileSize(job.result.outputs[0]?.blob.size ?? 0)}
              {" · "}
              {(job.result.durationMs / 1000).toFixed(1)}s
            </p>
          )}
          {job.result && !job.result.success && <p className="text-xs text-destructive">{job.result.error?.message}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {job.result?.success && primaryOutput && (
            <>
              <Button variant="ghost" size="icon" className="size-8" onClick={() => setPreviewOpen((o) => !o)} aria-label="Preview">
                {previewOpen ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => job.result?.outputs.forEach((o) => downloadOutput(o.name, o.blob))}
                aria-label="Download"
              >
                <Download className="size-4" />
              </Button>
            </>
          )}
          {onRemove && (
            <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={onRemove} aria-label="Remove">
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {previewOpen && primaryOutput && (
        <div className="border-t border-border p-3">
          <FilePreview blob={primaryOutput.blob} format={primaryOutput.format} />
        </div>
      )}
    </div>
  );
}
