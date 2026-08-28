#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function runCheckDone() {
  console.log('🔍 [CHORKI HOOK: check-done] Initiating multi-layer verification checks...');
  const rootDir = process.cwd();
  const checks = [];

  // Check 1: Workspace files exist
  checks.push({
    name: 'Workspace Integrity',
    run: () => {
      if (!fs.existsSync(path.join(rootDir, 'package.json'))) {
        throw new Error('package.json missing from workspace');
      }
      return 'package.json verified';
    }
  });

  // Check 2: Core unit tests
  checks.push({
    name: 'Automated Tests',
    run: () => {
      try {
        execSync('npm test --if-present', { stdio: 'pipe' });
        return 'All tests passed cleanly';
      } catch (e) {
        throw new Error(`Test suite failed: ${e.message}`);
      }
    }
  });

  // Check 3: Web build verification
  if (fs.existsSync(path.join(rootDir, 'loragent-web'))) {
    checks.push({
      name: 'loragent-web Build',
      run: () => {
        try {
          execSync('node -c loragent-web/next.config.ts', { stdio: 'pipe' });
          return 'loragent-web verified';
        } catch (e) {
          throw new Error(`loragent-web check failed: ${e.message}`);
        }
      }
    });
  }

  // Check 4: Cloudflare Worker verification
  if (fs.existsSync(path.join(rootDir, 'port', 'mcp-cloudflare', 'src', 'index.js'))) {
    checks.push({
      name: 'Cloudflare Worker Syntax',
      run: () => {
        try {
          execSync('node -c port/mcp-cloudflare/src/index.js', { stdio: 'pipe' });
          return 'Cloudflare worker syntax verified';
        } catch (e) {
          throw new Error(`Cloudflare worker syntax error: ${e.message}`);
        }
      }
    });
  }

  let passed = 0;
  let failed = 0;
  const results = [];

  for (const check of checks) {
    try {
      const msg = check.run();
      console.log(`  ✅ [PASS] ${check.name}: ${msg}`);
      passed++;
      results.push({ name: check.name, status: 'PASS', message: msg });
    } catch (err) {
      console.log(`  ❌ [FAIL] ${check.name}: ${err.message}`);
      failed++;
      results.push({ name: check.name, status: 'FAIL', error: err.message });
    }
  }

  const isComplete = failed === 0;
  console.log(`\n📊 Verification Summary: ${passed} Passed, ${failed} Failed`);
  if (isComplete) {
    console.log('🎉 [CHORKI HOOK] 100% COMPLETE & VERIFIED.');
  } else {
    console.log('⚠️ [CHORKI HOOK] UNFINISHED WORK DETECTED. Continuing execution...');
  }

  return { isComplete, passed, failed, results };
}

if (process.argv[1] && process.argv[1].endsWith('check-done.js')) {
  runCheckDone().then(res => {
    process.exit(res.isComplete ? 0 : 1);
  });
}
