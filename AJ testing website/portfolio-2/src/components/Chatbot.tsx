'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

// ── Knowledge base ────────────────────────────────────────────────────────────
const kb = [
  {
    tags: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'greet', 'help', 'start'],
    answer: "Hey there! 👋 I'm AJ Bot. Ask me anything about Antony Joshua S — skills, experience, projects, or contact info!",
  },
  {
    tags: ['who are you', 'who is antony', 'about antony', 'tell me about', 'introduce', 'name', 'antony joshua', 'antony', 'aj'],
    answer: "I'm Antony Joshua S — a Quality Analyst based in Chennai, India. I specialise in software testing across web, mobile, and AI platforms with 3+ years of hands-on experience.",
  },
  {
    tags: ['role', 'designation', 'position', 'profession', 'work as', 'what do you do', 'job title', 'job'],
    answer: "I work as a Quality Analyst — covering automation, manual, API, and mobile testing across various domains.",
  },
  {
    tags: ['experience', 'years', 'how long', 'since when', 'how many years', 'career'],
    answer: "I have 3+ years of QA experience since 2021, working across web, mobile, VR, and AI platforms.",
  },
  {
    tags: ['education', 'degree', 'qualification', 'university', 'college', 'study', 'studied', 'mca', 'madras', 'master'],
    answer: "I hold an MCA (Master of Computer Applications) from Madras University and a BCA (85%) from Jaya College of Arts & Science.",
  },
  {
    tags: ['skills', 'tools', 'technologies', 'tech stack', 'know', 'what can you do', 'expertise', 'proficient'],
    answer: "My core skills:\n• Automation — Playwright + TypeScript, Selenium + Java\n• Frameworks — TestNG\n• Tools — JIRA, Postman\n• Testing types — Manual, API, Mobile, AI/ML Testing",
  },
  {
    tags: ['automation', 'playwright', 'selenium', 'typescript', 'testng', 'framework'],
    answer: "I build automation frameworks using Playwright (TypeScript) and Selenium (Java) with TestNG for structured reporting and parallel execution.",
  },
  {
    tags: ['java', 'programming', 'language', 'coding', 'code'],
    answer: "I use Java primarily for Selenium automation, writing clean, maintainable test scripts and utility classes.",
  },
  {
    tags: ['api', 'postman', 'rest', 'endpoint', 'request', 'api testing'],
    answer: "I test REST APIs using Postman — validating endpoints, authentication flows, response schemas, error handling, and status codes.",
  },
  {
    tags: ['mobile', 'android', 'ios', 'app', 'mobile testing', 'appium'],
    answer: "I have hands-on mobile testing experience across Android and iOS — functional, regression, and performance testing on real devices and emulators.",
  },
  {
    tags: ['ai', 'ml', 'artificial intelligence', 'machine learning', 'rag', 'chatbot testing', 'ai testing'],
    answer: "I've tested AI/ML systems including RAG pipelines, AI chatbots, and ML model validation — an emerging specialty of mine.",
  },
  {
    tags: ['jira', 'bug tracking', 'defect management', 'sprint', 'agile', 'scrum'],
    answer: "I'm a JIRA power user — managing bug lifecycle, sprint planning, test case tracking, and defect reporting across agile projects.",
  },
  {
    tags: ['manual testing', 'manual', 'functional', 'regression', 'test case', 'test plan'],
    answer: "Manual testing is my strongest area — covering functional, regression, exploratory, UAT, smoke, and sanity testing with detailed test documentation.",
  },
  {
    tags: ['bugs', 'defects', 'found', 'reported', 'detected', '2500'],
    answer: "I've found and reported 2500+ defects across web, mobile, VR, and AI platforms — critical, major, minor, and cosmetic. Nothing slips past my radar! 🐛",
  },
  {
    tags: ['projects', 'portfolio', 'work done', 'built', 'created', 'what have you', 'showcased'],
    answer: "I have 9+ projects in my portfolio — including automation frameworks, AI chatbot QA, mobile test suites, API test collections, and performance testing.",
  },
  {
    tags: ['contact', 'email', 'reach', 'connect', 'message', 'hire', 'available'],
    answer: "You can reach me at antonyjoshua413@gmail.com or +91 95140 84222. Use the Contact section on this portfolio — I'm open to exciting QA opportunities!",
  },
  {
    tags: ['location', 'where', 'city', 'live', 'based', 'chennai', 'india'],
    answer: "I'm based in Chennai, India. 📍",
  },
  {
    tags: ['resume', 'cv', 'download', 'curriculum vitae'],
    answer: "You can download my resume directly from the hero section — click the 'Download CV' button at the top of the page!",
  },
  {
    tags: ['certification', 'certified', 'certificate', 'course', 'training'],
    answer: "I hold certifications in Selenium WebDriver (Udemy), ML Testing (Udemy), QA Master Class (Testleaf), and Automation Testing Skills (GUVI × HCL). Check the Certifications section for details!",
  },
  {
    tags: ['vr', 'virtual reality', 'xr', 'extended reality'],
    answer: "I've tested VR/XR applications — validating immersive experiences, performance, and platform-specific behaviour across VR devices.",
  },
  {
    tags: ['performance', 'load', 'stress', 'jmeter'],
    answer: "I have experience in performance and load testing, identifying bottlenecks and ensuring applications handle expected user volumes.",
  },
  {
    tags: ['thank', 'thanks', 'great', 'awesome', 'cool', 'nice', 'helpful', 'good'],
    answer: "You're welcome! 😊 Feel free to ask anything else about Antony Joshua S.",
  },
  {
    tags: ['bye', 'goodbye', 'see you', 'later', 'cya', 'take care'],
    answer: "Goodbye! 👋 Feel free to come back anytime if you have more questions.",
  },
];

function getReply(message: string): string {
  const msg = message.toLowerCase().trim();
  let bestScore = 0;
  let bestAnswer: string | null = null;

  kb.forEach((item) => {
    let score = 0;
    item.tags.forEach((tag) => { if (msg.includes(tag)) score += tag.length; });
    if (score > bestScore) { bestScore = score; bestAnswer = item.answer; }
  });

  return bestScore === 0
    ? "Sorry, I don't have information about that. 🤔\nTry asking about Antony Joshua's skills, experience, projects, education, or contact details!"
    : bestAnswer!;
}

// ── Types ─────────────────────────────────────────────────────────────────────
type Msg = { from: 'user' | 'bot'; text: string };

const SUGGESTIONS = ['Skills', 'Experience', 'Projects', 'Contact'];

// ── Typing dots ───────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: '#7c3aed' }}
          animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [open, setOpen]         = useState(false);
  const [greeted, setGreeted]   = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const msgsRef   = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages, typing]);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      if (!greeted) {
        setGreeted(true);
        setTimeout(() => {
          setMessages([{ from: 'bot', text: "Hey there! 👋 I'm AJ Bot. Ask me anything about Antony Joshua S — skills, experience, projects, and more!" }]);
        }, 300);
      }
      setTimeout(() => inputRef.current?.focus(), 280);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = (text = input) => {
    const txt = text.trim();
    if (!txt || typing) return;
    setInput('');
    setMessages((prev) => [...prev, { from: 'user', text: txt }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { from: 'bot', text: getReply(txt) }]);
    }, 600 + Math.random() * 500);
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') send(); };

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0,  y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-[9998] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: 'min(360px, calc(100vw - 2rem))',
              height: 'min(520px, calc(100vh - 120px))',
              background: 'rgba(10, 15, 30, 0.95)',
              border: '1px solid rgba(124,58,237,0.35)',
              backdropFilter: 'blur(32px)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(6,182,212,0.15) 100%)',
                borderBottom: '1px solid rgba(124,58,237,0.2)',
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}
              >
                🤖
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">AJ Bot</div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: '#4ade80' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  Ask me about Antony
                </div>
              </div>
            </div>

            {/* Suggestion chips */}
            <div
              className="flex gap-2 px-3 py-2.5 flex-shrink-0 flex-wrap"
              style={{ borderBottom: '1px solid rgba(148,163,184,0.06)' }}
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: 'rgba(124,58,237,0.1)',
                    border: '1px solid rgba(124,58,237,0.25)',
                    color: '#a855f7',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)';
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div
              ref={msgsRef}
              className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#7c3aed transparent' }}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className="max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                      style={
                        msg.from === 'user'
                          ? {
                              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                              color: '#fff',
                              borderBottomRightRadius: '4px',
                            }
                          : {
                              background: 'rgba(30, 41, 59, 0.8)',
                              color: '#e2e8f0',
                              border: '1px solid rgba(148,163,184,0.1)',
                              borderBottomLeftRadius: '4px',
                            }
                      }
                    >
                      {msg.text.split('\n').map((line, j) => (
                        <span key={j}>
                          {line}
                          {j < msg.text.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        background: 'rgba(30, 41, 59, 0.8)',
                        border: '1px solid rgba(148,163,184,0.1)',
                        borderBottomLeftRadius: '4px',
                      }}
                    >
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input row */}
            <div
              className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(148,163,184,0.06)' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about skills, projects…"
                maxLength={200}
                className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all"
                style={{
                  background: 'rgba(30,41,59,0.7)',
                  border: '1px solid rgba(148,163,184,0.12)',
                  color: '#f1f5f9',
                  caretColor: '#7c3aed',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)'; }}
              />
              <motion.button
                onClick={() => send()}
                disabled={!input.trim() || typing}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-opacity"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  opacity: input.trim() && !typing ? 1 : 0.4,
                }}
                whileHover={input.trim() ? { scale: 1.08 } : {}}
                whileTap={input.trim() ? { scale: 0.94 } : {}}
              >
                <Send size={15} color="#fff" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[9999] w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
        style={{
          background: open
            ? 'rgba(30,41,59,0.9)'
            : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          border: open ? '1px solid rgba(124,58,237,0.4)' : 'none',
          boxShadow: open ? 'none' : '0 0 30px rgba(124,58,237,0.5)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X size={22} color="#e2e8f0" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MessageCircle size={22} color="#fff" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
