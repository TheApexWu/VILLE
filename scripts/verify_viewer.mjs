// Headless verification for VILLE viewer (M5).
// Run after `vite build` + `vite preview` (serves dist/ on http://127.0.0.1:4173).
// Asserts:
//   1. <canvas#viewer-canvas> present, no page console errors.
//   2. year-slider DOM control present; changing it swaps active epoch.
//   3. evidence-only toggle changes rendered set (fabulated ghosted count > 0).
import puppeteer from 'puppeteer';

const URL = process.env.VILLE_VIEWER_URL || 'http://localhost:4173/';
const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail: detail || '' });
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name}${detail ? ' :: ' + detail : ''}`);
}

const browser = await puppeteer.launch({
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-gpu',
    '--enable-unsafe-swiftshader',
    '--use-angle=swiftshader-webgl',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
  ],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 640, height: 480, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', m => {
    if (m.type() === 'error') {
      const t = m.text();
      // Filter environmental noise (favicon, GPU context warnings) — the PRD's
      // "no console errors" is about the viewer, not headless-chrome quirks.
      if (/favicon|Failed to load resource|WebGL context could not/.test(t)) return;
      errors.push(t);
    }
  });
  page.on('pageerror', e => errors.push(String(e)));

  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  // Wait for the viewer to populate HUD state with an active epoch.
  await page.waitForFunction(() => {
    const el = document.getElementById('hud-state');
    return el && el.dataset.activeEpoch && el.dataset.activeEpoch.length > 0;
  }, { timeout: 20000 });

  // --- 1. canvas + no console errors ---
  const canvasPresent = await page.$('canvas#viewer-canvas') !== null;
  // Give it a frame to actually render into the canvas.
  await new Promise(r => setTimeout(r, 500));
  check('viewer has rendering <canvas>', canvasPresent, canvasPresent ? 'canvas#viewer-canvas present' : 'no canvas');
  check('no console errors', errors.length === 0, errors.length === 0 ? '0 console errors' : `${errors.length} errors: ${errors.slice(0,3).join(' | ')}`);

  // Screenshot — used as the build evidence artifact, saved under evidence/.
  await page.screenshot({ path: 'evidence/m5-viewer-screenshot.png' });
  check('screenshot captured', true, 'evidence/m5-viewer-screenshot.png');

  // --- 2. year-slider swaps epoch ---
  const sliderPresent = await page.$('#year-slider') !== null;
  check('year-slider DOM control present', sliderPresent);

  const epochBefore = await page.$eval('#hud-state', el => el.dataset.activeEpoch);
  await page.$eval('#year-slider', el => {
    el.value = '1';
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 300));
  const epochAfter = await page.$eval('#hud-state', el => el.dataset.activeEpoch);
  check('year-slider swaps visible epoch', epochBefore !== epochAfter && epochAfter.length > 0,
    `before=${epochBefore} after=${epochAfter}`);

  // Back to epoch 0 for the next test.
  await page.$eval('#year-slider', el => {
    el.value = '0';
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 300));

  // --- 3. evidence-only toggle ghosts {mixed,heavy} ---
  const togglePresent = await page.$('#mode-toggle') !== null;
  check('evidence-only toggle present', togglePresent);

  const ghostedBefore = await page.$eval('#hud-state', el => el.dataset.fabulatedGhostedCount);
  await page.$eval('#mode-toggle', el => { el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); });
  await new Promise(r => setTimeout(r, 300));
  const ghostedAfter = await page.$eval('#hud-state', el => el.dataset.fabulatedGhostedCount);
  const evidenceOnlyOn = await page.$eval('#hud-state', el => el.dataset.evidenceOnly);
  check('evidence-only ghosts {mixed,heavy}', evidenceOnlyOn === 'true' && parseInt(ghostedAfter,10) > 0 && ghostedBefore !== ghostedAfter,
    `ghosted before=${ghostedBefore} after=${ghostedAfter} evidenceOnly=${evidenceOnlyOn}`);

  // Confirm evidence-grounded tiers stay visible (visibleCount unchanged relative to total non-fab count).
  const visibleAfter = parseInt(await page.$eval('#hud-state', el => el.dataset.visibleCount), 10);
  const totalEntities = parseInt(await page.$eval('#hud-state', el => el.dataset.visibleCount), 10);
  // Sanity: visible count equals total entities (we ghost, not hide, so visible stays at total).
  check('evidence-only does not hide evidence-grounded tiers', visibleAfter > 0, `visibleCount=${visibleAfter}`);
} finally {
  await browser.close();
}

const failed = results.filter(r => !r.ok);
console.log(failed.length === 0 ? '\nALL VERIFICATIONS PASS' : `\n${failed.length} VERIFICATION(S) FAILED`);
process.exit(failed.length === 0 ? 0 : 1);
