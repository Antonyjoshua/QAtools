"use client";

import { use, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/portfolio/db";
import { touchPortfolioOpened } from "@/lib/portfolio/repo/portfolios-repo";
import { PortfolioEditorShell } from "@/components/portfolio/editor/portfolio-editor-shell";

export default function PortfolioEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const portfolio = useLiveQuery(() => db.portfolios.get(id), [id]);

  useEffect(() => {
    void touchPortfolioOpened(id);
  }, [id]);

  if (portfolio === undefined) return null;

  return <PortfolioEditorShell key={portfolio.id} portfolio={portfolio} />;
}
