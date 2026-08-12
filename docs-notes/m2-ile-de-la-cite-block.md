# M2 — One Île-de-la-Cité block manifest, hand-built (done 2026-08-12)

## What shipped
- `packs/ile-de-la-cite-block/manifest.json` — 6 entities, hand-authored, validates against
  `spec/citypack.schema.json` (ajv, draft 2019-09).
- `packs/ile-de-la-cite-block/provenance.jsonl` — 6 rows, one per entity, each validates against
  `spec/provenance.schema.json`. 1:1 by count, ref-resolved, entity_id match, tier agreement.
- `packs/ile-de-la-cite-block/{geometry,textures,fragments,media}/` — `.gitkeep` stubs; real
  glbs/textures arrive in M3, referenced from manifest as `geometry/<slug>.glb` placeholders.
- `packs/ile-de-la-cite-block/schema/` — snapshot of `spec/citypack.schema.json` +
  `spec/provenance.schema.json` so the pack is self-describing (SPEC.md §2).

## Block chosen — the Cloître-Notre-Dame block
- The block immediately north-east of Notre-Dame, bounded by the medieval streets Marville
  photographed before Haussmann's ~1867-1868 clearance of the Île-de-la-Cité: Rue du
  Cloître-Notre-Dame, Rue des Chantres, Rue de la Colombe, Rue de la Licorne. All these lanes
  were demolished in the clearance that created the modern Parvis and the central Cité axis.
- 6 entities: Notre-Dame north flank + chevet (real Wikidata Q2978), 22 Rue des Chantres,
  Maison de la Licorne (corner), 14 Rue du Cloître-Notre-Dame, 1 Rue de la Colombe (carved
  pigeon corner), and a lost Parvis well (declared fabulation — exercises the heavy band).
- Tier spread: 4 × `light` (Marville DUSt3R-from-photo), 1 × `mixed` (Marville + 1739 Turgot
  plan constrained-diffusion infill), 1 × `heavy` (lost street furniture, no photo evidence).
  No `none`/`minimal` for this epoch — spec §6 ties those tiers to present-day / dense-photo
  epochs (APUR/IGN, Atget 20th c.), which this pre-Haussmann Marville pack is not.

## Verification evidence (all run this iteration)
- `ajv compile -s spec/citypack.schema.json --spec=draft2019` → valid; `ajv validate -d
  packs/ile-de-la-cite-block/manifest.json --spec=draft2019` → valid (exit 0).
- Each of the 6 provenance rows validated individually against `spec/provenance.schema.json`
  → all exit 0 (script in m2 verification log).
- 1:1 entity↔row by count (6/6); every `provenance.jsonl#<row_id>` ref resolves; every
  manifest `id` matches the prov `entity_id` key-for-key; `synthesis_tier` present on all 6
  entities and all 6 rows and they agree (4 light / 1 mixed / 1 heavy).

## Notes for the next iteration (M3 / M4 / M5)
- **Synthetic GERS ids.** All 6 entities use a 32-char synthetic Overture-style hex id (form
  `000...0X`). Notre-Dame additionally carries the real Wikidata `Q2978`. The synthetic GERS
  ids are documented as placeholders in each row's `notes` field — they are NOT real Overture
  ids. M4 should treat the overture field as the source-of-truth id for matching manifest↔
  provenance (as this manifest does), and a future reconciliation pass can replace the
  synthetic ids with real Overture/OSM/Wikidata where the upstream now has them. Do NOT
  fabricate real-looking ids; the synthetic form is intentionally easy to spot.
- **Provenance convention `provenance.jsonl#<row_id>`** is used throughout — M4's validator
  should split on `#` to match rows (per m1 handoff).
- **M3 placeholder glbs.** Manifest entities reference `geometry/<slug>.glb` files that do
  not exist yet (only `.gitkeep`). M3's `pipeline/reconstruct.py` will write real .ply/glbs
  there from the Marville fixtures; until then the geometry/ dir is a stub. The viewer (M5)
  will need a graceful fallback for missing glb files.
- **M5 needs a {mixed,heavy} element to ghost** — the `parvis-well` (heavy) and
  `maison-de-la-licorne` (mixed) entities exist precisely so the evidence-only toggle has
  something to hide. Do not delete them when M3 swaps in real geometry.
- **Marville photo filenames are placeholders** — `media/marville-*.jpg` paths in the manifest
  point at real Marville plates but the exact BnF Gallica catalog ids are pending reconciliation.
  M3 should populate `media/` with the actual fixture images (the `fixtures/photos/` tiny
  public multi-view set the PRD calls for) and update `media/` paths if filenames change.
- **No `none`/`minimal` tiers in this pack** — that is correct, not a gap. This is a sparse-
  photo Marville pack, not a present-day APUR/IGN or dense-Atget pack.
