# M0 — Repo scaffold + preflight (done 2026-08-12)

## Environment facts for the next iteration
- node 26.7.0, python3 3.14.3 (well above the >=18 / >=3.10 floors). No system installs used.
- ajv-cli + puppeteer live in ./node_modules (gitignored). Preflight bootstraps them on first
  run via `npm install`. Do NOT add viewer deps to the root package.json — M5 viewer gets its
  own under viewer/.
- **Puppeteer/macOS drift (handled, but read this):** `npx puppeteer browsers install chrome`
  on this machine extracts the Chrome-for-Testing .app WITHOUT its `Contents/Frameworks`
  framework (the 228MB binary that actually runs). The launcher alone is 68KB and fails with
  `dlopen ... no such file` for the framework. `scripts/preflight.sh` §5 detects the missing
  `Google Chrome for Testing Framework` binary and self-heals by unzipping the Frameworks tree
  out of the cached `*-chrome-mac-arm64.zip` into the .app. If a future puppeteer bump fixes the
  extraction, the repair block becomes a no-op (it only fires when the framework binary is
  absent). Do not delete the `~/.cache/puppeteer/chrome/*.zip` — preflight repairs from it.

## What M0 shipped
- 7 dirs: spec/ pipeline/ viewer/ packs/ docs-notes/ evidence/ fixtures/ (PRD task lists 7;
  PRD verification says "six" — all seven exist, so the verification is satisfied.)
- STATUS.md — phase plan pointer + milestone table.
- package.json (root) — preflight tooling only.
- scripts/preflight.sh — node/python/git/secrets + ajv-cli + headless chromium smoke launch.

## Handoff to M1
- ajv-cli is reachable as `node_modules/.bin/ajv`. M1's schema self-validation and fixture
  validation should call it the same way (local, never `npx`-fetched at runtime).
- Chrome for Testing is already downloaded + repaired in ~/.cache/puppeteer; M5's headless
  screenshot verification can reuse puppeteer from the root node_modules until viewer/ has its own.
