import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

test('Enterprise Lifecycle Hooks & Scripts Suite', (t) => {
  const root = process.cwd();
  const hooksFile = path.join(root, 'hooks', 'hooks.json');

  t.test('should validate hooks/hooks.json 8 enterprise hooks', () => {
    assert.ok(fs.existsSync(hooksFile), 'hooks/hooks.json must exist');
    const data = JSON.parse(fs.readFileSync(hooksFile, 'utf8'));
    assert.ok(Array.isArray(data.hooks), 'data.hooks must be an array');
    assert.strictEqual(data.hooks.length, 8, 'Must contain 8 enterprise hooks');

    const hookNames = data.hooks.map(h => h.name);
    const expected = [
      'pre-commit',
      'post-task-watchman-save',
      'pre-deploy-verify',
      'secret-leak-guard',
      'destructive-io-guard',
      'token-budget-alert',
      'post-image-generate',
      'post-deploy-notify'
    ];

    for (const name of expected) {
      assert.ok(hookNames.includes(name), `Hook ${name} must be defined`);
    }
  });

  t.test('should verify hook scripts exist and are executable', () => {
    const preCommit = path.join(root, 'scripts', 'hooks', 'pre-commit.sh');
    const preDeploy = path.join(root, 'scripts', 'hooks', 'pre-deploy-check.sh');
    const secretScan = path.join(root, 'scripts', 'hooks', 'secret-scan.sh');

    assert.ok(fs.existsSync(preCommit), 'pre-commit.sh must exist');
    assert.ok(fs.existsSync(preDeploy), 'pre-deploy-check.sh must exist');
    assert.ok(fs.existsSync(secretScan), 'secret-scan.sh must exist');
  });

  t.test('should verify secret-scan.sh detects plaintext secrets and passes clean output', () => {
    const secretScanScript = path.join(root, 'scripts', 'hooks', 'secret-scan.sh');

    // 1. Clean output should exit 0
    const cleanCmd = `AGENT_OUTPUT="Normal safe log message" bash "${secretScanScript}"`;
    assert.doesNotThrow(() => {
      execSync(cleanCmd, { stdio: 'pipe' });
    });

    // 2. Secret output (e.g. OpenAI key format sk-...) should exit with non-zero
    let caughtSk = false;
    try {
      execSync(`AGENT_OUTPUT="sk-1234567890123456789012345678901234567890" bash "${secretScanScript}"`, { stdio: 'pipe' });
    } catch (err) {
      caughtSk = true;
      assert.ok(err.stdout.toString().includes('SECRET_DETECTED'), 'Should output SECRET_DETECTED on secret match');
    }
    assert.strictEqual(caughtSk, true, 'Must throw when secret is detected');

    // 3. GitHub token format ghp_... should exit with non-zero
    let caughtGh = false;
    try {
      execSync(`AGENT_OUTPUT="ghp_123456789012345678901234567890123456" bash "${secretScanScript}"`, { stdio: 'pipe' });
    } catch (err) {
      caughtGh = true;
      assert.ok(err.stdout.toString().includes('SECRET_DETECTED'), 'Should output SECRET_DETECTED on GitHub token match');
    }
    assert.strictEqual(caughtGh, true, 'Must throw when GitHub token is detected');
  });
});
