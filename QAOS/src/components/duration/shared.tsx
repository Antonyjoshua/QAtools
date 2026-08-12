"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { DurationEquivalent } from "@/lib/duration/conversions";
import { UNIT_LABEL, type DurationUnit } from "@/lib/duration/units";

export function CopyIconButton({
  text,
  label = "result",
  className,
  onCopied,
}: {
  text: string;
  label?: string;
  className?: string;
  /** Called after a successful copy — used to record "the answer" into recent history without doing so on every keystroke. */
  onCopied?: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      title={`Copy ${label}`}
      className={className}
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${label}`);
        onCopied?.();
      }}
    >
      <Copy className="size-3" />
    </Button>
  );
}

export function EquivalentsList({ items }: { items: DurationEquivalent[] }) {
  return (
    <div className="flex flex-col gap-0.5">
      {items.map((it) => (
        <div key={it.label} className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1 text-xs hover:bg-muted">
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground">{it.label}</p>
            <p className="font-medium">{it.value}</p>
          </div>
          <CopyIconButton text={it.value} label={it.label} />
        </div>
      ))}
    </div>
  );
}

export function ValueUnitInput({
  value,
  onValueChange,
  unit,
  onUnitChange,
  units,
  placeholder,
}: {
  value: string;
  onValueChange: (v: string) => void;
  unit: DurationUnit;
  onUnitChange: (u: DurationUnit) => void;
  units: DurationUnit[];
  placeholder?: string;
}) {
  return (
    <div className="flex gap-1.5">
      <Input
        value={value}
        onChange={(e) => onValueChange(e.target.value.replace(/[^0-9.]/g, ""))}
        inputMode="decimal"
        placeholder={placeholder}
        className="flex-1"
      />
      <Select value={unit} onValueChange={(v) => v !== null && onUnitChange(v as DurationUnit)}>
        <SelectTrigger className="w-28">
          <SelectValue>{(v: DurationUnit) => UNIT_LABEL[v]?.plural ?? v}</SelectValue>
        </SelectTrigger>
        <SelectContent positionerClassName="z-[110]">
          {units.map((u) => (
            <SelectItem key={u} value={u}>
              {UNIT_LABEL[u].plural}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ResultCard({
  title,
  value,
  detail,
  copyText,
  className,
  onCopied,
}: {
  title?: string;
  value: string;
  detail?: string;
  copyText: string;
  className?: string;
  onCopied?: () => void;
}) {
  return (
    <div className={cn("rounded-lg border border-primary/30 bg-primary/5 p-3", className)} data-duration-result>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {title && <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">{title}</p>}
          <p className="truncate text-lg font-semibold text-primary">{value}</p>
          {detail && <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>}
        </div>
        <CopyIconButton text={copyText} label="result" className="shrink-0" onCopied={onCopied} />
      </div>
    </div>
  );
}
