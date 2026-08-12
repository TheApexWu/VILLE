#!/usr/bin/env python3
"""VILLE pack provenance validator (M4).

Asserts every geometry element referenced in a pack's manifest.json has a
provenance.jsonl row with a valid synthesis_tier and license, and that no
orphan provenance rows exist. Emits a synthesis-tier histogram (the honesty
summary).

Exits 0 on success, 1 on any violation. Designed to be schema-tolerant: it
enforces the mandatory contract (id / geometry / provenance ref /
synthesis_tier / license / who / when), not the schema lock — extensions stay
first-class (see spec/SPEC.md §8, m1 handoff).

Usage:
    pipeline/validate_pack.py <pack_dir>           # validate one pack
    pipeline/validate_pack.py <pack_dir> --json    # machine-readable output
"""
import json
import os
import sys
from collections import Counter
from pathlib import Path

VALID_TIERS = ("none", "minimal", "light", "mixed", "heavy")
PROV_REF_PREFIX = "provenance.jsonl#"


def load_manifest(pack_dir: Path):
    mf = pack_dir / "manifest.json"
    if not mf.is_file():
        raise ValidationError(f"manifest.json not found at {mf}")
    try:
        return json.loads(mf.read_text(encoding="utf-8")), mf
    except json.JSONDecodeError as e:
        raise ValidationError(f"manifest.json is not valid JSON: {e}")


def load_provenance(pack_dir: Path):
    pf = pack_dir / "provenance.jsonl"
    if not pf.is_file():
        raise ValidationError(f"provenance.jsonl not found at {pf}")
    rows = []
    for lineno, raw in enumerate(pf.read_text(encoding="utf-8").splitlines(), 1):
        raw = raw.strip()
        if not raw:
            continue
        try:
            rows.append((lineno, json.loads(raw)))
        except json.JSONDecodeError as e:
            raise ValidationError(f"provenance.jsonl:{lineno} invalid JSON: {e}")
    return rows, pf


def entity_id_key(entity_id):
    """Normalize an entity_id (string or object) to a hashable tuple for
    equality. Matches the schema's oneOf: a bare string or an object with
    overture and/or osm+wikidata. We compare on the full present id set so
    that manifest↔provenance agreement is exact (per m2 handoff: 'key-for-key')."""
    if isinstance(entity_id, str):
        return ("str", entity_id)
    if isinstance(entity_id, dict):
        # Sort keys so {a,b} and {b,a} compare equal.
        return ("obj", tuple(sorted(entity_id.items())))
    return ("?", str(entity_id))


class ValidationError(Exception):
    pass


def validate_pack(pack_dir: Path):
    errors = []
    warnings = []

    manifest, mf = load_manifest(pack_dir)
    rows, pf = load_provenance(pack_dir)

    entities = manifest.get("entities", [])
    if not isinstance(entities, list):
        errors.append(f"{mf}: 'entities' is not an array")
        entities = []

    # Index provenance rows by row_id; detect duplicate row_ids.
    prov_by_id = {}
    for lineno, row in rows:
        rid = row.get("row_id")
        if rid is None:
            errors.append(f"{pf}:{lineno}: provenance row missing 'row_id'")
            continue
        if rid in prov_by_id:
            errors.append(f"{pf}:{lineno}: duplicate row_id '{rid}'")
            continue
        prov_by_id[rid] = (lineno, row)

    # Walk manifest entities, enforcing the mandatory contract.
    seen_row_ids = set()
    seen_entity_ids = set()
    tier_counts = Counter()

    for i, ent in enumerate(entities):
        ctx = f"{mf}:entities[{i}]"

        # Required: id (object with overture OR osm+wikidata)
        eid = ent.get("id")
        if not isinstance(eid, dict):
            errors.append(f"{ctx}: missing or non-object 'id'")
        else:
            has_ov = bool(eid.get("overture"))
            has_osm = bool(eid.get("osm"))
            has_wd = bool(eid.get("wikidata"))
            if not (has_ov or (has_osm and has_wd)):
                errors.append(
                    f"{ctx}: id must have overture OR (osm+wikidata); got keys {sorted(eid.keys())}"
                )
            ekey = entity_id_key(eid)
            if ekey in seen_entity_ids:
                errors.append(f"{ctx}: duplicate entity id {eid}")
            seen_entity_ids.add(ekey)

        # Required: geometry ref (path)
        geom = ent.get("geometry")
        if not isinstance(geom, str) or not geom.startswith("geometry/") or not geom.endswith((".glb", ".gltf")):
            errors.append(f"{ctx}: 'geometry' must be a geometry/*.glb|*.gltf path; got {geom!r}")

        # Required: synthesis_tier (valid enum)
        ent_tier = ent.get("synthesis_tier")
        if ent_tier not in VALID_TIERS:
            errors.append(
                f"{ctx}: 'synthesis_tier' must be one of {VALID_TIERS}; got {ent_tier!r}"
            )

        # Required: provenance ref (provenance.jsonl#<row_id>)
        prov_ref = ent.get("provenance")
        if not isinstance(prov_ref, str) or not prov_ref.startswith(PROV_REF_PREFIX):
            errors.append(
                f"{ctx}: 'provenance' must be 'provenance.jsonl#<row_id>'; got {prov_ref!r}"
            )
            continue
        row_id = prov_ref[len(PROV_REF_PREFIX):]
        if not row_id:
            errors.append(f"{ctx}: provenance ref has empty row_id")
            continue
        seen_row_ids.add(row_id)

        if row_id not in prov_by_id:
            errors.append(f"{ctx}: provenance ref '{prov_ref}' has no matching row in provenance.jsonl")
            continue

        prov_lineno, prow = prov_by_id[row_id]

        # Row required fields: who / when / license / synthesis_tier
        for req in ("who", "when", "license", "synthesis_tier"):
            if not prow.get(req):
                errors.append(
                    f"{pf}:{prov_lineno} (row {row_id}): missing required field '{req}'"
                )

        # license must be non-empty string (already checked by truthiness above).
        # synthesis_tier on the row must be a valid enum
        prov_tier = prow.get("synthesis_tier")
        if prov_tier not in VALID_TIERS:
            errors.append(
                f"{pf}:{prov_lineno} (row {row_id}): 'synthesis_tier' must be one of {VALID_TIERS}; got {prov_tier!r}"
            )

        # Tier agreement: manifest entity and provenance row must match exactly.
        if ent_tier in VALID_TIERS and prov_tier in VALID_TIERS and ent_tier != prov_tier:
            errors.append(
                f"{ctx}: synthesis_tier mismatch — manifest says {ent_tier!r}, "
                f"provenance row {row_id} says {prov_tier!r}"
            )

        # entity_id agreement: manifest id must match the prov row's entity_id key-for-key.
        if isinstance(eid, dict):
            prow_eid = prow.get("entity_id")
            if entity_id_key(eid) != entity_id_key(prow_eid):
                errors.append(
                    f"{ctx}: entity_id mismatch — manifest id {eid} vs provenance row {row_id} entity_id {prow_eid!r}"
                )

        # Count the tier for the histogram (use the manifest declaration; the
        # two agree if we got here without an error).
        if ent_tier in VALID_TIERS:
            tier_counts[ent_tier] += 1

    # Orphan provenance rows: rows with no manifest entity pointing at them.
    for rid, (lineno, row) in prov_by_id.items():
        if rid not in seen_row_ids:
            errors.append(
                f"{pf}:{lineno}: orphan provenance row '{rid}' — no manifest entity references it"
            )

    # Histogram — the honesty summary. Always emit all five tiers so the
    # shape of the distribution is visible even when some bands are empty
    # (which is itself meaningful: a pack with zero {mixed,heavy} is making
    # a strong honesty claim). M2's Marville pack legitimately has no
    # none/minimal — the histogram should show that, not hide it.
    histogram = {t: tier_counts.get(t, 0) for t in VALID_TIERS}
    total = sum(histogram.values())

    return errors, warnings, histogram, total


def emit_histogram(histogram, total, out=sys.stdout):
    out.write("synthesis-tier histogram (the honesty summary):\n")
    band_evidence = histogram["none"] + histogram["minimal"] + histogram["light"]
    band_fab = histogram["mixed"] + histogram["heavy"]
    for t in VALID_TIERS:
        n = histogram[t]
        pct = (100.0 * n / total) if total else 0.0
        bar = "#" * int(round(pct / 5.0))  # each '#' ~ 5%
        out.write(f"  {t:8s} {n:3d} ({pct:5.1f}%) {bar}\n")
    out.write(f"  total    {total:3d}\n")
    if total:
        out.write(
            f"  bands: evidence-grounded {{none,minimal,light}} = {band_evidence} "
            f"({100.0*band_evidence/total:.1f}%) | "
            f"fabulated {{mixed,heavy}} = {band_fab} "
            f"({100.0*band_fab/total:.1f}%)\n"
        )


def main(argv):
    if len(argv) < 2:
        sys.stderr.write(__doc__)
        return 2
    pack_dir = Path(argv[1])
    as_json = "--json" in argv[2:]
    if not pack_dir.is_dir():
        sys.stderr.write(f"validate_pack: not a directory: {pack_dir}\n")
        return 2

    try:
        errors, warnings, histogram, total = validate_pack(pack_dir)
    except ValidationError as e:
        sys.stderr.write(f"validate_pack: {e}\n")
        return 1

    if as_json:
        sys.stdout.write(json.dumps({
            "pack": str(pack_dir),
            "ok": not errors,
            "errors": errors,
            "warnings": warnings,
            "histogram": histogram,
            "total": total,
        }, indent=2) + "\n")
    else:
        pack_name = pack_dir.name
        if errors:
            sys.stdout.write(f"validate_pack: FAIL — {pack_name}\n")
            for e in errors:
                sys.stdout.write(f"  - {e}\n")
        else:
            sys.stdout.write(f"validate_pack: PASS — {pack_name} "
                             f"({total} entities, all provenance rows resolved)\n")
        emit_histogram(histogram, total, sys.stdout)

    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
