interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  life: number;
}

const COLORS = ["#635bff", "#8b5cf6", "#22c55e", "#f59e0b", "#ec4899"];

/** Fires a brief confetti burst from a canvas overlaid on the given anchor element. No external dependency. */
export function fireConfetti(anchor: HTMLElement): void {
  if (typeof window === "undefined") return;
  const rect = anchor.getBoundingClientRect();
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.zIndex = "200";
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const particles: Particle[] = Array.from({ length: 70 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 6;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 4 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 20,
      life: 1,
    };
  });

  let frame: number;
  function tick() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of particles) {
      if (p.life <= 0) continue;
      p.vy += 0.15;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      p.life -= 0.012;
      if (p.life <= 0) continue;
      alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }
    if (alive) {
      frame = requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  }
  frame = requestAnimationFrame(tick);

  setTimeout(() => {
    cancelAnimationFrame(frame);
    canvas.remove();
  }, 3000);
}
