import { FileText, X } from "lucide-react";
import { formatFileSize } from "@/lib/convert/services/format-detection";
import { CATEGORY_LABELS } from "@/lib/convert/core/format-registry";
import { DynamicIcon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import type { DetectedFile } from "@/lib/convert/services/format-detection";

export function DetectedFileCard({ detected, onRemove }: { detected: DetectedFile; onRemove?: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {detected.format ? <DynamicIcon name={detected.format.icon} className="size-5" /> : <FileText className="size-5" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{detected.file.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {detected.format ? `${detected.format.label} (${CATEGORY_LABELS[detected.format.category]})` : "Unrecognized format"} · {formatFileSize(detected.sizeBytes)}
        </p>
      </div>
      {onRemove && (
        <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={onRemove} aria-label="Remove file">
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
