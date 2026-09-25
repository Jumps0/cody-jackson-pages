// useMapScene.ts
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

export interface BuildingEntry {
  id: string;
  displayName: string;
  mesh: THREE.Mesh;
  worldPosition: THREE.Vector3;
}

export interface RegionEntry {
  id: string;
  displayName: string;
  position: THREE.Vector3;
  scale: number; // multiplier of default font size (1.0 = default)
}

export interface ParsedScene {
  terrain: THREE.Mesh | null;   // "Plane"
  topo: THREE.Mesh | null;      // "Topo"
  topoBig: THREE.Mesh | null;   // "Topo-Big"
  topoBig2: THREE.Mesh | null;   // "Topo-Big2"
  buildings: BuildingEntry[];
  regions: RegionEntry[];
  root: THREE.Object3D;
}

// Region names contain their respective text scale at the start of their names, e.g.:
// Parse "50Sea" -> { scale: 0.5, name: "Sea" }
// Parse "120Capital" -> { scale: 1.2, name: "Capital" }
// Parse "Sea" -> { scale: 1.0, name: "Sea" }
function parseRegionName(raw: string): { scale: number; name: string } {
  const match = raw.match(/^(\d+)(.+)$/);
  if (match) {
    return {
      scale: parseInt(match[1], 10) / 100,
      name: match[2],
    };
  }
  return { scale: 1.0, name: raw };
}

// "GreatHouse" -> "Great House"; "OldTown_Hall" -> "Old Town Hall" (underscore -> space too)
function camelToDisplayName(raw: string): string {
  return raw
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

export function useMapScene(modelPath: string): ParsedScene | null {
  const { scene } = useGLTF(modelPath);
  const [parsed, setParsed] = useState<ParsedScene | null>(null);

  useEffect(() => {
    // Clone so hot-reload / StrictMode remounts don't share mutated materials
    const root = scene.clone(true);
    root.updateMatrixWorld(true);

    let terrain: THREE.Mesh | null = null;
    let topo: THREE.Mesh | null = null;
    let topoBig: THREE.Mesh | null = null;
    let topoBig2: THREE.Mesh | null = null;
    const buildings: BuildingEntry[] = [];
    const regions: RegionEntry[] = [];

    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const name = child.name || '';

      if (name === 'Plane') {
        terrain = child;
        return;
      }

      if (name === 'Topo') {
        topo = child;
        return;
      }

      if (name === 'Topo-Big') {
        topoBig = child;
        return;
      }

      if (name === 'Topo-Big2') {
        topoBig2 = child;
        return;
      }

      if (name.startsWith('building_')) {
        const raw = name.slice('building_'.length);
        const displayName = camelToDisplayName(raw);

        // Compute top-center in world space
        const box = new THREE.Box3().setFromObject(child);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);
        const worldPosition = new THREE.Vector3(
          center.x,
          box.max.y,
          center.z,
        );

        buildings.push({
          id: child.uuid,
          displayName,
          mesh: child as THREE.Mesh,
          worldPosition,
        });
        return;
      }

      if (name.startsWith('region_')) {
        const raw = name.slice('region_'.length);
        const { scale, name: baseName } = parseRegionName(raw);
        const displayName = camelToDisplayName(baseName);

        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);

        regions.push({
          id: child.uuid,
          displayName,
          position: worldPos,
          scale,
        });
        return;
      }
    });

    setParsed({ terrain, topo, topoBig, topoBig2, buildings, regions, root });
  }, [scene]);

  return parsed;
}