"use client";

import { useState } from "react";
import type { PortfolioContent } from "@/lib/portfolio/types";
import { PortfolioContentProvider } from "../shared/portfolio-content-context";
import { BgIcons } from "./bg-icons";
import { Navigation } from "./navigation";
import { Hero } from "./hero";
import { About } from "./about";
import { Experience } from "./experience";
import { Projects } from "./projects";
import { Skills } from "./skills";
import { Certifications } from "./certifications";
import { Footer } from "./footer";

export function BugMascotTemplate({ content }: { content: PortfolioContent }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <div className="portfolio-bug-mascot-scope min-h-screen" data-theme={theme}>
      <PortfolioContentProvider content={content}>
        <BgIcons />
        <Navigation theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Footer />
      </PortfolioContentProvider>
    </div>
  );
}
