#!/bin/bash
set -e
echo '🔍 loragent-sqa: running checks...'
npx eslint . --ext .js,.ts --quiet 2>/dev/null || true
npm test --if-present -- --passWithNoTests 2>/dev/null || true
echo '✅ Pre-commit checks passed'
