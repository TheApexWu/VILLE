# VILLE — Reading List

Curated, tiered by *what you need to understand the concept Claude just used*. Read tier 1 before Phase 2. Tier 2 during Phase 2–3. Tier 3 when the relevant epoch arrives. Tier 4 is "longform soul food" for the body-of-work arc.

Every entry has: **what it is · why for VILLE · effort · status**. Mark `✅ read` when done. Skim ≠ read.

---

## Tier 1 — Read before Phase 2 starts (the spine of the falsification test)

### 1.1 Gaussian Splatting — the original paper
**Kerbl, Kopanas, Leimkühler, Drettakis — "3D Gaussian Splatting for Real-Time Radiance Field Rendering"** (SIGGRAPH 2023).
- arXiv: https://arxiv.org/abs/2308.04079
- Project page: https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/
- **What:** the foundational paper. Defines how scenes are represented as anisotropic 3D Gaussians + differentiable rasterizer.
- **Why for VILLE:** the entire `/geometry` artifact of every cityPack is downstream of this method. Read sections 1, 3, 4, 6. Skim the math in 5 unless you want to write your own renderer.
- **Effort:** ~3 hours.
- **Status:** ☐

### 1.2 DUSt3R — the camera-pose-and-points step before Splat
**Wang, Leroy, Cabon, Chidlovskii, Revaud — "DUSt3R: Geometric 3D Vision Made Easy"** (CVPR 2024).
- arXiv: https://arxiv.org/abs/2312.14132
- Code: https://github.com/naver/dust3r
- **What:** transformer-based replacement for traditional Structure-from-Motion. Outputs dense 3D pointmaps and camera poses from unposed image pairs.
- **Why for VILLE:** Phase 2's first step. The "5 Marville photos → camera poses + sparse points" pipeline IS DUSt3R. Read the intro + section 3 (method).
- **Effort:** ~2 hours.
- **Status:** ☐

### 1.3 MASt3R — DUSt3R's successor with matching
**Leroy, Cabon, Revaud — "Grounding Image Matching in 3D with MASt3R"** (ECCV 2024).
- arXiv: https://arxiv.org/abs/2406.09756
- **What:** adds metric scale + better feature matching to DUSt3R. Current SOTA for sparse-view.
- **Why for VILLE:** likely the actual model we run in Phase 2. Read the abstract + intro to know what improves over DUSt3R.
- **Effort:** ~1.5 hours.
- **Status:** ☐

### 1.4 Multi-View Geometry — Hartley & Zisserman chapters 1–3
**Hartley & Zisserman — *Multiple View Geometry in Computer Vision*** (Cambridge UP, 2nd ed. 2003).
- PDF (canonical): http://www.robots.ox.ac.uk/~vgg/hzbook/
- **What:** the textbook for traditional photogrammetry. Camera models, epipolar geometry, bundle adjustment.
- **Why for VILLE:** DUSt3R hides this math. Understanding it lets you debug failures, calibrate scale, and read the "fragile" footnotes in modern papers. Read ch. 1 (intro) + ch. 6 (camera models) + ch. 9 (epipolar) — that's it.
- **Effort:** ~6–8 hours. Hardest item on this list.
- **Status:** ☐

### 1.5 InstantSplat / SparseGS — sparse-view variant
**Fan et al. — "InstantSplat: Sparse-view SfM-free Gaussian Splatting in Seconds"** (2024).
- arXiv: https://arxiv.org/abs/2403.20309
- **What:** how to do Gaussian Splatting from 3–10 photos instead of 30–100. Combines DUSt3R initialization with Gaussian training.
- **Why for VILLE:** Marville plates are sparse views. This is the exact regime VILLE works in.
- **Effort:** ~1.5 hours.
- **Status:** ☐

---

## Tier 2 — Read during Phase 2–3 (validation + spec design)

### 2.1 Probabilistic Robotics — chapter 3 only
**Thrun, Burgard, Fox — *Probabilistic Robotics*** (MIT Press, 2005).
- **What:** the canonical text on Bayesian state estimation. Chapter 3 = Gaussian filters, recursive estimation.
- **Why for VILLE:** every geometry value is a distribution, not a number. Forces Bayesian thinking. The Learning Pack entry "Geometry is a distribution, not a value" lives here.
- **Effort:** ~3 hours for ch. 3.
- **Status:** ☐

### 2.2 Calibration of neural networks
**Guo, Pleiss, Sun, Weinberger — "On Calibration of Modern Neural Networks"** (ICML 2017).
- arXiv: https://arxiv.org/abs/1706.04599
- **What:** modern NN confidence scores are systematically overconfident. Reliability diagrams + ECE = how to measure and fix.
- **Why for VILLE:** `geometry_confidence: 0.87` must *actually* mean 87% of the time the value is within tolerance. Without calibration, the cityPack's metadata is decoration.
- **Effort:** ~1.5 hours.
- **Status:** ☐

### 2.3 ControlNet — constrained diffusion
**Zhang, Rao, Agrawala — "Adding Conditional Control to Text-to-Image Diffusion Models"** (ICCV 2023).
- arXiv: https://arxiv.org/abs/2302.05543
- **What:** how to constrain diffusion models with depth maps, edge maps, segmentation masks. The "constraint" that makes generative ML defensible.
- **Why for VILLE:** Roman/medieval epochs need synthesis. ControlNet-class conditioning is the difference between defensible-fabulation (T4 Hartman) and decorative-LARP.
- **Effort:** ~2 hours.
- **Status:** ☐

### 2.4 STAC + CIDOC-CRM — format design precedents
- STAC (SpatioTemporal Asset Catalog) spec: https://stacspec.org/
- CIDOC-CRM (cultural heritage data model): https://cidoc-crm.org/
- **What:** existing standards for spatiotemporal + heritage data. STAC = geospatial-asset-flavored; CIDOC-CRM = museum-heavy.
- **Why for VILLE:** cityPack v0.1 spec should *not* reinvent things STAC already solved (provenance, datetime ranges, links). Borrow shamelessly.
- **Effort:** 2 hours for STAC, skim CIDOC-CRM (heavy).
- **Status:** ☐

### 2.5 IIIF — image protocol for archives
- IIIF spec: https://iiif.io/api/
- BnF Gallica IIIF docs: https://api.bnf.fr/api-iiif-de-recuperation-des-images-de-gallica
- **What:** how digitized archive images are served. Tile-based, level-of-detail, annotations.
- **Why for VILLE:** every Paris source (Gallica, BHVP, Carnavalet, INHA) is IIIF. The pipeline downloads via IIIF. Cite via IIIF URI in provenance.jsonl.
- **Effort:** 1 hour.
- **Status:** ☐

---

## Tier 3 — Read when relevant epoch arrives

### 3.1 Monocular depth (Phase 2 fallback if DUSt3R fails)
- **Marigold** (Ke et al., CVPR 2024): https://arxiv.org/abs/2312.02145
- **Depth Anything v2** (Yang et al., NeurIPS 2024): https://arxiv.org/abs/2406.09414
- **Why:** when only ONE photo of a demolished building exists, multi-view methods fail. Monocular depth + diffusion priors is the fallback.

### 3.2 NeRF (historical context for Splat)
**Mildenhall et al. — "NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis"** (ECCV 2020).
- arXiv: https://arxiv.org/abs/2003.08934
- **Why:** the predecessor to Gaussian Splatting. Worth understanding to know what Splat replaces.

### 3.3 VGGT — frontier general 3D
**Wang et al. — "VGGT: Visual Geometry Grounded Transformer"** (CVPR 2025).
- arXiv: https://arxiv.org/abs/2503.11651
- **Why:** the 2025 SOTA after MASt3R. May supersede the Phase 2 pipeline by the time we get there. Watch this space.

### 3.4 Heritage reconstruction with diffusion (search-and-collect)
- No single canonical paper yet. Search: "diffusion model heritage reconstruction 2024" / "generative AI archaeology"
- **Why:** Phase 6 Roman-era work. The community is forming. Read 3–5 recent papers when Phase 6 starts; methodology conventions in *Journal of Cultural Heritage*.

### 3.5 Coordinate systems & historical French cartography
- EPSG codes for historical French CRS: https://epsg.io/ (search "Lambert" + "France")
- IGN technical docs on Cassini, Bonne, Lambert: https://geodesie.ign.fr/
- **Why:** Vasserot atlas + IGN historical maps each have their own CRS. Wrong reprojection = 30m drift. Phase 1+ concern.

---

## Tier 4 — Longform soul food (the body-of-work arc)

These are *not* methodological — they are *why VILLE deserves to exist*. Read slowly. One per quarter at most.

### 4.1 Yuk Hui — *The Question Concerning Technology in China*
**Urbanomic, 2016** · ISBN 978-0995455009
- **Why:** the strongest argument that "Technology" is not universal — there are *cosmotechnics*, plural. Defends VILLE's minimal-core + extension-mechanism spec. For an ABC building urban-data projects partly about Shanghai, this is the single most relevant book in print.

### 4.2 Catherine D'Ignazio & Lauren Klein — *Data Feminism*
**MIT Press, 2020** · open-access at https://data-feminism.mitpress.mit.edu/
- **Why:** short, technical-reader-friendly, gives you a working ethical vocabulary. "Consider Context" + "Make Labor Visible" chapters speak directly to provenance design.

### 4.3 Denis Wood — *Rethinking the Power of Maps*
**Guilford Press, 2010** · ISBN 978-1593853662
- **Why:** covers Harley, Pickles, AND Wood's own counter-mapping in one accessible volume. Saves you from reading three separate texts.

### 4.4 James C. Scott — *Seeing Like a State*
**Yale UP, 1998** · ISBN 978-0300078152
- **Why:** the book that should make you most uncomfortable about VILLE. Legibility critique. If you can read Scott and still think the project is legitimate, you've earned it.

### 4.5 Anna Tsing — *The Mushroom at the End of the World*
**Princeton UP, 2015** · ISBN 978-0691178325
- **Why:** "arts of noticing," patches not systems, life in ruins. Methodologically closest to what VILLE has to do. Recommended over Fisher (mood-trap right now).

### 4.6 Saidiya Hartman — "Venus in Two Acts"
*Small Axe* 26 (12:2), June 2008. PDF: https://warwick.ac.uk/fac/arts/history/research/centres/blackstudies/venus_in_two_acts.pdf
- **Why:** the source of "critical fabulation" (backstop thesis T4). Read carefully and know its position — it was developed FROM dispossession, and invoking it requires care.

### 4.7 Édouard Glissant — *Poetics of Relation* (chapter "For Opacity")
**U. Michigan Press, 1997**
- **Why:** the source of "right to opacity" (locked thesis T2). Short chapter, dense.

### 4.8 Pierre Nora — "Between Memory and History: Les Lieux de Mémoire"
*Representations* 26 (Spring 1989): 7–24.
- **Why:** the *lieux de mémoire* vs *milieux de mémoire* distinction. VILLE wants to be milieu, accepts being lieu. Short, essential.

### 4.9 Walter Benjamin — *The Arcades Project* (excerpts, not the whole thing)
**Belknap/Harvard, 1999**
- **Why:** the flâneur method + city-as-readable-surface + fragments-not-totalities. VILLE's "fragments shared between devices" is literally a Benjaminian operation. Read Convolutes M (The Flâneur) and N (On the Theory of Knowledge, Theory of Progress).

### 4.10 Stewart Brand — *How Buildings Learn*
**Viking, 1994** · ISBN 978-0140139969
- **Why:** pace layers (site / structure / skin / services / space plan / stuff). The cityPack/viewer/device decomposition is a direct application to *informational* infrastructure.

---

## Lineage references (skim, don't deep-read)

For situating VILLE in its scene, not for methodology:

- **Strangethink Software** — itch.io archive. Generative dream cities.
- **Cosmo D** — *Off-Peak*, *The Norwood Suite*, *Tales from Off-Peak City*. Distribution arc.
- **Heterotopias** (Gareth Damian Martin) — https://heterotopiaszine.com/ — exact critical audience.
- **The Pudding** — https://pudding.cool/ — data-essay artifact lineage.
- **OldNYC** (Dan Vanderkam) — https://www.oldnyc.org/ — one engineer + one dataset + 10yr durability precedent.
- **Sixth Borough** — `~/Documents/GitHub/sixth-borough/` — Alex's direct lineage.

---

## How Claude should reference this

When a concept comes up in conversation, Claude should:
1. **Use it normally** in the explanation.
2. **Cite the entry inline** by short label — e.g., "this is the held-out test (Tier 1 — Gaussian Splatting paper §6) — see Reading List."
3. **Suggest reading** if it hasn't been marked ✅, but don't lecture.
4. **Update entries** as new papers / sources earn their place. Phase 6 will need its own Tier-3 papers we don't have yet.

The discipline: **every Claude session checks this file before re-explaining a Tier-1 concept.**
