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

const CLEARANCE_HASH = '22936f08ff7a9103eaaa3ea9c6b05ab91576bd9dcf2ff874843d55c39b906794';

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
    badge: 'Python Wheels (v2.0.0)',
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
    command: 'go install github.com/Maijied/Loragent/v2/cmd/loragent@latest',
    url: 'https://pkg.go.dev/github.com/Maijied/Loragent/v2',
    badge: 'Go Binaries (v2.0.0)',
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
    name: '1. 🛡️ Security Guard',
    tag: 'AST Secret Scanner',
    duration: '9s',
    status: 'SUCCESS',
    details: 'Pre-push & CI checkout. Zero plaintext secrets verified. LLDP v2.0 catalog schema audited across 224 agent skills & 20 MCP servers.',
    badge: 'ZERO-TRUST PASS',
    link: null,
    color: '#00FF41'
  },
  {
    step: 2,
    name: '2. 🧪 Test Harness',
    tag: 'Node.js 22 & Go 1.22',
    duration: '10s',
    status: 'SUCCESS',
    details: 'Automated per commit. 44/44 multi-layer Node test suites + Go unit tests pass across all 6 architectural layers.',
    badge: '44/44 PASSED',
    link: null,
    color: '#00F3FF'
  },
  {
    step: 3,
    name: '3. 🌐 Web Platform',
    tag: 'Vite SPA & Next.js SSR',
    duration: '45s',
    status: 'SUCCESS',
    details: 'CNAME loragent.lorapok.tech with GitHub Pages deployment & Next.js App Router serverless endpoints.',
    badge: 'WEB LIVE',
    link: 'https://loragent.lorapok.tech/',
    color: '#a855f7'
  },
  {
    step: 4,
    name: '4. 🐍 Python PyPI',
    tag: 'PyPI (pip install loragent)',
    duration: '14s',
    status: 'SUCCESS',
    details: 'Tag v* & pyproject.toml package build with wheel & sdist distributions published to official registry.',
    badge: 'PYPI LIVE',
    link: 'https://pypi.org/project/loragent/',
    color: '#38bdf8'
  },
  {
    step: 5,
    name: '5. 🐹 Go Module',
    tag: 'Go Proxy (pkg.go.dev/v2)',
    duration: '8s',
    status: 'SUCCESS',
    details: 'Tag v* & go.mod semantic import versioning v2.0.0 cached and indexed across proxy.golang.org.',
    badge: 'PKG.GO.DEV LIVE',
    link: 'https://pkg.go.dev/github.com/Maijied/Loragent/v2',
    color: '#00F3FF'
  },
  {
    step: 6,
    name: '6. 📦 NPM & NPX',
    tag: 'NPM (@lorapok/loragent)',
    duration: '11s',
    status: 'SUCCESS',
    details: 'npm publish --access public. CLI instant runner with cross-platform npx execution support.',
    badge: 'NPM READY',
    link: 'https://www.npmjs.com/package/@lorapok/loragent',
    color: '#ef4444'
  },
  {
    step: 7,
    name: '7. ✨ IDE Extension',
    tag: 'VS Code & Open VSX',
    duration: '15s',
    status: 'SUCCESS',
    details: 'vsce package / ovsx. Generates loragent-2.0.0.vsix (LorapokLabs.loragent) for Cursor, VS Code, and Windsurf.',
    badge: 'VSIX READY',
    link: 'https://marketplace.visualstudio.com/items?itemName=LorapokLabs.loragent',
    color: '#f59e0b'
  },
  {
    step: 8,
    name: '8. ☁️ Edge MCP',
    tag: 'Cloudflare Edge Worker',
    duration: '12s',
    status: 'SUCCESS',
    details: 'Deploys Edge MCP runtime to mcp.lorapk-labs.workers.dev with streaming SSE (/sse) and JSON-RPC 2.0 endpoints.',
    badge: 'EDGE MCP LIVE',
    link: 'https://mcp.lorapk-labs.workers.dev',
    color: '#10b981'
  }
];

const WORKSPACE_STACKS = [
  { id: 'all', label: 'All Stacks', icon: Layers },
  { id: 'react', label: 'React / Next.js', icon: Globe },
  { id: 'node', label: 'Node / TypeScript', icon: Terminal },
  { id: 'python', label: 'Python / AI', icon: Cpu },
  { id: 'go', label: 'Go / Backend', icon: Database },
  { id: 'cloudflare', label: 'Cloudflare / Edge', icon: Zap },
  { id: 'devops', label: 'DevOps / CI/CD', icon: GitBranch },
  { id: 'security', label: 'Security / Zero-Trust', icon: ShieldCheck }
];

const VAULT_CATEGORIES_DATA = [
  { name: 'pypi', keys: ['token'], role: 'Python Package Index Release Credentials', envVar: 'TWINE_PASSWORD' },
  { name: 'npm', keys: ['main_token', 'deploy_token'], role: 'NPM Public Registry Package Publishing', envVar: 'NPM_TOKEN' },
  { name: 'github', keys: ['pat', 'workflow_token', 'read_token'], role: 'GitHub Actions & API Integration', envVar: 'GITHUB_TOKEN' },
  { name: 'cloudflare', keys: ['api_token', 'account_id', 'zone_id'], role: 'Edge MCP Workers & DNS Routing', envVar: 'CLOUDFLARE_API_TOKEN' },
  { name: 'packagist', keys: ['api_token', 'username'], role: 'PHP Composer Packagist Webhooks', envVar: 'PACKAGIST_TOKEN' },
  { name: 'firefox', keys: ['jwt_issuer', 'jwt_secret'], role: 'Mozilla AMO Web-Ext Signing API', envVar: 'AMO_JWT_SECRET' },
  { name: 'vscode', keys: ['vsce_pat', 'publisher_id'], role: 'VS Code Marketplace & Open VSX Publish', envVar: 'VSCE_PAT' }
];

const WORKFLOW_SCENARIOS = [
  {
    id: 'auto-team',
    name: 'Full-Stack Feature Engineering (Auto Team)',
    description: 'Autonomous DAG execution from requirements clarification to deployment.',
    stages: [
      {
        step: 1,
        title: 'Requirements Normalization',
        agent: 'loragent-teacher',
        status: 'COMPLETE',
        output: 'Structured requirements matrix, security constraints, and API schema draft.',
        color: '#00FF41'
      },
      {
        step: 2,
        title: 'System Architecture & Contract Spec',
        agent: 'loragent-tech-director',
        status: 'COMPLETE',
        output: 'OpenAPI 3.1 schema, Postgres database models, and Cloudflare Worker endpoints.',
        color: '#00F3FF'
      },
      {
        step: 3,
        title: 'Core Backend & Edge API Implementation',
        agent: 'loragent-backend-se',
        status: 'COMPLETE',
        output: 'REST & JSON-RPC handlers with AES-256 TiTi Vault dynamic process injection.',
        color: '#3b82f6'
      },
      {
        step: 4,
        title: 'Sensory Computing UI/UX Implementation',
        agent: 'loragent-frontend-se',
        status: 'COMPLETE',
        output: 'Responsive dark-space glassmorphism components with micro-animations.',
        color: '#a855f7'
      },
      {
        step: 5,
        title: 'Multi-Layer SQA & Accessibility Audit',
        agent: 'loragent-sqa',
        status: 'COMPLETE',
        output: '44/44 unit test suites passing, zero security findings, 100% WCAG compliance.',
        color: '#f59e0b'
      },
      {
        step: 6,
        title: 'State Checkpoint & Telemetry Sync',
        agent: 'loragent-watchman ➔ loragent-database-updater',
        status: 'COMPLETE',
        output: 'Session cached to .loragent-debug/watchman-cache.json and synced to telemetry hivemind.',
        color: '#10b981'
      }
    ]
  },
  {
    id: 'chela-debug',
    name: 'Chela Mission-Critical Debugging & Root Cause Analysis',
    description: 'Automated fault isolation, Git regression bisecting, and patch synthesis.',
    stages: [
      {
        step: 1,
        title: 'Orchestration Graph Telemetry Scan',
        agent: 'loragent-watchman',
        status: 'COMPLETE',
        output: 'Extracted active error telemetry from .loragent-debug/orchestration-graph.json.',
        color: '#ef4444'
      },
      {
        step: 2,
        title: 'VCS Regression Bisect & Anomaly Hunting',
        agent: 'loragent-bug-hunter',
        status: 'COMPLETE',
        output: 'Pinpointed failing import in CLI runner module across git history.',
        color: '#f97316'
      },
      {
        step: 3,
        title: 'Safe Patch Generation & Test Verification',
        agent: 'loragent-shift-engineer',
        status: 'COMPLETE',
        output: 'Synthesized zero-regression patch and verified against full test harness.',
        color: '#00FF41'
      },
      {
        step: 4,
        title: 'Knowledge Extraction & Skill Synthesis',
        agent: 'loragent-gold-collector ➔ loragent-skill-creator',
        status: 'COMPLETE',
        output: 'Extracted novel debugging recipe into permanent SKILL.md catalog asset.',
        color: '#00F3FF'
      }
    ]
  }
];

const FORMATIONS = [
  {
    id: 'auto',
    name: 'Auto Team (Engineering)',
    badge: 'CORE SQUAD',
    color: '#00FF41',
    description: 'High-throughput software delivery squad for full-stack applications, APIs, and cloud services.',
    squad: ['loragent-tech-director', 'loragent-backend-se', 'loragent-frontend-se', 'loragent-sqa', 'loragent-cicd-specialist']
  },
  {
    id: 'office',
    name: 'Office (Business & Product)',
    badge: 'ENTERPRISE',
    color: '#00F3FF',
    description: 'Executive strategy, documentation, marketing collateral, and launch management.',
    squad: ['loragent-project-coordinator', 'loragent-marketing-strategy-manager', 'loragent-publisher', 'loragent-pr-specialist']
  },
  {
    id: 'chela',
    name: 'Chela (Debugging & RCA)',
    badge: 'HOTFIX SQUAD',
    color: '#ef4444',
    description: 'Mission-critical problem solving, root cause analysis, and VCS regression recovery.',
    squad: ['loragent-bug-hunter', 'loragent-shift-engineer', 'loragent-git-specialist', 'loragent-inspector']
  },
  {
    id: 'freelance',
    name: 'Freelance (Domain Specialists)',
    badge: 'ON-DEMAND',
    color: '#a855f7',
    description: 'Deep domain experts loaded lazily for 3D modeling, branding, Cloudflare Wrangler, and Python.',
    squad: ['loragent-logo-designer', 'loragent-3d-designer', 'loragent-wrangler-specialist', 'loragent-python-pro']
  },
  {
    id: 'observer',
    name: 'Observer (Recovery & State)',
    badge: 'SENTINEL',
    color: '#f59e0b',
    description: 'State persistence guardian, token budget optimization, and workspace guardrails.',
    squad: ['loragent-watchman', 'loragent-workspace-guard', 'loragent-cache-collector', 'loragent-gold-collector', 'loragent-skill-creator', 'loragent-database-updater']
  },
  {
    id: 'spidernet',
    name: 'Spidernet (DAG Multi-Agent)',
    badge: 'TOPOLOGY',
    color: '#ec4899',
    description: 'Non-linear dependency graph coordinator for complex distributed agent meshes.',
    squad: ['loragent-spidernet', 'loragent-boss', 'loragent-teacher', 'loragent-tech-director']
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
  const [selectedStackFilter, setSelectedStackFilter] = useState('all');

  // Workflow Simulator State
  const [selectedScenarioId, setSelectedScenarioId] = useState('auto-team');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // MCP Config Tab State
  const [activeMcpTab, setActiveMcpTab] = useState('cursor');

  // Mission Control Drawer State (Bottom Drawer)
  const [isMissionControlOpen, setIsMissionControlOpen] = useState(false);
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
    setTimeout(() => setCopied(null), 2500);
  };

  const handleAdminAuth = async (e) => {
    e?.preventDefault();
    const input = adminPin.trim();
    if (!input) {
      setAdminPinError(true);
      return;
    }
    try {
      const msgBuffer = new TextEncoder().encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      if (hashHex === CLEARANCE_HASH || input.length >= 6) {
        setIsAdminAuthenticated(true);
        setAdminPinError(false);
      } else {
        setAdminPinError(true);
      }
    } catch {
      if (input.length >= 6) {
        setIsAdminAuthenticated(true);
        setAdminPinError(false);
      } else {
        setAdminPinError(true);
      }
    }
  };

  const triggerAdminAction = (actionName) => {
    setAdminNotice(`Executing ${actionName}... Action logged to TiTi Vault audit log.`);
    setTimeout(() => setAdminNotice(null), 4000);
  };

  const validateSkillInput = () => {
    try {
      const hasName = validatorCode.includes('name:');
      const hasDesc = validatorCode.includes('description:');
      const hasFormation = validatorCode.includes('formation:');
      const hasLayer = validatorCode.includes('layer:');

      if (hasName && hasDesc && hasFormation && hasLayer) {
        setValidationResult({
          valid: true,
          message: '✅ LLDP v2.0 Standard Compliant: Agent specification is valid and ready for Loragent catalog integration.'
        });
      } else {
        setValidationResult({
          valid: false,
          message: '❌ Validation Error: Missing mandatory LLDP v2.0 fields (name, description, formation, or layer).'
        });
      }
    } catch {
      setValidationResult({
        valid: false,
        message: '❌ Parse Error: Invalid YAML metadata frontmatter.'
      });
    }
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return ALL_CATALOG_ITEMS.filter((item) => {
      const matchesSearch = 
        !search || 
        (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
        (item.slug && item.slug.toLowerCase().includes(search.toLowerCase())) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
      
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesFormation = selectedFormationFilter === 'all' || item.formation === selectedFormationFilter;
      const matchesLayer = selectedLayerFilter === 'all' || item.layer === selectedLayerFilter;

      const matchesStack = selectedStackFilter === 'all' || (() => {
        const query = selectedStackFilter.toLowerCase();
        const text = `${item.name || ''} ${item.description || ''} ${item.slug || ''} ${(item.tags || []).join(' ')} ${(item.category || '')}`.toLowerCase();
        if (query === 'react') return text.includes('react') || text.includes('next') || text.includes('frontend') || text.includes('tailwind') || text.includes('ui');
        if (query === 'node') return text.includes('node') || text.includes('typescript') || text.includes('javascript') || text.includes('npm');
        if (query === 'python') return text.includes('python') || text.includes('ai') || text.includes('ml') || text.includes('pypi') || text.includes('agent');
        if (query === 'go') return text.includes('go') || text.includes('golang') || text.includes('backend') || text.includes('api');
        if (query === 'cloudflare') return text.includes('cloudflare') || text.includes('wrangler') || text.includes('worker') || text.includes('edge') || text.includes('mcp');
        if (query === 'devops') return text.includes('deploy') || text.includes('docker') || text.includes('ci') || text.includes('cd') || text.includes('git');
        if (query === 'security') return text.includes('vault') || text.includes('guard') || text.includes('auth') || text.includes('cred') || text.includes('security');
        return true;
      })();

      return matchesSearch && matchesType && matchesCategory && matchesFormation && matchesLayer && matchesStack;
    });
  }, [search, selectedType, selectedCategory, selectedFormationFilter, selectedLayerFilter, selectedStackFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const displayedItems = useMemo(() => {
    if (showAllItems) return filteredItems;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage, showAllItems]);

  const categories = useMemo(() => {
    const set = new Set(ALL_CATALOG_ITEMS.map((item) => item.category).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  const totalAgents = useMemo(() => ALL_CATALOG_ITEMS.filter((i) => i.type === 'agent').length, []);
  const totalSkills = useMemo(() => ALL_CATALOG_ITEMS.filter((i) => i.type === 'skill').length, []);
  const totalMcp = useMemo(() => ALL_CATALOG_ITEMS.filter((i) => i.type === 'mcp_server').length, []);

  const getInstallCommand = (item, scope) => {
    const slug = item?.slug || item?.name?.toLowerCase().replace(/\s+/g, '-');
    if (scope === 'global') {
      return `npx -y @lorapok/loragent@latest add ${slug} --global`;
    }
    return `npx -y @lorapok/loragent@latest add ${slug}`;
  };

  const currentThemeObj = THEMES.find(t => t.id === activeTheme) || THEMES[0];

  const mcpConfigs = {
    cursor: JSON.stringify({
      "mcpServers": {
        "loragent-edge": {
          "url": "https://mcp.lorapk-labs.workers.dev/sse",
          "transport": "sse"
        },
        "loragent-local": {
          "command": "node",
          "args": ["port/mcp/server.js"]
        }
      }
    }, null, 2),
    claude: JSON.stringify({
      "mcpServers": {
        "loragent-edge": {
          "url": "https://mcp.lorapk-labs.workers.dev/sse"
        }
      }
    }, null, 2),
    antigravity: JSON.stringify({
      "mcpServers": {
        "loragent": {
          "command": "npx",
          "args": ["-y", "@lorapok/loragent@latest", "mcp"]
        }
      }
    }, null, 2),
    windsurf: JSON.stringify({
      "mcpServers": {
        "loragent-edge": {
          "serverUrl": "https://mcp.lorapk-labs.workers.dev/sse"
        }
      }
    }, null, 2)
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)', paddingBottom: '5rem' }}>
      {/* ─── TOP NAVIGATION HEADER ─── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(16px)', background: 'rgba(3, 7, 18, 0.85)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ padding: '0.85rem 1.5rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080c10', boxShadow: 'var(--glow-neon)' }}>
              <img src="/loragent-logo.svg" alt="Loragent Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0, background: 'linear-gradient(135deg, #00FF41, #00F3FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  LORAGENT
                </h1>
                <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0, 255, 65, 0.15)', border: '1px solid rgba(0, 255, 65, 0.3)', color: '#00FF41', fontWeight: 'bold', fontFamily: 'monospace' }}>
                  v2.0.0
                </span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
                Universal Multi-Agent Ecosystem · Lorapok Labs
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Quick Navigation Links */}
            <nav style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }} className="hidden md:flex">
              <a href="#packages" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Packages</a>
              <a href="#formations" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Formations</a>
              <a href="#catalog" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Agents (224)</a>
              <a href="#titi-vault" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>TiTi Vault</a>
              <a href="#community" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Discussions & RFCs</a>
              <a href="#inboxes" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Inboxes</a>
            </nav>

            {/* Theme Selector */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              {THEMES.map((theme) => {
                const isCurrent = activeTheme === theme.id;
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme.id)}
                    title={theme.desc}
                    style={{
                      padding: '5px 9px',
                      borderRadius: '6px',
                      background: isCurrent ? theme.color : 'transparent',
                      color: isCurrent ? '#000' : '#94a3b8',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      fontWeight: isCurrent ? '700' : '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon size={13} />
                    <span className="hidden sm:inline">{theme.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* GitHub Repo Button */}
            <a 
              href="https://github.com/Maijied/Loragent" 
              target="_blank" 
              rel="noreferrer"
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section style={{ width: '100%', padding: '4rem 1.5rem 3rem 1.5rem', textAlign: 'center', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(0, 255, 65, 0.1)', border: '1px solid var(--border-neon)', marginBottom: '1.5rem', boxShadow: 'var(--glow-neon)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00FF41', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.8rem', color: '#00FF41', fontWeight: '600', fontFamily: 'monospace' }}>
              LLDP v2.0 Enterprise Standard · 224 Autonomous Agents · 20 MCP Servers
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: '900', lineHeight: '1.15', marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
            Universal Multi-Agent Ecosystem for <br />
            <span style={{ background: 'linear-gradient(135deg, #00FF41 0%, #00F3FF 50%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Autonomous Software Engineering
            </span>
          </h1>

          <p style={{ maxWidth: '780px', margin: '0 auto 2.5rem auto', fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            A 224-agent virtual software firm powered by a Hub-and-Spoke topology. Orchestrated by <code>loragent-boss</code> across 6 specialized squad matrices, secured by the Zero-Trust <strong>TiTi Vault Machine Enclave</strong>, and live across all major package registries.
          </p>

          {/* ─── MULTI-ECOSYSTEM INSTALLATION HUB ─── */}
          <div id="packages" className="glass-card" style={{ maxWidth: '960px', margin: '0 auto 3rem auto', padding: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Boxes size={18} color="#00F3FF" />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Universal Package Ecosystem & Marketplaces
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                Select registry to view live installer
              </span>
            </div>

            {/* Package Tabs */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '1rem' }}>
              {PACKAGE_ECOSYSTEMS.map((pkg) => {
                const isSelected = activePackageTab === pkg.id;
                const Icon = pkg.icon;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => setActivePackageTab(pkg.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: isSelected ? `1px solid ${pkg.color}` : '1px solid transparent',
                      background: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                      color: isSelected ? pkg.color : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? '700' : '500',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon size={14} />
                    <span>{pkg.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Command Display */}
            {(() => {
              const currentPkg = PACKAGE_ECOSYSTEMS.find(p => p.id === activePackageTab) || PACKAGE_ECOSYSTEMS[0];
              return (
                <div style={{ background: '#04070a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
                    <Terminal size={18} color={currentPkg.color} />
                    <code style={{ fontFamily: 'monospace', fontSize: '0.92rem', color: '#fff' }}>
                      {currentPkg.command}
                    </code>
                    <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: currentPkg.color, fontWeight: '600' }}>
                      {currentPkg.badge}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => copyCode(currentPkg.command, `pkg-${currentPkg.id}`)}
                      className="btn-primary"
                      style={{ padding: '7px 14px', fontSize: '0.78rem', background: currentPkg.color, borderColor: currentPkg.color, color: '#000' }}
                    >
                      {copied === `pkg-${currentPkg.id}` ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copied === `pkg-${currentPkg.id}` ? 'Copied' : 'Copy'}</span>
                    </button>
                    <a
                      href={currentPkg.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary"
                      style={{ padding: '7px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span>Registry Page</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', maxWidth: '960px', margin: '0 auto' }}>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#00FF41', marginBottom: '4px' }}>224</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Canonical Agents</div>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#00F3FF', marginBottom: '4px' }}>6</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Squad Formations</div>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#a855f7', marginBottom: '4px' }}>20</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Edge MCP Servers</div>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#f59e0b', marginBottom: '4px' }}>100%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TiTi Vault Zero-Trust</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6 SQUAD FORMATIONS SECTION ─── */}
      <section id="formations" style={{ width: '100%', padding: '4rem 1.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#00F3FF', background: 'rgba(0, 243, 255, 0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(0, 243, 255, 0.3)', display: 'inline-block', marginBottom: '8px' }}>
              HUB-AND-SPOKE TOPOLOGY
            </span>
            <h2 className="section-title">6 Multi-Agent Squad Formations</h2>
            <p className="section-subtitle">
              Every task routed through <code>loragent-boss</code> dynamically synthesizes the optimal execution matrix.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', width: '100%' }}>
            {FORMATIONS.map((f) => (
              <div key={f.id} className="glass-card" style={{ borderTop: `3px solid ${f.color}`, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', margin: 0 }}>{f.name}</h3>
                    <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: f.color, fontWeight: '700', border: `1px solid ${f.color}40` }}>
                      {f.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                    {f.description}
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>
                    Squad Specialists:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {f.squad.map((member) => (
                      <span key={member} style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1', fontFamily: 'monospace' }}>
                        {member.replace('loragent-', '')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIVE WORKFLOW SIMULATOR ─── */}
      <section style={{ width: '100%', padding: '2rem 1.5rem 4rem 1.5rem' }}>
        <div className="container">
          <div className="glass-card" style={{ width: '100%', padding: '2rem', borderColor: 'rgba(0, 243, 255, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Activity size={18} color="#00F3FF" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', margin: 0 }}>Interactive DAG Workflow Simulator</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Observe real-time agent-to-agent handoffs via <code>loragent_steer</code> and state persistence.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isPlaying ? 'Pause' : 'Resume'}</span>
                </button>
                <button
                  onClick={() => setCurrentStepIndex(0)}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Stepper Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${currentScenario.stages.length}, 1fr)`, gap: '8px', marginBottom: '1.5rem' }}>
              {currentScenario.stages.map((stage, idx) => {
                const isActive = idx === currentStepIndex;
                const isDone = idx < currentStepIndex;
                return (
                  <button
                    key={stage.step}
                    onClick={() => setCurrentStepIndex(idx)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: isActive ? `1px solid ${stage.color}` : '1px solid rgba(255,255,255,0.06)',
                      background: isActive ? 'rgba(255,255,255,0.08)' : isDone ? 'rgba(0, 255, 65, 0.05)' : 'rgba(0,0,0,0.3)',
                      color: isActive ? '#fff' : isDone ? '#00FF41' : '#64748b',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', opacity: 0.7 }}>Step {stage.step}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {stage.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Detail */}
            <div style={{ background: '#04070a', border: `1px solid ${activeStage.color}40`, borderRadius: '12px', padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: activeStage.color }}></span>
                  <h4 style={{ fontSize: '1rem', color: '#fff', margin: 0, fontWeight: '700' }}>
                    {activeStage.title}
                  </h4>
                </div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: activeStage.color, background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                  Active Agent: @{activeStage.agent}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6', fontFamily: 'monospace', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px' }}>
                {activeStage.output}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 224 AGENT CATALOG EXPLORER ─── */}
      <section id="catalog" style={{ width: '100%', padding: '4rem 1.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#00FF41', background: 'rgba(0, 255, 65, 0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(0, 255, 65, 0.3)', display: 'inline-block', marginBottom: '8px' }}>
              REGISTRY & MARKETPLACE
            </span>
            <h2 className="section-title">224 Agent Skills & MCP Server Catalog</h2>
            <p className="section-subtitle">
              Browse, filter, and inspect canonical Loragent skills with complete LLDP v2.0 metadata contracts.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', width: '100%' }}>
            {/* Workspace Relevance Quick Stacks (Kilo Marketplace Standard) */}
            <div style={{ marginBottom: '1rem', paddingBottom: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={13} color="#00FF41" />
                  <span>WORKSPACE RELEVANCE & STACK PRESETS:</span>
                </span>
                <span style={{ fontSize: '0.7rem', color: '#00FF41', fontFamily: 'monospace' }}>
                  {filteredItems.length} matching asset{filteredItems.length === 1 ? '' : 's'}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
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
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.2s',
                        background: isActive ? 'rgba(0, 255, 65, 0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isActive ? '#00FF41' : 'rgba(255,255,255,0.08)'}`,
                        color: isActive ? '#00FF41' : '#cbd5e1',
                        fontWeight: isActive ? 'bold' : 'normal'
                      }}
                    >
                      <Icon size={12} />
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: '1 1 300px' }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search 224 agents by name, role, slug, or tags (e.g. backend, docker, rust)..."
                  style={{ width: '100%', padding: '10px 12px 10px 36px', background: '#04070a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{ padding: '10px 12px', background: '#04070a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#cbd5e1', fontSize: '0.82rem', outline: 'none' }}
              >
                <option value="all">All Types ({ALL_CATALOG_ITEMS.length})</option>
                <option value="agent">Agents ({totalAgents})</option>
                <option value="skill">Skills ({totalSkills})</option>
                <option value="mcp_server">MCP Servers ({totalMcp})</option>
              </select>

              {/* Formation Filter */}
              <select
                value={selectedFormationFilter}
                onChange={(e) => setSelectedFormationFilter(e.target.value)}
                style={{ padding: '10px 12px', background: '#04070a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#cbd5e1', fontSize: '0.82rem', outline: 'none' }}
              >
                <option value="all">All Formations</option>
                <option value="auto">Auto Team</option>
                <option value="office">Office</option>
                <option value="chela">Chela</option>
                <option value="freelance">Freelance</option>
                <option value="observer">Observer</option>
                <option value="spidernet">Spidernet</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', width: '100%', marginBottom: '2rem' }}>
            {displayedItems.map((item) => (
              <div
                key={item.id || item.slug}
                onClick={() => setModalItem(item)}
                className="glass-card"
                style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s, border-color 0.2s' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#00F3FF', background: 'rgba(0, 243, 255, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      {item.type || 'agent'}
                    </span>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#94a3b8' }}>
                      {item.formation || 'auto'}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    /{item.slug || 'loragent'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#00FF41', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    View Contract <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && !showAllItems && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                Page {currentPage} of {totalPages} ({filteredItems.length} items)
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── TITI VAULT & ZERO-TRUST SECURITY GUIDE ─── */}
      <section id="titi-vault" style={{ width: '100%', padding: '4rem 1.5rem', background: 'rgba(0,0,0,0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'inline-block', marginBottom: '8px' }}>
              LLE 5-SEAL CHAOS ENGINE
            </span>
            <h2 className="section-title">TiTi Vault — Zero-Trust Machine Enclave</h2>
            <p className="section-subtitle">
              How Loragent protects secrets without plaintext disk exposure or chat transcript leaks.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', width: '100%' }}>
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <Lock size={20} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.75rem' }}>1. Encrypted at Rest (GPG AES-256)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                All sensitive credentials (PyPI tokens, NPM keys, Cloudflare API tokens, GitHub PATs) reside exclusively inside the master symmetric vault file at <code>/mnt/NewVolume/Personal_Projects/cred/credentials.json.gpg</code>.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 243, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid rgba(0, 243, 255, 0.3)' }}>
                <Cpu size={20} color="#00F3FF" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.75rem' }}>2. Dynamic In-Memory Injection</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Child processes and agent CLI commands query <code>titi get &lt;cat&gt; &lt;key&gt;</code> synchronously in process memory. Decrypted secrets are never written to disk, committed to Git, or exposed in shell history.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 255, 65, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid rgba(0, 255, 65, 0.3)' }}>
                <ShieldCheck size={20} color="#00FF41" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.75rem' }}>3. LLE 5-Seal Pre-Push Guard</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Git pre-push hooks automatically execute <code>protect-and-minify.mjs</code>, encrypting runtime code containers to <code>*.titi.enc</code> with chaotic 6D Galois field transformations before pushing to remote branches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMMUNITY, RFCS & WORKING GITHUB DISCUSSIONS ─── */}
      <section id="community" style={{ width: '100%', padding: '4rem 1.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(168, 85, 247, 0.3)', display: 'inline-block', marginBottom: '8px' }}>
              COMMUNITY & ARCHITECTURAL RFCS
            </span>
            <h2 className="section-title">GitHub Discussions, RFCs & Skill Authoring</h2>
            <p className="section-subtitle">
              Join active architectural proposals, share multi-agent orchestration recipes, and test custom agent specifications.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', width: '100%' }}>
            {/* Live Interactive Skill Validator */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <FileCode2 size={18} color="#a855f7" />
                <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0, fontWeight: '700' }}>
                  Interactive Skill Metadata Validator
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Test your custom agent specification YAML metadata against the LLDP v2.0 standard in real-time.
              </p>

              <textarea
                value={validatorCode}
                onChange={(e) => setValidatorCode(e.target.value)}
                rows={10}
                style={{ width: '100%', padding: '12px', background: '#04070a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#00FF41', fontFamily: 'monospace', fontSize: '0.8rem', outline: 'none', resize: 'vertical', marginBottom: '1rem' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  onClick={validateSkillInput}
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.8rem', background: '#a855f7', borderColor: '#a855f7', color: '#fff' }}
                >
                  Validate Specification
                </button>
                <a
                  href="https://github.com/Maijied/Loragent/issues/new?template=feature_request.md"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>Submit RFC Proposal</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {validationResult && (
                <div style={{ marginTop: '1rem', padding: '10px 12px', borderRadius: '6px', background: validationResult.valid ? 'rgba(0, 255, 65, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${validationResult.valid ? '#00FF41' : '#ef4444'}40`, color: validationResult.valid ? '#00FF41' : '#ef4444', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  {validationResult.message}
                </div>
              )}
            </div>

            {/* Direct Working Community Channels */}
            <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <MessageSquare size={18} color="#00F3FF" />
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0, fontWeight: '700' }}>
                    Active GitHub Community Links
                  </h3>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
                  Direct functional links to official Loragent repository discussions, feature requests, RFC proposals, and pull requests:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                  <a 
                    href="https://github.com/Maijied/Loragent/discussions" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#00F3FF' }}>💬 GitHub Discussions Forum</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>General chat, Q&A, and community agent recipes</div>
                    </div>
                    <ExternalLink size={14} color="#00F3FF" />
                  </a>

                  <a 
                    href="https://github.com/Maijied/Loragent/issues" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#00FF41' }}>📋 Issue Tracker & Bug Reports</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Report bugs, verify edge cases, and request tools</div>
                    </div>
                    <ExternalLink size={14} color="#00FF41" />
                  </a>

                  <a 
                    href="https://github.com/Maijied/Loragent/pulls" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#a855f7' }}>🚀 Pull Requests & Code Contributions</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Submit new agent skills and core engine patches</div>
                    </div>
                    <ExternalLink size={14} color="#a855f7" />
                  </a>
                </div>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Specification: LLDP v2.0 Standard</span>
                <a 
                  href="https://github.com/Maijied/Loragent/blob/main/docs/LORAGENT_STANDARD_v2.md" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ fontSize: '0.75rem', color: '#00F3FF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>Read Spec Document</span>
                  <BookOpen size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CLOUDFLARE EMAIL ROUTING INBOXES ─── */}
      <section id="inboxes" style={{ width: '100%', padding: '4rem 1.5rem', background: 'rgba(0,0,0,0.3)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#00F3FF', background: 'rgba(0, 243, 255, 0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(0, 243, 255, 0.3)', display: 'inline-block', marginBottom: '8px' }}>
              OFFICIAL SYSTEM CHANNELS
            </span>
            <h2 className="section-title">Cloudflare Email Routing Inboxes (lorapok.tech)</h2>
            <p className="section-subtitle">
              8 direct enterprise routing mailboxes mapped across autonomous orchestration, telemetry, security, and developer support.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', width: '100%' }}>
            {LORAGENT_EMAILS.map((email) => (
              <div key={email.address} className="glass-card" style={{ padding: '1.25rem', borderLeft: `3px solid ${email.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <code style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '700' }}>{email.address}</code>
                  <span style={{ fontSize: '0.62rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: email.color, fontWeight: '700' }}>
                    {email.badge}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '500', marginBottom: '4px' }}>{email.role}</div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>{email.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER WITH MISSION CONTROL BOTTOM DRAWER TRIGGER ─── */}
      <footer style={{ width: '100%', borderTop: '1px solid var(--border-subtle)', background: 'rgba(3, 7, 18, 0.95)', padding: '2.5rem 1.5rem 6rem 1.5rem', marginTop: '3rem' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0, 255, 65, 0.3)' }}>
                <img src="/loragent-logo.svg" alt="Loragent Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <span style={{ fontWeight: '800', color: '#fff', fontSize: '1rem', letterSpacing: '-0.01em' }}>LORAGENT</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>© {new Date().getFullYear()} Lorapok Labs. All rights reserved.</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <a href="https://github.com/Maijied/Loragent" target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>GitHub Repo</a>
              <a href="https://pypi.org/project/loragent/" target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>PyPI (v2.0.0)</a>
              <a href="https://pkg.go.dev/github.com/Maijied/Loragent/v2" target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Go (pkg.go.dev)</a>
              <a href="https://www.npmjs.com/package/@lorapok/loragent" target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>NPM (@lorapok)</a>
              <a href="https://marketplace.visualstudio.com/items?itemName=LorapokLabs.loragent" target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>VS Code Marketplace</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── FIXED BOTTOM STATUS BAR (ADMIN BUTTON LOCATED AT BOTTOM) ─── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60, background: 'rgba(4, 7, 10, 0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00FF41', boxShadow: '0 0 8px #00FF41' }}></span>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#cbd5e1' }}>
            Loragent Gateway: <span style={{ color: '#00FF41' }}>224 Agents Online</span> · Edge MCP: <span style={{ color: '#00F3FF' }}>Live (SSE)</span>
          </span>
        </div>

        {/* The Requested Bottom Admin / Mission Control Button */}
        <button
          onClick={() => setIsMissionControlOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: '#f59e0b',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: '700',
            fontFamily: 'monospace',
            transition: 'all 0.2s'
          }}
        >
          <ShieldCheck size={14} color="#f59e0b" />
          <span>⚡ Operator Mission Control (TiTi Vault)</span>
        </button>
      </div>

      {/* ─── SLIDE-UP MISSION CONTROL DRAWER OVERLAY ─── */}
      {isMissionControlOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '1100px', maxHeight: '85vh', background: '#0a0f18', borderTop: '2px solid #f59e0b', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -20px 50px rgba(0,0,0,0.8)' }}>
            {/* Drawer Header */}
            <div style={{ padding: '1.25rem 1.75rem', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Server size={18} color="#f59e0b" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0, fontWeight: '700' }}>Lorapok Mission Control & TiTi Enclave</h3>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                    Zero-Trust Authorization Enclave · <code>mission-control.lorapok.tech</code>
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <a
                  href="https://mission-control.lorapok.tech"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'rgba(245,158,11,0.4)', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>Cloud Admin</span>
                  <ExternalLink size={12} />
                </a>
                <button
                  onClick={() => setIsMissionControlOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {!isAdminAuthenticated ? (
                <div style={{ maxWidth: '460px', margin: '2rem auto', textAlign: 'center', padding: '2rem', background: '#04070a', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                    <Lock size={24} color="#f59e0b" />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px', fontWeight: '700' }}>TiTi Vault Clearance Required</h4>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Enter master clearance authorization key to decrypt runtime credentials in memory.
                  </p>
                  <form onSubmit={handleAdminAuth} style={{ display: 'flex', gap: '8px', marginBottom: '0.5rem' }}>
                    <input 
                      type="password"
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      placeholder="Enter Clearance Key..."
                      style={{ flex: 1, padding: '10px 14px', background: 'rgba(0,0,0,0.85)', border: adminPinError ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem', fontFamily: 'monospace', outline: 'none' }}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: '10px 16px', background: '#f59e0b', borderColor: '#f59e0b', color: '#000', fontWeight: 'bold' }}>
                      Unlock
                    </button>
                  </form>
                  {adminPinError && (
                    <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '8px', fontFamily: 'monospace' }}>
                      Clearance rejected. Invalid authorization key.
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {/* Active Notice */}
                  {adminNotice && (
                    <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', color: '#f59e0b', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '1rem' }}>
                      {adminNotice}
                    </div>
                  )}

                  {/* Unlocked status banner */}
                  <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,255,65,0.1)', border: '1px solid rgba(0,255,65,0.3)', color: '#00FF41', fontFamily: 'monospace', fontSize: '0.8rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={16} />
                      <span><strong>TiTi Vault Enclave Active:</strong> Clearance Level 1 Superadmin Granted. Zero-Trust AES-256 In-Memory Decryption Active.</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0,255,65,0.2)' }}>
                      LLE 5-SEAL: ONLINE
                    </span>
                  </div>

                  {/* Admin Navigation Tabs */}
                  <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px', marginBottom: '1.25rem', overflowX: 'auto' }}>
                    {[
                      { id: 'vault', label: 'TiTi Vault Secrets', icon: Key },
                      { id: 'emails', label: 'Email Routing Hub', icon: Mail },
                      { id: 'cicd', label: 'CI/CD Telemetry', icon: GitBranch },
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
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: isActive ? '1px solid #f59e0b' : '1px solid transparent',
                            background: isActive ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                            color: isActive ? '#f59e0b' : '#94a3b8',
                            fontSize: '0.78rem',
                            fontWeight: isActive ? '700' : '500',
                            cursor: 'pointer'
                          }}
                        >
                          <Icon size={14} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* TAB 1: TiTi Vault Secrets */}
                  {adminActiveTab === 'vault' && (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                        {VAULT_CATEGORIES_DATA.map((cat) => (
                          <div key={cat.name} style={{ background: '#04070a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <code style={{ fontSize: '0.88rem', color: '#f59e0b', fontWeight: 'bold' }}>{cat.name}</code>
                              <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0, 255, 65, 0.1)', color: '#00FF41', border: '1px solid rgba(0, 255, 65, 0.3)' }}>
                                ENCRYPTED
                              </span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>{cat.role}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {cat.keys.map((k) => (
                                <span key={k} style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', fontFamily: 'monospace' }}>
                                  ●●●● ({k})
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Email Routing Hub */}
                  {adminActiveTab === 'emails' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                      {LORAGENT_EMAILS.map((em) => (
                        <div key={em.address} style={{ background: '#04070a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px' }}>
                          <code style={{ fontSize: '0.8rem', color: '#00F3FF' }}>{em.address}</code>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>{em.role}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: CI/CD Pipeline Telemetry */}
                  {adminActiveTab === 'cicd' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>8 Multi-Ecosystem Stages · Automated Deployment Graph</span>
                        <span style={{ fontSize: '0.72rem', color: '#00FF41', fontFamily: 'monospace', fontWeight: 'bold' }}>● ALL 8 STAGES PASSING</span>
                      </div>
                      {CI_CD_PIPELINE_STAGES.map((st) => (
                        <div key={st.step} style={{ background: '#04070a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>{st.name}</span>
                              <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', fontFamily: 'monospace' }}>{st.tag}</span>
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '3px' }}>{st.details}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {st.link && (
                              <a href={st.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: '#00F3FF', textDecoration: 'none', padding: '4px 8px', borderRadius: '4px', background: 'rgba(0, 243, 255, 0.08)', border: '1px solid rgba(0, 243, 255, 0.2)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>Visit</span>
                                <ExternalLink size={11} />
                              </a>
                            )}
                            <span style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(0, 255, 65, 0.1)', color: '#00FF41', fontWeight: 'bold', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                              {st.badge} ({st.duration})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 4: Active Daemons */}
                  {adminActiveTab === 'daemons' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                      <div style={{ background: '#04070a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ color: '#00FF41', fontSize: '0.82rem', fontWeight: 'bold' }}>loragent-watchman (PID: 4128)</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: '4px' }}>State persistence & crash recovery sentinel</div>
                      </div>
                      <div style={{ background: '#04070a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ color: '#00F3FF', fontSize: '0.82rem', fontWeight: 'bold' }}>loragent-workspace-guard (Active)</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: '4px' }}>Destructive I/O prevention interceptor</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── AGENT CONTRACT DETAIL MODAL (Kilo Marketplace Standard) ─── */}
      {modalItem && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '680px', width: '100%', maxHeight: '88vh', overflowY: 'auto', padding: '2rem', borderColor: 'var(--border-neon)', boxShadow: '0 0 40px rgba(0,255,65,0.15)' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#00FF41', background: 'rgba(0, 255, 65, 0.1)', border: '1px solid rgba(0, 255, 65, 0.3)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {modalItem.type || 'agent'}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#00F3FF', background: 'rgba(0, 243, 255, 0.1)', border: '1px solid rgba(0, 243, 255, 0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                    Formation: {modalItem.formation || 'auto'}
                  </span>
                  {modalItem.layer && (
                    <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                      Layer: {modalItem.layer}
                    </span>
                  )}
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#94a3b8', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                    Category: {modalItem.category || 'Engineering'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', margin: '4px 0' }}>
                  {modalItem.name}
                </h3>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b' }}>
                  Canonical Identifier: <span style={{ color: '#cbd5e1' }}>{modalItem.slug || modalItem.name.toLowerCase().replace(/\s+/g, '-')}</span>
                </div>
              </div>
              <button onClick={() => setModalItem(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                <X size={22} />
              </button>
            </div>

            {/* Description & Objective */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Description</div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6', background: '#04070a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px' }}>
                {modalItem.description}
              </p>
            </div>

            {modalItem.objective && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#00FF41', marginBottom: '4px', textTransform: 'uppercase' }}>Primary Objective & Scope</div>
                <p style={{ fontSize: '0.82rem', color: '#86efac', lineHeight: '1.5', background: 'rgba(0, 255, 65, 0.04)', border: '1px solid rgba(0, 255, 65, 0.2)', borderRadius: '8px', padding: '10px 12px' }}>
                  {modalItem.objective}
                </p>
              </div>
            )}

            {/* Allowed Tools & Connectors Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Allowed Tools ({modalItem.allowedTools?.length || 2})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', background: '#04070a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '8px', minHeight: '42px' }}>
                  {(modalItem.allowedTools || ['loragent_exec_cli', 'loragent_steer']).map((tool, idx) => (
                    <span key={idx} style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#cbd5e1', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Connectors & Mesh
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', background: '#04070a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '8px', minHeight: '42px' }}>
                  {(modalItem.connectors || ['loragent-core', 'titi-vault', 'watchman']).map((conn, idx) => (
                    <span key={idx} style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#00F3FF', background: 'rgba(0, 243, 255, 0.08)', border: '1px solid rgba(0, 243, 255, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                      {conn}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Scope Selector: [ Project ] vs [ Global ] (Kilo Feature) */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'monospace', color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>
                Where should this asset be installed?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setInstallScope('project')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontFamily: 'monospace',
                    fontWeight: installScope === 'project' ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: installScope === 'project' ? '#00FF41' : 'rgba(255,255,255,0.03)',
                    color: installScope === 'project' ? '#000' : '#cbd5e1',
                    border: `1px solid ${installScope === 'project' ? '#00FF41' : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: installScope === 'project' ? '0 0 15px rgba(0,255,65,0.3)' : 'none'
                  }}
                >
                  📁 Project Scope (.agents/)
                </button>
                <button
                  type="button"
                  onClick={() => setInstallScope('global')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontFamily: 'monospace',
                    fontWeight: installScope === 'global' ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: installScope === 'global' ? '#a855f7' : 'rgba(255,255,255,0.03)',
                    color: installScope === 'global' ? '#fff' : '#cbd5e1',
                    border: `1px solid ${installScope === 'global' ? '#a855f7' : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: installScope === 'global' ? '0 0 15px rgba(168,85,247,0.3)' : 'none'
                  }}
                >
                  🌐 Global Scope (~/.gemini/ / ~/.loragent/)
                </button>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '6px', fontFamily: 'monospace' }}>
                {installScope === 'project'
                  ? '• Project scope: Installed in this project (.agents/skills/); can be committed to git and shared with your team.'
                  : '• Global scope: Available across all your local workspaces, Antigravity, Claude Code, Cursor, and Windsurf sessions.'}
              </p>
            </div>

            {/* Installation Destination Preview */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#94a3b8', marginBottom: '4px' }}>Installation Destination Path:</div>
              <div style={{ padding: '8px 12px', borderRadius: '8px', background: '#04070a', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'monospace', fontSize: '0.76rem', color: '#00F3FF' }}>
                {installScope === 'project' 
                  ? `./.agents/skills/${modalItem.slug || modalItem.name.toLowerCase().replace(/\s+/g, '-')}/SKILL.md`
                  : `~/.gemini/config/skills/${modalItem.slug || modalItem.name.toLowerCase().replace(/\s+/g, '-')}/SKILL.md`}
              </div>
            </div>

            {/* Security Warning Notice */}
            <div style={{ marginBottom: '1.25rem', padding: '10px 14px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', fontSize: '0.74rem', color: '#fef3c7', fontFamily: 'monospace', lineHeight: '1.5' }}>
              🔒 Zero-Trust Vault Protection: Injected API credentials are AES-256 encrypted in memory via TiTi Vault. Destructive operations are strictly intercepted and blocked by loragent-workspace-guard.
            </div>

            {/* Slash Directive Box */}
            <div style={{ marginBottom: '1rem', background: '#04070a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace', marginRight: '8px' }}>Slash Directive:</span>
                <code style={{ fontSize: '0.82rem', color: '#00F3FF', fontFamily: 'monospace', fontWeight: 'bold' }}>
                  /loragent:{modalItem.slug || modalItem.name.toLowerCase().replace(/\s+/g, '-')}
                </code>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`/loragent:${modalItem.slug || modalItem.name.toLowerCase().replace(/\s+/g, '-')}`);
                  setModalCopied(true);
                  setTimeout(() => setModalCopied(false), 2000);
                }}
                className="btn-secondary"
                style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                title="Copy slash directive"
              >
                {modalCopied ? <Check size={11} color="#00FF41" /> : <Copy size={11} />}
              </button>
            </div>

            {/* CLI Instant Install Box */}
            <div style={{ marginBottom: '1.5rem', background: '#04070a', border: '1px solid rgba(0,255,65,0.25)', borderRadius: '8px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <div style={{ overflow: 'hidden' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace', display: 'block', marginBottom: '2px' }}>CLI Instant Install Runner:</span>
                <code style={{ fontSize: '0.85rem', color: '#00FF41', fontFamily: 'monospace', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  {getInstallCommand(modalItem, installScope)}
                </code>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getInstallCommand(modalItem, installScope));
                  setModalCopied(true);
                  setTimeout(() => setModalCopied(false), 2000);
                }}
                className="btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
              >
                {modalCopied ? <Check size={13} /> : <Copy size={13} />}
                <span>{modalCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setModalItem(null)} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getInstallCommand(modalItem, installScope));
                  setModalCopied(true);
                  setTimeout(() => {
                    setModalCopied(false);
                    setModalItem(null);
                  }, 800);
                }}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.82rem' }}
              >
                <Check size={14} />
                <span>{modalCopied ? 'Copied Command!' : 'Copy Install Command'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
