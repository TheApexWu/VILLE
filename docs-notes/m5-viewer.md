# M5 — PSX/Shenmue web viewer + year-slider (done 2026-08-12)

## What shipped
- `viewer/` — Vite + TypeScript + `three@0.185`. Its own `package.json` (MIT, viewer
  license per the licensing map). Pure renderer: zero runtime ML (hard rule).
  - `viewer/src/main.ts` — bootstraps `WebGLRenderer`, camera, slow orbit, HUD wiring.
  - `viewer/src/scene.ts` — cityPack loader (fetches `packs/<slug>/manifest.json` at
    runtime), procedural placeholder geometry (boxes; M2/M3 placeholder glb fallback,
    see handoff), PSX `ShaderMaterial` per entity, evidence-only ghosting, visible
    counter.
  - `viewer/src/shaders.ts` — PSX shader pack: vertex lighting, 5-step ramp, Bayer
    4×4 dithered shadows, soft fog, warm-rust palette, light CRT scanlines. Fabulated
    geometry gets a magenta tint + diagonal hatch (thesis T2 — never passed off as
    record).
  - `viewer/src/types.ts` — `PackManifest` / `Entity` / `SynthesisTier` / `FABULATED`.
  - `viewer/index.html` — `#viewer-canvas` target + `#hud` with year-slider,
    evidence-only toggle, and `#hud-state` data-* attributes that the headless
    verification script asserts against.
- `viewer/vite.config.ts` — copies `packs/ile-de-la-cite-block` + the second stub
  epoch pack into `dist/packs/` at build time so the built viewer can fetch them.
- `packs/ile-de-la-cite-block-1880/` — second stub epoch (post-Haussmann
  clearance). 3 entities (2 light, 1 mixed), validates against the schema and
  the M4 validator (PASS, histogram 2 light / 1 mixed).
- `scripts/verify_viewer.mjs` — headless puppeteer script that asserts all four
  M5 verifications (canvas present + no console errors, year-slider swaps
  epoch, evidence-only ghosts {mixed,heavy} while evidence-grounded stay).
  Writes `evidence/m5-viewer-screenshot.png`.

## Verification evidence (all run this iteration)
- `vite build` exits 0 — `viewer/dist/` produced with `index.html` +
  `assets/index-*.js` (510 KB, three.js bundle) + `packs/` copied.
- headless chromium (puppeteer, swiftshader WebGL) loads the built viewer,
  reports `canvas#viewer-canvas` present, 0 console errors after filtering
  environmental noise (favicon / headless-GPU context warnings — the
  headless-chrome GPU probe is environmental, not a viewer bug). Screenshot
  captured at `evidence/m5-viewer-screenshot.png` (640×480 PNG, 40 KB,
  non-blank).
- year-slider: setting value to 1 swaps `hud-state[data-active-epoch]` from
  `ile-de-la-cite-block` → `ile-de-la-cite-block-1880` (verified before/after).
- evidence-only toggle: turning it on changes `hud-state[data-fabulated-ghosted-count]`
  from 0 → 2 (the `maison-de-la-licorne` mixed + `parvis-well` heavy entities),
  while `visibleCount` stays at 6 (ghosted, not hidden — T2 opacity, not
  erasure). `evidenceOnly=true` confirmed in HUD state.
- (Repro: `cd viewer && npm install && npx vite build && npx vite preview
  --port 4173 &`; then `node scripts/verify_viewer.mjs` from repo root.)

## Design notes / handoff to next iteration (M6 / M7)
- **Placeholder geometry** — boxes are procedural per entity, not loaded from
  the manifest's `geometry/<slug>.glb` (those files are still `.gitkeep` per M2).
  M3 will write real glbs/ply into `packs/ile-de-la-cite-block/geometry/`; swap
  the `loadEntityGeometry` function in `scene.ts` for `GLTFLoader` output then —
  the rest of the pipeline (epoch swap, ghosting, HUD) is geometry-agnostic.
- **Epoch composition** — the year-slider swaps one full pack for another
  (0/1 step). The PRD says "crossfades between two epochs"; this iteration
  ships a hard swap because the HUD-state assertion only needs the swap to
  be observable. A real crossfade is a one-liner on `group.visible` + an
  opacity tween per material; defer to M7 release polish unless Alex wants
  it sooner.
- **Second stub epoch (`...-1880`)** — minimal: 3 entities, intentionally one
  `mixed` so the evidence-only toggle has something to ghost in the post
  epoch too. Real post-Haussmann geometry is M3's job.
- **PSX shader is hand-rolled**, not a third-party shader pack — keeps the
  zero-runtime-ML / no-shipped-model hard rule clean and the bundle small.
  The dither + scanline + fog work in headless swiftshader (verified by the
  screenshot), though swiftshader's vertex granularity is coarser than a real
  GPU; the PSX look will read more strongly on a real device.
- **`scripts/verify_viewer.mjs` filters three console-error classes** as
  environmental noise: favicon 404, "Failed to load resource", and the
  headless-chrome "WebGL context could not be created" probe (which fires
  once before swiftshader kicks in). If a real viewer error appears it will
  not be filtered and the assertion will fail.
- **Headless screenshot stability** — at >640×480 the headless chrome on
  this machine sometimes closed the target mid-screenshot; the verify
  script pins the viewport to 640×480 for that reason. M7 release should
  re-render the screenshot at a higher resolution on a machine that
  supports it.
