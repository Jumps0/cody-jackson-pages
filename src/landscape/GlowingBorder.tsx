import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';

interface GlowingBorderProps {
  bounds: THREE.Box3; // same shared Box3 as the grid
  color?: string;
  glowHeight?: number;
  lineOpacity?: number;
  glowOpacity?: number;
  yOffset?: number;
  taper?: number; // (Optional) How much the top of the glow narrows toward the center (0–1).
}

const GlowingBorder: React.FC<GlowingBorderProps> = ({
  bounds,
  color = '#4a9eff',
  glowHeight = 4,
  lineOpacity = 0.9,
  glowOpacity = 0.35,
  yOffset = 0.05,
  taper = 0.9,
}) => {
  const { line, glow } = useMemo(() => {
    const min = bounds.min.clone();
    const max = bounds.max.clone();
    const y = min.y + yOffset;
    const cx = (min.x + max.x) / 2;
    const cz = (min.z + max.z) / 2;

    // --- Ground rectangle ---
    const corners: [number, number, number][] = [
      [min.x, y, min.z],
      [max.x, y, min.z],
      [max.x, y, max.z],
      [min.x, y, max.z],
    ];
    const linePoints: number[] = [];
    for (let i = 0; i < 4; i++) {
      linePoints.push(...corners[i], ...corners[(i + 1) % 4]);
    }
    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: lineOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lineObj = new THREE.LineSegments(lineGeom, lineMat);

    // --- Vertical glow quads ---
    const baseColor = new THREE.Color(color);
    const topColor = new THREE.Color(color).multiplyScalar(0);
    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    let v = 0;

    const pushQuad = (
      x0: number, z0: number,
      x1: number, z1: number,
    ) => {
      // taper top vertices toward the center
      const tx0 = THREE.MathUtils.lerp(x0, cx, 1 - taper);
      const tz0 = THREE.MathUtils.lerp(z0, cz, 1 - taper);
      const tx1 = THREE.MathUtils.lerp(x1, cx, 1 - taper);
      const tz1 = THREE.MathUtils.lerp(z1, cz, 1 - taper);

      positions.push(x0, y, z0);            colors.push(baseColor.r, baseColor.g, baseColor.b);
      positions.push(x1, y, z1);            colors.push(baseColor.r, baseColor.g, baseColor.b);
      positions.push(tx0, y + glowHeight, tz0); colors.push(topColor.r, topColor.g, topColor.b);
      positions.push(tx1, y + glowHeight, tz1); colors.push(topColor.r, topColor.g, topColor.b);

      indices.push(v, v + 1, v + 2, v + 1, v + 3, v + 2);
      v += 4;
    };

    pushQuad(min.x, min.z, max.x, min.z); // north
    pushQuad(max.x, min.z, max.x, max.z); // east
    pushQuad(max.x, max.z, min.x, max.z); // south
    pushQuad(min.x, max.z, min.x, min.z); // west

    const glowGeom = new THREE.BufferGeometry();
    glowGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    glowGeom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    glowGeom.setIndex(indices);

    const glowMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: glowOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const glowObj = new THREE.Mesh(glowGeom, glowMat);

    return { line: lineObj, glow: glowObj };
  }, [bounds, color, glowHeight, lineOpacity, glowOpacity, yOffset, taper]);

  useEffect(() => () => {
    line.geometry.dispose();
    (line.material as THREE.Material).dispose();
    glow.geometry.dispose();
    (glow.material as THREE.Material).dispose();
  }, [line, glow]);

  return (
    <>
      <primitive object={glow} renderOrder={3} />
      <primitive object={line} renderOrder={4} />
    </>
  );
};

export default GlowingBorder;