"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "digit" | "operator" | "equals" | "function" | "memory" | "muted";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  digit:
    "bg-foreground/[0.04] hover:bg-foreground/[0.08] text-foreground border border-border/60",
  operator:
    "bg-gradient-to-br from-primary to-[#8B5CF6] text-white shadow-md shadow-primary/25 hover:brightness-110 border border-transparent",
  equals:
    "bg-gradient-to-br from-primary to-[#8B5CF6] text-white shadow-lg shadow-primary/30 hover:brightness-110 border border-transparent font-semibold",
  function:
    "bg-foreground/[0.06] hover:bg-foreground/[0.11] text-foreground/80 border border-border/60",
  memory:
    "bg-transparent hover:bg-foreground/[0.06] text-muted-foreground border border-border/50 text-[11px]",
  muted: "bg-transparent hover:bg-foreground/[0.06] text-muted-foreground border border-transparent",
};

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface CalculatorButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  span?: 1 | 2;
}

export function CalculatorButton({
  children,
  onClick,
  variant = "digit",
  className,
  disabled,
  ariaLabel,
  span = 1,
}: CalculatorButtonProps) {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const rippleId = React.useRef(0);

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.6;
    const id = rippleId.current++;
    setRipples((r) => [...r, { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size }]);
    window.setTimeout(() => setRipples((r) => r.filter((ripple) => ripple.id !== id)), 500);
  }

  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onClick={onClick}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "relative isolate flex h-11 items-center justify-center overflow-hidden rounded-xl text-[15px] font-medium tabular-nums transition-colors select-none disabled:opacity-30 disabled:pointer-events-none",
        VARIANT_CLASSES[variant],
        span === 2 && "col-span-2",
        className
      )}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/40 animate-[qaos-ripple_500ms_ease-out]"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
    </motion.button>
  );
}
