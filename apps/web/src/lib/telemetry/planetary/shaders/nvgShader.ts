/**
 * nvgShader.ts — Night Vision Goggles (NVG) Phosphor Green Post-Processing
 * Adapted from MIT-licensed GLSL shader in bilawalsidhu/gods-eye-view
 */

export const NVG_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D colorTexture;
  uniform vec2 colorTextureDimensions;
  uniform float intensity;
  in vec2 v_textureCoordinates;

  void main() {
    vec2 uv = v_textureCoordinates;
    vec4 baseColor = texture(colorTexture, uv);

    // Optical luminance
    float luma = dot(baseColor.rgb, vec3(0.299, 0.587, 0.114));

    // P22 Green Phosphor spectral response
    vec3 phosphorGreen = vec3(0.12, 0.95, 0.28) * luma * 1.35;

    // Optical lens vignette
    vec2 centered = uv * 2.0 - 1.0;
    float dist = length(centered);
    float vignette = 1.0 - smoothstep(0.65, 1.25, dist);

    vec3 nvgColor = phosphorGreen * vignette;
    vec3 blended = mix(baseColor.rgb, nvgColor, intensity);

    out_FragColor = vec4(blended, baseColor.a);
  }
`;
