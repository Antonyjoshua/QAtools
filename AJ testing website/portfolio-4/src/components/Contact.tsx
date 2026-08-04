'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { profile } from '@/lib/data';

const lines = [
  '> Initializing secure channel...',
  '> Encryption: AES-256 · Active',
  '> Signal strength: ████████ 100%',
  '> Terminal ready. Send your message.',
];

const contacts = [
  { icon: '✉', label: 'Email', value: profile.email, href: `mailto:${profile.email}`, color: '#00d4ff' },
  { icon: '📞', label: 'Phone', value: profile.phone, href: `tel:${profile.phone}`, color: '#a855f7' },
  { icon: '⌥', label: 'GitHub', value: 'Antonyjoshua', href: profile.github, color: '#00ff88' },
  { icon: '⬡', label: 'LinkedIn', value: 'antony-joshua', href: profile.linkedin, color: '#0077b5' },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(`From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:${profile.email}?subject=Portfolio Contact from ${form.name}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" ref={ref}
             className="relative py-32 overflow-hidden"
             style={{ background: 'linear-gradient(to bottom, #050514, #020210, #050514)' }}>

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
           style={{ backgroundImage: 'linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }} className="mb-20">
          <p className="section-tag">// 007 — Connect</p>
          <h2 className="section-title text-white">
            Open<br /><span className="gradient-text">Channel</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left — Terminal boot */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.2 }}>

            {/* Terminal panel */}
            <div className="relative p-6 rounded-2xl glass-strong overflow-hidden mb-8"
                 style={{ border: '1px solid rgba(0,212,255,0.15)' }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                   style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)' }} />
              {/* Titlebar */}
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
                <div className="flex gap-1.5">
                  {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
                    <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <span className="text-xs font-mono text-slate-500 ml-2">channel://secure-link</span>
              </div>

              {/* Boot lines */}
              <div className="font-mono text-sm space-y-2">
                {lines.map((line, i) => (
                  <motion.div key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={inView ? { opacity: 1, x: 0 } : {}}
                              transition={{ delay: 0.5 + i * 0.4, duration: 0.4 }}
                              className="text-slate-400">
                    <span className="text-cyan-400">{line.split(' ')[0]} </span>
                    {line.slice(line.indexOf(' ') + 1)}
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                            transition={{ delay: 2.5 }}
                            className="flex items-center gap-2 text-cyan-400 pt-1">
                  <span>$</span>
                  <span className="terminal-cursor" />
                </motion.div>
              </div>
            </div>

            {/* Contact cards */}
            <div className="grid sm:grid-cols-2 gap-3">
              {contacts.map((c, i) => (
                <motion.a key={i} href={c.href} target="_blank" rel="noreferrer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={inView ? { opacity: 1, y: 0 } : {}}
                          transition={{ delay: 0.6 + i * 0.1 }}
                          className="flex items-center gap-3 p-3.5 rounded-xl glass border border-white/5
                                     hover:border-opacity-40 hover:-translate-y-0.5 transition-all duration-200 group"
                          style={{ '--hover-color': c.color } as React.CSSProperties}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = `${c.color}40`)}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = '')}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                       style={{ background: `${c.color}12`, border: `1px solid ${c.color}30` }}>
                    {c.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 font-mono">{c.label}</div>
                    <div className="text-sm text-white font-medium truncate group-hover:text-cyan-400 transition-colors"
                         style={{ fontFamily: 'Exo 2' }}>{c.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.3 }}>
            <div className="relative p-8 rounded-3xl glass-strong overflow-hidden"
                 style={{ border: '1px solid rgba(0,212,255,0.12)' }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                   style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, transparent)' }} />
              <div className="absolute top-0 right-0 bottom-0 w-px"
                   style={{ background: 'linear-gradient(to bottom, #7c3aed, transparent)' }} />

              {sent ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <div className="font-black text-white text-2xl mb-2" style={{ fontFamily: 'Exo 2' }}>Message Sent!</div>
                  <div className="text-slate-400 text-sm">Your email client opened. Talk soon.</div>
                  <button onClick={() => setSent(false)}
                          className="mt-6 text-xs font-mono text-cyan-400 hover:underline">
                    Send another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="text-sm font-mono text-slate-400 mb-6">
                    <span className="text-cyan-400">$</span> transmit --message
                  </div>

                  {[
                    { field: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe' },
                    { field: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                  ].map(({ field, label, type, placeholder }) => (
                    <div key={field}>
                      <label className="block text-xs font-mono text-slate-500 mb-1.5 tracking-widest uppercase">
                        {label}
                      </label>
                      <input
                        type={type}
                        required
                        placeholder={placeholder}
                        value={form[field as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white text-sm
                                   placeholder-slate-600 font-mono
                                   focus:outline-none focus:border-cyan-400/50 focus:bg-cyan-400/4 transition-all"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1.5 tracking-widest uppercase">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell me about your project or opportunity..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white text-sm
                                 placeholder-slate-600 font-mono resize-none
                                 focus:outline-none focus:border-cyan-400/50 focus:bg-cyan-400/4 transition-all"
                    />
                  </div>

                  <button type="submit"
                          className="w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase
                                     bg-gradient-to-r from-cyan-500 to-purple-600 text-white
                                     hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5
                                     transition-all duration-200 active:translate-y-0"
                          style={{ fontFamily: 'Exo 2' }}>
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
