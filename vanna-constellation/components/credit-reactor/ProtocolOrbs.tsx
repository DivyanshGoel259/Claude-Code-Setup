'use client';

/**
 * ProtocolOrbs - 10 orbiting protocol spheres
 * Features: Orbital motion, hover effects, tooltips
 */

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import gsap from 'gsap';
import type { ProtocolOrb } from './types';

interface ProtocolOrbsProps {
  onOrbPositionsUpdate?: (positions: THREE.Vector3[]) => void;
}

// 10 DeFi protocols
const protocols: ProtocolOrb[] = [
  {
    id: 'hyperliquid',
    name: 'Hyperliquid',
    position: { x: 0, y: 0, z: 0 },
    orbitRadius: 4,
    orbitSpeed: 0.3,
    orbitAxis: { x: 0, y: 1, z: 0.2 },
  },
  {
    id: 'uniswap',
    name: 'Uniswap',
    position: { x: 0, y: 0, z: 0 },
    orbitRadius: 4.2,
    orbitSpeed: 0.25,
    orbitAxis: { x: 0.3, y: 1, z: 0 },
  },
  {
    id: 'derive',
    name: 'Derive',
    position: { x: 0, y: 0, z: 0 },
    orbitRadius: 3.8,
    orbitSpeed: 0.35,
    orbitAxis: { x: 0, y: 1, z: -0.2 },
  },
  {
    id: 'pendle',
    name: 'Pendle',
    position: { x: 0, y: 0, z: 0 },
    orbitRadius: 4.3,
    orbitSpeed: 0.28,
    orbitAxis: { x: -0.2, y: 1, z: 0.1 },
  },
  {
    id: 'aave',
    name: 'Aave',
    position: { x: 0, y: 0, z: 0 },
    orbitRadius: 4.1,
    orbitSpeed: 0.32,
    orbitAxis: { x: 0.1, y: 1, z: -0.3 },
  },
  {
    id: 'compound',
    name: 'Compound',
    position: { x: 0, y: 0, z: 0 },
    orbitRadius: 3.9,
    orbitSpeed: 0.27,
    orbitAxis: { x: -0.3, y: 1, z: 0 },
  },
  {
    id: 'dydx',
    name: 'dYdX',
    position: { x: 0, y: 0, z: 0 },
    orbitRadius: 4.2,
    orbitSpeed: 0.33,
    orbitAxis: { x: 0.2, y: 1, z: 0.3 },
  },
  {
    id: 'gmx',
    name: 'GMX',
    position: { x: 0, y: 0, z: 0 },
    orbitRadius: 4,
    orbitSpeed: 0.29,
    orbitAxis: { x: 0, y: 1, z: 0.1 },
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    position: { x: 0, y: 0, z: 0 },
    orbitRadius: 3.85,
    orbitSpeed: 0.31,
    orbitAxis: { x: -0.1, y: 1, z: -0.2 },
  },
  {
    id: 'drift',
    name: 'Drift',
    position: { x: 0, y: 0, z: 0 },
    orbitRadius: 4.15,
    orbitSpeed: 0.26,
    orbitAxis: { x: 0.3, y: 1, z: -0.1 },
  },
];

interface OrbMeshProps {
  protocol: ProtocolOrb;
  index: number;
}

function OrbMesh({ protocol, index }: OrbMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Hover scale animation
  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: hovered ? 1.4 : 1,
        y: hovered ? 1.4 : 1,
        z: hovered ? 1.4 : 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [hovered]);

  // Calculate orbital position each frame
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();
      const angle = time * protocol.orbitSpeed + index * ((Math.PI * 2) / 10);

      // Apply rotation around custom axis
      const orbitMatrix = new THREE.Matrix4();
      orbitMatrix.makeRotationAxis(
        new THREE.Vector3(
          protocol.orbitAxis.x,
          protocol.orbitAxis.y,
          protocol.orbitAxis.z
        ).normalize(),
        angle
      );

      const orbitPosition = new THREE.Vector3(protocol.orbitRadius, 0, 0);
      orbitPosition.applyMatrix4(orbitMatrix);

      meshRef.current.position.copy(orbitPosition);

      // Gentle self-rotation
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[0.3, 24, 24]} />
      <meshStandardMaterial
        color="#32EEE2" // Electric Blue
        emissive="#32EEE2"
        emissiveIntensity={hovered ? 1.5 : 0.8}
        metalness={0.3}
        roughness={0.4}
      />

      {/* Tooltip on hover */}
      {hovered && (
        <Html distanceFactor={10} center>
          <div className="px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-lg shadow-lg border border-electric-blue-500/30">
            {protocol.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

export default function ProtocolOrbs({ onOrbPositionsUpdate }: ProtocolOrbsProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Update orb positions for parent component (for particles)
  useFrame(() => {
    if (groupRef.current && onOrbPositionsUpdate) {
      const positions = groupRef.current.children.map((child) =>
        child.position.clone()
      );
      onOrbPositionsUpdate(positions);
    }
  });

  return (
    <group ref={groupRef}>
      {protocols.map((protocol, index) => (
        <OrbMesh key={protocol.id} protocol={protocol} index={index} />
      ))}
    </group>
  );
}
