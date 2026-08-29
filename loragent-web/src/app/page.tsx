'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Terminal, Shield, Cpu, Cloud, Globe, Lock, Play, Pause, CheckCircle2, 
  Copy, Check, Sparkles, Layers, Search, Server, RefreshCw, Zap,
  ChevronRight, ChevronLeft, ExternalLink, Code2, Database, Workflow, Radio,
  Activity, Eye, Box, AlertCircle, ArrowUpRight, GitBranch, Key,
  FileCode, Laptop, Compass, BookOpen, UserCheck, ShieldAlert,
  ShoppingBag, Sliders, CheckSquare, Square, DownloadCloud, Info,
  CheckCircle, ArrowRight, X, Filter, Share2, CornerDownRight,
  FastForward, RotateCcw, Monitor, Send, CpuIcon, CheckCheck
} from 'lucide-react';

import allAgentsData from '@/data/all-agents.json';

// Categories matching Open Agent Skills & 224-agent ecosystem
const MARKET_CATEGORIES = allAgentsData.categories;
const ALL_CATALOG_ITEMS = allAgentsData.items;

const RESOURCE_TYPES = [
  { id: 'all', label: 'All Resources', count: allAgentsData.total },
  { id: 'AGENT', label: 'Agents (224)', count: allAgentsData.totalAgents },
  { id: 'MCP SERVER', label: 'MCP Servers (20)', count: allAgentsData.totalMcp },
  { id: 'FORMATION', label: 'Formations (6)', count: allAgentsData.totalFormations }
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

const WORKFLOW_SCENARIOS = [
  {
    id: 'auto-team',
    name: 'Auto Team: Full-Stack Feature',
    command: '/loragent:boss auto',
    badge: 'Engineering Pipeline',
    color: 'emerald',
    description: 'Autonomous development of a multi-tenant auth system from architecture to verified CI/CD release.',
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
        color: '#06b6d4'
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
        agent: 'loragent-workspace-guard ➔ Secure Vault',
        role: 'Security & Enclave',
        action: 'Workspace Guard approves safe read/write; Vault decrypts AES-256 tokens into in-memory child process',
        protocol: 'Machine AES-256 Enclave (Zero Plaintext Secrets)',
        telemetry: 'VAULT_AUTH: pin_status="VERIFIED", injected=["DATABASE_URL", "JWT_SECRET"], leaks_scanned=0',
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
        action: 'Runs 40/40 test suites, executes security linters, validates SSG bundle and fires pre-deploy hook',
        protocol: 'Lifecycle Hook: pre_git_commit & pre_deploy_verify',
        telemetry: 'SQA_RUN: tests_passed=40, failed=0, code_coverage="100%", gate="APPROVED"',
        badge: 'VERIFICATION',
        color: '#10b981'
      },
      {
        step: 7,
        title: 'State Checkpointing & Hivemind Learning',
        agent: 'loragent-watchman ➔ loragent-gold-collector',
        role: 'State Sentinel & Collective Memory',
        action: 'Watchman caches state to .loragent-debug/watchman-cache.json; Gold Collector scrubs PII and syncs to Firebase',
        protocol: 'Lifecycle Hook: post_agent_task + Firebase Hivemind Sync',
        telemetry: 'WATCHMAN_SAVE: graph_updated=true, idea_extracted="jwt-refresh-pattern", hivemind="SYNCED"',
        badge: 'SENTINEL',
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
        color: '#06b6d4'
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
        title: 'Regression Testing & Verification',
        agent: 'loragent-debugger ➔ loragent-sqa',
        role: 'Regression Validation',
        action: 'Executes targeted reproduction test and full 40-test regression suite',
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
        action: 'Generates structured RCA markdown detailing incident trigger, resolution, and future guards',
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
        action: 'Updates orchestration graph error matrix and syncs fix pattern to Firebase hivemind',
        protocol: 'post_agent_task + watchman checkpoint',
        telemetry: 'INCIDENT_CLOSED: state="CLEAN", active_errors=0, session_resumed=true',
        badge: 'RESOLVED',
        color: '#10b981'
      }
    ]
  },
  {
    id: 'recovery',
    name: 'Watchman: Crash Recovery Resumption',
    command: '/loragent-watchman continue',
    badge: 'State Resilience',
    color: 'purple',
    description: 'Resumes execution mid-task after token limit exhaustion, terminal crash, or network disconnect with zero data loss.',
    stages: [
      {
        step: 1,
        title: 'Token Budget / Context Threshold Alert',
        agent: 'Claude Code / AI IDE Engine',
        role: 'Context Sentinel',
        action: 'Session approaches 40k token limit or unexpected process termination occurs',
        protocol: 'token_budget_alert hook @ 90% threshold',
        telemetry: 'TOKEN_ALERT: context_tokens=38900, threshold="CRITICAL_SAVE_TRIGGERED"',
        badge: 'ALERT',
        color: '#f43f5e'
      },
      {
        step: 2,
        title: 'Automatic Ephemeral State Checkpoint',
        agent: 'loragent-watchman',
        role: 'State Preservation',
        action: 'Watchman flushes active task step, AST diffs, completed phases, and pending commands to disk',
        protocol: 'post_agent_task hook & .loragent-debug/watchman-cache.json',
        telemetry: 'CACHE_DUMP: file=".loragent-debug/watchman-cache.json", step=4, completed_pct=65%',
        badge: 'CHECKPOINT',
        color: '#a855f7'
      },
      {
        step: 3,
        title: 'Session Resumption Command',
        agent: 'Developer in New Session',
        role: 'Resumption Prompt',
        action: 'Developer launches fresh IDE chat and types "/loragent-watchman continue"',
        protocol: 'Slash Command Directive',
        telemetry: 'DIRECTIVE: cmd="/loragent-watchman continue", session_id="new-session-42"',
        badge: 'RESUME',
        color: '#00FF41'
      },
      {
        step: 4,
        title: 'Execution Graph & Checkpoint Hydration',
        agent: 'loragent-watchman',
        role: 'Graph Restorer',
        action: 'Watchman parses cached state, reconstructs active squad roster, and skips completed steps',
        protocol: 'State Machine Restoration Protocol',
        telemetry: 'GRAPH_RESTORE: restored_step=5, skipped_steps=[1,2,3,4], token_loss=0',
        badge: 'HYDRATION',
        color: '#06b6d4'
      },
      {
        step: 5,
        title: 'Selective Specialist Re-Summoning',
        agent: 'loragent-boss ➔ Target Specialist',
        role: 'Context-Optimized Summon',
        action: 'Boss summons only the single agent required for the current pending step (e.g. SQA tester)',
        protocol: 'loragent_summon_agent MCP call',
        telemetry: 'LAZY_REMOUNT: agent="loragent-sqa", memory_footprint="4.2MB", context_tokens=1800',
        badge: 'SUMMON',
        color: '#3b82f6'
      },
      {
        step: 6,
        title: 'Workflow Execution Continuation',
        agent: 'Target Specialist (SQA & DevOps)',
        role: 'Continuation',
        action: 'Executes pending tests, completes build verification, and dispatches release',
        protocol: 'loragent_steer MCP tool execution',
        telemetry: 'EXECUTION_CONTINUED: step_5="COMPLETE", step_6="COMPLETE", build="GREEN"',
        badge: 'EXECUTE',
        color: '#10b981'
      },
      {
        step: 7,
        title: 'Clean Task Finalization & State Reset',
        agent: 'loragent-watchman ➔ loragent-chorki',
        role: 'Final Verification',
        action: 'Check-done hook verifies 100% completion; watchman archives cache to historical telemetry',
        protocol: 'check_done hook & Telemetry Archival',
        telemetry: 'TASK_COMPLETE: status="100% VERIFIED", total_resumptions=1, token_saved=38000',
        badge: 'SUCCESS',
        color: '#00FF41'
      }
    ]
  }
];

// Static IDE configs & terminal directives
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
  { cmd: 'loragent discover -f react', desc: 'Deduplicated PC Asset Discovery & Quality Scoring' },
  { cmd: 'loragent analyze .', desc: 'Polyglot Stack Detection & Squad Recommender' },
  { cmd: 'loragent sync', desc: 'Universal 8-IDE Sync (MCPs, Rules, Modes)' },
  { cmd: '/loragent:boss auto', desc: 'Auto Team Full-Stack Engineering Squad' },
  { cmd: '/loragent:boss chela', desc: 'Chela Mission-Critical Bug Hunting' },
  { cmd: '/loragent-watchman continue', desc: 'Resume Session from Ephemeral Cache' }
];

export default function Home() {
  const [activeFormation, setActiveFormation] = useState('orchestrator');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormationFilter, setSelectedFormationFilter] = useState('all');
  const [selectedLayerFilter, setSelectedLayerFilter] = useState('all');
  const [relevantOnly, setRelevantOnly] = useState(false);
  const [selectedIDE, setSelectedIDE] = useState('cursor');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Pagination & Display Mode
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(24);
  const [showAllItems, setShowAllItems] = useState(false);
  
  // Interactive Modal State (Matching Kilo Marketplace Screenshot)
  const [installModalItem, setInstallModalItem] = useState<any | null>(null);
  const [installScope, setInstallScope] = useState<'project' | 'global'>('project');
  const [installMethod, setInstallMethod] = useState('NPX');
  const [modalCopied, setModalCopied] = useState(false);

  // Animated Workflow Simulator State
  const [selectedScenarioId, setSelectedScenarioId] = useState('auto-team');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlayingWorkflow, setIsPlayingWorkflow] = useState(true);
  const [playSpeed, setPlaySpeed] = useState(1);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'workflow' | 'marketplace' | 'formations' | 'terminal' | 'vault' | 'ide'>('workflow');

  // Terminal Simulator State
  const [simCommand, setSimCommand] = useState('loragent discover -f react');
  const [simRunning, setSimRunning] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([
    '⚡ Loragent Core Sentinel initialized [v2.0.0-PROPOSAL]',
    '🔒 Zero-Trust Vault: Connected via Machine AES-256 (PIN Protected)',
    '🌐 Cloudflare Edge Registry: 250 Items Synchronized (224 Agents, 20 MCP Servers, 6 Formations)',
    'Ready for directive. Select a command or click "Run Directive" below.'
  ]);

  // PIN Demo State
  const [enteredPin, setEnteredPin] = useState('');
  const [pinStatus, setPinStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const currentScenario = useMemo(() => {
    return WORKFLOW_SCENARIOS.find((s) => s.id === selectedScenarioId) || WORKFLOW_SCENARIOS[0];
  }, [selectedScenarioId]);

  const activeStage = useMemo(() => {
    return currentScenario.stages[currentStepIndex] || currentScenario.stages[0];
  }, [currentScenario, currentStepIndex]);

  // Workflow auto-player effect
  useEffect(() => {
    if (!isPlayingWorkflow) return;
    const intervalTime = 3000 / playSpeed;
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % currentScenario.stages.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [isPlayingWorkflow, currentScenario, playSpeed]);

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
      if (simCommand.includes('discover')) {
        setSimLogs((prev) => [
          ...prev,
          '🔍 [FACE] Running Intelligent PC Asset Discovery & Deduplication...',
          '📍 Scanned Locations: 12 root directories across OS',
          '📦 Total Raw Files Scanned: 4,349 skills & agents',
          '✨ Unique Canonical Skills: 25 distinct capabilities (Filtered by keyword "react")',
          '🗑️ Redundant Clones Filtered: 3,105 duplicates collapsed',
          '⭐ Top Skill: react-specialist [Q:71/100] (+3 clones filtered)',
          '⭐ Top Skill: react-best-practices [Q:61/100] (+1 clones filtered)',
          '✅ Deduplicated clean inventory saved to registry/pc-inventory.json'
        ]);
      } else if (simCommand.includes('analyze')) {
        setSimLogs((prev) => [
          ...prev,
          '🔍 [FACE] Analyzing project at: .',
          '💻 Languages Detected: JavaScript, TypeScript',
          '📦 Frameworks Detected: React, Next.js, Tailwind CSS',
          '🛡️ Recommended Formation Squad: Auto-Team Matrix',
          '🤖 Recommended Autonomous Squad: loragent-boss, loragent-tech-director, loragent-workspace-guard, loragent-frontend-se',
          '✅ Ready! Run "loragent sync" to bind squad to workspace.'
        ]);
      } else if (simCommand.includes('sync')) {
        setSimLogs((prev) => [
          ...prev,
          '🔄 [FACE] Starting Universal Loragent IDE Sync...',
          '✅ Synced MCP configs to: Cursor, Antigravity, Claude, Windsurf, VS Code, Cline, Roo Code',
          '✅ Synced 177 canonical agents into master roster: ~/.loragent/master-roster/skills',
          '✅ Synced 11 workspace rules to: .cursor/rules/ and .agents/rules/',
          '✅ Generated Roo Code custom modes in: .roomodes',
          '🎉 Universal AI Code Editor compatibility sync complete.'
        ]);
      } else if (simCommand.includes('auto')) {
        setSimLogs((prev) => [
          ...prev,
          '🤖 [Boss] Forming Auto Team Matrix: Tech Director, Backend SE, Frontend SE, SQA, CI/CD Specialist',
          '📐 [Tech Director] Synthesizing LLDP modular blueprint across FACE/PULSE/LORE/PORT/LOOM layers',
          '💻 [Backend SE] Implementing API routes with zero plaintext secrets',
          '🎨 [Frontend SE] Rendering sensory computing glassmorphic UI',
          '🛡️ [SQA] Executing 44/44 test suites — All Passed (0 errors)',
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

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedCategory, selectedFormationFilter, selectedLayerFilter, relevantOnly]);

  const filteredMarketplace = useMemo(() => {
    return ALL_CATALOG_ITEMS.filter((item: any) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !searchQuery ||
                          (item.name && item.name.toLowerCase().includes(q)) ||
                          (item.slug && item.slug.toLowerCase().includes(q)) ||
                          (item.description && item.description.toLowerCase().includes(q)) ||
                          (item.objective && item.objective.toLowerCase().includes(q)) ||
                          (item.allowedTools && item.allowedTools.some((t: string) => t.toLowerCase().includes(q))) ||
                          (item.tags && item.tags.some((t: string) => t.toLowerCase().includes(q)));
      
      const matchType = selectedType === 'all' || 
                        (selectedType === 'AGENT' && (item.type === 'AGENT' || item.type === 'RESIDENT AGENT' || item.type === 'SPECIALIST SKILL')) ||
                        (item.type === selectedType);

      const matchCategory = selectedCategory === 'all' || 
                            item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchFormation = selectedFormationFilter === 'all' || 
                             item.formation.toLowerCase() === selectedFormationFilter.toLowerCase();

      const matchLayer = selectedLayerFilter === 'all' || 
                         (item.layer && item.layer.toUpperCase() === selectedLayerFilter.toUpperCase());

      const matchRelevant = !relevantOnly || item.isResident || (item.connectors && item.connectors.length > 0);

      return matchSearch && matchType && matchCategory && matchFormation && matchLayer && matchRelevant;
    });
  }, [searchQuery, selectedType, selectedCategory, selectedFormationFilter, selectedLayerFilter, relevantOnly]);

  // Paginated items
  const totalPages = Math.ceil(filteredMarketplace.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    if (showAllItems) return filteredMarketplace;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMarketplace.slice(start, start + itemsPerPage);
  }, [filteredMarketplace, currentPage, itemsPerPage, showAllItems]);


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
            <img 
              src="/assets/loragent-logo-mark.svg" 
              alt="Loragent" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white font-mono">LOR<span className="text-emerald-400">AGENT</span></span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">v2.0</span>
              </div>
              <p className="text-[10px] font-mono text-neutral-400">Universal Multi-Agent Orchestration • Lorapok Labs</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
            {[
              { id: 'workflow', label: 'Animated Workflow', icon: Workflow, badge: 'LIVE' },
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
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    const el = document.getElementById(tab.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
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
                  {tab.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500 text-black font-mono font-bold rounded-full animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/api-explorer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 transition-all shadow-[0_0_20px_rgba(123,47,190,0.3)]"
            >
              <Server className="w-3.5 h-3.5 text-purple-400" />
              <span>Live MCP & API</span>
            </Link>
            <Link
              href="/wiki"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-xl bg-white/5 text-neutral-300 border border-white/10 hover:bg-white/10 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
              <span>Wiki</span>
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
              onClick={() => {
                setActiveTab('workflow');
                const el = document.getElementById('workflow-visualizer');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-medium rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]"
            >
              <Workflow className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive Workflow Visualizer</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-6xl mx-auto pt-6 border-t border-white/10">
            {[
              { label: 'Catalog Resources', value: '250+', desc: '224 Agents & 20 MCPs' },
              { label: 'Raw Skills Scanned', value: '4,349', desc: '12 OS Roots Mapped' },
              { label: 'Clones Deduplicated', value: '3,105', desc: 'Normalized & Cleaned' },
              { label: 'Squad Formations', value: '6 Squads', desc: 'Auto, Chela, Office, etc.' },
              { label: 'Quality Score', value: '98.4 / 100', desc: '7-Section LLDP Standard' },
              { label: 'Test Suites', value: '44 / 44', desc: '100% Green Across Layers' }
            ].map((stat, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <div className="text-xl font-bold font-mono text-white mb-0.5">{stat.value}</div>
                <div className="text-xs font-medium text-emerald-400 font-mono truncate">{stat.label}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5 truncate">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN DYNAMIC CONTENT TABS */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ─── 0. INTERACTIVE ANIMATED WORKFLOW VISUALIZER ─── */}
        <section id="workflow-visualizer" className="mb-24 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <Workflow className="w-4 h-4" />
                <span>INTERACTIVE MULTI-AGENT EXECUTION ENGINE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                How Loragent Works in Real-Time
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Watch how prompts flow from AI IDEs through the Boss orchestrator, Zero-Trust vault, specialized squads, and Watchman state sentinel.
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
                      : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:bg-white/10'
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
            <div className="p-6 bg-black/60 border-b border-white/10">
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                {currentScenario.stages.map((stage, idx) => {
                  const isActive = idx === currentStepIndex;
                  const isCompleted = idx < currentStepIndex;
                  return (
                    <button
                      key={stage.step}
                      onClick={() => {
                        setCurrentStepIndex(idx);
                        setIsPlayingWorkflow(false);
                      }}
                      className="flex-1 min-w-[140px] text-left group transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(0,255,65,0.6)] scale-110'
                              : isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-white/5 text-neutral-500 border border-white/5 group-hover:border-white/20 group-hover:text-neutral-300'
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4" /> : stage.step}
                        </div>
                        <div className={`h-1 flex-1 rounded-full transition-all ${
                          isCompleted ? 'bg-emerald-500/50' : isActive ? 'bg-emerald-500' : 'bg-white/10'
                        }`} />
                      </div>
                      <div className={`text-[11px] font-mono font-semibold truncate transition-colors ${
                        isActive ? 'text-emerald-300' : isCompleted ? 'text-neutral-300' : 'text-neutral-500'
                      }`}>
                        {stage.title}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-500 truncate">
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
                      STAGE {activeStage.step} OF {currentScenario.stages.length} • {activeStage.badge}
                    </span>
                    <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
                      Live Matrix
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
                    {activeStage.title}
                  </h3>

                  <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                    {activeStage.action}
                  </p>

                  {/* Active Actors Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                      <div className="text-[10px] font-mono text-neutral-500 mb-1">ACTIVE AGENT / SENDER</div>
                      <div className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        <span>{activeStage.agent}</span>
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">{activeStage.role}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                      <div className="text-[10px] font-mono text-neutral-500 mb-1">DIRECTIVE PROTOCOL</div>
                      <div className="text-sm font-bold text-cyan-300 font-mono flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        <span>{activeStage.protocol}</span>
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">Structured MCP Payload</div>
                    </div>
                  </div>
                </div>

                {/* Workflow Playback Controls */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentStepIndex((prev) => (prev === 0 ? currentScenario.stages.length - 1 : prev - 1));
                        setIsPlayingWorkflow(false);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors border border-white/10"
                      title="Previous Step"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsPlayingWorkflow(!isPlayingWorkflow)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-mono text-xs font-bold hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                    >
                      {isPlayingWorkflow ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      <span>{isPlayingWorkflow ? 'Pause Flow' : 'Auto Play'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentStepIndex((prev) => (prev + 1) % currentScenario.stages.length);
                        setIsPlayingWorkflow(false);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors border border-white/10"
                      title="Next Step"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setCurrentStepIndex(0);
                        setIsPlayingWorkflow(true);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border border-white/10"
                      title="Restart Scenario"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Playback Speed */}
                  <div className="flex items-center gap-1 font-mono text-xs text-neutral-400">
                    <span className="text-[11px] text-neutral-500 mr-1">Speed:</span>
                    {[0.5, 1, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => setPlaySpeed(s)}
                        className={`px-2 py-1 rounded-lg text-xs transition-all ${
                          playSpeed === s
                            ? 'bg-white/20 text-white font-bold'
                            : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Micro-Terminal & Real-Time Telemetry Stream */}
              <div className="lg:col-span-5 rounded-2xl bg-black/80 border border-emerald-500/30 overflow-hidden flex flex-col justify-between font-mono text-xs shadow-inner">
                
                {/* Terminal Header */}
                <div className="px-4 py-3 bg-black/90 border-b border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block"></span>
                    <span className="text-[11px] text-neutral-400 ml-2">loragent-runtime-telemetry</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 animate-pulse">
                    <Radio className="w-3 h-3" /> STREAMING
                  </span>
                </div>

                {/* Real-Time Telemetry Packet Display */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-center text-neutral-300 leading-relaxed bg-[#030604]">
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">COMMAND DIRECTIVE:</div>
                    <div className="text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30 truncate">
                      $ {currentScenario.command}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">ACTIVE PACKET PAYLOAD:</div>
                    <div className="text-xs text-cyan-300 bg-white/5 p-3 rounded-lg border border-white/10 break-all font-mono leading-relaxed">
                      {activeStage.telemetry}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-white/5">
                    <span>STATUS: <span className="text-emerald-400 font-bold">100% GREEN</span></span>
                    <span>CONTEXT LOSS: <span className="text-cyan-300 font-bold">0 TOKENS</span></span>
                  </div>
                </div>

                {/* Packet Verification Footer */}
                <div className="px-4 py-2.5 bg-black/60 border-t border-emerald-500/20 text-[10px] text-neutral-500 flex items-center justify-between">
                  <span>Zero-Trust Vault: Active (AES-256)</span>
                  <span className="text-emerald-400 font-semibold">Step {activeStage.step}/{currentScenario.stages.length} Verified</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ─── 1. 224+ AGENTS & SKILLS MARKETPLACE DIRECTORY ─── */}
        <section id="marketplace" className="mb-24 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <ShoppingBag className="w-4 h-4" />
                <span>UNIVERSAL 224+ AGENTS & TOOLS DIRECTORY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                250 Autonomous AI Resources & Specialists
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Explore every agent, open skill, and MCP connector across FACE, PULSE, LORE, PORT, LOOM, and CROSS layers.
              </p>
            </div>

            {/* Scope / Help Links */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-neutral-500">Installation Targets:</span>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">Project (.agents/skills/)</span>
              <span className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded">Global (~/.loragent/skills/)</span>
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
                  placeholder="Search all 250 resources (e.g. tech-director, docker, firebase, sqa, rust, python)..."
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
                <span>Resident & Core Only</span>
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
              {MARKET_CATEGORIES.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === c.id
                      ? 'bg-white/20 text-white font-medium border border-white/30'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] opacity-60">({c.count})</span>
                </button>
              ))}
            </div>

            {/* Secondary Filters: Formations & LLDP Layers */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-white/5 text-xs font-mono">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-neutral-500 text-[11px] whitespace-nowrap">Formation:</span>
                {['all', 'auto', 'office', 'chela', 'freelance', 'observer', 'spidernet'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFormationFilter(f)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all uppercase ${
                      selectedFormationFilter === f
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-neutral-500 text-[11px] whitespace-nowrap">Layer:</span>
                {['all', 'FACE', 'PULSE', 'LORE', 'PORT', 'LOOM', 'CROSS'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setSelectedLayerFilter(l)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                      selectedLayerFilter === l
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count & Quick Stats Bar */}
          <div className="flex items-center justify-between mb-4 px-1 text-xs font-mono text-neutral-400">
            <div>
              Showing <span className="text-emerald-400 font-semibold">{paginatedItems.length}</span> of <span className="text-white font-semibold">{filteredMarketplace.length}</span> resources matching filters
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAllItems(!showAllItems)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                  showAllItems 
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
                    : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                }`}
              >
                {showAllItems ? 'Paginated View' : 'Show All 250'}
              </button>
            </div>
          </div>

          {/* Marketplace Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedItems.map((item: any) => (
              <div
                key={item.id}
                className="group p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between hover:shadow-[0_0_25px_rgba(0,255,65,0.1)] relative"
              >
                <div>
                  {/* Card Header Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider ${
                        item.type === 'MCP SERVER' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                        item.type === 'RESIDENT AGENT' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        item.type === 'AGENT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        item.type === 'FORMATION PRESET' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {item.type}
                      </span>
                      <span className="px-1.5 py-0.5 text-[9px] font-mono bg-white/5 text-neutral-300 rounded border border-white/10">
                        {item.layer}
                      </span>
                      <span className="px-1.5 py-0.5 text-[9px] font-mono bg-white/5 text-cyan-300/80 rounded border border-white/10 uppercase">
                        {item.formation}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">Tier: {item.costTier || 'low'}</span>
                  </div>

                  {/* Title & Slug */}
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-1 font-mono">
                    {item.name}
                  </h3>
                  <div className="text-[11px] font-mono text-neutral-500 mb-2.5 truncate">
                    {item.slug}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Allowed Tools list */}
                  {item.allowedTools && item.allowedTools.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[10px] font-mono text-neutral-500 mb-1">Allowed Tools:</div>
                      <div className="flex flex-wrap gap-1">
                        {item.allowedTools.slice(0, 4).map((tool: string, idx: number) => (
                          <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 text-neutral-300 rounded border border-white/5">
                            {tool}
                          </span>
                        ))}
                        {item.allowedTools.length > 4 && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 text-neutral-500 rounded">
                            +{item.allowedTools.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Slash Command Preview */}
                  <div className="p-2 rounded-lg bg-black/50 border border-white/5 font-mono text-[11px] text-emerald-400/90 flex items-center justify-between mb-2">
                    <span className="truncate">{item.slashCommand}</span>
                    <button
                      onClick={() => handleCopy(item.slashCommand, `slash-${item.id}`)}
                      className="text-neutral-400 hover:text-white ml-1 p-0.5"
                      title="Copy slash command"
                    >
                      {copiedKey === `slash-${item.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500 truncate max-w-[120px]">
                    v{item.version} • Lorapok
                  </span>
                  <button
                    onClick={() => setInstallModalItem(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black transition-all"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>Inspect & Install</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {!showAllItems && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 font-mono text-xs">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 7 && currentPage > 4) {
                    pageNum = Math.min(totalPages - 6 + i, totalPages);
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg font-mono text-xs transition-all ${
                        currentPage === pageNum
                          ? 'bg-emerald-500 text-black font-bold'
                          : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
              >
                Next
              </button>
            </div>
          )}

          {filteredMarketplace.length === 0 && (
            <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-2xl">
              <Search className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
              <div className="text-base font-mono text-white font-semibold">No resources match your filter criteria</div>
              <p className="text-xs text-neutral-400 mt-1">Try clearing filters or searching for another keyword.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedType('all'); setSelectedCategory('all'); setSelectedFormationFilter('all'); setSelectedLayerFilter('all'); setRelevantOnly(false); }}
                className="mt-4 px-4 py-2 text-xs font-mono rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>


        {/* ─── 2. 6 FORMATION SQUAD PRESETS SECTION ─── */}
        <section id="formations" className="mb-24 scroll-mt-24">
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
                        const el = document.getElementById('terminal');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
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
        <section id="terminal" className="mb-24 scroll-mt-24">
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
        <section id="vault" className="mb-24 scroll-mt-24">
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
        <section id="ide" className="mb-24 scroll-mt-24">
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

      {/* ─── INTERACTIVE DETAILED AGENT INSPECTOR & INSTALL MODAL ─── */}
      {installModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#080d0a] border border-white/20 shadow-2xl p-6">
            
            {/* Header with Close */}
            <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {installModalItem.type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    LAYER: {installModalItem.layer}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase">
                    FORMATION: {installModalItem.formation}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">v{installModalItem.version}</span>
                </div>
                <h3 className="text-xl font-bold text-white font-mono">{installModalItem.name}</h3>
                <div className="text-xs font-mono text-neutral-400 mt-0.5">{installModalItem.slug}</div>
              </div>
              <button
                onClick={() => setInstallModalItem(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Objective */}
            <div className="mb-5 space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">Description</label>
                <p className="text-xs text-neutral-200 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5 font-mono">
                  {installModalItem.description}
                </p>
              </div>

              {installModalItem.objective && (
                <div>
                  <label className="block text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-1">Primary Objective & Scope</label>
                  <p className="text-xs text-neutral-300 leading-relaxed bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20 font-mono">
                    {installModalItem.objective}
                  </p>
                </div>
              )}
            </div>

            {/* Allowed Tools & Connectors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                  Allowed Tools ({installModalItem.allowedTools?.length || 0})
                </label>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-black/40 rounded-xl border border-white/5 min-h-[50px]">
                  {installModalItem.allowedTools?.map((t: string, idx: number) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/5">
                      {t}
                    </span>
                  )) || <span className="text-xs text-neutral-500 font-mono">Core filesystem tools</span>}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                  Connectors & Mesh ({installModalItem.connectors?.length || 0})
                </label>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-black/40 rounded-xl border border-white/5 min-h-[50px]">
                  {installModalItem.connectors?.map((c: string, idx: number) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {c}
                    </span>
                  )) || <span className="text-xs text-neutral-500 font-mono">loragent-core</span>}
                </div>
              </div>
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
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-neutral-200 truncate">
                {installScope === 'project' ? installModalItem.destinationProject : installModalItem.destinationGlobal}
              </div>
            </div>

            {/* Security Warning Box */}
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed font-mono">
              ⚠️ Zero-Trust Vault: All injected credentials (API keys, tokens) are AES-256 encrypted in-memory. Plaintext secrets are automatically blocked by loragent-workspace-guard.
            </div>

            {/* Slash Command Copy */}
            <div className="mb-3 p-3 rounded-xl bg-black/80 border border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-[11px] font-mono text-neutral-500 whitespace-nowrap">Slash Directive:</span>
                <span className="text-xs font-mono text-cyan-300 font-bold truncate">{installModalItem.slashCommand}</span>
              </div>
              <button
                onClick={() => handleModalCopy(installModalItem.slashCommand)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex-shrink-0"
                title="Copy slash command"
              >
                {modalCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* CLI Command Copy */}
            <div className="mb-6 p-3 rounded-xl bg-black/80 border border-emerald-500/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-[11px] font-mono text-neutral-500 whitespace-nowrap">CLI Install:</span>
                <span className="text-xs font-mono text-emerald-400 font-bold truncate">
                  {installModalItem.installCmd} {installScope === 'global' ? '--global' : ''}
                </span>
              </div>
              <button
                onClick={() => handleModalCopy(`${installModalItem.installCmd} ${installScope === 'global' ? '--global' : ''}`)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex-shrink-0"
                title="Copy install command"
              >
                {modalCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                onClick={() => setInstallModalItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleModalCopy(`${installModalItem.installCmd} ${installScope === 'global' ? '--global' : ''}`);
                  setTimeout(() => setInstallModalItem(null), 800);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-emerald-500 text-black hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(0,255,65,0.4)] flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{modalCopied ? 'Copied Command!' : 'Copy Install Command'}</span>
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
