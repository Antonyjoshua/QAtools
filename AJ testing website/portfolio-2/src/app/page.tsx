'use client';

import dynamic from 'next/dynamic';
import Navigation      from '@/components/Navigation';
import Hero            from '@/components/Hero';
import About           from '@/components/About';
import Experience      from '@/components/Experience';
import Projects        from '@/components/Projects';
import Skills          from '@/components/Skills';
import Certifications  from '@/components/Certifications';
import AILab           from '@/components/AILab';
import Achievements    from '@/components/Achievements';
import Contact         from '@/components/Contact';
import Footer          from '@/components/Footer';
import Chatbot         from '@/components/Chatbot';

const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false });

export default function Home() {
  return (
    <>
      {/* Persistent 3D background — fixed, behind all content */}
      <Scene3D />

      {/* Scrollable page content */}
      <main className="relative" style={{ zIndex: 1 }}>
        <Navigation />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <AILab />
        <Achievements />
        <Contact />
        <Footer />
      </main>

      {/* Floating chatbot */}
      <Chatbot />

    </>
  );
}
