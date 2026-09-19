"use client";

import { useState } from "react";
import { usePortfolioContent } from "../shared/portfolio-content-context";

export function Contact() {
  const { profile, contactDetails } = usePortfolioContent();
  const [sent, setSent] = useState(false);

  const cards = [
    profile.email && { icon: "✉️", label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { icon: "📞", label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    profile.linkedin && { icon: "💼", label: "LinkedIn", value: profile.linkedin.replace(/^https?:\/\//, ""), href: profile.linkedin },
    profile.github && { icon: "🐙", label: "GitHub", value: profile.github.replace(/^https?:\/\//, ""), href: profile.github },
  ].filter((c): c is { icon: string; label: string; value: string; href: string } => Boolean(c));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  }

  return (
    <section id="contact" className="section-dark py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-16">
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title">CONTACT</h2>
        </div>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-4">
            {(contactDetails.length > 0 ? contactDetails.map((c) => ({ icon: "🔗", label: c.label, value: c.value, href: c.link || "#" })) : cards).map((c) => (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-5 px-6 py-5">
                <div className="text-xl">{c.icon}</div>
                <div>
                  <div className="text-xs tracking-wide uppercase" style={{ color: "var(--muted)" }}>
                    {c.label}
                  </div>
                  <div className="mt-0.5 font-medium">{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="text" className="form-input" placeholder="Your Name" required />
            <input type="email" className="form-input" placeholder="Your Email" required />
            <input type="text" className="form-input" placeholder="Subject" />
            <textarea className="form-input" rows={5} placeholder="Your Message" required style={{ resize: "none" }} />
            <button
              type="submit"
              disabled={sent}
              className="btn btn-primary self-start"
              style={sent ? { background: "#22c55e", boxShadow: "0 0 24px rgba(34,197,94,0.4)" } : undefined}
            >
              {sent ? "Sent ✓" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
