'use client';

/**
 * ReactorScene3D - Canvas container with Three.js scene
 * Features: Lighting, post-processing, mouse interaction, scroll animation
 */

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import ReactorCore from './ReactorCore';
import ProtocolOrbs from './ProtocolOrbs';
import ParticleStream from './ParticleStream';

// Scene component with all 3D elements
function Scene() {
  const reactorRef = useRef<THREE.Mesh>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2(0, 0));
  const mousePosition = useRef(new THREE.Vector2(0, 0));
  const [orbPositions, setOrbPositions] = useState<THREE.Vector3[]>([]);
  const { camera } = useThree();

  // Handle mouse/pointer movement
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Raycaster interaction
  useFrame(() => {
    if (!reactorRef.current) return;

    raycaster.current.setFromCamera(mouse.current, camera);
    const intersects = raycaster.current.intersectObject(reactorRef.current);

    if (intersects.length > 0 && reactorRef.current.material) {
      // Update shader uniform with intersection point
      const material = reactorRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        mousePosition.current.set(intersects[0].point.x, intersects[0].point.y);
        material.uniforms.uDisplacementAmplitude.value = 0.3;
      }
    } else if (reactorRef.current.material) {
      // Dampen displacement when not hovering
      const material = reactorRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.uDisplacementAmplitude.value = THREE.MathUtils.lerp(
          material.uniforms.uDisplacementAmplitude.value,
          0.15,
          0.05
        );
      }
    }
  });

  // Scroll-triggered camera animation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.to(camera.position, {
      z: 4,
      scrollTrigger: {
        trigger: '#credit-reactor-section',
        start: 'top top',
        end: '+=20vh',
        scrub: true,
      },
    });
  }, [camera]);

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#703AE6" />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#FC5457" />

      {/* Reactor Core */}
      <ReactorCore ref={reactorRef} mousePosition={mousePosition.current} />

      {/* Protocol Orbs */}
      <ProtocolOrbs onOrbPositionsUpdate={setOrbPositions} />

      {/* Particle Stream */}
      {orbPositions.length > 0 && <ParticleStream orbPositions={orbPositions} />}

      {/* Post-processing Effects */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.85}
          luminanceSmoothing={0.9}
          intensity={1.5}
          radius={0.4}
          mipmapBlur
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.003, 0.003)}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}

export default function ReactorScene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: '#111111' }}
    >
      <color attach="background" args={['#111111']} />
      <Scene />
    </Canvas>
  );
}
