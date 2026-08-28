#!/usr/bin/env bash
# ==============================================================================
# Loragent Lifecycle Hook: check-done
# Autonomous verification script used by Chorki and Boss to verify completion
# ==============================================================================

set -e

echo "🔍 [CHORKI HOOK: check-done] Running automated workspace verification..."

ROOT_DIR="$(pwd)"
FAILED=0

# 1. Check Git status / uncommitted state
echo "  ▶ Checking Git workspace integrity..."
if git status --porcelain > /dev/null 2>&1; then
    echo "    ✅ Git repository accessible."
else
    echo "    ⚠️ Warning: Git repository not clean or not initialized."
fi

# 2. Check Node.js syntax / tests if package.json exists
if [ -f "$ROOT_DIR/package.json" ]; then
    echo "  ▶ Testing package.json scripts..."
    if npm test --if-present > /dev/null 2>&1; then
        echo "    ✅ Automated test suite passed."
    else
        echo "    ❌ Tests failed!"
        FAILED=1
    fi
fi

# 3. Check Next.js build if loragent-web exists
if [ -d "$ROOT_DIR/loragent-web" ]; then
    echo "  ▶ Verifying loragent-web compilation..."
    if [ -f "$ROOT_DIR/loragent-web/package.json" ]; then
        cd "$ROOT_DIR/loragent-web"
        if npm run build > /dev/null 2>&1; then
            echo "    ✅ loragent-web build verified."
        else
            echo "    ❌ loragent-web build failed!"
            FAILED=1
        fi
        cd "$ROOT_DIR"
    fi
fi

# 4. Check Cloudflare Worker if port/mcp-cloudflare exists
if [ -d "$ROOT_DIR/port/mcp-cloudflare" ]; then
    echo "  ▶ Verifying Cloudflare Worker syntax..."
    if node -c "$ROOT_DIR/port/mcp-cloudflare/src/index.js" > /dev/null 2>&1; then
        echo "    ✅ Cloudflare worker syntax verified."
    else
        echo "    ❌ Cloudflare worker syntax error!"
        FAILED=1
    fi
fi

if [ $FAILED -eq 0 ]; then
    echo "🎉 [CHORKI HOOK: check-done] ALL VERIFICATION GATES PASSED! Task is 100% DONE."
    exit 0
else
    echo "⚠️ [CHORKI HOOK: check-done] Verification FAILED. Self-healing loop must continue."
    exit 1
fi
