import { cn } from "@/lib/utils";

/** Renders a generated initials tile — no external logo fetching, consistent with the module's local-first, no-network-calls design. */
export function CompanyLogo({ initials, color, className }: { initials: string; color: string; className?: string }) {
  return (
    <div
      className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white", className)}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
