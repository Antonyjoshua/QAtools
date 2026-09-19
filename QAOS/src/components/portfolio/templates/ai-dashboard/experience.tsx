"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolioContent } from "../shared/portfolio-content-context";

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export function Experience() {
  const { experience } = usePortfolioContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="section-pad relative" ref={ref}>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 40% at 20% 50%, rgba(6,182,212,0.05) 0%, transparent 70%)" }} />
      <div className="mx-auto max-w-5xl px-6">
        <motion.div variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} className="mb-16 text-center">
          <motion.p variants={fadeUp} className="font-mono-jb mb-3 text-xs tracking-[0.3em] uppercase" style={{ color: "#06b6d4" }}>
            Career Journey
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-display font-bold text-white" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            My <span className="gradient-text-cyan">Experience</span>
          </motion.h2>
        </motion.div>

        <div className="relative">
          <motion.div
            className="absolute top-0 bottom-0 left-6 w-px md:left-8"
            style={{ background: "linear-gradient(180deg, #7c3aed, #06b6d4, rgba(124,58,237,0.1))" }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />

          {experience.map((job) => (
            <motion.div key={job.id} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} className="relative pb-12 pl-16 md:pl-20">
              <motion.div
                className="absolute top-2 left-4 flex h-5 w-5 items-center justify-center rounded-full md:left-5"
                style={{
                  background: job.current ? "#06b6d4" : "#7c3aed",
                  boxShadow: job.current ? "0 0 0 4px rgba(6,182,212,0.2), 0 0 20px rgba(6,182,212,0.4)" : "0 0 0 4px rgba(124,58,237,0.2)",
                }}
                animate={job.current ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                variants={fadeUp}
                className="glass rounded-2xl p-6 md:p-8"
                style={{ border: "1px solid rgba(148,163,184,0.08)" }}
                whileHover={{ boxShadow: "0 0 40px rgba(124,58,237,0.12)", borderColor: "rgba(124,58,237,0.25)" }}
              >
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">{job.role}</h3>
                    <p className="text-violet-light mt-1">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.current && (
                      <span className="font-mono-jb rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "rgba(6,182,212,0.12)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" }}>
                        ● Current
                      </span>
                    )}
                    <span className="font-mono-jb rounded-full px-3 py-1 text-xs text-slate-400" style={{ background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.1)" }}>
                      {job.period}
                    </span>
                  </div>
                </div>

                <ul className="mb-6 space-y-3">
                  {job.highlights.map((h, i) => (
                    <motion.li key={i} variants={fadeUp} className="flex items-start gap-3 text-sm leading-relaxed text-slate-400">
                      <span className="text-violet-light mt-1 flex-shrink-0">▸</span>
                      {h}
                    </motion.li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 border-t pt-4" style={{ borderColor: "rgba(148,163,184,0.08)" }}>
                  {job.tech.map((t) => (
                    <span key={t} className="tech-tag">{t}</span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
