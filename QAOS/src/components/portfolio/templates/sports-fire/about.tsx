"use client";

import { usePortfolioContent } from "../shared/portfolio-content-context";

export function About() {
  const { aboutParagraphs, passions, profile, education, experience } = usePortfolioContent();
  const currentRole = experience.find((e) => e.current) ?? experience[0];

  const infoCards = [
    education.length > 0 && {
      icon: "🎓",
      label: "Education",
      value: education[0].degree + (education[0].institution ? ` — ${education[0].institution}` : ""),
      sub: education[0].status || education[0].note,
    },
    profile.location && { icon: "📍", label: "Location", value: profile.location },
    currentRole && { icon: "💼", label: "Current Role", value: currentRole.role, sub: `${currentRole.company} · ${currentRole.period}` },
    profile.email && { icon: "✉️", label: "Email", value: profile.email },
  ].filter((c): c is { icon: string; label: string; value: string; sub?: string } => Boolean(c));

  return (
    <section id="about" className="py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-16">
          <span className="section-tag">About Me</span>
          <h2 className="section-title">WHO I AM</h2>
        </div>
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="space-y-4 leading-relaxed text-white/85">
              {aboutParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {passions.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {passions.map((p) => (
                  <div key={p.id} className="card flex items-center gap-3 px-4 py-3 text-sm">
                    <span className="text-lg">{p.icon}</span>
                    <span>{p.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            {infoCards.map((c) => (
              <div key={c.label} className="card flex items-start gap-4 px-6 py-5">
                <div className="text-xl">{c.icon}</div>
                <div>
                  <div className="text-xs tracking-wide uppercase" style={{ color: "var(--muted)" }}>
                    {c.label}
                  </div>
                  <div className="mt-0.5 font-medium">{c.value}</div>
                  {c.sub && (
                    <div className="mt-0.5 text-sm" style={{ color: "var(--muted)" }}>
                      {c.sub}
                    </div>
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
