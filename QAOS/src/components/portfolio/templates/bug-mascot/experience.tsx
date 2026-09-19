"use client";

import { usePortfolioContent } from "../shared/portfolio-content-context";

export function Experience() {
  const { experience } = usePortfolioContent();

  return (
    <section id="experience" className="py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="section-title">
          Work <span className="accent">Experience</span>
        </h2>
        <div className="flex flex-col">
          {experience.map((job, i) => (
            <div key={job.id} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="timeline-dot" style={job.current ? undefined : { background: "var(--bg3)", boxShadow: "none" }} />
                {i < experience.length - 1 && <div className="mt-1 w-0.5 flex-1" style={{ background: "linear-gradient(to bottom, var(--accent), var(--accent2))", minHeight: "24px" }} />}
              </div>
              <div className="flex-1 pb-8">
                <div className="card p-7">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
                        {job.role}
                      </h3>
                      <p className="mt-0.5 text-sm" style={{ color: "var(--accent2)" }}>
                        {job.company}
                      </p>
                    </div>
                    <span
                      className="font-mono-jb rounded px-2.5 py-1 text-xs whitespace-nowrap"
                      style={
                        job.current
                          ? { background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }
                          : { background: "var(--bg3)", color: "var(--text-dim)" }
                      }
                    >
                      {job.period}
                    </span>
                  </div>
                  {job.highlights.length > 0 && (
                    <ul className="mb-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      {job.highlights.map((h, j) => (
                        <li key={j}>{h}</li>
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
