'use client';

/**
 * ProtocolScene3D Component
 * Three.js 3D constellation visualization
 */

import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import { Protocol, ProtocolCategory } from './types';
import * as THREE from 'three';
import gsap from 'gsap';

// ========== Center Vanna Node ==========
function VannaNode() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Pulsing animation
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      // Pulse emissive intensity between 1.2 and 1.8
      material.emissiveIntensity = 1.5 + Math.sin(clock.getElapsedTime() * 2) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#8B5CF6"
        emissive="#8B5CF6"
        emissiveIntensity={1.5}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}

// ========== Protocol Node ==========
interface ProtocolNodeProps {
  protocol: Protocol;
  isHovered: boolean;
  isDimmed: boolean;
  onHover: (protocolId: string | null) => void;
  onClick: (protocol: Protocol) => void;
}

function ProtocolNode({
  protocol,
  isHovered,
  isDimmed,
  onHover,
  onClick,
}: ProtocolNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Hover scale animation
  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: isHovered ? 1.3 : 1,
        y: isHovered ? 1.3 : 1,
        z: isHovered ? 1.3 : 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [isHovered]);

  // Emissive intensity changes on hover
  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = isHovered ? 1.2 : 0.8;
      material.opacity = isDimmed ? 0.2 : 1.0;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[protocol.position.x, protocol.position.y, protocol.position.z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(protocol.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(protocol);
      }}
    >
      <sphereGeometry args={[protocol.size * 0.4, 24, 24]} />
      <meshStandardMaterial
        color={protocol.color}
        emissive={protocol.color}
        emissiveIntensity={0.8}
        metalness={0.2}
        roughness={0.5}
        transparent
        opacity={1.0}
      />
    </mesh>
  );
}

// ========== Connection Line ==========
interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  isHighlighted: boolean;
  isDimmed: boolean;
}

function ConnectionLine({ start, end, isHighlighted, isDimmed }: ConnectionLineProps) {
  const color = isHighlighted ? '#8B5CF6' : '#4B5563';
  const opacity = isDimmed ? 0.2 : isHighlighted ? 1.0 : 0.3;

  return (
    <Line
      points={[start, end]}
      color={color}
      lineWidth={1.5}
      transparent
      opacity={opacity}
    />
  );
}

// ========== Particle System ==========
interface ParticleSystemProps {
  protocols: Protocol[];
  hoveredProtocol: string | null;
  selectedProtocol: Protocol | null;
}

function ParticleSystem({ protocols, hoveredProtocol, selectedProtocol }: ParticleSystemProps) {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = protocols.length * 12; // 12 particles per protocol

  // Initialize particle data
  const particleData = useMemo(() => {
    return protocols.flatMap((protocol) =>
      Array.from({ length: 12 }, (_, i) => ({
        protocolId: protocol.id,
        targetPos: new THREE.Vector3(
          protocol.position.x,
          protocol.position.y,
          protocol.position.z
        ),
        progress: i / 12, // Stagger along line
        speed: 0.05 + Math.random() * 0.05,
      }))
    );
  }, [protocols]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }, delta) => {
    if (!particlesRef.current) return;

    particleData.forEach((particle, i) => {
      // Determine intensity multiplier
      let intensity = 0.3; // Default subtle
      if (hoveredProtocol === particle.protocolId) intensity = 2.0;
      if (selectedProtocol?.id === particle.protocolId) intensity = 3.0;

      // Update progress
      particle.progress += particle.speed * delta * intensity;
      if (particle.progress > 1) particle.progress = 0;

      // Lerp position from center to protocol
      const pos = new THREE.Vector3().lerpVectors(
        new THREE.Vector3(0, 0, 0),
        particle.targetPos,
        particle.progress
      );

      // Fade in/out effect via scale
      const scale = 0.05 * Math.sin(particle.progress * Math.PI);

      dummy.position.copy(pos);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      particlesRef.current!.setMatrixAt(i, dummy.matrix);
    });

    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#8B5CF6" />
    </instancedMesh>
  );
}

// ========== Camera Controller ==========
interface CameraControllerProps {
  selectedProtocol: Protocol | null;
}

function CameraController({ selectedProtocol }: CameraControllerProps) {
  const { camera } = useThree();

  useEffect(() => {
    if (selectedProtocol) {
      // Animate camera to focus on selected protocol
      const targetPos = selectedProtocol.position;
      gsap.to(camera.position, {
        x: targetPos.x * 0.7,
        y: targetPos.y + 2,
        z: targetPos.z * 0.7,
        duration: 1.2,
        ease: 'power2.inOut',
      });
    } else {
      // Return to default position
      gsap.to(camera.position, {
        x: 0,
        y: 8,
        z: 15,
        duration: 1.2,
        ease: 'power2.inOut',
      });
    }
  }, [selectedProtocol, camera]);

  return null;
}

// ========== Main Scene Component ==========
interface SceneProps {
  protocols: Protocol[];
  selectedProtocol: Protocol | null;
  onProtocolClick: (protocol: Protocol) => void;
  hoveredProtocol: string | null;
  onProtocolHover: (protocolId: string | null) => void;
  activeCategory: ProtocolCategory | 'all';
}

function Scene({
  protocols,
  selectedProtocol,
  onProtocolClick,
  hoveredProtocol,
  onProtocolHover,
  activeCategory,
}: SceneProps) {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, 10]} intensity={0.5} />

      {/* Center Vanna Node */}
      <VannaNode />

      {/* Protocol Nodes */}
      {protocols.map((protocol) => {
        const isHovered = hoveredProtocol === protocol.id;
        const isDimmed = activeCategory !== 'all' && protocol.category !== activeCategory;

        return (
          <ProtocolNode
            key={protocol.id}
            protocol={protocol}
            isHovered={isHovered}
            isDimmed={isDimmed}
            onHover={onProtocolHover}
            onClick={onProtocolClick}
          />
        );
      })}

      {/* Connection Lines */}
      {protocols.map((protocol) => {
        const isHighlighted =
          hoveredProtocol === protocol.id || selectedProtocol?.id === protocol.id;
        const isDimmed = activeCategory !== 'all' && protocol.category !== activeCategory;

        return (
          <ConnectionLine
            key={`line-${protocol.id}`}
            start={[0, 0, 0]}
            end={[protocol.position.x, protocol.position.y, protocol.position.z]}
            isHighlighted={isHighlighted}
            isDimmed={isDimmed}
          />
        );
      })}

      {/* Particle System */}
      <ParticleSystem
        protocols={protocols}
        hoveredProtocol={hoveredProtocol}
        selectedProtocol={selectedProtocol}
      />

      {/* Camera Controller */}
      <CameraController selectedProtocol={selectedProtocol} />

      {/* Orbit Controls */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={8}
        maxDistance={30}
      />
    </>
  );
}

// ========== Main Export Component ==========
export default function ProtocolScene3D({
  protocols,
  selectedProtocol,
  onProtocolClick,
  hoveredProtocol,
  onProtocolHover,
  activeCategory,
}: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 8, 15], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: '#0A0A0F' }}
    >
      <color attach="background" args={['#0A0A0F']} />
      <Scene
        protocols={protocols}
        selectedProtocol={selectedProtocol}
        onProtocolClick={onProtocolClick}
        hoveredProtocol={hoveredProtocol}
        onProtocolHover={onProtocolHover}
        activeCategory={activeCategory}
      />
    </Canvas>
  );
}
