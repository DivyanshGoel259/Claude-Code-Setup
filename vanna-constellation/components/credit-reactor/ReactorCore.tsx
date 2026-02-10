'use client';

/**
 * ReactorCore - 3D Icosahedron with custom shaders
 * Features: Fresnel rim lighting, vertex displacement, mouse interaction
 */

import { useRef, useMemo, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Inline vertex shader
const reactorVertShader = `
uniform float uTime;
uniform vec2 uMousePosition;
uniform float uDisplacementAmplitude;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;

  // Calculate wave-based displacement
  float frequency = 2.0;
  float wave1 = sin(position.x * frequency + uTime * 1.5) * 0.5;
  float wave2 = cos(position.y * frequency + uTime * 1.2) * 0.5;
  float wave3 = sin(position.z * frequency + uTime * 1.8) * 0.5;

  float displacement = (wave1 + wave2 + wave3) * uDisplacementAmplitude;

  // Add mouse-influenced warp
  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  float distanceToMouse = distance(worldPos.xy, uMousePosition);
  float mouseInfluence = smoothstep(3.0, 0.0, distanceToMouse) * uDisplacementAmplitude * 2.0;

  displacement += mouseInfluence;

  // Apply displacement along normal
  vec3 newPosition = position + normal * displacement;

  vWorldPosition = (modelMatrix * vec4(newPosition, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

// Inline fragment shader
const reactorFragShader = `
uniform vec3 uGradientColorStart;
uniform vec3 uGradientColorEnd;
uniform float uOpacity;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
  // Calculate view direction
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);

  // Fresnel effect (rim lighting)
  float fresnelPower = 2.5;
  float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), fresnelPower);

  // Gradient based on world Y position
  float gradientMix = (vWorldPosition.y + 2.0) / 4.0;
  gradientMix = clamp(gradientMix, 0.0, 1.0);

  vec3 baseColor = mix(uGradientColorStart, uGradientColorEnd, gradientMix);

  // Apply Fresnel rim glow
  vec3 rimColor = uGradientColorEnd * 1.5;
  vec3 finalColor = mix(baseColor, rimColor, fresnel);

  // Add subtle pulsing
  float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
  finalColor *= pulse;

  // Output with controlled opacity
  float finalOpacity = uOpacity * (0.7 + fresnel * 0.3);
  gl_FragColor = vec4(finalColor, finalOpacity);
}
`;

interface ReactorCoreProps {
  mousePosition: THREE.Vector2;
}

const ReactorCore = forwardRef<THREE.Mesh, ReactorCoreProps>(
  ({ mousePosition }, ref) => {
    const meshRef = useRef<THREE.Mesh>(null);

    // Custom shader material uniforms
    const uniforms = useMemo(
      () => ({
        uTime: { value: 0 },
        uMousePosition: { value: new THREE.Vector2(0, 0) },
        uDisplacementAmplitude: { value: 0.15 },
        uGradientColorStart: { value: new THREE.Color('#FC5457') }, // Imperial Red
        uGradientColorEnd: { value: new THREE.Color('#703AE6') }, // Violet
        uOpacity: { value: 0.85 },
      }),
      []
    );

    // Update uniforms each frame
    useFrame(({ clock }) => {
      if (meshRef.current) {
        const material = meshRef.current.material as THREE.ShaderMaterial;
        material.uniforms.uTime.value = clock.getElapsedTime();
        material.uniforms.uMousePosition.value.copy(mousePosition);
      }
    });

    // Expose ref to parent
    if (ref && typeof ref !== 'function') {
      (ref as any).current = meshRef.current;
    }

    return (
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[2, 1]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={reactorVertShader}
          fragmentShader={reactorFragShader}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    );
  }
);

ReactorCore.displayName = 'ReactorCore';

export default ReactorCore;
