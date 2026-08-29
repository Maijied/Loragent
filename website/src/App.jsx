import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, Bot, Cpu, Command, ShieldCheck, TerminalSquare, 
  Sparkles, Layers, Search, Server, Cloud, Lock, Copy, Check,
  Zap, Compass, ChevronRight, ChevronLeft, Activity, ArrowUpRight, Code2,
  RefreshCw, CheckCircle2, ShoppingBag, DownloadCloud, X, CheckCircle,
  Play, Pause, RotateCcw, Workflow, Key, ShieldAlert
} from 'lucide-react';
import './index.css';

const WORKFLOW_SCENARIOS = [
  {
    id: 'auto-team',
    name: 'Auto Team: Full-Stack Engineering',
    command: '/loragent:boss auto',
    badge: 'Engineering Pipeline',
    color: '#00FF41',
    description: 'Autonomous development of full-stack feature from architecture to verified CI/CD release.',
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
    color: '#f59e0b',
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
  }
];

const FORMATIONS = [
  {
    name: 'Boss Orchestrator Squad',
    badge: 'Supreme Router',
    lead: 'loragent-boss',
    icon: Compass,
    color: '#00FF41',
    description: 'Central routing engine. Assesses task scope, summons specialized squads via MCP, and manages cross-agent steering.',
    squad: ['loragent-boss', 'loragent-teacher', 'loragent-workspace-guard', 'loragent-watchman', 'loragent-spidernet']
  },
  {
    name: 'Auto Team Matrix',
    badge: 'Full-Stack Engineering',
    lead: 'loragent-tech-director',
    icon: Code2,
    color: '#06b6d4',
    description: 'Converts product requirements into scalable code, builds backend APIs, creates biological UIs, and runs SQA test suites.',
    squad: ['loragent-tech-director', 'loragent-backend-se', 'loragent-frontend-se', 'loragent-sqa', 'loragent-cicd-specialist']
  },
  {
    name: 'Enterprise Office Matrix',
    badge: 'Business Operations',
    lead: 'loragent-project-coordinator',
    icon: Layers,
    color: '#a855f7',
    description: 'Autonomous enterprise operations. Plans roadmaps, writes marketing copy, creates documentation, and orchestrates PR.',
    squad: ['loragent-project-coordinator', 'loragent-marketing-strategy-manager', 'loragent-publisher', 'loragent-pr-specialist']
  },
  {
    name: 'Chela Debugging Squad',
    badge: 'Zero-Guess Bug Hunting',
    lead: 'loragent-bug-hunter',
    icon: Zap,
    color: '#f59e0b',
    description: 'Parses live orchestration graph telemetry, tracks regressions, resolves Git VCS conflicts, and applies verified patches.',
    squad: ['loragent-bug-hunter', 'loragent-shift-engineer', 'loragent-git-specialist', 'loragent-inspector']
  },
  {
    name: 'Freelance Domain Isolation',
    badge: 'On-Demand Execution',
    lead: 'loragent-image-generate',
    icon: Sparkles,
    color: '#3b82f6',
    description: 'Isolated domain experts: Fal.ai/Replicate generative art, FFmpeg GIF creation, Cloudflare edge deployment, and package management.',
    squad: ['loragent-image-generate', 'loragent-gif-create', 'loragent-deploy', 'loragent-tools-install', 'loragent-wrangler-specialist']
  },
  {
    name: 'Observer & Sentinel Matrix',
    badge: 'Crash Recovery',
    lead: 'loragent-watchman',
    icon: ShieldCheck,
    color: '#f43f5e',
    description: 'State preservation and crash resumption. Continuously maintains execution checkpoints to ensure zero context or token loss.',
    squad: ['loragent-watchman', 'loragent-workspace-guard', 'loragent-cache-collector', 'loragent-gold-collector', 'loragent-skill-creator']
  }
];

const MARKETPLACE_ITEMS = [
  {
    id: 'firebase-admin',
    name: 'Firebase Admin & Firestore MCP',
    type: 'MCP SERVER',
    category: 'DATA',
    version: '2.0.0',
    description: 'Direct AI tools for managing Firestore databases, security rules, Cloud Functions, and auth tokens.',
    destinationProject: '.loragent/loragent.json',
    destinationGlobal: '~/.loragent/config.json',
    installCmd: 'npx -y @lorapok/loragent@latest add-mcp firebase-admin',
    prereqs: ['Node.js >= 18', 'Firebase CLI']
  },
  {
    id: 'loragent-boss',
    name: 'Boss Orchestrator Agent',
    type: 'AGENT',
    category: 'ORCHESTRATION',
    version: '2.0.0',
    description: 'Master routing hub of the 224-agent ecosystem. Synthesizes task requirements into optimal squads.',
    destinationProject: '.agents/skills/loragent-boss/SKILL.md',
    destinationGlobal: '~/.loragent/skills/loragent-boss/SKILL.md',
    installCmd: 'npx -y @lorapok/loragent@latest install loragent-boss',
    prereqs: ['Loragent Core']
  },
  {
    id: 'cloudflare-wrangler',
    name: 'Cloudflare Wrangler Specialist',
    type: 'SKILL',
    category: 'DEVOPS',
    version: '2.0.0',
    description: 'Deploys Cloudflare Workers, Pages, KV, D1 SQL, R2, Vectorize, and automated Zero-Trust secrets.',
    destinationProject: '.agents/skills/loragent-wrangler-specialist/SKILL.md',
    destinationGlobal: '~/.loragent/skills/loragent-wrangler-specialist/SKILL.md',
    installCmd: 'npx -y @lorapok/loragent@latest install loragent-wrangler-specialist',
    prereqs: ['Wrangler CLI']
  },
  {
    id: 'image-generate-fal',
    name: 'Fal.ai & Replicate Image Generator',
    type: 'MCP SERVER',
    category: 'CREATIVE',
    version: '2.0.0',
    description: 'Ultra-fast production AI image generation MCP server with Flux Pro, Recraft V3, and SDXL.',
    destinationProject: '.cursor/mcp.json',
    destinationGlobal: '~/.claude/mcp.json',
    installCmd: 'npx -y @lorapok/loragent@latest add-mcp image-generate-fal',
    prereqs: ['Fal.ai API Key']
  },
  {
    id: 'auto-team-preset',
    name: 'Auto-Team Engineering Matrix',
    type: 'FORMATION',
    category: 'ENGINEERING',
    version: '2.0.0',
    description: 'Squad preset linking Tech Director, Backend SE, Frontend SE, Senior QA, and CI/CD Specialist.',
    destinationProject: '.loragent/formations/auto-team.json',
    destinationGlobal: '~/.loragent/formations/auto-team.json',
    installCmd: 'npx -y @lorapok/loragent@latest formation auto-team',
    prereqs: ['Loragent Hub']
  },
  {
    id: 'loragent-sqa',
    name: 'Senior SQA & Security Auditor',
    type: 'AGENT',
    category: 'SECURITY',
    version: '2.0.0',
    description: 'Runs automated test suites, performs type checking, security audits, and lifecycle pre-commit gates.',
    destinationProject: '.agents/skills/loragent-sqa/SKILL.md',
    destinationGlobal: '~/.loragent/skills/loragent-sqa/SKILL.md',
    installCmd: 'npx -y @lorapok/loragent@latest install loragent-sqa',
    prereqs: ['Node.js / Python']
  }
];

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copied, setCopied] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [installScope, setInstallScope] = useState('project');
  const [modalCopied, setModalCopied] = useState(false);

  // Workflow Simulator State
  const [selectedScenarioId, setSelectedScenarioId] = useState('auto-team');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentScenario = useMemo(() => {
    return WORKFLOW_SCENARIOS.find((s) => s.id === selectedScenarioId) || WORKFLOW_SCENARIOS[0];
  }, [selectedScenarioId]);

  const activeStage = useMemo(() => {
    return currentScenario.stages[currentStepIndex] || currentScenario.stages[0];
  }, [currentScenario, currentStepIndex]);

  // Autoplay effect
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % currentScenario.stages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPlaying, currentScenario]);

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

  const filteredItems = useMemo(() => {
    return MARKETPLACE_ITEMS.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="container">
      {/* HEADER */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '8px', background: 'rgba(0, 255, 65, 0.1)', borderRadius: '12px', border: '1px solid rgba(0, 255, 65, 0.3)' }}>
            <Cpu size={28} color="#00FF41" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.5px', color: '#fff' }}>LORAGENT</h1>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>Universal Multi-Agent Orchestration v2.0</p>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="#workflow" style={{ color: '#00FF41', textDecoration: 'none', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 'bold' }}>Live Workflow</a>
          <a href="#marketplace" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.85rem', fontFamily: 'monospace' }}>Marketplace</a>
          <a href="#formations" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.85rem', fontFamily: 'monospace' }}>6 Formations</a>
          <a href="https://github.com/Maijied/Loragent" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>GitHub</span>
            <ArrowUpRight size={14} />
          </a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <span className="badge">
          <Sparkles size={14} color="#00FF41" />
          Universal AI Agent, Skill & MCP Server Registry
        </span>
        <h1 className="title">
          The 250-Resource AI Agent <br />
          <span style={{ color: '#00FF41' }}>Marketplace & Squad Matrix</span>
        </h1>
        <p className="subtitle">
          Hub-and-Spoke topology orchestrating 224+ specialized AI agents, Open Agent Skills, and MCP tools across Cursor, Claude Code, Windsurf, Antigravity, and Zed.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0,255,65,0.3)', padding: '10px 18px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#00FF41' }}>
            <TerminalSquare size={16} />
            <span>npx -y @lorapok/loragent@latest</span>
            <button 
              onClick={() => copyCode('npx -y @lorapok/loragent@latest', 'hero-npx')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '6px', color: '#94a3b8' }}
            >
              {copied === 'hero-npx' ? <Check size={14} color="#00FF41" /> : <Copy size={14} />}
            </button>
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
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '0' }}>How Loragent Works in Real-Time</h2>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
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
                    minWidth: '120px',
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
                  <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#64748b' }}>PROTOCOL</div>
                  <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#06b6d4', fontWeight: 'bold', marginTop: '2px' }}>{activeStage.protocol}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Structured MCP Payload</div>
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  onClick={() => { setCurrentStepIndex((prev) => (prev === 0 ? currentScenario.stages.length - 1 : prev - 1)); setIsPlaying(false); }}
                  style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
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
                >
                  <ChevronRight size={14} />
                </button>

                <button 
                  onClick={() => { setCurrentStepIndex(0); setIsPlaying(true); }}
                  style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}
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
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00FF41', display: 'inline-block' }}></span>
                    LIVE STREAM
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>COMMAND DIRECTIVE:</div>
                <div style={{ fontSize: '0.85rem', color: '#00FF41', fontWeight: 'bold', background: 'rgba(0,255,65,0.08)', padding: '8px 10px', borderRadius: '6px', marginBottom: '1rem' }}>
                  $ {currentScenario.command}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>ACTIVE PACKET PAYLOAD:</div>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', lineHeight: '1.6', wordBreak: 'break-all' }}>
                  {activeStage.telemetry}
                </div>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                <span>Zero-Trust Vault: ACTIVE</span>
                <span style={{ color: '#00FF41' }}>Step {activeStage.step}/7 100% Green</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETPLACE SECTION */}
      <h2 id="marketplace" className="section-title">Loragent Marketplace Registry</h2>
      <div style={{ width: '100%', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', minWidth: '280px', flex: '1' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 250 resources (Firebase, Boss, Docker, SQA)..."
            style={{ width: '100%', padding: '12px 16px 12px 42px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '0.85rem', fontFamily: 'monospace', outline: 'none' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {['all', 'engineering', 'data', 'creative', 'devops', 'security', 'orchestration'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                cursor: 'pointer',
                background: selectedCategory === c ? '#00FF41' : 'rgba(255,255,255,0.05)',
                color: selectedCategory === c ? '#000' : '#94a3b8',
                fontWeight: selectedCategory === c ? '700' : '400',
                border: 'none'
              }}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem', width: '100%', marginBottom: '5rem' }}>
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            style={{ background: 'rgba(10, 17, 32, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '3px 8px', borderRadius: '6px', background: 'rgba(0, 255, 65, 0.1)', color: '#00FF41', border: '1px solid rgba(0,255,65,0.2)' }}>
                {item.type}
              </span>
              <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#64748b' }}>{item.category}</span>
            </div>
            <div>
              <div style={{ fontWeight: '700', fontFamily: 'monospace', color: '#fff', fontSize: '1.05rem' }}>{item.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px', lineHeight: '1.6' }}>{item.description}</div>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b' }}>v{item.version}</span>
              <button
                onClick={() => setModalItem(item)}
                style={{ padding: '6px 12px', background: 'rgba(0, 255, 65, 0.15)', border: '1px solid rgba(0, 255, 65, 0.3)', borderRadius: '8px', color: '#00FF41', fontSize: '0.75rem', fontFamily: 'monospace', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <DownloadCloud size={13} />
                <span>Install</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 6 FORMATIONS SECTION */}
      <h2 id="formations" className="section-title">6 Dynamic Squad Formations</h2>
      <main className="grid" style={{ marginBottom: '5rem' }}>
        {FORMATIONS.map((form) => {
          const Icon = form.icon;
          return (
            <div key={form.name} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${form.color}15`, border: `1px solid ${form.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={form.color} />
                </div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', padding: '4px 10px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }}>
                  {form.badge}
                </span>
              </div>
              
              <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: '#fff' }}>{form.name}</h2>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: '1.6' }}>{form.description}</p>
              
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b', marginBottom: '0.5rem' }}>LEAD: <span style={{ color: form.color }}>{form.lead}</span></div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {form.squad.map((s) => (
                    <span key={s} style={{ fontSize: '0.7rem', fontFamily: 'monospace', padding: '2px 8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', color: '#cbd5e1' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* MODAL */}
      {modalItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 100 }}>
          <div style={{ maxWidth: '520px', width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', fontFamily: 'monospace' }}>Install {modalItem.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>{modalItem.description}</p>
              </div>
              <button onClick={() => setModalItem(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'monospace', color: '#cbd5e1', marginBottom: '6px' }}>Where should this be available?</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button 
                  onClick={() => setInstallScope('project')}
                  style={{ padding: '8px', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace', cursor: 'pointer', background: installScope === 'project' ? '#00FF41' : 'rgba(255,255,255,0.05)', color: installScope === 'project' ? '#000' : '#94a3b8', border: 'none', fontWeight: '600' }}
                >
                  project
                </button>
                <button 
                  onClick={() => setInstallScope('global')}
                  style={{ padding: '8px', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace', cursor: 'pointer', background: installScope === 'global' ? '#a855f7' : 'rgba(255,255,255,0.05)', color: installScope === 'global' ? '#fff' : '#94a3b8', border: 'none', fontWeight: '600' }}
                >
                  global
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b', marginBottom: '4px' }}>Installation destination</label>
              <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace', color: '#cbd5e1' }}>
                {installScope === 'project' ? modalItem.destinationProject : modalItem.destinationGlobal}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem', padding: '10px 12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#fbbf24' }}>
              ⚠️ Zero-Trust Vault will encrypt any injected credentials. Never store plaintext secrets in committed files.
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0, 255, 65, 0.3)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#00FF41' }}>
              <span>{modalItem.installCmd} {installScope === 'global' ? '--global' : ''}</span>
              <button onClick={() => handleModalCopy(`${modalItem.installCmd} ${installScope === 'global' ? '--global' : ''}`)} style={{ background: 'none', border: 'none', color: '#00FF41', cursor: 'pointer' }}>
                {modalCopied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setModalItem(null)} style={{ padding: '8px 16px', background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', fontFamily: 'monospace', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={() => { handleModalCopy(`${modalItem.installCmd} ${installScope === 'global' ? '--global' : ''}`); setTimeout(() => setModalItem(null), 700); }} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                {modalCopied ? 'Copied!' : 'Install Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2.5rem', paddingBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace' }}>
        <div>LORAGENT v2.0.0 • Lorapok Labs Official Asset</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="https://lorapok.tech" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Lorapok Labs</a>
          <a href="https://github.com/Maijied/Loragent" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>GitHub</a>
          <a href="https://loragent.lorapok.tech" target="_blank" rel="noreferrer" style={{ color: '#00FF41', textDecoration: 'none' }}>Website</a>
        </div>
      </footer>
    </div>
  );
}
