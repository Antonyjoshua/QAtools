"use client";

import { usePortfolioContent } from "../shared/portfolio-content-context";

const COLORS = ["#7c3aed", "#ff6200", "#a855f7", "#06b6d4"];

export function Certifications() {
  const { certifications } = usePortfolioContent();

  return (
    <section id="certifications" className="py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-16">
          <span className="section-tag">Achievements</span>
          <h2 className="section-title">CERTIFICATIONS</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {certifications.map((c, i) => {
            const color = COLORS[i % COLORS.length];
            return (
              <div key={c.id} className="card relative overflow-hidden p-8" style={{ borderTop: `2px solid ${color}` }}>
                <div className="mb-3 text-xs font-bold tracking-widest uppercase" style={{ color }}>
                  {c.issuer}
                </div>
                <h3 className="font-display mb-1 text-xl tracking-wide">{c.title}</h3>
                <p className="mb-4 text-sm" style={{ color: "var(--muted)" }}>
                  {c.subtitle}
                </p>
                <div className="mb-4 flex flex-wrap gap-x-5 gap-y-1 text-xs" style={{ color: "var(--muted)" }}>
                  {c.date && (
                    <div>
                      Date: <span className="text-white/80">{c.date}</span>
                    </div>
                  )}
                  {c.duration && (
                    <div>
                      Duration: <span className="text-white/80">{c.duration}</span>
                    </div>
                  )}
                  {c.instructor && (
                    <div>
                      By: <span className="text-white/80">{c.instructor}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.skills.map((s) => (
                    <span key={s} className="tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
