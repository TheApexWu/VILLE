# RALPH loop status

- updated: 2026-08-12T22:00:32Z
- last finished: milestone 1: cityPack v0.1 spec (CC0)
- currently working on: (between milestones)

## Iteration history
- 2026-08-12T14:03:17Z START iteration 1 -> milestone 0 (Repo scaffold + preflight), attempt 1
- 2026-08-12T14:30:00Z DONE milestone 0 — 7 target dirs created, STATUS.md + scripts/preflight.sh shipped, all 3 verifications green. Notes in docs-notes/m0-preflight.md.
- 2026-08-12T21:57:53Z START iteration 1 -> milestone 1 (cityPack v0.1 spec (CC0)), attempt 1
- 2026-08-12T22:30:00Z DONE milestone 1 — citypack.schema.json + provenance.schema.json + SPEC.md + 3 fixtures shipped, all 3 verifications green (ajv compile/validate/broken-fail). Notes in docs-notes/m1-citypack-spec.md.

## Handoff notes (read docs-notes/m0-preflight.md and docs-notes/m1-citypack-spec.md for detail)
- ajv-cli v5 only supports `--spec=draft7` (default) or `--spec=draft2019`. Schemas use draft 2019-09; do NOT bump to 2020-12 without checking ajv-cli support.
- `provenance` field convention: `"provenance.jsonl#<row_id>"`; M4 should split on `#` to match rows.
- `synthesis_tier` is required on both manifest entity AND provenance row; they must agree (M4 enforces, M2 keeps in sync by hand).
- `additionalProperties: true` on manifest + entity — extensions first-class; M4 enforces required contract only, not schema lock.
- Puppeteer/macOS Frameworks extraction quirk still applies (see m0-preflight.md) — preflight self-heals it.
- 2026-08-12T22:00:32Z DONE milestone 1 (cityPack v0.1 spec (CC0))
