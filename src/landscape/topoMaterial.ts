// topoMaterial.ts — full replacement

import * as THREE from 'three';

export function createTopoMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTopColor:    { value: new THREE.Color(0x7fc4ff) },
      uBottomColor: { value: new THREE.Color(0x0b2f5c) },
      uHeightRange: { value: new THREE.Vector2(-5.0, 20.0) },
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
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform vec2 uHeightRange;
      varying vec3 vWorldPos;

      void main() {
        float t = clamp(
          (vWorldPos.y - uHeightRange.x) /
          max(uHeightRange.y - uHeightRange.x, 0.0001),
          0.0, 1.0
        );
        vec3 color = mix(uBottomColor, uTopColor, t);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    side: THREE.DoubleSide,
  });
}