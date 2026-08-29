import React, { useState, useMemo, useEffect } from 'react';
import { 
  Terminal, Shield, Cpu, Cloud, Globe, Lock, Play, Pause, CheckCircle2, 
  Copy, Check, Sparkles, Layers, Search, Server, RefreshCw, Zap,
  ChevronRight, ChevronLeft, ExternalLink, Code2, Database, Workflow, Radio,
  Activity, Eye, Box, AlertCircle, ArrowUpRight, GitBranch, Key,
  FileCode, Laptop, Compass, BookOpen, UserCheck, ShieldAlert,
  ShoppingBag, Sliders, CheckSquare, DownloadCloud, Info,
  CheckCircle, ArrowRight, X, Filter, Share2, CornerDownRight,
  FastForward, RotateCcw, Monitor, Send, CheckCheck, Boxes,
  Flame, Users, MessageSquare, KeyRound, Unlock, Heart, AlertTriangle,
  Mail, Inbox, Palette, Package
} from 'lucide-react';
import allAgentsData from './data/all-agents.json';

// SHA-256 Clearance Hash for Zero-Trust Mission Control ('565087')
const CLEARANCE_HASH = '22936f08ff7a9103eaaa3ea9c6b05ab91576bd9dcf2ff874843d55c39b906794';

async function sha256Hex(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// 250 Catalog resources
const MARKET_CATEGORIES = allAgentsData.categories || [];
const ALL_CATALOG_ITEMS = allAgentsData.items || [];
const totalAgents = allAgentsData.totalAgents || 224;
const totalMcp = allAgentsData.totalMcp || 20;
const totalFormations = allAgentsData.totalFormations || 6;
const totalSkills = allAgentsData.totalSkills || 177;

// Workspace Relevance Quick Stack Presets (Kilo Marketplace Standard)
const WORKSPACE_STACKS = [
  { id: 'all', label: 'All Stacks', icon: Layers, count: ALL_CATALOG_ITEMS.length },
  { id: 'react', label: 'React / Next.js', icon: Code2, keywords: ['react', 'next', 'frontend', 'tailwind', 'ui', 'css', 'vite'] },
  { id: 'node', label: 'Node.js / TS', icon: Terminal, keywords: ['node', 'typescript', 'backend', 'api', 'express', 'bun'] },
  { id: 'python', label: 'Python / AI', icon: Cpu, keywords: ['python', 'ai', 'data', 'ml', 'fastapi', 'fal', 'replicate', 'agent'] },
  { id: 'go', label: 'Go / Backend', icon: Database, keywords: ['go', 'golang', 'backend', 'grpc', 'cloud', 'concurrency'] },
  { id: 'cloudflare', label: 'Cloudflare / Edge', icon: Cloud, keywords: ['cloudflare', 'worker', 'wrangler', 'edge', 'kv', 'd1', 'r2', 'amo'] },
  { id: 'devops', label: 'DevOps / CI', icon: GitBranch, keywords: ['cicd', 'deploy', 'docker', 'pipeline', 'git', 'release'] },
  { id: 'security', label: 'Security & Zero-Trust', icon: Shield, keywords: ['security', 'guard', 'vault', 'sqa', 'secret', 'auth', 'hash'] }
];

// Package Ecosystems
const PACKAGE_ECOSYSTEMS = [
  { id: 'npx', name: 'NPX Runner', command: 'npx -y @lorapok/loragent@latest', url: 'https://www.npmjs.com/package/@lorapok/loragent', color: '#00FF41', badge: 'INSTANT CLI' },
  { id: 'npm', name: 'NPM Library', command: 'npm install @lorapok/loragent', url: 'https://www.npmjs.com/package/@lorapok/loragent', color: '#00F3FF', badge: 'SDK / TYPES' },
  { id: 'pypi', name: 'Python PyPI', command: 'pip install loragent', url: 'https://pypi.org/project/loragent/', color: '#3b82f6', badge: 'PYTHON 3.11+' },
  { id: 'go', name: 'Go Proxy', command: 'go get github.com/Maijied/Loragent/v2', url: 'https://pkg.go.dev/github.com/Maijied/Loragent/v2', color: '#a855f7', badge: 'PKG.GO.DEV' },
  { id: 'vscode', name: 'VS Code Ext', command: 'code --install-extension LorapokLabs.loragent', url: 'https://marketplace.visualstudio.com/items?itemName=LorapokLabs.loragent', color: '#00F3FF', badge: 'MARKETPLACE' },
  { id: 'openvsx', name: 'Open VSX', command: 'ovsx get LorapokLabs.loragent', url: 'https://open-vsx.org/extension/LorapokLabs/loragent', color: '#f59e0b', badge: 'ECLIPSE' },
  { id: 'amo', name: 'Firefox AMO', command: 'web-ext sign --api-key=... --api-secret=...', url: 'https://addons.mozilla.org/en-US/firefox/addon/loragent/', color: '#ff7043', badge: 'ADDON' },
  { id: 'packagist', name: 'PHP Composer', command: 'composer require lorapok/loragent', url: 'https://packagist.org/packages/lorapok/loragent', color: '#ec4899', badge: 'LARAVEL 11' }
];

// Themes
const THEMES = [
  { id: 'matrix', name: 'Matrix Cyberpunk', color: '#00FF41', icon: Terminal, desc: 'High-contrast dark-space with neon-green sensory glow' },
  { id: 'aurora', name: 'Aurora Glass', color: '#00F3FF', icon: Sparkles, desc: 'Violet & cyan glassmorphic surfaces with radiant backdrops' },
  { id: 'obsidian', name: 'Obsidian Amber', color: '#f59e0b', icon: Shield, desc: 'Deep warm amber tones with stealth dark aesthetics' }
];

// Formations
const FORMATIONS = [
  {
    id: 'orchestrator',
    name: 'Boss Orchestrator Squad',
    badge: 'Supreme Router',
    color: '#00FF41',
    icon: Compass,
    lead: 'loragent-boss',
    description: 'Central intelligent routing hub. Evaluates task complexity, summons specialized squads via MCP, manages cross-agent steering, and enforces workspace guardrails.',
    squad: ['loragent-boss', 'loragent-teacher', 'loragent-workspace-guard', 'loragent-watchman', 'loragent-spidernet'],
    tools: ['loragent_summon_agent', 'loragent_dismiss_agent', 'loragent_steer', 'loragent_trigger_hook', 'loragent_watchman_save'],
    triggerCmd: '/loragent:boss'
  },
  {
    id: 'auto-team',
    name: 'Auto Team Matrix',
    badge: 'Engineering Squad',
    color: '#00F3FF',
    icon: Code2,
    lead: 'loragent-tech-director',
    description: 'Autonomous full-stack engineering. Converts product requirements into architecture, writes backend APIs, builds biological UIs, runs automated SQA suites, and executes CI/CD releases.',
    squad: ['loragent-tech-director', 'loragent-backend-se', 'loragent-frontend-se', 'loragent-sqa', 'loragent-cicd-specialist'],
    tools: ['bash', 'filesystem_read', 'filesystem_write', 'loragent_steer', 'loragent_trigger_hook'],
    triggerCmd: '/loragent-boss auto'
  },
  {
    id: 'office',
    name: 'Enterprise Office Matrix',
    badge: 'Business Operations',
    color: '#a855f7',
    icon: Layers,
    lead: 'loragent-project-coordinator',
    description: 'Strategic initialization and continuous operations. Manages roadmaps, prepares enterprise proposals, produces marketing campaigns, publishes release notes, and coordinates public relations.',
    squad: ['loragent-project-coordinator', 'loragent-marketing-strategy-manager', 'loragent-publisher', 'loragent-pr-specialist', 'loragent-social-media-specialist'],
    tools: ['filesystem_read', 'filesystem_write', 'loragent_steer', 'email_send', 'slack_notify'],
    triggerCmd: '/loragent:office'
  },
  {
    id: 'chela',
    name: 'Chela Debugging Matrix',
    badge: 'Zero-Guess Bug Hunter',
    color: '#f59e0b',
    icon: Zap,
    lead: 'loragent-bug-hunter',
    description: 'Mission-critical root-cause analysis. Parses real-time orchestration graphs and telemetry, diagnoses runtime regressions, repairs broken pipelines, and provides self-healing hotfixes.',
    squad: ['loragent-bug-hunter', 'loragent-shift-engineer', 'loragent-git-specialist', 'loragent-inspector', 'loragent-repo-repair'],
    tools: ['bash', 'filesystem_read', 'filesystem_write', 'loragent_steer', 'loragent_watchman_save'],
    triggerCmd: '/loragent-boss chela'
  },
  {
    id: 'freelance',
    name: 'Freelance Isolation Matrix',
    badge: 'Specialist Domain',
    color: '#3b82f6',
    icon: Sparkles,
    lead: 'loragent-image-generate',
    description: 'Singular hyper-focused specialists invoked on-demand for specific outputs: Fal.ai/Replicate generative art, FFmpeg GIF creation, Cloudflare Wrangler edge, 3D WebGL, and tool installation.',
    squad: ['loragent-image-generate', 'loragent-gif-create', 'loragent-deploy', 'loragent-tools-install', 'loragent-wrangler-specialist', 'loragent-3d-designer'],
    tools: ['bash', 'fal_run_model', 'run_model', 'filesystem_read', 'filesystem_write'],
    triggerCmd: '/loragent:freelance'
  },
  {
    id: 'observer',
    name: 'Observer & Sentinel Matrix',
    badge: 'Continuous Learning',
    color: '#ec4899',
    icon: Eye,
    lead: 'loragent-watchman',
    description: 'Continuous execution telemetry, memory preservation, and self-expanding conversational learning. Student extracts new paradigms and Register compiles new skills dynamically.',
    squad: ['loragent-watchman', 'loragent-student', 'loragent-register', 'loragent-gold-collector', 'loragent-workspace-guard', 'loragent-database-updater'],
    tools: ['loragent_watchman_save', 'loragent_get_state', 'filesystem_read', 'firebase_admin'],
    triggerCmd: '/loragent-watchman continue'
  }
];

// Rich Animated Workflow Scenarios
const WORKFLOW_SCENARIOS = [
  {
    id: 'auto-team',
    name: 'Auto Team: Full-Stack Engineering',
    command: '/loragent:boss auto',
    badge: 'Engineering Pipeline',
    color: 'emerald',
    description: 'Autonomous development of a multi-tenant cloud service from architecture to verified CI/CD release.',
    stages: [
      {
        step: 1,
        title: 'Developer Prompt & IDE Dispatch',
        agent: 'Developer via Cursor / Claude Code',
        role: 'Client Prompt Input',
        action: 'Ingesting directive: "Build auth service with PostgreSQL, Next.js UI & SQA suites"',
        protocol: 'Layer 1 & Layer 2 Root Rules (AGENTS.md & .mcp.json)',
        telemetry: 'PROMPT_INGEST: tokens=142, editor="cursor-ide", formation="auto"',
        badge: 'INPUT',
        color: '#00FF41'
      },
      {
        step: 2,
        title: 'Requirements Normalization & Boss Routing',
        agent: 'loragent-teacher ➔ loragent-boss',
        role: 'Orchestration Hub',
        action: 'Teacher clarifies API parameters; Boss selects Auto Team Matrix and initializes squad',
        protocol: 'loragent_steer MCP routing with zero heuristic guessing',
        telemetry: 'BOSS_EVAL: complexity=HIGH, squad=["tech-director", "backend-se", "frontend-se", "sqa", "cicd"]',
        badge: 'ROUTING',
        color: '#00F3FF'
      },
      {
        step: 3,
        title: 'On-Demand Specialist Lazy Summoning',
        agent: 'loragent-boss ➔ Global Roster',
        role: 'Token Sniper Loader',
        action: 'Boss lazily summons loragent-tech-director and backend-se into workspace without context bloat',
        protocol: 'loragent_summon_agent MCP tool call',
        telemetry: 'MCP_SUMMON: agent="loragent-tech-director", tokens_cached=1240, resident_preserved=5',
        badge: 'LAZY LOAD',
        color: '#a855f7'
      },
      {
        step: 4,
        title: 'Zero-Trust Vault & Destructive Guardrails',
        agent: 'loragent-workspace-guard ➔ TiTi Vault',
        role: 'Security Enclave',
        action: 'Workspace Guard approves safe read/write; Vault decrypts AES-256 tokens into in-memory child process',
        protocol: 'Machine AES-256 Enclave (Zero Plaintext Secrets)',
        telemetry: 'VAULT_AUTH: clearance_hash="VERIFIED", injected=["DATABASE_URL", "JWT_SECRET"], leaks_scanned=0',
        badge: 'SECURITY',
        color: '#f59e0b'
      },
      {
        step: 5,
        title: 'Full-Stack Implementation & Handoffs',
        agent: 'Tech Director ➔ Backend SE ➔ Frontend SE',
        role: 'Collaborative Engineering',
        action: 'Tech Director defines OpenAPI spec; Backend writes PostgreSQL routes; Frontend builds Biological UI',
        protocol: 'Sequential loragent_steer structured JSON payloads',
        telemetry: 'STEER_PAYLOAD: files_written=["src/auth.ts", "src/AuthCard.tsx"], status="SUCCESS"',
        badge: 'BUILD',
        color: '#3b82f6'
      },
      {
        step: 6,
        title: 'Automated SQA Gates & Pre-Deploy Hook',
        agent: 'loragent-sqa ➔ loragent-cicd-specialist',
        role: 'Quality Assurance & Release',
        action: 'Runs 44/44 test suites, executes security linters, validates SSG bundle and fires pre-deploy hook',
        protocol: 'Lifecycle Hook: pre_git_commit & pre_deploy_verify',
        telemetry: 'SQA_RUN: tests_passed=44, failed=0, code_coverage="100%", gate="APPROVED"',
        badge: 'VERIFICATION',
        color: '#10b981'
      },
      {
        step: 7,
        title: 'Continuous Learning & Hivemind Sync',
        agent: 'loragent-watchman ➔ loragent-student ➔ loragent-register',
        role: 'Evolutionary Learning Sentinel',
        action: 'Watchman checkpoints graph; Student extracts new patterns, Register dynamically updates catalog & Firebase',
        protocol: 'Lifecycle Hook: post_agent_task + Continuous Evolution',
        telemetry: 'STUDENT_LEARN: new_skill="auth-flow-v2", catalog="UPSERTED", mirrors="SYNCED", hivemind="EMITTED"',
        badge: 'EVOLUTION',
        color: '#ec4899'
      }
    ]
  },
  {
    id: 'chela',
    name: 'Chela: Zero-Guess Bug Hunting',
    command: '/loragent:boss chela',
    badge: 'Mission-Critical Fix',
    color: 'amber',
    description: 'Diagnoses runtime regressions, parses live orchestration telemetry, and delivers hotfixes with zero guessing.',
    stages: [
      {
        step: 1,
        title: 'Incident Telemetry Ingestion',
        agent: 'Developer Prompt / CI Failure',
        role: 'Incident Alert',
        action: 'Triggered by 500 error in token refresh or CI/CD test failure',
        protocol: 'Error Telemetry Protocol',
        telemetry: 'INCIDENT_ALERT: error="TypeError: Cannot read properties of undefined (reading refreshToken)"',
        badge: 'ALERT',
        color: '#ef4444'
      },
      {
        step: 2,
        title: 'Chela Formation Activation',
        agent: 'loragent-boss ➔ loragent-bug-hunter',
        role: 'Zero-Guess Investigator',
        action: 'Boss routes task to Chela Squad; Bug Hunter summoned to inspect orchestration graph',
        protocol: 'loragent_steer MCP routing',
        telemetry: 'CHELA_DISPATCH: lead="loragent-bug-hunter", squad=["shift-engineer", "debugger", "inspector"]',
        badge: 'DISPATCH',
        color: '#f59e0b'
      },
      {
        step: 3,
        title: 'Orchestration Graph Telemetry Parsing',
        agent: 'loragent-bug-hunter',
        role: 'Telemetry Diagnosis',
        action: 'Parses .loragent-debug/orchestration-graph.json to extract exact file path and stack trace',
        protocol: 'Deterministic Graph Analysis (No heuristic guessing)',
        telemetry: 'GRAPH_PARSE: file="src/middleware/auth.ts:42", root_cause="missing null check on bearer header"',
        badge: 'DIAGNOSIS',
        color: '#00F3FF'
      },
      {
        step: 4,
        title: 'Surgical Minimal Patch Application',
        agent: 'loragent-shift-engineer',
        role: 'Surgical Patch Engineer',
        action: 'Applies minimal 2-line defensive check without breaking existing contracts',
        protocol: 'AST Safe Code Mutation',
        telemetry: 'PATCH_APPLIED: diff="+if (!authHeader) return unauthorized();", lines_changed=2',
        badge: 'PATCH',
        color: '#10b981'
      },
      {
        step: 5,
        title: 'Regression Testing & Knowledge Extraction',
        agent: 'loragent-sqa ➔ loragent-student',
        role: 'Regression Validation & Self-Upgrade',
        action: 'Executes reproduction tests and triggers loragent-student to upgrade existing middleware rules',
        protocol: 'Automated Regression Pass & Dynamic Agent Evolution',
        telemetry: 'VERIFICATION: tests=44/44 PASS, memory="UPDATED", regression_fixed=true',
        badge: 'RESOLVED',
        color: '#00FF41'
      }
    ]
  },
  {
    id: 'office',
    name: 'Enterprise Office: Strategic Launch',
    command: '/loragent:office',
    badge: 'Business Operations',
    color: 'purple',
    description: 'Executive strategy, documentation, marketing campaigns, and multi-channel publication.',
    stages: [
      {
        step: 1,
        title: 'Product Briefing & Strategy Alignment',
        agent: 'Human Executive ➔ Project Coordinator',
        role: 'Business Ingestion',
        action: 'Coordinates product launch plan, milestone deadlines, and PR messaging targets',
        protocol: 'Enterprise Office Matrix Ingestion',
        telemetry: 'OFFICE_INIT: project="loragent-v2", deliverables=["press-release", "marketing-deck", "changelog"]',
        badge: 'BRIEFING',
        color: '#a855f7'
      },
      {
        step: 2,
        title: 'Sensory Campaign Generation',
        agent: 'Marketing Strategy Manager ➔ Visual Generator',
        role: 'Campaign Producer',
        action: 'Produces biological UI mockups, dark-space banners, and high-conversion copy',
        protocol: 'loragent_image_generate + Sensory UI Directives',
        telemetry: 'CREATIVE_GEN: assets=8, style="biological-sensory", resolution="4K", format="WEBP"',
        badge: 'CREATIVE',
        color: '#ec4899'
      },
      {
        step: 3,
        title: 'Multi-Channel Publishing & PR Dispatch',
        agent: 'Publisher ➔ PR Specialist',
        role: 'Ecosystem Distribution',
        action: 'Publishes release notes across GitHub, npm, PyPI, Go Proxy, and generates newsletter',
        protocol: 'Ecosystem Broadcast & Webhook Triggers',
        telemetry: 'CHANNELS_EMITTED: ["npm", "pypi", "pkg.go.dev", "marketplace", "twitter", "blog"]',
        badge: 'BROADCAST',
        color: '#3b82f6'
      }
    ]
  }
];

// IDE MCP Config Snippets
const IDE_CONFIGS = {
  cursor: {
    name: 'Cursor IDE',
    file: '.cursor/mcp.json',
    snippet: `{\n  "mcpServers": {\n    "loragent": {\n      "command": "node",\n      "args": ["${typeof window !== 'undefined' ? window.location.origin : ''}/port/mcp/server.js"]\n    }\n  }\n}`,
    description: 'Native Cursor agent integration with project-level or global rules.'
  },
  claude: {
    name: 'Claude Code / Desktop',
    file: 'claude_desktop_config.json',
    snippet: `{\n  "mcpServers": {\n    "loragent": {\n      "command": "node",\n      "args": ["/absolute/path/to/loragent/port/mcp/server.js"],\n      "env": {\n        "CRED_PASSPHRASE": "your-machine-vault-pin"\n      }\n    }\n  }\n}`,
    description: 'Claude Code 3-layer extended memory with automated watchman checkpointing.'
  },
  antigravity: {
    name: 'Google Antigravity',
    file: '.agents/mcp_config.json',
    snippet: `{\n  "mcpServers": {\n    "loragent": {\n      "command": "node",\n      "args": ["/path/to/loragent/port/mcp/server.js"]\n    }\n  }\n}`,
    description: 'DeepMind Antigravity multi-agent orchestration and dynamic tool mesh.'
  },
  windsurf: {
    name: 'Windsurf Cascade',
    file: '~/.codeium/windsurf/mcp_config.json',
    snippet: `{\n  "mcpServers": {\n    "loragent": {\n      "command": "node",\n      "args": ["/path/to/loragent/port/mcp/server.js"]\n    }\n  }\n}`,
    description: 'Cascade agent integration with real-time Flow triggers.'
  },
  zed: {
    name: 'Zed Editor',
    file: '~/.config/zed/settings.json',
    snippet: `{\n  "assistant": {\n    "version": "2",\n    "mcp_servers": {\n      "loragent": {\n        "command": "node",\n        "args": ["/path/to/loragent/port/mcp/server.js"]\n      }\n    }\n  }\n}`,
    description: 'Zed Assistant integration with ultra-fast Rust-level response and MCP capabilities.'
  }
};

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormationFilter, setSelectedFormationFilter] = useState('all');
  const [selectedStackFilter, setSelectedStackFilter] = useState('all');
  
  // Theme State
  const [activeTheme, setActiveTheme] = useState('matrix');
  const [activePackageTab, setActivePackageTab] = useState('npx');
  const [activeTab, setActiveTab] = useState('workflow');

  // Sync theme class to body
  useEffect(() => {
    document.body.className = `theme-${activeTheme}`;
  }, [activeTheme]);

  // Pagination & Modal State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(24);
  const [copied, setCopied] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [installScope, setInstallScope] = useState('project');
  const [modalCopied, setModalCopied] = useState(false);

  // Animated Workflow Simulator State
  const [selectedScenarioId, setSelectedScenarioId] = useState('auto-team');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playSpeed, setPlaySpeed] = useState(1);

  // Terminal Simulator State
  const [simCommand, setSimCommand] = useState('loragent discover -f react');
  const [simRunning, setSimRunning] = useState(false);
  const [simLogs, setSimLogs] = useState([
    '⚡ Loragent Core Sentinel initialized [v2.0.0-PROPOSAL]',
    '🔒 Zero-Trust Vault: Connected via Machine AES-256 (PIN Protected)',
    '🌐 Cloudflare Edge Registry: 250 Items Synchronized (224 Agents, 20 MCP Servers, 6 Formations)',
    'Ready for directive. Select a command or click "Run Directive" below.'
  ]);

  // MCP Config Tab State
  const [activeMcpTab, setActiveMcpTab] = useState('cursor');

  // Mission Control Drawer State (Bottom Drawer)
  const [isMissionControlOpen, setIsMissionControlOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [adminPinError, setAdminPinError] = useState(false);

  // Active scenario & stage
  const currentScenario = useMemo(() => {
    return WORKFLOW_SCENARIOS.find((s) => s.id === selectedScenarioId) || WORKFLOW_SCENARIOS[0];
  }, [selectedScenarioId]);

  const activeStage = useMemo(() => {
    return currentScenario.stages[currentStepIndex] || currentScenario.stages[0];
  }, [currentScenario, currentStepIndex]);

  // Auto-play animation timer for workflow
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = 3200 / playSpeed;
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % currentScenario.stages.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [isPlaying, currentScenario, playSpeed]);

  const copyCode = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleModalCopy = (text) => {
    navigator.clipboard.writeText(text);
    setModalCopied(true);
    setTimeout(() => setModalCopied(false), 2000);
  };

  const handleRunSim = () => {
    setSimRunning(true);
    setSimLogs((prev) => [...prev, `\n> ${simCommand}`, '⏳ Routing through loragent-boss...']);

    setTimeout(() => {
      if (simCommand.includes('discover')) {
        setSimLogs((prev) => [
          ...prev,
          '🔍 [FACE] Running Intelligent PC Asset Discovery & Deduplication...',
          '📍 Scanned Locations: 12 root directories across OS',
          '📦 Total Raw Files Scanned: 4,349 skills & agents',
          '✨ Unique Canonical Skills: 25 distinct capabilities (Filtered by "react")',
          '🗑️ Redundant Clones Filtered: 3,105 duplicates collapsed',
          '⭐ Top Skill: react-specialist [Q:94/100] (+3 clones filtered)',
          '✅ Deduplicated inventory saved to registry/pc-inventory.json'
        ]);
      } else if (simCommand.includes('analyze')) {
        setSimLogs((prev) => [
          ...prev,
          '🔍 [FACE] Analyzing project workspace at: .',
          '💻 Languages Detected: TypeScript, JavaScript, Python, Go',
          '📦 Frameworks Detected: React, Next.js, FastAPI, Tailwind CSS',
          '🛡️ Recommended Formation Squad: Auto-Team Matrix',
          '🤖 Summoned Squad: loragent-boss, loragent-tech-director, loragent-workspace-guard, loragent-frontend-se',
          '✅ Ready! Run "loragent sync" to bind squad to workspace.'
        ]);
      } else if (simCommand.includes('sync')) {
        setSimLogs((prev) => [
          ...prev,
          '🔄 [FACE] Starting Universal Loragent IDE Sync...',
          '✅ Synced MCP configs to: Cursor, Antigravity, Claude, Windsurf, VS Code, Zed',
          '✅ Synced 224 canonical agents into master roster: ~/.loragent/master-roster/skills',
          '✅ Synced workspace rules to: .cursor/rules/ and .agents/rules/',
          '🎉 Universal AI Code Editor compatibility sync complete.'
        ]);
      } else if (simCommand.includes('student') || simCommand.includes('learn')) {
        setSimLogs((prev) => [
          ...prev,
          '🎓 [Student] Listening to live developer conversation...',
          '💡 [Student] Novel pattern identified: "FastAPI Lifespan Async Connection Pool"',
          '📝 [Register] Synthesizing skills/loragent-fastapi-async/SKILL.md with LLDP v2.0 metadata',
          '🔄 [Register] Re-indexing registry/marketplace.json (257 total resources)',
          '📡 [Database Updater] Telemetry synchronized to Firebase Hivemind!'
        ]);
      } else {
        setSimLogs((prev) => [
          ...prev,
          '🤖 [Boss] Delegating to specialist for execution',
          '🛡️ [Workspace Guard] Zero destructive commands detected',
          '✅ Task completed cleanly.'
        ]);
      }
      setSimRunning(false);
    }, 900);
  };

  const handleAdminAuth = async (e) => {
    e.preventDefault();
    const hash = await sha256Hex(adminPin);
    if (hash === CLEARANCE_HASH) {
      setIsAdminAuthenticated(true);
      setAdminPinError(false);
      setAdminPin('');
    } else {
      setAdminPinError(true);
    }
  };

  // Filter items based on search, stack preset, type, formation
  const filteredItems = useMemo(() => {
    return ALL_CATALOG_ITEMS.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.slug && item.slug.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));

      const matchType = selectedType === 'all' ||
        (selectedType === 'agent' && (item.type === 'AGENT' || item.type === 'RESIDENT AGENT' || item.type === 'SPECIALIST SKILL')) ||
        (selectedType === 'mcp_server' && item.type === 'MCP SERVER');

      const matchFormation = selectedFormationFilter === 'all' ||
        (item.formation && item.formation.toLowerCase() === selectedFormationFilter.toLowerCase());

      const matchCategory = selectedCategory === 'all' ||
        (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

      let matchStack = true;
      if (selectedStackFilter !== 'all') {
        const stackConfig = WORKSPACE_STACKS.find(s => s.id === selectedStackFilter);
        if (stackConfig && stackConfig.keywords) {
          const haystack = `${item.name} ${item.slug} ${item.description} ${(item.tags || []).join(' ')} ${item.category || ''}`.toLowerCase();
          matchStack = stackConfig.keywords.some(kw => haystack.includes(kw));
        }
      }

      return matchSearch && matchType && matchFormation && matchCategory && matchStack;
    });
  }, [search, selectedType, selectedFormationFilter, selectedCategory, selectedStackFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const displayedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* ─── HEADER / NAVIGATION ─── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[1.5px] shadow-[0_0_20px_rgba(0,255,65,0.4)]">
              <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                <Workflow className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white font-mono">LOR<span className="text-emerald-400">AGENT</span></span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">v2.0</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 hidden sm:block">Universal Multi-Agent Orchestration · Lorapok Labs</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
            {[
              { id: 'workflow', label: 'Animated Process', icon: Workflow, badge: 'LIVE' },
              { id: 'catalog', label: '224 Agent Marketplace', icon: ShoppingBag, count: '250' },
              { id: 'formations', label: '6 Squads', icon: Layers, count: '6' },
              { id: 'terminal', label: 'Terminal Simulator', icon: Terminal },
              { id: 'vault', label: 'Zero-Trust Vault', icon: Lock },
              { id: 'ide', label: 'Multi-IDE Setup', icon: Laptop }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    const el = document.getElementById(tab.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(0,255,65,0.15)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-white/10 text-slate-300 rounded-full font-mono">
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500 text-black font-mono font-bold rounded-full animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Theme & GitHub Links */}
          <div className="flex items-center gap-2">
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
              {THEMES.map((theme) => {
                const isCur = activeTheme === theme.id;
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme.id)}
                    title={theme.desc}
                    className={`p-1.5 rounded-md transition-all ${isCur ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Icon size={14} />
                  </button>
                );
              })}
            </div>

            <a
              href="https://github.com/Maijied/Loragent"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative z-10 pt-14 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/5 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-5 shadow-[0_0_20px_rgba(0,255,65,0.15)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>LLDP v2.0 Standard · 224 Autonomous Agents · 20 MCP Servers · 6 Formations</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-5">
            Universal Multi-Agent Ecosystem for <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Autonomous Software Engineering
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            A 224-agent virtual software firm powered by a Hub-and-Spoke topology. Orchestrated by <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono text-sm">loragent-boss</code>, secured by the Zero-Trust <strong>TiTi Vault Enclave</strong>, and continuously evolved by <code className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 font-mono text-sm">loragent-student</code>.
          </p>

          {/* Universal Package Ecosystem Ribbon */}
          <div className="glass-card max-w-4xl mx-auto p-5 text-left mb-8 border border-white/10 rounded-2xl">
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Boxes size={16} className="text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Universal Package Ecosystem & Marketplaces
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Live across 8 package registries
              </span>
            </div>

            {/* Package Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
              {PACKAGE_ECOSYSTEMS.map((pkg) => {
                const isSelected = activePackageTab === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => setActivePackageTab(pkg.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap border ${
                      isSelected 
                        ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                        : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                    }`}
                    style={{ borderColor: isSelected ? pkg.color : 'transparent' }}
                  >
                    <span style={{ color: isSelected ? pkg.color : '#94a3b8' }}>{pkg.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Command Box */}
            {(() => {
              const curPkg = PACKAGE_ECOSYSTEMS.find(p => p.id === activePackageTab) || PACKAGE_ECOSYSTEMS[0];
              return (
                <div className="bg-[#020509] border border-white/10 rounded-xl p-3 sm:p-4 flex justify-between items-center flex-wrap gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-[260px]">
                    <Terminal size={16} style={{ color: curPkg.color }} />
                    <code className="font-mono text-sm text-white">{curPkg.command}</code>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-mono font-bold" style={{ color: curPkg.color }}>
                      {curPkg.badge}
                    </span>
                  </div>

                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => copyCode(curPkg.command, `pkg-${curPkg.id}`)}
                      className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-1.5"
                      style={{ background: curPkg.color, color: '#000' }}
                    >
                      {copied === `pkg-${curPkg.id}` ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copied === `pkg-${curPkg.id}` ? 'Copied' : 'Copy'}</span>
                    </button>
                    <a
                      href={curPkg.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-xs font-mono rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1"
                    >
                      <span>Registry</span>
                      <ArrowUpRight size={13} />
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center hover:border-emerald-500/30 transition-colors">
              <div className="text-2xl font-bold font-mono text-emerald-400 mb-0.5">224</div>
              <div className="text-xs font-medium text-slate-300 font-mono">Autonomous Agents</div>
              <div className="text-[10px] text-slate-500 mt-0.5">LLDP v2.0 Standard</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center hover:border-cyan-500/30 transition-colors">
              <div className="text-2xl font-bold font-mono text-cyan-400 mb-0.5">6</div>
              <div className="text-xs font-medium text-slate-300 font-mono">Squad Formations</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Auto, Chela, Office, etc.</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center hover:border-purple-500/30 transition-colors">
              <div className="text-2xl font-bold font-mono text-purple-400 mb-0.5">20</div>
              <div className="text-xs font-medium text-slate-300 font-mono">Edge MCP Servers</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Cloudflare Worker Mesh</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center hover:border-amber-500/30 transition-colors">
              <div className="text-2xl font-bold font-mono text-amber-400 mb-0.5">100%</div>
              <div className="text-xs font-medium text-slate-300 font-mono">TiTi Vault Enclave</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Zero Plaintext Secrets</div>
            </div>
          </div>

          {/* Hero Visual Banner & Sensory Computing Showcase */}
          <div className="max-w-4xl mx-auto rounded-3xl border border-white/15 overflow-hidden shadow-[0_0_80px_rgba(0,255,65,0.12)] relative group bg-[#020509]">
            <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full overflow-hidden bg-slate-950">
              <img 
                src="/assets/loragent-hero-banner.jpg" 
                alt="Loragent Sensory Computing Visual Architecture" 
                className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
              
              {/* Overlay Status Badges */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>HUB-AND-SPOKE DYNAMIC MESH</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold">
                    ACTIVE: loragent-boss
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold">
                    LEARNING: loragent-student
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">

        {/* ─── 1. FULL ANIMATED WORKFLOW PROCESS SIMULATOR ─── */}
        <section id="workflow" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <Workflow className="w-4 h-4" />
                <span>INTERACTIVE MULTI-AGENT EXECUTION ENGINE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Full Animated Execution Process
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Experience real-time prompts flowing from AI IDEs through Boss routing, Zero-Trust vault decryption, collaborative specialist handoffs, and evolutionary student learning.
              </p>
            </div>

            {/* Scenario Selector */}
            <div className="flex flex-wrap gap-2">
              {WORKFLOW_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setSelectedScenarioId(sc.id);
                    setCurrentStepIndex(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 border ${
                    selectedScenarioId === sc.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_20px_rgba(0,255,65,0.2)]'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sc.color === 'emerald' ? '#00FF41' : sc.color === 'amber' ? '#f59e0b' : '#a855f7' }}></span>
                  <span>{sc.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Visualizer Main Container */}
          <div className="rounded-3xl border border-white/15 bg-[#050906] overflow-hidden shadow-[0_0_60px_rgba(0,255,65,0.08)]">
            
            {/* Top Stage Progress Nodes */}
            <div className="p-5 sm:p-6 bg-black/60 border-b border-white/10">
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                {currentScenario.stages.map((stage, idx) => {
                  const isActive = idx === currentStepIndex;
                  const isCompleted = idx < currentStepIndex;
                  return (
                    <button
                      key={stage.step}
                      onClick={() => {
                        setCurrentStepIndex(idx);
                        setIsPlaying(false);
                      }}
                      className="flex-1 min-w-[130px] text-left group transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(0,255,65,0.6)] scale-110'
                              : isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-white/5 text-slate-500 border border-white/5 group-hover:border-white/20 group-hover:text-slate-300'
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4" /> : stage.step}
                        </div>
                        <div className={`h-1 flex-1 rounded-full transition-all ${
                          isCompleted ? 'bg-emerald-500/50' : isActive ? 'bg-emerald-500' : 'bg-white/10'
                        }`} />
                      </div>
                      <div className={`text-[11px] font-mono font-semibold truncate transition-colors ${
                        isActive ? 'text-emerald-300' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        {stage.title}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 truncate">
                        {stage.badge}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Central Animated Arena */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column: Active Stage Details & Agent Role Card */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span 
                      className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border"
                      style={{ 
                        backgroundColor: `${activeStage.color}15`, 
                        color: activeStage.color, 
                        borderColor: `${activeStage.color}40` 
                      }}
                    >
                      STAGE {activeStage.step} OF {currentScenario.stages.length} · {activeStage.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
                      Live Sensory Computing
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
                    {activeStage.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {activeStage.action}
                  </p>

                  {/* Active Actors Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                      <div className="text-[10px] font-mono text-slate-500 mb-1">ACTIVE SQUAD / AGENT</div>
                      <div className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-2 truncate">
                        <Cpu className="w-4 h-4 shrink-0" />
                        <span className="truncate">{activeStage.agent}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{activeStage.role}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                      <div className="text-[10px] font-mono text-slate-500 mb-1">DIRECTIVE PROTOCOL</div>
                      <div className="text-sm font-bold text-cyan-300 font-mono flex items-center gap-2 truncate">
                        <Key className="w-4 h-4 shrink-0" />
                        <span className="truncate">{activeStage.protocol}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Structured MCP Payload</div>
                    </div>
                  </div>
                </div>

                {/* Workflow Playback Controls */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentStepIndex((prev) => (prev === 0 ? currentScenario.stages.length - 1 : prev - 1));
                        setIsPlaying(false);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/10"
                      title="Previous Step"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                        isPlaying
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(0,255,65,0.4)]'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlaying ? 'Pause Simulator' : 'Auto Play'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentStepIndex((prev) => (prev + 1) % currentScenario.stages.length);
                        setIsPlaying(false);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/10"
                      title="Next Step"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setCurrentStepIndex(0);
                        setIsPlaying(true);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10"
                      title="Reset Workflow"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Playback Speed Switcher */}
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                    {[1, 2, 4].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaySpeed(spd)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
                          playSpeed === spd
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Monospace Matrix Telemetry Console */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="rounded-2xl border border-white/15 bg-black/90 p-4 sm:p-5 flex-1 flex flex-col justify-between font-mono shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Terminal Header */}
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        <span className="text-[11px] text-slate-400 ml-2">loragent_telemetry.log</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        RECORDING
                      </span>
                    </div>

                    {/* Console Telemetry Logs */}
                    <div className="space-y-3 text-xs">
                      <div className="text-slate-500 text-[11px]">
                        // ACTIVE EVENT EMISSION
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-emerald-300 leading-relaxed font-mono">
                        {activeStage.telemetry}
                      </div>

                      <div className="pt-2 text-[11px] space-y-1.5 text-slate-400">
                        <div className="flex justify-between">
                          <span className="text-slate-500">MCP Channel:</span>
                          <span className="text-cyan-300">loragent_steer</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Zero-Trust Vault:</span>
                          <span className="text-emerald-400">AES-256 ENCRYPTED</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Memory Graph:</span>
                          <span className="text-purple-300">.loragent-debug/orchestration-graph.json</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terminal Footer Prompt */}
                  <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                      <span>$</span>
                      <span className="animate-pulse">loragent --formation {currentScenario.id}</span>
                    </div>
                    <span>{activeStage.step}/{currentScenario.stages.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom DAG Flow Map */}
            <div className="p-4 sm:p-5 bg-[#020509] border-t border-white/10 flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                <span>DAG NODE FLOW:</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300">Developer</span>
                <span className="text-slate-600">➔</span>
                <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">loragent-teacher</span>
                <span className="text-slate-600">➔</span>
                <span className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">loragent-boss</span>
                <span className="text-slate-600">➔</span>
                <span className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300">Specialist Squad</span>
                <span className="text-slate-600">➔</span>
                <span className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">loragent-sqa</span>
                <span className="text-slate-600">➔</span>
                <span className="px-2 py-1 rounded bg-pink-500/10 border border-pink-500/30 text-pink-400">loragent-student</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2. 6 SQUAD FORMATIONS ─── */}
        <section id="formations" className="scroll-mt-24">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30 inline-block mb-2">
              HUB-AND-SPOKE TOPOLOGY
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight">6 Multi-Agent Squad Formations</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl mx-auto">
              Every task routed through <code>loragent-boss</code> dynamically synthesizes the optimal execution matrix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FORMATIONS.map((f) => {
              const Icon = f.icon;
              return (
                <div 
                  key={f.id} 
                  className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
                  style={{ borderTop: `3px solid ${f.color}` }}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10" style={{ color: f.color }}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">{f.name}</h3>
                          <span className="text-[10px] font-mono text-slate-400">Lead: @{f.lead}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10" style={{ color: f.color }}>
                        {f.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-5">
                      {f.description}
                    </p>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono text-slate-500 mb-2 uppercase font-bold">Squad Members:</div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {f.squad.map((member) => (
                        <span key={member} className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 border border-white/10 text-slate-300">
                          {member.replace('loragent-', '')}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] font-mono">
                      <span className="text-slate-500">Trigger:</span>
                      <code className="text-emerald-400 font-bold">{f.triggerCmd}</code>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 3. 224 AGENT CATALOG EXPLORER (KILO MARKETPLACE STANDARD) ─── */}
        <section id="catalog" className="scroll-mt-24">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 inline-block mb-2">
              REGISTRY & MARKETPLACE
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight">224 Agent Skills & MCP Server Catalog</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl mx-auto">
              Browse, filter, and inspect canonical Loragent skills with complete LLDP v2.0 metadata contracts.
            </p>
          </div>

          {/* Search & Workspace Relevance Filter Bar */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 mb-8 space-y-4">
            
            {/* Quick Stack Presets */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Layers size={13} className="text-emerald-400" />
                  <span>WORKSPACE RELEVANCE & STACK PRESETS:</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {filteredItems.length} matching resources
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {WORKSPACE_STACKS.map((st) => {
                  const Icon = st.icon;
                  const isActive = selectedStackFilter === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => {
                        setSelectedStackFilter(st.id);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all border ${
                        isActive 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(0,255,65,0.15)] font-bold' 
                          : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={12} />
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Input & Select Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-white/10">
              <div className="sm:col-span-6 relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search 224 agents by name, role, slug, or tags (e.g. backend, docker, student, rust)..."
                  className="w-full bg-[#020509] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#020509] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 font-mono"
                >
                  <option value="all">All Types ({ALL_CATALOG_ITEMS.length})</option>
                  <option value="agent">Agents & Skills ({totalAgents})</option>
                  <option value="mcp_server">MCP Servers ({totalMcp})</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedFormationFilter}
                  onChange={(e) => {
                    setSelectedFormationFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#020509] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 font-mono"
                >
                  <option value="all">All Formations</option>
                  <option value="auto">Auto Team</option>
                  <option value="office">Office</option>
                  <option value="chela">Chela</option>
                  <option value="freelance">Freelance</option>
                  <option value="observer">Observer & Student</option>
                  <option value="orchestrator">Orchestrator</option>
                </select>
              </div>
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {displayedItems.map((item) => (
              <div
                key={item.id || item.slug}
                onClick={() => setModalItem(item)}
                className="glass-card p-5 rounded-2xl border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(0,255,65,0.15)] transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex justify-between items-start mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {item.type || 'AGENT'}
                      </span>
                      {item.slug && item.slug.includes('student') && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30 animate-pulse">
                          LEARNING
                        </span>
                      )}
                      {item.slug && item.slug.includes('boss') && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          LEAD
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-medium">
                      {item.formation || 'auto'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors mb-1.5 font-mono flex items-center justify-between">
                    <span className="truncate">{item.name}</span>
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div>
                  {item.allowedTools && item.allowedTools.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.allowedTools.slice(0, 3).map((t) => (
                        <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                          {t}
                        </span>
                      ))}
                      {item.allowedTools.length > 3 && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-500">
                          +{item.allowedTools.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] font-mono">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyCode(`/loragent:${item.slug}`, `card-${item.slug}`);
                      }}
                      className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 border ${
                        copied === `card-${item.slug}`
                          ? 'bg-emerald-500 text-black border-emerald-500 font-bold'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                      }`}
                    >
                      {copied === `card-${item.slug}` ? <Check size={11} /> : <Copy size={11} />}
                      <span>{copied === `card-${item.slug}` ? 'Copied' : `/${item.slug}`}</span>
                    </button>

                    <span className="text-emerald-400 group-hover:underline flex items-center gap-1">
                      <span>Install</span>
                      <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
              >
                Previous
              </button>
              <span className="text-xs font-mono text-slate-400 px-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
              >
                Next
              </button>
            </div>
          )}
        </section>

        {/* ─── 4. TERMINAL SIMULATOR ─── */}
        <section id="terminal" className="scroll-mt-24">
          <div className="rounded-3xl border border-white/15 bg-black/90 p-6 sm:p-8 font-mono shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-emerald-400" />
                <span className="text-sm font-bold text-white">Loragent CLI & Dynamic Learning Terminal</span>
              </div>
              <span className="text-xs text-slate-500">Universal Directives</span>
            </div>

            {/* Quick Command Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { cmd: 'loragent discover -f react', label: 'PC Asset Discovery' },
                { cmd: 'loragent analyze .', label: 'Stack Detection' },
                { cmd: 'loragent sync', label: 'Universal 8-IDE Sync' },
                { cmd: '/loragent-student learn', label: 'Continuous Learning' }
              ].map((c) => (
                <button
                  key={c.cmd}
                  onClick={() => setSimCommand(c.cmd)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                    simCommand === c.cmd
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Terminal Input Row */}
            <div className="flex gap-2 mb-6">
              <div className="flex-1 bg-[#04070a] border border-white/15 rounded-xl px-4 py-2.5 flex items-center gap-2">
                <span className="text-emerald-400 font-bold">$</span>
                <input
                  type="text"
                  value={simCommand}
                  onChange={(e) => setSimCommand(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white focus:outline-none font-mono"
                />
              </div>
              <button
                disabled={simRunning}
                onClick={handleRunSim}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,65,0.3)] disabled:opacity-50"
              >
                {simRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>{simRunning ? 'Executing...' : 'Run Directive'}</span>
              </button>
            </div>

            {/* Terminal Output Screen */}
            <div className="bg-[#020408] border border-white/10 rounded-xl p-4 sm:p-5 text-xs text-slate-300 space-y-1.5 max-h-72 overflow-y-auto font-mono">
              {simLogs.map((log, idx) => (
                <div key={idx} className={log.startsWith('>') ? 'text-emerald-400 font-bold' : log.includes('✅') ? 'text-cyan-300' : 'text-slate-300'}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 5. MULTI-IDE SETUP HUB ─── */}
        <section id="ide" className="scroll-mt-24">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30 inline-block mb-2">
              IDE & AGENT INTEGRATION
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight">Multi-IDE 1-Click Configuration</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl mx-auto">
              Seamlessly bind Loragent to Cursor, Claude Code, Google Antigravity, Windsurf, or Zed.
            </p>
          </div>

          <div className="glass-card rounded-2xl border border-white/10 p-6">
            {/* IDE Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto">
              {Object.entries(IDE_CONFIGS).map(([key, ide]) => (
                <button
                  key={key}
                  onClick={() => setActiveMcpTab(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    activeMcpTab === key
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {ide.name}
                </button>
              ))}
            </div>

            {/* Active IDE Detail */}
            {(() => {
              const curIde = IDE_CONFIGS[activeMcpTab] || IDE_CONFIGS.cursor;
              return (
                <div className="space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <div className="text-sm font-bold text-white font-mono">{curIde.name} Configuration</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">Target file: <code>{curIde.file}</code></div>
                    </div>
                    <button
                      onClick={() => copyCode(curIde.snippet, `ide-${activeMcpTab}`)}
                      className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 hover:bg-purple-500/30 transition-all"
                    >
                      {copied === `ide-${activeMcpTab}` ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copied === `ide-${activeMcpTab}` ? 'Copied Config' : 'Copy JSON'}</span>
                    </button>
                  </div>

                  <pre className="bg-[#020509] border border-white/10 rounded-xl p-4 text-xs font-mono text-cyan-300 overflow-x-auto">
                    {curIde.snippet}
                  </pre>
                  <p className="text-xs text-slate-400">{curIde.description}</p>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ─── 6. ZERO-TRUST TITI VAULT SHOWCASE ─── */}
        <section id="vault" className="scroll-mt-24">
          <div className="glass-card rounded-3xl border border-amber-500/20 p-6 sm:p-8 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
              <Lock className="w-4 h-4" />
              <span>ZERO-TRUST MACHINE ENCLAVE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              TiTi Code Protector & AES-256 Vault Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed mb-6">
              Loragent prevents source code theft and secret leaks using 5-Seal Machine LLE encryption. Plaintext secrets are NEVER written to Git or disk. Child processes receive credentials dynamically in memory.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <div className="text-amber-400 font-bold mb-1">1. Git Pre-Push Hook</div>
                <div className="text-slate-400 text-[11px]">Automatically minifies and encrypts all source payloads into .titi.enc before hitting remote origin.</div>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <div className="text-cyan-400 font-bold mb-1">2. In-Memory Keyring</div>
                <div className="text-slate-400 text-[11px]">Passphrase hashes are stored in secure process memory with SHA-256 validation.</div>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <div className="text-emerald-400 font-bold mb-1">3. Workspace Guard</div>
                <div className="text-slate-400 text-[11px]">Blocks destructive bash commands (rm -rf, DROP TABLE) without operator confirmation.</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── 7. KILO-STYLE INTERACTIVE INSTALL MODAL ─── */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a0f16] border border-white/15 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex justify-between items-start bg-black/40">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                    {modalItem.type || 'AGENT'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Formation: <strong className="text-white">{modalItem.formation || 'auto'}</strong>
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white font-mono">{modalItem.name}</h3>
              </div>
              <button
                onClick={() => setModalItem(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <p className="text-sm text-slate-300 leading-relaxed">
                {modalItem.description}
              </p>

              {/* Dual Scope Selector */}
              <div>
                <div className="text-xs font-mono text-slate-400 mb-2 uppercase font-bold">Installation Scope:</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setInstallScope('project')}
                    className={`p-3 rounded-xl border text-left transition-all font-mono ${
                      installScope === 'project'
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">📁 Project Scope</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">.agents/skills/</div>
                  </button>

                  <button
                    onClick={() => setInstallScope('global')}
                    className={`p-3 rounded-xl border text-left transition-all font-mono ${
                      installScope === 'global'
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">🌐 Global Scope</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">~/.gemini/ / ~/.cursor/</div>
                  </button>
                </div>
              </div>

              {/* Live Destination Path Preview */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                <div className="text-slate-500 text-[10px] mb-1">DESTINATION PATH:</div>
                <div className="text-cyan-300">
                  {installScope === 'project'
                    ? `.agents/skills/${modalItem.slug}/SKILL.md`
                    : `~/.loragent/skills/${modalItem.slug}/SKILL.md`}
                </div>
              </div>

              {/* Slash Command & CLI Box */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400 uppercase font-bold">Invocation Directive:</div>
                <div className="bg-[#03060a] border border-white/15 rounded-xl p-3 flex justify-between items-center">
                  <code className="font-mono text-sm text-emerald-400">/loragent:{modalItem.slug}</code>
                  <button
                    onClick={() => handleModalCopy(`/loragent:${modalItem.slug}`)}
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center gap-1"
                  >
                    {modalCopied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{modalCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end gap-2">
              <button
                onClick={() => setModalItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-white/5"
              >
                Close
              </button>
              <button
                onClick={() => handleModalCopy(`npx -y @lorapok/loragent@latest install ${modalItem.slug} ${installScope === 'global' ? '--global' : ''}`)}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-black bg-emerald-400 hover:bg-emerald-300 flex items-center gap-1.5"
              >
                {modalCopied ? <Check size={14} /> : <DownloadCloud size={14} />}
                <span>{modalCopied ? 'Copied Install Command' : 'Copy 1-Click Install'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 8. BOTTOM OPERATOR STATUS BAR & MISSION CONTROL DRAWER ─── */}
      <div className="sticky bottom-0 z-40 border-t border-white/10 bg-[#030712]/95 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-400 hidden sm:inline">Loragent Universal Mesh:</span>
            <span className="text-emerald-400 font-bold">250 RESOURCES ONLINE</span>
          </div>

          <button
            onClick={() => setIsMissionControlOpen(!isMissionControlOpen)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] transition-all"
          >
            <Shield size={13} className="text-cyan-400" />
            <span>Operator Mission Control</span>
            <ChevronRight size={13} className={`transition-transform ${isMissionControlOpen ? '-rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mission Control Bottom Drawer */}
      {isMissionControlOpen && (
        <div className="fixed inset-x-0 bottom-10 z-40 bg-[#080d14] border-t border-white/15 p-6 shadow-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono">Mission Control Enclave</h3>
              </div>
              <button
                onClick={() => setIsMissionControlOpen(false)}
                className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {!isAdminAuthenticated ? (
              <form onSubmit={handleAdminAuth} className="max-w-md mx-auto py-8 text-center space-y-4 font-mono">
                <Lock size={32} className="mx-auto text-amber-400 mb-2" />
                <h4 className="text-base font-bold text-white">Operator Clearance Required</h4>
                <p className="text-xs text-slate-400">Enter your Machine PIN to unlock secret variables and deployment triggers.</p>
                <div className="flex gap-2 justify-center">
                  <input
                    type="password"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="Enter Clearance PIN..."
                    className="bg-black border border-white/20 rounded-xl px-4 py-2 text-sm text-center text-white focus:outline-none focus:border-cyan-400 font-mono w-48"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs"
                  >
                    Unlock
                  </button>
                </div>
                {adminPinError && (
                  <div className="text-xs text-red-400">Invalid clearance PIN hash.</div>
                )}
              </form>
            ) : (
              <div className="space-y-6 font-mono text-xs">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                  <span>✅ Clearance Verified: Operator Mode Active</span>
                  <button
                    onClick={() => setIsAdminAuthenticated(false)}
                    className="px-3 py-1 rounded bg-white/10 text-xs text-slate-300 hover:text-white"
                  >
                    Lock Enclave
                  </button>
                </div>

                {/* 8-Stage CI/CD Deployment Graph */}
                <div>
                  <div className="text-xs text-slate-400 uppercase font-bold mb-3">8-Stage Master CI/CD Pipeline:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { step: 1, title: 'Security Guard', desc: 'AST Secret Scanner', status: 'PASS' },
                      { step: 2, title: 'Test Harness', desc: '44 Node + Go Suites', status: 'PASS' },
                      { step: 3, title: 'Web Platform', desc: 'Vite + Next.js SSR', status: 'PASS' },
                      { step: 4, title: 'Python PyPI', desc: 'pip install loragent', status: 'PASS' },
                      { step: 5, title: 'Go Module', desc: 'pkg.go.dev/v2', status: 'PASS' },
                      { step: 6, title: 'NPM / NPX', desc: '@lorapok/loragent', status: 'PASS' },
                      { step: 7, title: 'IDE Extensions', desc: 'VS Code & Open VSX', status: 'PASS' },
                      { step: 8, title: 'Edge MCP', desc: 'Cloudflare Worker', status: 'PASS' }
                    ].map((st) => (
                      <div key={st.step} className="p-3 rounded-xl bg-black/50 border border-white/10">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-emerald-400 font-bold">Stage {st.step}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            {st.status}
                          </span>
                        </div>
                        <div className="font-bold text-white">{st.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{st.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
