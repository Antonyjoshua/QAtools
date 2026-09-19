"use client";

import { use } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/portfolio/db";
import { setPortfolioTheme } from "@/lib/portfolio/repo/portfolios-repo";
import { getTemplate } from "@/lib/portfolio/templates/registry";

export default function PortfolioPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const portfolio = useLiveQuery(() => db.portfolios.get(id), [id]);

  if (portfolio === undefined) return null;

  const template = getTemplate(portfolio.templateId);
  if (!template) return <div className="p-10 text-center text-muted-foreground">Unknown template.</div>;

  const Template = template.component;
  return <Template content={portfolio.content} themeId={portfolio.themeId ?? template.defaultThemeId} onThemeChange={(themeId) => void setPortfolioTheme(portfolio.id, themeId)} />;
}
