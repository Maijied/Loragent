'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Terminal, Shield, Cpu, Cloud, Globe, Lock, Play, CheckCircle2, 
  Copy, Check, Sparkles, Layers, Search, Server, RefreshCw, Zap,
  ChevronRight, ExternalLink, Code2, Database, Workflow, Radio,
  Activity, Eye, Box, AlertCircle, ArrowUpRight, GitBranch, Key,
  FileCode, Laptop, Compass, BookOpen, UserCheck, ShieldAlert,
  ShoppingBag, Sliders, CheckSquare, Square, DownloadCloud, Info,
  CheckCircle, ArrowRight, X, Filter, Share2, CornerDownRight
} from 'lucide-react';

// Categories matching Open Agent Skills & Kilo Marketplace
const MARKET_CATEGORIES = [
  { id: 'all', label: 'All Categories', count: 250, icon: '⚡' },
  { id: 'ENGINEERING', label: 'Development', count: 62, icon: '💻' },
  { id: 'DATA', label: 'Data & Databases', count: 24, icon: '🗄️' },
  { id: 'CREATIVE', label: 'Creative & Media', count: 23, icon: '🎨' },
  { id: 'DEVOPS', label: 'DevOps & Cloud', count: 38, icon: '🚀' },
  { id: 'SECURITY', label: 'Security & QA', count: 27, icon: '🛡️' },
  { id: 'BUSINESS', label: 'Business & Operations', count: 21, icon: '📊' },
  { id: 'ORCHESTRATION', label: 'Orchestration & Hub', count: 12, icon: '👑' },
  { id: 'TOOLS', label: 'Tooling & Resolvers', count: 20, icon: '🔧' },
  { id: 'RESEARCH', label: 'Science & Research', count: 15, icon: '🔬' },
  { id: 'COMMUNICATION', label: 'Alerts & Messages', count: 8, icon: '💬' }
];

const RESOURCE_TYPES = [
  { id: 'all', label: 'All Resources', count: 250 },
  { id: 'AGENT', label: 'Agents', count: 224 },
  { id: 'MCP SERVER', label: 'MCP Servers', count: 20 },
  { id: 'SKILL', label: 'Open Skills', count: 224 },
  { id: 'FORMATION', label: 'Formations', count: 6 }
];

const FORMATIONS = [
  {
    id: 'orchestrator',
    name: 'Boss Orchestrator Squad',
    badge: 'Supreme Router',
    color: 'emerald',
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
    color: 'cyan',
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
    color: 'purple',
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
    color: 'amber',
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
    color: 'blue',
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
    badge: 'Crash Recovery',
    color: 'rose',
    icon: Eye,
    lead: 'loragent-watchman',
    description: 'Continuous execution telemetry and memory preservation. Maintains orchestration graphs at .loragent-debug/orchestration-graph.json and facilitates seamless token crash recovery via /loragent-watchman continue.',
    squad: ['loragent-watchman', 'loragent-workspace-guard', 'loragent-cache-collector', 'loragent-gold-collector', 'loragent-skill-creator'],
    tools: ['loragent_watchman_save', 'loragent_get_state', 'filesystem_read', 'firebase_admin'],
    triggerCmd: '/loragent-watchman continue'
  }
];

const MARKETPLACE_ITEMS = [
  {
    id: 'firebase-admin',
    slug: 'firebase-admin',
    name: 'Firebase Admin & Firestore MCP',
    type: 'MCP SERVER',
    category: 'DATA',
    version: '2.0.0',
    description: 'An MCP server giving AI agents direct capabilities to manage Firestore databases, Auth rules, Cloud Functions, and storage buckets.',
    prereqs: ['Node.js >= 18', 'Firebase CLI'],
    methods: ['NPX', 'STDIO'],
    destinationProject: '.loragent/loragent.json',
    destinationGlobal: '~/.loragent/config.json',
    installCmd: 'npx -y @lorapok/loragent@latest add-mcp firebase-admin',
    relevantFiles: ['firebase.json', '.firebaserc', 'firestore.rules'],
    badge: 'MCP SERVER'
  },
  {
    id: 'loragent-boss',
    slug: 'loragent-boss',
    name: 'Boss Orchestrator Agent',
    type: 'AGENT',
    category: 'ORCHESTRATION',
    version: '2.0.0',
    description: 'Central intelligent routing hub of the 224-agent ecosystem. Normalizes prompts, selects 6 squad formations, and manages steer payloads.',
    prereqs: ['Loragent Core runtime'],
    methods: ['DIRECT_INJECT', 'NPX'],
    destinationProject: '.agents/skills/loragent-boss/SKILL.md',
    destinationGlobal: '~/.loragent/skills/loragent-boss/SKILL.md',
    installCmd: 'npx -y @lorapok/loragent@latest install loragent-boss',
    relevantFiles: ['AGENTS.md', 'CLAUDE.md'],
    badge: 'AGENT'
  },
  {
    id: 'cloudflare-wrangler',
    slug: 'cloudflare-wrangler',
    name: 'Cloudflare Wrangler Specialist',
    type: 'SKILL',
    category: 'DEVOPS',
    version: '2.0.0',
    description: 'Cloudflare edge deployment skill. Automates Workers, Pages, KV, D1 SQL, R2 object store, Vectorize, and Zero-Trust secrets.',
    prereqs: ['Wrangler CLI', 'Node.js >= 18'],
    methods: ['NPX', 'GIT_SUBMODULE'],
    destinationProject: '.agents/skills/loragent-wrangler-specialist/SKILL.md',
    destinationGlobal: '~/.loragent/skills/loragent-wrangler-specialist/SKILL.md',
    installCmd: 'npx -y @lorapok/loragent@latest install loragent-wrangler-specialist',
    relevantFiles: ['wrangler.jsonc', 'wrangler.toml'],
    badge: 'SKILL'
  },
  {
    id: 'image-generate-fal',
    slug: 'image-generate-fal',
    name: 'Fal.ai & Replicate Image Generator',
    type: 'MCP SERVER',
    category: 'CREATIVE',
    version: '2.0.0',
    description: 'Ultra-fast production AI image generation MCP server with Flux Pro, Recraft V3, SDXL, and automated vault credential injection.',
    prereqs: ['Fal.ai API Key / Replicate Token'],
    methods: ['NPX', 'STDIO'],
    destinationProject: '.cursor/mcp.json',
    destinationGlobal: '~/.claude/mcp.json',
    installCmd: 'npx -y @lorapok/loragent@latest add-mcp image-generate-fal',
    relevantFiles: ['assets/', 'public/images/'],
    badge: 'MCP SERVER'
  },
  {
    id: 'auto-team-preset',
    slug: 'auto-team',
    name: 'Auto-Team Engineering Matrix',
    type: 'FORMATION',
    category: 'ENGINEERING',
    version: '2.0.0',
    description: 'Complete full-stack squad preset linking Tech Director, Backend SE, Frontend SE, Senior QA, and CI/CD Specialist.',
    prereqs: ['Loragent Hub'],
    methods: ['DIRECT_INJECT'],
    destinationProject: '.loragent/formations/auto-team.json',
    destinationGlobal: '~/.loragent/formations/auto-team.json',
    installCmd: 'npx -y @lorapok/loragent@latest formation auto-team',
    relevantFiles: ['package.json', 'src/', 'tests/'],
    badge: 'FORMATION'
  },
  {
    id: 'loragent-sqa',
    slug: 'loragent-sqa',
    name: 'Senior SQA & Security Auditor',
    type: 'AGENT',
    category: 'SECURITY',
    version: '2.0.0',
    description: 'Senior Software Quality Assurance. Executes unit suites, performs type checking, security audits, and lifecycle pre-commit gates.',
    prereqs: ['Node.js / Python test runner'],
    methods: ['DIRECT_INJECT', 'NPX'],
    destinationProject: '.agents/skills/loragent-sqa/SKILL.md',
    destinationGlobal: '~/.loragent/skills/loragent-sqa/SKILL.md',
    installCmd: 'npx -y @lorapok/loragent@latest install loragent-sqa',
    relevantFiles: ['tests/', 'package.json', 'pytest.ini'],
    badge: 'AGENT'
  },
  {
    id: 'browser-automation',
    slug: 'browser-automation',
    name: 'Headless Browser & DOM Inspector MCP',
    type: 'MCP SERVER',
    category: 'TOOLS',
    version: '2.0.0',
    description: 'Automates Chrome / Chromium for visual verification, automated UI end-to-end testing, and DOM screenshot recording.',
    prereqs: ['Node.js >= 18', 'Chromium / Puppeteer'],
    methods: ['NPX', 'STDIO'],
    destinationProject: '.mcp.json',
    destinationGlobal: '~/.claude/mcp.json',
    installCmd: 'npx -y @lorapok/loragent@latest add-mcp browser-automation',
    relevantFiles: ['e2e/', 'playwright.config.ts'],
    badge: 'MCP SERVER'
  },
  {
    id: 'loragent-watchman',
    slug: 'loragent-watchman',
    name: 'Watchman State Sentinel & Recovery',
    type: 'AGENT',
    category: 'ORCHESTRATION',
    version: '2.0.0',
    description: 'Session state guardian. Auto-saves state checkpoints and recovers crashed or token-exhausted sessions seamlessly.',
    prereqs: ['Loragent Core'],
    methods: ['DIRECT_INJECT'],
    destinationProject: '.agents/skills/loragent-watchman/SKILL.md',
    destinationGlobal: '~/.loragent/skills/loragent-watchman/SKILL.md',
    installCmd: 'npx -y @lorapok/loragent@latest install loragent-watchman',
    relevantFiles: ['.loragent-debug/'],
    badge: 'AGENT'
  },
  {
    id: 'chela-debugger-preset',
    slug: 'chela',
    name: 'Chela Bug Hunter Squad Preset',
    type: 'FORMATION',
    category: 'SECURITY',
    version: '2.0.0',
    description: 'Squad preset linking Bug Hunter, Shift Engineer, Git Specialist, and SQA for instant root-cause analysis.',
    prereqs: ['Git', 'Loragent Hub'],
    methods: ['DIRECT_INJECT'],
    destinationProject: '.loragent/formations/chela.json',
    destinationGlobal: '~/.loragent/formations/chela.json',
    installCmd: 'npx -y @lorapok/loragent@latest formation chela',
    relevantFiles: ['.git/', 'tests/'],
    badge: 'FORMATION'
  },
  {
    id: 'deploy-docker',
    slug: 'deploy-docker',
    name: 'Docker & Container CI Lead MCP',
    type: 'MCP SERVER',
    category: 'DEVOPS',
    version: '2.0.0',
    description: 'Builds, tags, and pushes multi-architecture Docker container images to registries with zero plaintext credentials.',
    prereqs: ['Docker Engine / CLI'],
    methods: ['NPX', 'STDIO'],
    destinationProject: '.mcp.json',
    destinationGlobal: '~/.claude/mcp.json',
    installCmd: 'npx -y @lorapok/loragent@latest add-mcp deploy-docker',
    relevantFiles: ['Dockerfile', 'docker-compose.yml'],
    badge: 'MCP SERVER'
  },
  {
    id: 'loragent-gif-create',
    slug: 'loragent-gif-create',
    name: 'FFmpeg Animated GIF & Video Producer',
    type: 'SKILL',
    category: 'CREATIVE',
    version: '2.0.0',
    description: 'High-performance video to animated GIF converter with palettegen optimization, Slack constraints, and micro-animations.',
    prereqs: ['FFmpeg', 'Gifsicle'],
    methods: ['NPX', 'GIT_SUBMODULE'],
    destinationProject: '.agents/skills/loragent-gif-create/SKILL.md',
    destinationGlobal: '~/.loragent/skills/loragent-gif-create/SKILL.md',
    installCmd: 'npx -y @lorapok/loragent@latest install loragent-gif-create',
    relevantFiles: ['public/', 'assets/'],
    badge: 'SKILL'
  },
  {
    id: 'database-postgres',
    slug: 'database-postgres',
    name: 'PostgreSQL & Drizzle Schema MCP',
    type: 'MCP SERVER',
    category: 'DATA',
    version: '2.0.0',
    description: 'Connects AI agents directly to Postgres databases for schema inspection, query execution, indexing, and migration planning.',
    prereqs: ['PostgreSQL connection URL'],
    methods: ['NPX', 'STDIO'],
    destinationProject: '.mcp.json',
    destinationGlobal: '~/.claude/mcp.json',
    installCmd: 'npx -y @lorapok/loragent@latest add-mcp database-postgres',
    relevantFiles: ['drizzle.config.ts', 'prisma/schema.prisma', 'schema.sql'],
    badge: 'MCP SERVER'
  }
];

const IDE_CONFIGS: Record<string, { name: string; file: string; snippet: string; description: string }> = {
  cursor: {
    name: 'Cursor IDE',
    file: '.cursor/mcp.json',
    snippet: `{\n  "mcpServers": {\n    "loragent-core": {\n      "command": "node",\n      "args": ["/absolute/path/to/loragent/port/mcp/server.js"],\n      "env": { "LORAGENT_VAULT_ENCRYPTED_PIN": "\${LORAGENT_VAULT_ENCRYPTED_PIN}" }\n    },\n    "cloudflare": {\n      "url": "https://mcp.cloudflare.com/sse"\n    }\n  }\n}`,
    description: 'Cursor full compatibility with .cursor/rules/*.mdc and official Cloudflare Remote MCP.'
  },
  antigravity: {
    name: 'Antigravity IDE',
    file: '~/.gemini/config/mcp_config.json',
    snippet: `{\n  "mcpServers": {\n    "loragent-core": {\n      "command": "node",\n      "args": ["/absolute/path/to/loragent/port/mcp/server.js"]\n    }\n  }\n}`,
    description: 'Native Antigravity pairing with auto-discovered skills, subagents, and memory layer.'
  },
  claude: {
    name: 'Claude Code',
    file: 'CLAUDE.md + ~/.claude/mcp.json',
    snippet: `{\n  "mcpServers": {\n    "loragent-core": {\n      "command": "npx",\n      "args": ["-y", "@lorapok/loragent", "mcp-server"]\n    }\n  }\n}`,
    description: 'Claude Code 3-Layer persistent memory and auto memory note pipeline integration.'
  },
  windsurf: {
    name: 'Windsurf Cascade',
    file: '.windsurfrules + ~/.codeium/windsurf/mcp_config.json',
    snippet: `{\n  "mcpServers": {\n    "loragent-core": {\n      "command": "node",\n      "args": ["/absolute/path/to/loragent/port/mcp/server.js"]\n    }\n  }\n}`,
    description: 'Windsurf rules synchronization with real-time MCP steering and state recovery.'
  },
  roo: {
    name: 'Roo Code & Cline',
    file: '.roomodes & .clinerules',
    snippet: `{\n  "customModes": [\n    {\n      "slug": "loragent-boss",\n      "name": "🤖 Loragent Boss — Orchestrator",\n      "roleDefinition": "You are loragent-boss, central hub...",\n      "groups": ["read", "edit", "browser", "command", "mcp"]\n    }\n  ]\n}`,
    description: 'Custom mode definitions for Roo Code & Cline with automated tool permissions.'
  },
  zed: {
    name: 'Zed Editor',
    file: '~/.config/zed/settings.json',
    snippet: `{\n  "assistant": {\n    "version": "2",\n    "mcp_servers": {\n      "loragent": {\n        "command": "node",\n        "args": ["/absolute/path/to/loragent/port/mcp/server.js"]\n      }\n    }\n  }\n}`,
    description: 'Zed Assistant integration with ultra-fast Rust-level response and MCP capabilities.'
  }
};

const TERMINAL_COMMANDS = [
  { cmd: '/loragent:boss auto', desc: 'Auto Team Full-Stack Engineering Squad' },
  { cmd: '/loragent:boss chela', desc: 'Chela Mission-Critical Bug Hunting' },
  { cmd: '/loragent-watchman continue', desc: 'Resume Session from Ephemeral Cache' },
  { cmd: '/loragent:image-generate', desc: 'Fal.ai / Replicate Ultra-Fast Art' },
  { cmd: '/loragent:tools-install', desc: 'Auto-Detect & Install Missing Binaries' },
  { cmd: '/loragent autopilot [task]', desc: 'Iterative Loop with Check-Done Hook' }
];

export default function Home() {
  const [activeFormation, setActiveFormation] = useState('orchestrator');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [relevantOnly, setRelevantOnly] = useState(false);
  const [selectedIDE, setSelectedIDE] = useState('cursor');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Interactive Modal State (Matching Kilo Marketplace Screenshot)
  const [installModalItem, setInstallModalItem] = useState<any | null>(null);
  const [installScope, setInstallScope] = useState<'project' | 'global'>('project');
  const [installMethod, setInstallMethod] = useState('NPX');
  const [modalCopied, setModalCopied] = useState(false);

  // Terminal Simulator State
  const [activeTab, setActiveTab] = useState<'terminal' | 'marketplace' | 'formations' | 'vault' | 'ide'>('marketplace');
  const [simCommand, setSimCommand] = useState('/loragent:boss auto');
  const [simRunning, setSimRunning] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([
    '⚡ Loragent Core Sentinel initialized [v2.0.0-PROPOSAL]',
    '🔒 Zero-Trust Vault: Connected via Machine AES-256 (PIN Protected)',
    '🌐 Cloudflare Edge Registry: 250 Items Synchronized',
    'Ready for directive. Select a command or click "Run Directive" below.'
  ]);

  // PIN Demo State
  const [enteredPin, setEnteredPin] = useState('');
  const [pinStatus, setPinStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleModalCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setModalCopied(true);
    setTimeout(() => setModalCopied(false), 2000);
  };

  const handleRunSim = () => {
    setSimRunning(true);
    setSimLogs((prev) => [...prev, `\n> ${simCommand}`, '⏳ Routing through loragent-boss...']);

    setTimeout(() => {
      if (simCommand.includes('auto')) {
        setSimLogs((prev) => [
          ...prev,
          '🤖 [Boss] Forming Auto Team Matrix: Tech Director, Backend SE, Frontend SE, SQA, CI/CD Specialist',
          '📐 [Tech Director] Synthesizing LLDP modular blueprint across FACE/PULSE/LORE/PORT/LOOM layers',
          '💻 [Backend SE] Implementing API routes with zero plaintext secrets',
          '🎨 [Frontend SE] Rendering sensory computing glassmorphic UI',
          '🛡️ [SQA] Executing 40/40 test suites — All Passed (0 errors)',
          '🚀 [CI/CD Specialist] Building SSG and dispatching deploy hook to GitHub Pages',
          '✅ [Check-Done] Task complete with 100% verification.'
        ]);
      } else if (simCommand.includes('continue') || simCommand.includes('watchman')) {
        setSimLogs((prev) => [
          ...prev,
          '👁️ [Watchman] Reading state from .loragent-debug/watchman-cache.json',
          '🔍 [Watchman] Checkpoint verified: Step 4/5 "Unit Testing & Build Gate"',
          '🔄 [Watchman] Restoring execution graph with 0 token loss',
          '🚀 Resuming workflow at exact failure point...'
        ]);
      } else {
        setSimLogs((prev) => [
          ...prev,
          `🤖 [Boss] Delegating to specialist for "${simCommand}"`,
          '🔧 Executing safe tool execution with workspace guardrails...',
          '✅ Execution complete. Result returned via loragent_steer.'
        ]);
      }
      setSimRunning(false);
    }, 1000);
  };

  const handleTestPin = () => {
    if (enteredPin === '1234' || enteredPin.length >= 4) {
      setPinStatus('success');
    } else {
      setPinStatus('error');
    }
  };

  const currentFormation = useMemo(() => {
    return FORMATIONS.find((f) => f.id === activeFormation) || FORMATIONS[0];
  }, [activeFormation]);

  const filteredMarketplace = useMemo(() => {
    return MARKETPLACE_ITEMS.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedType === 'all' || item.type === selectedType;
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchRelevant = !relevantOnly || (item.relevantFiles && item.relevantFiles.length > 0);

      return matchSearch && matchType && matchCategory && matchRelevant;
    });
  }, [searchQuery, selectedType, selectedCategory, relevantOnly]);

  return (
    <div className="min-h-screen bg-[#030704] text-neutral-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#00FF41_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04]" />
      </div>

      {/* Top Notification / KPI Strip */}
      <div className="relative z-10 border-b border-emerald-500/20 bg-black/60 backdrop-blur-md px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-emerald-400 font-medium">Loragent Ecosystem v2.0.0</span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-400">250 Catalog Resources (224 Agents/Skills, 20 MCP Servers, 6 Formations)</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="text-neutral-400">Cloudflare Edge: <span className="text-emerald-400">ONLINE</span></span>
            <span className="text-neutral-400">Zero-Trust Vault: <span className="text-cyan-400">ENCRYPTED</span></span>
            <Link href="https://github.com/Maijied/Loragent" target="_blank" className="text-neutral-400 hover:text-white flex items-center gap-1">
              GitHub <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white font-mono">LORAGENT</span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">v2.0</span>
              </div>
              <p className="text-[10px] font-mono text-neutral-400">Lorapok Labs Multi-Agent Intelligence</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
            {[
              { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, count: '250' },
              { id: 'formations', label: '6 Formations', icon: Layers, count: '6' },
              { id: 'terminal', label: 'Terminal Simulator', icon: Terminal },
              { id: 'vault', label: 'Zero-Trust Vault', icon: Lock },
              { id: 'ide', label: 'Multi-IDE Setup', icon: Laptop }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(0,255,65,0.15)]' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-white/10 text-neutral-300 rounded-full font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="#marketplace-hub"
              onClick={() => setActiveTab('marketplace')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-all shadow-[0_0_25px_rgba(0,255,65,0.4)]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Explore Marketplace</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal AI Agent, Skill & MCP Server Registry</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
            The Composable AI Agent <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Marketplace & Squad Matrix
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Install reusable <span className="text-neutral-200 font-semibold">224+ Agents</span>, <span className="text-neutral-200 font-semibold">Open Agent Skills</span>, and <span className="text-neutral-200 font-semibold">MCP Servers</span> for one project or globally across Cursor, Claude Code, Windsurf, Antigravity, and Zed.
          </p>

          {/* Action Buttons & Quick Copy */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 bg-black/80 border border-emerald-500/40 px-4 py-2.5 rounded-xl font-mono text-xs text-emerald-300 shadow-[0_0_20px_rgba(0,255,65,0.15)]">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>npx -y @lorapok/loragent@latest</span>
              <button
                onClick={() => handleCopy('npx -y @lorapok/loragent@latest', 'hero-npx')}
                className="ml-2 p-1 hover:bg-white/10 rounded transition-colors text-neutral-400 hover:text-white"
                title="Copy Command"
              >
                {copiedKey === 'hero-npx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              onClick={() => setActiveTab('marketplace')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-medium rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all"
            >
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Browse 250 Resources</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-white/10">
            {[
              { label: 'Catalog Resources', value: '250+', desc: 'Agents, Skills & MCPs' },
              { label: 'Specialist Agents', value: '224', desc: 'LLDP Standardized' },
              { label: 'Squad Formations', value: '6', desc: 'Auto, Chela, Office, etc.' },
              { label: 'IDE Platforms', value: '6+', desc: 'Cursor, Claude, Antigravity' }
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <div className="text-2xl font-bold font-mono text-white mb-1">{stat.value}</div>
                <div className="text-xs font-medium text-emerald-400 font-mono">{stat.label}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN DYNAMIC CONTENT TABS */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ─── 1. MARKETPLACE EXPLORER & HUB (Inspired by Kilo Marketplace) ─── */}
        <section id="marketplace-hub" className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <ShoppingBag className="w-4 h-4" />
                <span>LORAGENT MARKETPLACE REGISTRY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Install Reusable Agents, Skills & MCP Tools
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Configure tools for one project (`.loragent/loragent.json`) or globally across your development environment.
              </p>
            </div>

            {/* Scope / Help Links */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-neutral-500">Target Scopes:</span>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">Project (.loragent/)</span>
              <span className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded">Global (~/.loragent/)</span>
            </div>
          </div>

          {/* Search, Relevance Filter & Type Selectors */}
          <div className="bg-black/60 border border-white/10 rounded-2xl p-4 mb-6 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search 250 items (e.g. Firebase, Docker, Wrangler, Boss, Image)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* "Relevant to my workspace" smart toggle */}
              <button
                onClick={() => setRelevantOnly(!relevantOnly)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono border transition-all ${
                  relevantOnly 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {relevantOnly ? <CheckSquare className="w-4 h-4 text-cyan-400" /> : <Square className="w-4 h-4" />}
                <span>Relevant to my workspace</span>
              </button>

              {/* Type Dropdown / Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {RESOURCE_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap ${
                      selectedType === t.id
                        ? 'bg-emerald-500 text-black font-semibold shadow-[0_0_15px_rgba(0,255,65,0.3)]'
                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-white/5 text-xs font-mono">
              <span className="text-neutral-500 text-[11px] whitespace-nowrap pl-1">Category:</span>
              {MARKET_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === c.id
                      ? 'bg-white/20 text-white font-medium border border-white/30'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Marketplace Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMarketplace.map((item) => (
              <div
                key={item.id}
                className="group p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between hover:shadow-[0_0_25px_rgba(0,255,65,0.1)] relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider ${
                        item.type === 'MCP SERVER' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                        item.type === 'AGENT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        item.type === 'FORMATION' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500">{item.category}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">v{item.version}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-2 font-mono flex items-center justify-between">
                    <span>{item.name}</span>
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Prerequisites indicator */}
                  {item.prereqs && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {item.prereqs.map((p, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 bg-white/5 text-neutral-300 rounded border border-white/5">
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-500">Lorapok Labs</span>
                  <button
                    onClick={() => setInstallModalItem(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black transition-all"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>Install</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredMarketplace.length === 0 && (
            <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-2xl">
              <Search className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
              <div className="text-base font-mono text-white font-semibold">No marketplace items match your filter</div>
              <p className="text-xs text-neutral-400 mt-1">Try resetting the category filter or searching for a different keyword.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedType('all'); setSelectedCategory('all'); setRelevantOnly(false); }}
                className="mt-4 px-4 py-2 text-xs font-mono rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* ─── 2. 6 FORMATION SQUAD PRESETS SECTION ─── */}
        <section id="formations" className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <Layers className="w-4 h-4" />
                <span>ORCHESTRATION ARCHITECTURE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                6 Dynamic Squad Formation Presets
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Multi-agent operational matrices designed for end-to-end engineering, zero-guess debugging, and enterprise operations.
              </p>
            </div>
          </div>

          {/* Formations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FORMATIONS.map((form) => {
              const Icon = form.icon;
              return (
                <div
                  key={form.id}
                  className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-mono bg-white/5 text-neutral-300 rounded border border-white/10">
                          {form.badge}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-neutral-500">Lead: <span className="text-cyan-300 font-semibold">{form.lead}</span></span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 font-mono">{form.name}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-4">{form.description}</p>

                    <div className="mb-4">
                      <div className="text-[11px] font-mono text-neutral-500 mb-2">Active Squad:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {form.squad.map((ag) => (
                          <span key={ag} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/5">
                            {ag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400">{form.triggerCmd}</span>
                    <button
                      onClick={() => {
                        setSimCommand(form.triggerCmd);
                        setActiveTab('terminal');
                      }}
                      className="px-3 py-1 text-xs font-mono rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all flex items-center gap-1"
                    >
                      <span>Simulate</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 3. LIVE SENSORY TERMINAL SIMULATOR ─── */}
        <section id="terminal" className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <Terminal className="w-4 h-4" />
                <span>INTERACTIVE CLI PLATFORM</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Live Terminal Simulator
              </h2>
            </div>
            <div className="text-xs font-mono text-neutral-400">
              Test slash commands, orchestrator handoffs, and crash recovery.
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-[#050B06] overflow-hidden shadow-[0_0_40px_rgba(0,255,65,0.1)]">
            {/* Terminal Header */}
            <div className="px-4 py-3 bg-black/60 border-b border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/70 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/70 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/70 inline-block"></span>
                <span className="text-xs font-mono text-neutral-400 ml-2">loragent-terminal — bash — 80x24</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
                <Activity className="w-3 h-3 animate-pulse" />
                <span>ONLINE</span>
              </div>
            </div>

            {/* Quick Command Selector */}
            <div className="p-4 bg-black/40 border-b border-emerald-500/10 flex flex-wrap gap-2">
              {TERMINAL_COMMANDS.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setSimCommand(t.cmd)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    simCommand === t.cmd
                      ? 'bg-emerald-500 text-black font-semibold'
                      : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  {t.cmd}
                </button>
              ))}
            </div>

            {/* Terminal Screen Logs */}
            <div className="p-6 font-mono text-xs text-neutral-300 min-h-[220px] max-h-[300px] overflow-y-auto space-y-1.5 leading-relaxed">
              {simLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={
                    log.startsWith('>') ? 'text-emerald-400 font-bold' :
                    log.startsWith('🤖') ? 'text-cyan-300' :
                    log.startsWith('✅') ? 'text-emerald-300 font-semibold' :
                    log.startsWith('🛡️') ? 'text-amber-300' :
                    log.startsWith('🔒') ? 'text-purple-300' : 'text-neutral-400'
                  }
                >
                  {log}
                </div>
              ))}
            </div>

            {/* Terminal Input Bar */}
            <div className="p-4 bg-black/70 border-t border-emerald-500/20 flex items-center gap-3">
              <span className="text-emerald-400 font-mono text-sm">loragent&gt;</span>
              <input
                type="text"
                value={simCommand}
                onChange={(e) => setSimCommand(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunSim()}
                placeholder="Type command (/loragent:boss auto)..."
                className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder-neutral-600"
              />
              <button
                onClick={handleRunSim}
                disabled={simRunning}
                className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-emerald-500 text-black hover:bg-emerald-400 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {simRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>Run Directive</span>
              </button>
            </div>
          </div>
        </section>

        {/* ─── 4. ZERO-TRUST CREDENTIAL VAULT & PIN DEMO ─── */}
        <section id="vault" className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-2">
                <Lock className="w-4 h-4" />
                <span>ZERO-PLAINTEXT ENCRYPTED VAULT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
                No Plaintext Secrets. Ever.
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                All production credentials (Cloudflare API keys, GitHub tokens, Firebase secrets, AWS keys) are encrypted using <span className="text-neutral-200 font-semibold">AES-256 machine hash encryption</span>. Credentials are only decrypted into transient memory at child process invocation.
              </p>

              <div className="space-y-3 font-mono text-xs text-neutral-300">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Encrypted Machine Hash stored in `.env`</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Runtime `bin/cred` injection via PIN Passphrase</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Workspace Guard blocks destructive commands and leakage</span>
                </div>
              </div>
            </div>

            {/* Interactive PIN Vault Sandbox */}
            <div className="p-6 rounded-2xl bg-black/60 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-semibold text-purple-300">Machine Vault Simulator</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded">AES-256-CBC</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1.5">Enter Machine Passphrase / PIN:</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      maxLength={8}
                      placeholder="e.g. 1234"
                      value={enteredPin}
                      onChange={(e) => {
                        setEnteredPin(e.target.value);
                        setPinStatus('idle');
                      }}
                      className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500/50"
                    />
                    <button
                      onClick={handleTestPin}
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-mono font-medium transition-all"
                    >
                      Authenticate
                    </button>
                  </div>
                </div>

                {/* Status Box */}
                {pinStatus === 'success' && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>Vault Unlocked Successfully!</span>
                    </div>
                    <div className="text-[11px] text-neutral-300">
                      Cloudflare, GitHub, Firebase, and AWS credentials injected safely to memory.
                    </div>
                  </div>
                )}

                {pinStatus === 'error' && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Authentication failed. Passphrase invalid.</span>
                  </div>
                )}

                {/* Encrypted Hash Display */}
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] text-neutral-500 space-y-1">
                  <div>LORAGENT_VAULT_ENCRYPTED_PIN = "7fa490...18e"</div>
                  <div>LORAGENT_VAULT_IV = "3d901f...82c"</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. MULTI-IDE INTEGRATION MATRIX ─── */}
        <section id="ide-setup" className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
              <Laptop className="w-3.5 h-3.5" />
              <span>Agnostic IDE Compatibility</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              One Agent Matrix. Every AI IDE.
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              Loragent native configuration snippets ready to paste into Cursor, Claude Code, Windsurf, Antigravity, Roo Code, and Zed.
            </p>
          </div>

          {/* IDE Selector Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-6">
            {Object.entries(IDE_CONFIGS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedIDE(key)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                  selectedIDE === key
                    ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
                }`}
              >
                {config.name}
              </button>
            ))}
          </div>

          {/* IDE Snippet Card */}
          {IDE_CONFIGS[selectedIDE] && (
            <div className="max-w-3xl mx-auto rounded-2xl bg-black/60 border border-white/10 overflow-hidden">
              <div className="px-5 py-3.5 bg-black/80 border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-white font-semibold">{IDE_CONFIGS[selectedIDE].name}</span>
                  <span className="text-[11px] font-mono text-neutral-500 ml-2">({IDE_CONFIGS[selectedIDE].file})</span>
                </div>
                <button
                  onClick={() => handleCopy(IDE_CONFIGS[selectedIDE].snippet, 'ide-snip')}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-neutral-300 transition-all border border-white/10"
                >
                  {copiedKey === 'ide-snip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'ide-snip' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-5 font-mono text-xs text-neutral-300 bg-[#050806] overflow-x-auto">
                <pre>{IDE_CONFIGS[selectedIDE].snippet}</pre>
              </div>
              <div className="px-5 py-3 bg-black/40 border-t border-white/5 text-xs text-neutral-400 font-mono">
                💡 {IDE_CONFIGS[selectedIDE].description}
              </div>
            </div>
          )}
        </section>

      </main>

      {/* ─── INTERACTIVE INSTALL MODAL (Matching Kilo Marketplace Screenshot) ─── */}
      {installModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0a0f0d] border border-white/20 shadow-2xl p-6 overflow-hidden">
            {/* Header with Close */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <span>Install {installModalItem.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {installModalItem.type}
                  </span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {installModalItem.description}
                </p>
              </div>
              <button
                onClick={() => setInstallModalItem(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scope Selector: [ Project ] vs [ Global ] */}
            <div className="mb-4">
              <label className="block text-xs font-mono text-neutral-300 font-semibold mb-2">
                Where should this be available?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInstallScope('project')}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-medium transition-all text-center border ${
                    installScope === 'project'
                      ? 'bg-emerald-500 text-black font-semibold border-emerald-400 shadow-[0_0_15px_rgba(0,255,65,0.3)]'
                      : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                >
                  project
                </button>
                <button
                  type="button"
                  onClick={() => setInstallScope('global')}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-medium transition-all text-center border ${
                    installScope === 'global'
                      ? 'bg-purple-500 text-white font-semibold border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                >
                  global
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1.5 font-mono">
                {installScope === 'project'
                  ? 'Only this project. The installed files can be committed and shared with your team.'
                  : 'Available globally across all your workspaces and projects.'}
              </p>
            </div>

            {/* Installation Destination */}
            <div className="mb-4">
              <label className="block text-xs font-mono text-neutral-400 mb-1">
                Installation destination
              </label>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-neutral-200">
                {installScope === 'project' ? installModalItem.destinationProject : installModalItem.destinationGlobal}
              </div>
            </div>

            {/* Security Warning Box (As shown in screenshot) */}
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed font-mono">
              ⚠️ MCP servers can run local commands or connect to external services. Loragent Zero-Trust Vault will encrypt any injected credentials. Project files may be committed to version control. Do not store secrets here unless the configuration references an environment variable.
            </div>

            {/* Installation Method */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Installation Method</label>
                <select
                  value={installMethod}
                  onChange={(e) => setInstallMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none"
                >
                  <option value="NPX">NPX</option>
                  <option value="CLI">Loragent CLI</option>
                  <option value="GIT">Git Submodule</option>
                </select>
              </div>

              {/* Prerequisites */}
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Prerequisites</label>
                <div className="text-xs font-mono text-neutral-300 pt-1.5">
                  {installModalItem.prereqs ? installModalItem.prereqs.join(', ') : 'Node.js'}
                </div>
              </div>
            </div>

            {/* Copyable CLI command */}
            <div className="mb-6 p-3 rounded-xl bg-black/80 border border-emerald-500/30 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-emerald-400 truncate">
                {installModalItem.installCmd} {installScope === 'global' ? '--global' : ''}
              </span>
              <button
                onClick={() => handleModalCopy(`${installModalItem.installCmd} ${installScope === 'global' ? '--global' : ''}`)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Copy install command"
              >
                {modalCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setInstallModalItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleModalCopy(`${installModalItem.installCmd} ${installScope === 'global' ? '--global' : ''}`);
                  setTimeout(() => setInstallModalItem(null), 800);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-emerald-500 text-black hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(0,255,65,0.4)] flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{modalCopied ? 'Copied to Clipboard!' : 'Install Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/80 py-12 px-4 sm:px-6 lg:px-8 font-mono text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-white font-bold">LORAGENT ECOSYSTEM</div>
              <div className="text-[10px] text-neutral-500">Lorapok Labs Proprietary Architecture</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="https://loragent.lorapok.tech" className="hover:text-white transition-colors">loragent.lorapok.tech</Link>
            <Link href="https://github.com/Maijied/Loragent" target="_blank" className="hover:text-white transition-colors">GitHub</Link>
            <Link href="https://lorapok.tech" target="_blank" className="hover:text-white transition-colors">Lorapok Labs</Link>
          </div>

          <div className="text-neutral-500 text-[11px]">
            Copyright © {new Date().getFullYear()} Lorapok Labs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
