"use client";

import { useEffect, useRef, useState } from "react";
import { usePortfolioContent } from "../shared/portfolio-content-context";

const GRADIENTS = ["#7c3aed, #4f1d96", "#0891b2, #1e3a8a", "#ea580c, #7c2d12", "#059669, #064e3b", "#2563eb, #1e1b4b", "#ca8a04, #7c2d12", "#db2777, #581c87", "#0d9488, #134e4a", "#475569, #111827"];
const ICONS = ["📚", "🎡", "🤖", "🏢", "🥽", "🏦", "🏨", "🛒", "📇"];

const CARD_W = 340;
const GAP = 24;
const STEP = CARD_W + GAP;

export function Projects() {
  const { projects } = usePortfolioContent();
  const outerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(1);
  const dragState = useRef<{ startX: number; dragging: boolean }>({ startX: 0, dragging: false });

  useEffect(() => {
    function measure() {
      if (!outerRef.current) return;
      setVisible(Math.max(1, Math.floor(outerRef.current.offsetWidth / STEP)));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const max = Math.max(0, projects.length - visible);

  function goTo(n: number) {
    setIndex(Math.max(0, Math.min(n, max)));
  }

  function onDragStart(x: number) {
    dragState.current = { startX: x, dragging: true };
  }
  function onDragEnd(x: number) {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    const diff = dragState.current.startX - x;
    if (diff > 50) goTo(index + 1);
    else if (diff < -50) goTo(index - 1);
  }

  return (
    <section id="projects" className="py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-16">
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">PROJECTS</h2>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] overflow-hidden px-6" ref={outerRef}>
        <div
          className="flex gap-6 transition-transform duration-400 ease-out"
          style={{ transform: `translateX(-${index * STEP}px)` }}
          onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
          onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
          onMouseDown={(e) => onDragStart(e.clientX)}
          onMouseUp={(e) => onDragEnd(e.clientX)}
        >
          {projects.map((p, i) => (
            <div key={p.id} className="card flex shrink-0 flex-col overflow-hidden" style={{ width: CARD_W }}>
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${GRADIENTS[i % GRADIENTS.length]})` }} />
              <div className="flex flex-1 flex-col gap-3 p-7">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{ICONS[i % ICONS.length]}</span>
                  {p.status && (
                    <span
                      className="rounded-full px-2.5 py-1 text-[0.58rem] font-extrabold tracking-widest uppercase"
                      style={
                        p.status === "live"
                          ? { background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80" }
                          : { background: "rgba(255,98,0,0.1)", border: "1px solid rgba(255,98,0,0.25)", color: "var(--orange-light)" }
                      }
                    >
                      {p.status === "live" ? "Live" : "Enterprise"}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-2xl tracking-wide">{p.title}</h3>
                <div className="text-sm" style={{ color: "var(--muted)" }}>
                  {p.company}
                </div>
                <p className="flex-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1200px] items-center justify-center gap-6 px-6">
        <button className="carousel-btn" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous">
          ←
        </button>
        <div className="flex gap-2">
          {Array.from({ length: max + 1 }, (_, i) => (
            <button key={i} className={`carousel-dot ${i === index ? "active" : ""}`} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
        <button className="carousel-btn" onClick={() => goTo(index + 1)} disabled={index === max} aria-label="Next">
          →
        </button>
      </div>
    </section>
  );
}
