"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolioContent } from "../shared/portfolio-content-context";

const COLORS = ["#00d4ff", "#a855f7", "#00ff88", "#ff2d78", "#f97316", "#0052cc", "#d24939"];

export function Skills() {
  const { skills } = usePortfolioContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="skills" ref={ref} className="relative overflow-hidden py-32" style={{ background: "linear-gradient(to bottom, #050514, #06011a, #050514)" }}>
      <div
        className="pointer-events-none absolute top-1/2 left-0 h-80 w-80 -translate-y-1/2 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #00d4ff, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="pointer-events-none absolute top-1/2 right-0 h-80 w-80 -translate-y-1/2 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)", filter: "blur(80px)" }}
      />

      <div className="mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-20">
          <p className="section-tag">{"// 004 — Arsenal"}</p>
          <h2 className="section-title text-white">
            Tech
            <br />
            <span className="gradient-text">Mastery</span>
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {skills.map((group, i) => {
            const color = COLORS[i % COLORS.length];
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group relative cursor-default overflow-hidden rounded-2xl p-5 transition-all duration-300 glass hover:glass-strong"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(circle at left center, ${color}0a, transparent 60%)` }} />

                <div className="relative z-10 mb-4 flex items-center gap-3">
                  <div className="relative flex h-9 w-9 items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2.5 + i * 0.2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: color, filter: "blur(6px)" }}
                    />
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full text-base" style={{ background: `${color}20` }}>
                      {group.icon}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white" style={{ fontFamily: "Exo 2" }}>
                      {group.category}
                    </span>
                    <div className="font-mono text-xs text-slate-500">{group.items.length} skills</div>
                  </div>
                </div>

                <div className="relative z-10 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-md border px-2 py-0.5 font-mono text-xs" style={{ color, borderColor: `${color}30`, background: `${color}08` }}>
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
