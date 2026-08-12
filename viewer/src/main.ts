import * as THREE from 'three';
import { loadEpoch, setEvidenceOnly, countVisible, type LoadedEpoch } from './scene';

const EPOCHS = [
  { slug: 'ile-de-la-cite-block', label: '1860s (pre-Haussmann)' },
  { slug: 'ile-de-la-cite-block-1880', label: '1880s (post-clearance)' },
];
const BASE = './';

const app = document.getElementById('app')!;
const canvas = document.createElement('canvas');
canvas.id = 'viewer-canvas';
canvas.style.display = 'block';
canvas.style.width = '100%';
canvas.style.height = '100%';
app.appendChild(canvas);

const hudState = document.getElementById('hud-state')!;
const epochLabel = document.getElementById('epoch-label')!;
const yearSlider = document.getElementById('year-slider')! as HTMLInputElement;
const modeToggle = document.getElementById('mode-toggle')! as HTMLInputElement;
const hudHist = document.getElementById('hud-histogram')!;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer.setClearColor(new THREE.Color('#c08a5a'), 1);
const W = () => canvas.clientWidth || window.innerWidth;
const H = () => canvas.clientHeight || window.innerHeight;
renderer.setSize(window.innerWidth, window.innerHeight, false);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, W() / H(), 0.1, 100);
camera.position.set(0, 4.2, 12);
camera.lookAt(0, 1, 0);

let activeIndex = 0;
let evidenceOnly = false;
const epochs: LoadedEpoch[] = [];

async function init() {
  for (const e of EPOCHS) {
    const loaded = await loadEpoch(BASE, e.slug);
    epochs.push(loaded);
  }
  epochs.forEach((ep, i) => (ep.group.visible = i === activeIndex));
  epochs.forEach(ep => scene.add(ep.group));
  applyMode();
  updateHud();
  animate();
}

function updateHud() {
  const ep = epochs[activeIndex];
  if (!ep) return;
  const tierHist: Record<string, number> = { none: 0, minimal: 0, light: 0, mixed: 0, heavy: 0 };
  ep.entities.forEach(le => tierHist[le.entity.synthesis_tier]++);
  const { visible, fabVisible } = countVisible(ep);
  let ghosted = 0;
  ep.entities.forEach(le => {
    const m = le.mesh.material as THREE.ShaderMaterial;
    if (le.isFabulated && m.uniforms.uOpacity.value < 0.9) ghosted++;
  });
  hudState.dataset.activeEpoch = ep.pack;
  hudState.dataset.activeEpochName = ep.epoch;
  hudState.dataset.evidenceOnly = String(evidenceOnly);
  hudState.dataset.visibleCount = String(visible);
  hudState.dataset.fabulatedVisibleCount = String(fabVisible);
  hudState.dataset.fabulatedGhostedCount = String(ghosted);
  hudState.dataset.canvasPresent = String(!!document.querySelector('canvas#viewer-canvas'));
  epochLabel.textContent = EPOCHS[activeIndex].label;
  const bands = `evidence-grounded=${tierHist.none + tierHist.minimal + tierHist.light} fabulated=${tierHist.mixed + tierHist.heavy}`;
  hudHist.textContent = `tiers: none=${tierHist.none} minimal=${tierHist.minimal} light=${tierHist.light} mixed=${tierHist.mixed} heavy=${tierHist.heavy} | ${bands}`;
}

function applyMode() {
  epochs.forEach(ep => setEvidenceOnly(ep, evidenceOnly));
}

yearSlider.addEventListener('input', () => {
  activeIndex = Math.max(0, Math.min(1, parseInt(yearSlider.value, 10) || 0));
  epochs.forEach((ep, i) => (ep.group.visible = i === activeIndex));
  applyMode();
  updateHud();
});

modeToggle.addEventListener('change', () => {
  evidenceOnly = modeToggle.checked;
  applyMode();
  updateHud();
});

function onResize() {
  camera.aspect = W() / H();
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, false);
}
window.addEventListener('resize', onResize);

function animate() {
  requestAnimationFrame(animate);
  const t = performance.now() * 0.001;
  epochs.forEach(ep => ep.entities.forEach(le => {
    const m = le.mesh.material as THREE.ShaderMaterial;
    m.uniforms.uTime.value = t;
  }));
  // Slow orbit so the headless screenshot doesn't catch a static frame.
  camera.position.x = Math.sin(t * 0.05) * 12;
  camera.position.z = Math.cos(t * 0.05) * 12;
  camera.lookAt(0, 1, 0);
  renderer.render(scene, camera);
}

init().catch(err => {
  console.error(err);
  hudState.dataset.error = String(err);
});
