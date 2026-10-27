#!/usr/bin/env bash
# Build the site exactly as GitHub Pages does (same Jekyll version and
# settings, via the github-pages gem), then run the pre-publish checks.
#
# Usage (from the repository root):
#   tools/build.sh                          build + check
#   tools/build.sh --against origin/main    also compare essays with the live branch
#
# First run installs the toolchain into vendor/bundle (about 2 minutes).
set -euo pipefail
cd "$(dirname "$0")/.."
export LANG=C.UTF-8 LC_ALL=C.UTF-8

bundle config set --local path vendor/bundle >/dev/null
if ! bundle check >/dev/null 2>&1; then
  echo "Installing the GitHub Pages toolchain (first run only)…"
  bundle install --quiet
fi

JEKYLL_ENV=production bundle exec jekyll build --quiet 2>&1 | grep -v "faraday-retry" || true
test -f _site/index.html || { echo "Build failed: see the messages above."; exit 1; }
python3 tools/check_site.py --built _site "$@"
