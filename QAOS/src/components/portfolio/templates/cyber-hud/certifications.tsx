"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolioContent } from "../shared/portfolio-content-context";

const COLORS = ["#7c3aed", "#00d4ff", "#a855f7", "#00ff88"];
const BADGES = ["🏆", "🤖", "⚡", "🚀"];

export function Certifications() {
  const { certifications } = usePortfolioContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="certifications" ref={ref} className="relative overflow-hidden py-32" style={{ background: "linear-gradient(to bottom, #050514, #090219, #050514)" }}>
      <div
        className="opacity-8 pointer-events-none absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-20">
          <p className="section-tag">{"// 005 — Credentials"}</p>
          <h2 className="section-title text-white">
            Battle
            <br />
            <span className="gradient-text">Certified</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {certifications.map((c, i) => {
            const color = COLORS[i % COLORS.length];
            const badge = BADGES[i % BADGES.length];
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-3xl p-7 transition-all duration-300 glass-strong hover:-translate-y-1"
                style={{ boxShadow: `0 0 0 1px ${color}20` }}
              >
                <div className="absolute top-0 right-0 left-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
                <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: color, filter: "blur(30px)", transform: "translate(50%, -50%)" }} />
                <div className="card-shimmer" />

                <div className="relative z-10 flex items-start gap-5">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl" style={{ background: `${color}15`, border: `1px solid ${color}40` }}>
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: color, filter: "blur(8px)" }}
                    />
                    <span className="relative">{badge}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-base leading-snug font-black text-white" style={{ fontFamily: "Exo 2" }}>
                      {c.title}
                    </div>
                    <div className="mb-3 leading-snug text-slate-400">{c.subtitle}</div>

                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {c.skills.map((s) => (
                        <span key={s} className="rounded-md border px-2 py-0.5 font-mono text-xs" style={{ color, borderColor: `${color}30`, background: `${color}08` }}>
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 font-mono text-xs text-slate-500">
                      <span style={{ color }}>{c.issuer}</span>
                      {c.date && (
                        <>
                          <span>·</span>
                          <span>{c.date}</span>
                        </>
                      )}
                      {c.duration && (
                        <>
                          <span>·</span>
                          <span>{c.duration}</span>
                        </>
                      )}
                    </div>
                    {c.instructor && c.instructor !== c.issuer && <div className="mt-0.5 font-mono text-xs text-slate-600">by {c.instructor}</div>}
                  </div>
                </div>

                <div className="absolute right-5 bottom-5 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="rounded-lg border px-2.5 py-1 font-mono text-xs" style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
                    VERIFIED ✓
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
