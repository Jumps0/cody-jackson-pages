// BuildingTooltip.tsx
import React from 'react';
import { Html } from '@react-three/drei';
import type { BuildingEntry } from './useMapScene';

interface BuildingTooltipProps {
  entry: BuildingEntry;
}

export const BuildingTooltip: React.FC<BuildingTooltipProps> = ({ entry }) => {
  return (
    <Html
      position={[
        entry.worldPosition.x,
        entry.worldPosition.y + 0.75, // float above the object
        entry.worldPosition.z,
      ]}
      center
      distanceFactor={15}   // scales the tooltip with distance
      zIndexRange={[100, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <div className="building-tooltip">{entry.displayName}</div>
    </Html>
  );
};