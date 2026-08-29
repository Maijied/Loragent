/**
 * Loragent SDK Constants & Enums
 * Lorapok Labs Official Asset
 */

export const Formations = {
  AUTO_TEAM: 'auto-team',
  OFFICE: 'office',
  FREELANCE: 'freelance',
  CHELA: 'chela',
  ALL: 'all'
};

export const FORMATIONS = [
  'orchestrator',
  'auto',
  'office',
  'chela',
  'freelance',
  'observer'
];

export const Categories = {
  ENGINEERING: 'engineering',
  ORCHESTRATION: 'orchestration',
  QUALITY: 'quality',
  DEVOPS: 'devops',
  SECURITY: 'security',
  CREATIVE: 'creative',
  BUSINESS: 'business',
  DOCUMENTATION: 'documentation',
  LANGUAGE_EXPERT: 'language-expert',
  CLOUD: 'cloud',
  DATA: 'data',
  TOOLS: 'tools',
  PUBLISHING: 'publishing',
  COMMUNICATION: 'communication',
  RESEARCH: 'research',
  MONITORING: 'monitoring',
  BROWSER: 'browser',
  MEDIA: 'media',
  NETWORK: 'network',
  SEO: 'seo',
  FREQGHOST: 'freqghost',
  GENERAL: 'general'
};

export const CATEGORIES = Object.values(Categories);

export const AGENT_ROSTER_TOTAL = 224;

export const CoreAgents = {
  BOSS: 'loragent-boss',
  TEACHER: 'loragent-teacher',
  SPIDERNET: 'loragent-spidernet',
  WATCHMAN: 'loragent-watchman',
  WORKSPACE_GUARD: 'loragent-workspace-guard',
  CHORKI: 'loragent-chorki',
  CICD_SPECIALIST: 'loragent-cicd-specialist',
  TECH_DIRECTOR: 'loragent-tech-director',
  BACKEND_SE: 'loragent-backend-se',
  FRONTEND_SE: 'loragent-frontend-se',
  SQA: 'loragent-sqa',
  BUG_HUNTER: 'loragent-bug-hunter'
};

export const LifecycleHooks = {
  CHECK_DONE: 'check-done',
  PRE_COMMIT: 'pre-commit',
  DEPLOY_RETRY: 'deploy-retry',
  TEST_SENTINEL: 'test-sentinel',
  AUTOPILOT_VERIFY: 'autopilot-verify'
};

export const CLOUDFLARE_MCP_DEFAULT_URL = 'https://mcp.lorapk-labs.workers.dev/mcp';
