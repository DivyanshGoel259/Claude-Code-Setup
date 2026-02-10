// Reactor Core Vertex Shader
// Handles vertex displacement with wave animation and mouse interaction

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
