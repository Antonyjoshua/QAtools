"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, Send, MapPin, ArrowRight } from "lucide-react";
import { usePortfolioContent } from "../shared/portfolio-content-context";
import { GithubIcon, LinkedinIcon, type SocialIconComponent } from "../shared/social-icons";

export function Contact() {
  const { profile, contactDetails } = usePortfolioContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const socials = [
    profile.email && { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}`, color: "#7c3aed" },
    profile.phone && { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}`, color: "#4ade80" },
    profile.github && { icon: GithubIcon, label: "GitHub", value: profile.github.replace(/^https?:\/\//, ""), href: profile.github, color: "#e2e8f0" },
    profile.linkedin && { icon: LinkedinIcon, label: "LinkedIn", value: profile.linkedin.replace(/^https?:\/\//, ""), href: profile.linkedin, color: "#0ea5e9" },
  ].filter((s): s is { icon: SocialIconComponent; label: string; value: string; href: string; color: string } => Boolean(s));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  }

  return (
    <section id="contact" className="section-pad relative" ref={ref}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 50% at 80% 50%, rgba(6,182,212,0.06) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 20% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)" }}
      />
      <div className="grid-overlay pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-16 text-center">
          <p className="font-mono-jb mb-3 text-xs tracking-[0.3em] text-cyan-400 uppercase">Get in Touch</p>
          <h2 className="font-display mb-4 font-bold text-white" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            Let&apos;s <span className="gradient-text-cyan">Build Together</span>
          </h2>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-5">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col gap-6 lg:col-span-2">
            {profile.location && (
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin size={18} className="text-violet-light" />
                <span>{profile.location}</span>
              </div>
            )}
            {contactDetails.length > 0
              ? contactDetails.map((c, i) => (
                  <motion.a
                    key={c.id}
                    href={c.link || undefined}
                    target={c.link ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-4 rounded-xl p-4"
                    style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", backdropFilter: "blur(20px)" }}
                    whileHover={{ x: 6 }}
                  >
                    <div className="text-white">
                      <div className="text-sm font-medium">{c.label}</div>
                      <div className="font-mono-jb text-xs text-slate-500">{c.value}</div>
                    </div>
                    <ArrowRight size={16} className="ml-auto text-slate-600" />
                  </motion.a>
                ))
              : socials.map((s, i) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-4 rounded-xl p-4"
                    style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", backdropFilter: "blur(20px)" }}
                    whileHover={{ x: 6, borderColor: `${s.color}44`, boxShadow: `0 0 20px ${s.color}22` }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                      <s.icon size={18} style={{ color: s.color }} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{s.label}</div>
                      <div className="font-mono-jb text-xs text-slate-500">{s.value}</div>
                    </div>
                    <ArrowRight size={16} className="ml-auto text-slate-600" />
                  </motion.a>
                ))}

            <div className="rounded-xl p-4" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">Open to Opportunities</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">Available for full-time, contract, and freelance QA/automation roles.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="lg:col-span-3">
            <div className="rounded-2xl p-8" style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(124,58,237,0.15)", backdropFilter: "blur(24px)" }}>
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="text-6xl">✅</div>
                  <h3 className="font-display text-2xl font-bold text-white">Message Sent!</h3>
                  <p className="text-slate-400">I&apos;ll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="form-group">
                      <input type="text" id="pf-ai-name" placeholder=" " required />
                      <label htmlFor="pf-ai-name">Your Name</label>
                    </div>
                    <div className="form-group">
                      <input type="email" id="pf-ai-email" placeholder=" " required />
                      <label htmlFor="pf-ai-email">Email Address</label>
                    </div>
                  </div>
                  <div className="form-group">
                    <input type="text" id="pf-ai-subject" placeholder=" " required />
                    <label htmlFor="pf-ai-subject">Subject</label>
                  </div>
                  <div className="form-group">
                    <textarea id="pf-ai-message" rows={5} placeholder=" " required style={{ resize: "none" }} />
                    <label htmlFor="pf-ai-message">Your Message</label>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-4 font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <motion.div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                    ) : (
                      <>
                        <Send size={17} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
