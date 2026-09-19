"use client";

import { usePortfolioContent } from "../shared/portfolio-content-context";
import { useAttachmentUrl } from "@/lib/portfolio/hooks/use-attachment-url";

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  const { profile } = usePortfolioContent();
  const resumeUrl = useAttachmentUrl(profile.resumeAttachmentId);
  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <footer className="border-t py-10" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <div className="font-display flex h-9 w-9 items-center justify-center rounded-lg text-sm text-white" style={{ background: "var(--orange)" }}>
            {initials || "AJ"}
          </div>
          <span className="font-display text-sm tracking-[2px]">{profile.name.toUpperCase()}</span>
        </div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <nav className="flex flex-wrap justify-center gap-5 text-sm" style={{ color: "var(--muted)" }}>
          {links.map((l) => (
            <button key={l.href} onClick={() => document.querySelector(l.href)?.scrollIntoView({ behavior: "smooth" })}>
              {l.label}
            </button>
          ))}
          {resumeUrl && (
            <a href={resumeUrl} download target="_blank" rel="noopener noreferrer">
              CV
            </a>
          )}
        </nav>
      </div>
    </footer>
  );
}
