// Building.tsx
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { BuildingEntry } from './useMapScene';

interface BuildingProps {
  entry: BuildingEntry;
  hovered: boolean;
  onHover: (entry: BuildingEntry) => void;
  onUnhover: (entry: BuildingEntry) => void;
}

const BASE_COLOR = new THREE.Color(0xd97b28);   // warm amber
const HOVER_COLOR = new THREE.Color(0xffb060);  // brighter amber
const OUTLINE_COLOR = new THREE.Color(0xffe0a0);

export const Building: React.FC<BuildingProps> = ({
  entry,
  hovered,
  onHover,
  onUnhover,
}) => {
  const { mesh } = entry;
  const outlineRef = useRef<THREE.LineSegments>(null);

  // Apply a solid amber material once
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: BASE_COLOR.clone(),
      emissive: new THREE.Color(0x000000),
      roughness: 0.7,
      metalness: 0.05,
    });
    mesh.material = m;
    return m;
  }, [mesh]);

  // Compute outline geometry from the mesh's edges
  const outlineGeometry = useMemo(() => {
    if (!(mesh.geometry instanceof THREE.BufferGeometry)) return null;
    return new THREE.EdgesGeometry(mesh.geometry, 30);
  }, [mesh.geometry]);

  // Animate color on hover
  useFrame(() => {
    const target = hovered ? HOVER_COLOR : BASE_COLOR;
    material.color.lerp(target, 0.15);
    material.emissive.lerp(
      hovered ? new THREE.Color(0x552200) : new THREE.Color(0x000000),
      0.15,
    );
    if (outlineRef.current) {
      (outlineRef.current.material as THREE.LineBasicMaterial).opacity = hovered ? 1 : 0;
    }
  });

  return (
    <group>
      <primitive
        object={mesh}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          onHover(entry);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e: any) => {
          e.stopPropagation();
          onUnhover(entry);
          document.body.style.cursor = 'default';
        }}
      />
      {outlineGeometry && (
        <lineSegments
          ref={outlineRef}
          geometry={outlineGeometry}
          position={mesh.position}
          rotation={mesh.rotation}
          scale={mesh.scale}
        >
          <lineBasicMaterial
            color={OUTLINE_COLOR}
            transparent
            opacity={0}
            depthTest={false}
          />
        </lineSegments>
      )}
    </group>
  );
};