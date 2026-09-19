"use client";

import { useState } from "react";
import type { PortfolioContent } from "@/lib/portfolio/types";
import { getAiDashboardTheme, DEFAULT_AI_DASHBOARD_THEME } from "@/lib/portfolio/templates/ai-dashboard/themes";
import { PortfolioContentProvider } from "../shared/portfolio-content-context";
import { Navigation } from "./navigation";
import { Hero } from "./hero";
import { About } from "./about";
import { Experience } from "./experience";
import { Projects } from "./projects";
import { Skills } from "./skills";
import { Certifications } from "./certifications";
import { AILab } from "./ai-lab";
import { Contact } from "./contact";
import { Footer } from "./footer";
import { ThemeSwitcher } from "./theme-switcher";

export function AiDashboardTemplate({
  content,
  themeId,
  onThemeChange,
}: {
  content: PortfolioContent;
  themeId?: string;
  onThemeChange?: (id: string) => void;
}) {
  const [localThemeId, setLocalThemeId] = useState(themeId ?? DEFAULT_AI_DASHBOARD_THEME);
  const activeThemeId = themeId ?? localThemeId;
  const theme = getAiDashboardTheme(activeThemeId);

  function handleThemeSelect(id: string) {
    setLocalThemeId(id);
    onThemeChange?.(id);
  }

  return (
    <div className="portfolio-ai-dashboard-scope min-h-screen" style={theme.css as React.CSSProperties}>
      <PortfolioContentProvider content={content}>
        <Navigation />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <AILab />
        <Contact />
        <Footer />
        <ThemeSwitcher themeId={activeThemeId} onSelect={handleThemeSelect} />
      </PortfolioContentProvider>
    </div>
  );
}
