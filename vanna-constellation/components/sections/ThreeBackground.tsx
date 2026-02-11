'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingGeometry({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.rotation.x = state.clock.getElapsedTime() * 0.2;
    mesh.rotation.y = state.clock.getElapsedTime() * 0.3;
    mesh.position.y = position[1] + Math.sin(state.clock.getElapsedTime()) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color={color} wireframe transparent opacity={0.3} />
    </mesh>
  );
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <FloatingGeometry position={[-2, 0, 0]} color="#703AE6" />
        <FloatingGeometry position={[2, 1, -1]} color="#FC5457" />
        <FloatingGeometry position={[0, -1, -2]} color="#32EEE2" />
      </Canvas>
    </div>
  );
}
