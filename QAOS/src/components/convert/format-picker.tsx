import { CheckCircle2, Lock, FolderOpen } from "lucide-react";
import { getFormat } from "@/lib/convert/core/format-registry";
import { getSupportedOutputs } from "@/lib/convert/core/engine";
import { DynamicIcon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function FormatPicker({ inputFormat, selected, onSelect }: { inputFormat: string; selected: string | null; onSelect: (format: string) => void }) {
  const outputs = getSupportedOutputs(inputFormat);

  if (outputs.length === 0) {
    return <p className="text-sm text-muted-foreground">No conversions are available for this file type yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {outputs.map((pair) => {
        // "extracted" is a pseudo-format for archive extraction — it isn't a single
        // real output format (extraction produces multiple files, each with its own
        // format), so it has no format-registry entry. Render it as its own tile.
        const isExtract = pair.to === "extracted";
        const format = isExtract ? null : getFormat(pair.to);
        if (!isExtract && !format) return null;
        const isSelected = selected === pair.to;
        return (
          <button
            key={pair.to}
            type="button"
            disabled={pair.requiresBackend}
            onClick={() => onSelect(pair.to)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center transition-colors",
              isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/40",
              pair.requiresBackend && "cursor-not-allowed opacity-50 hover:border-border"
            )}
          >
            {isSelected ? (
              <CheckCircle2 className="size-5 text-primary" />
            ) : isExtract ? (
              <FolderOpen className="size-5 text-muted-foreground" />
            ) : (
              <DynamicIcon name={format!.icon} className="size-5 text-muted-foreground" />
            )}
            <span className="text-sm font-medium uppercase">{isExtract ? "Extract" : format!.id}</span>
            {pair.requiresBackend && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Lock className="size-2.5" />
                Coming soon
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
