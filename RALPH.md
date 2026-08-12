# RALPH loop status

- updated: 2026-08-12T22:20:25Z
- last finished: milestone 5: PSX/Shenmue web viewer + year-slider
- currently working on: (between milestones)

## Iteration history
- 2026-08-12T14:03:17Z START iteration 1 -> milestone 0 (Repo scaffold + preflight), attempt 1
- 2026-08-12T14:30:00Z DONE milestone 0 — 7 target dirs created, STATUS.md + scripts/preflight.sh shipped, all 3 verifications green. Notes in docs-notes/m0-preflight.md.
- 2026-08-12T21:57:53Z START iteration 1 -> milestone 1 (cityPack v0.1 spec (CC0)), attempt 1
- 2026-08-12T22:30:00Z DONE milestone 1 — citypack.schema.json + provenance.schema.json + SPEC.md + 3 fixtures shipped, all 3 verifications green (ajv compile/validate/broken-fail). Notes in docs-notes/m1-citypack-spec.md.
- 2026-08-12T22:30:30Z START iteration 2 -> milestone 2 (One Île-de-la-Cité block manifest, hand-built), attempt 1
- 2026-08-12T23:30:00Z DONE milestone 2 — packs/ile-de-la-cite-block/ shipped (manifest.json + provenance.jsonl + 6 entities + schema snapshot), all 3 verifications green (schema valid, 1:1 entity↔row, tier presence+agreement). Notes in docs-notes/m2-ile-de-la-cite-block.md.

## Handoff notes (read docs-notes/m0-preflight.md, docs-notes/m1-citypack-spec.md, docs-notes/m2-ile-de-la-cite-block.md for detail)
- ajv-cli v5 only supports `--spec=draft7` (default) or `--spec=draft2019`. Schemas use draft 2019-09; do NOT bump to 2020-12 without checking ajv-cli support.
- `provenance` field convention: `"provenance.jsonl#<row_id>"`; M4 should split on `#` to match rows.
- `synthesis_tier` is required on both manifest entity AND provenance row; they must agree (M4 enforces, M2 keeps in sync by hand — verified 6/6 agree).
- `additionalProperties: true` on manifest + entity — extensions first-class; M4 enforces required contract only, not schema lock.
- Puppeteer/macOS Frameworks extraction quirk still applies (see m0-preflight.md) — preflight self-heals it.
- M2 pack uses synthetic 32-char hex Overture-style ids (form `000...0X`), intentionally easy to spot; M4 must treat `overture` as the source-of-truth id for manifest↔provenance matching (M2's 6/6 entities do this). Notre-Dame additionally carries real Wikidata Q2978. Real Overture reconciliation is future work.
- M3 will write real `.glb`/`.ply` into `packs/ile-de-la-cite-block/geometry/` (currently only `.gitkeep`); manifest refs `geometry/<slug>.glb` placeholders. M5 viewer needs a graceful fallback for missing glbs.
- M5 evidence-only toggle needs {mixed,heavy} elements to ghost — the `parvis-well` (heavy) and `maison-de-la-licorne` (mixed) entities exist for that; don't delete them when M3 swaps in real geometry.
- 2026-08-12T22:00:32Z DONE milestone 1 (cityPack v0.1 spec (CC0))
- 2026-08-12T22:00:34Z START iteration 2 -> milestone 2 (One Île-de-la-Cité block manifest, hand-built), attempt 1
- 2026-08-12T23:30:00Z DONE milestone 2 (One Île-de-la-Cité block manifest, hand-built)
- 2026-08-12T22:04:28Z DONE milestone 2 (One Île-de-la-Cité block manifest, hand-built)
- 2026-08-12T22:04:30Z START iteration 3 -> milestone 4 (Provenance validator), attempt 1
- 2026-08-12T23:50:00Z DONE milestone 4 — pipeline/validate_pack.py shipped (stdlib-only, schema-tolerant; enforces id/geometry/provenance-ref/synthesis_tier on entity, who/when/license/synthesis_tier on row, tier agreement, entity_id key-for-key match, no orphan rows; emits 5-tier histogram + band totals). 2 broken fixture packs (bad-pack-missing-row, bad-pack-bad-tier). All 3 verifications green. Notes in docs-notes/m4-provenance-validator.md.
- 2026-08-12T22:11:47Z DONE milestone 4 (Provenance validator)
- 2026-08-12T22:11:48Z START iteration 4 -> milestone 5 (PSX/Shenmue web viewer + year-slider), attempt 1
- 2026-08-12T23:30:00Z DONE milestone 5 — viewer/ (Vite + TS + three.js) shipped: PSX shader pack (vertex lighting + Bayer dither + fog + scanlines + magenta fabulation tint), cityPack loader with placeholder geometry fallback, year-slider swapping two epochs (M2 pack + new ile-de-la-cite-block-1880 stub), evidence-only ghosting of {mixed,heavy} (uOpacity 0.15). All 4 verifications green via scripts/verify_viewer.mjs (headless puppeteer + swiftshader). Notes in docs-notes/m5-viewer.md.
- 2026-08-12T22:20:25Z DONE milestone 5 (PSX/Shenmue web viewer + year-slider)
