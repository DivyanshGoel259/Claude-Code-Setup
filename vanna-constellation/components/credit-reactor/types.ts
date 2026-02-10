/**
 * Type definitions for Credit Reactor components
 */

export interface ProtocolOrb {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  orbitRadius: number;
  orbitSpeed: number;
  orbitAxis: {
    x: number;
    y: number;
    z: number;
  };
}

export interface ParticleData {
  progress: number;
  speed: number;
  targetOrb: number;
  pathOffset: {
    x: number;
    y: number;
    z: number;
  };
}

export interface ReactorUniforms {
  uTime: { value: number };
  uMousePosition: { value: [number, number] };
  uDisplacementAmplitude: { value: number };
  uGradientColorStart: { value: string };
  uGradientColorEnd: { value: string };
  uOpacity: { value: number };
}
