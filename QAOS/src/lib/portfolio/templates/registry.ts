import type { ComponentType } from "react";
import type { PortfolioContent, PortfolioTemplateId } from "../types";
import { AiDashboardTemplate } from "@/components/portfolio/templates/ai-dashboard/template";
import { CyberHudTemplate } from "@/components/portfolio/templates/cyber-hud/template";
import { BugMascotTemplate } from "@/components/portfolio/templates/bug-mascot/template";
import { SportsFireTemplate } from "@/components/portfolio/templates/sports-fire/template";
import { DEFAULT_AI_DASHBOARD_THEME } from "./ai-dashboard/themes";

export interface PortfolioTemplateProps {
  content: PortfolioContent;
  themeId?: string;
  onThemeChange?: (id: string) => void;
}

export interface PortfolioTemplateDefinition {
  id: PortfolioTemplateId;
  name: string;
  description: string;
  gradient: string;
  defaultThemeId?: string;
  component: ComponentType<PortfolioTemplateProps>;
}

export const PORTFOLIO_TEMPLATES: PortfolioTemplateDefinition[] = [
  {
    id: "ai-dashboard",
    name: "AI Dashboard",
    description: "Futuristic dark dashboard with a switchable 6-color theme system, glassmorphism cards, and an AI Lab section.",
    gradient: "linear-gradient(135deg,#030711 0%,#0d1040 50%,#071526 100%)",
    defaultThemeId: DEFAULT_AI_DASHBOARD_THEME,
    component: AiDashboardTemplate,
  },
  {
    id: "cyber-hud",
    name: "Cyber HUD",
    description: "Cyberpunk mission-control theme with a live particle field, mission-timeline experience, and terminal-styled contact form.",
    gradient: "linear-gradient(135deg,#030711 0%,#0a0a2e 50%,#050514 100%)",
    component: CyberHudTemplate,
  },
  {
    id: "bug-mascot",
    name: "Bug Mascot",
    description: "Dark violet theme built around an interactive QA bug illustration, with a light/dark toggle.",
    gradient: "linear-gradient(135deg,#0a0a0f 0%,#13131c 50%,#18181f 100%)",
    component: BugMascotTemplate,
  },
  {
    id: "sports-fire",
    name: "Sports Fire",
    description: "Bold orange \"fire\" theme with animated ember particles, counting stats, and a swipeable project carousel.",
    gradient: "linear-gradient(135deg,#080808 0%,#2a1200 50%,#080808 100%)",
    component: SportsFireTemplate,
  },
];

export function getTemplate(id: string): PortfolioTemplateDefinition | undefined {
  return PORTFOLIO_TEMPLATES.find((t) => t.id === id);
}
