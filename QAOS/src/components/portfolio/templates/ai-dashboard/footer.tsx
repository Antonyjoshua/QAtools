"use client";

import { motion } from "framer-motion";
import { Mail, ArrowUp } from "lucide-react";
import { usePortfolioContent } from "../shared/portfolio-content-context";
import { GithubIcon, LinkedinIcon, type SocialIconComponent } from "../shared/social-icons";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#certifications", label: "Certifications" },
  { href: "#ai-lab", label: "AI Lab" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  const { profile } = usePortfolioContent();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const connectLinks = [
    profile.email && { Icon: Mail, href: `mailto:${profile.email}`, label: profile.email },
    profile.github && { Icon: GithubIcon, href: profile.github, label: profile.github.replace(/^https?:\/\//, "") },
    profile.linkedin && { Icon: LinkedinIcon, href: profile.linkedin, label: profile.linkedin.replace(/^https?:\/\//, "") },
  ].filter((l): l is { Icon: SocialIconComponent; href: string; label: string } => Boolean(l));

  return (
    <footer className="relative border-t pt-16 pb-8" style={{ background: "rgba(3,7,17,0.95)", borderColor: "rgba(148,163,184,0.08)" }}>
      <div className="absolute top-0 right-0 left-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)" }} />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 grid gap-10 md:grid-cols-3">
          <div>
            <div className="font-display gradient-text mb-3 text-2xl font-bold">{profile.name}</div>
            <p className="max-w-56 text-sm leading-relaxed text-slate-500">{profile.role}</p>
            <div className="mt-4 flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="font-mono-jb text-xs text-emerald-400">Available for hire</span>
            </div>
          </div>

          <div>
            <h4 className="font-mono-jb mb-4 text-xs tracking-widest text-slate-400 uppercase">Navigation</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => document.getElementById(l.href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" })}
                    className="text-sm text-slate-500 transition-colors hover:text-slate-300"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono-jb mb-4 text-xs tracking-widest text-slate-400 uppercase">Connect</h4>
            <div className="flex flex-col gap-3">
              {connectLinks.map(({ Icon, href, label }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-300">
                  <Icon size={14} />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row" style={{ borderColor: "rgba(148,163,184,0.06)" }}>
          <p className="font-mono-jb text-xs text-slate-600">
            © {new Date().getFullYear()} {profile.name}
            {profile.location ? ` · ${profile.location}` : ""}
          </p>
          <motion.button
            onClick={scrollTop}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:text-white"
            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
            whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
