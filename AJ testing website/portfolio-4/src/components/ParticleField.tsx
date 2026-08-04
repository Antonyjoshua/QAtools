'use client';

import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 3000 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      const r = Math.random();
      if (r < 0.45) {
        colors[i*3] = 0; colors[i*3+1] = 0.83; colors[i*3+2] = 1;       // cyan
      } else if (r < 0.75) {
        colors[i*3] = 0.49; colors[i*3+1] = 0.23; colors[i*3+2] = 0.93; // purple
      } else {
        colors[i*3] = 0.88; colors[i*3+1] = 0.88; colors[i*3+2] = 1;    // white-blue
      }
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.025;
    mesh.current.rotation.x = Math.sin(t * 0.015) * 0.15;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function ConnectedNodes({ count = 80 }: { count?: number }) {
  const points = useMemo(() => {
    return Array.from({ length: count }, () => new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10
    ));
  }, [count]);

  const linePositions = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = points[i].distanceTo(points[j]);
        if (dist < 4) {
          pos.push(points[i].x, points[i].y, points[i].z,
                   points[j].x, points[j].y, points[j].z);
        }
      }
    }
    return new Float32Array(pos);
  }, [points]);

  const lineRef = useRef<THREE.LineSegments>(null);
  useFrame(state => {
    if (lineRef.current) {
      lineRef.current.rotation.y = state.clock.getElapsedTime() * 0.018;
      lineRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.1;
    }
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#00d4ff" transparent opacity={0.08} depthWrite={false} />
    </lineSegments>
  );
}

export default function ParticleField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Particles count={2500} />
      <ConnectedNodes count={60} />
    </Canvas>
  );
}
