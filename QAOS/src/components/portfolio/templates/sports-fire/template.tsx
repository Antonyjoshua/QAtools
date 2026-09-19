import type { PortfolioContent } from "@/lib/portfolio/types";
import { PortfolioContentProvider } from "../shared/portfolio-content-context";
import { Navigation } from "./navigation";
import { Hero } from "./hero";
import { About } from "./about";
import { Experience } from "./experience";
import { Projects } from "./projects";
import { Skills } from "./skills";
import { Certifications } from "./certifications";
import { Contact } from "./contact";
import { Footer } from "./footer";

export function SportsFireTemplate({ content }: { content: PortfolioContent }) {
  return (
    <div className="portfolio-sports-fire-scope min-h-screen">
      <PortfolioContentProvider content={content}>
        <Navigation />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Contact />
        <Footer />
      </PortfolioContentProvider>
    </div>
  );
}
