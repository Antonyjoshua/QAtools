"use client";

import { usePortfolioContent } from "../shared/portfolio-content-context";

export function Certifications() {
  const { certifications } = usePortfolioContent();

  return (
    <section id="certifications" className="py-24" style={{ background: "var(--bg2)" }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="section-title">
          Certifi<span className="accent">cations</span>
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {certifications.map((c) => (
            <div key={c.id} className="card flex flex-col gap-3 p-7">
              <div className="flex items-center justify-between">
                <span
                  className="font-mono-jb rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ background: "rgba(108,99,255,0.12)", color: "var(--accent2)" }}
                >
                  {c.issuer}
                </span>
                {c.date && (
                  <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                    {c.date}
                  </span>
                )}
              </div>
              <h3 className="font-semibold" style={{ color: "var(--text)" }}>
                {c.title}
              </h3>
              {c.subtitle && (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {c.subtitle}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--text-dim)" }}>
                {c.instructor && c.instructor !== c.issuer && <span>👨‍🏫 {c.instructor}</span>}
                {c.duration && <span>⏱ {c.duration}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {c.skills.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
