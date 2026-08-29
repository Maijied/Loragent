import { execSync, spawn } from 'node:child_process';
import path from 'node:path';

/**
 * Safe CLI Command Runner with Auto-Credential Injection
 * Lorapok Labs Enterprise Tool Execution Standard
 */

const DESTRUCTIVE_PATTERNS = [
  /rm\s+-rf\s+(\/|~|\.\.)/i,
  /wrangler\s+(delete|drop)/i,
  /gh\s+repo\s+delete/i,
  /git\s+reset\s+--hard\s+HEAD~[0-9]{2,}/i,
  /drop\s+database/i,
  /truncate\s+table/i
];

function fetchVaultCredential(category, key, pin = '565087') {
  try {
    const val = execSync(`CRED_PASSPHRASE=${pin} cred get ${category} ${key} 2>/dev/null`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
    return val || null;
  } catch {
    return null;
  }
}

export async function executeCLI(command, options = {}) {
  const cwd = options.cwd || process.cwd();
  const allowDestructive = options.allowDestructive || false;
  const timeout = options.timeout || 120000;

  // 1. Guardrail Check
  for (const pattern of DESTRUCTIVE_PATTERNS) {
    if (pattern.test(command) && !allowDestructive) {
      throw new Error(`[WORKSPACE_GUARD] Blocked potentially destructive command: "${command}". Explicit authorization (allowDestructive: true) required.`);
    }
  }

  // 2. Prepare Environment & Auto-Inject Credentials
  const env = { ...process.env, ...(options.env || {}) };

  // Wrangler auto-credentials
  if (command.startsWith('wrangler') || command.includes('npx wrangler')) {
    if (!env.CLOUDFLARE_API_KEY) {
      const apiKey = fetchVaultCredential('cursor', 'cloudflare_global_api_key_ROTATE_ME');
      if (apiKey) env.CLOUDFLARE_API_KEY = apiKey;
    }
    if (!env.CLOUDFLARE_EMAIL) {
      const email = fetchVaultCredential('cursor', 'cloudflare_account_email');
      if (email) env.CLOUDFLARE_EMAIL = email;
    }
    if (!env.CLOUDFLARE_ACCOUNT_ID) {
      env.CLOUDFLARE_ACCOUNT_ID = '26b9a1161cddac39ae8970865a56747c';
    }
  }

  // GitHub CLI auto-credentials
  if (command.startsWith('gh ') || command.includes(' gh ')) {
    if (!env.GH_TOKEN && !env.GITHUB_TOKEN) {
      const ghToken = fetchVaultCredential('cursor', 'github_token') || fetchVaultCredential('developer', 'github_token');
      if (ghToken) {
        env.GH_TOKEN = ghToken;
        env.GITHUB_TOKEN = ghToken;
      }
    }
  }

  return new Promise((resolve) => {
    const child = spawn('bash', ['-c', command], {
      cwd,
      env,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });

    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      resolve({
        ok: false,
        code: 124,
        stdout,
        stderr: stderr + '\n[TIMEOUT] Command exceeded timeout limit.'
      });
    }, timeout);

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({
        ok: code === 0,
        code,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        ok: false,
        code: 1,
        stdout,
        stderr: err.message
      });
    });
  });
}
