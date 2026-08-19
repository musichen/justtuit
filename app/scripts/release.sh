#!/usr/bin/env bash
set -euo pipefail
# Release justtuit: bump version, commit, tag, and push (triggers the npm publish workflow).
# Usage: scripts/release.sh [patch|minor|major|X.Y.Z]   (default: patch)

VERSION="${1:-patch}"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_ROOT="$(cd "$APP_DIR/.." && pwd)"

cd "$REPO_ROOT"

CURRENT="$(node -p "require('./app/package.json').version")"

if [[ "$VERSION" == "patch" || "$VERSION" == "minor" || "$VERSION" == "major" ]]; then
  NEXT="$(node -e "
    const [maj, min, pat] = '$CURRENT'.split('.').map(Number);
    const bump = { patch: [maj, min, pat + 1], minor: [maj, min + 1, 0], major: [maj + 1, 0, 0] }['$VERSION'];
    console.log(bump.join('.'));
  ")"
else
  NEXT="$VERSION"
fi

echo "Releasing justtuit $CURRENT -> $NEXT"

node -e "
  const fs = require('fs');
  for (const f of ['app/package.json', 'app/packages/webboxes-justtuit/package.json']) {
    const p = JSON.parse(fs.readFileSync(f, 'utf8'));
    p.version = '$NEXT';
    if (p.dependencies && p.dependencies.justtuit) p.dependencies.justtuit = '^$NEXT';
    fs.writeFileSync(f, JSON.stringify(p, null, 2) + '\n');
  }
"

git add app/package.json app/packages/webboxes-justtuit/package.json
git commit -m "release: v$NEXT"
git tag "v$NEXT"
git push origin main --tags

echo "Pushed v$NEXT - the release workflow will publish to npm."
