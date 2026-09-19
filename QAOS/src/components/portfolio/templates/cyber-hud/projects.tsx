"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { usePortfolioContent } from "../shared/portfolio-content-context";
import type { PortfolioProjectItem } from "@/lib/portfolio/types";

const COLORS = ["#7c3aed", "#0891b2", "#ea580c", "#2563eb", "#059669", "#db2777", "#ca8a04", "#475569"];
const GRADIENTS = ["from-violet-600 to-purple-900", "from-cyan-600 to-blue-900", "from-orange-600 to-red-900", "from-blue-600 to-indigo-900", "from-emerald-600 to-teal-900", "from-pink-600 to-rose-900", "from-amber-600 to-orange-900", "from-slate-600 to-gray-900"];
const ICONS = ["📚", "🎡", "🤖", "🥽", "🏢", "🏨", "🏦", "📇"];

function ProjectCard({ p, i, onClick }: { p: PortfolioProjectItem; i: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const color = COLORS[i % COLORS.length];
  const gradient = GRADIENTS[i % GRADIENTS.length];
  const icon = ICONS[i % ICONS.length];

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -18;
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale(1.03)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="tilt-card group relative h-64 cursor-pointer overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-2xl glass-strong"
      style={{ boxShadow: `0 0 0 1px ${color}20` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br opacity-20 ${gradient}`} />
      <div className="absolute top-0 right-0 left-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div className="card-shimmer" />

      <div className="relative z-10 flex h-full flex-col p-5">
        <div className="mb-auto flex items-start justify-between">
          <span className="text-3xl">{icon}</span>
          {p.status && (
            <span className="rounded-full border px-2 py-0.5 text-xs font-mono capitalize" style={{ color, borderColor: `${color}50`, background: `${color}15` }}>
              {p.status}
            </span>
          )}
        </div>
        <div>
          <div className="mb-0.5 text-base leading-tight font-black text-white" style={{ fontFamily: "Exo 2" }}>
            {p.title}
          </div>
          <div className="mb-3 font-mono text-xs" style={{ color }}>
            {p.subtitle}
          </div>
          <div className="flex flex-wrap gap-1">
            {p.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs text-slate-300">
                {t}
              </span>
            ))}
            {p.tags.length > 3 && <span className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs text-slate-500">+{p.tags.length - 3}</span>}
          </div>
        </div>
      </div>

      <div className="absolute right-3 bottom-3 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex items-center gap-1 font-mono text-xs text-slate-400">
          View <span style={{ color }}>›</span>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const { projects } = usePortfolioContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [selected, setSelected] = useState<number | null>(null);
  const selectedProject = selected !== null ? projects[selected] : null;
  const selectedColor = selected !== null ? COLORS[selected % COLORS.length] : "#00d4ff";

  return (
    <section id="projects" ref={ref} className="relative overflow-hidden py-32" style={{ background: "linear-gradient(to bottom, #050514, #070220, #050514)" }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px)", backgroundSize: "80px 80px" }}
      />

      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-20">
          <p className="section-tag">{"// 003 — Portfolio"}</p>
          <h2 className="section-title text-white">
            Project
            <br />
            <span className="gradient-text">Chambers</span>
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {projects.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}>
              <ProjectCard p={p} i={i} onClick={() => setSelected(i)} />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(5,5,20,0.85)", backdropFilter: "blur(20px)" }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl p-8 glass-strong"
            >
              <div className="absolute top-0 right-0 left-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${selectedColor}, transparent)` }} />
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="text-4xl">{ICONS[selected! % ICONS.length]}</span>
                  <div className="mt-2 text-2xl font-black text-white" style={{ fontFamily: "Exo 2" }}>
                    {selectedProject.title}
                  </div>
                  <div className="mt-0.5 font-mono text-sm" style={{ color: selectedColor }}>
                    {selectedProject.subtitle}
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-white/30 hover:text-white">
                  ✕
                </button>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-slate-300">{selectedProject.description}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedProject.tags.map((t) => (
                  <span key={t} className="rounded-lg border px-2.5 py-1 font-mono text-xs" style={{ color: selectedColor, borderColor: `${selectedColor}40`, background: `${selectedColor}0d` }}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between font-mono text-xs text-slate-500">
                <span>{selectedProject.company}</span>
                {selectedProject.status && (
                  <span className="rounded-full border px-2 py-0.5 text-xs capitalize" style={{ color: selectedColor, borderColor: `${selectedColor}50`, background: `${selectedColor}10` }}>
                    {selectedProject.status}
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
