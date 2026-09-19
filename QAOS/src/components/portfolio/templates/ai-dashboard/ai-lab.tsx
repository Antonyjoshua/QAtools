"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolioContent } from "../shared/portfolio-content-context";

const STATUS_BY_TAG: Record<string, { color: string; bg: string; border: string; dot: string }> = {
  "Live Experiment": { color: "#4ade80", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.25)", dot: "#4ade80" },
  "In Progress": { color: "#06b6d4", bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.25)", dot: "#06b6d4" },
  Research: { color: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.25)", dot: "#a855f7" },
};
const DEFAULT_STATUS = { color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.25)", dot: "#94a3b8" };

export function AILab() {
  const { extras } = usePortfolioContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (extras.length === 0) return null;

  return (
    <section id="ai-lab" className="section-pad relative overflow-hidden" ref={ref}>
      <div className="grid-overlay pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 70%)" }} />
      <div className="animate-scan pointer-events-none absolute right-0 left-0 h-px opacity-20" style={{ background: "linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-16 text-center">
          <p className="font-mono-jb mb-3 text-xs tracking-[0.3em] text-cyan-400 uppercase">Experiments &amp; Research</p>
          <h2 className="font-display mb-4 font-bold text-white" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            The <span className="gradient-text">AI Lab</span>
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {extras.map((item, i) => {
            const s = STATUS_BY_TAG[item.tag] ?? DEFAULT_STATUS;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className="relative overflow-hidden rounded-2xl p-6"
                style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(124,58,237,0.12)", backdropFilter: "blur(20px)" }}
                whileHover={{ y: -4, borderColor: "rgba(124,58,237,0.35)", boxShadow: "0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(124,58,237,0.1)" }}
              >
                <div className="absolute top-0 right-6 left-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono-jb flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: s.dot }} />
                    {item.tag}
                  </span>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-display mb-2 text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
