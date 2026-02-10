'use client';

/**
 * ParticleStream - 1000 particles flowing between reactor and orbs
 * Uses InstancedMesh for optimal performance
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ParticleData } from './types';

interface ParticleStreamProps {
  orbPositions: THREE.Vector3[];
}

export default function ParticleStream({ orbPositions }: ParticleStreamProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = 1000;

  // Initialize particle data
  const particles = useMemo<ParticleData[]>(() => {
    return Array.from({ length: particleCount }, () => ({
      progress: Math.random(),
      speed: 0.3 + Math.random() * 0.4,
      targetOrb: Math.floor(Math.random() * 10), // 0-9 orbs
      pathOffset: {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.5,
      },
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Gradient colors for particles
  const particleMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#703AE6'), // Violet
      transparent: true,
      opacity: 0.8,
    });
  }, []);

  // Update particle positions each frame
  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh || orbPositions.length === 0) return;

    particles.forEach((particle, i) => {
      // Update progress
      particle.progress += particle.speed * delta;
      if (particle.progress > 1) particle.progress = 0;

      // Get target orb position
      const targetPos =
        orbPositions[particle.targetOrb] || new THREE.Vector3(4, 0, 0);

      // Lerp from reactor center to target orb
      const position = new THREE.Vector3().lerpVectors(
        new THREE.Vector3(0, 0, 0),
        targetPos,
        particle.progress
      );

      // Add sine wave offset for flowing effect
      const offset = new THREE.Vector3(
        particle.pathOffset.x,
        particle.pathOffset.y,
        particle.pathOffset.z
      ).multiplyScalar(Math.sin(particle.progress * Math.PI));

      position.add(offset);

      // Fade in/out effect via scale
      const scale = 0.04 * Math.sin(particle.progress * Math.PI);

      dummy.position.copy(position);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, particleMaterial, particleCount]}
    >
      <sphereGeometry args={[0.05, 8, 8]} />
    </instancedMesh>
  );
}
