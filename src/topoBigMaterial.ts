// topoBigMaterial.ts
import * as THREE from 'three';

export function createTopoBigMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      // A single bright blue, no gradient — this is the "highlight" ring
      uColor: { value: new THREE.Color(0xbfe4ff) }, // very bright pale blue
      uHeightRange: { value: new THREE.Vector2(-1.0, 5.0) },
      uFadeBottom:  { value: 0.65 }, // how much to darken at the bottom (1.0 = no fade)
    },
    vertexShader: /* glsl */`
      varying vec3 vWorldPos;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: /* glsl */`
      uniform vec3  uColor;
      uniform vec2  uHeightRange;
      uniform float uFadeBottom;
      varying vec3  vWorldPos;

      void main() {
        float t = clamp(
          (vWorldPos.y - uHeightRange.x) /
          max(uHeightRange.y - uHeightRange.x, 0.0001),
          0.0, 1.0
        );
        // Fade from full brightness at top to uFadeBottom at the bottom
        float b = mix(uFadeBottom, 1.0, t);
        gl_FragColor = vec4(uColor * b, 1.0);
      }
    `,
    side: THREE.DoubleSide,
  });
}