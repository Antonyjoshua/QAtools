"use client";

import { usePortfolioContent } from "../shared/portfolio-content-context";

export function Skills() {
  const { skills } = usePortfolioContent();

  return (
    <section id="skills" className="py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="section-title">
          Technical <span className="accent">Skills</span>
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <div key={group.id} className="card p-6">
              <div className="mb-2 text-2xl">{group.icon}</div>
              <h3 className="mb-3 font-semibold" style={{ color: "var(--text)" }}>
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="tag">
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
