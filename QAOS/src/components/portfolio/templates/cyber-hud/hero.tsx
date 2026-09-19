"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePortfolioContent } from "../shared/portfolio-content-context";
import { ParticleField } from "./particle-field";

const roles = ["AI Quality Engineer", "Automation Engineer", "Playwright Specialist", "AI Testing Expert", "Bug Hunter 🐛", "Problem Solver"];

function MagneticBtn({ href, children, primary, download, onClick }: { href: string; children: React.ReactNode; primary?: boolean; download?: boolean; onClick?: () => void }) {
  const ref = useRef<HTMLAnchorElement>(null);
  function onMove(e: React.MouseEvent) {
    const b = ref.current;
    if (!b) return;
    const r = b.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    b.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }
  return (
    <a
      ref={ref}
      href={href}
      download={download}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={
        onClick ??
        (!download
          ? (e) => {
              e.preventDefault();
              document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
            }
          : undefined)
      }
      target={download ? "_blank" : undefined}
      rel={download ? "noopener noreferrer" : undefined}
      className={`relative rounded-xl px-7 py-3.5 text-sm font-bold tracking-widest uppercase transition-all duration-200 ${
        primary ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg hover:shadow-cyan-500/30" : "border border-cyan-400/40 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-400/8"
      }`}
      style={{ fontFamily: "Exo 2" }}
    >
      {children}
    </a>
  );
}

export function Hero() {
  const { profile, stats } = usePortfolioContent();
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = roles[roleIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting) {
      if (displayed.length < target.length) {
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 65);
      } else {
        timeout = setTimeout(() => setDeleting(true), 2200);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- advances the typewriter loop to the next role
        setDeleting(false);
        setRoleIdx((i) => (i + 1) % roles.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIdx]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    function onMove(e: MouseEvent) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      el!.style.transform = `translate(${dx * -10}px, ${dy * -6}px)`;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const letter = { hidden: { opacity: 0, y: 80 }, show: { opacity: 1, y: 0 } };
  const name = profile.name.toUpperCase().split("");
  const heroStats = stats.slice(0, 4);

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden" style={{ background: "linear-gradient(to bottom, #000008, #050514, #08021a)" }}>
      <ParticleField />

      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px" }}
      />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
      <div
        className="pointer-events-none absolute top-0 left-0 h-96 w-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #00d4ff, transparent 70%)", filter: "blur(60px)", transform: "translate(-40%, -40%)" }}
      />
      <div
        className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)", filter: "blur(80px)", transform: "translate(40%, 40%)" }}
      />

      <div ref={contentRef} className="relative z-10 px-6 pt-20 text-center transition-transform duration-75" style={{ willChange: "transform" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-10 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-4 py-2 font-mono text-xs tracking-widest text-cyan-400 uppercase"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
          AI · Quality · Engineering · {profile.location}
        </motion.div>

        <div className="mb-4 overflow-hidden">
          <motion.div className="flex flex-wrap justify-center" variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.3 } } }} initial="hidden" animate="show">
            {name.map((ch, i) => (
              <motion.span
                key={i}
                variants={letter}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`font-black ${ch === " " ? "w-6 sm:w-10" : ""}`}
                style={{
                  fontFamily: "Exo 2, sans-serif",
                  fontSize: "clamp(3rem, 10vw, 9rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 30px rgba(0,212,255,0.25))",
                }}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }} className="mb-6 flex h-10 items-center justify-center gap-2">
          <span style={{ fontFamily: "JetBrains Mono, monospace" }} className="text-lg font-medium text-cyan-400 sm:text-2xl">
            {displayed}
          </span>
          <span className="terminal-cursor" />
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.7 }} className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          {profile.tagline}
        </motion.p>

        {heroStats.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.7 }} className="mb-12 flex flex-wrap items-center justify-center gap-0">
            {heroStats.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className="px-6 py-2 text-center">
                  <div className="text-2xl font-black text-cyan-400 sm:text-4xl" style={{ fontFamily: "Exo 2" }}>
                    {s.value}
                    {s.suffix}
                  </div>
                  <div className="mt-0.5 font-mono text-xs tracking-widest text-slate-400 uppercase">{s.label}</div>
                </div>
                {i < heroStats.length - 1 && <div className="h-8 w-px bg-white/10" />}
              </div>
            ))}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.7 }} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticBtn href="#projects" primary>
            ⚡ Explore Portfolio
          </MagneticBtn>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7, duration: 1 }} className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-mono text-xs tracking-widest text-slate-500 uppercase">Scroll</span>
        <div className="flex flex-col items-center gap-1">
          {[0, 0.2, 0.4].map((d) => (
            <motion.div key={d} className="h-3 w-px rounded-full bg-cyan-400/60" animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, delay: d, repeat: Infinity }} />
          ))}
        </div>
      </motion.div>

      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-32" style={{ background: "linear-gradient(to bottom, transparent, #050514)" }} />
    </section>
  );
}
