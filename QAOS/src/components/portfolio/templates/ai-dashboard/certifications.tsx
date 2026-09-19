"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolioContent } from "../shared/portfolio-content-context";

const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const COLORS = ["#7c3aed", "#06b6d4", "#a855f7", "#06b6d4"];

export function Certifications() {
  const { certifications } = usePortfolioContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="certifications" className="section-pad relative" ref={ref}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 40% at 80% 50%, rgba(168,85,247,0.05) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 20% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)" }}
      />
      <div className="mx-auto max-w-6xl px-6">
        <motion.div variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} className="mb-16 text-center">
          <motion.p variants={fadeUp} className="font-mono-jb mb-3 text-xs tracking-[0.3em] uppercase" style={{ color: "#a855f7" }}>
            Credentials
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-display font-bold text-white" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            Certifications &amp; <span className="gradient-text">Achievements</span>
          </motion.h2>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} className="grid gap-6 sm:grid-cols-2">
          {certifications.map((cert, idx) => {
            const color = COLORS[idx % COLORS.length];
            return (
              <motion.div
                key={cert.id}
                variants={fadeUp}
                className="glass relative overflow-hidden rounded-2xl p-6"
                style={{ border: `1px solid ${color}22` }}
                whileHover={{ y: -4, boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 40px ${color}18`, borderColor: `${color}44` }}
              >
                <div className="absolute top-0 right-0 left-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                <div className="font-mono-jb absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold" style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="mb-5 pr-10">
                  <div className="font-mono-jb mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs" style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}>
                    🏅 {cert.issuer}
                  </div>
                  <h3 className="font-display text-lg leading-snug font-bold text-white">{cert.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{cert.subtitle}</p>
                </div>
                <div className="font-mono-jb mb-5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>📅 {cert.date}</span>
                  {cert.instructor && cert.instructor !== cert.issuer && <span>👤 {cert.instructor}</span>}
                  {cert.duration && <span>⏱ {cert.duration}</span>}
                </div>
                <div className="flex flex-wrap gap-2 border-t pt-4" style={{ borderColor: "rgba(148,163,184,0.08)" }}>
                  {cert.skills.map((skill) => (
                    <span key={skill} className="font-mono-jb inline-flex items-center rounded-full px-2.5 py-1 text-xs" style={{ background: `${color}10`, border: `1px solid ${color}22`, color }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
