"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolioContent } from "../shared/portfolio-content-context";

const STATUS_BY_TAG: Record<string, { color: string; className: string }> = {
  Live: { color: "#00d4ff", className: "border-green-400/40 text-green-400 bg-green-400/10" },
  "In Progress": { color: "#a855f7", className: "border-blue-400/40 text-blue-400 bg-blue-400/10" },
  Research: { color: "#00ff88", className: "border-yellow-400/40 text-yellow-400 bg-yellow-400/10" },
};
const DEFAULT_STATUS = { color: "#94a3b8", className: "border-slate-400/40 text-slate-400 bg-slate-400/10" };

export function AILab() {
  const { extras } = usePortfolioContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  if (extras.length === 0) return null;

  return (
    <section id="ailab" ref={ref} className="relative overflow-hidden py-32" style={{ background: "linear-gradient(to bottom, #050514, #04021a, #050514)" }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.05) 1px,transparent 1px)", backgroundSize: "40px 40px" }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)", filter: "blur(40px)" }}
      />

      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-6">
          <p className="section-tag">{"// 006 — R&D"}</p>
          <h2 className="section-title text-white">
            AI Research
            <br />
            <span className="gradient-text">Laboratory</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="mb-16 flex flex-wrap items-center gap-4 rounded-xl border border-cyan-400/15 bg-cyan-400/3 p-4 font-mono text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="tracking-widest text-green-400">LAB ONLINE</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">FACILITY: AI-QA RESEARCH CENTER</span>
          <span className="text-slate-600">|</span>
          <span className="tracking-widest text-cyan-400">CLEARANCE: LEVEL 5</span>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {extras.map((item, i) => {
            const s = STATUS_BY_TAG[item.tag] ?? DEFAULT_STATUS;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="scan-container group relative cursor-default overflow-hidden rounded-2xl p-6 transition-all duration-300 glass-strong hover:-translate-y-2"
                style={{ boxShadow: `0 0 0 1px ${s.color}18` }}
              >
                <div className="absolute top-0 right-0 left-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />

                <div className="mb-4">
                  <span className={`rounded-md border px-2 py-0.5 font-mono text-xs ${s.className}`}>
                    {item.tag === "Live" && "● "}
                    {item.tag}
                  </span>
                </div>

                <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${s.color}12`, border: `1px solid ${s.color}30` }}>
                  <span className="relative text-2xl">{item.icon}</span>
                </div>

                <h3 className="mb-2 text-lg font-black text-white" style={{ fontFamily: "Exo 2" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>

                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 font-mono text-xs text-slate-600">
                  <span>MODULE_{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ color: s.color }}>ACTIVE</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
