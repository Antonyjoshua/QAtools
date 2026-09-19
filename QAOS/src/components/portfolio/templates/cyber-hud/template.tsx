import type { PortfolioContent } from "@/lib/portfolio/types";
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

export function CyberHudTemplate({ content }: { content: PortfolioContent }) {
  return (
    <div className="portfolio-cyber-hud-scope min-h-screen">
      <PortfolioContentProvider content={content}>
        <Navigation />
        <main>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Certifications />
          <AILab />
          <Contact />
        </main>
        <Footer />
      </PortfolioContentProvider>
    </div>
  );
}
