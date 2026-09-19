"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import { usePortfolioContent } from "../shared/portfolio-content-context";
import { GithubIcon } from "../shared/social-icons";
import type { PortfolioProjectItem } from "@/lib/portfolio/types";

const GRADIENTS = ["#7c3aed, #581c87", "#0891b2, #1e3a8a", "#ea580c, #4c0519", "#059669, #134e4a", "#2563eb, #1e1b4b", "#ca8a04, #7c2d12", "#db2777, #581c87", "#0d9488, #164e63", "#475569, #111827"];
const STATUS_COLOR: Record<string, { bg: string; border: string; text: string; label: string }> = {
  live: { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)", text: "#4ade80", label: "● Live" },
  enterprise: { bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.3)", text: "#fb923c", label: "⚡ Enterprise" },
  wip: { bg: "rgba(6,182,212,0.1)", border: "rgba(6,182,212,0.3)", text: "#22d3ee", label: "🚧 WIP" },
};

function ProjectCard({ project, index }: { project: PortfolioProjectItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const status = STATUS_COLOR[project.status] ?? STATUS_COLOR.enterprise;
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "rgba(15,23,42,0.6)",
        border: hovered ? "1px solid rgba(124,58,237,0.35)" : "1px solid rgba(148,163,184,0.08)",
        backdropFilter: "blur(20px)",
        transition: "border-color 0.3s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(124,58,237,0.15)" }}
    >
      <div className="relative flex h-44 items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${gradient})` }}>
        <div className="absolute inset-0" style={{ background: "rgba(3,7,17,0.3)" }} />
        <div className="grid-overlay absolute inset-0 opacity-20" style={{ backgroundSize: "24px 24px" }} />
        <motion.div className="relative z-10 text-6xl" animate={hovered ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
          📦
        </motion.div>
        <div className="font-mono-jb absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.text }}>
          {status.label}
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-display mb-1 text-xl font-bold text-white">{project.title}</h3>
        <p className="text-violet-light font-mono-jb mb-3 text-sm">{project.subtitle}</p>
        <p className="mb-5 text-sm leading-relaxed text-slate-400">{project.description}</p>

        <div className="mb-5 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span key={t} className="tech-tag">{t}</span>
          ))}
        </div>

        {(project.liveUrl || project.githubUrl) && (
          <div className="flex items-center gap-3 border-t pt-4" style={{ borderColor: "rgba(148,163,184,0.08)" }}>
            {project.liveUrl && (
              <motion.a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium" style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", color: "#fff" }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <ExternalLink size={13} />
                Preview
              </motion.a>
            )}
            {project.githubUrl && (
              <motion.a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-slate-300" style={{ background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.12)" }} whileHover={{ scale: 1.05, color: "#fff" }} whileTap={{ scale: 0.97 }}>
                <GithubIcon size={13} />
                GitHub
              </motion.a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function Projects() {
  const { projects, profile } = usePortfolioContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="projects" className="section-pad relative" ref={ref}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,58,237,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(6,182,212,0.04) 0%, transparent 70%)" }}
      />
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-16 text-center">
          <p className="text-violet-light font-mono-jb mb-3 text-xs tracking-[0.3em] uppercase">Selected Work</p>
          <h2 className="font-display mb-4 font-bold text-white" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            Projects that <span className="gradient-text">Matter</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        {profile.github && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }} className="mt-12 text-center">
            <motion.a href={profile.github} target="_blank" rel="noopener noreferrer" className="font-mono-jb inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white" whileHover={{ x: 4 }}>
              View all projects on GitHub
              <ArrowRight size={14} />
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
