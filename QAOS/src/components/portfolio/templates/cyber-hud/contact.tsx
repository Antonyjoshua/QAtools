"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolioContent } from "../shared/portfolio-content-context";

const lines = ["> Initializing secure channel...", "> Encryption: AES-256 · Active", "> Signal strength: ████████ 100%", "> Terminal ready. Send your message."];

export function Contact() {
  const { profile, contactDetails } = usePortfolioContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const contacts = [
    profile.email && { icon: "✉", label: "Email", value: profile.email, href: `mailto:${profile.email}`, color: "#00d4ff" },
    profile.phone && { icon: "📞", label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}`, color: "#a855f7" },
    profile.github && { icon: "⌥", label: "GitHub", value: profile.github.replace(/^https?:\/\//, ""), href: profile.github, color: "#00ff88" },
    profile.linkedin && { icon: "⬡", label: "LinkedIn", value: profile.linkedin.replace(/^https?:\/\//, ""), href: profile.linkedin, color: "#0077b5" },
  ].filter((c): c is { icon: string; label: string; value: string; href: string; color: string } => Boolean(c));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (profile.email) {
      const body = encodeURIComponent(`From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
      window.location.href = `mailto:${profile.email}?subject=Portfolio Contact from ${form.name}&body=${body}`;
    }
    setSent(true);
  }

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden py-32" style={{ background: "linear-gradient(to bottom, #050514, #020210, #050514)" }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px" }}
      />

      <div className="mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-20">
          <p className="section-tag">{"// 007 — Connect"}</p>
          <h2 className="section-title text-white">
            Open
            <br />
            <span className="gradient-text">Channel</span>
          </h2>
        </motion.div>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="glass-strong relative mb-8 overflow-hidden rounded-2xl p-6" style={{ border: "1px solid rgba(0,212,255,0.15)" }}>
              <div className="absolute top-0 right-0 left-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #00d4ff, transparent)" }} />
              <div className="mb-5 flex items-center gap-2 border-b border-white/5 pb-4">
                <div className="flex gap-1.5">
                  {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
                    <div key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <span className="ml-2 font-mono text-xs text-slate-500">channel://secure-link</span>
              </div>

              <div className="space-y-2 font-mono text-sm">
                {lines.map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.5 + i * 0.2, duration: 0.4 }} className="text-slate-400">
                    <span className="text-cyan-400">{line.split(" ")[0]} </span>
                    {line.slice(line.indexOf(" ") + 1)}
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.3 }} className="flex items-center gap-2 pt-1 text-cyan-400">
                  <span>$</span>
                  <span className="terminal-cursor" />
                </motion.div>
              </div>
            </div>

            {profile.location && <div className="mb-6 font-mono text-xs text-slate-500">📍 {profile.location}</div>}

            <div className="grid gap-3 sm:grid-cols-2">
              {(contactDetails.length > 0 ? contactDetails : []).map((c, i) => (
                <motion.a
                  key={c.id}
                  href={c.link || undefined}
                  target={c.link ? "_blank" : undefined}
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="group flex items-center gap-3 rounded-xl border border-white/5 p-3.5 transition-all duration-200 glass hover:-translate-y-0.5"
                >
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-slate-500">{c.label}</div>
                    <div className="truncate text-sm font-medium text-white transition-colors group-hover:text-cyan-400" style={{ fontFamily: "Exo 2" }}>
                      {c.value}
                    </div>
                  </div>
                </motion.a>
              ))}
              {contactDetails.length === 0 &&
                contacts.map((c, i) => (
                  <motion.a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="group flex items-center gap-3 rounded-xl border border-white/5 p-3.5 transition-all duration-200 glass hover:-translate-y-0.5"
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${c.color}40`)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg" style={{ background: `${c.color}12`, border: `1px solid ${c.color}30` }}>
                      {c.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-xs text-slate-500">{c.label}</div>
                      <div className="truncate text-sm font-medium text-white transition-colors group-hover:text-cyan-400" style={{ fontFamily: "Exo 2" }}>
                        {c.value}
                      </div>
                    </div>
                  </motion.a>
                ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }}>
            <div className="relative overflow-hidden rounded-3xl p-8 glass-strong" style={{ border: "1px solid rgba(0,212,255,0.12)" }}>
              <div className="absolute top-0 right-0 left-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #7c3aed, transparent)" }} />

              {sent ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 text-center">
                  <div className="mb-4 text-6xl">✅</div>
                  <div className="mb-2 text-2xl font-black text-white" style={{ fontFamily: "Exo 2" }}>
                    Message Sent!
                  </div>
                  <div className="text-sm text-slate-400">Your email client opened. Talk soon.</div>
                  <button onClick={() => setSent(false)} className="mt-6 font-mono text-xs text-cyan-400 hover:underline">
                    Send another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="mb-6 font-mono text-sm text-slate-400">
                    <span className="text-cyan-400">$</span> transmit --message
                  </div>

                  {[
                    { field: "name" as const, label: "Your Name", type: "text", placeholder: "John Doe" },
                    { field: "email" as const, label: "Email Address", type: "email", placeholder: "john@example.com" },
                  ].map(({ field, label, type, placeholder }) => (
                    <div key={field}>
                      <label className="mb-1.5 block font-mono text-xs tracking-widest text-slate-500 uppercase">{label}</label>
                      <input
                        type={type}
                        required
                        placeholder={placeholder}
                        value={form[field]}
                        onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                        className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 font-mono text-sm text-white placeholder-slate-600 transition-all focus:border-cyan-400/50 focus:bg-cyan-400/4 focus:outline-none"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="mb-1.5 block font-mono text-xs tracking-widest text-slate-500 uppercase">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell me about your project or opportunity..."
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="w-full resize-none rounded-xl border border-white/8 bg-white/4 px-4 py-3 font-mono text-sm text-white placeholder-slate-600 transition-all focus:border-cyan-400/50 focus:bg-cyan-400/4 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3.5 text-sm font-bold tracking-widest text-white uppercase transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/25 active:translate-y-0"
                    style={{ fontFamily: "Exo 2" }}
                  >
                    ⚡ Transmit Message
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
