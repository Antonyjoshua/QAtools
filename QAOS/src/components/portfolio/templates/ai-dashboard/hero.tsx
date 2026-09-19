"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, Download } from "lucide-react";
import { usePortfolioContent } from "../shared/portfolio-content-context";
import { useAttachmentUrl } from "@/lib/portfolio/hooks/use-attachment-url";

const roles = ["Quality Analyst", "Automation Engineer", "AI QA Specialist", "Test Architect"];

const floatingBadges = [
  { label: "Playwright", color: "rgba(124,58,237,0.15)", border: "rgba(124,58,237,0.35)" },
  { label: "TypeScript", color: "rgba(6,182,212,0.15)", border: "rgba(6,182,212,0.35)" },
  { label: "AI Testing", color: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.35)" },
  { label: "Selenium", color: "rgba(124,58,237,0.15)", border: "rgba(124,58,237,0.35)" },
  { label: "JIRA", color: "rgba(6,182,212,0.15)", border: "rgba(6,182,212,0.35)" },
];

export function Hero() {
  const { profile, stats } = usePortfolioContent();
  const resumeUrl = useAttachmentUrl(profile.resumeAttachmentId);
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayRole, setDisplayRole] = useState(roles[0]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const current = roles[roleIdx];
    if (!deleting) {
      if (displayRole.length < current.length) {
        timeout = setTimeout(() => setDisplayRole(current.slice(0, displayRole.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setDeleting(true), 2000);
      }
    } else {
      if (displayRole.length > 0) {
        timeout = setTimeout(() => setDisplayRole(displayRole.slice(0, -1)), 50);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- advances the typewriter loop to the next role
        setDeleting(false);
        setRoleIdx((i) => (i + 1) % roles.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayRole, deleting, roleIdx]);

  const nameParts = profile.name.split(" ");
  const heroStats = stats.slice(0, 3);

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(124,58,237,0.12) 0%, transparent 70%), " +
            "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(6,182,212,0.08) 0%, transparent 60%), " +
            "linear-gradient(180deg, rgba(3,7,17,0.3) 0%, rgba(3,7,17,0.85) 85%, #030711 100%)",
        }}
      />
      <div className="grid-overlay pointer-events-none absolute inset-0 z-[1] opacity-30" />

      <div className="relative z-[2] mx-auto flex max-w-7xl flex-col items-center px-6 pt-24 pb-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs"
          style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80" }}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Available for opportunities · {profile.location}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mb-4 leading-none font-bold"
          style={{ fontSize: "clamp(2.8rem, 8vw, 6.5rem)" }}
        >
          <span className="text-white">{nameParts[0]} </span>
          <span className="gradient-text">{nameParts.slice(1).join(" ")}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6 flex h-8 items-center font-mono text-xl font-medium md:text-2xl"
          style={{ color: "#94a3b8" }}
        >
          <span className="text-violet-light">{"> "}</span>
          <span style={{ color: "#e2e8f0" }}>{displayRole}</span>
          <span className="text-violet-light ml-1 animate-pulse">_</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-400"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mb-16 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
            whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(124,58,237,0.5)" }}
            whileTap={{ scale: 0.97 }}
          >
            View My Work
            <ArrowRight size={17} />
          </motion.button>

          {resumeUrl && (
            <motion.a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="glass flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-slate-300"
              whileHover={{ scale: 1.04, color: "#fff", borderColor: "rgba(124,58,237,0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Download size={17} />
              Download CV
            </motion.a>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-12 flex flex-wrap justify-center gap-2"
        >
          {floatingBadges.map((b, i) => (
            <motion.span
              key={b.label}
              className="tech-tag"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              whileHover={{ scale: 1.08, y: -2 }}
            >
              {b.label}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap justify-center gap-8"
        >
          {heroStats.map((s) => (
            <div key={s.id} className="text-center">
              <div className="font-display gradient-text text-2xl font-bold">
                {s.value}
                {s.suffix}
              </div>
              <div className="mt-0.5 text-xs tracking-widest text-slate-500 uppercase">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2 text-slate-500 transition-colors hover:text-slate-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.1 }}
      >
        <span className="font-mono text-xs tracking-[0.2em] uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>
    </section>
  );
}
