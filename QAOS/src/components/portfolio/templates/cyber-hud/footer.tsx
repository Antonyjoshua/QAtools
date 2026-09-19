"use client";

import { motion } from "framer-motion";
import { usePortfolioContent } from "../shared/portfolio-content-context";
import { useAttachmentUrl } from "@/lib/portfolio/hooks/use-attachment-url";

export function Footer() {
  const { profile } = usePortfolioContent();
  const resumeUrl = useAttachmentUrl(profile.resumeAttachmentId);
  const year = new Date().getFullYear();
  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const links = [
    profile.github && { href: profile.github, label: "GitHub" },
    profile.linkedin && { href: profile.linkedin, label: "LinkedIn" },
    profile.email && { href: `mailto:${profile.email}`, label: "Email" },
    resumeUrl && { href: resumeUrl, label: "Resume", download: true },
  ].filter((l): l is { href: string; label: string; download?: boolean } => Boolean(l));

  return (
    <footer className="relative overflow-hidden py-12" style={{ background: "#020210", borderTop: "1px solid rgba(0,212,255,0.08)" }}>
      <div className="absolute top-0 right-0 left-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.3), rgba(124,58,237,0.3), transparent)" }} />

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3">
            <div
              className="relative flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))", border: "1px solid rgba(0,212,255,0.3)" }}
            >
              <span className="text-sm font-black text-cyan-400">{initials || "AJ"}</span>
            </div>
            <div>
              <div className="text-sm font-black text-white" style={{ fontFamily: "Exo 2" }}>
                {profile.name.toUpperCase()}
              </div>
              <div className="font-mono text-xs text-slate-500">
                {profile.role}
                {profile.location ? ` · ${profile.location}` : ""}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-6 font-mono text-xs">
            {links.map((l) => (
              <a key={l.label} href={l.href} target={l.download ? undefined : "_blank"} rel="noreferrer" download={l.download} className="tracking-widest text-slate-500 uppercase transition-colors hover:text-cyan-400">
                {l.label}
              </a>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center font-mono text-xs text-slate-600 md:text-right">
            <div>
              © {year} {profile.name}. All rights reserved.
            </div>
            <div className="mt-0.5 flex items-center justify-center gap-1.5 md:justify-end">
              <span className="h-1 w-1 animate-pulse rounded-full bg-green-400" />
              <span className="text-green-400/60">Built with Next.js · Framer Motion</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
