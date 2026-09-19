"use client";

import { useEffect, useRef, useState } from "react";
import { usePortfolioContent } from "../shared/portfolio-content-context";
import { ParticleField } from "./particle-field";

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const duration = 1800;
            const start = performance.now();
            function step(now: number) {
              const progress = Math.min((now - start) / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              setValue(Math.floor(ease * target));
              if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-display" style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", color: "var(--orange)", lineHeight: 1, letterSpacing: "2px" }}>
      {value}
      {suffix}
    </span>
  );
}

function parseStat(value: string): { num: number; suffix: string } {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { num: 0, suffix: value };
  return { num: parseFloat(match[1]), suffix: match[2] };
}

export function Hero() {
  const { profile, stats } = usePortfolioContent();

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0">
        <ParticleField />
        <div className="pointer-events-none absolute top-[-200px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,98,0,0.18) 0%, transparent 65%)", filter: "blur(60px)" }} />
        <div className="pointer-events-none absolute right-[-80px] bottom-[-100px] h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,184,0,0.12) 0%, transparent 65%)", filter: "blur(80px)" }} />
        <div className="pointer-events-none absolute top-[30%] left-[-100px] h-[380px] w-[380px] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,51,0,0.1) 0%, transparent 65%)", filter: "blur(70px)" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="mb-7 text-sm font-semibold tracking-[3px] uppercase" style={{ color: "var(--orange-light)" }}>
          {profile.role} · {profile.location}
        </div>
        <h1 className="font-display" style={{ fontSize: "clamp(4.5rem, 13vw, 11rem)", lineHeight: 0.86, letterSpacing: "5px", background: "linear-gradient(170deg, #fff 0%, rgba(255,255,255,0.65) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {profile.name.split(" ").slice(0, -1).join(" ").toUpperCase()}
          <br />
          {profile.name.split(" ").slice(-1)[0]?.toUpperCase()}
        </h1>
        <p className="font-display mt-4 mb-14" style={{ fontSize: "clamp(1.2rem, 3vw, 2.2rem)", letterSpacing: "7px", color: "var(--orange)" }}>
          {profile.tagline}
        </p>

        {stats.length > 0 && (
          <div className="mb-14 flex flex-wrap items-center justify-center gap-8">
            {stats.slice(0, 4).map((s, i) => {
              const { num, suffix } = parseStat(`${s.value}${s.suffix}`);
              return (
                <div key={s.id} className="flex items-center gap-8">
                  <div className="text-center">
                    <Counter target={num} suffix={suffix} />
                    <span className="mt-1 block text-[0.65rem] tracking-widest uppercase" style={{ color: "var(--muted)" }}>
                      {s.label}
                    </span>
                  </div>
                  {i < Math.min(stats.length, 4) - 1 && <div className="h-10 w-px" style={{ background: "var(--border)" }} />}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} className="btn btn-primary">
            View Projects
          </button>
          <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="btn btn-outline">
            Contact Me
          </button>
        </div>
      </div>
    </section>
  );
}
