"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#certifications", label: "Certifications" },
  { href: "#ai-lab", label: "AI Lab" },
  { href: "#contact", label: "Contact" },
];

export function Navigation() {
  const [active, setActive] = useState("");
  const [menuOpen, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (v) => setScrolled(v > 0.01));

  useEffect(() => {
    const sectionIds = links.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => entry.isIntersecting && setActive(id), { threshold: 0.3 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (href: string) => {
    setMenu(false);
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.div
        className="fixed top-0 right-0 left-0 z-[9999] h-[2px] origin-left"
        style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg, #7c3aed, #a855f7, #06b6d4)" }}
      />
      <motion.nav
        className="fixed top-0 right-0 left-0 z-[999] transition-all duration-500"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: scrolled ? "rgba(3,7,17,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(148,163,184,0.08)" : "none",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <motion.button
            onClick={() => scrollTo("#hero")}
            className="font-mono-jb text-sm font-semibold tracking-widest text-white/90 transition-colors hover:text-white"
            whileHover={{ scale: 1.03 }}
          >
            <span className="gradient-text text-base font-bold">AJ</span>
            <span className="mx-1 text-slate-500">·</span>
            <span className="text-xs text-slate-400">QA</span>
          </motion.button>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const isActive = active === l.href.replace("#", "");
              return (
                <li key={l.href}>
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="relative rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                    style={{ color: isActive ? "#a855f7" : "#94a3b8" }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="portfolio-ai-nav-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)" }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{l.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#contact");
              }}
              className="hidden items-center rounded-lg px-4 py-2 text-sm font-semibold text-white md:inline-flex"
              style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(124,58,237,0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              Hire Me
            </motion.a>
            <motion.button
              className="rounded-lg p-2 text-slate-400 hover:text-white md:hidden"
              style={{ background: "rgba(15,23,42,0.5)" }}
              onClick={() => setMenu(!menuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="glass-strong fixed top-16 right-0 left-0 z-[998] border-t border-white/5 md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {links.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="w-full rounded-lg px-4 py-3 text-left text-slate-300 transition-all hover:bg-white/5 hover:text-white"
                  >
                    {l.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
