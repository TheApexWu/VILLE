# VILLE — Learning Pack

A running log of teaching moments. Append-only, dated, organized by domain. Each entry has a **claim**, a **why-it-matters** for VILLE specifically, and **what-to-read-next** if I want to go deeper. When a concept stops being new, mark it `🟢 internalized`.

---

## How to use this file

- Append at the bottom of each domain section. Most recent at the end so I can re-read chronologically.
- One entry = one concept. Don't bundle.
- If I find myself re-explaining the same concept to Claude across sessions, *that's* the signal to write it down here.
- Quarterly review: skim the whole file. Mark internalized entries. Identify gaps.

---

## Domains

1. [Photogrammetry & 3D reconstruction](#1-photogrammetry--3d-reconstruction)
2. [Probabilistic / Bayesian validation](#2-probabilistic--bayesian-validation)
3. [Historical sources & adversarial provenance](#3-historical-sources--adversarial-provenance)
4. [Coordinate systems & geodesy](#4-coordinate-systems--geodesy)
5. [Format & spec design](#5-format--spec-design)
6. [Generative ML for synthesis](#6-generative-ml-for-synthesis)
7. [Critical cartography & philosophy](#7-critical-cartography--philosophy)
8. [Web rendering & PSX aesthetics](#8-web-rendering--psx-aesthetics)
9. [Project hygiene & outsider-art practice](#9-project-hygiene--outsider-art-practice)

---

## 1. Photogrammetry & 3D reconstruction

### 2026-05-21 — DUSt3R needs ≥2 overlapping views; single-photo buildings need monocular depth
**Claim.** Standard photogrammetric 3D reconstruction (including DUSt3R/MASt3R) is *multi-view* — it needs at least two photos with overlap to triangulate. Many demolished buildings have only one surviving photo. Those require monocular depth estimation (Marigold, Depth Anything v2) as fallback, with much wider uncertainty bounds.
**Why for VILLE.** A huge fraction of Marville's plates are single shots. Phase 2's falsification test must pick a building with multiple photos. Single-photo buildings are a separate, harder problem to design for later.
**Next.** Read Marigold (CVPR 2024). Skim Depth Anything v2.

### 2026-05-21 — Multi-source triangulation gives geometric confidence
**Claim.** A reconstructed building's geometry confidence isn't a vibe — it comes from *source agreement*. Three independent sources (Vasserot atlas + Marville photo + Haussmann demolition record) agreeing on footprint within tolerance → confidence ≈ 0.87. One source alone → confidence ≤ 0.5.
**Why for VILLE.** This is the operational definition that makes the `geometry_confidence` field in cityPack honest. Without it, "0.87" is decoration.
**Next.** Look up Dempster-Shafer evidence combination for sources of varying trust.

### 2026-05-21 — Anchor-and-triangulate against surviving buildings
**Claim.** You can't validate reconstructions against ground truth that doesn't exist. Instead, register the whole reconstructed scene to known-surviving anchors (Notre-Dame, Sainte-Chapelle, Pont Neuf), then non-surviving buildings inherit that calibration.
**Why for VILLE.** Île-de-la-Cité has enough surviving Gothic anchors that this works there. Other Paris blocks have fewer — anchor density per block is a real selection criterion for which neighborhoods are reconstructable.
**Next.** Investigate which Paris arrondissements have the best anchor density.

### 2026-05-21 — The held-out reconstruction test is the honesty number
**Claim.** Reconstruct a *surviving* building (Sainte-Chapelle) from period photos *only*, pretending you don't know its true dimensions. Compare reconstruction to known geometry. The RMS error is the project's honesty number — every demolished building inherits that error bar.
**Why for VILLE.** This number goes in `methods.md` for every release. Without it, claims of accuracy are unfalsifiable. With it, the project has a *measured* epistemic floor.
**Next.** Build this harness in Phase 2.

---

## 2. Probabilistic / Bayesian validation

### 2026-05-21 — Geometry is a distribution, not a value
**Claim.** Wrong: "the building is 18m tall." Right: "p(height) = Normal(μ=18, σ=2.5)." The whole project is Bayesian estimation under uncertain evidence, not retrieval of correct answers.
**Why for VILLE.** Forces the spec to carry confidence intervals (`ci_95`) on every dimension, not point estimates. Forces the renderer to *show* uncertainty (wider buildings drawn with softer edges, dithered when σ is high).
**Next.** Read Thrun, *Probabilistic Robotics* ch. 3. Geyer & Diggle for spatial stats.

### 2026-05-21 — Confidence calibration: 0.87 must actually mean 0.87
**Claim.** Saying "confidence 0.87" is a *predicted probability* the value is within tolerance. If across 100 buildings claimed at 0.87, only 60 turn out within tolerance, the model is miscalibrated and the project loses credibility. Calibration is measured (reliability diagrams, ECE).
**Why for VILLE.** Without calibration audits, confidence scores are decoration. Heterotopias-tier critical reception requires this be real.
**Next.** Read Guo et al. *On Calibration of Modern Neural Networks* (ICML 2017).

### 2026-05-21 — Null has a taxonomy
**Claim.** `null` is not one thing. The spec needs `null_reason ∈ {unknown, lost, withheld, not_applicable, uncertain, disputed}`. `disputed` is the politically interesting one — hold both values + pointer to discussion, don't pick a winner.
**Why for VILLE.** This is where Glissant's right-to-opacity becomes operational in code, not just rhetoric. The format *technically* refuses to flatten silence.
**Next.** Look at how Wikidata handles `novalue` vs `somevalue` vs deprecated statements.

---

## 3. Historical sources & adversarial provenance

### 2026-05-21 — Pre-metric units shift everything by 6%
**Claim.** Pre-1791 French sources use *toise* (1.949m), *pied du roi* (0.3248m), *pouce* (~27mm). Reading these as modern units → ~6% scale error. Cumulative across stories, a building is rendered 1.5m too tall.
**Why for VILLE.** All Roman / medieval / 17th-c. dimensional data needs unit conversion at ingest time. Provenance log records *which* unit system was original.
**Next.** Find the canonical reference on Ancien Régime metrology.

### 2026-05-21 — Archives have political intent; read them against themselves
**Claim.** Haussmann's clearance records understate demolitions for political reasons (compensation liability). Marville's framing choices flatten neighborhoods his patrons disliked. Vasserot atlas is a cadastral instrument of the state. *No archival source is neutral.*
**Why for VILLE.** This is critical-cartography theory operationalized: read every source for its silences and its agenda. Note in `methods.md` what each source likely *omits* alongside what it includes.
**Next.** Hannah Black on archives. Hartman *Venus in Two Acts*. Mbembe "Power of the Archive and Its Limits."

### 2026-05-21 — Single-source vs multi-source claims should look different in the artifact
**Claim.** A building attested by three independent sources should *render differently* from one attested by a single ambiguous photo. The renderer must visually surface evidence weight, not hide it.
**Why for VILLE.** The honest artifact lets you *see* what is well-evidenced vs barely-evidenced. Edges crisp = high evidence; edges dithered = low. This is the PSX aesthetic doing epistemic work, not just looking good.
**Next.** Sketch render-rules tied to `geometry_confidence` in Phase 3.

---

## 4. Coordinate systems & geodesy

### 2026-05-21 — Coordinate-system archaeology is a real subdiscipline
**Claim.** Vasserot atlas (1810–36) uses a local pre-metric Paris system. Bonne projection. Lambert I/II/III/IV (zones of France). RGF93. WGS-84. Each historical Paris source potentially has its own CRS. Wrong reprojection → 30m drift, easily.
**Why for VILLE.** Every source needs explicit CRS tagging at ingest. The format records source CRS + the transformation chain to WGS-84. This is non-negotiable provenance.
**Next.** EPSG codes for historical French systems. pyproj transformations. IGN technical docs.

---

## 5. Format & spec design

### 2026-05-21 — Per-entity records must carry method + confidence + null-taxonomy
**Claim.** A spec entry isn't `{id, geometry, height}` — it's `{id, geometry, geometry_confidence, geometry_method, height: {value, ci_95, method}, epoch, synthesis_tier, sources[], fields_with_null_reason{}}`. The metadata is bigger than the data. That's correct.
**Why for VILLE.** This is what makes cityPack *the artwork* rather than just a JSON file. The structure encodes the project's ethics.
**Next.** Compare to STAC (SpatioTemporal Asset Catalog), CIDOC-CRM (cultural heritage), schema.org Place.

### 2026-05-21 — Minimal core + first-class extensions (Hui's cosmotechnics defense)
**Claim.** "City-agnostic format" is suspect — every city has its own ontology. The defense is: ship a *minimal* core schema, make the *extension* mechanism first-class so each city's pack can carry its own fields without forking the core.
**Why for VILLE.** Paris needs different fields from Shanghai. Format must let Shanghai pack carry *lilong* (弄堂) as a first-class type even though Paris doesn't. Without this, the spec colonizes.
**Next.** Look at OSM's tag namespace approach. RDF + ontologies as a (heavier) alternative.

---

## 6. Generative ML for synthesis

### 2026-05-21 — Constrained diffusion ≠ free-form generation
**Claim.** Using Stable Diffusion + ControlNet on archaeological priors is *constrained* synthesis: depth maps, edge maps, footprint outlines guide generation. This is methodologically different from "Midjourney makes a building." The constraint *is* the evidence.
**Why for VILLE.** Roman/medieval epochs *require* generative synthesis, and the difference between defensible-fabulation and decorative-LARP is whether each output traces back to a constraint. Without ControlNet-class conditioning, T4 (Hartman) becomes a fig leaf.
**Next.** ControlNet paper (Zhang et al. ICCV 2023). Study how heritage-reconstruction researchers use diffusion (search "diffusion archaeological reconstruction 2024–25").

---

## 7. Critical cartography & philosophy

### 2026-05-21 — Glissant's opacity is technical, not rhetorical
**Claim.** The right to opacity (*droit à l'opacité*) means: a community has the right not to be reduced to legibility on someone else's terms. For VILLE this is operationalized as `null_reason: "withheld"` — the format technically refuses to coerce communities into transparency.
**Why for VILLE.** Without the format-level mechanism, "respecting opacity" is just a blog post. With it, opacity is structural.
**Next.** Re-read Glissant *Poétique de la Relation* "Pour l'opacité." See CARE Principles for Indigenous Data Governance.

### 2026-05-21 — Hartman's critical fabulation requires institutional standing
**Claim.** Saidiya Hartman developed "critical fabulation" (write *with* and *against* the archive to register what was destroyed) from a position of historical dispossession. A non-dispossessed researcher invoking it inherits the *method* but not the *standing*. Use cautiously.
**Why for VILLE.** Backstop thesis T4 is "a pack is a fabulation under provenance." Defensible only if synthesis tier is honestly declared and the project doesn't claim victimhood credentials it doesn't have.
**Next.** Re-read "Venus in Two Acts" annually.

---

## 8. Web rendering & PSX aesthetics

*(empty — populate as Phase 3 begins)*

### Template for future entries
**Claim.**
**Why for VILLE.**
**Next.**

---

## 9. Project hygiene & outsider-art practice

### 2026-05-21 — Body-of-work shape tolerates noise; product shape doesn't
**Claim.** A body-of-work (essays + packs + viewer over years) tolerates rough drops, ugly first releases, public failures. A product shape doesn't — every release has to be polished or it damages the brand. Choose the shape, then *honor* the shape's tolerances.
**Why for VILLE.** Permission to ship Phase 2 ugly. Permission to publish a methods.md that admits Sainte-Chapelle reconstruction was off by 4m. Permission to tweet "I tried X, it didn't work, here's why" without the project losing credibility.
**Next.** Re-read Craig Mod's *On Margins* essays on slow public practice.

### 2026-05-21 — The teaching moment is the signal to write here
**Claim.** When Claude (or anyone) explains something that lands as "oh, I didn't know that" — that's the signal to append to this file. Not after I've internalized it. *In the moment.* Otherwise the lesson decays.
**Why for VILLE.** Project longevity depends on cumulative understanding. Without this file, every session re-teaches the same primitives.
**Next.** Quarterly review of this file is the discipline.

---

## Backlog — concepts to flesh out

- Uncertainty propagation through composite scenes (compounding error across stacked buildings)
- Dempster-Shafer vs Bayesian evidence combination (when sources have different trust *kinds*, not just weights)
- Roman-era validation when no anchors exist (different framework entirely — evidential reasoning, abductive inference)
- Bundle adjustment internals (the math DUSt3R hides)
- IIIF protocol for archival image access (BnF Gallica is IIIF-native)
- License compatibility matrix across sources (CC0 spec vs CC-BY pack content vs PD photos vs ODbL OSM data)
- How heritage-reconstruction journals (e.g., *Journal of Cultural Heritage*) frame methodological rigor — read 5 papers, note conventions
