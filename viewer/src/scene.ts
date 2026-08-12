import * as THREE from 'three';
import { psxVertex, psxFragment } from './shaders';
import type { PackManifest, Entity, SynthesisTier } from './types';
import { FABULATED } from './types';

export interface LoadedEntity {
  entity: Entity;
  mesh: THREE.Mesh;
  isFabulated: boolean;
}

export interface LoadedEpoch {
  pack: string;
  epoch: string;
  group: THREE.Group;
  entities: LoadedEntity[];
}

const RUST = new THREE.Color('#8a4a2c');
const FAB_TINT = new THREE.Color('#b23fae');
const FOG = new THREE.Color('#c08a5a');

function makeMaterial(fab: boolean, opacity: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uLightDir: { value: new THREE.Vector3(0.4, 0.8, 0.6) },
      uRust: { value: RUST.clone() },
      uFabTint: { value: FAB_TINT.clone() },
      uFogColor: { value: FOG.clone() },
      uFogNear: { value: 8 },
      uFogFar: { value: 28 },
      uTime: { value: 0 },
      uFabulated: { value: fab ? 1 : 0 },
      uOpacity: { value: opacity },
      uScanline: { value: 0.35 },
    },
    vertexShader: psxVertex,
    fragmentShader: psxFragment,
    transparent: opacity < 1,
    depthWrite: opacity >= 1,
  });
}

// Procedural placeholder for missing glb geometry (M2/M3 handoff: only .gitkeep
// is present in geometry/). Box scaled by entity index, laid out on a row so
// the slider's epoch swap is visually distinct. When M3 ships real glbs the
// same fetch hook can swap in GLTFLoader output here without touching the rest.
async function loadEntityGeometry(entity: Entity, index: number, total: number): Promise<THREE.BufferGeometry> {
  const geom = new THREE.BoxGeometry(1.4, 1.6 + (index % 3) * 0.4, 1.4);
  // Lay entities on a row along x with a small street zig-zag.
  const span = 7.0;
  const x = (index - (total - 1) / 2) * 1.7;
  const z = Math.sin(index * 1.7) * 0.6;
  geom.translate(x, 0.8, z);
  return geom;
}

export async function loadEpoch(baseUrl: string, packSlug: string): Promise<LoadedEpoch> {
  const res = await fetch(`${baseUrl}packs/${packSlug}/manifest.json`);
  if (!res.ok) throw new Error(`failed to load manifest ${packSlug}: ${res.status}`);
  const manifest: PackManifest = await res.json();

  const group = new THREE.Group();
  const entities: LoadedEntity[] = [];
  for (let i = 0; i < manifest.entities.length; i++) {
    const entity = manifest.entities[i];
    const isFab = FABULATED.includes(entity.synthesis_tier);
    const geom = await loadEntityGeometry(entity, i, manifest.entities.length);
    const mat = makeMaterial(isFab, 1);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.userData.entity = entity;
    mesh.userData.tier = entity.synthesis_tier;
    mesh.userData.isFabulated = isFab;
    group.add(mesh);
    entities.push({ entity, mesh, isFabulated: isFab });
  }
  return { pack: packSlug, epoch: manifest.epoch, group, entities };
}

export function setEvidenceOnly(epoch: LoadedEpoch, on: boolean) {
  for (const le of epoch.entities) {
    const m = le.mesh.material as THREE.ShaderMaterial;
    if (on && le.isFabulated) {
      m.uniforms.uOpacity.value = 0.15;
      (m as any).transparent = true;
      m.depthWrite = false;
      le.mesh.visible = true;
    } else {
      m.uniforms.uOpacity.value = 1;
      m.transparent = false;
      m.depthWrite = true;
      le.mesh.visible = true;
    }
  }
}

export function countVisible(epoch: LoadedEpoch): { visible: number; fabVisible: number } {
  let visible = 0, fabVisible = 0;
  for (const le of epoch.entities) {
    if (!le.mesh.visible) continue;
    visible++;
    if (le.isFabulated) fabVisible++;
  }
  return { visible, fabVisible };
}

export { THREE };
