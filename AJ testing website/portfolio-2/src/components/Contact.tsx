'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Github, Linkedin, Phone, Send, MapPin, ArrowRight } from 'lucide-react';
import { profile } from '@/lib/data';

const socials = [
  { icon: Mail,     label: 'Email',    value: profile.email,                href: `mailto:${profile.email}`,   color: '#7c3aed' },
  { icon: Phone,    label: 'Phone',    value: profile.phone,                href: `tel:${profile.phone.replace(/\s/g, '')}`, color: '#4ade80' },
  { icon: Github,   label: 'GitHub',   value: 'Antonyjoshua',               href: profile.github,              color: '#e2e8f0' },
  { icon: Linkedin, label: 'LinkedIn', value: 'antony-joshua-471704aj',     href: profile.linkedin,            color: '#0ea5e9' },
];

export default function Contact() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [sent, setSent]     = useState(false);
  const [loading, setLoad]  = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoad(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoad(false);
    setSent(true);
  };

  return (
    <section id="contact" className="section-pad relative" ref={ref}>
      {/* Bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 80% 50%, rgba(6,182,212,0.06) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 50% 40% at 20% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)',
        }}
      />
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-3 text-cyan">
            Get in Touch
          </p>
          <h2
            className="font-display font-bold text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            Let's <span className="gradient-text-cyan">Build Together</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Looking for a Quality Analyst who thinks like an engineer, tests like a detective,
            and builds like an architect? Let's talk.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Location */}
            <div className="flex items-center gap-3 text-slate-400">
              <MapPin size={18} className="text-violet-light" />
              <span>Chennai, Tamil Nadu, India</span>
            </div>

            {/* Social links */}
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl group"
                style={{
                  background: 'rgba(15,23,42,0.5)',
                  border: '1px solid rgba(148,163,184,0.08)',
                  backdropFilter: 'blur(20px)',
                }}
                whileHover={{
                  x: 6,
                  borderColor: `${s.color}44`,
                  boxShadow: `0 0 20px ${s.color}22`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}
                >
                  <s.icon size={18} style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{s.label}</div>
                  <div className="text-slate-500 text-xs font-mono">{s.value}</div>
                </div>
                <ArrowRight size={16} className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" />
              </motion.a>
            ))}

            {/* Availability note */}
            <div
              className="p-4 rounded-xl"
              style={{
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-semibold text-sm">Open to Opportunities</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Available for full-time, contract, and freelance QA/automation roles.
                Response time: within 24 hours.
              </p>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div
              className="rounded-2xl p-8"
              style={{
                background: 'rgba(15,23,42,0.6)',
                border: '1px solid rgba(124,58,237,0.15)',
                backdropFilter: 'blur(24px)',
              }}
            >
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center gap-4"
                >
                  <div className="text-6xl">✅</div>
                  <h3 className="font-display font-bold text-white text-2xl">Message Sent!</h3>
                  <p className="text-slate-400">I'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="form-group">
                      <input type="text" id="name" placeholder=" " required />
                      <label htmlFor="name">Your Name</label>
                    </div>
                    <div className="form-group">
                      <input type="email" id="email" placeholder=" " required />
                      <label htmlFor="email">Email Address</label>
                    </div>
                  </div>

                  <div className="form-group">
                    <input type="text" id="subject" placeholder=" " required />
                    <label htmlFor="subject">Subject</label>
                  </div>

                  <div className="form-group">
                    <textarea
                      id="message"
                      rows={5}
                      placeholder=" "
                      required
                      style={{ resize: 'none' }}
                    />
                    <label htmlFor="message">Your Message</label>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
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
