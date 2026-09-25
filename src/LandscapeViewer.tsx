// LandscapeViewer.tsx
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useMapScene } from './useMapScene';
import type { BuildingEntry } from './useMapScene';
import { createTopoBigMaterial } from './topoBigMaterial';
import { createTopoMaterial } from './topoMaterial';
import { Building } from './Building';
import { RegionLabel } from './RegionLabel';
import { BuildingTooltip } from './BuildingTooltip';
import LandscapeGrid from './LandscapeGrid';
import GlowingBorder from './GlowingBorder';
import './LandscapeViewer.css';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const TOPO_LAYER = 1;

interface LandscapeViewerProps {
  modelPath: string;
  minZoom?: number;
  maxZoom?: number;
}

const ContextLossHandler: React.FC = () => {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (e: Event) => e.preventDefault();
    canvas.addEventListener('webglcontextlost', lost, false);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl]);
  return null;
};

function computeMapExtents(
  terrain: THREE.Object3D,
  cellSize: number,
  marginCells: number = 0,
): { bounds: THREE.Box3; cellSize: number; divisions: number } {
  const box = new THREE.Box3().setFromObject(terrain);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  // Snap to nearest whole cell, then add margin in whole cells
  const rawX = size.x / cellSize;
  const rawZ = size.z / cellSize;
  const divisionsX = Math.max(1, Math.ceil(rawX) + marginCells * 2);
  const divisionsZ = Math.max(1, Math.ceil(rawZ) + marginCells * 2);

  // Use a single square grid so lat/long lines are uniform.
  const extent = Math.max(divisionsX, divisionsZ) * cellSize;
  const divisions = Math.max(divisionsX, divisionsZ);
  const squareBounds = new THREE.Box3(
    new THREE.Vector3(center.x - extent / 2, box.min.y, center.z - extent / 2),
    new THREE.Vector3(center.x + extent / 2, box.max.y, center.z + extent / 2),
  );

  return { bounds: squareBounds, cellSize, divisions };
}

const Scene: React.FC<{ modelPath: string }> = ({ modelPath }) => {
  const parsed = useMapScene(modelPath);
  const [hovered, setHovered] = useState<BuildingEntry | null>(null);

  // Terrain material
  const terrainMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#133057', // Flat dark blue
    roughness: 0.95,
    metalness: 0.0,
    transparent: true, // transparent! Topo lines are most imporant to see.
    opacity: 0.8,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,   // push terrain back
    polygonOffsetUnits: 1,
  }), []);

  const topoMaterial = useMemo(() => createTopoMaterial(), []);
  const topoBigMaterial = useMemo(() => createTopoBigMaterial(), []);

  useEffect(() => {
    if (!parsed) return;
    [parsed.topo, parsed.topoBig, parsed.topoBig2].forEach((obj) => {
      if (!obj) return;
      obj.layers.enable(TOPO_LAYER);
      obj.traverse((o) => o.layers.enable(TOPO_LAYER));
    });
  }, [parsed]);

  const mapExtents = useMemo(() => {
    if (!parsed?.terrain) return null;
    // cellSize = 1 → grid is 1 unit per cell
    // marginCells = 2 → 2 extra cells of ocean on every side
    return computeMapExtents(parsed.terrain, 1, 2);
  }, [parsed]);


  useEffect(() => {
    if (!parsed) return;

    if (parsed.terrain) {
      parsed.terrain.material = terrainMaterial;
    }

    if (parsed.topo) {
      parsed.topo.material = topoMaterial;

      // Auto-tune gradient range from the terrain's bounding box so the whole topo mesh uses the full color range.
      const ref = parsed.terrain ?? parsed.topo;
      ref.geometry.computeBoundingBox();
      const bb = ref.geometry.boundingBox;
      if (bb) {
        // If the terrain mesh itself is transformed, use its world bbox instead.
        const worldBox = new THREE.Box3().setFromObject(ref);
        (topoMaterial.uniforms.uHeightRange.value as THREE.Vector2).set(
          worldBox.min.y,
          worldBox.max.y,
        );
      }
    }

    if (parsed.topoBig) {
      parsed.topoBig.material = topoBigMaterial;

      // Reuse the terrain bbox for height range so the fade is consistent
      const ref = parsed.terrain ?? parsed.topoBig;
      const worldBox = new THREE.Box3().setFromObject(ref);
      (topoBigMaterial.uniforms.uHeightRange.value as THREE.Vector2).set(
        worldBox.min.y,
        worldBox.max.y,
      );
    }

    if (parsed.topoBig2) {
      parsed.topoBig2.material = topoBigMaterial;

      // Reuse the terrain bbox for height range so the fade is consistent
      const ref = parsed.terrain ?? parsed.topoBig2;
      const worldBox = new THREE.Box3().setFromObject(ref);
      (topoBigMaterial.uniforms.uHeightRange.value as THREE.Vector2).set(
        worldBox.min.y,
        worldBox.max.y,
      );
    }

  }, [parsed, terrainMaterial, topoMaterial, topoBigMaterial]);

  if (!parsed) return null;

  return (
    <>
      <ContextLossHandler />

      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.0} />
      <hemisphereLight args={[0x8899bb, 0x0a0a0a, 0.4]} />

      {/* Terrain */}
      {parsed.terrain && (
        <primitive object={parsed.terrain} renderOrder={0} />
      )}
      {/* Topgraphical data (minor rings) */}
      {parsed.topo && (
        <primitive object={parsed.topo} renderOrder={1} />
      )}

      {/* Topgraphical data (Major rings) */}
      {parsed.topoBig && <primitive object={parsed.topoBig} renderOrder={2} />}
      {parsed.topoBig2 && <primitive object={parsed.topoBig2} renderOrder={2} />}

      {/* Buildings */}
      {parsed.buildings.map((b) => (
        <Building
          key={b.id}
          entry={b}
          hovered={hovered?.id === b.id}
          onHover={setHovered}
          onUnhover={(e) => setHovered((cur) => (cur?.id === e.id ? null : cur))}
        />
      ))}

      {/* Region labels (flat on terrain, world-space) */}
      {parsed.regions.map((r) => (
        <RegionLabel key={r.id} entry={r} />
      ))}

      {mapExtents && (
        <>
          <LandscapeGrid
            bounds={mapExtents.bounds}
            cellSize={mapExtents.cellSize}
            color="#9fbfe2"
            opacity={0.18}
          />
          <GlowingBorder
            bounds={mapExtents.bounds}
            color="#9fbfe2"
            glowHeight={1.5}
            lineOpacity={0.9}
            glowOpacity={0.25}
            yOffset={-0.05}
            taper={1}
          />
        </>
      )}

      {/* Hover tooltip */}
      {hovered && <BuildingTooltip entry={hovered} />}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={25}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.1}
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE,
        }}
        touches={{
          ONE: THREE.TOUCH.PAN,
          TWO: THREE.TOUCH.DOLLY_ROTATE,
        }}
      />
    </>
  );
};

const LandscapeViewer: React.FC<LandscapeViewerProps> = ({
  modelPath,
}) => {
  return (
    <div className="landscape-viewer-container">
      <Canvas
        camera={{ position: [20, 20, 20], fov: 50, near: 0.1, far: 1000 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }} // Required so the topographical lines aren't horrendous to look at.
        dpr={[1, 2]}
        style={{ background: '#071322' }} // Dark blue "sea" background color
      >
        <Suspense fallback={null}>
          <Scene modelPath={modelPath} />
          <EffectComposer multisampling={8}>
            <Bloom // Bloom! Generally makes everything look better
              intensity={1.2}
              luminanceThreshold={0.4}
              luminanceSmoothing={0.2}
              mipmapBlur
              radius={0.7}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default LandscapeViewer;