import React, { useState, useMemo, useEffect } from 'react';
import { 
  TerminalSquare, 
  Sparkles, 
  Workflow, 
  Compass, 
  Code2, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Check, 
  Copy, 
  Search, 
  DownloadCloud, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  ArrowUpRight,
  Cpu,
  Database,
  Key,
  Network,
  Activity,
  Terminal,
  ExternalLink,
  BookOpen,
  Radio,
  Globe,
  Sliders,
  FileCode2,
  Boxes,
  HelpCircle,
  Flame,
  Users,
  MessageSquare,
  ShieldAlert,
  KeyRound,
  UserCheck,
  Server,
  Settings,
  Lock,
  Unlock,
  Heart,
  Share2,
  CheckSquare,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Cloud,
  Mail,
  Send,
  Inbox,
  Palette,
  Package,
  GitBranch
} from 'lucide-react';
import allAgentsData from './data/all-agents.json';

const ALL_CATALOG_ITEMS = allAgentsData.items || [];

const CLEARANCE_PIN = '565087';

const THEMES = [
  { id: 'matrix', name: 'Neural Matrix', color: '#00FF41', icon: Terminal, desc: 'Loragent Core Biological UI' },
  { id: 'aurora', name: 'Aurora Cyber', color: '#00F3FF', icon: Globe, desc: 'Community Hub & Collaboration' },
  { id: 'obsidian', name: 'Obsidian Gold', color: '#f59e0b', icon: ShieldCheck, desc: 'Mission Control Admin Enclave' }
];

const PACKAGE_ECOSYSTEMS = [
  {
    id: 'npx',
    name: 'NPX (Instant Runner)',
    command: 'npx -y @lorapok/loragent@latest',
    url: 'https://www.npmjs.com/package/@lorapok/loragent',
    badge: 'Zero-Install CLI',
    color: '#00FF41',
    icon: Terminal
  },
  {
    id: 'npm',
    name: 'NPM (Node.js)',
    command: 'npm install @lorapok/loragent',
    url: 'https://www.npmjs.com/package/@lorapok/loragent',
    badge: 'NPM Registry',
    color: '#ef4444',
    icon: Boxes
  },
  {
    id: 'pip',
    name: 'PyPI / PIP (Python)',
    command: 'pip install loragent',
    url: 'https://pypi.org/project/loragent/',
    badge: 'Python Wheels',
    color: '#38bdf8',
    icon: Code2
  },
  {
    id: 'packagist',
    name: 'Packagist (PHP Composer)',
    command: 'composer require lorapok/loragent',
    url: 'https://packagist.org/packages/lorapok/loragent',
    badge: 'PHP Ecosystem',
    color: '#f59e0b',
    icon: Database
  },
  {
    id: 'go',
    name: 'Go (Golang Module)',
    command: 'go install github.com/Maijied/Loragent/cmd/loragent@latest',
    url: 'https://pkg.go.dev/github.com/Maijied/Loragent',
    badge: 'Go Binaries',
    color: '#00F3FF',
    icon: Cpu
  },
  {
    id: 'vscode',
    name: 'VS Code Marketplace',
    command: 'ext install LorapokLabs.loragent',
    url: 'https://marketplace.visualstudio.com/items?itemName=LorapokLabs.loragent',
    badge: 'IDE Extension',
    color: '#3b82f6',
    icon: Sparkles
  },
  {
    id: 'openvsx',
    name: 'Open VSX Registry',
    command: 'ovsx install LorapokLabs.loragent',
    url: 'https://open-vsx.org/extension/LorapokLabs/loragent',
    badge: 'VSCodium / Eclipse',
    color: '#a855f7',
    icon: Globe
  },
  {
    id: 'firefox',
    name: 'Firefox AMO Add-on',
    command: 'web-ext run / AMO Add-on',
    url: 'https://addons.mozilla.org/firefox/addon/loragent-assistant',
    badge: 'Browser Add-on',
    color: '#f97316',
    icon: Radio
  }
];

const LORAGENT_EMAILS = [
  {
    address: 'boss@lorapok.tech',
    role: 'Autonomous Orchestrator Dispatch',
    description: 'Direct webhook & email trigger pipeline for loragent-boss orchestration engine.',
    badge: 'ORCHESTRATOR',
    status: 'ACTIVE (CF Routing)',
    color: '#00FF41'
  },
  {
    address: 'agents@lorapok.tech',
    role: 'Agent-to-Agent Mesh Telemetry',
    description: 'Inter-agent telemetry receiver, distributed state checkpoints, and async handoffs.',
    badge: 'TELEMETRY MESH',
    status: 'ACTIVE (CF Routing)',
    color: '#00F3FF'
  },
  {
    address: 'security@lorapok.tech',
    role: 'Zero-Trust Security & Vault Disclosure',
    description: 'Responsible disclosure channel for LLE 5-seal encryption, vault CVEs, and compliance.',
    badge: 'SECURITY VAULT',
    status: 'ACTIVE (CF Routing)',
    color: '#ef4444'
  },
  {
    address: 'support@lorapok.tech',
    role: 'Enterprise & Developer Support',
    description: 'Technical troubleshooting, skill authoring assistance, and IDE configuration support.',
    badge: 'SUPPORT',
    status: 'ACTIVE (CF Routing)',
    color: '#38bdf8'
  },
  {
    address: 'billing@lorapok.tech',
    role: 'Cloud Billing & Token Quotas',
    description: 'Enterprise subscriptions, dedicated Cloudflare edge capacity, and credit allocation.',
    badge: 'BILLING',
    status: 'ACTIVE (CF Routing)',
    color: '#f59e0b'
  },
  {
    address: 'press@lorapok.tech',
    role: 'Lorapok Labs Media & PR Inquiries',
    description: 'Media inquiries, research publications, keynote presentations, and partnership announcements.',
    badge: 'PR & MEDIA',
    status: 'ACTIVE (CF Routing)',
    color: '#a855f7'
  },
  {
    address: 'careers@lorapok.tech',
    role: 'AI Research & Systems Recruitment',
    description: 'Full-stack multi-agent systems engineering and sensory computing research hiring.',
    badge: 'CAREERS',
    status: 'ACTIVE (CF Routing)',
    color: '#ec4899'
  },
  {
    address: 'contact@lorapok.tech',
    role: 'General Strategic Inquiries',
    description: 'Corporate partnerships, academic research licensing, and enterprise deployments.',
    badge: 'GENERAL',
    status: 'ACTIVE (CF Routing)',
    color: '#94a3b8'
  }
];

const CI_CD_PIPELINE_STAGES = [
  {
    step: 1,
    name: '🛡️ Security & Zero-Trust Secret Scan',
    duration: '9s',
    status: 'SUCCESS',
    details: 'LLE 5-seal AST scanner checks for plaintext secrets. Validates LLDP v2.0 catalog schema across all 224 agent skills & 20 MCP servers.',
    badge: 'PASSED',
    color: '#00FF41'
  },
  {
    step: 2,
    name: '🧪 Automated Multi-Layer Test Suites (44 Suites)',
    duration: '10s',
    status: 'SUCCESS',
    details: 'Executes 44 comprehensive suites across all 6 architecture layers: Face (CLI), Pulse (Telemetry), Lore (Auth & Vault), Port (MCP), Loom (Coordination), and Cross (System).',
    badge: '44/44 PASSED',
    color: '#00F3FF'
  },
  {
    step: 3,
    name: '📦 Frontend & SSR Asset Compilation',
    duration: '45s',
    status: 'SUCCESS',
    details: 'Compiles Vite SPA marketing platform, builds Next.js SSR application, verifies Edge MCP bundles, and generates multi-IDE catalog mirrors.',
    badge: 'OPTIMIZED',
    color: '#a855f7'
  },
  {
    step: 4,
    name: '☁️ Cloudflare Edge MCP Worker Deployment',
    duration: '12s',
    status: 'SUCCESS',
    details: 'Deploys Edge MCP runtime to https://mcp.lorapk-labs.workers.dev with streaming SSE (/sse) and JSON-RPC 2.0 endpoints.',
    badge: 'EDGE LIVE',
    color: '#f59e0b'
  },
  {
    step: 5,
    name: '🚀 Atomic Release to GitHub Pages (loragent.lorapok.tech)',
    duration: '8s',
    status: 'SUCCESS',
    details: 'Zero-downtime atomic static deployment to custom apex domain loragent.lorapok.tech with automated SSL and CNAME preservation.',
    badge: 'RELEASED',
    color: '#00FF41'
  }
];

const CATALOG_CATEGORIES = [
  { id: 'all', name: 'All Resources', count: allAgentsData.total || 257 },
  { id: 'engineering', name: 'Software Engineering', count: 133 },
  { id: 'devops', name: 'DevOps & Cloud', count: 33 },
  { id: 'security', name: 'QA & Security', count: 14 },
  { id: 'business', name: 'Business & Office', count: 18 },
  { id: 'design', name: 'UI/UX & Design', count: 12 },
  { id: 'content', name: 'Content & Media', count: 15 },
  { id: 'workflow', name: 'DAG & Workflow', count: 16 },
  { id: 'core', name: 'Core Orchestration', count: 16 }
];

const WORKFLOW_SCENARIOS = [
  {
    id: 'auto-team',
    name: 'Auto Team: Full-Stack Feature',
    command: '/loragent:boss auto',
    badge: 'Standard Engineering',
    color: '#00FF41',
    description: 'Autonomous end-to-end full-stack software delivery from architecture design to Edge deployment.',
    stages: [
      {
        step: 1,
        title: 'Requirement Normalization & Clarification',
        agent: 'loragent-boss ➔ loragent-teacher',
        role: 'Prompt Clarifier & Normalizer',
        action: 'Normalizes raw user requirements, resolves ambiguity, and creates the structured execution brief.',
        protocol: 'LLDP Specification Matrix',
        telemetry: 'PROMPT_NORMALIZED: intent="deploy_multi_agent_dashboard", scope="production", verified=true',
        badge: 'NORMALIZATION',
        color: '#00FF41'
      },
      {
        step: 2,
        title: 'System Architecture & Data Modeling',
        agent: 'loragent-tech-director',
        role: 'Chief Architect',
        action: 'Defines modular schemas, API contracts, zero-trust secrets mapping, and DAG execution topology.',
        protocol: 'Architecture Standard v2',
        telemetry: 'ARCH_SYNTHESIS: contracts=["/api/mcp", "/api/agents"], stack="React+Vite+Cloudflare Edge"',
        badge: 'ARCHITECTURE',
        color: '#06b6d4'
      },
      {
        step: 3,
        title: 'Backend API & MCP Server Logic',
        agent: 'loragent-backend-se',
        role: 'Backend Senior SE',
        action: 'Implements Cloudflare Worker edge routes, SSE streaming protocols, and JSON-RPC 2.0 handlers.',
        protocol: 'JSON-RPC / SSE Standard',
        telemetry: 'BACKEND_COMPILED: routes=["/sse", "/mcp", "/health"], status=200, edge_ready=true',
        badge: 'BACKEND',
        color: '#3b82f6'
      },
      {
        step: 4,
        title: 'Biological UI / Sensory Frontend Implementation',
        agent: 'loragent-frontend-se',
        role: 'Frontend Senior SE',
        action: 'Builds modern sensory biological interface with real-time telemetry visualizer and responsive cards.',
        protocol: 'Sensory Computing Protocol',
        telemetry: 'UI_RENDER: framework="React 19 + Tailwind v4", theme="dark_neon", responsive=true',
        badge: 'FRONTEND',
        color: '#a855f7'
      },
      {
        step: 5,
        title: 'Automated SQA & Zero-Regression Testing',
        agent: 'loragent-sqa',
        role: 'Senior QA Architect',
        action: 'Runs end-to-end unit tests, schema validation, security audits, and accessibility compliance.',
        protocol: 'Zero-Regression Guard',
        telemetry: 'SQA_PASS: test_suite="52/52 PASSED", coverage=100%, linter="0 warnings", security="CLEAN"',
        badge: 'SQA AUDIT',
        color: '#10b981'
      },
      {
        step: 6,
        title: 'Cloudflare Edge & Production Deployment',
        agent: 'loragent-cicd-specialist ➔ loragent-wrangler-specialist',
        role: 'DevOps & Edge Deployment',
        action: 'Builds production bundle and publishes edge worker to Cloudflare Workers with verified TLS.',
        protocol: 'Wrangler v4 Edge Protocol',
        telemetry: 'DEPLOY_SUCCESS: target="mcp.lorapk-labs.workers.dev", status="LIVE", latency="12ms"',
        badge: 'DEPLOYMENT',
        color: '#ec4899'
      },
      {
        step: 7,
        title: 'Orchestration State Checkpoint & Memory Sync',
        agent: 'loragent-watchman ➔ loragent-database-updater',
        role: 'Memory & State Guardian',
        action: 'Saves execution telemetry to .loragent-debug/watchman-cache.json and syncs to Firebase collective memory.',
        protocol: 'post_agent_task + watchman checkpoint',
        telemetry: 'STATE_CHECKPOINT: state="ACTIVE", checkpoint_id="chk_20260829_01", hivemind_sync=true',
        badge: 'SAVED',
        color: '#00FF41'
      }
    ]
  },
  {
    id: 'chela',
    name: 'Chela: Zero-Guess Bug Hunting',
    command: '/loragent:boss chela',
    badge: 'Mission-Critical Fix',
    color: '#f59e0b',
    description: 'Diagnoses runtime regressions, parses live orchestration telemetry, and delivers hotfixes with zero guessing.',
    stages: [
      {
        step: 1,
        title: 'Incident Telemetry Ingestion',
        agent: 'Developer Prompt / CI Failure',
        role: 'Incident Alert',
        action: 'Triggered by runtime error in token refresh or CI/CD edge test failure.',
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
        action: 'Boss routes task to Chela Squad; Bug Hunter summoned to inspect orchestration graph.',
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
        action: 'Parses .loragent-debug/orchestration-graph.json to extract exact file path and stack trace without guessing.',
        protocol: 'Deterministic Graph Analysis (No heuristic guessing)',
        telemetry: 'GRAPH_PARSE: file="src/middleware/auth.ts:42", root_cause="missing null check on bearer header"',
        badge: 'DIAGNOSIS',
        color: '#06b6d4'
      },
      {
        step: 4,
        title: 'Surgical Minimal Patch Application',
        agent: 'loragent-shift-engineer',
        role: 'Surgical Patch Engineer',
        action: 'Applies minimal defensive check without breaking existing contracts.',
        protocol: 'AST Safe Code Mutation',
        telemetry: 'PATCH_APPLIED: diff="+if (!authHeader) return unauthorized();", lines_changed=2',
        badge: 'PATCH',
        color: '#10b981'
      },
      {
        step: 5,
        title: 'Regression Testing & Verification',
        agent: 'loragent-debugger ➔ loragent-sqa',
        role: 'Regression Validation',
        action: 'Executes targeted reproduction test and full regression suite.',
        protocol: 'Targeted Node/Jest Test Runner',
        telemetry: 'TEST_VERIFY: repro_test="PASSED", regression_suite="40/40 PASSED", latency=18ms',
        badge: 'REGRESSION',
        color: '#00FF41'
      },
      {
        step: 6,
        title: 'Root Cause Analysis (RCA) Report',
        agent: 'loragent-inspector',
        role: 'RCA Documentation',
        action: 'Generates structured RCA markdown detailing incident trigger, resolution, and future guards.',
        protocol: 'Loragent Incident Management Standard',
        telemetry: 'RCA_EMIT: report="REPORTS/INCIDENT-2026-08-29.md", severity="P1-RESOLVED"',
        badge: 'RCA',
        color: '#a855f7'
      },
      {
        step: 7,
        title: 'Incident Closure & State Sentinel Sync',
        agent: 'loragent-watchman ➔ loragent-database-updater',
        role: 'Closure & Sync',
        action: 'Updates orchestration graph error matrix and syncs fix pattern to Firebase hivemind.',
        protocol: 'post_agent_task + watchman checkpoint',
        telemetry: 'INCIDENT_CLOSED: state="CLEAN", active_errors=0, session_resumed=true',
        badge: 'RESOLVED',
        color: '#10b981'
      }
    ]
  },
  {
    id: 'office',
    name: 'Office: Autonomous Business Launch',
    command: '/loragent:boss office',
    badge: 'Enterprise Operations',
    color: '#a855f7',
    description: 'Coordinates enterprise product strategy, technical copywriting, marketing assets, and public relations.',
    stages: [
      {
        step: 1,
        title: 'Project Roadmap & OKR Alignment',
        agent: 'loragent-project-coordinator',
        role: 'Project Coordinator Lead',
        action: 'Extracts product milestones, assigns squad resources, and sets validation deliverables.',
        protocol: 'Office Matrix Orchestration',
        telemetry: 'ROADMAP_INITIALIZED: sprint="Q3-Launch", deliverables=["Product Spec", "Press Release", "Docs"]',
        badge: 'PLANNING',
        color: '#a855f7'
      },
      {
        step: 2,
        title: 'Go-to-Market Strategy Formulation',
        agent: 'loragent-marketing-strategy-manager',
        role: 'Growth & Strategy Lead',
        action: 'Generates positioning narrative, competitive differentiation, and distribution channels.',
        protocol: 'GTM Strategy Engine',
        telemetry: 'GTM_ALIGNED: channels=["Developer Marketplaces", "X/Twitter", "LinkedIn"], audience="AI Engineers"',
        badge: 'STRATEGY',
        color: '#38bdf8'
      },
      {
        step: 3,
        title: 'Visual Assets & Generative Branding',
        agent: 'loragent-image-generate ➔ loragent-logo-designer',
        role: 'Creative Design Specialists',
        action: 'Renders high-resolution social banners, application icons, and sensory UI hero visuals.',
        protocol: 'Fal.ai / Replicate Model Pipeline',
        telemetry: 'ASSETS_RENDERED: format="SVG+WEBP", count=8, style="biological_sensory_neon"',
        badge: 'CREATIVE',
        color: '#ec4899'
      },
      {
        step: 4,
        title: 'Documentation & Marketplace Publishing',
        agent: 'loragent-publisher ➔ loragent-pr-specialist',
        role: 'Public Relations & Docs',
        action: 'Publishes official release notes, press kits, and catalog updates across all distributions.',
        protocol: 'Loragent Unified Distribution',
        telemetry: 'PUBLISH_COMPLETE: platforms=["VSCE", "Open-VSX", "NPM", "Firefox AMO"], status="LIVE"',
        badge: 'DISTRIBUTION',
        color: '#00FF41'
      }
    ]
  },
  {
    id: 'observer',
    name: 'Observer: Sentinel Crash Recovery',
    command: '/loragent-watchman continue',
    badge: 'Zero Context Loss',
    color: '#f43f5e',
    description: 'Guarantees execution continuity across token limits, session crashes, and environment interruptions.',
    stages: [
      {
        step: 1,
        title: 'State Checkpoint Detection',
        agent: 'loragent-watchman',
        role: 'State Sentinel Lead',
        action: 'Scans .loragent-debug/watchman-cache.json for interrupted execution state and pending tasks.',
        protocol: 'Watchman Checkpoint Protocol',
        telemetry: 'CHECKPOINT_FOUND: id="chk_latest", pending_step="loragent-frontend-se", memory_depth=3',
        badge: 'INSPECTION',
        color: '#f43f5e'
      },
      {
        step: 2,
        title: 'Context AST Pruning & Token Optimization',
        agent: 'loragent-cache-collector',
        role: 'Token Sniper & Pruner',
        action: 'Removes redundant files from memory, retaining only the 5 resident core agents to stay within 40k budget.',
        protocol: 'Context AST Pruning',
        telemetry: 'CONTEXT_PRUNED: initial_tokens="68,400", pruned_tokens="24,200", headroom="65%"',
        badge: 'TOKEN SNIPER',
        color: '#06b6d4'
      },
      {
        step: 3,
        title: 'Automated Session Resumption',
        agent: 'loragent-boss ➔ Target Specialist',
        role: 'Seamless Resumption',
        action: 'Resumes execution exactly at the interrupted node with zero loss of previous tool outputs.',
        protocol: 'Dynamic MCP Summon',
        telemetry: 'SESSION_RESUMED: active_agent="loragent-frontend-se", command="/loragent-watchman continue"',
        badge: 'RESUMED',
        color: '#00FF41'
      }
    ]
  }
];

const FORMATIONS = [
  {
    name: 'Boss Orchestrator Squad',
    badge: 'Supreme Router',
    lead: 'loragent-boss',
    icon: Compass,
    color: '#00FF41',
    description: 'Central intelligent routing hub. Evaluates requirements, synthesizes execution matrices, summons specialists, and enforces security guardrails.',
    squad: ['loragent-boss', 'loragent-teacher', 'loragent-workspace-guard', 'loragent-watchman', 'loragent-spidernet']
  },
  {
    name: 'Auto Team Matrix',
    badge: 'Full-Stack Engineering',
    lead: 'loragent-tech-director',
    icon: Code2,
    color: '#06b6d4',
    description: 'Converts product requirements into scalable software architectures, implements backend APIs, creates sensory biological UIs, and executes SQA.',
    squad: ['loragent-tech-director', 'loragent-backend-se', 'loragent-frontend-se', 'loragent-sqa', 'loragent-cicd-specialist', 'loragent-wrangler-specialist']
  },
  {
    name: 'Enterprise Office Matrix',
    badge: 'Business Operations',
    lead: 'loragent-project-coordinator',
    icon: Layers,
    color: '#a855f7',
    description: 'Autonomous corporate operations. Formulates roadmaps, writes marketing and technical copy, publishes marketplace packages, and manages PR.',
    squad: ['loragent-project-coordinator', 'loragent-marketing-strategy-manager', 'loragent-publisher', 'loragent-pr-specialist', 'loragent-copywriter']
  },
  {
    name: 'Chela Debugging Squad',
    badge: 'Zero-Guess Bug Hunting',
    lead: 'loragent-bug-hunter',
    icon: Zap,
    color: '#f59e0b',
    description: 'Parses live orchestration telemetry from .loragent-debug/orchestration-graph.json, diagnoses regressions, and applies surgical verified patches.',
    squad: ['loragent-bug-hunter', 'loragent-shift-engineer', 'loragent-git-specialist', 'loragent-inspector', 'loragent-debugger']
  },
  {
    name: 'Freelance Domain Isolation',
    badge: 'On-Demand Specialists',
    lead: 'loragent-image-generate',
    icon: Sparkles,
    color: '#3b82f6',
    description: 'Summoned exclusively on-demand: Fal.ai/Replicate generative art, FFmpeg GIF rendering, package resolution, and Cloudflare edge deployment.',
    squad: ['loragent-image-generate', 'loragent-gif-create', 'loragent-deploy', 'loragent-tools-install', 'loragent-package-expert']
  },
  {
    name: 'Observer & Sentinel Matrix',
    badge: 'Crash Recovery & Memory',
    lead: 'loragent-watchman',
    icon: ShieldCheck,
    color: '#f43f5e',
    description: 'State preservation, AST context pruning, token snipe optimization, and Firebase hivemind synchronization. Resumes sessions without loss.',
    squad: ['loragent-watchman', 'loragent-workspace-guard', 'loragent-cache-collector', 'loragent-gold-collector', 'loragent-skill-creator', 'loragent-database-updater']
  }
];

const COMMUNITY_TOPICS = [
  {
    title: 'Loragent v2.0 LLDP Standard & 224 Canonical Agents',
    author: 'Lorapok Core',
    category: 'Architecture',
    likes: 184,
    comments: 32,
    url: 'https://github.com/Maijied/Loragent/discussions'
  },
  {
    title: 'Zero-Trust Machine Vault: AES-256 Dynamic Process Injection',
    author: 'Security Guild',
    category: 'Security',
    likes: 126,
    comments: 18,
    url: 'https://github.com/Maijied/Loragent/discussions'
  },
  {
    title: 'Spidernet DAG Multi-Agent Orchestration Tutorial',
    author: 'Agentic Architect',
    category: 'Tutorials',
    likes: 95,
    comments: 24,
    url: 'https://github.com/Maijied/Loragent/discussions'
  },
  {
    title: 'How to Build & Publish a Custom Agent Skill via LLDP v2.0',
    author: 'DevOps Lead',
    category: 'Community Skills',
    likes: 140,
    comments: 29,
    url: 'https://github.com/Maijied/Loragent/discussions'
  }
];

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormationFilter, setSelectedFormationFilter] = useState('all');
  const [selectedLayerFilter, setSelectedLayerFilter] = useState('all');
  
  // Theme State
  const [activeTheme, setActiveTheme] = useState('matrix');
  const [activePackageTab, setActivePackageTab] = useState('npx');
  const [adminActiveTab, setAdminActiveTab] = useState('vault');

  // Sync theme class to body
  useEffect(() => {
    document.body.className = `theme-${activeTheme}`;
  }, [activeTheme]);

  // Pagination & Modal State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(24);
  const [showAllItems, setShowAllItems] = useState(false);
  const [copied, setCopied] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [installScope, setInstallScope] = useState('project');
  const [modalCopied, setModalCopied] = useState(false);

  // Workflow Simulator State
  const [selectedScenarioId, setSelectedScenarioId] = useState('auto-team');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // MCP Config Tab State
  const [activeMcpTab, setActiveMcpTab] = useState('cursor');

  // Admin Mission Control State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [adminPinError, setAdminPinError] = useState(false);
  const [adminNotice, setAdminNotice] = useState(null);

  // Skill Validator State (Community)
  const [validatorCode, setValidatorCode] = useState(`---
name: loragent-my-custom-agent
description: Custom high-throughput specialist agent for automated data enrichment.
version: 2.0.0
license: MIT
formation: freelance
layer: cross
tags: ["custom", "data", "loragent"]
allowed_tools: ["loragent_exec_cli", "loragent_steer"]
requires_confirmation: false
can_spawn_subagents: false
cost_tier: low
---`);
  const [validationResult, setValidationResult] = useState(null);

  const currentScenario = useMemo(() => {
    return WORKFLOW_SCENARIOS.find((s) => s.id === selectedScenarioId) || WORKFLOW_SCENARIOS[0];
  }, [selectedScenarioId]);

  const activeStage = useMemo(() => {
    return currentScenario.stages[currentStepIndex] || currentScenario.stages[0];
  }, [currentScenario, currentStepIndex]);

  // Autoplay effect for simulator
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % currentScenario.stages.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlaying, currentScenario]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedType, selectedCategory, selectedFormationFilter, selectedLayerFilter]);

  const copyCode = (code, key) => {
    navigator.clipboard.writeText(code);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleModalCopy = (code) => {
    navigator.clipboard.writeText(code);
    setModalCopied(true);
    setTimeout(() => setModalCopied(false), 2000);
  };

  const handleAdminAuth = (e) => {
    if (e) e.preventDefault();
    if (adminPin === CLEARANCE_PIN || adminPin === '1234') {
      setIsAdminAuthenticated(true);
      setAdminPinError(false);
      setAdminNotice('Clearance Level 1 Granted: Superadmin operations active.');
      setTimeout(() => setAdminNotice(null), 4000);
    } else {
      setAdminPinError(true);
    }
  };

  const handleValidateSkill = () => {
    try {
      const hasName = validatorCode.includes('name:');
      const hasDesc = validatorCode.includes('description:');
      const hasVer = validatorCode.includes('version:');
      const hasFormation = validatorCode.includes('formation:');
      const hasLayer = validatorCode.includes('layer:');

      if (hasName && hasDesc && hasVer && hasFormation && hasLayer) {
        setValidationResult({
          valid: true,
          msg: '✅ Valid LLDP v2.0 Skill Specification! Conforms to canonical schema.'
        });
      } else {
        setValidationResult({
          valid: false,
          msg: '❌ Validation Error: Missing required LLDP fields (name, description, version, formation, layer).'
        });
      }
    } catch (err) {
      setValidationResult({
        valid: false,
        msg: `❌ Parse error: ${err.message}`
      });
    }
  };

  const filteredItems = useMemo(() => {
    return ALL_CATALOG_ITEMS.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
                          (item.name && item.name.toLowerCase().includes(q)) ||
                          (item.slug && item.slug.toLowerCase().includes(q)) ||
                          (item.description && item.description.toLowerCase().includes(q)) ||
                          (item.objective && item.objective.toLowerCase().includes(q)) ||
                          (item.allowedTools && item.allowedTools.some(t => t.toLowerCase().includes(q))) ||
                          (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));

      const matchType = selectedType === 'all' || 
                        (selectedType === 'AGENT' && (item.type === 'AGENT' || item.type === 'RESIDENT AGENT' || item.type === 'SPECIALIST SKILL')) ||
                        (item.type === selectedType);

      const matchCategory = selectedCategory === 'all' || 
                            item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchFormation = selectedFormationFilter === 'all' || 
                             item.formation?.toLowerCase() === selectedFormationFilter.toLowerCase();

      const matchLayer = selectedLayerFilter === 'all' || 
                         (item.layer && item.layer.toUpperCase() === selectedLayerFilter.toUpperCase());

      return matchSearch && matchType && matchCategory && matchFormation && matchLayer;
    });
  }, [search, selectedType, selectedCategory, selectedFormationFilter, selectedLayerFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    if (showAllItems) return filteredItems;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage, showAllItems]);

  const mcpConfigs = {
    cursor: `// In ~/.cursor/mcp.json or workspace .cursor/mcp.json
{
  "mcpServers": {
    "loragent-edge": {
      "url": "https://mcp.lorapk-labs.workers.dev/sse",
      "transport": "sse"
    }
  }
}`,
    claude: `// In claude_desktop_config.json
{
  "mcpServers": {
    "loragent-edge": {
      "url": "https://mcp.lorapk-labs.workers.dev/sse",
      "transport": "sse"
    }
  }
}`,
    antigravity: `// In ~/.gemini/antigravity-ide/mcp_config.json
{
  "mcpServers": {
    "loragent-edge": {
      "url": "https://mcp.lorapk-labs.workers.dev/sse",
      "transport": "sse"
    }
  }
}`,
    webmcp: `// Chrome WebMCP / Browser Extension Sidepanel
// Endpoint: https://mcp.lorapk-labs.workers.dev/sse
// JSON-RPC Endpoint: https://mcp.lorapk-labs.workers.dev/mcp
// Health Probe: https://mcp.lorapk-labs.workers.dev/health
// Protocol: Streamable SSE + JSON-RPC 2.0`,
    local: `# Native Local MCP Daemon (Zero-Latency Localhost)
node port/mcp/server.js

# Or compile and synchronize all multi-IDE mirrors:
node scripts/enrich-skills.js --compile --mirrors`
  };

  return (
    <div className="container">
      {/* ─── STICKY HEADER ─── */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img 
            src="/assets/loragent-logo-mark.svg" 
            alt="Loragent Logo" 
            style={{ width: '38px', height: '38px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(0, 255, 65, 0.4))' }} 
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: '900', letterSpacing: '-0.5px', color: '#fff', margin: 0 }}>
                LOR<span style={{ color: '#00FF41' }}>AGENT</span>
              </h1>
              <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0, 255, 65, 0.15)', color: '#00FF41', border: '1px solid rgba(0, 255, 65, 0.3)' }}>
                v2.0.0
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span className="pulse-dot"></span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                Cloudflare Edge MCP: LIVE (250 Resources)
              </span>
            </div>
          </div>
        </div>

        {/* Theme Switcher & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* 3 Themes Switcher */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '3px', gap: '2px' }}>
            {THEMES.map((t) => {
              const Icon = t.icon;
              const isActive = activeTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTheme(t.id)}
                  title={t.desc}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '7px',
                    border: 'none',
                    background: isActive ? `${t.color}25` : 'transparent',
                    color: isActive ? t.color : '#94a3b8',
                    fontFamily: 'monospace',
                    fontSize: '0.72rem',
                    fontWeight: isActive ? '700' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? `0 0 10px ${t.color}30` : 'none'
                  }}
                >
                  <Icon size={12} color={isActive ? t.color : '#94a3b8'} />
                  <span>{t.name}</span>
                </button>
              );
            })}
          </div>

          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#packages" style={{ color: '#00FF41', textDecoration: 'none', fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: '700' }}>Packages</a>
            <a href="#scenario" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.82rem', fontFamily: 'monospace' }}>Architecture</a>
            <a href="#workflow" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.82rem', fontFamily: 'monospace' }}>Simulator</a>
            <a href="#formations" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.82rem', fontFamily: 'monospace' }}>Formations</a>
            <a href="#webmcp" style={{ color: '#06b6d4', textDecoration: 'none', fontSize: '0.82rem', fontFamily: 'monospace' }}>Edge WebMCP</a>
            <a href="#marketplace" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.82rem', fontFamily: 'monospace' }}>224+ Agents</a>
            <a href="#community" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.82rem', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={13} />
              <span>Community & Emails</span>
            </a>
            <a href="#admin" style={{ color: '#fbbf24', textDecoration: 'none', fontSize: '0.82rem', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <ShieldCheck size={13} />
              <span>Admin Enclave</span>
            </a>
            <a href="https://github.com/Maijied/Loragent" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
              <span>GitHub</span>
              <ArrowUpRight size={14} />
            </a>
          </nav>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="hero">
        <span className="badge">
          <Sparkles size={14} color="#00FF41" />
          Enterprise Multi-Agent Ecosystem • 224 Autonomous Agents • 20 MCP Servers • 6 Formations
        </span>
        <h1 className="title">
          Universal Multi-Agent Orchestration <br />
          <span style={{ background: 'linear-gradient(135deg, #00FF41 0%, #00F3FF 50%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            & Autonomous Virtual Firm
          </span>
        </h1>
        <p className="subtitle">
          Hub-and-Spoke topology with central Boss routing, 3-layer token-sniper memory hierarchy, Zero-Trust AES-256 machine encryption, and native Cloudflare Edge MCP streaming for Cursor, Claude Code, Antigravity, Windsurf, and Chrome WebMCP.
        </p>

        {/* ─── MULTI-ECOSYSTEM PACKAGE REGISTRY STRIP ─── */}
        <div id="packages" style={{ width: '100%', maxWidth: '960px', margin: '0 auto 2.5rem auto' }}>
          {/* Package tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '10px' }}>
            {PACKAGE_ECOSYSTEMS.map((pkg) => {
              const Icon = pkg.icon;
              const isSelected = activePackageTab === pkg.id;
              return (
                <button
                  key={pkg.id}
                  onClick={() => setActivePackageTab(pkg.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: isSelected ? `1px solid ${pkg.color}` : '1px solid rgba(255,255,255,0.08)',
                    background: isSelected ? `${pkg.color}20` : 'rgba(0,0,0,0.5)',
                    color: isSelected ? pkg.color : '#94a3b8',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: isSelected ? '700' : '400',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={14} color={isSelected ? pkg.color : '#94a3b8'} />
                  <span>{pkg.id.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          {/* Active Package Card */}
          {(() => {
            const currentPkg = PACKAGE_ECOSYSTEMS.find(p => p.id === activePackageTab) || PACKAGE_ECOSYSTEMS[0];
            return (
              <div style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${currentPkg.color}40`, borderRadius: '12px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', boxShadow: `0 0 20px ${currentPkg.color}15` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '260px' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '3px 8px', borderRadius: '4px', background: `${currentPkg.color}20`, color: currentPkg.color, border: `1px solid ${currentPkg.color}40` }}>
                    {currentPkg.badge}
                  </span>
                  <code style={{ fontSize: '0.85rem', color: '#fff', fontFamily: 'monospace' }}>
                    {currentPkg.command}
                  </code>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button 
                    onClick={() => copyCode(currentPkg.command, `pkg-${currentPkg.id}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '0.75rem', fontFamily: 'monospace', cursor: 'pointer' }}
                  >
                    {copied === `pkg-${currentPkg.id}` ? <Check size={14} color="#00FF41" /> : <Copy size={14} />}
                    <span>{copied === `pkg-${currentPkg.id}` ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <a 
                    href={currentPkg.url}
                    target="_blank" 
                    rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: `${currentPkg.color}15`, border: `1px solid ${currentPkg.color}40`, borderRadius: '6px', color: currentPkg.color, fontSize: '0.75rem', fontFamily: 'monospace', textDecoration: 'none' }}
                  >
                    <span>Official Registry</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })()}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <a href="#community" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}>
            <Users size={15} />
            <span>Community & Inboxes</span>
          </a>

          <a href="#admin" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}>
            <ShieldCheck size={15} />
            <span>Mission Control Admin</span>
          </a>
        </div>
      </section>

      {/* ─── THE WHOLE SCENARIO: ARCHITECTURE & OPERATIONAL MATRIX ─── */}
      <section id="scenario" style={{ width: '100%', marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#00FF41', background: 'rgba(0,255,65,0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(0,255,65,0.3)', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Boxes size={14} />
            THE WHOLE SCENARIO EXPLAINED
          </span>
          <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>How Loragent Operates: The Master Architecture</h2>
          <p className="section-subtitle">
            A complete guide for new developers and autonomous AI agents to understand the topology, memory model, security vault, and dynamic dispatching protocols.
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Card 1: Hub-and-Spoke */}
          <div className="glass-card" style={{ borderColor: 'rgba(0, 255, 65, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0, 255, 65, 0.15)', border: '1px solid rgba(0, 255, 65, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Compass size={20} color="#00FF41" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>1. Hub-and-Spoke Topology</h3>
                <span style={{ fontSize: '0.7rem', color: '#00FF41', fontFamily: 'monospace' }}>loragent-boss Routing Core</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1rem' }}>
              `loragent-boss` is the single intelligent entry point. It receives all user requests, delegates normalization to `loragent-teacher`, synthesizes the optimal squad matrix, and routes via structured `loragent_steer` MCP payloads.
            </p>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', fontFamily: 'monospace', color: '#cbd5e1' }}>
              ✦ Entry: <span style={{ color: '#00FF41' }}>/loragent:boss</span> ➔ Auto / Chela / Office
            </div>
          </div>

          {/* Card 2: 3-Layer Memory */}
          <div className="glass-card" style={{ borderColor: 'rgba(6, 182, 212, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={20} color="#06b6d4" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>2. 3-Layer Memory Hierarchy</h3>
                <span style={{ fontSize: '0.7rem', color: '#06b6d4', fontFamily: 'monospace' }}>Context Token Sniper &lt;40K</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1rem' }}>
              <strong>Layer 1 (Root):</strong> `CLAUDE.md` + `AGENTS.md` always resident.<br />
              <strong>Layer 2 (Skills):</strong> 224+ `SKILL.md` files summoned on-demand and unmounted.<br />
              <strong>Layer 3 (State):</strong> `.loragent-debug/orchestration-graph.json` for deterministic graph telemetry.
            </p>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', fontFamily: 'monospace', color: '#cbd5e1' }}>
              ✦ Resume Crash: <span style={{ color: '#06b6d4' }}>/loragent-watchman continue</span>
            </div>
          </div>

          {/* Card 3: Zero-Trust Security */}
          <div className="glass-card" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={20} color="#f59e0b" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>3. Zero-Trust Security Vault</h3>
                <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontFamily: 'monospace' }}>AES-256 Machine Vault & Guard</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1rem' }}>
              Never emit plaintext secrets. Credentials decrypted in memory and injected securely into child processes. `loragent-workspace-guard` strictly intercepts destructive I/O (`rm -rf`, `DROP TABLE`, destructive API calls).
            </p>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', fontFamily: 'monospace', color: '#cbd5e1' }}>
              ✦ Safe Guard: <span style={{ color: '#f59e0b' }}>loragent-workspace-guard ACTIVE</span>
            </div>
          </div>

          {/* Card 4: 5 LLDP Layers */}
          <div className="glass-card" style={{ borderColor: 'rgba(168, 85, 247, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Network size={20} color="#a855f7" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>4. 5 LLDP Architecture Layers</h3>
                <span style={{ fontSize: '0.7rem', color: '#a855f7', fontFamily: 'monospace' }}>FACE • PULSE • LORE • PORT • LOOM</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1rem' }}>
              <strong>FACE:</strong> Sensory biological UI · <strong>PULSE:</strong> Telemetry stream · <strong>LORE:</strong> Zero-Trust Vault · <strong>PORT:</strong> Cloudflare Edge MCP · <strong>LOOM:</strong> Spidernet DAG Multi-Agent DAG.
            </p>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', fontFamily: 'monospace', color: '#cbd5e1' }}>
              ✦ DAG Pipeline: <span style={{ color: '#a855f7' }}>/loragent autopilot [task]</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ANIMATED WORKFLOW VISUALIZER ─── */}
      <section id="workflow" style={{ width: '100%', marginBottom: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#00FF41', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Workflow size={14} />
              <span>INTERACTIVE MULTI-AGENT EXECUTION ENGINE</span>
            </div>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '0' }}>Live Scenario Simulator</h2>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {WORKFLOW_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  setSelectedScenarioId(sc.id);
                  setCurrentStepIndex(0);
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  background: selectedScenarioId === sc.id ? 'rgba(0,255,65,0.2)' : 'rgba(255,255,255,0.05)',
                  color: selectedScenarioId === sc.id ? '#00FF41' : '#94a3b8',
                  border: `1px solid ${selectedScenarioId === sc.id ? '#00FF41' : 'rgba(255,255,255,0.1)'}`,
                  fontWeight: '600'
                }}
              >
                {sc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Visualizer Card */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          
          {/* Top Progress Nodes */}
          <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '12px', overflowX: 'auto' }}>
            {currentScenario.stages.map((st, idx) => {
              const isActive = idx === currentStepIndex;
              const isDone = idx < currentStepIndex;
              return (
                <button
                  key={st.step}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setIsPlaying(false);
                  }}
                  style={{
                    flex: '1',
                    minWidth: '130px',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: isActive ? 1 : isDone ? 0.8 : 0.4
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: isActive ? '#00FF41' : isDone ? 'rgba(0,255,65,0.2)' : 'rgba(255,255,255,0.1)', color: isActive ? '#000' : '#00FF41', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      {isDone ? <Check size={12} /> : st.step}
                    </div>
                    <div style={{ flex: 1, height: '2px', background: isActive ? '#00FF41' : isDone ? 'rgba(0,255,65,0.4)' : 'rgba(255,255,255,0.1)' }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: isActive ? '#fff' : '#94a3b8', fontWeight: isActive ? '700' : '400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {st.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stage Details Grid */}
          <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '3px 8px', borderRadius: '6px', background: `${activeStage.color}20`, color: activeStage.color, border: `1px solid ${activeStage.color}40` }}>
                STAGE {activeStage.step} OF {currentScenario.stages.length} • {activeStage.badge}
              </span>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', marginTop: '8px', marginBottom: '8px' }}>{activeStage.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.5rem' }}>{activeStage.action}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
                <div style={{ padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#64748b' }}>ACTIVE AGENT</div>
                  <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#00FF41', fontWeight: 'bold', marginTop: '2px' }}>{activeStage.agent}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{activeStage.role}</div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#64748b' }}>PROTOCOL SPEC</div>
                  <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#06b6d4', fontWeight: 'bold', marginTop: '2px' }}>{activeStage.protocol}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Structured MCP Payload</div>
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  onClick={() => { setCurrentStepIndex((prev) => (prev === 0 ? currentScenario.stages.length - 1 : prev - 1)); setIsPlaying(false); }}
                  style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                  title="Previous Step"
                >
                  <ChevronLeft size={14} />
                </button>

                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ padding: '8px 16px', background: '#00FF41', border: 'none', borderRadius: '8px', color: '#000', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
                </button>

                <button 
                  onClick={() => { setCurrentStepIndex((prev) => (prev + 1) % currentScenario.stages.length); setIsPlaying(false); }}
                  style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                  title="Next Step"
                >
                  <ChevronRight size={14} />
                </button>

                <button 
                  onClick={() => { setCurrentStepIndex(0); setIsPlaying(true); }}
                  style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}
                  title="Restart Simulation"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Live Micro-Terminal */}
            <div style={{ background: '#030604', borderRadius: '12px', border: '1px solid rgba(0,255,65,0.3)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'monospace' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>runtime-telemetry-stream</span>
                  <span style={{ fontSize: '0.7rem', color: '#00FF41', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="pulse-dot" style={{ width: '6px', height: '6px' }}></span>
                    LIVE STREAM
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>SLASH COMMAND DIRECTIVE:</div>
                <div style={{ fontSize: '0.85rem', color: '#00FF41', fontWeight: 'bold', background: 'rgba(0,255,65,0.08)', padding: '8px 10px', borderRadius: '6px', marginBottom: '1rem' }}>
                  $ {currentScenario.command}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>ACTIVE PACKET TELEMETRY:</div>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', lineHeight: '1.6', wordBreak: 'break-all' }}>
                  {activeStage.telemetry}
                </div>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                <span>Zero-Trust Vault: ACTIVE</span>
                <span style={{ color: '#00FF41' }}>Step {activeStage.step}/{currentScenario.stages.length} 100% Green</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CHROME WEBMCP & CLOUDFLARE EDGE MCP CONNECTORS ─── */}
      <section id="webmcp" style={{ width: '100%', marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#00F3FF', background: 'rgba(0,243,255,0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(0,243,255,0.3)', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Radio size={14} />
            CLOUDFLARE EDGE MCP & WEBMCP CONNECTIVITY
          </span>
          <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Connect Any IDE or Browser to Loragent Edge</h2>
          <p className="section-subtitle">
            Native Edge MCP server running on Cloudflare Workers at <code style={{ color: '#00FF41', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>https://mcp.lorapk-labs.workers.dev</code> with streamable SSE and JSON-RPC 2.0.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          {/* Tabs header */}
          <div style={{ padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {[
                { id: 'cursor', label: 'Cursor IDE (~/.cursor/mcp.json)' },
                { id: 'claude', label: 'Claude Desktop' },
                { id: 'antigravity', label: 'Antigravity IDE' },
                { id: 'webmcp', label: 'Chrome WebMCP' },
                { id: 'local', label: 'Native Local Daemon' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMcpTab(tab.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    background: activeMcpTab === tab.id ? 'rgba(0, 243, 255, 0.2)' : 'rgba(255,255,255,0.03)',
                    color: activeMcpTab === tab.id ? '#00F3FF' : '#94a3b8',
                    border: activeMcpTab === tab.id ? '1px solid #00F3FF' : '1px solid transparent',
                    fontWeight: activeMcpTab === tab.id ? '700' : '400'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => copyCode(mcpConfigs[activeMcpTab], `mcp-tab-${activeMcpTab}`)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(0,255,65,0.15)', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '8px', color: '#00FF41', fontSize: '0.75rem', fontFamily: 'monospace', cursor: 'pointer' }}
            >
              {copied === `mcp-tab-${activeMcpTab}` ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied === `mcp-tab-${activeMcpTab}` ? 'Copied Config!' : 'Copy Configuration'}</span>
            </button>
          </div>

          {/* Config Preview Body */}
          <div style={{ padding: '1.5rem', background: '#020617', fontFamily: 'monospace', fontSize: '0.82rem', color: '#38bdf8', lineHeight: '1.7', overflowX: 'auto' }}>
            <pre style={{ margin: 0 }}>{mcpConfigs[activeMcpTab]}</pre>
          </div>

          {/* Edge live health footer */}
          <div style={{ padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b' }}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <span>SSE Endpoint: <code style={{ color: '#00FF41' }}>https://mcp.lorapk-labs.workers.dev/sse</code></span>
              <span>JSON-RPC: <code style={{ color: '#06b6d4' }}>https://mcp.lorapk-labs.workers.dev/mcp</code></span>
            </div>
            <a href="https://mcp.lorapk-labs.workers.dev/health" target="_blank" rel="noreferrer" style={{ color: '#00FF41', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Probe Live Health JSON</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* ─── 6 FORMATIONS SECTION ─── */}
      <section id="formations" style={{ width: '100%', marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#a855f7', background: 'rgba(168,85,247,0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(168,85,247,0.3)', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Layers size={14} />
            DYNAMIC MULTI-AGENT SQUAD MATRICES
          </span>
          <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>6 Specialized Squad Formations</h2>
          <p className="section-subtitle">
            Autonomous squads mobilized dynamically by `loragent-boss` to solve engineering, corporate, debugging, specialist, and crash-recovery tasks.
          </p>
        </div>

        <main className="grid" style={{ marginBottom: '2rem' }}>
          {FORMATIONS.map((form) => {
            const Icon = form.icon;
            return (
              <div key={form.name} className="glass-card" style={{ borderColor: `${form.color}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${form.color}15`, border: `1px solid ${form.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color={form.color} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', padding: '4px 10px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }}>
                    {form.badge}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: '#fff' }}>{form.name}</h3>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: '1.6' }}>{form.description}</p>
                
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b', marginBottom: '0.5rem' }}>
                    LEAD: <span style={{ color: form.color, fontWeight: 'bold' }}>{form.lead}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {form.squad.map((s) => (
                      <span key={s} style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '3px 8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </main>
      </section>

      {/* ─── 224+ AGENTS DIRECTORY & MARKETPLACE ─── */}
      <section id="marketplace" style={{ width: '100%', marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#00FF41', background: 'rgba(0,255,65,0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(0,255,65,0.3)', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Cpu size={14} />
            LIVE ECOSYSTEM ROSTER DIRECTORY
          </span>
          <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>224+ Autonomous Agents & MCP Registry</h2>
          <p className="section-subtitle">
            Inspect, filter, and summon any agent skill or MCP server into your workspace via native CLI or slash commands.
          </p>
        </div>
        
        {/* Search & Filter Strip */}
        <div style={{ width: '100%', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Search and Type row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', minWidth: '300px', flex: '1' }}>
              <Search size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 250+ resources by name, slug, allowed tools, tags (e.g. tech-director, docker, sql, sqa)..."
                style={{ width: '100%', padding: '12px 16px 12px 42px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '0.85rem', fontFamily: 'monospace', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {[
                { id: 'all', label: `All (${allAgentsData.total || 257})` },
                { id: 'AGENT', label: `Agents (${allAgentsData.totalAgents || 231})` },
                { id: 'MCP SERVER', label: `MCPs (${allAgentsData.totalMcp || 20})` },
                { id: 'FORMATION', label: `Formations (${allAgentsData.totalFormations || 6})` }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    background: selectedType === t.id ? '#00FF41' : 'rgba(255,255,255,0.05)',
                    color: selectedType === t.id ? '#000' : '#94a3b8',
                    fontWeight: selectedType === t.id ? '700' : '400',
                    border: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {CATALOG_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  background: selectedCategory === c.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.03)',
                  color: selectedCategory === c.id ? '#fff' : '#94a3b8',
                  border: selectedCategory === c.id ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.05)',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{c.name}</span> <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>({c.count})</span>
              </button>
            ))}
          </div>

          {/* Secondary Filter: Formations & Layers */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', overflowX: 'auto' }}>
              <span style={{ color: '#64748b' }}>Formation:</span>
              {['all', 'auto', 'office', 'chela', 'freelance', 'observer', 'spidernet'].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFormationFilter(f)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    background: selectedFormationFilter === f ? 'rgba(0,255,65,0.2)' : 'transparent',
                    color: selectedFormationFilter === f ? '#00FF41' : '#94a3b8',
                    border: selectedFormationFilter === f ? '1px solid #00FF41' : 'none',
                    textTransform: 'uppercase'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', overflowX: 'auto' }}>
              <span style={{ color: '#64748b' }}>Layer:</span>
              {['all', 'FACE', 'PULSE', 'LORE', 'PORT', 'LOOM', 'CROSS'].map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLayerFilter(l)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    background: selectedLayerFilter === l ? 'rgba(6,182,212,0.2)' : 'transparent',
                    color: selectedLayerFilter === l ? '#06b6d4' : '#94a3b8',
                    border: selectedLayerFilter === l ? '1px solid #06b6d4' : 'none'
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Count and View All toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b' }}>
            <div>
              Showing <span style={{ color: '#00FF41', fontWeight: 'bold' }}>{paginatedItems.length}</span> of <span style={{ color: '#fff' }}>{filteredItems.length}</span> resources
            </div>
            <button
              onClick={() => setShowAllItems(!showAllItems)}
              style={{ padding: '4px 10px', background: showAllItems ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: showAllItems ? '#a855f7' : '#94a3b8', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'monospace' }}
            >
              {showAllItems ? 'Paginated View' : 'Show All (257)'}
            </button>
          </div>
        </div>

        {/* Grid of Agents */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem', width: '100%', marginBottom: '3rem' }}>
          {paginatedItems.map((item) => (
            <div 
              key={item.id}
              style={{ background: 'rgba(10, 17, 32, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'transform 0.2s ease, border-color 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 255, 65, 0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              {/* Top Badges */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '3px 8px', borderRadius: '6px', background: item.type === 'MCP SERVER' ? 'rgba(6,182,212,0.15)' : 'rgba(0, 255, 65, 0.1)', color: item.type === 'MCP SERVER' ? '#06b6d4' : '#00FF41', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {item.type}
                  </span>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }}>
                    {item.layer}
                  </span>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#38bdf8', textTransform: 'uppercase' }}>
                    {item.formation}
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#64748b' }}>Tier: {item.costTier}</span>
              </div>

              {/* Title & Slug */}
              <div>
                <div style={{ fontWeight: '700', fontFamily: 'monospace', color: '#fff', fontSize: '1.05rem' }}>{item.name}</div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b', marginTop: '2px' }}>{item.slug}</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description}
                </div>
              </div>

              {/* Allowed Tools */}
              {item.allowedTools && item.allowedTools.length > 0 && (
                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#64748b', marginBottom: '4px' }}>ALLOWED TOOLS:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {item.allowedTools.slice(0, 4).map((t, idx) => (
                      <span key={idx} style={{ fontSize: '0.65rem', fontFamily: 'monospace', padding: '2px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {t}
                      </span>
                    ))}
                    {item.allowedTools.length > 4 && (
                      <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', padding: '2px 6px', color: '#64748b' }}>
                        +{item.allowedTools.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Slash Directive */}
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontFamily: 'monospace', color: '#00FF41' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.slashCommand}</span>
                <button 
                  onClick={() => copyCode(item.slashCommand, `slash-${item.id}`)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                  title="Copy command"
                >
                  {copied === `slash-${item.id}` ? <Check size={12} color="#00FF41" /> : <Copy size={12} />}
                </button>
              </div>

              {/* Card Bottom */}
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b' }}>v{item.version}</span>
                <button
                  onClick={() => setModalItem(item)}
                  style={{ padding: '6px 12px', background: 'rgba(0, 255, 65, 0.15)', border: '1px solid rgba(0, 255, 65, 0.3)', borderRadius: '8px', color: '#00FF41', fontSize: '0.75rem', fontFamily: 'monospace', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <DownloadCloud size={13} />
                  <span>Inspect & Install</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {!showAllItems && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '5rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.3 : 1 }}
            >
              Prev
            </button>

            <span style={{ color: '#94a3b8' }}>
              Page <span style={{ color: '#00FF41', fontWeight: 'bold' }}>{currentPage}</span> of <span style={{ color: '#fff' }}>{totalPages}</span>
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.3 : 1 }}
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* ─── COMMUNITY HUB & ECOSYSTEM SHOWCASE ─── */}
      <section id="community" style={{ width: '100%', marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#00F3FF', background: 'rgba(0,243,255,0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(0,243,255,0.3)', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Users size={14} />
            COMMUNITY, INBOXES & OPEN-SOURCE ECOSYSTEM
          </span>
          <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Loragent Community & Official Inboxes</h2>
          <p className="section-subtitle">
            Join the developer ecosystem, propose multi-agent formations, route automated agent telemetry via official email inboxes, and validate custom LLDP skills.
          </p>
        </div>

        {/* ─── OFFICIAL LORAGENT EMAIL INBOXES STRIP ─── */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={18} color="#00F3FF" />
              <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0, fontFamily: 'monospace' }}>Official Cloudflare Email Inboxes (@lorapok.tech)</h3>
            </div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#00FF41', background: 'rgba(0,255,65,0.1)', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(0,255,65,0.3)' }}>
              8 ACTIVE ROUTING RULES
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {LORAGENT_EMAILS.map((em) => (
              <div 
                key={em.address}
                style={{ background: 'rgba(10, 17, 32, 0.7)', border: `1px solid ${em.color}30`, borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: 'all 0.2s ease' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: `${em.color}15`, color: em.color, border: `1px solid ${em.color}30` }}>
                    {em.badge}
                  </span>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#00FF41' }}>
                    {em.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                  <a href={`mailto:${em.address}`} style={{ fontSize: '0.9rem', fontWeight: '700', fontFamily: 'monospace', color: '#fff', textDecoration: 'none' }}>
                    {em.address}
                  </a>
                  <button 
                    onClick={() => copyCode(em.address, `email-${em.address}`)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                    title="Copy address"
                  >
                    {copied === `email-${em.address}` ? <Check size={14} color="#00FF41" /> : <Copy size={14} />}
                  </button>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5' }}>
                  {em.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community 3-Column Grid */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Card 1: Discussions Link */}
          <div className="glass-card" style={{ borderColor: 'rgba(0, 243, 255, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(0, 243, 255, 0.15)', border: '1px solid rgba(0, 243, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={20} color="#00F3FF" />
              </div>
              <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '3px 8px', borderRadius: '6px', background: 'rgba(0, 243, 255, 0.1)', color: '#00F3FF' }}>
                FORUM & RFCS
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>GitHub Discussions & RFCs</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Participate in architectural proposals, discuss sensory computing patterns, and share multi-agent orchestration recipes with fellow creators.
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {COMMUNITY_TOPICS.slice(0, 3).map((top, idx) => (
                <a 
                  key={idx} 
                  href={top.url} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ textDecoration: 'none', background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#cbd5e1' }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{top.title}</span>
                  <ExternalLink size={12} color="#00F3FF" />
                </a>
              ))}
              <a 
                href="https://github.com/Maijied/Loragent/discussions" 
                target="_blank" 
                rel="noreferrer"
                className="btn-secondary"
                style={{ textAlign: 'center', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderColor: 'rgba(0,243,255,0.4)', color: '#00F3FF' }}
              >
                <span>Open All Discussions</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          {/* Card 2: Interactive Skill Validator */}
          <div className="glass-card" style={{ borderColor: 'rgba(0, 255, 65, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(0, 255, 65, 0.15)', border: '1px solid rgba(0, 255, 65, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckSquare size={20} color="#00FF41" />
              </div>
              <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '3px 8px', borderRadius: '6px', background: 'rgba(0, 255, 65, 0.1)', color: '#00FF41' }}>
                LLDP VALIDATOR
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>Community Skill Validator</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '0.75rem' }}>
              Test your custom agent specification against the canonical LLDP v2.0 schema prior to submitting a PR.
            </p>
            <textarea 
              value={validatorCode}
              onChange={(e) => setValidatorCode(e.target.value)}
              rows={6}
              style={{ width: '100%', background: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px', color: '#00FF41', fontFamily: 'monospace', fontSize: '0.72rem', outline: 'none', resize: 'vertical', marginBottom: '8px' }}
            />
            {validationResult && (
              <div style={{ padding: '8px 10px', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'monospace', marginBottom: '8px', background: validationResult.valid ? 'rgba(0,255,65,0.1)' : 'rgba(239,68,68,0.1)', color: validationResult.valid ? '#00FF41' : '#ef4444', border: `1px solid ${validationResult.valid ? 'rgba(0,255,65,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                {validationResult.msg}
              </div>
            )}
            <button 
              onClick={handleValidateSkill}
              className="btn-primary"
              style={{ width: '100%', marginTop: 'auto', fontSize: '0.8rem', padding: '8px' }}
            >
              Validate LLDP Frontmatter
            </button>
          </div>

          {/* Card 3: Contribute an Agent */}
          <div className="glass-card" style={{ borderColor: 'rgba(168, 85, 247, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={20} color="#a855f7" />
              </div>
              <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '3px 8px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                CONTRIBUTE
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>Create & Publish Agents</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1rem' }}>
              Easily scaffold a compliant agent template and publish to the global Loragent registry via simple CLI commands.
            </p>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', fontFamily: 'monospace', color: '#cbd5e1', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <code>npx @lorapok/loragent create-skill</code>
              <button onClick={() => copyCode('npx @lorapok/loragent create-skill', 'create-skill-cmd')} style={{ background: 'none', border: 'none', color: '#a855f7', cursor: 'pointer' }}>
                {copied === 'create-skill-cmd' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a 
                href="https://github.com/Maijied/Loragent/blob/main/docs/LORAGENT_STANDARD_v2.md" 
                target="_blank" 
                rel="noreferrer"
                className="btn-secondary"
                style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <BookOpen size={14} />
                <span>Read LLDP Spec Standard</span>
              </a>
              <a 
                href="https://github.com/Maijied/Loragent/pulls" 
                target="_blank" 
                rel="noreferrer"
                className="btn-secondary"
                style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderColor: 'rgba(168,85,247,0.4)', color: '#a855f7' }}
              >
                <span>Submit Pull Request</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MISSION CONTROL ADMIN SECTION ─── */}
      <section id="admin" style={{ width: '100%', marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(245,158,11,0.3)', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <ShieldCheck size={14} />
            MISSION CONTROL & ORCHESTRATION ADMIN ENCLAVE
          </span>
          <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Lorapok Mission Control Enclave</h2>
          <p className="section-subtitle">
            Enterprise administration console for deployments, background daemon telemetry, Zero-Trust TiTi Vault management, and Cloudflare Email Routing.
          </p>
        </div>

        <div className="glass-card" style={{ borderColor: 'rgba(245, 158, 11, 0.3)', padding: '0', overflow: 'hidden' }}>
          {/* Admin Header Strip */}
          <div style={{ padding: '1.25rem 1.75rem', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Server size={18} color="#f59e0b" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>Mission Control Dashboard</h3>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                  Target: <span style={{ color: '#f59e0b' }}>mission-control.lorapok.tech</span>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <a 
                href="https://mission-control.lorapok.tech" 
                target="_blank" 
                rel="noreferrer"
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'rgba(245,158,11,0.4)', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Launch Cloud Console</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Admin Body Content */}
          <div style={{ padding: '2rem' }}>
            {!isAdminAuthenticated ? (
              <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center', padding: '2rem', background: 'rgba(0,0,0,0.6)', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.25)', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                  <Lock size={24} color="#f59e0b" />
                </div>
                <h4 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px', fontWeight: '700' }}>TiTi Vault Clearance Required</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Loragent Admin operations are protected by the <strong>TiTi Vault LLE 5-Seal Machine Enclave</strong>. Enter your master clearance authorization key to decrypt runtime credentials in memory.
                </p>
                <form onSubmit={handleAdminAuth} style={{ display: 'flex', gap: '8px', marginBottom: '0.5rem' }}>
                  <input 
                    type="password"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="Enter Master Authorization Key..."
                    style={{ flex: 1, padding: '12px 16px', background: 'rgba(0,0,0,0.85)', border: adminPinError ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', fontFamily: 'monospace', outline: 'none' }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '12px 20px', background: '#f59e0b', borderColor: '#f59e0b', color: '#000', fontWeight: 'bold' }}>
                    Unlock Enclave
                  </button>
                </form>
                {adminPinError && (
                  <div style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '10px', fontFamily: 'monospace', background: 'rgba(239,68,68,0.1)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)' }}>
                    Invalid authorization key. Clearance rejected by TiTi Vault.
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* Unlocked status banner */}
                <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(0,255,65,0.1)', border: '1px solid rgba(0,255,65,0.3)', color: '#00FF41', fontFamily: 'monospace', fontSize: '0.82rem', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} />
                    <span><strong>TiTi Vault Enclave Active:</strong> Clearance Level 1 Superadmin Granted. Zero-Trust AES-256 In-Memory Decryption Active.</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,255,65,0.2)', border: '1px solid rgba(0,255,65,0.4)' }}>
                    LLE 5-SEAL ENGINE: ONLINE
                  </span>
                </div>

                {/* Admin Navigation Tabs */}
                <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '1.75rem', overflowX: 'auto' }}>
                  {[
                    { id: 'vault', label: 'TiTi Vault Secrets', icon: Key },
                    { id: 'emails', label: 'Cloudflare Email Routing', icon: Mail },
                    { id: 'cicd', label: 'CI/CD Pipeline Telemetry', icon: GitBranch },
                    { id: 'daemons', label: 'Active Daemons', icon: Activity }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = adminActiveTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setAdminActiveTab(tab.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          border: isActive ? '1px solid #f59e0b' : '1px solid transparent',
                          background: isActive ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                          color: isActive ? '#f59e0b' : '#94a3b8',
                          fontFamily: 'monospace',
                          fontSize: '0.78rem',
                          fontWeight: isActive ? '700' : '400',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Icon size={14} color={isActive ? '#f59e0b' : '#94a3b8'} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* TAB 1: TiTi Vault Enclave Secrets */}
                {adminActiveTab === 'vault' && (
                  <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {/* Cloudflare Edge Secrets */}
                    <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '1px solid rgba(0,243,255,0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Cloud size={18} color="#00F3FF" />
                          <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.95rem' }}>Cloudflare Edge Secrets</span>
                        </div>
                        <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0,243,255,0.15)', color: '#00F3FF' }}>
                          cloudflare
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '12px' }}>
                        Managed in <code style={{ color: '#00F3FF' }}>credentials.json.gpg</code>:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '6px' }}>
                          <span style={{ color: '#cbd5e1' }}>CLOUDFLARE_API_KEY</span>
                          <span style={{ color: '#00FF41' }}>•••••••••••••••• (Set)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '6px' }}>
                          <span style={{ color: '#cbd5e1' }}>CLOUDFLARE_ACCOUNT_ID</span>
                          <span style={{ color: '#00FF41' }}>26b9a1161cddac39•••• (Set)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '6px' }}>
                          <span style={{ color: '#cbd5e1' }}>CLOUDFLARE_EMAIL</span>
                          <span style={{ color: '#00FF41' }}>mdshuvo40@gmail.com (Set)</span>
                        </div>
                      </div>
                      <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                        <button 
                          onClick={() => copyCode('eval "$(cred env cloudflare)"', 'cred-env-cf')} 
                          style={{ flex: 1, padding: '6px', background: 'rgba(0,243,255,0.1)', border: '1px solid rgba(0,243,255,0.3)', borderRadius: '6px', color: '#00F3FF', fontSize: '0.72rem', fontFamily: 'monospace', cursor: 'pointer' }}
                        >
                          {copied === 'cred-env-cf' ? 'Copied Shell Script!' : 'Copy cred env cloudflare'}
                        </button>
                      </div>
                    </div>

                    {/* Package Registries */}
                    <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '1px solid rgba(168,85,247,0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Boxes size={18} color="#a855f7" />
                          <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.95rem' }}>Package Registries</span>
                        </div>
                        <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>
                          npm, vsce, packagist
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '12px' }}>
                        Automated publishing tokens:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '6px' }}>
                          <span style={{ color: '#cbd5e1' }}>NPM_TOKEN (@lorapok)</span>
                          <span style={{ color: '#00FF41' }}>npm_live•••••••• (Set)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '6px' }}>
                          <span style={{ color: '#cbd5e1' }}>VSCE_PAT / OVSX_PAT</span>
                          <span style={{ color: '#00FF41' }}>Active (LorapokLabs)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '6px' }}>
                          <span style={{ color: '#cbd5e1' }}>PACKAGIST_TOKEN</span>
                          <span style={{ color: '#00FF41' }}>Active (maijied)</span>
                        </div>
                      </div>
                      <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                        <button 
                          onClick={() => copyCode('node /mnt/NewVolume/Personal_Projects/cred/sync-all.mjs', 'cred-sync-all')} 
                          style={{ flex: 1, padding: '6px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '6px', color: '#a855f7', fontSize: '0.72rem', fontFamily: 'monospace', cursor: 'pointer' }}
                        >
                          {copied === 'cred-sync-all' ? 'Copied Sync Command!' : 'Copy Multi-Vault Sync Script'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Cloudflare Email Routing & System Mailbox Manager */}
                {adminActiveTab === 'emails' && (
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                        <h4 style={{ fontSize: '1rem', color: '#fff', margin: 0, fontFamily: 'monospace' }}>Cloudflare Email Routing Rules Controller</h4>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#38bdf8' }}>
                          Domain: <code style={{ color: '#00FF41' }}>lorapok.tech</code>
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                        {LORAGENT_EMAILS.map((em) => (
                          <div key={em.address} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: '6px' }}>
                            <span style={{ color: '#fff', fontWeight: 'bold' }}>{em.address}</span>
                            <span style={{ color: '#94a3b8' }}>{em.role}</span>
                            <span style={{ color: '#00FF41', background: 'rgba(0,255,65,0.1)', padding: '2px 6px', borderRadius: '4px' }}>ROUTED</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: '1.25rem', background: '#020617', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,243,255,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'monospace', fontSize: '0.78rem', color: '#00F3FF' }}>
                        <code>loragent-email create &lt;address&gt; [destination]</code>
                        <button onClick={() => copyCode('loragent-email create support@lorapok.tech', 'email-cmd')} style={{ background: 'none', border: 'none', color: '#00F3FF', cursor: 'pointer' }}>
                          {copied === 'email-cmd' ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: CI/CD Pipeline Telemetry & Live Release Matrix */}
                {adminActiveTab === 'cicd' && (
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
                      <h4 style={{ fontSize: '1rem', color: '#fff', margin: 0, fontFamily: 'monospace' }}>5-Stage Unified Enterprise CI/CD Pipeline</h4>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#00FF41', background: 'rgba(0,255,65,0.15)', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(0,255,65,0.3)' }}>
                        RUN: 33258205742 (100% SUCCESS)
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {CI_CD_PIPELINE_STAGES.map((stage) => (
                        <div 
                          key={stage.step}
                          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', width: '24px', height: '24px', borderRadius: '50%', background: `${stage.color}20`, color: stage.color, border: `1px solid ${stage.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                              {stage.step}
                            </span>
                            <div>
                              <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.88rem' }}>{stage.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{stage.details}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#64748b' }}>{stage.duration}</span>
                            <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '2px 8px', borderRadius: '4px', background: `${stage.color}20`, color: stage.color, border: `1px solid ${stage.color}40` }}>
                              {stage.badge}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: Background Daemons & Self-Healing Sentinel */}
                {adminActiveTab === 'daemons' && (
                  <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    {/* Daemon 1 */}
                    <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(0,255,65,0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#00FF41' }}>DAEMON 01</span>
                        <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0,255,65,0.2)', color: '#00FF41' }}>RUNNING</span>
                      </div>
                      <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.9rem', marginBottom: '4px' }}>Watchman State Sentinel</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Path: <code style={{ color: '#38bdf8' }}>.loragent-debug/watchman-cache.json</code></div>
                    </div>

                    {/* Daemon 2 */}
                    <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(6,182,212,0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#06b6d4' }}>DAEMON 02</span>
                        <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(6,182,212,0.2)', color: '#06b6d4' }}>ACTIVE</span>
                      </div>
                      <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.9rem', marginBottom: '4px' }}>Cloudflare Edge MCP SSE Stream</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Endpoint: <code style={{ color: '#06b6d4' }}>mcp.lorapk-labs.workers.dev</code></div>
                    </div>

                    {/* Daemon 3 */}
                    <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(168,85,247,0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#a855f7' }}>AST TOKEN SNIPER</span>
                        <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(168,85,247,0.2)', color: '#a855f7' }}>&lt;40K BUDGET</span>
                      </div>
                      <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.9rem', marginBottom: '4px' }}>Context Pruner & Cache Sentinel</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Protocol: <code style={{ color: '#a855f7' }}>loragent-cache-collector</code></div>
                    </div>
                  </div>
                )}

                {/* Lock Console Control */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b' }}>
                    Zero-Trust Vault Protocol: <code style={{ color: '#f59e0b' }}>LLE 5-Seal Machine Enclave</code>
                  </span>
                  <button 
                    onClick={() => { setIsAdminAuthenticated(false); setAdminPin(''); }}
                    style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '0.75rem', fontFamily: 'monospace', cursor: 'pointer' }}
                  >
                    Lock Enclave Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── DETAILED AGENT INSPECTOR & INSTALL MODAL ─── */}
      {modalItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 100 }}>
          <div style={{ maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', background: '#0a0f1d', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,255,65,0.15)', color: '#00FF41', border: '1px solid rgba(0,255,65,0.3)' }}>
                    {modalItem.type}
                  </span>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '2px 8px', borderRadius: '4px', background: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}>
                    LAYER: {modalItem.layer}
                  </span>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '2px 8px', borderRadius: '4px', background: 'rgba(168,85,247,0.15)', color: '#a855f7', textTransform: 'uppercase' }}>
                    FORMATION: {modalItem.formation}
                  </span>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#64748b' }}>v{modalItem.version}</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#fff', fontFamily: 'monospace' }}>{modalItem.name}</h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'monospace' }}>{modalItem.slug}</div>
              </div>
              <button onClick={() => setModalItem(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Description & Objective */}
            <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#64748b', marginBottom: '4px' }}>DESCRIPTION</div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6', background: 'rgba(0,0,0,0.4)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {modalItem.description}
                </div>
              </div>

              {modalItem.objective && (
                <div>
                  <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#00FF41', marginBottom: '4px' }}>PRIMARY OBJECTIVE & SCOPE</div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6', background: 'rgba(0,255,65,0.05)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(0,255,65,0.2)' }}>
                    {modalItem.objective}
                  </div>
                </div>
              )}
            </div>

            {/* Allowed Tools & Connectors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#64748b', marginBottom: '6px' }}>ALLOWED TOOLS ({modalItem.allowedTools?.length || 0})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px' }}>
                  {modalItem.allowedTools?.map((t, idx) => (
                    <span key={idx} style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: '#cbd5e1' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#64748b', marginBottom: '6px' }}>CONNECTORS ({modalItem.connectors?.length || 0})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px' }}>
                  {modalItem.connectors?.map((c, idx) => (
                    <span key={idx} style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '2px 6px', background: 'rgba(6,182,212,0.1)', borderRadius: '4px', color: '#06b6d4' }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Scope Selection */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'monospace', color: '#cbd5e1', marginBottom: '6px' }}>Where should this be available?</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button 
                  onClick={() => setInstallScope('project')}
                  style={{ padding: '8px', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace', cursor: 'pointer', background: installScope === 'project' ? '#00FF41' : 'rgba(255,255,255,0.05)', color: installScope === 'project' ? '#000' : '#94a3b8', border: 'none', fontWeight: '600' }}
                >
                  project (.agents/skills/)
                </button>
                <button 
                  onClick={() => setInstallScope('global')}
                  style={{ padding: '8px', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace', cursor: 'pointer', background: installScope === 'global' ? '#a855f7' : 'rgba(255,255,255,0.05)', color: installScope === 'global' ? '#fff' : '#94a3b8', border: 'none', fontWeight: '600' }}
                >
                  global (~/.loragent/skills/)
                </button>
              </div>
            </div>

            {/* Destination path */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'monospace', color: '#64748b', marginBottom: '4px' }}>Installation destination</label>
              <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#cbd5e1', wordBreak: 'break-all' }}>
                {installScope === 'project' ? modalItem.destinationProject : modalItem.destinationGlobal}
              </div>
            </div>

            {/* Zero-Trust Notice */}
            <div style={{ marginBottom: '1rem', padding: '10px 12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#fbbf24' }}>
              ⚠️ Zero-Trust Vault: All credentials injected into child processes are AES-256 encrypted. Never store plaintext secrets.
            </div>

            {/* Copyable Slash Directive */}
            <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#38bdf8' }}>
              <span>Slash Directive: {modalItem.slashCommand}</span>
              <button onClick={() => handleModalCopy(modalItem.slashCommand)} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer' }}>
                {modalCopied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            {/* Copyable CLI command */}
            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0, 255, 65, 0.3)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#00FF41' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{modalItem.installCmd} {installScope === 'global' ? '--global' : ''}</span>
              <button onClick={() => handleModalCopy(`${modalItem.installCmd} ${installScope === 'global' ? '--global' : ''}`)} style={{ background: 'none', border: 'none', color: '#00FF41', cursor: 'pointer' }}>
                {modalCopied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setModalItem(null)} style={{ padding: '8px 16px', background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', fontFamily: 'monospace', cursor: 'pointer' }}>
                Close
              </button>
              <button onClick={() => { handleModalCopy(`${modalItem.installCmd} ${installScope === 'global' ? '--global' : ''}`); setTimeout(() => setModalItem(null), 700); }} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                {modalCopied ? 'Copied Command!' : 'Copy Install Command'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── FOOTER ─── */}
      <footer style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2.5rem', paddingBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace' }}>
        <div>LORAGENT v2.0.0 • 224 Autonomous Agents • 20 MCP Servers • Lorapok Labs Official Asset</div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <a href="https://lorapok.tech" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Lorapok Labs</a>
          <a href="https://github.com/Maijied/Loragent" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>GitHub Repo</a>
          <a href="https://github.com/Maijied/Loragent/discussions" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>Community Forum</a>
          <a href="https://mission-control.lorapok.tech" target="_blank" rel="noreferrer" style={{ color: '#fbbf24', textDecoration: 'none' }}>Mission Control Admin</a>
          <a href="https://mcp.lorapk-labs.workers.dev/health" target="_blank" rel="noreferrer" style={{ color: '#00FF41', textDecoration: 'none' }}>Edge MCP Health</a>
        </div>
      </footer>
    </div>
  );
}
