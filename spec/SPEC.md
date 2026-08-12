# cityPack v0.1 — Specification

**License:** CC0 1.0 Universal (public domain dedication).
**Status:** v0.1 — draft, in force for the first Paris packs.
**Steward:** VILLE project. See `docs/manifesto.md` for the spine; `docs/NOT.md` for the refusals.

A `cityPack` is a partial, dated, signed collection of reconstructed urban geometry for one block in one epoch. It is **not a map of the city** (see `docs/NOT.md`): coverage is not a goal, gaps are honest, and every reconstructed element declares how much of it was synthesized.

This document describes the on-disk layout of a pack and the contract every pack must satisfy. The machine-checkable contract lives in `spec/citypack.schema.json` (for `manifest.json`) and `spec/provenance.schema.json` (for each row of `provenance.jsonl`).

## 1. Scope and shape

- A pack covers **one block in one epoch** of one city. The viewer's year-slider composes packs; a single pack never spans epochs.
- A pack is a **partial** reconstruction. Missing buildings, lost streets, unphotographed facades are expected and remain absent rather than silently filled.
- Every reconstructed element carries a mandatory `synthesis_tier ∈ {none, minimal, light, mixed, heavy}`. No element may omit it. This is the discipline that separates the project from a generative model with no provenance.
- The spec is CC0. Code that produces or renders packs is MIT. Pack contents carry **per-upstream-source** licenses declared per element in `provenance.jsonl` — never a single blanket license at the pack root.

## 2. Pack directory layout

```
<pack-slug>.citypack/
  manifest.json        # the index — see §3
  geometry/             # glTF/glb per entity
  textures/             # palette-constrained, period-stylized
  fragments/            # markdown narrative seeds
  media/                # source photos / engravings, license-stamped
  provenance.jsonl      # one JSON object per line — WHO + WHEN + LICENSE + synthesis_tier per element
  schema/               # the spec version this pack targets (snapshot of spec/citypack.schema.json etc.)
  methods.md            # ML methods writeup for this pack (generated, see M6)
```

`schema/` is a snapshot of the spec version the pack was authored against, so a pack remains self-describing even if the spec evolves. `methods.md` is generated from `provenance.jsonl` by `pipeline/gen_methods.py` (M6) and contains the per-epoch synthesis-tier table.

## 3. `manifest.json`

The manifest is the pack's index. It is validated by `spec/citypack.schema.json`.

Top-level fields:

- `pack` — slug of the pack directory, e.g. `"ile-de-la-cite-block"`.
- `spec_version` — the cityPack spec version this manifest targets, e.g. `"0.1"`.
- `city` — city slug, e.g. `"paris"`.
- `epoch` — epoch label this pack reconstructs, e.g. `"1860s-haussmann-pre"`.
- `entities` — array of entity objects (see §4). May be empty (a pack can be all gaps).
- `license` *(optional)* — pack-level license note. Per-element licenses live in `provenance.jsonl`.
- `methods` *(optional)* — path to the generated `methods.md` for this pack.

## 4. Entity object

Each entity is one reconstructed thing — usually a building, but may be a wall, a fountain, a street segment. Required fields:

- `id` — external identifiers. **Overture GERS is primary.** When no GERS id exists, the documented fallback is **OSM id + Wikidata QID** together. At least one of (`overture`) or (`osm` + `wikidata`) must be present. See `id` in the schema.
- `geometry` — path to the entity's glTF/glb inside the pack, e.g. `"geometry/22-rue-des-chantres.glb"`.
- `provenance` — reference to the row in `provenance.jsonl` that attests this element, conventionally `"provenance.jsonl#<row_id>"`. Per-field provenance is mandatory (hard rule).
- `synthesis_tier` — the honesty field. See §6.

Optional fields: `name`, `textures` (paths into `textures/`), `media` (paths into `media/`, the source photos / engravings the element was reconstructed from), `fragments` (paths into `fragments/`, markdown narrative seeds). The schema permits additional properties — extensions are first-class (Hui cosmotechnics defense) — but the required fields above are non-negotiable.

## 5. `provenance.jsonl`

One JSON object per line. Each row is validated by `spec/provenance.schema.json`. Required fields per row:

- `row_id` — stable id, referenced from `manifest.json` entities.
- `entity_id` — identifier(s) of the entity this row attests. Must match the entity's `id` in the manifest.
- `who` — person or organization responsible (PROV-O Agent).
- `when` — ISO 8601 date, date-time, or year (negative years allowed for BCE) when the attestation / reconstruction was produced.
- `license` — license of the source / output, e.g. `"CC0"`, `"CC-BY-SA 4.0"`, `"public domain"`, `"BnF Gallica non-commercial"`.
- `synthesis_tier` — must match the `synthesis_tier` declared on the corresponding manifest element.

Optional: `source` (pointer to upstream source — `media/` path, URL, archive reference), `method` (short reconstruction-method description), `notes` (free-text paradata).

`synthesis_tier` is required on **both** the manifest entity and the provenance row, and the two must agree. The provenance validator (M4) enforces 1:1 entity↔row correspondence and tier agreement.

## 6. `synthesis_tier` — the honesty field

`synthesis_tier ∈ {none, minimal, light, mixed, heavy}` declares how much of an element was synthesized, and is mandatory on every entity and every provenance row. Read as two bands:

- **evidence-grounded** = `{none, minimal, light}`
  - `none` — direct geometric import (APUR / IGN / OSM / Overture, present day).
  - `minimal` — DUSt3R + Gaussian Splatting on dense photo (Atget-era, 20th c.).
  - `light` — DUSt3R / MASt3R on sparse photo (Marville, 19th c.).
- **fabulated** = `{mixed, heavy}` — declared fabulation under provenance, never passed off as record.
  - `mixed` — fusion of evidence with diffusion / prior infill (Turgot engraving era, 17th–18th c.).
  - `heavy` — declared fabulation from archaeological / scholarly priors (Roman / medieval).

Heavy and mixed tiers are not hidden — they are **declared**. The viewer's hallucinate-vs-evidence-only mode (M5) is the interactive counterpart to this field: in evidence-only mode `{mixed, heavy}` elements are hidden or ghosted; in full mode every element renders, but fabulated geometry is visually marked (a distinct fabulation material), never passed off as record. This realizes thesis T2 (Glissant's right to opacity) as a format feature, not a bug.

## 7. IDs and reconciliation

Overture GERS is the primary id because it is designed to be a stable, cross-dataset geographic id. When a building has no GERS id (common for demolished / pre-Haussmann stock), the fallback is OSM id + Wikidata QID together — neither is sufficient alone (OSM ids are reassigned; Wikidata QIDs are occasionally ambiguous), but the pair is enough to disambiguate. The provenance `entity_id` must match the entity `id` in the manifest.

## 8. Extension

The schema permits additional properties on both the manifest and entities. A pack may add fields it needs (a Shanghai pack with a CARE/OCAP consent flag; a Roman pack with an archaeological-trench reference). The required fields are non-negotiable; everything else is pack-specific. The discipline is the floor, not the ceiling.

## 9. What this spec is not

- It is **not a search index** (see `docs/NOT.md`). No global query, no ranking.
- It is **not a complete record**. Gaps are honest; the right not to be mapped is real.
- It is **not a runtime ML contract**. The viewer is a pure renderer of pre-baked packs (hard rule). AI lives in the build pipeline; by the time content reaches the device, it has been chosen by a human and stamped with provenance.

## 10. Versioning

`spec_version` follows `0.minor`. A backwards-compatible addition bumps the minor. A change that breaks existing packs bumps the major and requires a migration note in this file. The schema files in `spec/` are authoritative; this prose is the human-readable companion.

## 11. Reference

- `spec/citypack.schema.json` — the manifest schema.
- `spec/provenance.schema.json` — the provenance-row schema.
- `fixtures/sample-manifest.json` — a minimal valid manifest.
- `fixtures/sample-provenance.jsonl` — the matching provenance rows.
- `fixtures/broken-manifest.json` — a manifest missing `synthesis_tier`; must FAIL validation (the gate bites).
