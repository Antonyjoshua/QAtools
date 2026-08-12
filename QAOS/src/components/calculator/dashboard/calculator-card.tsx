"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { CalculatorDef } from "@/lib/calculator/types";
import { cn } from "@/lib/utils";

export function CalculatorCard({
  calculator,
  favorite,
  onToggleFavorite,
}: {
  calculator: CalculatorDef;
  favorite?: boolean;
  onToggleFavorite?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative"
    >
      <Link
        href={`/calculator/${calculator.slug}`}
        className="glass-card block h-full rounded-2xl p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-start justify-between gap-2">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <calculator.icon className="size-5" />
          </span>
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite();
              }}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-yellow-500"
              aria-label={favorite ? "Remove favorite" : "Add favorite"}
            >
              <Star className={cn("size-4", favorite && "fill-yellow-400 text-yellow-500")} />
            </button>
          )}
        </div>
        <h3 className="mt-3 text-sm font-semibold leading-snug">{calculator.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{calculator.description}</p>
      </Link>
    </motion.div>
  );
}
