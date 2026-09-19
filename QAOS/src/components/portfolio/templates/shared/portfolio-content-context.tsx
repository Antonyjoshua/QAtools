"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PortfolioContent } from "@/lib/portfolio/types";

const PortfolioContentContext = createContext<PortfolioContent | null>(null);

export function PortfolioContentProvider({ content, children }: { content: PortfolioContent; children: ReactNode }) {
  return <PortfolioContentContext.Provider value={content}>{children}</PortfolioContentContext.Provider>;
}

export function usePortfolioContent(): PortfolioContent {
  const ctx = useContext(PortfolioContentContext);
  if (!ctx) throw new Error("usePortfolioContent must be used within a PortfolioContentProvider");
  return ctx;
}
