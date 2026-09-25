// RegionLabel.tsx
import React from 'react';
import { Text } from '@react-three/drei';
import type { RegionEntry } from './landscape/useMapScene';

interface RegionLabelProps {
  entry: RegionEntry;
}

const DEFAULT_FONT_SIZE = 0.5;

export const RegionLabel: React.FC<RegionLabelProps> = ({ entry }) => {
  return (
    <Text
      position={[entry.position.x, entry.position.y+0.1, entry.position.z]}
      rotation={[-Math.PI / 2, 0, 0]} // Rotate -90° on X to lie flat on the ground, facing up (+Y)
      font="ACES07_Regular.otf"
      fontSize={DEFAULT_FONT_SIZE * entry.scale}
      color="#cfe6ff"
      anchorX="center"
      anchorY="middle"
      //outlineWidth={0.04} // Looks better without outline
      //outlineColor="#0d1a2b"
      renderOrder={1} // Frustum-cull false is fine here due to low region count
    >
      {entry.displayName}
    </Text>
  );
};