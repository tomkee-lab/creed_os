/**
 * flirShader.ts — Authentic FLIR Ironbow & White-Hot Thermal Post-Processing
 * Adapted from MIT-licensed GLSL shader in bilawalsidhu/gods-eye-view
 */

export const FLIR_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D colorTexture;
  uniform vec2 colorTextureDimensions;
  uniform float intensity;
  in vec2 v_textureCoordinates;

  // Classic FLIR Ironbow thermal spectrum
  vec3 ironbow(float t) {
    t = clamp(t, 0.0, 1.0);
    const vec3 c0 = vec3(0.0, 0.0, 0.0);     // Cold black
    const vec3 c1 = vec3(0.13, 0.0, 0.30);   // Deep violet
    const vec3 c2 = vec3(0.49, 0.0, 0.45);   // Magenta
    const vec3 c3 = vec3(0.86, 0.10, 0.18);  // Crimson
    const vec3 c4 = vec3(1.0, 0.55, 0.0);    // Amber
    const vec3 c5 = vec3(1.0, 0.91, 0.32);   // Yellow
    const vec3 c6 = vec3(1.0, 1.0, 1.0);     // Hot white
    float s = t * 6.0;
    if (s < 1.0) return mix(c0, c1, s);
    if (s < 2.0) return mix(c1, c2, s - 1.0);
    if (s < 3.0) return mix(c2, c3, s - 2.0);
    if (s < 4.0) return mix(c3, c4, s - 3.0);
    if (s < 5.0) return mix(c4, c5, s - 4.0);
    return mix(c5, c6, s - 5.0);
  }

  void main() {
    vec2 uv = v_textureCoordinates;
    vec4 baseColor = texture(colorTexture, uv);

    // Compute luminance from optical spectrum
    float luma = dot(baseColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Map to Ironbow thermal gradient
    vec3 thermal = ironbow(luma);

    // Subtle center crosshair marker
    vec2 center = abs(uv - vec2(0.5));
    float cross = (step(center.x, 0.001) * step(center.y, 0.03)) +
                  (step(center.y, 0.001) * step(center.x, 0.03));
    thermal += vec3(cross * 0.4);

    vec3 blended = mix(baseColor.rgb, thermal, intensity);
    out_FragColor = vec4(blended, baseColor.a);
  }
`;
