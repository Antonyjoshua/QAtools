'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dot  = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos  = useRef({ x: 0, y: 0 });
  const ring_pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.left  = e.clientX + 'px';
        dot.current.style.top   = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', move);

    let raf: number;
    const lerp = () => {
      ring_pos.current.x += (pos.current.x - ring_pos.current.x) * 0.1;
      ring_pos.current.y += (pos.current.y - ring_pos.current.y) * 0.1;
      if (ring.current) {
        ring.current.style.left = ring_pos.current.x + 'px';
        ring.current.style.top  = ring_pos.current.y + 'px';
      }
      raf = requestAnimationFrame(lerp);
    };
    raf = requestAnimationFrame(lerp);

    const addHover = () => ring.current?.classList.add('hovering');
    const remHover = () => ring.current?.classList.remove('hovering');
    document.querySelectorAll('a,button,[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', remHover);
    });
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a,button,[data-hover]').forEach(el => {
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', remHover);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dot}  className="cursor-dot"  />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}
