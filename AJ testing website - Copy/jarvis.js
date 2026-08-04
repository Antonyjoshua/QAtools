// Jarvis HUD — injected on every page
(function () {
  const overlay = document.createElement('div');
  overlay.className = 'jarvis-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<canvas class="jarvis-canvas" id="jarvisCanvas"></canvas>' +
    '<div class="hud-corner hud-tl"></div>' +
    '<div class="hud-corner hud-tr"></div>' +
    '<div class="hud-corner hud-bl"></div>' +
    '<div class="hud-corner hud-br"></div>' +
    '<div class="jarvis-status">' +
      '<span class="jarvis-status-dot"></span>' +
      '<span>QA.SYS&nbsp;●&nbsp;ACTIVE</span>' +
    '</div>';
  document.body.prepend(overlay);

  // Particle canvas
  const canvas = document.getElementById('jarvisCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles, raf;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    cancelAnimationFrame(raf);
    const count = Math.min(Math.floor(W * H / 11000), 75);
    particles = Array.from({ length: count }, function () {
      return {
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r:  Math.random() * 1.1 + 0.4
      };
    });
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(108,99,255,' + (0.15 * (1 - d / 120)) + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(108,99,255,0.5)';
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    raf = requestAnimationFrame(loop);
  }

  resize(); init();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { resize(); init(); }, 250);
  });
})();


/*BOBREMOVED
    var CW = cv.width, CH = cv.height;
    ctx.clearRect(0, 0, CW, CH);
    var s   = 40;           // scale — matches reference proportions
    var cx2 = CW * 0.50;
    var cy2 = CH * 0.53;

    var ACC  = getAccent();
    var aHex = ACC.replace('#','');
    var aR=parseInt(aHex.slice(0,2),16)||108, aG=parseInt(aHex.slice(2,4),16)||99, aB=parseInt(aHex.slice(4,6),16)||255;

    var sway    = Math.sin(lp * 0.028) * 2.2;
    var br      = Math.sin(lp * 0.042) * 1.2;
    var blink   = (lp % 240 > 234);
    var waveAng = -Math.PI * 0.30 + Math.sin(lp * 0.050) * 0.44;
    var hb      = Math.sin(lp * 0.034) * 0.8;

    // Goggle geometry — two separate round circles, matching reference
    var gCY = -s*0.58;  // high on face (Bob has minimal forehead)
    var gRO = s*0.33;   // outer metallic rim radius
    var gRI = s*0.28;   // glass / lens radius
    var gEX = s*0.42;   // each lens centre X offset from body centre
    // bridge gap between inner edges: 2*(gEX-gRO) = 7.2 px

    // Waving hand in world coordinates (drawn after ctx.restore)
    var rHX = cx2 + sway + s*0.62 + Math.cos(waveAng)*s*0.98;
    var rHY = cy2 + br   - s*0.03 + Math.sin(waveAng)*s*0.98;

    ctx.save();
    ctx.translate(cx2 + sway, cy2 + br);

    // ── 1. GROUND SHADOW ─────────────────────────────────────────────
    ctx.beginPath();
    ctx.ellipse(0, s*1.15, s*0.84, s*0.12, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fill();

    // ── 2. SHOES ─────────────────────────────────────────────────────
    [[-s*0.36,-1],[s*0.36,1]].forEach(function(f) {
      ctx.beginPath();
      ctx.ellipse(f[0]+f[1]*s*0.09, s*1.07, s*0.32, s*0.14, 0, 0, Math.PI*2);
      ctx.fillStyle = '#1A1A1A'; ctx.fill();
      ctx.beginPath();
      ctx.ellipse(f[0]-s*0.09, s*1.03, s*0.14, s*0.06, 0, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,0.13)'; ctx.fill();
    });

    // ── 3. BODY — bright yellow, very round (reference: near-sphere) ─
    var bodyG = ctx.createRadialGradient(-s*0.34,-s*0.44,s*0.04, s*0.06,s*0.05,s*1.36);
    bodyG.addColorStop(0,   '#FFFDE0');
    bodyG.addColorStop(0.12,'#FFEE55');
    bodyG.addColorStop(0.52,'#FFD018');
    bodyG.addColorStop(1,   '#976C00');
    ctx.beginPath();
    ctx.ellipse(0, 0, s*0.92, s*1.05, 0, 0, Math.PI*2);
    ctx.fillStyle = bodyG; ctx.fill();
    ctx.strokeStyle = '#8A6000'; ctx.lineWidth = 2.2; ctx.stroke();
    // Top-left specular sheen
    ctx.beginPath();
    ctx.ellipse(-s*0.36,-s*0.54,s*0.36,s*0.19,-0.40,0,Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.26)'; ctx.fill();

    // ── 4. OVERALLS — light sky-blue denim, clipped to body ──────────
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 0, s*0.90, s*1.03, 0, 0, Math.PI*2);
    ctx.clip();
    var denG = ctx.createLinearGradient(0, s*0.20, 0, s*1.14);
    denG.addColorStop(0,   '#7498E2');   // lighter blue — matches reference
    denG.addColorStop(0.44,'#5378C0');
    denG.addColorStop(1,   '#374E90');
    ctx.fillStyle = denG;
    ctx.fillRect(-s, s*0.20, s*2, s);
    ctx.fillStyle = 'rgba(255,255,255,0.09)';
    ctx.fillRect(-s*0.42, s*0.26, s*0.22, s*0.80);
    ctx.restore();

    // ── 5. BIB (front chest panel) ───────────────────────────────────
    var bibG = ctx.createLinearGradient(0, s*0.08, 0, s*0.50);
    bibG.addColorStop(0,'#789AE4');
    bibG.addColorStop(1,'#3C5692');
    ctx.fillStyle = bibG;
    ctx.fillRect(-s*0.29, s*0.08, s*0.58, s*0.44);
    ctx.strokeStyle = '#8AAEF2'; ctx.lineWidth = 1.6;
    ctx.strokeRect(-s*0.29, s*0.08, s*0.58, s*0.44);
    // Bib stitch
    ctx.setLineDash([2,3]);
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 0.9;
    ctx.strokeRect(-s*0.24, s*0.13, s*0.48, s*0.34);
    ctx.setLineDash([]);
    // Minion G logo: circle + horizontal bar (exact reference detail)
    ctx.beginPath(); ctx.arc(0, s*0.38, s*0.11, 0, Math.PI*2);
    ctx.strokeStyle = '#A2C4FA'; ctx.lineWidth = 2.4; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s*0.080, s*0.38); ctx.lineTo(s*0.080, s*0.38);
    ctx.strokeStyle = '#A2C4FA'; ctx.lineWidth = 2.4; ctx.stroke();

    // ── 6. SUSPENDER STRAPS (over shoulders) ─────────────────────────
    [[-s*0.22, 0],[s*0.08, 0]].forEach(function(st) {
      var sg = ctx.createLinearGradient(st[0], 0, st[0]+s*0.15, 0);
      sg.addColorStop(0,'#4A6AAC'); sg.addColorStop(0.5,'#6A8AD4'); sg.addColorStop(1,'#4A6AAC');
      ctx.fillStyle = sg;
      ctx.fillRect(st[0], -s*0.82, s*0.15, s*0.74);
      ctx.fillStyle = 'rgba(255,255,255,0.17)';
      ctx.fillRect(st[0]+s*0.02, -s*0.82, s*0.04, s*0.74);
    });

    // ── 7. GOGGLE STRAP (wide gray elastic band, behind goggle rings) ─
    var gsG = ctx.createLinearGradient(0, gCY-s*0.15, 0, gCY+s*0.15);
    gsG.addColorStop(0,'#787878'); gsG.addColorStop(0.5,'#C0C0C0'); gsG.addColorStop(1,'#585858');
    ctx.fillStyle = gsG;
    ctx.fillRect(-s*0.98, gCY-s*0.14, s*1.96, s*0.28);

    // ── 8. GOGGLE FRAMES — two separate metallic circles ─────────────
    var mSG = ctx.createLinearGradient(0, gCY-gRO, 0, gCY+gRO);
    mSG.addColorStop(0,'#D8D8D8'); mSG.addColorStop(0.32,'#F4F4F4'); mSG.addColorStop(1,'#888888');

    [-gEX, gEX].forEach(function(ex) {
      // Drop shadow
      ctx.beginPath(); ctx.arc(ex+1.5, gCY+2.5, gRO, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.fill();
      // Metallic rim fill
      ctx.beginPath(); ctx.arc(ex, gCY, gRO, 0, Math.PI*2);
      ctx.fillStyle = mSG; ctx.fill();
      // Top-half specular (3-D rim illusion)
      ctx.save();
      ctx.beginPath(); ctx.arc(ex, gCY, gRO, Math.PI, 0);
      ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fill();
      ctx.restore();
      // Inner dark frame body
      ctx.beginPath(); ctx.arc(ex, gCY, gRO-2, 0, Math.PI*2);
      ctx.fillStyle = '#0E0E0E'; ctx.fill();
    });

    // ── 9. BRIDGE connecting the two goggle circles ───────────────────
    var bHW = gEX - gRO;  // half-width of gap = 3.6 px
    ctx.fillStyle = '#C2C2C2';
    ctx.fillRect(-bHW-1, gCY-s*0.14, (bHW+1)*2, s*0.28);
    ctx.fillStyle = 'rgba(255,255,255,0.26)';
    ctx.fillRect(-bHW, gCY-s*0.06, bHW*2, s*0.10);

    // ── 10. ACCENT GLOW around each goggle rim ────────────────────────
    ctx.save();
    ctx.shadowColor = ACC; ctx.shadowBlur = 8;
    ctx.strokeStyle = ACC; ctx.lineWidth = 1.6;
    [-gEX, gEX].forEach(function(ex) {
      ctx.beginPath(); ctx.arc(ex, gCY, gRO, 0, Math.PI*2); ctx.stroke();
    });
    ctx.restore();

    // ── 11. EYE LENSES — glass + large iris + pupil + dual shine ─────
    // Left: hazel-amber  |  Right: olive-green  (Bob's heterochromia)
    [[-gEX,'#7A4008','#C07830','#E8A840'],
     [ gEX,'#1A5218','#3C7830','#66B050']].forEach(function(e) {
      var ex=e[0], iD=e[1], iM=e[2], iH=e[3];

      // Glass (blue-tinted)
      var lG = ctx.createRadialGradient(ex-gRI*0.42, gCY-gRI*0.42, gRI*0.04, ex, gCY, gRI);
      lG.addColorStop(0,'#E4F4FF'); lG.addColorStop(0.38,'#98CEEE'); lG.addColorStop(1,'#3A84B6');
      ctx.beginPath(); ctx.arc(ex, gCY, gRI, 0, Math.PI*2);
      ctx.fillStyle = lG; ctx.fill();

      if (blink) {
        ctx.beginPath();
        ctx.moveTo(ex-gRI*0.92, gCY+gRI*0.05);
        ctx.quadraticCurveTo(ex, gCY+gRI*0.54, ex+gRI*0.92, gCY+gRI*0.05);
        ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke();
        return;
      }

      // Iris — very large (dominant feature in reference)
      var iG = ctx.createRadialGradient(ex-s*0.08, gCY-s*0.08, s*0.01, ex, gCY, gRI*0.76);
      iG.addColorStop(0, iH); iG.addColorStop(0.50, iM); iG.addColorStop(1, iD);
      ctx.beginPath(); ctx.arc(ex, gCY, gRI*0.76, 0, Math.PI*2);
      ctx.fillStyle = iG; ctx.fill();

      // Pupil
      ctx.beginPath(); ctx.arc(ex, gCY, gRI*0.36, 0, Math.PI*2);
      ctx.fillStyle = '#020202'; ctx.fill();

      // Large top-left shine
      ctx.beginPath(); ctx.arc(ex-gRI*0.40, gCY-gRI*0.40, gRI*0.24, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,0.97)'; ctx.fill();
      // Small secondary shine
      ctx.beginPath(); ctx.arc(ex+gRI*0.22, gCY+gRI*0.18, gRI*0.11, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,0.56)'; ctx.fill();

      // Lens glass rim
      ctx.beginPath(); ctx.arc(ex, gCY, gRI, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 2; ctx.stroke();
    });

    // ── 12. NOSE (small rounded bump, below goggles, above bib) ──────
    var nG2 = ctx.createRadialGradient(-s*0.05,-s*0.14,0, 0,-s*0.10,s*0.16);
    nG2.addColorStop(0,'#FFEE70'); nG2.addColorStop(0.60,'#D4AA00'); nG2.addColorStop(1,'#8A6600');
    ctx.beginPath(); ctx.ellipse(0, -s*0.12, s*0.14, s*0.11, 0, 0, Math.PI*2);
    ctx.fillStyle = nG2; ctx.fill();
    ctx.strokeStyle = '#7A5800'; ctx.lineWidth = 0.9; ctx.stroke();

    // ── 13. MOUTH — wide happy grin with 4 visible teeth ─────────────
    ctx.beginPath();
    ctx.arc(0, s*0.06, s*0.36, 0.12, Math.PI-0.12);
    ctx.strokeStyle = '#2A1200'; ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.stroke();
    // White teeth fill
    ctx.beginPath();
    ctx.arc(0, s*0.06, s*0.315, 0.19, Math.PI-0.19);
    ctx.fillStyle = '#FFFFF6'; ctx.fill();
    // 3 tooth dividers = 4 teeth (matching reference)
    ctx.strokeStyle = 'rgba(0,0,0,0.13)'; ctx.lineWidth = 1.5;
    [-s*0.14, 0, s*0.14].forEach(function(tx) {
      ctx.beginPath(); ctx.moveTo(tx, s*0.000); ctx.lineTo(tx, s*0.100); ctx.stroke();
    });
    // Corner smile dimples
    [-1,1].forEach(function(sd) {
      ctx.beginPath(); ctx.arc(sd*s*0.31, s*0.14, s*0.04, 0, Math.PI*2);
      ctx.fillStyle = '#C07840'; ctx.fill();
    });

    // ── 14. HAIR — only 2 sparse dark strands (Bob barely has hair) ──
    [{x:-s*0.07,h:s*0.22},{x:s*0.08,h:s*0.17}].forEach(function(hd) {
      var hG = ctx.createLinearGradient(hd.x,-s*1.02-hd.h-hb, hd.x,-s*0.97);
      hG.addColorStop(0,'#3A3A3A'); hG.addColorStop(1,'#0C0C0C');
      ctx.beginPath();
      ctx.moveTo(hd.x-s*0.09, -s*0.97);
      ctx.lineTo(hd.x+s*0.01, -s*1.02-hd.h-hb);
      ctx.lineTo(hd.x+s*0.09, -s*0.96);
      ctx.fillStyle = hG; ctx.fill();
    });

    // ── 15. LEFT ARM + FIST (short chubby, angled out) ───────────────
    var lAX=-s*0.95, lAY=s*0.30;
    ctx.beginPath();
    ctx.moveTo(-s*0.78, -s*0.06);
    ctx.quadraticCurveTo(-s*1.10, s*0.12, lAX, lAY);
    ctx.strokeStyle = '#FFD020'; ctx.lineWidth = s*0.32; ctx.lineCap = 'round'; ctx.stroke();
    ctx.strokeStyle = '#9A7000'; ctx.lineWidth = 2.2; ctx.stroke();
    var lfG = ctx.createRadialGradient(lAX-s*0.07,lAY-s*0.07,s*0.02, lAX,lAY,s*0.22);
    lfG.addColorStop(0,'#FFE860'); lfG.addColorStop(1,'#C08800');
    ctx.beginPath(); ctx.arc(lAX, lAY, s*0.22, 0, Math.PI*2);
    ctx.fillStyle = lfG; ctx.fill(); ctx.strokeStyle = '#8A6200'; ctx.lineWidth = 1.5; ctx.stroke();
    [-s*0.10,0,s*0.10].forEach(function(fx) {
      ctx.beginPath(); ctx.arc(lAX+fx, lAY-s*0.20, s*0.09, Math.PI, 0);
      ctx.fillStyle = '#FFD020'; ctx.fill();
      ctx.strokeStyle = '#8A6200'; ctx.lineWidth = 1; ctx.stroke();
    });

    // ── 16. RIGHT ARM (waving up) ─────────────────────────────────────
    var rMX=s*0.98+Math.cos(waveAng)*s*0.46, rMY=-s*0.22+Math.sin(waveAng)*s*0.46;
    ctx.beginPath();
    ctx.moveTo(s*0.78, -s*0.06);
    ctx.quadraticCurveTo(rMX, rMY,
      s*0.62+Math.cos(waveAng)*s*0.98, -s*0.04+Math.sin(waveAng)*s*0.98);
    ctx.strokeStyle = '#FFD020'; ctx.lineWidth = s*0.32; ctx.lineCap = 'round'; ctx.stroke();
    ctx.strokeStyle = '#9A7000'; ctx.lineWidth = 2.2; ctx.stroke();

    ctx.restore();

    // ── 17. WAVING FIST (world coords, after restore) ─────────────────
    var rfG = ctx.createRadialGradient(rHX-s*0.07,rHY-s*0.07,s*0.02, rHX,rHY,s*0.22);
    rfG.addColorStop(0,'#FFE860'); rfG.addColorStop(1,'#C08800');
    ctx.beginPath(); ctx.arc(rHX, rHY, s*0.22, 0, Math.PI*2);
    ctx.fillStyle = rfG; ctx.fill(); ctx.strokeStyle = '#8A6200'; ctx.lineWidth = 1.5; ctx.stroke();
    [-s*0.10,0,s*0.10].forEach(function(fx) {
      ctx.beginPath(); ctx.arc(rHX+fx, rHY-s*0.22, s*0.09, Math.PI, 0);
      ctx.fillStyle = '#FFD020'; ctx.fill();
      ctx.strokeStyle = '#8A6200'; ctx.lineWidth = 1; ctx.stroke();
    });

    // ── 18. ACCENT GLOW under feet ────────────────────────────────────
    ctx.save();
    ctx.shadowColor = 'rgba('+aR+','+aG+','+aB+',0.55)'; ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.ellipse(cx2+sway, cy2+br+s*1.14, s*0.72, s*0.09, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba('+aR+','+aG+','+aB+',0.11)'; ctx.fill();
    ctx.restore();
  }

  function animLoop() {
    lp++;
    drawBob(lp);
    requestAnimationFrame(animLoop);
  }
  animLoop();

  // Slide in after 0.7 s
  setTimeout(function() { wdg.classList.add('bob-show'); }, 700);

  // Dismiss button
  var closeBtn = document.getElementById('bob-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      wdg.classList.remove('bob-show');
    });
  }
  } // end initBob

*/ // end BOBREMOVED

// ── Accent color picker + SVG bug recoloring ──────────────────────────────────
(function () {
  var palettes = [
    { name: 'Purple', a: '#6c63ff', a2: '#a78bfa' },
    { name: 'Cyan',   a: '#06b6d4', a2: '#22d3ee' },
    { name: 'Emerald',a: '#10b981', a2: '#34d399' },
    { name: 'Yellow', a: '#eab308', a2: '#fde047' },
    { name: 'Orange', a: '#f97316', a2: '#fb923c' },
    { name: 'Rose',   a: '#f43f5e', a2: '#fb7185' },
    { name: 'Violet', a: '#8b5cf6', a2: '#c4b5fd' },
  ];

  // Converts hex + opacity to rgba string
  function ha(hex, op) {
    var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return 'rgba('+r+','+g+','+b+','+op+')';
  }

  // Recolor both SVG bugs (hero + bug-about) whenever accent changes.
  // Stores original colors on first call so subsequent changes always work correctly.
  function recolorSvgBugs(a, a2) {
    var svgs = document.querySelectorAll('.hero-bug-svg, .bug-svg-h, .bug-robot-svg');
    svgs.forEach(function(svg) {
      // Gradient stops
      svg.querySelectorAll('stop').forEach(function(s) {
        if (!s.dataset.origStopColor) s.dataset.origStopColor = s.getAttribute('stop-color') || '';
        if (s.dataset.origStopColor === '#6c63ff') s.setAttribute('stop-color', a);
      });
      // All child elements — compare against stored originals, not current values
      svg.querySelectorAll('*').forEach(function(el) {
        var fill   = el.getAttribute('fill');
        var stroke = el.getAttribute('stroke');
        if (fill   && !el.dataset.origFill)   el.dataset.origFill   = fill;
        if (stroke && !el.dataset.origStroke) el.dataset.origStroke = stroke;

        var of = el.dataset.origFill;
        var os = el.dataset.origStroke;

        if (of) {
          if (of === '#6c63ff') { el.setAttribute('fill', a); }
          else if (of === '#a78bfa' || of === '#c4b5fd') { el.setAttribute('fill', a2); }
          else {
            var m = of.match(/rgba?\(\s*108\s*,\s*99\s*,\s*255\s*(?:,\s*([\d.]+))?\s*\)/);
            if (m) el.setAttribute('fill', ha(a, m[1] !== undefined ? parseFloat(m[1]) : 1));
          }
        }
        if (os) {
          if (os === '#6c63ff') { el.setAttribute('stroke', a); }
          else if (os === '#a78bfa') { el.setAttribute('stroke', a2); }
          else {
            var ms = os.match(/rgba?\(\s*108\s*,\s*99\s*,\s*255\s*(?:,\s*([\d.]+))?\s*\)/);
            if (ms) el.setAttribute('stroke', ha(a, ms[1] !== undefined ? parseFloat(ms[1]) : 1));
          }
        }
      });
    });
  }

  function hexToRgb(hex) {
    return parseInt(hex.slice(1,3),16) + ',' + parseInt(hex.slice(3,5),16) + ',' + parseInt(hex.slice(5,7),16);
  }

  function applyPalette(a, a2, skipSvg) {
    document.documentElement.style.setProperty('--accent',     a);
    document.documentElement.style.setProperty('--accent2',    a2);
    document.documentElement.style.setProperty('--accent-rgb', hexToRgb(a));
    document.body.style.setProperty('--accent',  a);
    document.body.style.setProperty('--accent2', a2);
    localStorage.setItem('aj-accent',  a);
    localStorage.setItem('aj-accent2', a2);
    document.querySelectorAll('.cp-dot').forEach(function(d) {
      d.classList.toggle('cp-active', d.dataset.a === a);
    });
    if (!skipSvg) recolorSvgBugs(a, a2);
  }

  // Restore saved on load (SVG recolor happens after DOM is ready)
  var sa  = localStorage.getItem('aj-accent');
  var sa2 = localStorage.getItem('aj-accent2');
  if (sa) {
    document.documentElement.style.setProperty('--accent',     sa);
    document.documentElement.style.setProperty('--accent2',    sa2 || '#a78bfa');
    document.documentElement.style.setProperty('--accent-rgb', hexToRgb(sa));
    document.body.style.setProperty('--accent',  sa);
    document.body.style.setProperty('--accent2', sa2 || '#a78bfa');
  }

  function init() {
    // Recolor SVGs with saved palette (DOM is now ready)
    if (sa) recolorSvgBugs(sa, sa2 || '#a78bfa');

    var themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;
    var activeA = sa || '#6c63ff';

    var wrap = document.createElement('div');
    wrap.className = 'cp-wrap';
    wrap.innerHTML =
      '<button class="cp-btn" title="Color theme" aria-label="Change accent color">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">' +
          '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74' +
          '-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42' +
          '-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12z' +
          'm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67' +
          '-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zM17.5 12c-.83 0-1.5-.67-1.5-1.5' +
          'S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>' +
        '</svg>' +
      '</button>' +
      '<div class="cp-palette" role="listbox" aria-label="Accent colors">' +
        palettes.map(function(p) {
          return '<button class="cp-dot' + (p.a === activeA ? ' cp-active' : '') + '" ' +
                 'data-a="' + p.a + '" data-a2="' + p.a2 + '" ' +
                 'style="--dc:' + p.a + '" title="' + p.name + '" role="option"></button>';
        }).join('') +
      '</div>';

    themeBtn.parentNode.insertBefore(wrap, themeBtn);

    var palette = wrap.querySelector('.cp-palette');
    var cpBtn   = wrap.querySelector('.cp-btn');
    var open    = false;

    function toggleOpen(v) { open = v; palette.classList.toggle('cp-open', open); cpBtn.classList.toggle('cp-active-btn', open); }
    cpBtn.addEventListener('click', function(e) { e.stopPropagation(); toggleOpen(!open); });
    wrap.addEventListener('click', function(e) {
      var dot = e.target.closest('.cp-dot');
      if (!dot) return;
      applyPalette(dot.dataset.a, dot.dataset.a2);
      toggleOpen(false);
    });
    document.addEventListener('click', function() { if (open) toggleOpen(false); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// ── Font picker ───────────────────────────────────────────────────────────────
(function () {
  var fonts = [
    { name: 'Inter',         family: "'Inter', sans-serif",         url: 'Inter:wght@300;400;500;600;700' },
    { name: 'Poppins',       family: "'Poppins', sans-serif",       url: 'Poppins:wght@300;400;500;600;700' },
    { name: 'Space Grotesk', family: "'Space+Grotesk', sans-serif", url: 'Space+Grotesk:wght@300;400;500;600;700' },
    { name: 'DM Sans',       family: "'DM+Sans', sans-serif",       url: 'DM+Sans:wght@300;400;500;600;700' },
    { name: 'Nunito',        family: "'Nunito', sans-serif",        url: 'Nunito:wght@300;400;500;600;700' },
    { name: 'Raleway',       family: "'Raleway', sans-serif",       url: 'Raleway:wght@300;400;500;600;700' },
  ];

  // Load all font options upfront
  var gfLink = document.createElement('link');
  gfLink.rel = 'stylesheet';
  gfLink.href = 'https://fonts.googleapis.com/css2?family=' +
    fonts.map(function (f) { return f.url; }).join('&family=') + '&display=swap';
  document.head.appendChild(gfLink);

  // Restore saved font immediately (before DOM ready)
  var savedFamily = localStorage.getItem('aj-font') || fonts[0].family;
  document.documentElement.style.setProperty('--font-body', savedFamily);

  function applyFont(family) {
    document.documentElement.style.setProperty('--font-body', family);
    localStorage.setItem('aj-font', family);
    document.querySelectorAll('.fp-opt').forEach(function (btn) {
      btn.classList.toggle('fp-active', btn.dataset.family === family);
    });
  }

  function init() {
    var themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;

    var wrap = document.createElement('div');
    wrap.className = 'fp-wrap';
    wrap.innerHTML =
      '<button class="fp-btn" title="Font style" aria-label="Change font style">Aa</button>' +
      '<div class="fp-panel">' +
        fonts.map(function (f) {
          return '<button class="fp-opt' + (f.family === savedFamily ? ' fp-active' : '') + '" ' +
                 'data-family="' + f.family + '" ' +
                 'style="font-family:' + f.family + '">' + f.name + '</button>';
        }).join('') +
      '</div>';

    themeBtn.parentNode.insertBefore(wrap, themeBtn);

    var panel  = wrap.querySelector('.fp-panel');
    var fpBtn  = wrap.querySelector('.fp-btn');
    var open   = false;

    function toggleOpen(v) {
      open = v;
      panel.classList.toggle('fp-open', open);
      fpBtn.classList.toggle('fp-btn-active', open);
    }

    fpBtn.addEventListener('click', function (e) { e.stopPropagation(); toggleOpen(!open); });
    panel.addEventListener('click', function (e) {
      var opt = e.target.closest('.fp-opt');
      if (!opt) return;
      applyFont(opt.dataset.family);
      toggleOpen(false);
    });
    document.addEventListener('click', function () { if (open) toggleOpen(false); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// ── Scroll reveal animations ──────────────────────────────────────────────────
(function () {
  if (!window.IntersectionObserver) return;

  function setup() {
    var rules = [
      ['.section-title',   'up'   ],
      ['.bug-intro-text',  'up'   ],
      ['.about-text',      'left' ],
      ['.about-details',   'right'],
      ['.detail-card',     'up'   ],
      ['.stat',            'up'   ],
      ['.timeline-item',   'up'   ],
      ['.project-card',    'up'   ],
      ['.skill-group',     'up'   ],
      ['.cert-card',       'up'   ],
    ];

    // Unique ID counter for parent elements (avoids toString() collision)
    var uid = 0;
    var marked = new Set();
    var parentGroups = {}; // parentUid → [elements]

    rules.forEach(function(rule) {
      document.querySelectorAll(rule[0]).forEach(function(el) {
        if (marked.has(el)) return;
        marked.add(el);
        el.setAttribute('data-reveal', rule[1]);

        // Group siblings for stagger using a uid on the parent
        var p = el.parentNode;
        if (!p._rvUid) p._rvUid = ++uid;
        var key = p._rvUid;
        if (!parentGroups[key]) parentGroups[key] = [];
        parentGroups[key].push(el);
      });
    });

    // Apply stagger delays within each parent group
    Object.keys(parentGroups).forEach(function(key) {
      parentGroups[key].forEach(function(el, i) {
        el.style.transitionDelay = (Math.min(i, 6) * 85) + 'ms';
      });
    });

    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(function(el) {
      var rect = el.getBoundingClientRect();
      var alreadyVisible = rect.top < window.innerHeight - 10 && rect.bottom > 0;
      if (alreadyVisible) {
        // Reveal immediately (no animation) for above-fold content
        el.style.transition = 'none';
        el.classList.add('revealed');
        // Re-enable transition after paint so future interactions still work
        requestAnimationFrame(function() { el.style.transition = ''; });
      } else {
        io.observe(el);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
