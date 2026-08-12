# VILLE — Status

Pointing at the phase plan in [`docs/manifesto.md`](docs/manifesto.md) (§ Phase plan) and the
milestone spec in [`PRD.JSON`](PRD.JSON). This file is the loop's at-a-glance state; the
manifesto is the source of truth for direction.

## Licensing map

See [`LICENSE`](LICENSE): `/spec` is CC0, `/pipeline` and `/viewer` are MIT, `/docs` is CC BY 4.0,
`/packs` declare license per element in `provenance.jsonl`. No code or model ships under a
pack's license — packs only carry content + per-element provenance.

## Milestone status (from PRD.JSON)

| M | Name | Done |
|---|---|---|
| 0 | Repo scaffold + preflight | done |
| 1 | cityPack v0.1 spec (CC0) | done |
| 2 | One Île-de-la-Cité block manifest, hand-built | pending |
| 3 | Reconstruction pipeline scaffold (DUSt3R/MASt3R harness) | pending (human gate) |
| 4 | Provenance validator | pending |
| 5 | PSX/Shenmue web viewer + year-slider | pending |
| 6 | methods.md generator + essay scaffold | pending (human gate) |
| 7 | First public release packaging | pending |

Hard rules (see `PRD.JSON` `project.hard_rules`): zero runtime ML; per-field provenance
mandatory; `synthesis_tier ∈ {none,minimal,light,mixed,heavy}` on every element; the loop never
self-certifies a human gate.
