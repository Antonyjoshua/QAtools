"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolioContent } from "../shared/portfolio-content-context";

const PANEL_ICONS = ["⚡", "🐛", "🚀", "🌐"];
const PANEL_COLORS = ["#00d4ff", "#a855f7", "#00ff88", "#ff2d78"];

const abilities = [
  { icon: "🧪", label: "Automation Engineering" },
  { icon: "🤖", label: "AI-Driven Testing" },
  { icon: "🔍", label: "Precision Bug Analysis" },
  { icon: "📱", label: "Cross-Platform Testing" },
  { icon: "🛠️", label: "Developer Tooling" },
  { icon: "🚀", label: "Future-Ready QA" },
];

export function About() {
  const { aboutParagraphs, stats, education, experience } = usePortfolioContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const currentRole = experience.find((e) => e.current) ?? experience[0];

  const card = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <section id="about" ref={ref} className="relative overflow-hidden py-32" style={{ background: "linear-gradient(to bottom, #050514, #08021a, #050514)" }}>
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)", filter: "blur(40px)" }}
      />

      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-20">
          <p className="section-tag">{"// 001 — About The Engineer"}</p>
          <h2 className="section-title text-white">
            AI Control
            <br />
            <span className="gradient-text">Room</span>
          </h2>
        </motion.div>

        <div className="grid items-start gap-16 lg:grid-cols-2">
          <motion.div
            variants={{ hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } } }}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            <div className="relative mb-10 w-fit">
              <div className="relative flex h-40 w-40 items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: "conic-gradient(from 0deg, #00d4ff, #7c3aed, #00d4ff)", padding: 2 }}
                >
                  <div className="h-full w-full rounded-full" style={{ background: "#080821" }} />
                </motion.div>
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-3 rounded-full border border-dashed border-cyan-400/30" />
                <div className="hologram relative z-10 flex h-28 w-28 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))" }}>
                  <span className="text-5xl">👨‍💻</span>
                </div>
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                  <motion.div
                    className="absolute right-0 left-0 h-px opacity-50"
                    style={{ background: "linear-gradient(90deg,transparent,#00d4ff,transparent)" }}
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-cyan-400/40 bg-cyan-400/5 px-3 py-1 font-mono text-xs whitespace-nowrap text-cyan-400">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                ONLINE
              </div>
            </div>

            <div className="mb-8 space-y-4">
              {aboutParagraphs.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-slate-300">
                  {p}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {abilities.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="bg-white/2 flex cursor-default items-center gap-2.5 rounded-lg border border-white/5 px-3 py-2.5 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/5"
                >
                  <span className="text-lg">{a.icon}</span>
                  <span className="text-sm font-medium text-slate-300">{a.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            {stats.slice(0, 4).map((s, i) => {
              const color = PANEL_COLORS[i % PANEL_COLORS.length];
              return (
                <motion.div key={s.id} variants={card} className="group relative cursor-default overflow-hidden rounded-2xl p-5 transition-transform duration-300 glass-strong hover:-translate-y-1">
                  <div className="absolute top-0 right-0 left-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
                  <div className="pointer-events-none absolute right-0 bottom-0 h-20 w-20 rounded-full opacity-10" style={{ background: color, filter: "blur(20px)", transform: "translate(30%, 30%)" }} />
                  <span className="mb-3 block text-2xl">{PANEL_ICONS[i % PANEL_ICONS.length]}</span>
                  <div className="mb-1 text-3xl font-black" style={{ fontFamily: "Exo 2", color }}>
                    {s.value}
                    {s.suffix}
                  </div>
                  <div className="mb-0.5 text-xs font-bold tracking-wider text-white">{s.label}</div>
                </motion.div>
              );
            })}

            {education.length > 0 && (
              <motion.div variants={card} className="glass-strong relative col-span-2 overflow-hidden rounded-2xl p-5">
                <div className="absolute top-0 right-0 left-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #a855f7, transparent)" }} />
                <div className="mb-3 font-mono text-xs tracking-widest text-purple-400 uppercase">🎓 Education</div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  {education.map((e) => (
                    <div key={e.id} className="bg-white/3 flex-1 rounded-xl border border-white/5 p-3">
                      <div className="font-black text-white" style={{ fontFamily: "Exo 2" }}>
                        {e.degree}
                      </div>
                      <div className="text-sm text-slate-300">{e.institution}</div>
                      {(e.status || e.note) && <div className="mt-0.5 font-mono text-xs text-cyan-400">{e.status || e.note}</div>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentRole && (
              <motion.div variants={card} className="glass-strong relative col-span-2 overflow-hidden rounded-2xl p-5">
                <div className="absolute top-0 right-0 left-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #00d4ff, transparent)" }} />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-1 font-mono text-xs tracking-widest text-cyan-400 uppercase">💼 Current Mission</div>
                    <div className="text-lg font-black text-white" style={{ fontFamily: "Exo 2" }}>
                      {currentRole.role}
                    </div>
                    <div className="text-sm text-slate-300">
                      {currentRole.company} · {currentRole.period}
                    </div>
                  </div>
                  {currentRole.current && (
                    <div className="flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1.5">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                      <span className="font-mono text-xs text-green-400">ACTIVE</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
