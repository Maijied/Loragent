import { execSync, spawn } from 'node:child_process';
import path from 'node:path';
import { getPinSync } from '../../src/lore/auth/pin-manager.js';

/**
 * Safe CLI Command Runner with Multi-Cloud & Platform Auto-Credential Injection
 * Lorapok Labs Enterprise Tool Execution Standard
 */

const DESTRUCTIVE_PATTERNS = [
  /rm\s+-rf\s+(\/|~|\.\.)/i,
  /rm\s+-rf/i,
  /wrangler\s+(delete|drop)/i,
  /gh\s+repo\s+delete/i,
  /firebase\s+(projects:delete|database:remove)/i,
  /az\s+(group\s+delete|resource\s+delete)/i,
  /gcloud\s+projects\s+delete/i,
  /aws\s+s3\s+rb\s+--force/i,
  /git\s+reset\s+--hard\s+HEAD~[0-9]{2,}/i,
  /drop\s+database/i,
  /truncate\s+table/i
];

function fetchVaultCredential(category, key) {
  try {
    const pin = getPinSync();
    const pinEnv = pin ? `CRED_PASSPHRASE="${pin}" ` : '';
    const val = execSync(`${pinEnv}cred get ${category} ${key} 2>/dev/null`, {
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

  // 2. Prepare Environment & Auto-Inject Credentials from Encrypted Vault
  const env = { ...process.env, ...(options.env || {}) };

  // Cloudflare Wrangler auto-credentials
  if (command.startsWith('wrangler') || command.includes('wrangler')) {
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

  // Firebase CLI auto-credentials
  if (command.startsWith('firebase') || command.includes('firebase')) {
    if (!env.FIREBASE_TOKEN) {
      const fbToken = fetchVaultCredential('cursor', 'firebase_token') || fetchVaultCredential('developer', 'firebase_token');
      if (fbToken) env.FIREBASE_TOKEN = fbToken;
    }
  }

  // Azure CLI auto-credentials
  if (command.startsWith('az ') || command.includes(' az ')) {
    if (!env.AZURE_CLIENT_SECRET) {
      const secret = fetchVaultCredential('cursor', 'azure_client_secret') || fetchVaultCredential('azure', 'client_secret');
      if (secret) env.AZURE_CLIENT_SECRET = secret;
    }
  }

  // Google Cloud CLI auto-credentials
  if (command.startsWith('gcloud') || command.startsWith('bq') || command.startsWith('gsutil')) {
    if (!env.GOOGLE_APPLICATION_CREDENTIALS) {
      const credPath = fetchVaultCredential('cursor', 'gcp_service_account_path') || fetchVaultCredential('gcp', 'keyfile');
      if (credPath) env.GOOGLE_APPLICATION_CREDENTIALS = credPath;
    }
  }

  // AWS CLI auto-credentials
  if (command.startsWith('aws ') || command.includes(' aws ')) {
    if (!env.AWS_SECRET_ACCESS_KEY) {
      const secret = fetchVaultCredential('cursor', 'aws_secret_access_key') || fetchVaultCredential('aws', 'secret_key');
      if (secret) env.AWS_SECRET_ACCESS_KEY = secret;
    }
    if (!env.AWS_ACCESS_KEY_ID) {
      const keyId = fetchVaultCredential('cursor', 'aws_access_key_id') || fetchVaultCredential('aws', 'access_key_id');
      if (keyId) env.AWS_ACCESS_KEY_ID = keyId;
    }
  }

  // Vercel auto-credentials
  if (command.startsWith('vercel') || command.includes('vercel')) {
    if (!env.VERCEL_TOKEN) {
      const token = fetchVaultCredential('cursor', 'vercel_token') || fetchVaultCredential('developer', 'vercel_token');
      if (token) env.VERCEL_TOKEN = token;
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
        status: 124,
        stdout,
        stderr: stderr + '\n[TIMEOUT] Command exceeded timeout limit.'
      });
    }, timeout);

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({
        ok: code === 0,
        code,
        status: code,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        ok: false,
        code: 1,
        status: 1,
        stdout,
        stderr: err.message
      });
    });
  });
}
