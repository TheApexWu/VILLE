# Direction — post-reevaluation (Aug 12 2026)

This supersedes any commercial framing in earlier docs. Read alongside `manifesto.md`; where they differ on *what VILLE is for*, this wins.

## North star

**Capture the feeling and the timeline of the city as accurately as possible — even if incomplete.**
Not survey-grade metric completeness. Atmospheric and temporal truth: what a block *felt* like, and how it *changed* across epochs. Incompleteness is expected and honest, not a failure.

## Locked calls

- **Art first, commercialize later.** VILLE is a body of work. The insurance / architecture commercial lanes and the Business Primer are deferred, out of near-term scope. (Research found no confirmed commercial buyer anyway.)
- **Do it for love; resumable anytime.** No deadline, no obligation, no 90-day guilt. It waits without decaying.
- **Fusion over photo-only ML.** The research is clear: photo-only reconstruction is a gamble that hallucinates. Every project that succeeded fused photos + maps + engravings + archaeology with heavy human curation, per-building/per-block. That *is* the method.

## Hallucinate vs. non-hallucinate mode (first-class feature)

The models fabricate geometry from priors; instead of hiding that, VILLE **shows it as a mode**. This turns the research's central warning into the product's honesty, and it *is* thesis **T2 (Glissant's right to opacity)** made interactive.

- **Format:** every element already carries a required `synthesis_tier ∈ {none, minimal, light, mixed, heavy}` (M1). Read as two bands:
  - **evidence-grounded** = `{none, minimal, light}` — photo/map/survey-derived.
  - **fabulated** = `{mixed, heavy}` — diffusion / procedural / prior-filled (all of Roman/medieval, by necessity).
- **Viewer:** a toggle between two renders of the same scene —
  - **Evidence only:** `{mixed, heavy}` elements are hidden or ghosted (translucent/wireframe/desaturated). You see only what the archive can defend. The gaps are the point.
  - **Full reconstruction:** everything renders, but fabulated geometry is visually marked (a distinct "fabulation" material / shader tint), never passed off as record.
- This is the honest counterpart to `methods.md` — the provenance you can *walk through*, not just read.

## Provenance posture

`synthesis_tier` is not novel and not a moat — it restates the London Charter's paradata norm. Reuse and extend PROV-O / CIDOC CRM / W7; do not author a new format from scratch. The value is the discipline, the aesthetic, and shipping.

## The one make-or-break, for whenever you return

Run MASt3R/VGGT on ~10 real Marville photographs of a single demolished Île-de-la-Cité building and **look** — now with correct expectations (partial, prior-filled, needs map/engraving fusion). Judge feeling and recognizability, not survey error. That pilot is the gate; everything downstream waits on it. (This is Phase-2 in the loop's `PRD.JSON`, marked `human_gate` — the loop preps it, you render the verdict.)
