"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolioContent } from "../shared/portfolio-content-context";
import { useAttachmentUrl } from "@/lib/portfolio/hooks/use-attachment-url";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#ailab", label: "AI Lab" },
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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLink(href: string) {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 right-0 left-0 z-50"
        style={{ fontFamily: "Exo 2, sans-serif" }}
      >
        <div className={`mx-4 mt-4 rounded-2xl transition-all duration-500 ${scrolled ? "border border-white/10 bg-black/60 shadow-2xl backdrop-blur-2xl" : "bg-transparent"}`}>
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="group flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 opacity-20 transition-opacity group-hover:opacity-40" />
                <div className="absolute inset-0 rounded-lg border border-cyan-400/40 transition-colors group-hover:border-cyan-400/80" />
                <span className="text-base font-black tracking-tight text-cyan-400">{initials || "AJ"}</span>
              </div>
              <span className="hidden text-sm font-bold tracking-widest text-white opacity-70 transition-opacity group-hover:opacity-100 sm:block">
                {profile.name.toUpperCase()}
              </span>
            </button>

            <div className="hidden items-center gap-7 md:flex">
              {links.map((l) => (
                <button key={l.href} onClick={() => handleLink(l.href)} className="group relative text-xs font-semibold tracking-widest text-slate-400 uppercase transition-colors hover:text-cyan-400">
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="hidden items-center gap-2 rounded-lg border border-cyan-400/40 px-4 py-2 text-xs font-bold tracking-widest text-cyan-400 uppercase transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-400/10 sm:flex"
                >
                  <span>⬇</span> Resume
                </a>
              )}
              <button onClick={() => setOpen(!open)} className="flex flex-col gap-1.5 p-2 md:hidden" aria-label="Toggle menu">
                <span className={`block h-px w-5 bg-cyan-400 transition-all ${open ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`block h-px w-5 bg-cyan-400 transition-all ${open ? "opacity-0" : ""}`} />
                <span className={`block h-px w-5 bg-cyan-400 transition-all ${open ? "-translate-y-2 -rotate-45" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass fixed top-20 right-4 left-4 z-40 flex flex-col gap-4 rounded-2xl border border-white/10 p-6 md:hidden"
          >
            {links.map((l) => (
              <button key={l.href} onClick={() => handleLink(l.href)} className="text-left text-sm font-bold tracking-widest text-slate-300 uppercase transition-colors hover:text-cyan-400">
                {l.label}
              </button>
            ))}
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" download className="flex items-center gap-2 border-t border-white/10 pt-4 text-sm font-bold tracking-widest text-cyan-400 uppercase">
                ⬇ Download Resume
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
