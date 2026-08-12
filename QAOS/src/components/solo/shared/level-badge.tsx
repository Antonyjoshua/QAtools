import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-9 w-9 text-xs",
  md: "h-14 w-14 text-lg",
  lg: "h-24 w-24 text-3xl",
};

export function LevelBadge({
  level,
  size = "md",
  className,
}: {
  level: number;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--accent)]/10 font-bold text-[var(--accent)] shadow-[0_0_20px_var(--glow)]",
        SIZES[size],
        className
      )}
    >
      {level}
    </div>
  );
}
