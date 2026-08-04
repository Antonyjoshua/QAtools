'use client';

import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Line, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';

// ─── Performance tier ────────────────────────────────────────────────────────
function getPerfTier(): 'low' | 'high' {
  if (typeof window === 'undefined') return 'high';
  if (window.innerWidth < 768) return 'low';
  if (navigator.hardwareConcurrency <= 4) return 'low';
  return 'high';
}

// ─── Camera path ─────────────────────────────────────────────────────────────
const CAM_POS = [
  [  0,   0,  13],  // 0  start
  [  0,   0,   6],  // 1  hero
  [  2.5, 1,  -6],  // 2  hero→about
  [ -1,   0.5,-20], // 3  about
  [  0,   0,  -34], // 4  experience
  [  2,   2,  -47], // 5  projects
  [ -1.5, 0,  -61], // 6  skills
  [  0,   1.5,-74], // 7  ai-lab
  [  0,   0,  -86], // 8  contact
].map(([x,y,z]) => new THREE.Vector3(x, y, z));

const CAM_LOOK = [
  [ 0, 0,  0],
  [ 0, 0, -3],
  [ 0, 0, -12],
  [ 0, 0, -26],
  [ 0, 0, -38],
  [ 0, 0, -52],
  [ 0, 0, -65],
  [ 0, 0, -78],
  [ 0, 0, -92],
].map(([x,y,z]) => new THREE.Vector3(x, y, z));

const camPath    = new THREE.CatmullRomCurve3(CAM_POS,    false, 'catmullrom', 0.5);
const targetPath = new THREE.CatmullRomCurve3(CAM_LOOK,   false, 'catmullrom', 0.5);

// ─── Particles ────────────────────────────────────────────────────────────────
function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const { data } = useMemo(() => {
    const data: { x: number; y: number; z: number; s: number; ph: number }[] = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x:  (Math.random() - 0.5) * 32,
        y:  (Math.random() - 0.5) * 22,
        z:  -Math.random() * 90 + 8,
        s:  Math.random() * 0.06 + 0.02,
        ph: Math.random() * Math.PI * 2,
      });
    }
    return { data };
  }, [count]);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    data.forEach((d, i) => {
      dummy.position.set(d.x, d.y, d.z);
      dummy.scale.setScalar(d.s);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [data]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const dummy = new THREE.Object3D();
    data.forEach((d, i) => {
      dummy.position.set(
        d.x + Math.sin(t * 0.28 + d.ph) * 0.6,
        d.y + Math.cos(t * 0.22 + d.ph) * 0.6,
        d.z,
      );
      dummy.scale.setScalar(d.s * (0.8 + Math.sin(t * 1.2 + d.ph) * 0.2));
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial color="#a855f7" emissive="#7c3aed" emissiveIntensity={2.5} transparent opacity={0.65} />
    </instancedMesh>
  );
}

// ─── Glass cube ───────────────────────────────────────────────────────────────
function GlassCube({
  position, size = 0.7, color = '#7c3aed', rotSpd = [0.3, 0.4, 0.2],
}: {
  position: [number,number,number]; size?: number;
  color?: string; rotSpd?: [number,number,number];
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    ref.current.rotation.x += dt * rotSpd[0];
    ref.current.rotation.y += dt * rotSpd[1];
    ref.current.rotation.z += dt * rotSpd[2];
  });
  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.6}>
      <group ref={ref} position={position}>
        {/* Solid face */}
        <mesh>
          <boxGeometry args={[size, size, size]} />
          <meshPhysicalMaterial
            color={color} transparent opacity={0.1}
            metalness={0} roughness={0}
            transmission={0.85} ior={1.4} thickness={0.5}
          />
        </mesh>
        {/* Wireframe edge */}
        <mesh>
          <boxGeometry args={[size, size, size]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} wireframe transparent opacity={0.55} />
        </mesh>
      </group>
    </Float>
  );
}

// ─── Wireframe sphere ─────────────────────────────────────────────────────────
function WireSphere({
  position, radius = 0.6, color = '#06b6d4',
}: {
  position: [number,number,number]; radius?: number; color?: string;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    ref.current.rotation.x += dt * 0.18;
    ref.current.rotation.y += dt * 0.25;
  });
  return (
    <Float speed={1} floatIntensity={0.5}>
      <group ref={ref} position={position}>
        <mesh>
          <icosahedronGeometry args={[radius, 1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} wireframe transparent opacity={0.45} />
        </mesh>
        {/* Inner glow sphere */}
        <mesh>
          <sphereGeometry args={[radius * 0.3, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} transparent opacity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

// ─── AI Core (hero) ───────────────────────────────────────────────────────────
function AICore() {
  const core   = useRef<THREE.Mesh>(null!);
  const r1     = useRef<THREE.Mesh>(null!);
  const r2     = useRef<THREE.Mesh>(null!);
  const r3     = useRef<THREE.Mesh>(null!);
  const ico    = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    core.current.scale.setScalar(1 + Math.sin(t * 2.4) * 0.09);
    r1.current.rotation.x += dt * 0.55;
    r2.current.rotation.y += dt * 0.42;
    r2.current.rotation.z += dt * 0.18;
    r3.current.rotation.x -= dt * 0.3;
    r3.current.rotation.z += dt * 0.25;
    ico.current.rotation.y += dt * 0.22;
    ico.current.rotation.x += dt * 0.14;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Pulse core */}
      <mesh ref={core}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={6} />
      </mesh>

      {/* Glass shell */}
      <mesh>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshPhysicalMaterial color="#7c3aed" transmission={0.92} roughness={0} transparent opacity={0.35} />
      </mesh>

      {/* Rings */}
      <mesh ref={r1}>
        <torusGeometry args={[1.15, 0.022, 8, 80]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={4} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI/3, 0, 0]}>
        <torusGeometry args={[1.5, 0.016, 8, 80]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={4} />
      </mesh>
      <mesh ref={r3} rotation={[0, Math.PI/4, Math.PI/3]}>
        <torusGeometry args={[1.8, 0.012, 8, 80]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={3} />
      </mesh>

      {/* Wireframe ico */}
      <mesh ref={ico}>
        <icosahedronGeometry args={[1.0, 1]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.7} wireframe transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

// ─── Neural network ───────────────────────────────────────────────────────────
function NeuralNet({
  position, count = 16, spread = 3, color = '#7c3aed',
}: {
  position: [number,number,number]; count?: number; spread?: number; color?: string;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const { nodes, connections } = useMemo(() => {
    const nodes = Array.from({ length: count }, (_, i) => {
      const phi   = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      return new THREE.Vector3(
        Math.cos(theta) * Math.sin(phi) * spread,
        Math.sin(theta) * Math.sin(phi) * spread,
        Math.cos(phi) * spread * 0.7,
      );
    });
    const connections: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < spread * 0.95) {
          connections.push([nodes[i], nodes[j]]);
        }
      }
    }
    return { nodes, connections };
  }, [count, spread]);

  useFrame((_, dt) => {
    groupRef.current.rotation.y += dt * 0.06;
    groupRef.current.rotation.x += dt * 0.03;
  });

  return (
    <group ref={groupRef} position={position}>
      {connections.map(([a, b], i) => (
        <Line key={i} points={[a, b]} color={color} lineWidth={0.5} transparent opacity={0.18} />
      ))}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Hex grid tile ────────────────────────────────────────────────────────────
function HexTile({
  cx, cy, cz, radius, color,
}: {
  cx: number; cy: number; cz: number; radius: number; color: string;
}) {
  const pts = useMemo(() => {
    const p: THREE.Vector3[] = [];
    for (let i = 0; i <= 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      p.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
    }
    return p;
  }, [radius]);

  return (
    <group position={[cx, cy, cz]}>
      <Line points={pts} color={color} lineWidth={0.8} transparent opacity={0.22} />
    </group>
  );
}

function HexGrid({ position, rows = 4, cols = 5, color = '#7c3aed' }: {
  position: [number,number,number]; rows?: number; cols?: number; color?: string;
}) {
  const r = 0.85;
  const tiles = useMemo(() => {
    const list: { cx: number; cy: number }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cx = col * r * 1.75 - (cols * r * 0.875);
        const cy = row * r * 1.52 + (col % 2 === 1 ? r * 0.76 : 0) - (rows * r * 0.76);
        list.push({ cx, cy });
      }
    }
    return list;
  }, [rows, cols, r]);

  const ref = useRef<THREE.Group>(null!);
  useFrame((_, dt) => { ref.current.rotation.z += dt * 0.02; });

  return (
    <group ref={ref} position={position}>
      {tiles.map((t, i) => (
        <HexTile key={i} cx={t.cx} cy={t.cy} cz={0} radius={r} color={color} />
      ))}
    </group>
  );
}

// ─── Database cylinder stack ──────────────────────────────────────────────────
function DBCylinder({ position, color = '#7c3aed' }: { position: [number,number,number]; color?: string }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, dt) => { ref.current.rotation.y += dt * 0.18; });
  return (
    <Float speed={0.8} floatIntensity={0.4}>
      <group ref={ref} position={position}>
        {[0, 0.48, 0.96].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.34, 20]} />
            <meshStandardMaterial
              color={color} emissive={color} emissiveIntensity={0.5 - i * 0.1}
              transparent opacity={0.55 - i * 0.08} metalness={0.3} roughness={0.4}
            />
          </mesh>
        ))}
        {/* Ellipse caps */}
        {[0, 0.96].map((y, i) => (
          <mesh key={i} position={[0, y + 0.18, 0]} rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[0.45, 0.015, 8, 24]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// ─── Git branch ───────────────────────────────────────────────────────────────
function GitBranch({ position, color = '#06b6d4' }: { position: [number,number,number]; color?: string }) {
  const trunk   = useMemo(() => [new THREE.Vector3(0,-2,0), new THREE.Vector3(0,2,0)], []);
  const branch1 = useMemo(() => [new THREE.Vector3(0,0.2,0), new THREE.Vector3(1.4,1.6,0)], []);
  const branch2 = useMemo(() => [new THREE.Vector3(0,0.8,0), new THREE.Vector3(-1.2,2,0)], []);
  const dots: [number,number,number][] = [[0,-2,0],[0,2,0],[1.4,1.6,0],[-1.2,2,0],[0,0.2,0],[0,0.8,0]];

  return (
    <Float speed={0.7} floatIntensity={0.4}>
      <group position={position}>
        <Line points={trunk}   color={color} lineWidth={1.8} />
        <Line points={branch1} color={color} lineWidth={1.4} />
        <Line points={branch2} color={color} lineWidth={1.4} />
        {dots.map(([x,y,z], i) => (
          <mesh key={i} position={[x,y,z]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// ─── Circuit path ─────────────────────────────────────────────────────────────
function CircuitPath({ position, color = '#06b6d4' }: { position: [number,number,number]; color?: string }) {
  const paths = useMemo(() => [
    [new THREE.Vector3(0,0,0), new THREE.Vector3(1.2,0,0), new THREE.Vector3(1.2,0.9,0), new THREE.Vector3(2.8,0.9,0)],
    [new THREE.Vector3(0,-0.6,0), new THREE.Vector3(0.6,-0.6,0), new THREE.Vector3(0.6,0,0)],
    [new THREE.Vector3(2.8,0.9,0), new THREE.Vector3(2.8,0,0), new THREE.Vector3(3.8,0,0)],
  ], []);

  const dots: [number,number,number][] = [
    [0,0,0],[1.2,0,0],[1.2,0.9,0],[2.8,0.9,0],[2.8,0,0],[3.8,0,0],[0.6,0,0],
  ];

  return (
    <group position={position}>
      {paths.map((p, i) => (
        <Line key={i} points={p} color={color} lineWidth={1} transparent opacity={0.45} />
      ))}
      {dots.map(([x,y,z], i) => (
        <mesh key={i} position={[x,y,z]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Floating panel (browser / terminal) ─────────────────────────────────────
const PANEL_LINES: [number,number,number,number][] = [
  [-0.55, 0.30, 0.6, 0.04],
  [-0.55, 0.05, 0.45, 0.04],
  [-0.55,-0.18, 0.7,  0.04],
  [-0.55,-0.38, 0.35, 0.04],
];

function FloatingPanel({
  position, color = '#7c3aed', rotY = 0,
}: {
  position: [number,number,number]; color?: string; rotY?: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, dt) => { ref.current.rotation.y += dt * 0.04; });
  return (
    <Float speed={0.9} floatIntensity={0.5}>
      <group ref={ref} position={position} rotation={[0, rotY, 0]}>
        {/* Panel background */}
        <mesh>
          <boxGeometry args={[1.8, 1.2, 0.04]} />
          <meshStandardMaterial color={color} transparent opacity={0.06} />
        </mesh>
        {/* Glowing frame */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.82, 1.22, 0.04)]} />
          <lineBasicMaterial color={color} transparent opacity={0.55} />
        </lineSegments>
        {/* Title bar */}
        <mesh position={[0, 0.5, 0.03]}>
          <boxGeometry args={[1.78, 0.18, 0.01]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.35} />
        </mesh>
        {/* Content lines */}
        {PANEL_LINES.map(([x,y,w,h], i) => (
          <mesh key={i} position={[x + w/2, y, 0.025]}>
            <boxGeometry args={[w, h, 0.005]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.5} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// ─── Skill orb ────────────────────────────────────────────────────────────────
function SkillOrb({ position, color }: { position: [number,number,number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.scale.setScalar(1 + Math.sin(t * 1.5 + position[0]) * 0.07);
  });
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <group position={position}>
        <mesh ref={ref}>
          <sphereGeometry args={[0.38, 24, 24]} />
          <meshPhysicalMaterial color={color} transmission={0.8} roughness={0.05} transparent opacity={0.4} />
        </mesh>
        {/* Outer ring */}
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.45, 0.015, 8, 48]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
        </mesh>
        {/* Core glow */}
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={6} transparent opacity={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

// ─── Scene background + fog (lerped) ─────────────────────────────────────────
function SceneBackground({ bgColor, fogColor, fogNear, fogFar }: {
  bgColor: string; fogColor: string; fogNear: number; fogFar: number;
}) {
  const { scene } = useThree();
  const cur  = useRef(new THREE.Color(bgColor));
  const tgt  = useRef(new THREE.Color(bgColor));
  const curF = useRef(new THREE.Color(fogColor));
  const tgtF = useRef(new THREE.Color(fogColor));

  useEffect(() => { tgt.current.set(bgColor); tgtF.current.set(fogColor); }, [bgColor, fogColor]);

  // Set up fog once
  useEffect(() => {
    scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame(() => {
    cur.current.lerp(tgt.current, 0.04);
    curF.current.lerp(tgtF.current, 0.04);
    scene.background = cur.current;
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(curF.current);
      scene.fog.near = fogNear;
      scene.fog.far  = fogFar;
    }
  });

  return null;
}

// ─── Traverse scene + smoothly recolor all materials when theme changes ───────
function SceneThemeUpdater({ primary, secondary, tertiary, ambientColor, ambientIntensity }: {
  primary: string; secondary: string; tertiary: string;
  ambientColor: string; ambientIntensity: number;
}) {
  const { scene } = useThree();
  const classified = useRef(false);

  // Lerped current colors
  const cur = useRef({
    p: new THREE.Color('#7c3aed'),
    s: new THREE.Color('#06b6d4'),
    t: new THREE.Color('#a855f7'),
    a: new THREE.Color('#1a0540'),
  });
  // Targets
  const tgt = useRef({
    p: new THREE.Color(primary),
    s: new THREE.Color(secondary),
    t: new THREE.Color(tertiary),
    a: new THREE.Color(ambientColor),
  });

  // Update targets when props change
  useEffect(() => {
    tgt.current.p.set(primary);
    tgt.current.s.set(secondary);
    tgt.current.t.set(tertiary);
    tgt.current.a.set(ambientColor);
  }, [primary, secondary, tertiary, ambientColor]);

  // Classify every mesh/line ONCE after scene populates
  useEffect(() => {
    const timer = setTimeout(() => {
      const defaults = {
        p: new THREE.Color('#7c3aed'),
        s: new THREE.Color('#06b6d4'),
        t: new THREE.Color('#a855f7'),
      };
      const cdist = (a: THREE.Color, b: THREE.Color) =>
        Math.sqrt((a.r-b.r)**2+(a.g-b.g)**2+(a.b-b.b)**2);

      scene.traverse((obj) => {
        if (obj.userData.colorRole) return;
        const o = obj as THREE.Mesh | THREE.Line;
        const mat = Array.isArray(o.material) ? o.material[0] : o.material;
        const mStd = mat as THREE.MeshStandardMaterial | null;
        if (!mStd?.color) return;
        const c = mStd.color;
        const dp = cdist(c, defaults.p);
        const ds = cdist(c, defaults.s);
        const dt = cdist(c, defaults.t);
        const min = Math.min(dp, ds, dt);
        if (min < 0.45) {
          obj.userData.colorRole = min === dp ? 'p' : min === ds ? 's' : 't';
        }
      });
      classified.current = true;
    }, 1200);
    return () => clearTimeout(timer);
  }, [scene]);

  // Ambient light ref stored via scene child lookup
  const ambientRef = useRef<THREE.AmbientLight | null>(null);
  useEffect(() => {
    scene.traverse((o) => {
      if ((o as THREE.AmbientLight).isAmbientLight) ambientRef.current = o as THREE.AmbientLight;
    });
  }, [scene]);

  useFrame(() => {
    // Lerp palette
    cur.current.p.lerp(tgt.current.p, 0.035);
    cur.current.s.lerp(tgt.current.s, 0.035);
    cur.current.t.lerp(tgt.current.t, 0.035);
    cur.current.a.lerp(tgt.current.a, 0.035);

    // Update ambient
    if (ambientRef.current) {
      ambientRef.current.color.copy(cur.current.a);
      ambientRef.current.intensity = ambientIntensity;
    }

    if (!classified.current) return;

    // Apply to all classified objects
    scene.traverse((obj) => {
      const role = obj.userData.colorRole as 'p'|'s'|'t'|undefined;
      if (!role) return;
      const col = cur.current[role];
      const o = obj as THREE.Mesh;
      const mat = Array.isArray(o.material) ? o.material[0] : o.material;
      if (!mat) return;
      const m = mat as THREE.MeshStandardMaterial;
      if (m.color)   m.color.copy(col);
      if (m.emissive) m.emissive.copy(col);
    });
  });

  return null;
}

// ─── Section-aware dynamic lighting ──────────────────────────────────────────
function DynamicLights({ primary, secondary }: { primary: string; secondary: string }) {
  const scrollRef = useRef(0);
  const l1 = useRef<THREE.PointLight>(null!);
  const l2 = useRef<THREE.PointLight>(null!);
  const sl1 = useRef<THREE.PointLight>(null!);
  const sl2 = useRef<THREE.PointLight>(null!);

  const tgtL1 = useRef(new THREE.Color(primary));
  const tgtL2 = useRef(new THREE.Color(secondary));
  const curL1 = useRef(new THREE.Color(primary));
  const curL2 = useRef(new THREE.Color(secondary));

  useEffect(() => { tgtL1.current.set(primary); tgtL2.current.set(secondary); }, [primary, secondary]);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      scrollRef.current = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame(({ camera }) => {
    const t    = scrollRef.current;
    const camZ = camera.position.z;

    l1.current.position.set(camera.position.x + 2, camera.position.y + 2, camZ - 8);
    l2.current.position.set(camera.position.x - 3, camera.position.y - 1, camZ - 4);

    curL1.current.lerp(tgtL1.current, 0.035);
    curL2.current.lerp(tgtL2.current, 0.035);

    // Hue-shift within the theme's color family
    const p1 = curL1.current.clone();
    const p2 = curL2.current.clone();
    const hsl1 = { h: 0, s: 0, l: 0 };
    const hsl2 = { h: 0, s: 0, l: 0 };
    p1.getHSL(hsl1); p2.getHSL(hsl2);
    p1.setHSL((hsl1.h + t * 0.06) % 1, 0.8, 0.5);
    p2.setHSL((hsl2.h - t * 0.06 + 1) % 1, 0.8, 0.5);

    l1.current.color.copy(p1);
    l2.current.color.copy(p2);
    l1.current.intensity = 4 + Math.sin(t * Math.PI * 3) * 1;
    l2.current.intensity = 3 + Math.cos(t * Math.PI * 2) * 1;

    sl1.current.color.copy(curL1.current);
    sl2.current.color.copy(curL2.current);
  });

  return (
    <>
      <ambientLight intensity={0.18} color="#1a0540" />
      <pointLight ref={l1} intensity={4} distance={30} decay={2} />
      <pointLight ref={l2} intensity={3} distance={25} decay={2} />
      <pointLight ref={sl1} position={[0, 0, 5]}   intensity={5} distance={20} decay={2} />
      <pointLight ref={sl2} position={[0, 0, -88]}  intensity={6} distance={25} decay={2} />
    </>
  );
}

// ─── Camera rig ──────────────────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const scrollRef = useRef(0);
  const mouseRef  = useRef({ x: 0, y: 0 });
  const lookAt    = useRef(new THREE.Vector3(0, 0, -3));
  const tempLook  = useRef(new THREE.Vector3());

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      scrollRef.current = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
    };
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  useFrame(() => {
    const t  = Math.min(Math.max(scrollRef.current, 0), 0.9999);
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // Get path positions
    const targetPos  = camPath.getPointAt(t);
    const targetLook = targetPath.getPointAt(t);

    // Apply mouse offset (subtle)
    targetPos.x += mx * 0.55;
    targetPos.y -= my * 0.35;

    // Smooth camera move
    camera.position.lerp(targetPos, 0.045);

    // Smooth look-at
    lookAt.current.lerp(targetLook, 0.04);
    camera.lookAt(lookAt.current);

    // Subtle roll with mouse
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, mx * 0.015, 0.05);
  });

  return null;
}

// ─── Full scene content ───────────────────────────────────────────────────────
function SceneContent({ perf, sceneColors }: {
  perf: 'low' | 'high';
  sceneColors: { bg: string; fog: string; fogNear: number; fogFar: number; primary: string; secondary: string; tertiary: string; ambientColor: string; ambientIntensity: number; };
}) {
  const particleCount = perf === 'high' ? 700 : 200;

  // Skill orb positions (circling around z = -60)
  const orbPositions: [number,number,number][] = [
    [ 2.8, 1.2, -58], [-2.6, 0.8, -59], [ 0.2, 2.8, -57],
    [-1.5,-1.8, -60], [ 3.2,-0.5, -62], [-3.4, 1.5, -61],
    [ 1.0,-2.5, -63], [-0.8, 2.2, -56], [ 2.0, 2.0, -64],
  ];
  const orbColors = ['#7c3aed','#06b6d4','#a855f7','#7c3aed','#06b6d4','#a855f7','#7c3aed','#06b6d4','#a855f7'];

  return (
    <>
      <SceneBackground
        bgColor={sceneColors.bg}
        fogColor={sceneColors.fog}
        fogNear={sceneColors.fogNear}
        fogFar={sceneColors.fogFar}
      />
      <SceneThemeUpdater
        primary={sceneColors.primary}
        secondary={sceneColors.secondary}
        tertiary={sceneColors.tertiary}
        ambientColor={sceneColors.ambientColor}
        ambientIntensity={sceneColors.ambientIntensity}
      />
      <DynamicLights primary={sceneColors.primary} secondary={sceneColors.secondary} />
      <CameraRig />

      {/* ── Particles ── */}
      <Particles count={particleCount} />

      {/* ── Hero zone (z: 0 to -10) ── */}
      <AICore />
      <NeuralNet position={[0, 0, 0]} count={20} spread={3.2} color="#7c3aed" />

      {/* ── Glass cubes scattered ── */}
      <GlassCube position={[ 5.5, 1.8,  -4]} color="#7c3aed" rotSpd={[0.25, 0.35, 0.15]} />
      <GlassCube position={[-6.0,-1.5, -10]} color="#06b6d4" rotSpd={[0.3, 0.2, 0.4]} />
      <GlassCube position={[ 4.5,-2.5, -26]} color="#a855f7" rotSpd={[0.4, 0.3, 0.2]} size={0.55} />
      <GlassCube position={[-5.0, 2.8, -40]} color="#7c3aed" rotSpd={[0.2, 0.4, 0.3]} size={0.9} />
      <GlassCube position={[ 6.0,-1.0, -52]} color="#06b6d4" rotSpd={[0.35, 0.25, 0.4]} />
      <GlassCube position={[-4.5, 2.0, -68]} color="#a855f7" rotSpd={[0.3, 0.4, 0.15]} size={0.6} />
      <GlassCube position={[ 5.0, 3.0, -80]} color="#7c3aed" rotSpd={[0.2, 0.3, 0.35]} />
      <GlassCube position={[-6.5,-2.5, -88]} color="#06b6d4" rotSpd={[0.4, 0.35, 0.2]} size={0.8} />

      {/* ── Wireframe spheres ── */}
      <WireSphere position={[-5.5, 3.0,  -8]} radius={0.7} color="#06b6d4" />
      <WireSphere position={[ 6.5,-1.5, -18]} radius={0.55} color="#7c3aed" />
      <WireSphere position={[-4.0, 2.5, -32]} radius={0.8} color="#a855f7" />
      <WireSphere position={[ 5.5, 1.8, -44]} radius={0.6} color="#06b6d4" />
      <WireSphere position={[-5.0,-1.5, -55]} radius={0.7} color="#7c3aed" />
      <WireSphere position={[ 4.5, 3.5, -72]} radius={0.5} color="#a855f7" />
      <WireSphere position={[-6.0, 0.5, -84]} radius={0.75} color="#06b6d4" />

      {/* ── Neural nets at section zones ── */}
      <NeuralNet position={[ 4, 1, -22]} count={12} spread={2.2} color="#06b6d4" />
      <NeuralNet position={[-4, 0, -38]} count={10} spread={2}   color="#a855f7" />
      <NeuralNet position={[ 0, 2, -72]} count={14} spread={2.5} color="#06b6d4" />

      {/* ── Hex grids ── */}
      <HexGrid position={[-2, -2, -16]} rows={3} cols={4} color="#7c3aed" />
      <HexGrid position={[ 3, 1.5, -50]} rows={3} cols={4} color="#06b6d4" />
      <HexGrid position={[-1, 0, -82]} rows={4} cols={5} color="#a855f7" />

      {/* ── DB cylinders ── */}
      <DBCylinder position={[-6.5, -2, -30]} color="#a855f7" />
      <DBCylinder position={[ 5.5,  2, -54]} color="#7c3aed" />
      <DBCylinder position={[-5.0,  1, -76]} color="#06b6d4" />
      <DBCylinder position={[ 6.0, -2, -88]} color="#a855f7" />

      {/* ── Git branches ── */}
      <GitBranch position={[ 5, 0, -34]} color="#06b6d4" />
      <GitBranch position={[-5, 1, -65]} color="#a855f7" />

      {/* ── Circuit paths ── */}
      <CircuitPath position={[-5, -1, -20]} color="#06b6d4" />
      <CircuitPath position={[ 3, -3, -45]} color="#7c3aed" />
      <CircuitPath position={[-4,  2, -76]} color="#06b6d4" />

      {/* ── Floating panels (browser / terminal) ── */}
      <FloatingPanel position={[ 4.5, 1.0, -14]} color="#7c3aed"  rotY={-0.3} />
      <FloatingPanel position={[-4.8,-0.5, -20]} color="#06b6d4"  rotY={ 0.3} />
      <FloatingPanel position={[ 5.0, 2.0, -42]} color="#a855f7"  rotY={-0.2} />
      <FloatingPanel position={[-4.5, 1.5, -48]} color="#7c3aed"  rotY={ 0.25} />
      <FloatingPanel position={[ 4.0,-1.5, -68]} color="#06b6d4"  rotY={-0.2} />
      <FloatingPanel position={[-5.0, 0.5, -74]} color="#a855f7"  rotY={ 0.3} />

      {/* ── Skill orbs (z ≈ -58 to -64) ── */}
      {orbPositions.map((pos, i) => (
        <SkillOrb key={i} position={pos} color={orbColors[i]} />
      ))}

      {/* ── Contact zone orbital rings ── */}
      {[-84, -87, -90].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / (3 + i), 0, 0]}>
          <torusGeometry args={[3 + i * 0.8, 0.018, 8, 80]} />
          <meshStandardMaterial
            color={['#7c3aed','#06b6d4','#a855f7'][i]}
            emissive={['#7c3aed','#06b6d4','#a855f7'][i]}
            emissiveIntensity={2.5}
          />
        </mesh>
      ))}
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function Scene3D() {
  const perf  = useMemo(() => getPerfTier(), []);
  const { theme } = useTheme();

  const sceneColors = useMemo(() => ({
    bg:               theme.scene.background,
    fog:              theme.scene.fogColor,
    fogNear:          theme.scene.fogNear,
    fogFar:           theme.scene.fogFar,
    primary:          theme.scene.primary,
    secondary:        theme.scene.secondary,
    tertiary:         theme.scene.tertiary,
    ambientColor:     theme.scene.ambientColor,
    ambientIntensity: theme.scene.ambientIntensity,
  }), [theme]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 13], fov: 58, near: 0.1, far: 200 }}
        dpr={perf === 'high' ? [1, 2] : [1, 1]}
        gl={{ antialias: perf === 'high', powerPreference: 'high-performance', alpha: false }}
      >
        <AdaptiveDpr pixelated />
        <SceneContent perf={perf} sceneColors={sceneColors} />
      </Canvas>
    </div>
  );
}
