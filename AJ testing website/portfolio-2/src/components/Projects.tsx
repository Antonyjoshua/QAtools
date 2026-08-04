'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { projects } from '@/lib/data';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const statusColor = {
    live:       { bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)',  text: '#4ade80' },
    enterprise: { bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.3)', text: '#fb923c' },
    wip:        { bg: 'rgba(6,182,212,0.1)',  border: 'rgba(6,182,212,0.3)',  text: '#22d3ee' },
  }[project.status] ?? { bg: '', border: '', text: '' };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden group cursor-default"
      style={{
        background: 'rgba(15,23,42,0.6)',
        border: hovered ? '1px solid rgba(124,58,237,0.35)' : '1px solid rgba(148,163,184,0.08)',
        backdropFilter: 'blur(20px)',
        transition: 'border-color 0.3s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(124,58,237,0.15)' }}
    >
      {/* Preview banner */}
      <div
        className="h-44 relative overflow-hidden flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${project.gradient})` }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'rgba(3,7,17,0.3)' }} />

        {/* Animated grid in banner */}
        <div
          className="absolute inset-0 grid-overlay opacity-20"
          style={{ backgroundSize: '24px 24px' }}
        />

        {/* Big icon */}
        <motion.div
          className="relative z-10 text-6xl"
          animate={hovered ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {project.icon}
        </motion.div>

        {/* Status badge */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-mono font-semibold"
          style={{ background: statusColor.bg, border: `1px solid ${statusColor.border}`, color: statusColor.text }}
        >
          {project.status === 'live' ? '● Live' : project.status === 'enterprise' ? '⚡ Enterprise' : '🚧 WIP'}
        </div>
      </div>

      {/* Card body */}
      <div className="p-6">
        <h3 className="font-display font-bold text-white text-xl mb-1">{project.title}</h3>
        <p className="text-violet-light text-sm mb-3 font-mono">{project.subtitle}</p>
        <p className="text-slate-400 text-sm leading-relaxed mb-5">{project.description}</p>

        {/* Features */}
        <AnimatePresence>
          {hovered && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-1.5 mb-5 overflow-hidden"
            >
              {project.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-slate-400 text-xs">
                  <span className="text-cyan mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((t) => (
            <span key={t} className="tech-tag">{t}</span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
          <motion.a
            href={project.liveUrl}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <ExternalLink size={13} />
            Preview
          </motion.a>
          <motion.a
            href={project.githubUrl}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg text-slate-300"
            style={{ background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.12)' }}
            whileHover={{ scale: 1.05, color: '#fff' }}
            whileTap={{ scale: 0.97 }}
          >
            <Github size={13} />
            GitHub
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="projects" className="section-pad relative" ref={ref}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,58,237,0.06) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 60% 40% at 80% 100%, rgba(6,182,212,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-3 text-violet-light">
            Selected Work
          </p>
          <h2
            className="font-display font-bold text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            Projects that <span className="gradient-text">Matter</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            From enterprise QA pipelines to AI-powered testing tools — each project pushes the
            boundary of what quality engineering can look like.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>

        {/* View more */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.a
            href="https://github.com/Antonyjoshua"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-mono text-sm"
            whileHover={{ x: 4 }}
          >
            View all projects on GitHub
            <ArrowRight size={14} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
