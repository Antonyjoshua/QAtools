"use client";

import { usePortfolioContent } from "../shared/portfolio-content-context";

export function About() {
  const { aboutParagraphs, stats, profile, education, contactDetails } = usePortfolioContent();

  const details = [
    profile.location && { icon: "📍", label: "Location", value: profile.location },
    profile.email && { icon: "📧", label: "Email", value: profile.email },
    profile.phone && { icon: "📱", label: "Phone", value: profile.phone },
    profile.linkedin && { icon: "🔗", label: "LinkedIn", value: profile.linkedin.replace(/^https?:\/\//, ""), href: profile.linkedin },
  ].filter((d): d is { icon: string; label: string; value: string; href?: string } => Boolean(d));

  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="section-title">
          About <span className="accent">Me</span>
        </h2>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="space-y-4 leading-relaxed" style={{ color: "var(--text)" }}>
              {aboutParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {stats.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-8">
                {stats.map((s) => (
                  <div key={s.id} className="flex flex-col">
                    <span className="stat-num">
                      {s.value}
                      {s.suffix}
                    </span>
                    <span className="stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {details.map((d) => (
              <div key={d.label} className="card flex items-center gap-4 p-4">
                <div className="shrink-0 text-xl">{d.icon}</div>
                <div>
                  <div className="text-sm" style={{ color: "var(--text-dim)" }}>
                    {d.label}
                  </div>
                  {d.href ? (
                    <a href={d.href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text)" }}>
                      {d.value}
                    </a>
                  ) : (
                    <div style={{ color: "var(--text)" }}>{d.value}</div>
                  )}
                </div>
              </div>
            ))}

            {education.map((e) => (
              <div key={e.id} className="card flex items-center gap-4 p-4">
                <div className="shrink-0 text-xl">🎓</div>
                <div>
                  <div className="text-sm" style={{ color: "var(--text-dim)" }}>
                    Education
                  </div>
                  <div style={{ color: "var(--text)" }}>
                    {e.degree} — {e.institution}
                    {(e.status || e.note) && (
                      <span
                        className="ml-1.5 inline-block rounded-full px-1.5 py-px text-xs font-semibold"
                        style={{ background: "rgba(108,99,255,0.15)", color: "var(--accent2)" }}
                      >
                        {e.status || e.note}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {contactDetails.map((c) => (
              <div key={c.id} className="card flex items-center gap-4 p-4">
                <div className="shrink-0 text-xl">🔗</div>
                <div>
                  <div className="text-sm" style={{ color: "var(--text-dim)" }}>
                    {c.label}
                  </div>
                  {c.link ? (
                    <a href={c.link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text)" }}>
                      {c.value}
                    </a>
                  ) : (
                    <div style={{ color: "var(--text)" }}>{c.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
