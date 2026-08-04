// ===== Premium Background Scene =====
(function () {
  'use strict';

  // ── Canvas setup ────────────────────────────────────────────────────────
  var canvas = document.createElement('canvas');
  canvas.id = 'bgScene';
  canvas.style.cssText = [
    'position:fixed', 'inset:0', 'width:100%', 'height:100%',
    'z-index:0', 'pointer-events:none', 'display:block'
  ].join(';');
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, dpr = 1;
  var mouse = { x: 0, y: 0 };
  var rawMX = 0, rawMY = 0;
  var time = 0;
  var raf;

  // roundRect polyfill (Safari < 15.4)
  if (!ctx.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      r = Math.min(+r || 0, w / 2, h / 2);
      this.moveTo(x + r, y);
      this.lineTo(x + w - r, y);
      this.arcTo(x + w, y, x + w, y + r, r);
      this.lineTo(x + w, y + h - r);
      this.arcTo(x + w, y + h, x + w - r, y + h, r);
      this.lineTo(x + r, y + h);
      this.arcTo(x, y + h, x, y + h - r, r);
      this.lineTo(x, y + r);
      this.arcTo(x, y, x + r, y, r);
      this.closePath();
    };
  }

  // ── Color helpers ───────────────────────────────────────────────────────
  function getAccent() {
    return (getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6c63ff');
  }
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    return { r: parseInt(hex.slice(0,2),16), g: parseInt(hex.slice(2,4),16), b: parseInt(hex.slice(4,6),16) };
  }
  function accentRgba(alpha) {
    var c = hexToRgb(getAccent());
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + alpha + ')';
  }
  function isLight() { return document.body.classList.contains('light'); }

  // ── RNG helpers ─────────────────────────────────────────────────────────
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // ── Element pool ─────────────────────────────────────────────────────────
  // Only testing & QA related element types
  var TYPES = ['bug','browser','playwright','api','terminal','git','circuit','bug','browser','playwright'];
  var elements = [];
  var particles = [];

  function scatterPos() {
    // Distribute elements toward edges, keeping center clear
    var zone = Math.random();
    var x, y;
    if (zone < 0.28)      { x = rnd(0.02, 0.18); y = rnd(0.04, 0.96); }   // left
    else if (zone < 0.56) { x = rnd(0.82, 0.98); y = rnd(0.04, 0.96); }   // right
    else if (zone < 0.72) { x = rnd(0.18, 0.82); y = rnd(0.02, 0.16); }   // top
    else if (zone < 0.86) { x = rnd(0.18, 0.82); y = rnd(0.84, 0.98); }   // bottom
    else                  { x = rnd(0.02, 0.98); y = rnd(0.02, 0.98); }    // scatter
    return { x: x, y: y };
  }

  function buildPool() {
    var isMobile = W < 768;
    var count = isMobile ? 18 : Math.min(Math.floor(W * H / 12000), 55);
    elements = [];
    for (var i = 0; i < count; i++) {
      var p = scatterPos();
      elements.push({
        type:     pick(TYPES),
        x: p.x,  y: p.y,
        size:     rnd(isMobile ? 10 : 12, isMobile ? 22 : 30),
        op:       rnd(0.055, 0.175),
        speed:    rnd(0.15, 0.6),
        phase:    Math.random() * Math.PI * 2,
        rotSpd:   rnd(-0.002, 0.002),
        rot:      Math.random() * Math.PI * 2,
        layer:    Math.floor(Math.random() * 3)        // 0=far 1=mid 2=near
      });
    }
    var pc = isMobile ? 40 : Math.min(Math.floor(W * H / 5500), 130);
    particles = [];
    for (var j = 0; j < pc; j++) {
      particles.push({
        x:     Math.random(),
        y:     Math.random(),
        size:  rnd(0.6, 2.2),
        op:    rnd(0.04, 0.14),
        speed: rnd(0.1, 0.45),
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  // ── Draw: code brackets {} ───────────────────────────────────────────────
  function drawBrackets(cx, cy, s, op, acc) {
    ctx.save();
    ctx.globalAlpha = op;
    ctx.strokeStyle = acc;
    ctx.lineWidth = s * 0.09;
    ctx.lineCap = 'round';
    var h = s * 1.3, arm = s * 0.4, nub = s * 0.15;
    [-1, 1].forEach(function (side) {
      var bx = cx + side * s * 0.12;
      ctx.beginPath();
      ctx.moveTo(bx, cy - h / 2);
      ctx.lineTo(bx + side * arm, cy - h / 2);
      ctx.moveTo(bx + side * arm, cy - h / 2);
      ctx.quadraticCurveTo(bx + side * (arm + nub), cy - h * 0.3, bx + side * (arm + nub * 1.5), cy);
      ctx.quadraticCurveTo(bx + side * (arm + nub), cy + h * 0.3, bx + side * arm, cy + h / 2);
      ctx.moveTo(bx + side * arm, cy + h / 2);
      ctx.lineTo(bx, cy + h / 2);
      ctx.stroke();
    });
    ctx.restore();
  }

  // ── Draw: terminal window ────────────────────────────────────────────────
  function drawTerminal(cx, cy, s, op, acc) {
    ctx.save();
    ctx.globalAlpha = op;
    var w = s * 2.4, h = s * 1.7, r = s * 0.14;
    ctx.strokeStyle = acc;
    ctx.lineWidth = s * 0.07;
    ctx.beginPath(); ctx.roundRect(cx - w/2, cy - h/2, w, h, r); ctx.stroke();
    // Title bar divider
    ctx.beginPath();
    ctx.moveTo(cx - w/2 + r, cy - h/2 + s*0.38);
    ctx.lineTo(cx + w/2 - r, cy - h/2 + s*0.38);
    ctx.stroke();
    // Traffic lights
    var tls = ['rgba(255,95,87,0.75)', 'rgba(255,188,46,0.75)', 'rgba(40,200,64,0.75)'];
    tls.forEach(function (c, i) {
      ctx.beginPath();
      ctx.arc(cx - w/2 + s*0.22 + i*s*0.28, cy - h/2 + s*0.19, s*0.08, 0, Math.PI*2);
      ctx.fillStyle = c; ctx.fill();
    });
    // Prompt lines
    var lineY = cy - h/2 + s*0.62;
    var lens = [0.75, 0.55, 0.65, 0.42];
    ctx.lineWidth = s * 0.055;
    ctx.strokeStyle = accentRgba(0.45);
    lens.forEach(function (len) {
      ctx.beginPath();
      ctx.moveTo(cx - w/2 + s*0.22, lineY);
      ctx.lineTo(cx - w/2 + s*0.22 + (w - s*0.44) * len, lineY);
      ctx.stroke();
      lineY += s * 0.24;
    });
    ctx.restore();
  }

  // ── Draw: browser tab ────────────────────────────────────────────────────
  function drawBrowser(cx, cy, s, op, acc) {
    ctx.save();
    ctx.globalAlpha = op;
    var w = s*2.6, h = s*1.8, r = s*0.14;
    ctx.strokeStyle = acc;
    ctx.lineWidth = s * 0.07;
    ctx.beginPath(); ctx.roundRect(cx - w/2, cy - h/2, w, h, r); ctx.stroke();
    // Tab strip
    var tabY = cy - h/2 + s*0.42;
    ctx.beginPath(); ctx.moveTo(cx - w/2 + r, tabY); ctx.lineTo(cx + w/2 - r, tabY); ctx.stroke();
    // Active tab
    ctx.fillStyle = accentRgba(0.14);
    ctx.beginPath(); ctx.roundRect(cx - w/2 + s*0.12, cy - h/2 + s*0.06, s*0.65, s*0.32, s*0.07); ctx.fill(); ctx.stroke();
    // Address bar
    ctx.beginPath(); ctx.roundRect(cx - w/2 + s*0.18, tabY + s*0.08, w - s*0.36, s*0.28, s*0.1); ctx.stroke();
    // Content lines
    ctx.strokeStyle = accentRgba(0.3);
    ctx.lineWidth = s * 0.05;
    var ly = tabY + s*0.52;
    [0.72, 0.58, 0.66, 0.44].forEach(function (len) {
      ctx.beginPath();
      ctx.moveTo(cx - w/2 + s*0.22, ly);
      ctx.lineTo(cx - w/2 + s*0.22 + (w - s*0.44)*len, ly);
      ctx.stroke(); ly += s*0.22;
    });
    ctx.restore();
  }

  // ── Draw: isometric cube ─────────────────────────────────────────────────
  function drawCube(cx, cy, s, op, acc) {
    ctx.save();
    ctx.globalAlpha = op;
    ctx.strokeStyle = acc;
    ctx.lineWidth = s * 0.08;
    ctx.lineJoin = 'round';
    var hs = s * 0.7, ox = hs * 0.58, oy = hs * 0.32;
    // Face edges
    var faces = [
      [[0,-hs],[ox,-hs+oy],[ox,oy],[0,hs]],       // right
      [[0,-hs],[-ox,-hs+oy],[-ox,oy],[0,hs]],      // left
      [[0,-hs],[ox,-hs+oy],[0,-hs+oy*2],[-ox,-hs+oy]] // top
    ];
    faces.forEach(function (pts) {
      ctx.beginPath();
      pts.forEach(function (p, i) {
        i === 0 ? ctx.moveTo(cx+p[0], cy+p[1]) : ctx.lineTo(cx+p[0], cy+p[1]);
      });
      ctx.closePath(); ctx.stroke();
    });
    // Glow fill on top face
    var grd = ctx.createLinearGradient(cx-ox, cy-hs+oy, cx+ox, cy+oy*2);
    grd.addColorStop(0, accentRgba(0.14)); grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(cx, cy-hs); ctx.lineTo(cx+ox, cy-hs+oy);
    ctx.lineTo(cx, cy-hs+oy*2); ctx.lineTo(cx-ox, cy-hs+oy);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  // ── Draw: hexagon ────────────────────────────────────────────────────────
  function drawHex(cx, cy, s, op, acc) {
    ctx.save();
    ctx.globalAlpha = op;
    ctx.strokeStyle = acc;
    // Outer
    ctx.lineWidth = s * 0.08;
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      var a = i/6*Math.PI*2 - Math.PI/6;
      i === 0 ? ctx.moveTo(cx+Math.cos(a)*s, cy+Math.sin(a)*s)
              : ctx.lineTo(cx+Math.cos(a)*s, cy+Math.sin(a)*s);
    }
    ctx.closePath(); ctx.stroke();
    // Inner
    ctx.globalAlpha = op * 0.45;
    ctx.lineWidth = s * 0.05;
    ctx.beginPath();
    for (var j = 0; j < 6; j++) {
      var a2 = j/6*Math.PI*2 - Math.PI/6;
      j === 0 ? ctx.moveTo(cx+Math.cos(a2)*s*0.5, cy+Math.sin(a2)*s*0.5)
              : ctx.lineTo(cx+Math.cos(a2)*s*0.5, cy+Math.sin(a2)*s*0.5);
    }
    ctx.closePath(); ctx.stroke();
    // Spokes
    ctx.globalAlpha = op * 0.25; ctx.lineWidth = s * 0.04;
    for (var k = 0; k < 6; k++) {
      var a3 = k/6*Math.PI*2 - Math.PI/6;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx+Math.cos(a3)*s, cy+Math.sin(a3)*s); ctx.stroke();
    }
    ctx.restore();
  }

  // ── Draw: wireframe sphere ───────────────────────────────────────────────
  function drawSphere(cx, cy, s, op, acc) {
    ctx.save();
    ctx.globalAlpha = op;
    ctx.strokeStyle = acc;
    ctx.lineWidth = s * 0.07;
    ctx.beginPath(); ctx.arc(cx, cy, s, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = op * 0.45;
    ctx.lineWidth = s * 0.05;
    // Horizontal latitudes
    [-0.6, 0, 0.6].forEach(function (frac) {
      var dy = frac * s, rx = Math.sqrt(Math.max(0, s*s - dy*dy));
      ctx.beginPath(); ctx.ellipse(cx, cy+dy, rx, rx*0.28, 0, 0, Math.PI*2); ctx.stroke();
    });
    // Longitude
    ctx.beginPath(); ctx.ellipse(cx, cy, s*0.28, s, 0, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
  }

  // ── Draw: circuit lines ──────────────────────────────────────────────────
  function drawCircuit(cx, cy, s, op, acc) {
    ctx.save();
    ctx.globalAlpha = op;
    ctx.strokeStyle = acc;
    ctx.lineWidth = s * 0.07;
    ctx.lineCap = 'square';
    var u = s * 0.52;
    var bx = cx - u*1.5, by = cy - u;
    var paths = [
      [[0,0],[1,0],[1,1],[2,1]],
      [[0,2],[1,2],[1,1]],
      [[2,0],[2,1],[3,1],[3,2]],
      [[3,0],[3,1]]
    ];
    paths.forEach(function (path) {
      ctx.beginPath();
      path.forEach(function (pt, i) {
        var px = bx + pt[0]*u, py = by + pt[1]*u;
        i === 0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
      });
      ctx.stroke();
    });
    // Junction dots
    ctx.fillStyle = acc;
    [[0,0],[1,0],[1,1],[2,1],[0,2],[3,1],[3,0],[3,2]].forEach(function (pt) {
      ctx.beginPath(); ctx.arc(bx+pt[0]*u, by+pt[1]*u, s*0.1, 0, Math.PI*2); ctx.fill();
    });
    ctx.restore();
  }

  // ── Draw: AI node cluster ────────────────────────────────────────────────
  function drawNode(cx, cy, s, op, acc, t) {
    ctx.save();
    ctx.globalAlpha = op;
    var pulse = Math.sin(t*2.2)*0.35 + 0.65;
    // Connections first
    var n = 5;
    for (var i = 0; i < n; i++) {
      var a = i/n*Math.PI*2 + t*0.25;
      var nx = cx + Math.cos(a)*s*0.9, ny = cy + Math.sin(a)*s*0.9;
      ctx.globalAlpha = op * 0.4;
      ctx.strokeStyle = acc;
      ctx.lineWidth = s * 0.045;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(nx,ny); ctx.stroke();
      ctx.globalAlpha = op * 0.7;
      ctx.fillStyle = acc;
      ctx.beginPath(); ctx.arc(nx, ny, s*0.12, 0, Math.PI*2); ctx.fill();
    }
    // Center node with glow
    ctx.globalAlpha = op;
    ctx.shadowColor = acc; ctx.shadowBlur = s*0.6*pulse;
    ctx.fillStyle = acc;
    ctx.beginPath(); ctx.arc(cx, cy, s*0.26, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // ── Draw: bug/insect mascot ──────────────────────────────────────────────
  function drawBug(cx, cy, s, op, acc) {
    ctx.save();
    ctx.globalAlpha = op;
    ctx.strokeStyle = acc;
    ctx.fillStyle = accentRgba(0.12);
    ctx.lineWidth = s * 0.08;
    // Body
    ctx.beginPath(); ctx.ellipse(cx, cy+s*0.1, s*0.32, s*0.52, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    // Head
    ctx.beginPath(); ctx.arc(cx, cy-s*0.55, s*0.22, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    // Antennae
    ctx.lineWidth = s*0.06;
    ctx.beginPath();
    ctx.moveTo(cx-s*0.08, cy-s*0.75); ctx.quadraticCurveTo(cx-s*0.35, cy-s*1.0, cx-s*0.4, cy-s*1.2);
    ctx.moveTo(cx+s*0.08, cy-s*0.75); ctx.quadraticCurveTo(cx+s*0.35, cy-s*1.0, cx+s*0.4, cy-s*1.2);
    ctx.stroke();
    // Antenna tips
    ctx.fillStyle = acc;
    ctx.beginPath(); ctx.arc(cx-s*0.4, cy-s*1.2, s*0.07, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+s*0.4, cy-s*1.2, s*0.07, 0, Math.PI*2); ctx.fill();
    // Legs (3 pairs)
    ctx.lineWidth = s*0.055;
    [[-s*0.28,s*0.22],[0,s*0.45],[s*0.22,s*0.62]].forEach(function (pos, idx) {
      var lx = cx, ly = cy + pos[0];
      var slant = (idx - 1) * s * 0.12;
      ctx.beginPath();
      ctx.moveTo(lx-s*0.32, ly); ctx.lineTo(lx-s*0.72, ly+slant);
      ctx.moveTo(lx+s*0.32, ly); ctx.lineTo(lx+s*0.72, ly+slant);
      ctx.stroke();
    });
    ctx.restore();
  }

  // ── Draw: git branch ─────────────────────────────────────────────────────
  function drawGit(cx, cy, s, op, acc) {
    ctx.save();
    ctx.globalAlpha = op;
    ctx.strokeStyle = acc;
    ctx.lineWidth = s * 0.09;
    ctx.lineCap = 'round';
    // Main trunk
    ctx.beginPath(); ctx.moveTo(cx, cy+s*0.9); ctx.lineTo(cx, cy-s*0.1); ctx.stroke();
    // Branch curve
    ctx.beginPath();
    ctx.moveTo(cx, cy+s*0.2);
    ctx.bezierCurveTo(cx, cy-s*0.25, cx+s*0.75, cy-s*0.25, cx+s*0.75, cy-s*0.75);
    ctx.stroke();
    // Commit dots
    ctx.fillStyle = acc;
    [[0,0.9],[0,0.2],[0,-0.65],[0.75,-0.75]].forEach(function (d) {
      ctx.beginPath(); ctx.arc(cx+d[0]*s, cy+d[1]*s, s*0.15, 0, Math.PI*2); ctx.fill();
    });
    ctx.restore();
  }

  // ── Draw: database cylinder ──────────────────────────────────────────────
  function drawDB(cx, cy, s, op, acc) {
    ctx.save();
    ctx.globalAlpha = op;
    ctx.strokeStyle = acc;
    ctx.lineWidth = s * 0.08;
    var rw = s*0.7, h = s*1.6, ey = s*0.22;
    // Sides
    ctx.beginPath();
    ctx.moveTo(cx-rw, cy-h/2+ey); ctx.lineTo(cx-rw, cy+h/2-ey);
    ctx.moveTo(cx+rw, cy-h/2+ey); ctx.lineTo(cx+rw, cy+h/2-ey);
    ctx.stroke();
    // Top ellipse
    ctx.beginPath(); ctx.ellipse(cx, cy-h/2+ey, rw, ey, 0, 0, Math.PI*2); ctx.stroke();
    // Bottom ellipse top arc
    ctx.beginPath(); ctx.ellipse(cx, cy+h/2-ey, rw, ey, 0, Math.PI, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = op*0.3;
    ctx.beginPath(); ctx.ellipse(cx, cy+h/2-ey, rw, ey, 0, 0, Math.PI); ctx.stroke();
    // Middle ring
    ctx.globalAlpha = op*0.45; ctx.lineWidth = s*0.055;
    ctx.beginPath(); ctx.ellipse(cx, cy, rw, ey, 0, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
  }

  // ── Draw: cloud ──────────────────────────────────────────────────────────
  function drawCloud(cx, cy, s, op, acc) {
    ctx.save();
    ctx.globalAlpha = op;
    ctx.strokeStyle = acc;
    ctx.lineWidth = s * 0.08;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.arc(cx-s*0.3, cy+s*0.15, s*0.38, Math.PI*0.5, Math.PI*1.5);
    ctx.arc(cx-s*0.05, cy-s*0.12, s*0.48, Math.PI*0.88, Math.PI*0.12, false);
    ctx.arc(cx+s*0.42, cy+s*0.1, s*0.33, Math.PI*1.5, Math.PI*0.5);
    ctx.lineTo(cx-s*0.3, cy+s*0.53);
    ctx.closePath();
    ctx.fillStyle = accentRgba(0.07); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  // ── Draw: API arrows ─────────────────────────────────────────────────────
  function drawAPI(cx, cy, s, op, acc) {
    ctx.save();
    ctx.globalAlpha = op;
    ctx.strokeStyle = acc;
    ctx.lineWidth = s * 0.075;
    ctx.lineCap = 'round';
    // Endpoint boxes
    [cx-s*0.85, cx+s*0.85].forEach(function (bx) {
      ctx.fillStyle = accentRgba(0.12);
      ctx.beginPath(); ctx.roundRect(bx-s*0.28, cy-s*0.7, s*0.56, s*1.4, s*0.1);
      ctx.fill(); ctx.stroke();
    });
    // Request arrow →
    ctx.lineWidth = s * 0.065;
    var ax1 = cx-s*0.55, ax2 = cx+s*0.55;
    ctx.beginPath(); ctx.moveTo(ax1, cy-s*0.22); ctx.lineTo(ax2, cy-s*0.22); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ax2-s*0.16, cy-s*0.38); ctx.lineTo(ax2, cy-s*0.22); ctx.lineTo(ax2-s*0.16, cy-s*0.06);
    ctx.stroke();
    // Response arrow ←
    ctx.beginPath(); ctx.moveTo(ax2, cy+s*0.22); ctx.lineTo(ax1, cy+s*0.22); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ax1+s*0.16, cy+s*0.06); ctx.lineTo(ax1, cy+s*0.22); ctx.lineTo(ax1+s*0.16, cy+s*0.38);
    ctx.stroke();
    ctx.restore();
  }

  // ── Draw: Playwright browser automation ──────────────────────────────────
  function drawPlaywright(cx, cy, s, op, acc) {
    ctx.save();
    ctx.globalAlpha = op;
    ctx.strokeStyle = acc;
    ctx.lineWidth = s * 0.07;
    // Browser frame
    var fw = s*2.0, fh = s*1.55, fr = s*0.13;
    ctx.beginPath(); ctx.roundRect(cx-fw/2, cy-fh/2, fw, fh, fr); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx-fw/2+fr, cy-fh/2+s*0.38);
    ctx.lineTo(cx+fw/2-fr, cy-fh/2+s*0.38); ctx.stroke();
    // Three overlapping circles (Playwright logo-ish)
    var circles = [{dx:-s*0.38, dy:s*0.2, r:s*0.3},{dx:s*0.05, dy:-s*0.08, r:s*0.26},{dx:s*0.38, dy:s*0.18, r:s*0.22}];
    circles.forEach(function (c) {
      ctx.beginPath(); ctx.arc(cx+c.dx, cy+c.dy, c.r, 0, Math.PI*2); ctx.stroke();
    });
    // Connecting arcs
    ctx.globalAlpha = op * 0.4; ctx.lineWidth = s*0.05;
    ctx.beginPath();
    ctx.moveTo(cx-s*0.08, cy+s*0.2); ctx.lineTo(cx-s*0.21, cy-s*0.08);
    ctx.moveTo(cx+s*0.31, cy-s*0.08); ctx.lineTo(cx+s*0.16, cy+s*0.18);
    ctx.stroke();
    ctx.restore();
  }

  // ── Dispatcher ───────────────────────────────────────────────────────────
  function drawElement(el, t) {
    var acc = getAccent();
    var parallaxStr = [0.0035, 0.007, 0.013][el.layer];
    var px = el.x * W + (mouse.x - W/2) * parallaxStr;
    var py = el.y * H + (mouse.y - H/2) * parallaxStr;
    var fx = Math.cos(t * el.speed * 0.75 + el.phase) * 4;
    var fy = Math.sin(t * el.speed       + el.phase) * 6;
    var cx = px + fx, cy = py + fy;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(el.rot + t * el.rotSpd);
    ctx.translate(-cx, -cy);

    switch (el.type) {
      case 'brackets':   drawBrackets(cx,cy,el.size,el.op,acc); break;
      case 'terminal':   drawTerminal(cx,cy,el.size,el.op,acc); break;
      case 'browser':    drawBrowser(cx,cy,el.size,el.op,acc);  break;
      case 'cube':       drawCube(cx,cy,el.size,el.op,acc);     break;
      case 'hex':        drawHex(cx,cy,el.size,el.op,acc);      break;
      case 'sphere':     drawSphere(cx,cy,el.size,el.op,acc);   break;
      case 'circuit':    drawCircuit(cx,cy,el.size,el.op,acc);  break;
      case 'node':       drawNode(cx,cy,el.size,el.op,acc,t);   break;
      case 'bug':        drawBug(cx,cy,el.size,el.op,acc);      break;
      case 'git':        drawGit(cx,cy,el.size,el.op,acc);      break;
      case 'db':         drawDB(cx,cy,el.size,el.op,acc);       break;
      case 'cloud':      drawCloud(cx,cy,el.size,el.op,acc);    break;
      case 'api':        drawAPI(cx,cy,el.size,el.op,acc);      break;
      case 'playwright': drawPlaywright(cx,cy,el.size,el.op,acc);break;
    }
    ctx.restore();
  }

  // ── Blueprint grid ───────────────────────────────────────────────────────
  function drawGrid(t) {
    if (isLight()) return;
    var acc = hexToRgb(getAccent());
    ctx.save();
    ctx.strokeStyle = 'rgba('+acc.r+','+acc.g+','+acc.b+',0.022)';
    ctx.lineWidth = 0.5;
    var sp = 72;
    for (var x = 0; x <= W; x += sp) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (var y = 0; y <= H; y += sp) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    // Subtle crosshair dots at grid intersections (every 3rd)
    ctx.fillStyle = 'rgba('+acc.r+','+acc.g+','+acc.b+',0.06)';
    for (var gx = sp*3; gx < W; gx += sp*3) {
      for (var gy = sp*3; gy < H; gy += sp*3) {
        ctx.beginPath(); ctx.arc(gx, gy, 1.2, 0, Math.PI*2); ctx.fill();
      }
    }
    ctx.restore();
  }

  // ── Ambient gradient mesh ─────────────────────────────────────────────────
  function drawAmbient(t) {
    if (isLight()) return;
    var acc = hexToRgb(getAccent());
    var glows = [
      { x: 0.5 + Math.sin(t*0.18)*0.16, y: 0.28 + Math.cos(t*0.13)*0.1, r: 0.55, a: 0.038 },
      { x: 0.78 + Math.cos(t*0.14)*0.1, y: 0.7  + Math.sin(t*0.19)*0.08, r: 0.38, a: 0.028 },
      { x: 0.18 + Math.sin(t*0.16)*0.08, y: 0.6 + Math.cos(t*0.12)*0.1,  r: 0.32, a: 0.022 }
    ];
    glows.forEach(function (g) {
      var gx = g.x * W, gy = g.y * H, gr = g.r * Math.max(W,H);
      var grad = ctx.createRadialGradient(gx,gy,0, gx,gy,gr);
      grad.addColorStop(0, 'rgba('+acc.r+','+acc.g+','+acc.b+','+g.a+')');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    });
  }

  // ── Particles ─────────────────────────────────────────────────────────────
  function drawParticles(t) {
    var acc = hexToRgb(getAccent());
    particles.forEach(function (p) {
      var fy = Math.sin(t*p.speed + p.phase) * 9;
      var px = p.x * W;
      var py = ((p.y * H + fy) % H + H) % H;
      var pulse = Math.sin(t*p.speed*1.8 + p.phase)*0.45 + 0.55;
      ctx.save();
      ctx.globalAlpha = p.op * pulse;
      ctx.fillStyle = 'rgb('+acc.r+','+acc.g+','+acc.b+')';
      if (p.size > 1.4) { ctx.shadowColor = getAccent(); ctx.shadowBlur = p.size * 2.5; }
      ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────
  function render(ts) {
    time = ts / 1000;
    ctx.clearRect(0, 0, W, H);
    drawGrid(time);
    drawAmbient(time);
    drawParticles(time);
    elements.forEach(function (el) { drawElement(el, time); });
    raf = requestAnimationFrame(render);
  }

  // ── Smooth mouse parallax ─────────────────────────────────────────────────
  document.addEventListener('mousemove', function (e) {
    rawMX = e.clientX; rawMY = e.clientY;
  });
  (function smoothMouse() {
    mouse.x += (rawMX - mouse.x) * 0.06;
    mouse.y += (rawMY - mouse.y) * 0.06;
    requestAnimationFrame(smoothMouse);
  })();

  // ── Resize ────────────────────────────────────────────────────────────────
  function resize() {
    cancelAnimationFrame(raf);
    dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x for perf
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildPool();
    raf = requestAnimationFrame(render);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', resize);
  else resize();
})();
