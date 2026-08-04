/* ============================================================
   DATA
   ============================================================ */

const experience = [
  {
    company:   'Scope Thinkers',
    role:      'Quality Analyst',
    period:    'Dec 2025 – Present',
    current:   true,
    highlights: [
      'Performing manual and automation testing across EdTech and Entertainment domains.',
      'Building and maintaining end-to-end automation test suites using Playwright with TypeScript.',
      'Tested web, Android, and iOS platforms for Jeshwar Teaching — a live streaming & e-learning platform.',
      'Validated point purchase/redemption, franchise management, and loyalty workflows for Funtown Kids Park.',
    ],
    tech: ['Playwright', 'TypeScript', 'Manual Testing', 'Web', 'Android', 'iOS', 'Agile'],
  },
  {
    company:   'NITInnov Technologies Pvt Ltd',
    role:      'Software Tester',
    period:    'Jun 2024 – Sep 2025',
    current:   false,
    highlights: [
      'Performed manual testing on VR-based healthcare platform (ConfidentoAI) across VR, web, and mobile.',
      'Validated Muse EEG device integration, ensuring accurate data capture within the app.',
      'Tested RAG and machine learning models, assisting in the design and validation of prompt templates.',
      'Designed and executed detailed manual test cases, logging and tracking defects in Agile sprints.',
    ],
    tech: ['VR Testing', 'Mobile Testing', 'EEG Validation', 'ML Model Testing', 'Agile'],
  },
  {
    company:   'Arkashya Tech Solution Pvt Ltd',
    role:      'Software Tester',
    period:    'Jul 2023 – May 2024',
    current:   false,
    highlights: [
      'Designed and executed automation test scripts for web applications using Selenium + TestNG.',
      'Conducted manual test cases for functional and regression testing.',
      'Prepared detailed bug reports and assisted developers with root cause analysis.',
      'Collaborated with product owners and stakeholders to refine requirements in Agile sprints.',
    ],
    tech: ['Selenium', 'TestNG', 'Regression Testing', 'Bug Reporting'],
  },
  {
    company:   'Arkashya Tech Solution Pvt Ltd',
    role:      'Software Tester — Intern',
    period:    'Mar 2023 – Jun 2023',
    current:   false,
    highlights: [
      'Assisted in manual testing of web and mobile applications.',
      'Created and executed basic test cases; logged and tracked defects.',
      'Gained exposure to SDLC, STLC, and defect life cycle processes.',
      'Developed introductory Selenium automation scripts.',
    ],
    tech: ['Manual Testing', 'SDLC', 'STLC', 'Selenium'],
  },
  {
    company:   'Sutherland Global Services',
    role:      'Technical Support — SME',
    period:    'Oct 2020 – Oct 2022',
    current:   false,
    highlights: [
      'Delivered technical support to Amazon customers via phone, email, and chat.',
      'Part of the core launch team, supporting a wide range of Amazon.com products.',
      'Promoted to Team Lead for 10 months, managing operations and mentoring team members.',
      'Recognised with 2× RnR Awards for consistent performance and service excellence.',
    ],
    tech: ['Team Lead', 'Technical Support', 'Amazon', '2× RnR Award'],
  },
];

const projects = [
  {
    title:       'Jeshwar Teaching',
    subtitle:    'EdTech · Education Technology',
    company:     'Scope Thinkers',
    description: 'Tested a full-stack EdTech platform covering live classes, video streaming, digital content management, online book store, and e-learning modules. Validated Web, Android, and iOS applications across all sub-domains.',
    tags:        ['Playwright', 'TypeScript', 'Live Streaming', 'iOS', 'Android', 'E-Commerce'],
    gradient:    '#7c3aed, #4f1d96',
    icon:        '📚',
    status:      'enterprise',
  },
  {
    title:       'Funtown Kids Park',
    subtitle:    'Entertainment · Recreation',
    company:     'Scope Thinkers',
    description: 'Validated an amusement park management platform including point purchase & redemption, play activity management, franchise management, customer management, and loyalty & rewards workflows.',
    tags:        ['Playwright', 'TypeScript', 'Android', 'Loyalty Systems', 'Franchise'],
    gradient:    '#0891b2, #1e3a8a',
    icon:        '🎡',
    status:      'enterprise',
  },
  {
    title:       'Scope AI Chat',
    subtitle:    'Generative AI · RAG',
    company:     'Scope Thinkers',
    description: 'Tested a domain-specific AI chatbot built on RAG architecture. Validated context-aware responses, multi-source data ingestion, document processing pipelines, and embeddable widget integration.',
    tags:        ['RAG', 'Generative AI', 'Playwright', 'TypeScript', 'SaaS'],
    gradient:    '#ea580c, #7c2d12',
    icon:        '🤖',
    status:      'live',
  },
  {
    title:       'Scope Employee Portal',
    subtitle:    'HRMS · Human Resource Management',
    company:     'Scope Thinkers',
    description: 'Validated an HRMS platform covering employee information management, attendance tracking, leave management, and HR operational workflows across web and mobile applications.',
    tags:        ['Playwright', 'TypeScript', 'Mobile', 'Web', 'HR Automation'],
    gradient:    '#059669, #064e3b',
    icon:        '🏢',
    status:      'enterprise',
  },
  {
    title:       'ConfidentoAI',
    subtitle:    'Healthcare · VR',
    company:     'NITInnov Technologies',
    description: 'Led manual testing across web, mobile, and VR platforms for a VR-based healthcare solution. Validated Muse EEG device integration, tested RAG and ML models, and managed defects in Agile sprints.',
    tags:        ['VR', 'EEG', 'ML Testing', 'RAG', 'iOS', 'Android'],
    gradient:    '#2563eb, #1e1b4b',
    icon:        '🥽',
    status:      'enterprise',
  },
  {
    title:       'Cornovus Capital',
    subtitle:    'Finance · Real Estate',
    company:     'NITInnov Technologies',
    description: 'Performed functional and regression testing for commercial real estate loan workflows. Validated loan input forms and confirmed accurate loan calculations for equity, term length, and interest rates.',
    tags:        ['Functional Testing', 'Regression', 'Finance', 'Web'],
    gradient:    '#ca8a04, #7c2d12',
    icon:        '🏦',
    status:      'enterprise',
  },
  {
    title:       'MyHotel AI',
    subtitle:    'Hospitality · PMS',
    company:     'Arkashya Tech Solution',
    description: 'Performed functional, regression, and UI testing on web, Android, and iOS platforms. Executed automation test scripts for web using Selenium + TestNG across all key PMS modules.',
    tags:        ['Selenium', 'TestNG', 'iOS', 'Android', 'UI Testing'],
    gradient:    '#db2777, #581c87',
    icon:        '🏨',
    status:      'enterprise',
  },
  {
    title:       'Zane Hospitality',
    subtitle:    'E-commerce',
    company:     'NITInnov Technologies',
    description: 'Tested web modules for product listings, order placement, and customer inquiry workflows. Ensured seamless user experience across all critical e-commerce flows.',
    tags:        ['Web Testing', 'UI/UX', 'E-commerce'],
    gradient:    '#0d9488, #134e4a',
    icon:        '🛒',
    status:      'enterprise',
  },
  {
    title:       'ACW Card',
    subtitle:    'NFC Technology',
    company:     'Arkashya Tech Solution',
    description: 'Conducted cross-device NFC testing for a smart digital business card application. Validated interactions and compatibility, ensuring smooth app performance across devices.',
    tags:        ['NFC Testing', 'Cross-device', 'Compatibility'],
    gradient:    '#475569, #111827',
    icon:        '📇',
    status:      'live',
  },
];

const skills = [
  { category: 'Test Automation', icon: '⚙️', items: ['Playwright', 'Selenium WebDriver', 'TestNG', 'Cucumber'] },
  { category: 'Programming',     icon: '💻', items: ['TypeScript', 'Java'] },
  { category: 'CI/CD & DevOps', icon: '🔧', items: ['Jenkins', 'Maven', 'GitHub', 'SonarQube'] },
  { category: 'Testing Types',   icon: '🔬', items: ['Functional Testing', 'Regression Testing', 'UI/UX Testing', 'AI / RAG Testing', 'ML Model Testing', 'API Testing'] },
  { category: 'Databases',       icon: '🗄️', items: ['SQL', 'MongoDB'] },
  { category: 'Tools & Platforms', icon: '📋', items: ['JIRA', 'Postman', 'Web', 'Mobile (iOS/Android)', 'VR'] },
  { category: 'Methodologies',   icon: '🔄', items: ['Agile / Scrum', 'SDLC', 'STLC'] },
];

const certifications = [
  {
    title:    'Selenium WebDriver with Java',
    subtitle: 'Basics to Advanced + Frameworks',
    issuer:   'Udemy',
    date:     'Oct 2024',
    instructor: 'Rahul Shetty',
    duration: '55.5 hrs',
    tags:     ['Selenium', 'Java', 'TestNG', 'Frameworks'],
    color:    '#7c3aed',
  },
  {
    title:    'ML (AI) Testing',
    subtitle: 'Introduction to Machine Learning Models Testing',
    issuer:   'Udemy',
    date:     'Dec 2024',
    instructor: 'Rahul Shetty',
    duration: '5 hrs',
    tags:     ['AI Testing', 'ML Models', 'QA Strategy'],
    color:    '#FF6200',
  },
  {
    title:    'Master Class to QA Professionals',
    subtitle: 'Certificate of Participation',
    issuer:   'Testleaf',
    date:     'Oct 2025',
    instructor: 'Testleaf',
    duration: '',
    tags:     ['QA Best Practices', 'Test Strategy'],
    color:    '#a855f7',
  },
  {
    title:    'Automation Testing Skills',
    subtitle: 'Cracking QA Roles in Top Tech Companies — Webinar',
    issuer:   'GUVI × HCL',
    date:     'Nov 2025',
    instructor: 'GUVI | HCL',
    duration: '',
    tags:     ['Automation', 'Interview Prep', 'Career Growth'],
    color:    '#06b6d4',
  },
];

/* ============================================================
   RENDER: EXPERIENCE TIMELINE
   ============================================================ */
function renderExperience() {
  const container = document.getElementById('experienceTimeline');
  if (!container) return;

  container.innerHTML = experience.map(job => `
    <div class="timeline-item reveal">
      <div class="timeline-dot${job.current ? ' current' : ''}"></div>
      <div class="timeline-card">
        <div class="timeline-meta">
          ${job.current ? '<span class="badge-current">Current</span>' : ''}
          <span class="timeline-date">${job.period}</span>
        </div>
        <h3 class="timeline-role">${job.role}</h3>
        <div class="timeline-company">${job.company}</div>
        <ul class="timeline-highlights">
          ${job.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
        <div class="tag-row">
          ${job.tech.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/* ============================================================
   RENDER: PROJECTS CAROUSEL
   ============================================================ */
function renderProjects() {
  const track = document.getElementById('projectsTrack');
  if (!track) return;

  track.innerHTML = projects.map(p => `
    <div class="project-card reveal">
      <div class="project-banner" style="background: linear-gradient(90deg, ${p.gradient})"></div>
      <div class="project-body">
        <div class="project-header">
          <span class="project-icon">${p.icon}</span>
          <span class="project-status-badge ${p.status}">${p.status === 'live' ? 'Live' : 'Enterprise'}</span>
        </div>
        <h3 class="project-title">${p.title}</h3>
        <div class="project-company">${p.company}</div>
        <p class="project-desc">${p.description}</p>
        <div class="project-tags">
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/* ============================================================
   RENDER: SKILLS
   ============================================================ */
function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;

  grid.innerHTML = skills.map(s => `
    <div class="skill-card reveal">
      <div class="skill-card-header">
        <span class="skill-icon">${s.icon}</span>
        <span class="skill-category">${s.category}</span>
      </div>
      <div class="skill-tags">
        ${s.items.map(item => `<span class="skill-tag">${item}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

/* ============================================================
   RENDER: CERTIFICATIONS
   ============================================================ */
function renderCertifications() {
  const grid = document.getElementById('certGrid');
  if (!grid) return;

  grid.innerHTML = certifications.map(c => `
    <div class="cert-card reveal" style="--cert-color: ${c.color}">
      <div class="cert-issuer">${c.issuer}</div>
      <h3 class="cert-title">${c.title}</h3>
      <p class="cert-subtitle">${c.subtitle}</p>
      <div class="cert-meta">
        <div class="cert-meta-item">Date: <span>${c.date}</span></div>
        ${c.duration ? `<div class="cert-meta-item">Duration: <span>${c.duration}</span></div>` : ''}
        <div class="cert-meta-item">By: <span>${c.instructor}</span></div>
      </div>
      <div class="cert-tags">
        ${c.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

/* ============================================================
   CAROUSEL LOGIC
   ============================================================ */
function initCarousel() {
  const track     = document.getElementById('projectsTrack');
  const prevBtn   = document.getElementById('projectsPrev');
  const nextBtn   = document.getElementById('projectsNext');
  const dotsWrap  = document.getElementById('projectsDots');
  if (!track || !prevBtn || !nextBtn) return;

  const CARD_W  = 340;
  const GAP     = 24;
  const STEP    = CARD_W + GAP;

  let index = 0;

  function getMax() {
    const visible = Math.floor(track.parentElement.offsetWidth / STEP) || 1;
    return Math.max(0, projects.length - visible);
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const max = getMax();
    for (let i = 0; i <= max; i++) {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function updateDots() {
    const dots = dotsWrap.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(n) {
    const max = getMax();
    index = Math.max(0, Math.min(n, max));
    track.style.transform = `translateX(-${index * STEP}px)`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === max;
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  // Touch / drag
  let startX = 0, dragging = false;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; dragging = true; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (!dragging) return;
    dragging = false;
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 50)  goTo(index + 1);
    if (diff < -50) goTo(index - 1);
  });

  // Mouse drag
  let mouseStartX = 0, mouseDragging = false;
  track.addEventListener('mousedown', e => { mouseStartX = e.clientX; mouseDragging = true; });
  window.addEventListener('mouseup', e => {
    if (!mouseDragging) return;
    mouseDragging = false;
    const diff = mouseStartX - e.clientX;
    if (diff > 60)  goTo(index + 1);
    if (diff < -60) goTo(index - 1);
  });

  window.addEventListener('resize', () => { buildDots(); goTo(Math.min(index, getMax())); });

  buildDots();
  goTo(0);
}

/* ============================================================
   PARTICLES
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  const COLORS = [
    [255, 98, 0],
    [255, 140, 66],
    [255, 184, 0],
    [255, 51, 0],
    [255, 200, 80],
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Spark {
    constructor(scattered) {
      this.reset(scattered);
    }
    reset(scattered) {
      this.x      = Math.random() * W;
      this.y      = scattered ? Math.random() * H : H + Math.random() * 80;
      this.r      = Math.random() * 2.2 + 0.4;
      this.vy     = -(Math.random() * 1.1 + 0.35);
      this.vx     = (Math.random() - 0.5) * 0.5;
      this.alpha  = Math.random() * 0.5 + 0.15;
      this.life   = scattered ? Math.random() * 180 : 0;
      this.maxLife = Math.random() * 200 + 100;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.life++;
      if (this.y < -8 || this.life > this.maxLife) this.reset(false);
    }
    draw() {
      const t = this.life / this.maxLife;
      const a = this.alpha * (1 - t * t);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${a})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 130 }, () => new Spark(true));
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => { if (p.x > W) p.x = Math.random() * W; });
  });

  init();
  animate();
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ============================================================
   COUNTER OBSERVER
   ============================================================ */
function initCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-val[data-target]').forEach(el => io.observe(el));
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('navHamburger');
  const menu      = document.getElementById('mobileMenu');

  // Scroll effect
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on mobile link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active nav link highlight
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  const ioNav = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.style.color = 'var(--orange)';
      }
    });
  }, { threshold: 0.45 });
  sections.forEach(s => ioNav.observe(s));
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const btn  = document.getElementById('formSubmitBtn');
  if (!form || !btn) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const orig = btn.textContent;
    btn.textContent    = 'Sent ✓';
    btn.style.background = '#22c55e';
    btn.style.boxShadow  = '0 0 24px rgba(34,197,94,0.4)';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent    = orig;
      btn.style.background = '';
      btn.style.boxShadow  = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Render dynamic content first
  renderExperience();
  renderProjects();
  renderSkills();
  renderCertifications();

  // Init interactions
  initParticles();
  initCarousel();
  initReveal();
  initCounters();
  initNav();
  initContactForm();

  // Re-run reveal observer after dynamic content is in DOM
  setTimeout(initReveal, 100);
});
