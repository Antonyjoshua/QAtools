// Typewriter effect
(function () {
  const el = document.getElementById('heroType');
  if (!el) return;
  const roles = ['Quality Analyst', 'Bug Hunter 🐛', 'Test Architect', 'Automation Engineer', 'Defect Detective 🔍', 'QA Engineer', 'Test Strategist ⚡', 'JIRA Power User'];
  let rIdx = 0, cIdx = 0, deleting = false;
  function tick() {
    const word = roles[rIdx];
    el.textContent = deleting ? word.slice(0, cIdx--) : word.slice(0, cIdx++);
    if (!deleting && cIdx > word.length)   { deleting = true;  return setTimeout(tick, 1600); }
    if  (deleting && cIdx < 0)             { deleting = false; rIdx = (rIdx + 1) % roles.length; return setTimeout(tick, 320); }
    setTimeout(tick, deleting ? 38 : 75);
  }
  tick();
})();

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

function setTheme(isLight) {
  document.body.classList.toggle('light', isLight);
  themeIcon.textContent = isLight ? '🌙' : '☀️';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Apply saved preference on load
setTheme(localStorage.getItem('theme') === 'light');

themeToggle.addEventListener('click', () => {
  setTheme(!document.body.classList.contains('light'));
});


// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

// Close nav on link click (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Navbar scroll shadow
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.5)' : 'none';
});

// Scroll-into-view animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.timeline-card, .project-card, .skill-group, .detail-card, .contact-card, .about-text, .about-details, .stat'
).forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// ===== Catch the Bug Game =====
(function () {
  const board       = document.getElementById('ctbBoard');
  if (!board) return;
  const overlay     = document.getElementById('ctbOverlay');
  const startScreen = document.getElementById('ctbStartScreen');
  const resultScreen= document.getElementById('ctbResultScreen');
  const startBtn    = document.getElementById('ctbStartBtn');
  const restartBtn  = document.getElementById('ctbRestartBtn');
  const scoreEl     = document.getElementById('ctbScore');
  const timerEl     = document.getElementById('ctbTimer');
  const bestEl      = document.getElementById('ctbBest');
  const finalScoreEl= document.getElementById('ctbFinalScore');
  const rankEl      = document.getElementById('ctbRank');

  const BUG_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="10" r="4"/>
    <path d="M9 6.5L7 4.5M15 6.5L17 4.5M5 10H3M21 10H19M8 14L5 17M16 14L19 17"/>
  </svg>`;

  let score = 0, best = 0, timeLeft = 30;
  let gameInterval = null, moveInterval = null;
  let bugs = [];

  function randPos() {
    const pad = 50;
    const w = board.offsetWidth  - pad * 2;
    const h = board.offsetHeight - pad * 2;
    return {
      x: Math.floor(Math.random() * w) + pad,
      y: Math.floor(Math.random() * h) + pad
    };
  }

  function spawnBug(id) {
    const el = document.createElement('div');
    el.className = 'ctb-bug';
    el.innerHTML = BUG_SVG;
    const p = randPos();
    el.style.left = p.x + 'px';
    el.style.top  = p.y + 'px';
    el.addEventListener('click', () => onCatch(el));
    board.appendChild(el);
    return el;
  }

  function moveBug(el) {
    const p = randPos();
    el.style.left = p.x + 'px';
    el.style.top  = p.y + 'px';
  }

  function onCatch(el) {
    if (!gameInterval) return;
    score++;
    scoreEl.textContent = score;

    // score pop
    const pop = document.createElement('div');
    pop.className = 'ctb-score-pop';
    pop.textContent = '+1';
    pop.style.left = el.style.left;
    pop.style.top  = el.style.top;
    board.appendChild(pop);
    setTimeout(() => pop.remove(), 700);

    // squash then reappear
    el.classList.add('squashed');
    setTimeout(() => {
      el.classList.remove('squashed');
      moveBug(el);
    }, 350);
  }

  function startGame() {
    score = 0; timeLeft = 30;
    scoreEl.textContent = 0;
    timerEl.textContent = 30;
    timerEl.classList.remove('danger');

    // clear old bugs
    bugs.forEach(b => b.remove());
    bugs = [spawnBug(0), spawnBug(1), spawnBug(2)];

    overlay.style.display = 'none';

    // auto-move bugs every 1.5 s
    moveInterval = setInterval(() => bugs.forEach(moveBug), 1500);

    // countdown
    gameInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;
      if (timeLeft <= 10) timerEl.classList.add('danger');
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    clearInterval(gameInterval);
    clearInterval(moveInterval);
    gameInterval = null;
    bugs.forEach(b => b.remove());
    bugs = [];

    if (score > best) { best = score; bestEl.textContent = best; }
    finalScoreEl.textContent = score;

    const ranks = [
      [20, '🏆 Expert QA Engineer!'],
      [12, '⭐ Senior Tester!'],
      [6,  '✓ QA Analyst'],
      [0,  '🐛 Keep practicing!']
    ];
    rankEl.textContent = ranks.find(([min]) => score >= min)[1];

    startScreen.style.display  = 'none';
    resultScreen.style.display = 'block';
    overlay.style.display      = 'flex';
  }

  startBtn.addEventListener('click',   startGame);
  restartBtn.addEventListener('click', startGame);
})();

// ===== Bug Report Simulator =====
(function () {
  if (!document.getElementById('brsForm')) return;
  const bugData = {
    1: {
      title: 'Password field missing label — accessibility violation',
      severity: 'Medium',
      steps: '1. Navigate to mock-app.com/register\n2. Observe the password input field\n3. Check for visible label text above the field',
      expected: 'Password field should have a visible label describing the field',
      actual: 'Password field has no label — only a placeholder, which disappears on focus'
    },
    2: {
      title: 'Register button uses red color instead of primary brand color',
      severity: 'Low',
      steps: '1. Navigate to mock-app.com/register\n2. Observe the Register button color',
      expected: 'Button should use the application\'s primary brand color (blue/green)',
      actual: 'Button renders in red, which is conventionally used for danger/error actions and creates confusion'
    },
    3: {
      title: 'Terms & Conditions link leads to a 404 error page',
      severity: 'High',
      steps: '1. Navigate to mock-app.com/register\n2. Click the "Terms & Conditions" link at the bottom',
      expected: 'Terms & Conditions page should load successfully',
      actual: 'Page returns 404 — Not Found. Link URL is broken (/404-not-found)'
    }
  };

  let bugCount = 0;

  function fill(bugId) {
    const d = bugData[bugId];
    document.getElementById('brsTitle').value    = d.title;
    document.getElementById('brsSeverity').value = d.severity;
    document.getElementById('brsSteps').value    = d.steps;
    document.getElementById('brsExpected').value = d.expected;
    document.getElementById('brsActual').value   = d.actual;
    // highlight selected bug in mock UI
    document.querySelectorAll('.brs-buggy').forEach(el => el.classList.remove('selected-bug'));
    const target = document.getElementById('mockBug' + bugId);
    if (target) target.classList.add('selected-bug');
  }

  [1, 2, 3].forEach(id => {
    const el = document.getElementById('mockBug' + id);
    if (el) el.addEventListener('click', () => fill(id));
  });

  document.getElementById('brsForm').addEventListener('submit', function (e) {
    e.preventDefault();
    bugCount++;
    const id       = 'BUG-' + String(bugCount).padStart(3, '0');
    const severity = document.getElementById('brsSeverity').value;
    const severityColors = { Critical:'#ef4444', High:'#f97316', Medium:'#eab308', Low:'#22c55e' };

    document.getElementById('brsCardId').textContent       = id;
    document.getElementById('brsCardTitle').textContent    = document.getElementById('brsTitle').value;
    document.getElementById('brsCardSeverity').textContent = severity || 'Unset';
    document.getElementById('brsCardSeverity').style.color = severityColors[severity] || 'var(--accent2)';
    document.getElementById('brsCardDate').textContent     = 'Reported: ' + new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
    document.getElementById('brsCardSteps').textContent    = document.getElementById('brsSteps').value;
    document.getElementById('brsCardExpected').textContent = document.getElementById('brsExpected').value;
    document.getElementById('brsCardActual').textContent   = document.getElementById('brsActual').value;

    document.getElementById('brsCard').style.display = 'block';
    document.getElementById('brsCard').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    this.reset();
    document.querySelectorAll('.brs-buggy').forEach(el => el.classList.remove('selected-bug'));
  });

  document.getElementById('brsReset').addEventListener('click', () => {
    document.getElementById('brsCard').style.display = 'none';
  });
})();

// ===== Spot the Bug Quiz =====
(function () {
  if (!document.getElementById('stbCard')) return;
  const questions = [
    {
      q: 'Q1 — What\'s the bug in this JavaScript function?',
      code:
`function addNumbers(a, b) {
  return a - b;
}
// Test: addNumbers(5, 3)
// Expected: 8  |  Got: 2`,
      options: [
        'Missing semicolon at end of return statement',
        'Wrong operator: "-" should be "+"',
        'Function name is misleading',
        'Parameters a and b should be strings'
      ],
      answer: 1,
      explanation: 'The function subtracts instead of adds. A classic arithmetic operator typo — easy to miss in code review.'
    },
    {
      q: 'Q2 — What security/QA defect does this HTML form have?',
      code:
`<form>
  <input type="text" placeholder="Username">
  <input type="text" placeholder="Password">
  <button type="submit">Login</button>
</form>`,
      options: [
        'Missing "action" attribute on the form',
        'Password field uses type="text" — exposes password in plain text',
        'Button needs an onClick event handler',
        'Inputs are missing "name" attributes'
      ],
      answer: 1,
      explanation: 'The password input uses type="text" so the password is visible as the user types. It should be type="password".'
    },
    {
      q: 'Q3 — Which API response behaviour is a defect?',
      code:
`// Creating a new user
POST /api/users
Body: { "name": "Antony", "email": "antony@test.com" }

// Server responds with:
HTTP 200 OK
{ "id": 42, "name": "Antony" }`,
      options: [
        'Response should not include the user object',
        'POST should be changed to PUT',
        'Status code should be 201 Created, not 200 OK',
        'Email field is missing from the response'
      ],
      answer: 2,
      explanation: 'RFC 7231 says POST that creates a resource must return 201 Created. Returning 200 is semantically wrong and breaks REST clients that check status codes.'
    },
    {
      q: 'Q4 — What\'s the bug in this loop?',
      code:
`const items = ['Home', 'About', 'Projects', 'Contact'];

for (let i = 0; i <= items.length; i++) {
  console.log(items[i]);
}
// Output: Home About Projects Contact undefined`,
      options: [
        'Wrong variable name inside the loop',
        'Array items should use const not let',
        'Loop condition uses "<=" instead of "<" — off-by-one error',
        'Missing break statement at the end'
      ],
      answer: 2,
      explanation: 'Using "<=" goes one index past the last element. items[4] is undefined. The condition should be i < items.length.'
    },
    {
      q: 'Q5 — Identify the UI/UX defect in this scenario:',
      code:
`Account Settings page:

[ Save Changes ]  [ Delete Account ]

Both buttons have identical styling.
"Delete Account" executes immediately
on click — no confirmation dialog.`,
      options: [
        'Save Changes button is in the wrong position',
        'No confirmation dialog before a destructive, irreversible action',
        'Buttons should have icons to look better',
        'Font size is too small for accessibility'
      ],
      answer: 1,
      explanation: 'Destructive actions (delete, clear all, overwrite) must always ask for confirmation. No dialog = accidental data loss, a critical UX defect.'
    }
  ];

  let current = 0, score = 0;
  const answers = [];

  const fillEl    = document.getElementById('stbFill');
  const labelEl   = document.getElementById('stbProgressLabel');
  const questionEl= document.getElementById('stbQuestion');
  const codeEl    = document.getElementById('stbCode');
  const optionsEl = document.getElementById('stbOptions');
  const feedbackEl= document.getElementById('stbFeedback');
  const cardEl    = document.getElementById('stbCard');
  const resultEl  = document.getElementById('stbResult');

  function showQuestion(index) {
    const q = questions[index];
    fillEl.style.width = (index / questions.length * 100) + '%';
    labelEl.textContent = 'Question ' + (index + 1) + ' of ' + questions.length;

    questionEl.textContent = q.q;
    if (q.code) {
      codeEl.textContent = q.code;
      codeEl.classList.add('show');
    } else {
      codeEl.classList.remove('show');
    }
    feedbackEl.textContent = '';
    optionsEl.innerHTML = '';

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'stb-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => pickAnswer(i, btn, q));
      optionsEl.appendChild(btn);
    });
  }

  function pickAnswer(chosen, btn, q) {
    // disable all
    optionsEl.querySelectorAll('.stb-option').forEach(b => { b.disabled = true; });
    const correct = chosen === q.answer;
    btn.classList.add(correct ? 'correct' : 'wrong');
    // reveal correct if wrong
    if (!correct) {
      optionsEl.querySelectorAll('.stb-option')[q.answer].classList.add('correct');
    }
    feedbackEl.textContent = (correct ? '✓ ' : '✗ ') + q.explanation;
    answers.push({ q: q.q.replace(/^Q\d+ — /, ''), correct });
    if (correct) score++;

    setTimeout(() => {
      current++;
      if (current < questions.length) {
        showQuestion(current);
      } else {
        showResult();
      }
    }, 1600);
  }

  function showResult() {
    fillEl.style.width = '100%';
    cardEl.style.display = 'none';
    resultEl.style.display = 'block';

    document.getElementById('stbFinalScore').textContent = score;
    const ranks = [
      [5, '🏆 Perfect score! You think like a QA expert.'],
      [4, '⭐ Excellent — strong bug detection skills!'],
      [3, '✓ Good — solid QA fundamentals.'],
      [2, '📖 Not bad — keep sharpening your skills.'],
      [0, '🐛 Keep practicing — QA takes experience!']
    ];
    document.getElementById('stbResultRank').textContent = ranks.find(([min]) => score >= min)[1];

    const breakdown = document.getElementById('stbBreakdown');
    breakdown.innerHTML = answers.map(a =>
      `<div class="stb-breakdown-item">
        <span class="stb-breakdown-icon">${a.correct ? '✅' : '❌'}</span>
        <span>${a.q}</span>
      </div>`
    ).join('');
  }

  function restart() {
    current = 0; score = 0; answers.length = 0;
    fillEl.style.width = '0%';
    labelEl.textContent = 'Question 1 of 5';
    resultEl.style.display = 'none';
    cardEl.style.display = 'block';
    showQuestion(0);
  }

  document.getElementById('stbRestartBtn').addEventListener('click', restart);
  showQuestion(0);
})();

// ===== Stat Modal =====
(function () {
  const overlay  = document.getElementById('statModalOverlay');
  if (!overlay) return;
  const modalTitle = document.getElementById('statModalTitle');
  const modalBody  = document.getElementById('statModalBody');
  const closeBtn   = document.getElementById('statModalClose');

  const PROJECTS = [
    { name: 'Jeshwar Teaching',    company: 'Scope Thinkers',        domain: 'EdTech · Education Technology',        desc: 'Full-stack EdTech platform — live classes, video streaming, digital content, online book store & e-learning. Tested Web, Android, iOS.',       tags: ['Playwright', 'TypeScript', 'Live Streaming', 'iOS', 'Android', 'E-Commerce'] },
    { name: 'Funtown Kids Park',   company: 'Scope Thinkers',        domain: 'Entertainment · Recreation',           desc: 'Amusement park management — point purchase & redemption, play activities, franchise management, loyalty & rewards. Tested Android & Web.',  tags: ['Playwright', 'TypeScript', 'Android', 'Loyalty Systems', 'Franchise'] },
    { name: 'Scope AI Chat',       company: 'Scope Thinkers',        domain: 'Artificial Intelligence · Gen AI',     desc: 'RAG-based AI chatbot SaaS — document & website ingestion, embeddable widget, context-aware responses, multi-source knowledge retrieval.',   tags: ['RAG', 'Generative AI', 'Playwright', 'TypeScript', 'SaaS'] },
    { name: 'Scope Employee Portal', company: 'Scope Thinkers',      domain: 'HRMS · HR Technology',                desc: 'HRMS platform — employee management, attendance tracking, leave workflows. Tested Web & Mobile for seamless employee lifecycle management.', tags: ['Playwright', 'TypeScript', 'Mobile', 'Web', 'HR Automation'] },
    { name: 'ConfidentoAI',        company: 'NITInnov Technologies', domain: 'Healthcare · VR Therapy',             desc: 'VR-based healthcare solution — Muse EEG device integration, RAG & ML model testing, defect management across Web, Mobile & VR platforms.',  tags: ['VR', 'EEG', 'ML Testing', 'RAG', 'Agile'] },
    { name: 'Cornovus Capital',    company: 'NITInnov Technologies', domain: 'Finance · Real Estate',               desc: 'Commercial real estate loan platform — validated loan input forms, buyer\'s equity, term length & interest rate calculations.',               tags: ['Functional Testing', 'Regression', 'Finance', 'Calculations'] },
    { name: 'MyHotel AI',         company: 'Arkashya Tech Solution', domain: 'Hospitality · PMS',                  desc: 'Hotel property management system — functional, regression & UI testing across Web, Android & iOS. Selenium + TestNG automation scripts.',   tags: ['Selenium', 'TestNG', 'iOS', 'Android', 'Web'] },
    { name: 'Zane Hospitality',    company: 'NITInnov Technologies', domain: 'E-commerce · Retail',                desc: 'E-commerce web platform — product listings, order placement & customer inquiry workflows. Validated seamless UX across critical flows.',      tags: ['Web Testing', 'UI/UX', 'E-commerce', 'Regression'] },
    { name: 'ACW Card',           company: 'Arkashya Tech Solution', domain: 'NFC Technology · Digital Identity',  desc: 'Smart digital business card app — cross-device NFC interaction testing, compatibility validation & smooth performance across devices.',       tags: ['NFC Testing', 'Cross-device', 'Compatibility', 'Mobile'] },
  ];

  const DOMAINS = [
    { icon: '🎓', name: 'EdTech',                   desc: 'Education Technology — live classes, e-learning, digital content delivery, online book stores',     projects: 'Jeshwar Teaching' },
    { icon: '🎡', name: 'Entertainment',             desc: 'Recreation & Amusement — park management, loyalty programs, franchise operations, rewards systems',  projects: 'Funtown Kids Park' },
    { icon: '🤖', name: 'Artificial Intelligence',   desc: 'Gen AI & RAG — chatbots, document ingestion, knowledge retrieval, ML model validation, SaaS',       projects: 'Scope AI Chat · ConfidentoAI' },
    { icon: '👥', name: 'HR Technology',             desc: 'HRMS — employee lifecycle management, attendance tracking, leave workflows, HR automation',           projects: 'Scope Employee Portal' },
    { icon: '🏥', name: 'Healthcare · MedTech',      desc: 'VR Therapy & MedTech — EEG device integration, VR platforms, clinical workflow validation',          projects: 'ConfidentoAI' },
    { icon: '💰', name: 'Finance · FinTech',         desc: 'Real estate loans, equity calculation, financial workflow validation, interest rate accuracy',        projects: 'Cornovus Capital' },
    { icon: '🏨', name: 'Hospitality · PMS',         desc: 'Hotel & property management systems — booking, room management, guest services, reporting',          projects: 'MyHotel AI · Zane Hospitality' },
    { icon: '🛒', name: 'E-commerce · Retail',       desc: 'Product listings, order management, customer inquiry workflows, NFC-based digital identity cards',   projects: 'Zane Hospitality · ACW Card' },
  ];

  function openModal(stat) {
    if (stat === 'projects') {
      modalTitle.textContent = '9+ Projects';
      modalBody.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
      modalBody.innerHTML = PROJECTS.map(p => `
        <div class="sm-project-card">
          <div class="sm-project-domain">${p.domain}</div>
          <div class="sm-project-name">${p.name}</div>
          <div class="sm-project-company">${p.company}</div>
          <p class="sm-project-desc">${p.desc}</p>
          <div class="sm-tags">${p.tags.map(t => `<span class="sm-tag">${t}</span>`).join('')}</div>
        </div>
      `).join('');
    } else {
      modalTitle.textContent = '8 Domains';
      modalBody.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
      modalBody.innerHTML = DOMAINS.map(d => `
        <div class="sm-domain-card">
          <span class="sm-domain-icon">${d.icon}</span>
          <div class="sm-domain-name">${d.name}</div>
          <p class="sm-domain-desc">${d.desc}</p>
          <div class="sm-domain-projects">📁 ${d.projects}</div>
        </div>
      `).join('');
    }
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.stat-clickable').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.stat));
  });
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

// Bug interactive portrait
(function () {
  var card = document.getElementById('bugCardH');
  if (!card) return;
  var INFO = {
    experience: { icon: '⏱', title: '3+ Years Experience',     desc: 'Left antenna tuned since 2021 — sensing quality issues across web, mobile, VR, and AI platforms.' },
    defects:    { icon: '🐛', title: '2500+ Defects Found',     desc: 'Right antenna wired for detection. Critical, major, minor — nothing slips past the radar.' },
    education:  { icon: '🎓', title: 'MCA — Madras University', desc: 'Master of Computer Applications. The analytical brain behind every test plan and strategy.' },
    playwright: { icon: '🎭', title: 'Playwright + TypeScript',  desc: 'Left eye: modern automation. Cross-browser, headless, end-to-end testing built for scale.' },
    selenium:   { icon: '🔬', title: 'Selenium + Java',          desc: 'Right eye: 55.5 hours of WebDriver mastery — from basics to full framework architecture.' },
    skills:     { icon: '⚡', title: 'Core QA Arsenal',          desc: 'Power core: Playwright · Selenium · TestNG · JIRA · Postman · API Testing · Java · TypeScript.' },
    domains:    { icon: '🌐', title: '8 Domains',               desc: 'Wings span: E-commerce · Banking · Healthcare · EdTech · VR · AI · Real Estate · Logistics.' },
    projects:   { icon: '📁', title: '9+ Projects',             desc: '9+ completed projects — web apps, mobile platforms, VR environments, and AI tools tested.' },
    automation: { icon: '🤖', title: 'Automation Testing',      desc: 'Upper limbs for speed: Playwright scripts, Selenium frameworks, CI/CD pipeline integration.' },
    manual:     { icon: '🔍', title: 'Manual Testing',          desc: 'Lower limbs for precision: exploratory testing, regression, UAT, test case design, triage.' },
    passion:    { icon: '💜', title: 'Passion for Quality',     desc: "The sting — injecting quality into every product. Bug hunting isn't a job, it's instinct." }
  };
  var icEl = document.getElementById('bhIcon');
  var ttEl = document.getElementById('bhTitle');
  var dsEl = document.getElementById('bhDesc');
  var hideT;
  document.querySelectorAll('.bp[data-k]').forEach(function (part) {
    part.addEventListener('mouseenter', function (e) {
      clearTimeout(hideT);
      var data = INFO[this.dataset.k];
      if (!data) return;
      icEl.textContent = data.icon;
      ttEl.textContent = data.title;
      dsEl.textContent = data.desc;
      placeH(e); card.classList.add('on');
    });
    part.addEventListener('mousemove', placeH);
    part.addEventListener('mouseleave', function () {
      hideT = setTimeout(function () { card.classList.remove('on'); }, 120);
    });
  });
  function placeH(e) {
    var mg = 14, cw = card.offsetWidth || 240, ch = card.offsetHeight || 130;
    var x = e.clientX + 22, y = e.clientY - ch / 2;
    if (x + cw > window.innerWidth  - mg) x = e.clientX - cw - 22;
    if (y < mg) y = mg;
    if (y + ch > window.innerHeight - mg) y = window.innerHeight - ch - mg;
    card.style.left = x + 'px';
    card.style.top  = y + 'px';
  }
})();

// Active nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) current = section.id;
  });
  navItems.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});

// ===== 1. Scroll Progress Bar =====
(function () {
  var bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }, { passive: true });
})();

// ===== 2. Console Easter Egg =====
(function () {
  console.log('%c 🐛 Welcome, Bug Hunter! ', 'color:#6c63ff;font-size:22px;font-weight:700;background:#0d0d14;padding:4px 10px;border-radius:6px;');
  console.log('%c Portfolio of Antony Joshua S — Quality Analyst', 'color:#a78bfa;font-size:13px;');
  console.log('%c Spotted a bug on this site? That\'s my job. 😄\n%c ↳ antonyjoshua413@gmail.com', 'color:#94a3b8;font-size:11px;', 'color:#6c63ff;font-size:11px;');
})();

// ===== 3. Stat Counters =====
(function () {
  function parseNum(text) {
    var clean = text.replace(/[^0-9]/g, '');
    return { target: parseInt(clean, 10) || 0, suffix: text.replace(/[0-9]/g, '') };
  }
  function animateCount(el, target, suffix, dur) {
    var start = performance.now();
    (function step(now) {
      var t = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * e) + suffix;
      if (t < 1) requestAnimationFrame(step);
    })(start);
  }
  // About-section stat numbers (inside .stat elements already observed)
  var statObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      statObs.unobserve(entry.target);
      var numEl = entry.target.querySelector('.stat-num');
      if (!numEl) return;
      var p = parseNum(numEl.textContent);
      animateCount(numEl, p.target, p.suffix, 1400);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat').forEach(function (el) { statObs.observe(el); });
  // Hero stat numbers stay static (already visible on page load — no flash-to-zero)
})();

// ===== 4. Project Card 3D Tilt =====
(function () {
  document.querySelectorAll('.project-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = this.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      var dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      this.style.transform = 'perspective(800px) rotateX(' + (-dy * 7) + 'deg) rotateY(' + (dx * 7) + 'deg) translateZ(10px)';
      this.style.boxShadow = '0 22px 44px rgba(0,0,0,0.35), 0 0 0 1px rgba(108,99,255,0.4)';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  });
})();

// ===== 7. Skills Radar Chart =====
(function () {
  var canvas = document.getElementById('skillRadar');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  var cx = W / 2, cy = H / 2 + 8;
  var R = 52;
  var skills = [
    { label: 'Automation',  value: 0.90 },
    { label: 'Manual',      value: 0.95 },
    { label: 'API Testing', value: 0.82 },
    { label: 'Mobile',      value: 0.85 },
    { label: 'AI / ML',     value: 0.78 }
  ];
  var N = skills.length;
  var ang = function (i) { return -Math.PI / 2 + (2 * Math.PI * i / N); };

  function themeColors() {
    var cs = getComputedStyle(document.documentElement);
    var acc  = cs.getPropertyValue('--accent').trim()  || '#6c63ff';
    var acc2 = cs.getPropertyValue('--accent2').trim() || '#a78bfa';
    var txt  = cs.getPropertyValue('--text').trim()    || '#e2e2f0';
    function ha(hex, op) {
      var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      return 'rgba(' + r + ',' + g + ',' + b + ',' + op + ')';
    }
    return { acc: acc, acc2: acc2, txt: txt, ha: ha };
  }

  function draw(prog) {
    ctx.clearRect(0, 0, W, H);
    var C = themeColors();
    // Background rings
    [1, 0.75, 0.5, 0.25].forEach(function (f) {
      ctx.beginPath();
      for (var i = 0; i < N; i++) {
        var a = ang(i), x = cx + Math.cos(a) * R * f, y = cy + Math.sin(a) * R * f;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = f === 1 ? C.ha(C.acc, 0.35) : C.ha(C.acc, 0.15);
      ctx.lineWidth = f === 1 ? 1.2 : 0.8;
      ctx.stroke();
    });
    // Axis lines
    for (var i = 0; i < N; i++) {
      var a = ang(i);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.strokeStyle = C.ha(C.acc, 0.22);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // Score polygon (animated via prog 0→1)
    ctx.beginPath();
    skills.forEach(function (sk, i) {
      var a = ang(i), r = R * sk.value * prog;
      var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = C.ha(C.acc, 0.18);
    ctx.fill();
    ctx.strokeStyle = C.acc;
    ctx.lineWidth = 2;
    ctx.stroke();
    // Dots
    skills.forEach(function (sk, i) {
      var a = ang(i), r = R * sk.value * prog;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4, 0, Math.PI * 2);
      ctx.fillStyle = C.acc2;
      ctx.fill();
    });
    // Labels
    var labelR = R + 20;
    ctx.font = '600 10.5px Inter, sans-serif';
    skills.forEach(function (sk, i) {
      var a = ang(i);
      var lx = cx + Math.cos(a) * labelR;
      var ly = cy + Math.sin(a) * labelR;
      ctx.fillStyle = C.txt;
      ctx.textAlign = Math.abs(Math.cos(a)) < 0.1 ? 'center' : (Math.cos(a) > 0 ? 'left' : 'right');
      ctx.textBaseline = Math.sin(a) < -0.5 ? 'bottom' : (Math.sin(a) > 0.5 ? 'top' : 'middle');
      ctx.fillText(sk.label, lx, ly);
    });
  }

  draw(0);
  var animated = false;
  var radarObs = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      var start = performance.now();
      var dur = 1300;
      (function frame(now) {
        var t = Math.min(1, (now - start) / dur);
        draw(1 - Math.pow(1 - t, 3));
        if (t < 1) requestAnimationFrame(frame);
        else draw(1);
      })(start);
    }
  }, { threshold: 0.3 });
  radarObs.observe(canvas);
  // Redraw whenever body class (light/dark) or documentElement style (accent color) changes
  var _mo = new MutationObserver(function () { if (animated) draw(1); });
  _mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  _mo.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
})();

// ===== 8. Cursor Bug Follower — follows cursor with lerp =====
(function () {
  var bug = document.getElementById('cursorBug');
  if (!bug || window.matchMedia('(hover: none)').matches) return;
  var tx = -60, ty = -60, bx = -60, by = -60;
  var ticking = false;
  document.addEventListener('mousemove', function (e) {
    tx = e.clientX; ty = e.clientY;
    if (!ticking) { ticking = true; requestAnimationFrame(loop); }
  });
  function loop() {
    ticking = false;
    bx += (tx - bx) * 0.09;
    by += (ty - by) * 0.09;
    bug.style.transform = 'translate(' + (bx - 15) + 'px,' + (by - 15) + 'px)';
    if (Math.abs(tx - bx) > 0.5 || Math.abs(ty - by) > 0.5) {
      ticking = true; requestAnimationFrame(loop);
    }
  }
})();

// ===== 8b. Cursor Bug — sync colors to accent/theme =====
(function () {
  var bug = document.getElementById('cursorBug');
  if (!bug) return;
  var svg = bug.querySelector('svg');
  if (!svg) return;

  function ha(hex, op) {
    var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + op + ')';
  }

  function updateColors() {
    var cs   = getComputedStyle(document.documentElement);
    var acc  = cs.getPropertyValue('--accent').trim()  || '#6c63ff';
    var acc2 = cs.getPropertyValue('--accent2').trim() || '#a78bfa';

    svg.querySelectorAll('line').forEach(function (el) { el.setAttribute('stroke', acc2); });

    // Antenna tips (r=1.8)
    svg.querySelectorAll('circle[r="1.8"]').forEach(function (el) { el.setAttribute('fill', acc); });
    // Eyes (r=1.6)
    svg.querySelectorAll('circle[r="1.6"]').forEach(function (el) { el.setAttribute('fill', acc2); });
    // Head (r=5.5)
    svg.querySelectorAll('circle[r="5.5"]').forEach(function (el) {
      el.setAttribute('fill', ha(acc, 0.85)); el.setAttribute('stroke', acc2);
    });

    var body = svg.querySelector('ellipse');
    if (body) { body.setAttribute('fill', ha(acc, 0.82)); body.setAttribute('stroke', acc2); }

    bug.style.filter = 'drop-shadow(0 0 6px ' + ha(acc, 0.6) + ')';
  }

  updateColors();

  var _mo = new MutationObserver(updateColors);
  _mo.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
  _mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();

// ===== 9. Timeline Animated Fill Line =====
(function () {
  var line = document.getElementById('timelineLine');
  var section = document.getElementById('experience');
  if (!line || !section) return;
  var filled = false;
  var tlObs = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !filled) {
      filled = true;
      var timeline = line.parentElement;
      line.style.height = timeline.offsetHeight + 'px';
    }
  }, { threshold: 0.1 });
  tlObs.observe(section);
})();
