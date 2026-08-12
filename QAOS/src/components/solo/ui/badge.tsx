import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-[var(--accent)]/40 bg-[var(--accent)]/15 text-[var(--accent)]",
        secondary: "border-white/10 bg-white/5 text-foreground/80",
        outline: "border-white/20 text-foreground/70",
        success: "border-emerald-500/40 bg-emerald-500/15 text-emerald-400",
        warning: "border-amber-500/40 bg-amber-500/15 text-amber-400",
        locked: "border-white/10 bg-white/[0.03] text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
