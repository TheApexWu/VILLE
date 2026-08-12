# Feasibility & precedent — research verdict (Aug 12 2026)

Source: a fan-out deep-research pass (103 agents, 21 sources, 25 claims adversarially verified — 20 confirmed, 5 killed). Provenance: **verified** against cited sources this session; the load-bearing feasibility claim was **refuted**, and the exact VILLE regime (ground-level 19th-c. photos of one building) was **never tested by any source** — treat the spine as unresolved until a pilot runs.

## Bottom line

Recognizable 3D of one demolished Île-de-la-Cité building from ~10 Marville photographs **alone** is a research-grade gamble, not a solved capability. It becomes plausible only by **fusing** photos with maps, engravings, and archaeology, and accepting a **semi-automatic, curation-heavy** pipeline. That is exactly what an art-first, provenance-tiered body of work can honestly carry.

## The ML spine

- **Right mechanism (confirmed 3-0).** DUSt3R / MASt3R / VGGT recover pose + dense geometry from uncalibrated, sparse image sets in a single forward pass; heritage/historical photos are a named use case. Establishes relevance, not reliability.
- **Hallucination is structural (confirmed 3-0).** These models invent plausible geometry from learned priors (planarity, sky distance, continuity) in texture-poor / low-overlap regions — i.e. exactly the archival-photo regime — and "cannot fully replace" classical SfM/MVS. Output can be "dominated by the model prior rather than image evidence."
- **The pro-feasibility claim died (refuted 0-3).** "Beat COLMAP +50% on <10 images → ~10-photo reconstruction feasible" did not survive verification.
- **No accuracy numbers exist** for the sparse historical-photo case; the corpus returned failure-mode taxonomies and self-assessed "seamless" results, not benchmarked error.
- **City-scale single-pass is off the table (confirmed 3-0).** Quadratic attention caps view counts; work is per-building / per-block, assembled with maps. (Fast-moving: FlashVGGT etc. may soften this within the project's lifetime.)

## Precedent — everyone who succeeded fused sources + curated heavily

- **Warsaw demolished buildings:** classical SfM **+ maps + blueprints + tachymetry**. No learned pointmaps / NeRF / 3DGS.
- **Closest precedent — Maiwald/Münster, Jena (2023):** neural rendering of lost buildings from sparse historical photos *does* work as a proof of concept — but **4,000+ collected photos yielded ~2 neural-refined buildings**, semi-automatic, with a 1936 map hand-labeled for footprints. This is the true curation-to-output ratio.
- **Building Rome in a Day:** 150k images, ~500 cores — dense-collection SfM, a category mismatch to the sparse regime.
- **Flagships stall:** Venice Time Machine **suspended 2019** after ~6 funded years (data/governance). Lesson for a solo: a scoped, self-contained body of work beats grand scale.
- **Indie:** OldNYC sustained by being **2D geolocation**, not 3D; Cosmo D / Off-Peak / Kitty Horrorshow are PSX art worlds but **fictional**. The walkable-3D-of-a-lost-*real*-city niche is genuinely **unoccupied** — real originality, but nobody has proven it sustainable solo.

## The provenance idea is not novel — reuse, don't invent

- `synthesis_tier` restates the **London Charter's "paradata"** mandate (15+ yrs old) and the Seville Principles: declare evidence vs. hypothesis. Best-practice ("should"), not a binding standard.
- Heritage provenance is assembled from **PROV-O + CIDOC CRM + W7** (see CNRS Notre-Dame 2025). Reuse-and-extend these; do not author a new format.
- **Overture GERS** = stable identity keys, not provenance tiers — neither implements nor blocks the idea.
- Implication: the value is the **discipline + the aesthetic + actually shipping**, not a novel format or a "moat." Drop the moat framing.

## Commercial reality — unanswered

The corpus returned **zero confirmed claims** on insurance cat-modeling / architecture buyers or "SR 11-7 auditability as a moat." Treat as unknown. Fine under art-first.

## Open questions (the real next steps)

1. **The pilot (make-or-break):** measured reconstruction + hallucination rate of MASt3R/VGGT on ~5–20 real Marville photos of one Île-de-la-Cité building. No source tested it; only a small solo run resolves it.
2. Reliability + fabrication rate of ControlNet / engraving-to-3D / single-image-to-3D diffusion for the photoless epochs (Roman/medieval) — entirely open.
3. Realistic solo human-in-the-loop time + rentable-GPU cost for one convincing building (Maiwald implies a high curation ratio).

## Key sources

- Sparse/feed-forward + heritage: sciencedirect.com/science/article/pii/S2096579626000203 ; arxiv 2507.08448 ; arxiv 2507.14798
- Demolished-building fusion: mdpi.com/2076-3417/15/1/299 ; Maiwald link.springer.com/chapter/10.1007/978-3-031-38871-2_7
- SfM failure modes: cs.cornell.edu/~snavely/publications/thesis/thesis.pdf ; Building Rome grail.cs.washington.edu/rome/
- Venice suspension: timemachine.eu/venice-time-machine-project-current-state-of-affairs/ ; nature.com/articles/d41586-019-03240-w
- Provenance prior art: londoncharter.org/principles/documentation.html ; doi.org/10.3390/heritage8110476 ; overturemaps.org/blog/2025/understanding-overtures-global-entity-reference-system/
- Indie: oldnyc.org ; en.wikipedia.org/wiki/Off-Peak ; en.wikipedia.org/wiki/Kitty_Horrorshow
