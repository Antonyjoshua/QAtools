"use client";

import { useEffect, useRef } from "react";

const COLORS: [number, number, number][] = [
  [255, 98, 0],
  [255, 140, 66],
  [255, 184, 0],
  [255, 51, 0],
  [255, 200, 80],
];

interface Spark {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: [number, number, number];
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let particles: Spark[] = [];
    let raf = 0;

    function makeSpark(scattered: boolean): Spark {
      return {
        x: Math.random() * W,
        y: scattered ? Math.random() * H : H + Math.random() * 80,
        r: Math.random() * 2.2 + 0.4,
        vy: -(Math.random() * 1.1 + 0.35),
        vx: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.15,
        life: scattered ? Math.random() * 180 : 0,
        maxLife: Math.random() * 200 + 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    }

    function resize() {
      if (!canvas) return;
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function tick() {
      ctx!.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.y < -8 || p.life > p.maxLife) Object.assign(p, makeSpark(false));

        const t = p.life / p.maxLife;
        const a = p.alpha * (1 - t * t);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${a})`;
        ctx!.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    particles = Array.from({ length: 130 }, () => makeSpark(true));
    tick();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
