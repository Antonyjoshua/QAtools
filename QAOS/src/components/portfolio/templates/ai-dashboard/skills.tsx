"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolioContent } from "../shared/portfolio-content-context";

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export function Skills() {
  const { skills } = usePortfolioContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="section-pad relative" ref={ref}>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6,182,212,0.05) 0%, transparent 70%)" }} />
      <div className="mx-auto max-w-7xl px-6">
        <motion.div variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} className="mb-16 text-center">
          <motion.p variants={fadeUp} className="font-mono-jb mb-3 text-xs tracking-[0.3em] uppercase" style={{ color: "#06b6d4" }}>
            Technical Arsenal
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-display font-bold text-white" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            Skills &amp; <span className="gradient-text-cyan">Expertise</span>
          </motion.h2>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skills.map((category) => (
            <motion.div
              key={category.id}
              variants={fadeUp}
              className="glass rounded-2xl p-6"
              style={{ border: "1px solid rgba(148,163,184,0.08)" }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(6,182,212,0.12)", borderColor: "rgba(6,182,212,0.3)" }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg" style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}>
                  {category.icon}
                </div>
                <h3 className="text-sm leading-tight font-semibold text-white">{category.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <motion.span
                    key={item}
                    className="font-mono-jb inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a855f7" }}
                    whileHover={{ scale: 1.07, background: "rgba(124,58,237,0.2)" }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
