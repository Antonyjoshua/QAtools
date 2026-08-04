/**
 * bg3d.js — Scroll-driven 3D world background for portfolio (ES module)
 */
import * as THREE from 'three';

  // ─── Performance tier ────────────────────────────────────────────────────
  const isHigh = window.innerWidth >= 768 && (navigator.hardwareConcurrency || 4) > 4;
  const PARTICLE_COUNT = isHigh ? 650 : 180;

  // ─── Canvas & renderer ───────────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.id = 'bg3d-canvas';
  Object.assign(canvas.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100%', height: '100%',
    zIndex: '0', pointerEvents: 'none', display: 'block',
  });
  document.body.prepend(canvas);

  // Hide SVG bg-icons — 3D scene replaces them
  const bgIconsEl = document.querySelector('.bg-icons');
  if (bgIconsEl) bgIconsEl.style.display = 'none';

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: isHigh,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isHigh ? 2 : 1));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0a0a0f);

  // ─── Scene ───────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0a0f, 18, 110);

  // ─── Camera ──────────────────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 13);

  // ─── Camera path ─────────────────────────────────────────────────────────
  const camPath = new THREE.CatmullRomCurve3([
    [0, 0, 13], [0, 0, 6], [2.5, 1, -6], [-1, 0.5, -20],
    [0, 0, -34], [2, 2, -47], [-1.5, 0, -61], [0, 1.5, -74], [0, 0, -86],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z)), false, 'catmullrom', 0.5);

  const lookPath = new THREE.CatmullRomCurve3([
    [0, 0, 0], [0, 0, -3], [0, 0, -12], [0, 0, -26],
    [0, 0, -38], [0, 0, -52], [0, 0, -65], [0, 0, -78], [0, 0, -92],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z)), false, 'catmullrom', 0.5);

  // ─── State ───────────────────────────────────────────────────────────────
  let scrollProgress = 0;
  const mouse = { x: 0, y: 0 };
  const lookAt = new THREE.Vector3(0, 0, -3);
  const dummy  = new THREE.Object3D();

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const lerp = (a, b, t) => a + (b - a) * t;

  function stdMat(color, opts = {}) {
    return new THREE.MeshStandardMaterial({
      color, ...opts,
    });
  }

  function makeGroup(x, y, z) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    return g;
  }

  // Float data: objects registered here get sine-wave vertical float in loop
  const floaters = []; // { mesh, baseY, freq, phase, amp }

  function addFloat(mesh, amp = 0.5, freq = 1.1, phase = 0) {
    floaters.push({ mesh, baseY: mesh.position.y, amp, freq, phase });
  }

  // Rotating objects
  const rotators = []; // { mesh, rx, ry, rz }

  // ─── Lighting ─────────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x1a0540, 0.22));

  const heroLight = new THREE.PointLight(0x7c3aed, 5, 20, 2);
  heroLight.position.set(0, 0, 5);
  scene.add(heroLight);

  const contactLight = new THREE.PointLight(0x06b6d4, 6, 25, 2);
  contactLight.position.set(0, 0, -88);
  scene.add(contactLight);

  const camLight1 = new THREE.PointLight(0x7c3aed, 4, 30, 2);
  const camLight2 = new THREE.PointLight(0x06b6d4, 3, 25, 2);
  scene.add(camLight1, camLight2);

  // ─── Particles ────────────────────────────────────────────────────────────
  const pGeo = new THREE.SphereGeometry(1, 4, 4);
  const pMat = stdMat(0xa855f7, { emissive: 0x7c3aed, emissiveIntensity: 2.5, transparent: true, opacity: 0.65 });
  const particles = new THREE.InstancedMesh(pGeo, pMat, PARTICLE_COUNT);
  scene.add(particles);

  const pData = Array.from({ length: PARTICLE_COUNT }, () => ({
    x:  (Math.random() - 0.5) * 32,
    y:  (Math.random() - 0.5) * 22,
    z:  -Math.random() * 90 + 8,
    s:  Math.random() * 0.06 + 0.02,
    ph: Math.random() * Math.PI * 2,
  }));
  pData.forEach((d, i) => {
    dummy.position.set(d.x, d.y, d.z);
    dummy.scale.setScalar(d.s);
    dummy.updateMatrix();
    particles.setMatrixAt(i, dummy.matrix);
  });
  particles.instanceMatrix.needsUpdate = true;

  // ─── AI Core ─────────────────────────────────────────────────────────────
  const coreGroup = makeGroup(0, 0, 0);

  const corePulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 32, 32),
    stdMat(0xffffff, { emissive: 0xffffff, emissiveIntensity: 6 })
  );
  coreGroup.add(corePulse);

  const coreShell = new THREE.Mesh(
    new THREE.SphereGeometry(0.65, 32, 32),
    stdMat(0x7c3aed, { transparent: true, opacity: 0.35 })
  );
  coreGroup.add(coreShell);

  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(1.15, 0.022, 8, 80),
    stdMat(0x7c3aed, { emissive: 0x7c3aed, emissiveIntensity: 4 })
  );
  coreGroup.add(ring1);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.016, 8, 80),
    stdMat(0x06b6d4, { emissive: 0x06b6d4, emissiveIntensity: 4 })
  );
  ring2.rotation.x = Math.PI / 3;
  coreGroup.add(ring2);

  const ring3 = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.012, 8, 80),
    stdMat(0xa855f7, { emissive: 0xa855f7, emissiveIntensity: 3 })
  );
  ring3.rotation.set(0, Math.PI / 4, Math.PI / 3);
  coreGroup.add(ring3);

  const coreIco = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.0, 1),
    stdMat(0xa855f7, { emissive: 0xa855f7, emissiveIntensity: 0.7, wireframe: true, transparent: true, opacity: 0.55 })
  );
  coreGroup.add(coreIco);
  scene.add(coreGroup);

  // ─── Glass cubes ─────────────────────────────────────────────────────────
  const cubeData = [
    [5.5, 1.8, -4,  0x7c3aed, 0.7,  0.25, 0.35, 0.15],
    [-6.0,-1.5,-10, 0x06b6d4, 0.7,  0.3,  0.2,  0.4],
    [4.5, -2.5,-26, 0xa855f7, 0.55, 0.4,  0.3,  0.2],
    [-5.0, 2.8,-40, 0x7c3aed, 0.9,  0.2,  0.4,  0.3],
    [6.0, -1.0,-52, 0x06b6d4, 0.7,  0.35, 0.25, 0.4],
    [-4.5, 2.0,-68, 0xa855f7, 0.6,  0.3,  0.4,  0.15],
    [5.0,  3.0,-80, 0x7c3aed, 0.7,  0.2,  0.3,  0.35],
    [-6.5,-2.5,-88, 0x06b6d4, 0.8,  0.4,  0.35, 0.2],
  ];

  cubeData.forEach(([x, y, z, col, size, rx, ry, rz]) => {
    const g = makeGroup(x, y, z);
    const geo = new THREE.BoxGeometry(size, size, size);

    // Solid (glass-like)
    const solid = new THREE.Mesh(geo, stdMat(col, { transparent: true, opacity: 0.09 }));
    g.add(solid);

    // Wireframe edge
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.55 })
    );
    g.add(edges);

    scene.add(g);
    addFloat(g, 0.45, 1.0 + Math.random() * 0.4, Math.random() * Math.PI * 2);
    rotators.push({ mesh: g, rx, ry, rz });
  });

  // ─── Wireframe spheres ────────────────────────────────────────────────────
  const spherePositions = [
    [-5.5, 3.0, -8,  0x06b6d4, 0.7],
    [ 6.5,-1.5,-18,  0x7c3aed, 0.55],
    [-4.0, 2.5,-32,  0xa855f7, 0.8],
    [ 5.5, 1.8,-44,  0x06b6d4, 0.6],
    [-5.0,-1.5,-55,  0x7c3aed, 0.7],
    [ 4.5, 3.5,-72,  0xa855f7, 0.5],
    [-6.0, 0.5,-84,  0x06b6d4, 0.75],
  ];

  spherePositions.forEach(([x, y, z, col, r]) => {
    const g = makeGroup(x, y, z);

    // Wireframe
    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(r, 1),
      stdMat(col, { emissive: col, emissiveIntensity: 0.7, wireframe: true, transparent: true, opacity: 0.45 })
    );
    g.add(wire);

    // Inner glow
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(r * 0.3, 16, 16),
      stdMat(col, { emissive: col, emissiveIntensity: 3, transparent: true, opacity: 0.5 })
    );
    g.add(glow);
    scene.add(g);
    addFloat(g, 0.4, 0.9 + Math.random() * 0.3, Math.random() * Math.PI * 2);
    rotators.push({ mesh: g, rx: 0.18, ry: 0.25, rz: 0 });
  });

  // ─── Neural network ───────────────────────────────────────────────────────
  function buildNeuralNet(px, py, pz, count, spread, col) {
    const g = makeGroup(px, py, pz);
    const nodes = [];

    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const pos   = new THREE.Vector3(
        Math.cos(theta) * Math.sin(phi) * spread,
        Math.sin(theta) * Math.sin(phi) * spread,
        Math.cos(phi) * spread * 0.7,
      );
      nodes.push(pos);

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        stdMat(col, { emissive: col, emissiveIntensity: 2 })
      );
      dot.position.copy(pos);
      g.add(dot);
    }

    // Connections
    const lineVerts = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < spread * 0.95) {
          lineVerts.push(nodes[i], nodes[j]);
        }
      }
    }
    if (lineVerts.length) {
      const lines = new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(lineVerts),
        new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.18 })
      );
      g.add(lines);
    }

    scene.add(g);
    rotators.push({ mesh: g, rx: 0.03, ry: 0.06, rz: 0 });
    return g;
  }

  buildNeuralNet( 0,  0,  0, 20, 3.2, 0x7c3aed);  // hero
  buildNeuralNet( 4,  1,-22, 12, 2.2, 0x06b6d4);  // about
  buildNeuralNet(-4,  0,-38, 10, 2.0, 0xa855f7);  // experience
  buildNeuralNet( 0,  2,-72, 14, 2.5, 0x06b6d4);  // ailab

  // ─── Hex grid ─────────────────────────────────────────────────────────────
  function buildHexGrid(px, py, pz, rows, cols, col) {
    const g = makeGroup(px, py, pz);
    const R = 0.85;

    for (let row = 0; row < rows; row++) {
      for (let col2 = 0; col2 < cols; col2++) {
        const cx = col2 * R * 1.75 - (cols * R * 0.875);
        const cy = row  * R * 1.52 + (col2 % 2 === 1 ? R * 0.76 : 0) - (rows * R * 0.76);

        const pts = [];
        for (let k = 0; k <= 6; k++) {
          const a = (k / 6) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(a) * R + cx, Math.sin(a) * R + cy, 0));
        }
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.22 })
        );
        g.add(line);
      }
    }

    scene.add(g);
    rotators.push({ mesh: g, rx: 0, ry: 0, rz: 0.02 });
    return g;
  }

  buildHexGrid(-2, -2, -16, 3, 4, 0x7c3aed);
  buildHexGrid( 3, 1.5,-50, 3, 4, 0x06b6d4);
  buildHexGrid(-1,  0, -82, 4, 5, 0xa855f7);

  // ─── Database cylinders ───────────────────────────────────────────────────
  const dbPositions = [[-6.5,-2,-30,0xa855f7], [5.5,2,-54,0x7c3aed], [-5,1,-76,0x06b6d4], [6,-2,-88,0xa855f7]];

  dbPositions.forEach(([x, y, z, col]) => {
    const g = makeGroup(x, y, z);
    [0, 0.48, 0.96].forEach((dy, i) => {
      const cyl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.45, 0.34, 20),
        stdMat(col, { emissive: col, emissiveIntensity: 0.5 - i * 0.1, transparent: true, opacity: 0.55 - i * 0.08 })
      );
      cyl.position.y = dy;
      g.add(cyl);
    });
    // Top ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.015, 8, 24),
      stdMat(col, { emissive: col, emissiveIntensity: 2 })
    );
    ring.position.y = 1.14;
    ring.rotation.x = Math.PI / 2;
    g.add(ring);
    scene.add(g);
    addFloat(g, 0.4, 0.8 + Math.random() * 0.3, Math.random() * Math.PI * 2);
    rotators.push({ mesh: g, rx: 0, ry: 0.18, rz: 0 });
  });

  // ─── Git branches ─────────────────────────────────────────────────────────
  function buildGitBranch(x, y, z, col) {
    const g = makeGroup(x, y, z);
    const lineMat = new THREE.LineBasicMaterial({ color: col });

    const branches = [
      [[0,-2,0],[0,2,0]],
      [[0,0.2,0],[1.4,1.6,0]],
      [[0,0.8,0],[-1.2,2,0]],
    ];
    branches.forEach(pts => {
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts.map(([a,b,c]) => new THREE.Vector3(a,b,c))),
        lineMat
      );
      g.add(line);
    });

    [[0,-2,0],[0,2,0],[1.4,1.6,0],[-1.2,2,0],[0,0.2,0],[0,0.8,0]].forEach(([dx,dy,dz]) => {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        stdMat(col, { emissive: col, emissiveIntensity: 2.5 })
      );
      dot.position.set(dx, dy, dz);
      g.add(dot);
    });

    scene.add(g);
    addFloat(g, 0.4, 0.7, Math.random() * Math.PI * 2);
  }

  buildGitBranch( 5, 0,-34, 0x06b6d4);
  buildGitBranch(-5, 1,-65, 0xa855f7);

  // ─── Circuit paths ────────────────────────────────────────────────────────
  function buildCircuit(x, y, z, col) {
    const g = makeGroup(x, y, z);
    const mat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.45 });

    const paths = [
      [[0,0,0],[1.2,0,0],[1.2,0.9,0],[2.8,0.9,0]],
      [[0,-0.6,0],[0.6,-0.6,0],[0.6,0,0]],
      [[2.8,0.9,0],[2.8,0,0],[3.8,0,0]],
    ];
    paths.forEach(pts => {
      g.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts.map(([a,b,c]) => new THREE.Vector3(a,b,c))),
        mat
      ));
    });

    [[0,0],[1.2,0],[1.2,0.9],[2.8,0.9],[2.8,0],[3.8,0],[0.6,0]].forEach(([dx,dy]) => {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 6, 6),
        stdMat(col, { emissive: col, emissiveIntensity: 3 })
      );
      dot.position.set(dx, dy, 0);
      g.add(dot);
    });

    scene.add(g);
  }

  buildCircuit(-5,-1,-20, 0x06b6d4);
  buildCircuit( 3,-3,-45, 0x7c3aed);
  buildCircuit(-4, 2,-76, 0x06b6d4);

  // ─── Floating panels ──────────────────────────────────────────────────────
  const PANEL_LINES = [[-.55,.30,.6,.04],[-.55,.05,.45,.04],[-.55,-.18,.70,.04],[-.55,-.38,.35,.04]];

  function buildPanel(x, y, z, col, rotY = 0) {
    const g = makeGroup(x, y, z);
    g.rotation.y = rotY;

    // Background
    g.add(new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.2, 0.04),
      stdMat(col, { transparent: true, opacity: 0.06 })
    ));

    // Frame edges
    g.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.82, 1.22, 0.04)),
      new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.55 })
    ));

    // Title bar
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(1.78, 0.18, 0.01),
      stdMat(col, { emissive: col, emissiveIntensity: 0.8, transparent: true, opacity: 0.35 })
    );
    bar.position.set(0, 0.5, 0.03);
    g.add(bar);

    // Content lines
    PANEL_LINES.forEach(([lx, ly, w, h]) => {
      const l = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, 0.005),
        stdMat(col, { emissive: col, emissiveIntensity: 1.5, transparent: true, opacity: 0.5 })
      );
      l.position.set(lx + w / 2, ly, 0.025);
      g.add(l);
    });

    scene.add(g);
    addFloat(g, 0.45, 0.9 + Math.random() * 0.4, Math.random() * Math.PI * 2);
    rotators.push({ mesh: g, rx: 0, ry: 0.04, rz: 0 });
  }

  buildPanel( 4.5, 1.0,-14, 0x7c3aed, -0.3);
  buildPanel(-4.8,-0.5,-20, 0x06b6d4,  0.3);
  buildPanel( 5.0, 2.0,-42, 0xa855f7, -0.2);
  buildPanel(-4.5, 1.5,-48, 0x7c3aed,  0.25);
  buildPanel( 4.0,-1.5,-68, 0x06b6d4, -0.2);
  buildPanel(-5.0, 0.5,-74, 0xa855f7,  0.3);

  // ─── Skill orbs ───────────────────────────────────────────────────────────
  const orbPos = [
    [ 2.8, 1.2,-58],[-2.6, 0.8,-59],[ 0.2, 2.8,-57],
    [-1.5,-1.8,-60],[ 3.2,-0.5,-62],[-3.4, 1.5,-61],
    [ 1.0,-2.5,-63],[-0.8, 2.2,-56],[ 2.0, 2.0,-64],
  ];
  const orbCols = [0x7c3aed,0x06b6d4,0xa855f7,0x7c3aed,0x06b6d4,0xa855f7,0x7c3aed,0x06b6d4,0xa855f7];

  orbPos.forEach(([x, y, z], i) => {
    const g = makeGroup(x, y, z);
    const col = orbCols[i];

    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 24, 24),
      stdMat(col, { transparent: true, opacity: 0.35 })
    );
    g.add(orb);

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.015, 8, 48),
      stdMat(col, { emissive: col, emissiveIntensity: 2.5 })
    );
    halo.rotation.x = Math.PI / 2;
    g.add(halo);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      stdMat(col, { emissive: col, emissiveIntensity: 6, transparent: true, opacity: 0.8 })
    );
    g.add(core);
    g.userData.orbCore = core;

    scene.add(g);
    addFloat(g, 0.55, 1.1 + Math.random() * 0.4, Math.random() * Math.PI * 2);
  });

  // ─── Contact orbital rings ────────────────────────────────────────────────
  const ringCols = [0x7c3aed, 0x06b6d4, 0xa855f7];
  const contactRings = [-84, -87, -90].map((z, i) => {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(3 + i * 0.8, 0.018, 8, 80),
      stdMat(ringCols[i], { emissive: ringCols[i], emissiveIntensity: 2.5 })
    );
    mesh.position.z = z;
    mesh.rotation.x = Math.PI / (3 + i);
    scene.add(mesh);
    rotators.push({ mesh, rx: 0.015 + i * 0.005, ry: 0.02 + i * 0.005, rz: 0 });
    return mesh;
  });

  // ─── Theme handling ───────────────────────────────────────────────────────
  function applyTheme() {
    const light = document.body.classList.contains('light');
    if (light) {
      document.body.style.background = '';
      canvas.style.display = 'none';
    } else {
      document.body.style.background = 'transparent';
      canvas.style.display = 'block';
    }
  }
  applyTheme();

  new MutationObserver(applyTheme).observe(document.body, {
    attributes: true, attributeFilter: ['class'],
  });

  // ─── Scroll & mouse ───────────────────────────────────────────────────────
  window.addEventListener('scroll', () => {
    const el = document.documentElement;
    scrollProgress = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ─── Animation loop ───────────────────────────────────────────────────────
  let prevNow = performance.now();

  function animate() {
    requestAnimationFrame(animate);

    const now   = performance.now();
    const delta = Math.min((now - prevNow) / 1000, 0.05);
    prevNow = now;
    const t   = now / 1000;
    const sp  = Math.min(Math.max(scrollProgress, 0), 0.9999);

    // ── Camera ──────────────────────────────────────────────────────────────
    const tPos  = camPath.getPointAt(sp);
    tPos.x += mouse.x * 0.55;
    tPos.y -= mouse.y * 0.35;

    camera.position.x = lerp(camera.position.x, tPos.x, 0.045);
    camera.position.y = lerp(camera.position.y, tPos.y, 0.045);
    camera.position.z = lerp(camera.position.z, tPos.z, 0.045);

    const tLook = lookPath.getPointAt(sp);
    lookAt.x = lerp(lookAt.x, tLook.x, 0.04);
    lookAt.y = lerp(lookAt.y, tLook.y, 0.04);
    lookAt.z = lerp(lookAt.z, tLook.z, 0.04);
    camera.lookAt(lookAt);
    camera.rotation.z = lerp(camera.rotation.z, mouse.x * 0.015, 0.05);

    // ── Moving lights follow camera ──────────────────────────────────────────
    camLight1.position.set(camera.position.x + 2, camera.position.y + 2, camera.position.z - 8);
    camLight2.position.set(camera.position.x - 3, camera.position.y - 1, camera.position.z - 4);
    const hue1 = (270 - sp * 60) / 360;
    const hue2 = (180 + sp * 60) / 360;
    camLight1.color.setHSL(hue1, 0.8, 0.5);
    camLight2.color.setHSL(hue2, 0.8, 0.5);

    // ── AI Core ──────────────────────────────────────────────────────────────
    corePulse.scale.setScalar(1 + Math.sin(t * 2.4) * 0.09);
    ring1.rotation.x += delta * 0.55;
    ring2.rotation.y += delta * 0.42;
    ring2.rotation.z += delta * 0.18;
    ring3.rotation.x -= delta * 0.3;
    ring3.rotation.z += delta * 0.25;
    coreIco.rotation.y += delta * 0.22;
    coreIco.rotation.x += delta * 0.14;

    // ── Particles ─────────────────────────────────────────────────────────────
    pData.forEach((d, i) => {
      dummy.position.set(
        d.x + Math.sin(t * 0.28 + d.ph) * 0.6,
        d.y + Math.cos(t * 0.22 + d.ph) * 0.6,
        d.z
      );
      dummy.scale.setScalar(d.s * (0.8 + Math.sin(t * 1.2 + d.ph) * 0.2));
      dummy.updateMatrix();
      particles.setMatrixAt(i, dummy.matrix);
    });
    particles.instanceMatrix.needsUpdate = true;

    // ── Floaters (sine bob) ──────────────────────────────────────────────────
    floaters.forEach(({ mesh, baseY, amp, freq, phase }) => {
      mesh.position.y = baseY + Math.sin(t * freq + phase) * amp;
    });

    // ── Rotators ─────────────────────────────────────────────────────────────
    rotators.forEach(({ mesh, rx, ry, rz }) => {
      if (rx) mesh.rotation.x += delta * rx;
      if (ry) mesh.rotation.y += delta * ry;
      if (rz) mesh.rotation.z += delta * rz;
    });

    renderer.render(scene, camera);
  }

  animate();
