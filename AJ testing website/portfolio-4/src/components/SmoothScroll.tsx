'use client';

import { useEffect, useRef } from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: any = null;

    const init = async () => {
      const LenisModule = await import('lenis');
      const Lenis = (LenisModule as any).default ?? LenisModule;

      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis?.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    };

    init();
    return () => { lenis?.destroy(); };
  }, []);

  return <>{children}</>;
}
