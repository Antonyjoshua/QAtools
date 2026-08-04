'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

import Loader       from '@/components/Loader';
import CustomCursor from '@/components/CustomCursor';
import SmoothScroll from '@/components/SmoothScroll';
import Navigation   from '@/components/Navigation';
import Hero         from '@/components/Hero';
import About        from '@/components/About';
import Experience   from '@/components/Experience';
import Projects     from '@/components/Projects';
import Skills       from '@/components/Skills';
import Certifications from '@/components/Certifications';
import AILab        from '@/components/AILab';
import Contact      from '@/components/Contact';
import CyberBug     from '@/components/CyberBug';
import Footer       from '@/components/Footer';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <CustomCursor />
      {loading && <Loader onComplete={() => setLoading(false)} />}

      <SmoothScroll>
        <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.8s ease' }}>
          <Navigation />
          <main>
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Certifications />
            <AILab />
            <Contact />
          </main>
          <Footer />
          <CyberBug />
        </div>
      </SmoothScroll>
    </>
  );
}
