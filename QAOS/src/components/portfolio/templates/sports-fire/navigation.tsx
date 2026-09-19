"use client";

import { useEffect, useState } from "react";
import { usePortfolioContent } from "../shared/portfolio-content-context";
import { useAttachmentUrl } from "@/lib/portfolio/hooks/use-attachment-url";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#certifications", label: "Certifications" },
  { href: "#contact", label: "Contact" },
];

export function Navigation() {
  const { profile } = usePortfolioContent();
  const resumeUrl = useAttachmentUrl(profile.resumeAttachmentId);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLink(href: string) {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <nav
        className="fixed top-0 right-0 left-0 z-[200] flex h-20 items-center justify-between border-b px-8 transition-colors"
        style={{ borderColor: scrolled ? "rgba(255,98,0,0.22)" : "var(--border)", background: scrolled ? "rgba(8,8,8,0.97)" : "transparent" }}
      >
        <div className="flex items-center gap-3">
          <div className="font-display flex h-9 w-9 items-center justify-center rounded-lg text-lg tracking-wide text-white" style={{ background: "var(--orange)", boxShadow: "0 0 18px rgba(255,98,0,0.45)" }}>
            {initials || "AJ"}
          </div>
          <span className="font-display text-sm tracking-[4px]">{profile.name.toUpperCase()}</span>
        </div>

        <ul className="hidden gap-9 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <button onClick={() => handleLink(l.href)} className="text-sm font-medium tracking-wide transition-colors" style={{ color: "var(--muted)" }}>
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {resumeUrl && (
          <a
            href={resumeUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg px-5 py-2 text-xs font-bold tracking-[2px] text-white uppercase transition-all sm:block"
            style={{ background: "var(--orange)" }}
          >
            Download CV
          </a>
        )}

        <button onClick={() => setOpen(!open)} className="flex flex-col gap-1.5 p-1 md:hidden" aria-label="Menu">
          <span className="block h-0.5 w-6 rounded bg-white" />
          <span className="block h-0.5 w-6 rounded bg-white" />
          <span className="block h-0.5 w-6 rounded bg-white" />
        </button>
      </nav>

      {open && (
        <div className="fixed top-20 right-0 left-0 z-[199] flex flex-col gap-1 border-b p-5 md:hidden" style={{ background: "rgba(8,8,8,0.98)", borderColor: "var(--border)" }}>
          {links.map((l) => (
            <button key={l.href} onClick={() => handleLink(l.href)} className="border-b py-3 text-left text-sm font-medium" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
              {l.label}
            </button>
          ))}
          {resumeUrl && (
            <a href={resumeUrl} download target="_blank" rel="noopener noreferrer" className="mt-2 text-sm font-medium" style={{ color: "var(--orange)" }}>
              Download CV
            </a>
          )}
        </div>
      )}
    </>
  );
}
