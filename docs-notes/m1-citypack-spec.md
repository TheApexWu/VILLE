# M1 — cityPack v0.1 spec (CC0) (done 2026-08-12)

## What shipped
- `spec/citypack.schema.json` — manifest.json schema (draft 2019-09). Entities require `id`
  (Overture GERS primary; `osm`+`wikidata` fallback via `anyOf`), `geometry` (glTF/glb path),
  `provenance` (ref to a provenance.jsonl row), and `synthesis_tier` (enum).
- `spec/provenance.schema.json` — schema for one row of provenance.jsonl. Requires `row_id`,
  `entity_id`, `who`, `when`, `license`, `synthesis_tier`. Reuses PROV-O / London Charter
  paradata norms; not a novel format.
- `spec/SPEC.md` — ~150-line prose companion (CC0): pack layout, entity contract, provenance
  contract, the two-band reading of `synthesis_tier`, ID reconciliation, extension policy.
- `fixtures/sample-manifest.json` — minimal valid manifest (one Overture entity `light`, one
  OSM+Wikidata entity `mixed` — exercises both id branches and the two bands).
- `fixtures/sample-provenance.jsonl` — the two matching provenance rows.
- `fixtures/broken-manifest.json` — same entity but missing `synthesis_tier`; fails validation.

## Verification evidence (all run this iteration)
- `ajv compile -s spec/citypack.schema.json --spec=draft2019` → schema valid (exit 0).
- `ajv validate -s spec/citypack.schema.json -d fixtures/sample-manifest.json --spec=draft2019`
  → valid (exit 0).
- `ajv validate -s spec/citypack.schema.json -d fixtures/broken-manifest.json --spec=draft2019`
  → invalid, `must have required property 'synthesis_tier'` at `/entities/0` (exit 1). The gate bites.
- (bonus) provenance schema compiles and both fixture rows validate against it.

## Notes for the next iteration (M2 / M4)
- **ajv-cli v5 only supports `--spec=draft7` (default) or `--spec=draft2019`.** The schemas use
  draft 2019-09 ($schema URI + `--spec=draft2019`). Do NOT bump to 2020-12 without checking
  ajv-cli support; the compile call will fail with "no schema with key or ref ...2020-12".
- The schema uses `additionalProperties: true` on manifest and entity — extensions are
  first-class (Hui cosmotechnics defense, see SPEC.md §8). M4's validator must enforce the
  *required* contract, not lock the schema closed.
- `provenance` field convention: `"provenance.jsonl#<row_id>"`. M4 should split on `#` to match
  rows. M2's hand-built pack should use the same convention.
- `synthesis_tier` is required on BOTH the manifest entity and the provenance row, and they
  must agree. M4 enforces tier agreement; M2 must keep them in sync by hand.
- The provenance `when` pattern is `^-?[0-9]{4}(-[0-9]{2}(-[0-9]{2}(T.*)?)?)?$` — accepts year,
  date, date-time, and negative years for BCE (Roman/medieval epochs). ajv-cli strict mode
  rejects the `format: "date"` keyword without a format plugin loaded, so we use a pattern.
- No fixtures under `fixtures/` are loaded into packs; they only exercise the schema.
  M2 will author a real pack under `packs/ile-de-la-cite-block/`.
