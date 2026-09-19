"use client";

import { useState } from "react";
import { usePortfolioContent } from "../shared/portfolio-content-context";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#certifications", label: "Certs" },
  { href: "#contact", label: "Contact" },
];

export function Navigation({ theme, onToggleTheme }: { theme: "dark" | "light"; onToggleTheme: () => void }) {
  const { profile } = usePortfolioContent();
  const [open, setOpen] = useState(false);

  function handleLink(href: string) {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className="fixed top-0 right-0 left-0 z-[200] h-16 border-b" style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
      <div className="mx-auto flex h-full max-w-[1100px] items-center justify-between px-6">
        <span className="font-mono-jb text-xl font-bold" style={{ color: "var(--text)" }}>
          {profile.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
          <span className="accent">.</span>
        </span>

        <div className="flex items-center gap-5">
          <ul className="hidden list-none items-center gap-8 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <button onClick={() => handleLink(l.href)} className="text-sm font-medium transition-colors" style={{ color: "var(--text-muted)" }}>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={onToggleTheme}
            className="flex items-center rounded-full border px-3 py-1.5 text-sm transition-all"
            style={{ background: "var(--bg3)", borderColor: "var(--border)", color: "var(--text)" }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button onClick={() => setOpen(!open)} className="flex flex-col gap-1.5 p-1 md:hidden" aria-label="Menu">
            <span className="block h-0.5 w-6 rounded" style={{ background: "var(--text)" }} />
            <span className="block h-0.5 w-6 rounded" style={{ background: "var(--text)" }} />
            <span className="block h-0.5 w-6 rounded" style={{ background: "var(--text)" }} />
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute top-16 right-0 left-0 flex flex-col gap-4 border-b p-6 md:hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
          {links.map((l) => (
            <button key={l.href} onClick={() => handleLink(l.href)} className="text-left text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
