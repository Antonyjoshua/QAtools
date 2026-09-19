"use client";

import { usePortfolioContent } from "../shared/portfolio-content-context";

export function Projects() {
  const { projects } = usePortfolioContent();

  return (
    <section id="projects" className="py-24" style={{ background: "var(--bg2)" }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="section-title">
          Featured <span className="accent">Projects</span>
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((p) => (
            <div key={p.id} className="card flex flex-col gap-3 p-7">
              {p.subtitle && (
                <div className="font-mono-jb text-xs tracking-wider uppercase" style={{ color: "var(--accent)" }}>
                  {p.subtitle}
                </div>
              )}
              <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
                {p.title}
              </h3>
              {p.company && (
                <p className="text-sm" style={{ color: "var(--accent2)" }}>
                  {p.company}
                </p>
              )}
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {p.description}
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              {(p.liveUrl || p.githubUrl) && (
                <div className="mt-2 flex gap-4 text-sm">
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                      Live ↗
                    </a>
                  )}
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                      Code ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
