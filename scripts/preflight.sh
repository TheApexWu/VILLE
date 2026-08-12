#!/usr/bin/env bash
# VILLE preflight: assert the loop's environment is runnable.
# Bootstraps ajv-cli + puppeteer (local chromium) into ./node_modules — NEVER system.
# Exits 0 on success, non-zero with a diagnostic line on any failure.
set -u

cd "$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
ROOT="$PWD"

fail() { echo "preflight: FAIL — $*" >&2; exit 1; }
log()  { echo "preflight: $*"; }

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "missing required command: $1"
}

# --- 1. node >= 18 ---
need_cmd node
NODE_MAJ="$(node -e 'process.stdout.write(String(process.versions.node.split(".")[0]))' 2>/dev/null)"
[ -n "$NODE_MAJ" ] || fail "could not read node major version"
[ "$NODE_MAJ" -ge 18 ] || fail "node ${NODE_MAJ} < 18 (need >=18)"
log "node $(node --version) ok"

# --- 2. python3 >= 3.10 ---
need_cmd python3
PY_VER="$(python3 -c 'import sys;print("%d.%d"%sys.version_info[:2])' 2>/dev/null)"
[ -n "$PY_VER" ] || fail "could not read python3 version"
PY_OK="$(python3 -c 'import sys;print(1 if sys.version_info[:2]>=(3,10) else 0)' 2>/dev/null)"
[ "$PY_OK" = "1" ] || fail "python3 ${PY_VER} < 3.10 (need >=3.10)"
log "python3 ${PY_VER} ok"

# --- 3. git clean-ish: no untracked secrets, no staged secret blobs ---
need_cmd git
UNTRACKED_SECRETS="$(git ls-files --others --exclude-standard \
  | grep -Ei '(^|/)(\.env$|\.env\.|.*\.env$|.*\.pem$|.*\.key$|id_rsa|id_ed25519|\.p12$|credentials\.json$|secrets\.json$)' \
  | tr '\n' ' ')"
TRACKED_SECRETS="$(git ls-files \
  | grep -Ei '(^|/)(\.env$|\.env\.|.*\.env$|.*\.pem$|.*\.key$|id_rsa|id_ed25519|\.p12$|credentials\.json$|secrets\.json$)' \
  | tr '\n' ' ')"
[ -z "$UNTRACKED_SECRETS" ] || fail "untracked secret files present: ${UNTRACKED_SECRETS}"
[ -z "$TRACKED_SECRETS" ] || fail "tracked secret files present: ${TRACKED_SECRETS}"
log "git tree free of *.env / key files"

# --- 4. local node tooling: ajv-cli + puppeteer (headless chromium) ---
# Never install to system. Bootstrap into ./node_modules if absent or stale.
[ -f package.json ] || fail "no package.json at repo root"
NEED_INSTALL=0
[ -x node_modules/.bin/ajv ] || NEED_INSTALL=1
if [ "$NEED_INSTALL" -eq 0 ]; then
  node -e "require('puppeteer/package.json')" >/dev/null 2>&1 || NEED_INSTALL=1
fi
if [ "$NEED_INSTALL" -eq 1 ]; then
  log "bootstrapping local node_modules (ajv-cli + puppeteer) — this is one-time and local only"
  npm install --no-audit --no-fund --prefer-offline >/tmp/ville-preflight-npm.log 2>&1 \
    || { tail -n 20 /tmp/ville-preflight-npm.log >&2; fail "npm install failed (see /tmp/ville-preflight-npm.log)"; }
fi
[ -x node_modules/.bin/ajv ] || fail "ajv-cli not present in node_modules after install"
node -e "require('puppeteer/package.json')" >/dev/null 2>&1 || fail "puppeteer not present in node_modules after install"
log "ajv-cli $(node_modules/.bin/ajv --version 2>/dev/null || echo 'present') ok"

# --- 5. headless chromium reachable ---
# puppeteer downloads a self-contained Chromium to a user cache (NOT system); we only read it.
CHROME_PATH="$(node -e "try{console.log(require('puppeteer').executablePath())}catch(e){console.log('')}" 2>/dev/null)"
[ -n "$CHROME_PATH" ] || fail "puppeteer did not report a chromium executable path"
[ -x "$CHROME_PATH" ] || fail "puppeteer chromium not on disk at ${CHROME_PATH} (run 'npx puppeteer browsers install chrome')"

# Known puppeteer/macOS drift: the Chrome-for-Testing .app is extracted WITHOUT its
# Contents/Frameworks framework (the 228MB binary that actually runs). Detect the missing
# framework and repair it from the cached zip before trying to launch.
APP_ROOT="$(cd "$(dirname "$CHROME_PATH")/../.." && pwd)"
CHROME_VER="$(printf '%s\n' "$CHROME_PATH" | sed -n 's|.*mac_arm-\([0-9.][0-9.]*\)/.*|\1|p')"
FW_BIN="$APP_ROOT/Contents/Frameworks/Google Chrome for Testing Framework.framework/Versions/$CHROME_VER/Google Chrome for Testing Framework"
if [ ! -x "$FW_BIN" ]; then
  ZIP="$(ls ~/.cache/puppeteer/chrome/*-chrome-mac-arm64.zip 2>/dev/null | head -1)"
  [ -n "$ZIP" ] || fail "puppeteer chromium framework missing and no zip to repair from"
  log "puppeteer dropped Chrome Frameworks on extract — repairing from $ZIP"
  TMPX="$(mktemp -d)"
  ( cd "$TMPX" && unzip -o -q "$ZIP" "chrome-mac-arm64/Google Chrome for Testing.app/Contents/Frameworks/*" ) \
    >/tmp/ville-preflight-repair.log 2>&1 \
    || { cat /tmp/ville-preflight-repair.log >&2; rm -rf "$TMPX"; fail "framework unzip failed"; }
  rm -rf "$APP_ROOT/Contents/Frameworks"
  mv "$TMPX/chrome-mac-arm64/Google Chrome for Testing.app/Contents/Frameworks" "$APP_ROOT/Contents/Frameworks"
  rm -rf "$TMPX"
  [ -x "$FW_BIN" ] || { cat /tmp/ville-preflight-repair.log >&2; fail "framework repair incomplete"; }
fi

# Smoke-launch headless to prove it actually runs (closes immediately).
node -e '
  const p = require("puppeteer");
  (async () => {
    const b = await p.launch({ headless: "new", args: ["--no-sandbox","--disable-gpu"] });
    const v = await b.version();
    await b.close();
    console.log("chromium " + v + " headless launch ok");
  })().catch(e => { console.error(e); process.exit(1); });
' >/tmp/ville-preflight-chrome.log 2>&1 \
  || { cat /tmp/ville-preflight-chrome.log >&2; fail "headless chromium launch failed"; }
log "$(cat /tmp/ville-preflight-chrome.log)"

log "ALL CHECKS PASS"
exit 0
