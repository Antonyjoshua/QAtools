/* ============================================================
   BUG HUNTER PORTFOLIO — ANTONY JOSHUA S
   ============================================================ */

/* ── LOADER ── */
(function () {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');
  const pct    = document.getElementById('loaderPct');
  let p = 0;
  const t = setInterval(() => {
    p += Math.random() * 18;
    if (p >= 100) { p = 100; clearInterval(t); hide(); }
    fill.style.width = p + '%';
    pct.textContent  = Math.floor(p) + '%';
  }, 80);
  function hide() {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      boot();
    }, 400);
  }
})();

/* ── CURSOR ── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = -100, my = -100, cx = -100, cy = -100;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function trackCursor() {
  cx += (mx - cx) * .14;
  cy += (my - cy) * .14;
  if (cursor) {
    cursor.style.left    = cx + 'px';
    cursor.style.top     = cy + 'px';
  }
  if (cursorDot) {
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  }
  requestAnimationFrame(trackCursor);
})();

/* ── HERO CANVAS PARTICLES ── */
function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

  for (let i = 0; i < 65; i++) {
    pts.push({ x: Math.random()*W, y: Math.random()*H,
               vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4,
               r: Math.random()*1.4+.5, a: Math.random()*.45+.1 });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(0,255,136,${p.a})`;
      ctx.fill();
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i+1; j < pts.length; j++) {
        const dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y;
        const d  = Math.sqrt(dx*dx+dy*dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,255,136,${.07*(1-d/100)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── HERO SPIDER TILT ── */
function initBugTilt() {
  const wrap = document.getElementById('heroBugWrap');
  const svg  = document.getElementById('heroBugSvg');
  if (!wrap || !svg) return;
  wrap.addEventListener('mousemove', e => {
    const r  = wrap.getBoundingClientRect();
    const rx = ((e.clientX - r.left) / r.width  - .5) * 14;
    const ry = ((e.clientY - r.top)  / r.height - .5) * -10;
    svg.style.transform = `perspective(900px) rotateY(${rx}deg) rotateX(${ry}deg)`;
  });
  wrap.addEventListener('mouseleave', () => { svg.style.transform = ''; });
}

/* ── NAV SCROLL SPY ── */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const slItems  = document.querySelectorAll('.sl-item');

  function setActive(id) {
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    slItems.forEach(a  => a.classList.toggle('active', a.dataset.section === id));
  }

  new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => io.observe(s));
}

/* ── REVEAL ON SCROLL ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const io  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach(el => io.observe(el));
}

/* ── CERT BAR REVEAL ── */
function initCertBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.cert-card').forEach(c => io.observe(c));
}

/* ── COUNTER ANIMATION ── */
function animCount(el, target, dur) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    el.textContent = Math.floor((1 - Math.pow(1-p, 3)) * target).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}
function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animCount(e.target, parseInt(e.target.dataset.target), 1800);
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '-10% 0px -10% 0px' });
  document.querySelectorAll('[data-target]').forEach(c => io.observe(c));
}

/* ── MEET THE SPIDER — Interactive body parts ── */
const bugData = {
  eyes: {
    icon: '👁️',
    title: 'Eyes — The Detector',
    text: 'I spot defects others miss. Whether it\'s a pixel misalignment, a race condition, or an AI hallucination — if it\'s there, I\'ll find it. Six eyes, zero blind spots.',
  },
  chelicerae: {
    icon: '⚡',
    title: 'Chelicerae — Precision Strike',
    text: 'When I find a bug, I capture it with precision. Clear reproduction steps, exact severity, unambiguous descriptions. Every defect report is a decisive strike.',
  },
  legs: {
    icon: '🕷️',
    title: 'Legs — Agile & Adaptive',
    text: 'Eight legs, eight domains. EdTech, VR, Finance, AI, EEG hardware, Hospitality — I pivot fast and bring cross-domain perspective to every engagement.',
  },
  abdomen: {
    icon: '🛡️',
    title: 'Abdomen — Quality Core',
    text: 'My core holds everything together. Test strategies, regression suites, automation frameworks — built to protect product quality from the inside out.',
  },
  spinnerets: {
    icon: '📊',
    title: 'Spinnerets — The Score',
    text: '2500+ defects woven into QA history and counting. Every bug filed is a crash avoided, a data loss prevented, a frustrated user spared. Quality is the web I spin.',
  },
  magnifier: {
    icon: '🔍',
    title: 'Magnifier — Deep Dive',
    text: 'I dig deep into every feature. Root cause analysis, log forensics, SQL queries, network traces — I don\'t stop at "bug found", I ask "why did it happen?"',
  },
};

function initMeetTheBug() {
  const zones    = document.querySelectorAll('.mtb-zone');
  const icon     = document.getElementById('mtbIconL');
  const title    = document.getElementById('mtbTitleL');
  const text     = document.getElementById('mtbTextL');
  const infoBox  = document.getElementById('mtbInfoBox');
  const listItems = document.querySelectorAll('.mtb-part-item');

  const zoneMap = {
    eyes: 'mtbEyes', chelicerae: 'mtbChelicerae', legs: 'mtbLegs',
    abdomen: 'mtbAbdomen', spinnerets: 'mtbSpinnerets', magnifier: 'mtbMagnifier',
  };

  function activate(part) {
    const d = bugData[part];
    if (!d) return;
    icon.textContent  = d.icon;
    title.textContent = d.title;
    text.textContent  = d.text;
    infoBox && infoBox.classList.add('lit');
    zones.forEach(z => z.classList.remove('active'));
    const zEl = document.getElementById(zoneMap[part]);
    if (zEl) zEl.classList.add('active');
    listItems.forEach(li =>
      li.classList.toggle('active', li.dataset.target === zoneMap[part])
    );
  }

  zones.forEach(z => {
    z.addEventListener('mouseenter', () => activate(z.dataset.part));
    z.addEventListener('click',      () => activate(z.dataset.part));
  });
  listItems.forEach(li => {
    li.addEventListener('click', () => {
      const zone = document.getElementById(li.dataset.target);
      if (zone) activate(zone.dataset.part);
    });
  });
}

/* ── SMOOTH SCROLL ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── CONTACT FORM ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'SENT! ✓';
    btn.style.background = '#00cc66';
    setTimeout(() => {
      btn.innerHTML = 'SEND MESSAGE <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

/* ── BOOT ── */
function boot() {
  initCanvas();
  initBugTilt();
  initScrollSpy();
  initReveal();
  initCertBars();
  initCounters();
  initMeetTheBug();
  initSmoothScroll();
  initContactForm();
}
