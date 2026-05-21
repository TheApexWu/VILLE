# VILLE — Manifesto v0

**Codename:** VILLE · **Format:** `cityPack` (CC0) · **First city:** Paris (Roman → now) · **Started:** May 20 2026 · **Direction locked:** May 21 2026 · **Steward:** Alex Wu (solo) · **Repo:** [github.com/TheApexWu/VILLE](https://github.com/TheApexWu/VILLE)

---

## One sentence

> A pipeline + open spec + web viewer + essay series for reconstructing lost urban geometry from historical sources, with epoch-appropriate ML methods, rendered in a PSX/Shenmue web aesthetic, beginning with Paris from Roman Lutèce to the present.

60% personal work / 25% portfolio / 15% best-case (best-case here means *Heterotopias longform + CVPR/SIGGRAPH-adjacent methods writeup* — not VC narrative). Body of work, not startup.

---

## Why VILLE — the inevitability claim

Sixth Borough did present-day NYC 3D from data. Eyes on the Street did civic sense. VILLE does **historical** 3D from sparse photos, engravings, and archaeological constraint — the next layer of the same project. The intellectual spine is *build-time ML at the research-paper level* (DUSt3R, MASt3R, VGGT, Gaussian Splatting, constrained diffusion). The output is an open file format and a body of essays + playable web scenes per city.

This is the only project shape that uses *all* of Alex's actual muscles — data pipelines, ML/DL roots, writing, civic-memory lineage — and forces real depth, not pipeline glue or data-materialization tricks. It is also the only shape that survives the four hardware/game pivots before it without contradiction.

---

## Three locked theses

> **T2.** The right to opacity is a feature of the format, not a bug. *(Glissant.)*
>
> **T3.** Memory infrastructure should be slow enough to outlive the people who built it, small enough to be carried, and plural enough to disagree with itself. *(Brand + Illich + Pickles.)*
>
> **T5.** The device is disposable; the format is the commons. *(Mbembe + Illich.)*

Backstop: **T4** — *a pack is a fabulation under provenance, not a record under truth* (Hartman). T4 was held back in earlier drafts; the epoch-stack methodology makes it load-bearing now, because Roman/medieval reconstruction is unavoidably synthetic.

---

## Aesthetic

**Shenmue** (geometric accuracy of mundane urban life, period-specific) + **LSD: Dream Emulator** (oneiric, drifting, fragments). PSX/PS2 web rendering: vertex lighting, dithered shadows, soft fog, warm-rust palette, slight CRT scanlines. Three.js + custom GLSL.

Outsider art-meets-real-ML lineage: Strangethink, Cosmo D, Kitty Horrorshow, The Pudding, Stamen, Pitch Interactive, Craig Mod, Robin Sloan, Heterotopias (Gareth Damian Martin), OldNYC (Dan Vanderkam), Are.na Annual.

---

## The substantive method — ML stack by epoch

The project's intellectual spine. Each city release ships a `methods.md` declaring per-element which tier produced it. The `synthesis_tier` field is mandatory in the spec.

| Epoch | Source | ML approach | Synthesis tier |
|---|---|---|---|
| **Roman / Lutèce (~52 BC – 5th c.)** | INRAP archaeology, Crypte Notre-Dame, Arènes de Lutèce, Thermes de Cluny, period scholarship | Procedural + constrained diffusion from archaeological + scholarly priors | **heavy** — declared fabulation |
| **Medieval (5th – 16th c.)** | Illuminated manuscripts, period maps, surviving stones | Constrained diffusion + manual modeling | **heavy** |
| **17th – 18th c.** | Plan de Turgot (1739) bird's-eye engraving (digitized), paintings, *Atlas Historique de Paris* | Engraving→geometry via diffusion + photogrammetry of period prints | **mixed** |
| **19th c.** | Marville (1860s–70s pre/post-Haussmann photos), Baldus, Le Gray | DUSt3R / MASt3R on sparse photo sets | **light** |
| **20th c.** | Atget (1898–1927), BHVP, BnF Gallica, postwar aerial | DUSt3R + Gaussian Splatting | **minimal** |
| **Now** | APUR Emprise Bâtie Paris, IGN, OSM, Overture | Direct geometric import | **none** |

This is the discipline that keeps the project honest. Generative ML earns its place in deep epochs *because* the provenance log declares the synthesis. No silent fabulation.

---

## Build-time ML, ZERO runtime ML

Heavy ML at build: DUSt3R / MASt3R / VGGT (CVPR 2024–25), Gaussian Splatting (SIGGRAPH 2023), constrained diffusion (Stable Diffusion + ControlNet), VLM/OCR on French archives if printed-text OCR is insufficient, LLM-assisted geocoding.

ZERO model on the device. The web viewer is a pure renderer of pre-baked content. NOT.md non-negotiable.

---

## `cityPack` v0.1 (the artwork)

```
paris-ile-de-la-cite-haussmann.citypack/
  manifest.json
  geometry/             # glTF/glb per entity
  textures/             # palette-constrained, period-stylized
  fragments/            # markdown narrative seeds
  media/                # source photos / engravings, license-stamped
  provenance.jsonl      # WHO + WHEN + LICENSE + SYNTHESIS-TIER per element
  schema/               # spec version
  methods.md            # ML methods writeup for this pack
```

- IDs: **Overture GERS primary**, OSM ID + Wikidata QID fallback.
- Per-field provenance non-negotiable.
- **`synthesis_tier` ∈ {none, minimal, light, mixed, heavy}** declares the ML honesty.
- Spec license: CC0. Pack licenses: per upstream source.
- Minimal core + first-class extension mechanism (Hui cosmotechnics defense).

---

## City sequence

1. **Paris** — first city. Architectural depth Alex loves. Roman → now ambition. Heavily digitized archives (BnF Gallica, BHVP, APUR, Atlas Historique de Paris, INRAP, Plan de Turgot). French sources accessible with LLM assist.
2. **NYC** — Sixth Borough provides present-day seed world. OldNYC corpus. Vanderkam precedent.
3. **Shanghai** *(future)* — rudimentary Mandarin (Alex is ABC) + Bristol HPC + Virtual Shanghai (Henriot) + LiZhuoHong BuildingMap. Diaspora-pack disclaimer under CARE/OCAP.
4. **Berlin, CDMX, Lagos** *(speculative)* — only if energy holds.
5. **NOT Tokyo.** Earlier drafts wrongly assumed Japanese reading ability. Tokyo waits until/unless that changes.

---

## Distribution

- **Primary:** website per release. Playable Three.js scene + essay + methods writeup + downloadable pack.
- **Secondary:** low-frequency essay newsletter (Craig Mod / Robin Sloan model).
- **GitHub:** spec + reference viewer + reconstruction pipeline.
- **Twitter:** project-slop posting OK. Heterotopias / Pudding / Stamen-adjacent audience.
- **No Steam. No app store. No mobile. No consumer hardware.** Gallery edition (one-off plinth at Babycastles tier) is an afterthought, not a path.

---

## Tech

- **Frontend:** Three.js or React-Three-Fiber, TypeScript. PSX shader pack from shadertoy / r3f community.
- **ML pipeline:** PyTorch. DUSt3R/MASt3R reference impls. Gaussian Splatting (gsplat or nerfstudio). Stable Diffusion + ControlNet for constrained synthesis. Qwen2.5-VL or InternVL if needed for archival OCR.
- **Compute:** M2 Mac Mini → DGX Spark (Sixth Borough access) → A100/H100 by-hour for heavy runs.
- **Data:** SQLite per pack for provenance, glTF/glb for geometry, plain markdown for fragments.

---

## Phase plan

- **Phase 0** — *this week, writing only.* `WHY.md`, `NOT.md` (drafted), `USE.md`, `ETHICS.md`. Four docs ≤600w each.
- **Phase 1** — *2 weekends.* Draft `cityPack v0.1` spec (~200 lines, CC0). Pick one Île-de-la-Cité block pre-Haussmann (rich Marville coverage). Hand-build the manifest.
- **Phase 2** — *2–3 weekends. **Falsification test.*** Run DUSt3R/MASt3R on 5–10 archival photos of one demolished Île-de-la-Cité building. Get *anything* recognizable as 3D. If this fails utterly, ML spine fails, plan B.
- **Phase 3** — *4–6 weekends.* Three.js viewer + PSX shaders. Load Phase 2 output. Year-slider between two epochs of the same block. Public URL.
- **Phase 4** — *first public release.* `methods.md` + ~2000w cultural essay (Haussmann's clearances, what we can/cannot reconstruct, opacity by design). Twitter.
- **Phase 5** — *epoch stretch.* Add 18th-c. Turgot-engraving layer for the same block. Epoch-stack proves itself.
- **Phase 6** — *Roman.* Add Lutèce layer. Heavy synthesis. T4 fully operational. Provenance honesty is the discipline.

---

## What this version killed

E-ink beacon · LILYGO/Inkplate hardware · WiFi Aware / BLE / LoRa / sneakernet · Godot 4 video game · Steam release · Tokyo as first city · "Bilingual ZH/JA moat" claim · Mesh networking · Sovereign consumer device · Calm Tech certification · AI Disrupt Singapore pitch · NYU Game Center / Frank Lantz email · Babycastles as primary venue · Mudita/reMarkable/TRMNL competitive frame.

## What survived all five session pivots intact

`cityPack` (CC0) · per-field provenance · zero runtime AI · plural / opaque-by-default ethics · Sixth Borough lineage · Eyes on the Street lineage · essay-per-pack discipline · funeral plan day-one · solo steward · 60/25/15 split · permission-to-love-it posture.

---

## Honest constraints on the record

- Alex reads rudimentary Mandarin (ABC) only. Not Japanese. Not Korean. French via LLM assist.
- Carson-tier ML depth is the aspiration; "going back to ML/DL roots" is the energy source. Pipeline glue alone won't carry this project.
- Outsider-art positioning means the work has to *be* outsider — slow, public, weird, consistent over years — not just market itself as such.
- "Body of work, not startup" means no VC pitch, no growth target, no co-founder. If those urges return, re-read NOT.md.

---

## 90-Day Check (Aug 19 2026)

Re-read the manifesto and answer honestly:

1. **Am I still loving this, or has it become obligation?** Obligation → DORMANT.
2. **Did Phase 0 ship?** Four docs written.
3. **Did Phase 1 ship?** Spec v0.1 public on GitHub + one Île-de-la-Cité block manifest hand-built.
4. **Did Phase 2 ship?** DUSt3R run on archival photos. *Something* recognizable as 3D produced.
5. **If Phase 2 failed:** is there a Plan B at the same ML depth? (Probably VLM-on-French-archives + procedural+diffusion synthesis.)

**Outcomes**
- Loved + Phase 2 passed → continue Phase 3 viewer.
- Loved + Phase 2 failed cleanly → pivot ML approach, not the project.
- Loved + Phase 1 only → renegotiate scope. Maybe just essays + spec for now.
- Not loved → DORMANT. The format and any published packs persist. No shame.

---

*If the project drifts toward virality, scale, growth, recurring revenue, app-store distribution, or a co-founder pitch — re-read NOT.md before the next commit. The discipline is the work.*

---

## Companion documents

- `Ville - WHY.md` — the argument for why this object should exist
- `Ville - NOT.md` — refusals, equal billing with this file
- `Ville - Learning Pack.md` — running log of teaching moments, appended across sessions, organized by domain
- *(Phase 0 outputs to come: `USE.md`, `ETHICS.md`, `VALIDATION.md`)*
