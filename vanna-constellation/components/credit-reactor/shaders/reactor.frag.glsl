// Reactor Core Fragment Shader
// Fresnel rim lighting with gradient coloring

uniform vec3 uGradientColorStart;  // Imperial Red #FC5457
uniform vec3 uGradientColorEnd;    // Violet #703AE6
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
  float gradientMix = (vWorldPosition.y + 2.0) / 4.0; // Normalize to 0-1
  gradientMix = clamp(gradientMix, 0.0, 1.0);

  vec3 baseColor = mix(uGradientColorStart, uGradientColorEnd, gradientMix);

  // Apply Fresnel rim glow
  vec3 rimColor = uGradientColorEnd * 1.5; // Violet glow
  vec3 finalColor = mix(baseColor, rimColor, fresnel);

  // Add subtle pulsing
  float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
  finalColor *= pulse;

  // Output with controlled opacity
  float finalOpacity = uOpacity * (0.7 + fresnel * 0.3);
  gl_FragColor = vec4(finalColor, finalOpacity);
}
