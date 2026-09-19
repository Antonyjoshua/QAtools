"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { usePortfolioContent } from "../shared/portfolio-content-context";

const COLORS = ["#00d4ff", "#a855f7", "#00ff88", "#ff2d78", "#f97316"];

export function Experience() {
  const { experience } = usePortfolioContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="experience" ref={ref} className="relative overflow-hidden py-32" style={{ background: "linear-gradient(to bottom, #050514, #0a021f, #050514)" }}>
      <div className="pointer-events-none absolute top-1/3 right-0 h-96 w-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)", filter: "blur(80px)" }} />

      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-20">
          <p className="section-tag">{"// 002 — Career"}</p>
          <h2 className="section-title text-white">
            Mission
            <br />
            <span className="gradient-text">Timeline</span>
          </h2>
        </motion.div>

        <div className="relative">
          <motion.div
            className="absolute top-0 bottom-0 left-6 w-px -translate-x-1/2 md:left-1/2"
            style={{ background: "linear-gradient(to bottom, transparent, #00d4ff 10%, #7c3aed 50%, #00d4ff 90%, transparent)" }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          />

          <div className="flex flex-col gap-8">
            {experience.map((job, i) => {
              const color = COLORS[i % COLORS.length];
              const mission = job.current ? "MISSION ACTIVE" : "MISSION COMPLETE";
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex flex-col gap-6 pl-14 md:pl-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div
                    className="absolute top-6 left-3.5 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full md:left-1/2"
                    style={{ background: color, boxShadow: `0 0 0 4px rgba(5,5,20,1), 0 0 20px ${color}` }}
                  >
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>

                  <div className={`hidden flex-1 items-start pt-5 md:flex ${i % 2 === 0 ? "justify-end pr-10" : "justify-start pl-10"}`}>
                    <div className="text-right">
                      <div className="mb-1 font-mono text-xs tracking-widest" style={{ color }}>
                        {mission}
                      </div>
                      <div className="font-mono text-sm text-slate-400">{job.period}</div>
                    </div>
                  </div>

                  <div className="flex-1 md:max-w-[calc(50%-2.5rem)]">
                    <div
                      onClick={() => setActive(active === i ? null : i)}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl p-6 transition-all duration-300 glass-strong hover:border-cyan-400/30"
                      style={{ borderTop: `2px solid ${color}40` }}
                    >
                      <div className="absolute top-0 right-0 left-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <div className="mb-1.5 font-mono text-xs tracking-widest md:hidden" style={{ color }}>
                            {mission} · {job.period}
                          </div>
                          <h3 className="mb-0.5 text-lg leading-tight font-black text-white" style={{ fontFamily: "Exo 2" }}>
                            {job.role}
                          </h3>
                          <p className="text-sm font-semibold" style={{ color }}>
                            {job.company}
                          </p>
                        </div>
                        <motion.span className="mt-1 text-slate-400" animate={{ rotate: active === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          ▾
                        </motion.span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {job.tech.map((t) => (
                          <span key={t} className="rounded-md border px-2 py-0.5 font-mono text-xs" style={{ color, borderColor: `${color}30`, background: `${color}08` }}>
                            {t}
                          </span>
                        ))}
                      </div>

                      <AnimatePresence>
                        {active === i && job.highlights.length > 0 && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden">
                            <div className="mt-4 border-t border-white/5 pt-4">
                              <ul className="space-y-2">
                                {job.highlights.map((h, j) => (
                                  <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
                                    <span style={{ color }} className="mt-0.5 shrink-0">
                                      ›
                                    </span>
                                    {h}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
