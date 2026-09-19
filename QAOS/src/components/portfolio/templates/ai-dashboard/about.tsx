"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolioContent } from "../shared/portfolio-content-context";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const STAT_COLORS = ["#7c3aed", "#06b6d4", "#a855f7", "#06b6d4"];

function SectionLabel({ children }: { children: string }) {
  return (
    <motion.p variants={fadeUp} className="font-mono-jb mb-4 text-xs tracking-[0.3em] uppercase" style={{ color: "#7c3aed" }}>
      {children}
    </motion.p>
  );
}

export function About() {
  const { aboutParagraphs, stats, education, passions } = usePortfolioContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-pad relative" ref={ref}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)" }}
      />
      <div className="mx-auto max-w-7xl px-6">
        <motion.div variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} className="mb-20 text-center">
          <SectionLabel>Who I Am</SectionLabel>
          <motion.h2 variants={fadeUp} className="font-display mb-4 font-bold text-white" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Crafting <span className="gradient-text">Quality</span> at Scale
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto max-w-xl text-lg text-slate-400">
            A story of precision, automation, and the relentless pursuit of zero defects.
          </motion.p>
        </motion.div>

        <div className="mb-24 grid items-start gap-16 lg:grid-cols-2">
          <motion.div variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} className="space-y-5">
            {aboutParagraphs.map((p, i) => (
              <motion.p key={i} variants={fadeUp} className="leading-relaxed text-slate-400" style={{ fontSize: "1.05rem" }}>
                {p}
              </motion.p>
            ))}
            <motion.blockquote variants={fadeUp} className="glass mt-8 rounded-2xl border-l-2 p-6" style={{ borderLeftColor: "#7c3aed" }}>
              <p className="text-lg leading-relaxed text-slate-300 italic">
                &ldquo;Quality is not an act, it is a habit — and I&apos;ve made it my obsession.&rdquo;
              </p>
            </motion.blockquote>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.id}
                variants={fadeUp}
                className="glass rounded-2xl p-6 text-center"
                style={{ border: `1px solid ${STAT_COLORS[i % STAT_COLORS.length]}22` }}
                whileHover={{ boxShadow: `0 0 30px ${STAT_COLORS[i % STAT_COLORS.length]}22`, scale: 1.02 }}
              >
                <div className="font-display mb-1 text-3xl font-bold" style={{ color: STAT_COLORS[i % STAT_COLORS.length] }}>
                  {s.value}
                  {s.suffix}
                </div>
                <div className="text-xs tracking-widest text-slate-500 uppercase">{s.label}</div>
              </motion.div>
            ))}

            {education.length > 0 && (
              <motion.div variants={fadeUp} className="col-span-2 space-y-4 rounded-2xl p-6 glass" style={{ border: "1px solid rgba(124,58,237,0.15)" }}>
                {education.map((e, i) => (
                  <div key={e.id} className={i > 0 ? "flex items-start gap-4 border-t pt-4" : "flex items-start gap-4"} style={{ borderColor: "rgba(148,163,184,0.08)" }}>
                    <div className="text-2xl">{i === 0 ? "🎓" : "🏫"}</div>
                    <div>
                      <div className="font-semibold text-white">{e.degree}</div>
                      <div className="text-violet-light mt-0.5 text-sm">{e.institution}</div>
                      {(e.status || e.note) && <div className="font-mono-jb mt-1 text-xs text-slate-500">{e.status || e.note}</div>}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {passions.length > 0 && (
          <motion.div variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"}>
            <motion.h3 variants={fadeUp} className="font-display mb-10 text-center text-2xl font-bold text-white">
              What Drives Me
            </motion.h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {passions.map((p) => (
                <motion.div
                  key={p.id}
                  variants={fadeUp}
                  className="glass rounded-2xl p-6"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(124,58,237,0.15)", borderColor: "rgba(124,58,237,0.3)" }}
                  style={{ border: "1px solid rgba(148,163,184,0.08)", transition: "all 0.3s" }}
                >
                  <div className="mb-3 text-3xl">{p.icon}</div>
                  <h4 className="mb-2 font-semibold text-white">{p.title}</h4>
                  <p className="text-sm leading-relaxed text-slate-400">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
