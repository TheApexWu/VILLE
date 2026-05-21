# VILLE

> A pipeline + open spec + web viewer + essay series for reconstructing lost urban geometry from historical sources, with epoch-appropriate ML methods, rendered in a PSX/Shenmue web aesthetic, beginning with Paris from Roman Lutèce to the present.

Body of work, not startup. One steward. Public from day one.

## Read in this order

1. [`docs/WHY.md`](docs/WHY.md) — why this object should exist
2. [`docs/NOT.md`](docs/NOT.md) — what VILLE refuses to be
3. [`docs/manifesto.md`](docs/manifesto.md) — the full v0 direction
4. [`docs/learning-pack.md`](docs/learning-pack.md) — running log of teaching moments by domain

## Status

**Phase 0 — writing only.** No code yet. The first commit is intellectual on purpose.

| Phase | What | Status |
|---|---|---|
| 0 | WHY · NOT · USE · ETHICS · VALIDATION | WHY + NOT done; rest pending |
| 1 | `cityPack v0.1` spec draft + one Île-de-la-Cité block manifest | pending |
| 2 | Falsification test: DUSt3R on Marville plates + held-out Sainte-Chapelle test | pending |
| 3 | Three.js viewer + PSX shaders + year-slider | pending |
| 4 | First public release: methods + essay | pending |

## Repo structure (target)

```
VILLE/
├── docs/         # philosophy, refusals, manifesto, learning pack
├── spec/         # cityPack format spec (CC0)
├── packs/        # reference city packs (per-source licenses)
├── pipeline/     # build-time ML reconstruction (MIT)
└── viewer/       # PSX-styled web renderer (MIT)
```

## Licenses

- Spec (`/spec`): **CC0**
- Code (`/pipeline`, `/viewer`): **MIT**
- Pack contents (`/packs`): **per upstream source**, declared per-element in `provenance.jsonl`

## Lineage

Sixth Borough (NYC time machine) · Eyes on the Street (NYC subway sense layer) · OldNYC · Strangethink · Cosmo D · The Pudding · Stamen · Heterotopias · DUSt3R / MASt3R / VGGT · Gaussian Splatting · Critical cartography (Harley, Wood, Pickles, Scott, Glissant) · CARE/OCAP.

## 90-Day Check — Aug 19 2026

If the project drifts toward virality, scale, growth, recurring revenue, app-store distribution, or a co-founder pitch — re-read [`docs/NOT.md`](docs/NOT.md) before the next commit. The discipline is the work.
