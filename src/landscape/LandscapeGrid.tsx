// LandscapeGrid.tsx
import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';

interface LandscapeGridProps {
  bounds: THREE.Box3; // World-space bounding box of the terrain (use .setFromObject(terrain)).
  yOffset?: number; // Vertical offset below the terrain's lowest point.
  cellSize?: number; // Size of one grid cell in world units.
  color?: string; // Grid line color.
  opacity?: number; // Opacity of the grid lines.
}

const LandscapeGrid: React.FC<LandscapeGridProps> = ({
  bounds,
  cellSize = 1,
  color = '#4a9eff',
  opacity = 0.18,
  yOffset = 0.05,
}) => {
  const { grid, center, y } = useMemo(() => {
    const size = new THREE.Vector3();
    const centerVec = new THREE.Vector3();
    bounds.getSize(size);
    bounds.getCenter(centerVec);

    // Both axes are equal because computeMapExtents squares the bounds.
    const extent = size.x;
    const divisions = Math.max(1, Math.round(extent / cellSize));

    const helper = new THREE.GridHelper(
      extent,
      divisions,
      new THREE.Color(color),
      new THREE.Color(color),
    );
    const mat = helper.material as THREE.LineBasicMaterial;
    mat.transparent = true;
    mat.opacity = opacity;
    mat.depthWrite = false;

    return { grid: helper, center: centerVec, y: bounds.min.y - yOffset };
  }, [bounds, cellSize, color, opacity, yOffset]);

  useEffect(() => {
    grid.position.set(center.x, y, center.z);
  }, [grid, center, y]);

  useEffect(() => () => {
    grid.geometry.dispose();
    (grid.material as THREE.Material).dispose();
  }, [grid]);

  return <primitive object={grid} renderOrder={-1} />;
};

export default LandscapeGrid;