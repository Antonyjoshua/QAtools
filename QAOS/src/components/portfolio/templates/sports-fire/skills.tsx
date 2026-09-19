"use client";

import { usePortfolioContent } from "../shared/portfolio-content-context";

export function Skills() {
  const { skills } = usePortfolioContent();

  return (
    <section id="skills" className="section-dark py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-16">
          <span className="section-tag">Expertise</span>
          <h2 className="section-title">SKILLS</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <div key={group.id} className="card p-7">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-xl">{group.icon}</span>
                <span className="font-display text-lg tracking-wide">{group.category}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-white/80"
                    style={{ background: "rgba(255,98,0,0.06)", border: "1px solid rgba(255,98,0,0.11)" }}
                  >
                    {item}
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
