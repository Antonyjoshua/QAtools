// ===== AJ Bot — Profile Chatbot =====
(function () {
  'use strict';

  var kb = [
    {
      tags: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'greet', 'help', 'start'],
      answer: "Hey there! 👋 I'm AJ Bot. Ask me anything about Antony Joshua S — skills, experience, projects, or contact info!"
    },
    {
      tags: ['who are you', 'who is antony', 'about antony', 'tell me about', 'introduce', 'name', 'antony joshua', 'antony', 'aj'],
      answer: "I'm Antony Joshua S — a Quality Analyst based in Chennai, India. I specialise in software testing across web, mobile, and AI platforms with 3+ years of hands-on experience."
    },
    {
      tags: ['role', 'designation', 'position', 'profession', 'work as', 'what do you do', 'job title', 'job'],
      answer: "I work as a Quality Analyst — covering automation, manual, API, and mobile testing across various domains."
    },
    {
      tags: ['experience', 'years', 'how long', 'since when', 'how many years', 'career'],
      answer: "I have 3+ years of QA experience since 2021, working across web, mobile, VR, and AI platforms."
    },
    {
      tags: ['education', 'degree', 'qualification', 'university', 'college', 'study', 'studied', 'mca', 'madras', 'master'],
      answer: "I hold an MCA (Master of Computer Applications) from Madras University."
    },
    {
      tags: ['skills', 'tools', 'technologies', 'tech stack', 'know', 'what can you do', 'expertise', 'proficient'],
      answer: "My core skills:\n• Automation — Playwright + TypeScript, Selenium + Java\n• Frameworks — TestNG\n• Tools — JIRA, Postman\n• Testing types — Manual, API, Mobile, AI/ML Testing"
    },
    {
      tags: ['automation', 'playwright', 'selenium', 'typescript', 'testng', 'framework'],
      answer: "I build automation frameworks using Playwright (TypeScript) and Selenium (Java) with TestNG for structured reporting and parallel execution."
    },
    {
      tags: ['java', 'programming', 'language', 'coding', 'code'],
      answer: "I use Java primarily for Selenium automation, writing clean, maintainable test scripts and utility classes."
    },
    {
      tags: ['api', 'postman', 'rest', 'endpoint', 'request', 'api testing'],
      answer: "I test REST APIs using Postman — validating endpoints, authentication flows, response schemas, error handling, and status codes."
    },
    {
      tags: ['mobile', 'android', 'ios', 'app', 'mobile testing', 'appium'],
      answer: "I have hands-on mobile testing experience across Android and iOS — functional, regression, and performance testing on real devices and emulators."
    },
    {
      tags: ['ai', 'ml', 'artificial intelligence', 'machine learning', 'rag', 'chatbot testing', 'ai testing'],
      answer: "I've tested AI/ML systems including RAG pipelines, AI chatbots, and ML model validation — an emerging specialty of mine."
    },
    {
      tags: ['jira', 'bug tracking', 'defect management', 'sprint', 'agile', 'scrum'],
      answer: "I'm a JIRA power user — managing bug lifecycle, sprint planning, test case tracking, and defect reporting across agile projects."
    },
    {
      tags: ['manual testing', 'manual', 'functional', 'regression', 'test case', 'test plan'],
      answer: "Manual testing is my strongest area — covering functional, regression, exploratory, UAT, smoke, and sanity testing with detailed test documentation."
    },
    {
      tags: ['bugs', 'defects', 'found', 'reported', 'detected', '2500'],
      answer: "I've found and reported 2500+ defects across web, mobile, VR, and AI platforms — critical, major, minor, and cosmetic. Nothing slips past my radar! 🐛"
    },
    {
      tags: ['projects', 'portfolio', 'work done', 'built', 'created', 'what have you', 'showcased'],
      answer: "I have 9+ projects in my portfolio — including automation frameworks, AI chatbot QA, mobile test suites, API test collections, and performance testing."
    },
    {
      tags: ['contact', 'email', 'reach', 'connect', 'message', 'hire', 'available'],
      answer: "You can reach me at antonyjoshua413@gmail.com or use the Contact section on this portfolio. I'm open to exciting QA opportunities!"
    },
    {
      tags: ['location', 'where', 'city', 'live', 'based', 'chennai', 'india'],
      answer: "I'm based in Chennai, India. 📍"
    },
    {
      tags: ['resume', 'cv', 'download', 'curriculum vitae'],
      answer: "You can download my resume directly from the hero section — click the 'Download Resume' button at the top of the page!"
    },
    {
      tags: ['certification', 'certified', 'certificate', 'course', 'training'],
      answer: "I hold certifications in software testing and automation. Check the Certifications section on this portfolio for the complete list!"
    },
    {
      tags: ['vr', 'virtual reality', 'xr', 'extended reality'],
      answer: "I've tested VR/XR applications — validating immersive experiences, performance, and platform-specific behaviour across VR devices."
    },
    {
      tags: ['performance', 'load', 'stress', 'jmeter'],
      answer: "I have experience in performance and load testing, identifying bottlenecks and ensuring applications handle expected user volumes."
    },
    {
      tags: ['thank', 'thanks', 'great', 'awesome', 'cool', 'nice', 'helpful', 'good'],
      answer: "You're welcome! 😊 Feel free to ask anything else about Antony Joshua S."
    },
    {
      tags: ['bye', 'goodbye', 'see you', 'later', 'cya', 'take care'],
      answer: "Goodbye! 👋 Feel free to come back anytime if you have more questions."
    },
  ];

  function getReply(message) {
    var msg = message.toLowerCase().trim();
    var bestScore = 0;
    var bestAnswer = null;

    kb.forEach(function (item) {
      var score = 0;
      item.tags.forEach(function (tag) {
        if (msg.includes(tag)) score += tag.length;
      });
      if (score > bestScore) { bestScore = score; bestAnswer = item.answer; }
    });

    if (bestScore === 0) {
      return "Sorry, I don't have information about that. 🤔\nTry asking about Antony Joshua's skills, experience, projects, education, or contact details!";
    }
    return bestAnswer;
  }

  function buildUI() {
    // Floating toggle button
    var btn = document.createElement('button');
    btn.id = 'ajChatBtn';
    btn.setAttribute('aria-label', 'Open chat');
    btn.innerHTML =
      '<svg class="ajc-icon-chat" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
      '<svg class="ajc-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    document.body.appendChild(btn);

    // Chat window
    var win = document.createElement('div');
    win.id = 'ajChatWin';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'AJ Bot chat');
    win.innerHTML =
      '<div class="ajc-header">' +
        '<div class="ajc-hinfo">' +
          '<div class="ajc-avatar">🤖</div>' +
          '<div>' +
            '<div class="ajc-name">AJ Bot</div>' +
            '<div class="ajc-status"><span class="ajc-dot"></span>Ask me about Antony</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="ajc-msgs" id="ajChatMsgs"></div>' +
      '<div class="ajc-input-row">' +
        '<input class="ajc-input" id="ajChatInput" type="text" placeholder="Ask about skills, projects…" autocomplete="off" maxlength="200" />' +
        '<button class="ajc-send" id="ajChatSend" aria-label="Send">' +
          '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
        '</button>' +
      '</div>';
    document.body.appendChild(win);

    var msgs  = document.getElementById('ajChatMsgs');
    var input = document.getElementById('ajChatInput');
    var isOpen = false;
    var greeted = false;

    function addMsg(from, text) {
      var div = document.createElement('div');
      div.className = 'ajc-msg ajc-' + from;
      div.innerHTML = text.replace(/\n/g, '<br>');
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function showTyping() {
      var d = document.createElement('div');
      d.className = 'ajc-msg ajc-bot ajc-typing';
      d.id = 'ajcTyping';
      d.innerHTML = '<span></span><span></span><span></span>';
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function removeTyping() {
      var t = document.getElementById('ajcTyping');
      if (t) t.remove();
    }

    function send() {
      var txt = input.value.trim();
      if (!txt) return;
      addMsg('user', txt);
      input.value = '';
      showTyping();
      setTimeout(function () {
        removeTyping();
        addMsg('bot', getReply(txt));
      }, 600 + Math.random() * 500);
    }

    function toggleChat() {
      isOpen = !isOpen;
      win.classList.toggle('ajc-open', isOpen);
      btn.classList.toggle('ajc-btn-open', isOpen);
      if (isOpen) {
        if (!greeted) {
          greeted = true;
          addMsg('bot', "Hey there! 👋 I'm AJ Bot. Ask me anything about Antony Joshua S — skills, experience, projects, and more!");
        }
        setTimeout(function () { input.focus(); }, 280);
      }
    }

    btn.addEventListener('click', toggleChat);
    document.getElementById('ajChatSend').addEventListener('click', send);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });

    // Suggested quick questions
    var suggestions = ['Skills', 'Experience', 'Projects', 'Contact'];
    var sqRow = document.createElement('div');
    sqRow.className = 'ajc-suggestions';
    suggestions.forEach(function (s) {
      var chip = document.createElement('button');
      chip.className = 'ajc-chip';
      chip.textContent = s;
      chip.addEventListener('click', function () {
        input.value = s;
        send();
      });
      sqRow.appendChild(chip);
    });
    win.insertBefore(sqRow, win.querySelector('.ajc-msgs'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildUI);
  else buildUI();
})();
