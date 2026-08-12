# M4 — Provenance validator (done 2026-08-12)

## What shipped
- `pipeline/validate_pack.py` — standalone Python (stdlib only, no deps). Takes a pack dir,
  asserts every manifest entity has a matching `provenance.jsonl` row (via the
  `provenance.jsonl#<row_id>` convention from m1/m2 handoff), that the row carries the
  mandatory `who`/`when`/`license`/`synthesis_tier`, that `synthesis_tier` is a valid enum on
  both the manifest entity and the prov row, that the two agree, that `entity_id` matches the
  manifest `id` key-for-key, and that **no orphan provenance rows** exist (every row must be
  referenced by an entity).
- Emits a **synthesis-tier histogram** (the honesty summary) on every run, pass or fail. All
  five tiers always print so an empty band is visible (M2's Marville pack legitimately has no
  `none`/`minimal` — that's a claim, not a gap). Bands aggregate into evidence-grounded
  {none,minimal,light} vs fabulated {mixed,heavy} for the at-a-glance read.
- Two broken fixture packs under `fixtures/`:
  - `bad-pack-missing-row/` — entity references a `provenance.jsonl#row-missing` that doesn't exist.
  - `bad-pack-bad-tier/` — entity + row both carry `synthesis_tier: "fabricated"` (out of enum).

## Verification evidence (all run this iteration)
- PASSES on `packs/ile-de-la-cite-block`: `validate_pack: PASS — ile-de-de-la-cite-block (6
  entities, all provenance rows resolved)` (exit 0). Histogram: 4 light / 1 mixed / 1 heavy.
- FAILS on `fixtures/bad-pack-missing-row`: exit 1, error
  `entities[1]: provenance ref 'provenance.jsonl#row-missing' has no matching row in provenance.jsonl`.
- FAILS on `fixtures/bad-pack-bad-tier`: exit 1, errors on both the manifest entity and the
  prov row for `synthesis_tier: 'fabricated'` not in the enum.
- Histogram prints on every run (pass and fail).
- (bonus) Orphan-row branch tested in a throwaway /tmp pack: a prov row with no manifest entity
  reference is flagged `orphan provenance row 'row-orphan' — no manifest entity references it`.

## Design notes / handoff to next iteration (M5 / M6 / M7)
- The validator is **schema-tolerant**: it enforces the mandatory contract (id/geometry/
  provenance ref/synthesis_tier on entity; who/when/license/synthesis_tier on row), not the
  JSON Schema lock. `additionalProperties: true` extensions stay first-class (m1 handoff).
- `entity_id` comparison is key-for-key: manifest `{overture, wikidata}` must equal the prov
  row's `entity_id` exactly. M2's 6/6 entities satisfy this. If a future pack wants to carry
  *additional* ids on one side only, that will trip the validator — extend the comparison
  function (`entity_id_key`) to compare on the manifest-declared keyset only.
- The histogram counts by the **manifest** declaration (the entity's `synthesis_tier`); the
  prov row's tier is checked for agreement, not counted separately. M6's methods.md generator
  should read the same histogram so the two agree by construction — `validate_pack.py --json`
  emits `{histogram, total}` machine-readable for that.
- Exit code: 0 pass, 1 any violation, 2 usage error. CI / release packaging (M7) can wire
  `validate_pack.py packs/*` as a gate.
- No external deps (pure stdlib) so the validator runs anywhere python3 ≥3.10 does; preflight
  does not need to know about it.
