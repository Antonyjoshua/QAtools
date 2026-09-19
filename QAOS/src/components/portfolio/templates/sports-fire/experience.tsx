"use client";

import { usePortfolioContent } from "../shared/portfolio-content-context";

export function Experience() {
  const { experience } = usePortfolioContent();

  return (
    <section id="experience" className="section-dark py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-16">
          <span className="section-tag">Career</span>
          <h2 className="section-title">EXPERIENCE</h2>
        </div>
        <div className="flex flex-col">
          {experience.map((job, i) => (
            <div key={job.id} className="flex gap-6">
              <div className="flex flex-col items-center pt-2">
                <div className={`timeline-dot ${job.current ? "current" : ""}`} />
                {i < experience.length - 1 && <div className="mt-1 w-px flex-1" style={{ background: "var(--border)", minHeight: "24px" }} />}
              </div>
              <div className="flex-1 pb-8">
                <div className="card px-8 py-7">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    {job.current && <span className="badge-current">Current</span>}
                    <span className="text-sm" style={{ color: "var(--muted)" }}>
                      {job.period}
                    </span>
                  </div>
                  <h3 className="font-display text-xl tracking-wide">{job.role}</h3>
                  <div className="mb-4 text-sm" style={{ color: "var(--orange-light)" }}>
                    {job.company}
                  </div>
                  {job.highlights.length > 0 && (
                    <ul className="mb-4 flex flex-col gap-1.5">
                      {job.highlights.map((h, j) => (
                        <li key={j} className="relative pl-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                          <span className="absolute left-0" style={{ color: "var(--orange)" }}>
                            ›
                          </span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {job.tech.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
