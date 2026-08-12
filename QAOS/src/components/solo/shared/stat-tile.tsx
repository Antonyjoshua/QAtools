import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/solo/ui/card";
import { cn } from "@/lib/utils";

export function StatTile({
  icon: Icon,
  label,
  value,
  sublabel,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  className?: string;
}) {
  return (
    <Card className={cn("p-4 flex items-start gap-3", className)}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/25 text-[var(--accent)]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground truncate">{label}</div>
        <div className="text-xl font-bold leading-tight truncate">{value}</div>
        {sublabel && <div className="text-xs text-muted-foreground truncate">{sublabel}</div>}
      </div>
    </Card>
  );
}
