'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Torus, Octahedron, Icosahedron, Line } from '@react-three/drei';
import * as THREE from 'three';

// ── Particle field ────────────────────────────────────────────────────────
function Particles({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 14 + 4;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = Math.random() * 2 + 0.5;
    }
    return { positions, sizes };
  }, [count]);

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.015;
    ref.current.rotation.x += delta * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#a855f7" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// ── Neural connections ────────────────────────────────────────────────────
function NeuralConnections({ nodes }: { nodes: THREE.Vector3[] }) {
  const segments = useMemo(() => {
    const pairs: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 2.8) {
          pairs.push([nodes[i], nodes[j]]);
        }
      }
    }
    return pairs;
  }, [nodes]);

  return (
    <>
      {segments.map(([a, b], i) => (
        <Line key={i} points={[a, b]} color="#7c3aed" lineWidth={0.4} transparent opacity={0.2} />
      ))}
    </>
  );
}

// ── Neural network sphere ─────────────────────────────────────────────────
function NeuralSphere({ radius, count, color, rotDir = 1 }: {
  radius: number; count: number; color: string; rotDir?: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const nodes = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      pts.push(new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      ));
    }
    return pts;
  }, [radius, count]);

  useFrame((_, delta) => {
    groupRef.current.rotation.y += delta * 0.08 * rotDir;
    groupRef.current.rotation.x += delta * 0.04 * rotDir;
  });

  return (
    <group ref={groupRef}>
      <NeuralConnections nodes={nodes} />
      {nodes.map((pos, i) => (
        <Sphere key={i} position={pos} args={[0.06, 8, 8]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </Sphere>
      ))}
    </group>
  );
}

// ── AI Core ───────────────────────────────────────────────────────────────
function AICore() {
  const coreRef  = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const ring3Ref = useRef<THREE.Mesh>(null!);
  const icoRef   = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    coreRef.current.scale.setScalar(1 + Math.sin(t * 2.5) * 0.08);
    ring1Ref.current.rotation.x += delta * 0.6;
    ring2Ref.current.rotation.y += delta * 0.5;
    ring3Ref.current.rotation.z += delta * 0.4;
    icoRef.current.rotation.y   += delta * 0.25;
    icoRef.current.rotation.x   += delta * 0.18;
  });

  return (
    <group>
      {/* Inner glow sphere */}
      <Sphere ref={coreRef} args={[0.22, 32, 32]}>
        <meshStandardMaterial
          color="#ffffff" emissive="#ffffff" emissiveIntensity={3}
          transparent opacity={0.9}
        />
      </Sphere>

      {/* Outer transparent core */}
      <Sphere args={[0.55, 32, 32]}>
        <meshStandardMaterial
          color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.4}
          transparent opacity={0.08} wireframe={false}
        />
      </Sphere>

      {/* Energy rings */}
      <Torus ref={ring1Ref} args={[0.95, 0.015, 8, 64]}>
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={2} />
      </Torus>
      <Torus ref={ring2Ref} args={[1.2, 0.01, 8, 64]} rotation={[Math.PI / 3, 0, 0]}>
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} />
      </Torus>
      <Torus ref={ring3Ref} args={[1.45, 0.008, 8, 64]} rotation={[0, Math.PI / 4, Math.PI / 4]}>
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.5} />
      </Torus>

      {/* Wireframe icosahedron */}
      <Icosahedron ref={icoRef} args={[0.8, 1]}>
        <meshStandardMaterial
          color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.6}
          wireframe transparent opacity={0.6}
        />
      </Icosahedron>
    </group>
  );
}

// ── Floating wireframe shapes ─────────────────────────────────────────────
function FloatingShape({ position, geometry, rotSpd }: {
  position: [number, number, number];
  geometry: 'oct' | 'ico';
  rotSpd: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.x += delta * rotSpd[0];
    ref.current.rotation.y += delta * rotSpd[1];
    ref.current.rotation.z += delta * rotSpd[2];
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.6}>
      {geometry === 'oct'
        ? <Octahedron ref={ref} position={position} args={[0.35, 0]}>
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.4} wireframe transparent opacity={0.4} />
          </Octahedron>
        : <Icosahedron ref={ref} position={position} args={[0.3, 0]}>
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.4} wireframe transparent opacity={0.4} />
          </Icosahedron>
      }
    </Float>
  );
}

// ── Mouse-responsive scene wrapper ────────────────────────────────────────
function SceneGroup() {
  const groupRef = useRef<THREE.Group>(null!);
  const { gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  // Track mouse
  useMemo(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useFrame((_, delta) => {
    groupRef.current.rotation.y += delta * 0.03;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, mouse.current.y * 0.08, 0.04
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, groupRef.current.rotation.y + mouse.current.x * 0.04, 0.04
    );
  });

  return (
    <group ref={groupRef}>
      <AICore />
      <NeuralSphere radius={2.2} count={18} color="#7c3aed" rotDir={1} />
      <NeuralSphere radius={3.4} count={28} color="#06b6d4" rotDir={-1} />
      <Particles count={700} />

      {/* Floating wireframes */}
      <FloatingShape position={[ 4.5,  1.5, -2]} geometry="oct" rotSpd={[0.4, 0.6, 0.3]} />
      <FloatingShape position={[-4.2,  2.0, -1]} geometry="ico" rotSpd={[0.3, 0.5, 0.4]} />
      <FloatingShape position={[ 3.8, -2.5, -3]} geometry="ico" rotSpd={[0.5, 0.3, 0.6]} />
      <FloatingShape position={[-3.5, -2.0, -2]} geometry="oct" rotSpd={[0.6, 0.4, 0.2]} />
      <FloatingShape position={[ 0.5,  4.5, -4]} geometry="oct" rotSpd={[0.3, 0.7, 0.3]} />
      <FloatingShape position={[-0.8, -4.2, -3]} geometry="ico" rotSpd={[0.7, 0.3, 0.5]} />
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={4} color="#7c3aed" />
      <pointLight position={[5, 5, 3]} intensity={1.5} color="#06b6d4" />
      <pointLight position={[-5, -3, 2]} intensity={1} color="#a855f7" />
      <SceneGroup />
    </Canvas>
  );
}
