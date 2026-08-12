// PSX/Shenmue-ish shader pack (build-time only; zero runtime ML).
// Vertex lighting + dithered shadows + soft fog + warm-rust palette + light CRT scanlines.
// Bayer 4x4 dithering quantizes the per-vertex-lit result to a 5-step ramp, the
// PSX look. The fabulated variant tints magenta and runs a hatch pattern so the
// "declared fabulation" elements never pass as record.

export const psxVertex = /* glsl */ `
  varying vec3 vViewNormal;
  varying vec3 vWorldPos;
  varying vec2 vUvBox;

  void main() {
    vViewNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vUvBox = uv;
    gl_Position = projectionMatrix * mv;
  }
`;

const PSX_FRAG_BODY = /* glsl */ `
  precision mediump float;
  varying vec3 vViewNormal;
  varying vec3 vWorldPos;
  varying vec2 vUvBox;
  uniform vec3 uLightDir;       // view-space directional light
  uniform vec3 uRust;            // warm-rust base tint
  uniform vec3 uFabTint;        // fabulation tint (only used when uFabulated=1)
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uTime;
  uniform float uFabulated;      // 1.0 for {mixed,heavy} elements in full mode
  uniform float uOpacity;        // 1.0 normally; <1 for ghosted evidence-only mode
  uniform float uScanline;       // 0..1 strength

  // 4x4 Bayer threshold matrix, normalized to [0,1].
  float bayer4x4(vec2 p) {
    int x = int(mod(p.x, 4.0));
    int y = int(mod(p.y, 4.0));
    int idx = x + y * 4;
    // Bayer 4x4 as a lookup by integer index 0..15.
    float m[16];
    m[0]=0.0; m[1]=8.0; m[2]=2.0; m[3]=10.0;
    m[4]=12.0; m[5]=4.0; m[6]=14.0; m[7]=6.0;
    m[8]=3.0; m[9]=11.0; m[10]=1.0; m[11]=9.0;
    m[12]=15.0; m[13]=7.0; m[14]=13.0; m[15]=5.0;
    return m[idx] / 16.0;
  }

  void main() {
    vec3 n = normalize(vViewNormal);
    float ndl = clamp(dot(n, normalize(uLightDir)) * 0.5 + 0.5, 0.0, 1.0);

    // PSX 5-step lighting ramp.
    float ramp = floor(ndl * 5.0) / 5.0;

    // Dithered shadows: a screen-space dither pushes the quantization boundary
    // so the band edges shimmer like the PSX/Quake dither pattern.
    float d = bayer4x4(gl_FragCoord.xy);
    float dithered = clamp(ramp + (d - 0.5) * (1.0 / 5.0), 0.0, 1.0);

    vec3 base = uRust;
    if (uFabulated > 0.5) {
      // Fabulated geometry: tint magenta and overlay a diagonal hatch so it
      // is visually distinct from evidence-grounded geometry, never passed
      // off as record (thesis T2).
      float hatch = step(0.5, fract((vUvBox.x + vUvBox.y) * 12.0));
      base = mix(uRust * 0.6, uFabTint, 0.6) + hatch * 0.05;
    }

    vec3 col = base * (0.35 + 0.65 * dithered);

    // Soft fog.
    float dist = length(vWorldPos - cameraPosition);
    float fog = clamp((dist - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
    col = mix(col, uFogColor, fog);

    // Light CRT scanlines.
    float scan = 1.0 - uScanline * 0.15 * (0.5 + 0.5 * sin(gl_FragCoord.y * 3.14159));
    col *= scan;

    gl_FragColor = vec4(col, uOpacity);
  }
`;

export const psxFragment = PSX_FRAG_BODY;
