'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Terminal, Shield, Cpu, Cloud, Globe, Lock, Play, CheckCircle2, 
  Copy, Check, Sparkles, Layers, Search, Server, RefreshCw, Zap,
  ChevronRight, ExternalLink, Code2, Database, Workflow, Radio,
  Activity, Eye, Box, AlertCircle, ArrowUpRight, GitBranch, Key,
  FileCode, Laptop, Compass, BookOpen, UserCheck, ShieldAlert
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All 224 Agents', count: 224 },
  { id: 'orchestrator', label: 'Orchestrator', count: 6 },
  { id: 'auto', label: 'Engineering (Auto Team)', count: 48 },
  { id: 'office', label: 'Business & Operations', count: 36 },
  { id: 'chela', label: 'Chela Debugging', count: 24 },
  { id: 'freelance', label: 'Freelance Specialists', count: 86 },
  { id: 'observer', label: 'Watchman & State', count: 24 }
];

const FORMATIONS = [
  {
    id: 'orchestrator',
    name: 'Boss Orchestrator',
    badge: 'Supreme Router',
    color: 'emerald',
    icon: Compass,
    lead: 'loragent-boss',
    description: 'Central intelligent routing hub. Evaluates task complexity, summons specialized squads via MCP, manages cross-agent steering, and enforces workspace guardrails.',
    squad: ['loragent-boss', 'loragent-teacher', 'loragent-workspace-guard', 'loragent-watchman', 'loragent-spidernet']
  },
  {
    id: 'auto',
    name: 'Auto Team Matrix',
    badge: 'Engineering Squad',
    color: 'cyan',
    icon: Code2,
    lead: 'loragent-tech-director',
    description: 'Autonomous full-stack engineering. Converts product requirements into architecture, writes backend APIs, builds biological UIs, runs automated SQA suites, and executes CI/CD releases.',
    squad: ['loragent-tech-director', 'loragent-backend-se', 'loragent-frontend-se', 'loragent-sqa', 'loragent-cicd-specialist']
  },
  {
    id: 'office',
    name: 'Enterprise Office Matrix',
    badge: 'Business Operations',
    color: 'purple',
    icon: BriefcaseIcon,
    lead: 'loragent-project-coordinator',
    description: 'Strategic initialization and continuous operations. Manages roadmaps, prepares enterprise proposals, produces marketing campaigns, publishes release notes, and coordinates public relations.',
    squad: ['loragent-project-coordinator', 'loragent-marketing-strategy-manager', 'loragent-publisher', 'loragent-pr-specialist', 'loragent-software-business-analyst']
  },
  {
    id: 'chela',
    name: 'Chela Debugging Matrix',
    badge: 'Zero-Guess Bug Hunter',
    color: 'amber',
    icon: Zap,
    lead: 'loragent-bug-hunter',
    description: 'Mission-critical root-cause analysis. Parses real-time orchestration graphs and telemetry, diagnoses runtime regressions, repairs broken pipelines, and provides self-healing hotfixes.',
    squad: ['loragent-bug-hunter', 'loragent-shift-engineer', 'loragent-git-specialist', 'loragent-inspector', 'loragent-repo-repair']
  },
  {
    id: 'freelance',
    name: 'Freelance Isolation Matrix',
    badge: 'Specialist Domain',
    color: 'blue',
    icon: Sparkles,
    lead: 'loragent-image-generate',
    description: 'Singular hyper-focused specialists invoked on-demand for specific outputs: Fal.ai/Replicate generative art, FFmpeg GIF creation, Cloudflare Wrangler edge, 3D WebGL, and tool installation.',
    squad: ['loragent-image-generate', 'loragent-gif-create', 'loragent-deploy', 'loragent-tools-install', 'loragent-wrangler-specialist', 'loragent-3d-designer']
  },
  {
    id: 'observer',
    name: 'Observer & Sentinel Matrix',
    badge: 'Crash Recovery',
    color: 'rose',
    icon: Eye,
    lead: 'loragent-watchman',
    description: 'Continuous execution telemetry and memory preservation. Maintains orchestration graphs at .loragent-debug/orchestration-graph.json and facilitates seamless token crash recovery via /loragent-watchman continue.',
    squad: ['loragent-watchman', 'loragent-workspace-guard', 'loragent-cache-collector', 'loragent-test-sentinel', 'loragent-token-sniper']
  }
];

function BriefcaseIcon(props: any) {
  return <Layers {...props} />;
}

const FEATURED_AGENTS = [
  { name: 'loragent-boss', role: 'Central Intelligent Routing Hub', cat: 'orchestrator', formation: 'Orchestrator', layer: 'cross', tools: ['loragent_summon_agent', 'loragent_steer', 'loragent_watchman_save'], tags: ['Orchestrator', 'Routing', 'Formations', 'Hub'] },
  { name: 'loragent-tech-director', role: 'Chief Software Architect', cat: 'auto', formation: 'Auto Team', layer: 'pulse', tools: ['loragent_steer', 'filesystem_read'], tags: ['Architecture', 'LLDP', 'System Design'] },
  { name: 'loragent-backend-se', role: 'Senior Backend Systems Engineer', cat: 'auto', formation: 'Auto Team', layer: 'lore', tools: ['bash', 'filesystem_write'], tags: ['Node.js', 'APIs', 'FastAPI', 'PostgreSQL'] },
  { name: 'loragent-frontend-se', role: 'Senior Frontend & Sensory UI Engineer', cat: 'auto', formation: 'Auto Team', layer: 'face', tools: ['bash', 'filesystem_write'], tags: ['Next.js', 'Tailwind', 'Sensory UI', 'React 19'] },
  { name: 'loragent-sqa', role: 'Senior Software Quality Assurance & Security', cat: 'auto', formation: 'Auto Team', layer: 'loom', tools: ['bash', 'loragent_trigger_hook'], tags: ['Unit Tests', 'E2E', 'Security Audit', 'Hooks'] },
  { name: 'loragent-deploy', role: 'Multi-Cloud & Container Deployment Lead', cat: 'freelance', formation: 'Freelance', layer: 'loom', tools: ['vercel_deploy', 'railway_deploy', 'docker_build'], tags: ['Vercel', 'Railway', 'Docker', 'CI/CD'] },
  { name: 'loragent-image-generate', role: 'Production AI Image Generator (Fal/Replicate)', cat: 'freelance', formation: 'Freelance', layer: 'face', tools: ['fal_run_model', 'run_model'], tags: ['Fal.ai', 'Replicate', 'Concept Art', 'Marketing Visuals'] },
  { name: 'loragent-gif-create', role: 'Animated GIF & Media Asset Producer', cat: 'freelance', formation: 'Freelance', layer: 'face', tools: ['bash', 'ffmpeg', 'gifsicle'], tags: ['FFmpeg', 'GIFs', 'Micro-Animations', 'Optimization'] },
  { name: 'loragent-tools-install', role: 'Universal Dependency & Binary Installer', cat: 'freelance', formation: 'Freelance', layer: 'loom', tools: ['bash', 'npm', 'pip', 'composer'], tags: ['Tools', 'Dependency Resolver', 'Verification'] },
  { name: 'loragent-watchman', role: 'Session State Guardian & Crash Recovery', cat: 'observer', formation: 'Observer', layer: 'cross', tools: ['loragent_watchman_save', 'loragent_get_state'], tags: ['Crash Recovery', 'State Cache', 'Resumption'] },
  { name: 'loragent-wrangler-specialist', role: 'Cloudflare Developer Platform Architect', cat: 'freelance', formation: 'Freelance', layer: 'port', tools: ['wrangler_deploy', 'd1_query', 'kv_put'], tags: ['Workers', 'Pages', 'D1', 'KV', 'R2', 'Vectorize'] },
  { name: 'loragent-bug-hunter', role: 'The Chela Problem Solver & RCA Investigator', cat: 'chela', formation: 'Chela Debugging', layer: 'pulse', tools: ['bash', 'debug_trace'], tags: ['Bug Hunter', 'Root Cause', 'Telemetry'] },
  { name: 'loragent-workspace-guard', role: 'Zero-Trust Security & Destructive Command Enforcer', cat: 'observer', formation: 'Observer', layer: 'cross', tools: ['loragent_trigger_hook'], tags: ['Zero-Trust', 'Guardrails', 'Destructive Shield'] },
  { name: 'loragent-chorki', role: 'Autonomous Relentless Autopilot Loop Engine', cat: 'orchestrator', formation: 'Orchestrator', layer: 'cross', tools: ['loragent_steer', 'check_done'], tags: ['Autopilot', 'Continuous Verification', 'Check-Done'] },
  { name: 'loragent-project-coordinator', role: 'Enterprise Business Strategy & Roadmap Lead', cat: 'office', formation: 'Office Matrix', layer: 'lore', tools: ['loragent_steer'], tags: ['Operations', 'Roadmap', 'Milestones'] },
  { name: 'loragent-3d-designer', role: 'Three.js & WebGL Sensory Visualizer', cat: 'freelance', formation: 'Freelance', layer: 'face', tools: ['bash', 'threejs_render'], tags: ['Three.js', 'WebGL', 'Shaders', 'Blender'] }
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
    file: 'CLAUDE.md + AGENTS.md + ~/.config/Claude/claude_desktop_config.json',
    snippet: `// Layer 1: Root directives (CLAUDE.md)\n// Layer 2: On-demand Specialist Skills (skills/*/SKILL.md)\n// Layer 3: Watchman Cache (.loragent-debug/watchman-cache.json)`,
    description: '3-Layer extended memory architecture with progressive token disclosure (<40k tokens).'
  },
  windsurf: {
    name: 'Windsurf IDE',
    file: '.windsurfrules + ~/.codeium/windsurf/mcp_config.json',
    snippet: `// Loragent Windsurf Rules v2\n// Hub-and-Spoke Topology routing via loragent-boss.\n// Autonomous handoffs via loragent_steer.`,
    description: 'Native Cascade Flow integration with zero-trust credential vault injection.'
  },
  roo: {
    name: 'Roo Code & Cline',
    file: '.roomodes + .clinerules',
    snippet: `{\n  "customModes": [\n    { "slug": "loragent-boss", "name": "🤖 Loragent Boss — Orchestrator" },\n    { "slug": "loragent-auto-team", "name": "🛠️ Loragent Auto Team — Engineering" },\n    { "slug": "loragent-chela", "name": "🥷 Loragent Chela — Bug Hunter" },\n    { "slug": "loragent-watchman", "name": "👁️ Loragent Watchman — Crash Recovery" }\n  ]\n}`,
    description: 'Custom formation modes directly accessible in the Roo Code mode switcher.'
  },
  vscode: {
    name: 'VS Code & Open VSX',
    file: '.vscode/mcp.json',
    snippet: `{\n  "mcpServers": {\n    "loragent": {\n      "command": "node",\n      "args": ["\${workspaceFolder}/port/mcp/server.js"]\n    }\n  }\n}`,
    description: 'Standardized Open VSX and VS Code marketplace compatibility.'
  }
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'autopilot' | 'multicloud' | 'cloudflare-mcp' | 'vault' | 'sdk'>('autopilot');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormation, setSelectedFormation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedIde, setSelectedIde] = useState<string>('cursor');
  const [inspectedAgent, setInspectedAgent] = useState<any | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredAgents = useMemo(() => {
    return FEATURED_AGENTS.filter(agent => {
      const matchesCat = selectedCategory === 'all' || agent.cat === selectedCategory;
      const matchesFormation = selectedFormation === 'all' || agent.cat === selectedFormation;
      const matchesSearch = searchQuery === '' || 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesFormation && matchesSearch;
    });
  }, [selectedCategory, selectedFormation, searchQuery]);

  return (
    <div className="min-h-screen bg-[#030704] text-gray-100 font-sans selection:bg-[#00FF41]/30 selection:text-[#00FF41]">
      
      {/* Background Animated Cyber Ambient Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[15%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-[#00FF41]/10 blur-[150px]" />
        <div className="absolute top-[35%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-cyan-600/10 blur-[170px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[35vw] h-[35vw] rounded-full bg-purple-600/10 blur-[160px]" />
        <div className="fixed inset-0 opacity-[0.035] bg-[radial-gradient(#00FF41_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-[#00FF41]/20 sticky top-0 bg-[#030704]/90 backdrop-blur-xl z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#00FF41] via-cyan-400 to-purple-500 p-[1px] shadow-[0_0_20px_rgba(0,255,65,0.4)]">
              <div className="w-full h-full bg-[#030704] rounded-lg flex items-center justify-center font-mono font-black text-[#00FF41] text-base">
                &gt;_
              </div>
            </div>
            <div>
              <span className="font-mono font-black text-white text-lg tracking-wider">LORAGENT</span>
              <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30">v2.0.0_LLDP</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-gray-300">
            <a href="#formations" className="hover:text-[#00FF41] transition-colors">6 Formations</a>
            <a href="#agents" className="hover:text-[#00FF41] transition-colors">224 Agents</a>
            <a href="#mcp-suite" className="hover:text-cyan-400 transition-colors">Cloudflare MCP</a>
            <a href="#ide-matrix" className="hover:text-cyan-400 transition-colors">IDE Integration</a>
            <a href="#vault" className="hover:text-purple-400 transition-colors">Zero-Trust Vault</a>
            <Link href="/community" className="hover:text-cyan-400 transition-colors">Wiki &amp; Docs</Link>
            <Link href="/admin" className="hover:text-purple-400 transition-colors">Admin Panel</Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/30 text-[11px] font-mono text-[#00FF41]">
              <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-ping" />
              224 AGENTS ACTIVE
            </div>
            <a 
              href="#mcp-suite"
              className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-[#00FF41] text-black rounded-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,65,0.4)] flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              Connect MCP
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-28">
        
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="pt-6 md:pt-12 space-y-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#00FF41]/30 text-xs font-mono text-[#00FF41] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#00FF41] animate-spin" style={{ animationDuration: '8s' }} />
            <span>ENTERPRISE AUTONOMOUS MULTI-AGENT PROTOCOL</span>
            <span className="text-gray-500">•</span>
            <span className="text-cyan-400">224 CONSTITUENT AGENTS</span>
            <span className="text-gray-500">•</span>
            <span className="text-purple-400">v2.0.0 RELEASE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] text-white">
                Autonomous <br />
                <span className="bg-gradient-to-r from-[#00FF41] via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Multi-Agent Power
                </span> <br />
                At Cloud Scale.
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-2xl font-sans leading-relaxed">
                Loragent is the universal virtual software firm protocol by Lorapok Labs. It coordinates <strong>224 specialized AI agents</strong> across Antigravity, Cursor, Claude Code, Windsurf, and VS Code with zero-trust machine-encrypted credentials, multi-cloud automated execution, and Cloudflare Workers edge deployment.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="#agents" 
                  className="px-6 py-3.5 bg-[#00FF41] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-[0_0_25px_rgba(0,255,65,0.4)] flex items-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  Explore 224 Agents
                </a>
                <a 
                  href="#mcp-suite" 
                  className="px-6 py-3.5 border border-cyan-500/40 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-900/30 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
                >
                  <Cloud className="w-4 h-4" />
                  Cloudflare Remote MCP
                </a>
                <Link 
                  href="/community" 
                  className="px-6 py-3.5 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Wiki &amp; Docs
                </Link>
              </div>

              {/* Metrics Highlights Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-3xl font-black font-mono text-white">224</div>
                  <div className="text-[11px] text-gray-400 font-mono uppercase">AI Agents (v2.0)</div>
                </div>
                <div>
                  <div className="text-3xl font-black font-mono text-[#00FF41]">6</div>
                  <div className="text-[11px] text-gray-400 font-mono uppercase">Formations</div>
                </div>
                <div>
                  <div className="text-3xl font-black font-mono text-cyan-400">8+</div>
                  <div className="text-[11px] text-gray-400 font-mono uppercase">AI IDE Integrations</div>
                </div>
                <div>
                  <div className="text-3xl font-black font-mono text-purple-400">AES-256</div>
                  <div className="text-[11px] text-gray-400 font-mono uppercase">Zero-Trust Enclave</div>
                </div>
              </div>
            </div>

            {/* Interactive Terminal Simulator */}
            <div className="lg:col-span-5">
              <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-[#00FF41]/40">
                {/* Terminal Header */}
                <div className="bg-black/90 px-4 py-3 border-b border-[#00FF41]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 font-mono text-[11px] text-gray-400">loragent-terminal ~ lldp-v2</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#00FF41] px-2 py-0.5 rounded bg-[#00FF41]/10 border border-[#00FF41]/30">
                    ONLINE
                  </span>
                </div>

                {/* Terminal Tab Switchers */}
                <div className="bg-[#050c06] px-3 pt-2 border-b border-[#00FF41]/10 flex flex-wrap gap-1">
                  {[
                    { id: 'autopilot', label: 'Autopilot Loop', icon: RefreshCw },
                    { id: 'multicloud', label: 'Multi-Cloud Exec', icon: Cloud },
                    { id: 'cloudflare-mcp', label: 'Edge MCP', icon: Server },
                    { id: 'vault', label: 'Encrypted Vault', icon: Lock },
                    { id: 'sdk', label: 'SDK Quickstart', icon: Code2 }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-t-lg font-mono text-[11px] flex items-center gap-1.5 transition-all ${
                          activeTab === tab.id
                            ? 'bg-black text-[#00FF41] border-t-2 border-t-[#00FF41] border-x border-[#00FF41]/20'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Terminal Screen Body */}
                <div className="p-5 font-mono text-xs space-y-3 bg-black/95 min-h-[320px]">
                  {activeTab === 'autopilot' && (
                    <div className="space-y-2">
                      <div className="text-gray-400"><span className="text-[#00FF41]">root@lorapok:~$</span> loragent autopilot &quot;Build &amp; Deploy Cloud Architecture&quot;</div>
                      <div className="text-gray-500">[PULSE] StateWatcher active • [LORE] Boss analyzing intent...</div>
                      <div className="text-cyan-400">▶ [AUTO TEAM] Summoning loragent-tech-director, loragent-backend-se, loragent-frontend-se, loragent-sqa</div>
                      <div className="text-purple-400">🌀 [CHORKI ENGINE] Iteration 1/5 • Executing steps...</div>
                      <div className="text-yellow-300">🔍 [HOOK TRIGGER] Executing check-done lifecycle validator...</div>
                      <div className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>All verification checks passed (Builds: PASS, Tests: 36/36 PASS, MCP: SYNCED)</span>
                      </div>
                      <div className="text-gray-400 pt-2"><span className="text-[#00FF41]">root@lorapok:~$</span> /loragent-watchman continue</div>
                      <div className="text-cyan-300">👁️ [WATCHMAN] State restored from .loragent-debug/watchman-cache.json • 0 tokens lost.</div>
                    </div>
                  )}

                  {activeTab === 'multicloud' && (
                    <div className="space-y-2">
                      <div className="text-gray-400"><span className="text-[#00FF41]">root@lorapok:~$</span> node bin/loragent-deploy.js --all-platforms</div>
                      <div className="text-cyan-400">☁️ [CLOUDFLARE] Deploying Workers, D1 database, R2 buckets, KV stores...</div>
                      <div className="text-purple-400">⚡ [VERCEL] Production edge frontend build completed → https://loragent.lorapok.tech</div>
                      <div className="text-emerald-400">🚀 [RAILWAY] Containerized backend orchestration service active</div>
                      <div className="text-yellow-400">🐳 [DOCKER] Building multi-stage container images...</div>
                      <div className="text-emerald-400 flex items-center gap-1.5 pt-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Multi-Cloud Deployment 100% Synchronized.</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'cloudflare-mcp' && (
                    <div className="space-y-2">
                      <div className="text-gray-400"><span className="text-[#00FF41]">root@lorapok:~$</span> node scripts/universal-sync.js</div>
                      <div className="text-cyan-400">🌐 Connecting to Official Cloudflare Remote MCP: https://mcp.cloudflare.com/sse</div>
                      <div className="text-gray-300">├── cloudflare-docs (Live retrieval for Workers AI, Vectorize, KV)</div>
                      <div className="text-gray-300">├── cloudflare-bindings (Zero-trust resource provisioning)</div>
                      <div className="text-gray-300">├── cloudflare-builds (Instant CI/CD status on Pages)</div>
                      <div className="text-gray-300">└── cloudflare-observability (Real-time telemetry and traces)</div>
                      <div className="text-emerald-400 pt-2">✅ Synced MCP registry across 8 IDE config files.</div>
                    </div>
                  )}

                  {activeTab === 'vault' && (
                    <div className="space-y-2">
                      <div className="text-gray-400"><span className="text-[#00FF41]">root@lorapok:~$</span> cred list</div>
                      <div className="text-purple-400">🔒 [VAULT] Authenticated via machine-encrypted PIN in .env</div>
                      <div className="text-gray-300">📦 CF_ACCOUNT_ID: [ENCRYPTED] (AES-256 GCM)</div>
                      <div className="text-gray-300">📦 CF_API_TOKEN:  [ENCRYPTED] (AES-256 GCM)</div>
                      <div className="text-gray-300">📦 OPENAI_API_KEY: [ENCRYPTED] (AES-256 GCM)</div>
                      <div className="text-gray-300">📦 FAL_KEY:        [ENCRYPTED] (AES-256 GCM)</div>
                      <div className="text-emerald-400 pt-2">🛡️ Workspace Guard: 0 Plaintext secrets exposed in VCS.</div>
                    </div>
                  )}

                  {activeTab === 'sdk' && (
                    <div className="space-y-2">
                      <div className="text-gray-400">// Install Loragent SDK</div>
                      <div className="text-[#00FF41]">npm install loragent</div>
                      <div className="text-gray-400 pt-2">// Import &amp; Initialize Boss Orchestrator</div>
                      <div className="text-cyan-300">import &#123; LoragentBoss, LoragentClient &#125; from &apos;loragent&apos;;</div>
                      <div className="text-purple-300">const boss = new LoragentBoss(&#123; autoSpawn: true &#125;);</div>
                      <div className="text-yellow-300">await boss.executeFormation(&apos;auto&apos;, &#123; task: &apos;Build API&apos; &#125;);</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6 FORMATIONS SECTION */}
        {/* ========================================================================= */}
        <section id="formations" className="space-y-8 scroll-mt-24">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/30 text-[11px] font-mono text-[#00FF41]">
              <Layers className="w-3.5 h-3.5" />
              DYNAMIC MULTI-AGENT ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              The 6 Core Formations
            </h2>
            <p className="text-gray-400 max-w-2xl text-sm sm:text-base font-sans">
              Loragent dynamically convenes specialized task squads to execute complex software lifecycles with deterministic handoffs and zero context drift.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FORMATIONS.map((form) => {
              const Icon = form.icon;
              return (
                <div 
                  key={form.id}
                  className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#00FF41]/50 transition-all duration-300 space-y-4 glow-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#00FF41]/10 border border-[#00FF41]/30 flex items-center justify-center text-[#00FF41]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                      {form.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">{form.name}</h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">{form.description}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">Squad Members:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {form.squad.map((agent) => (
                        <span key={agent} className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-gray-300">
                          {agent}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE AGENT DIRECTORY (224 AGENTS) */}
        {/* ========================================================================= */}
        <section id="agents" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-400">
                <Compass className="w-3.5 h-3.5" />
                LIVE AGENT ROSTER (v2.0)
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
                Specialist Agent Roster
              </h2>
              <p className="text-gray-400 max-w-2xl text-sm sm:text-base font-sans">
                Search, filter, and inspect all specialized agents. Click any agent to inspect its tools, LLDP layer, and copy its direct summon command.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 224 agents or skills..."
                className="w-full bg-black/60 border border-white/15 focus:border-[#00FF41] rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-gray-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-[#00FF41] text-black font-bold shadow-[0_0_15px_rgba(0,255,65,0.4)]'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.id ? 'bg-black/30 text-black' : 'bg-black/60 text-gray-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredAgents.map((agent) => (
              <div 
                key={agent.name}
                onClick={() => setInspectedAgent(agent)}
                className="glass-panel p-5 rounded-xl border border-white/10 hover:border-[#00FF41]/60 hover:bg-white/[0.04] transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                    {agent.formation}
                  </span>
                  <span className="text-[10px] font-mono text-[#00FF41] uppercase tracking-wider">
                    [{agent.layer}]
                  </span>
                </div>

                <div>
                  <h4 className="font-mono font-bold text-sm text-white group-hover:text-[#00FF41] transition-colors truncate">
                    {agent.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {agent.role}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                  {agent.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-gray-400">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-gray-500 group-hover:text-gray-300 transition-colors">
                  <span>Inspect Spec</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* UNIVERSAL IDE INTEGRATION MATRIX */}
        {/* ========================================================================= */}
        <section id="ide-matrix" className="space-y-8 scroll-mt-24">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[11px] font-mono text-purple-400">
              <Laptop className="w-3.5 h-3.5" />
              UNIVERSAL AI IDE COMPATIBILITY
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Write Once. Deploy to Any AI IDE.
            </h2>
            <p className="text-gray-400 max-w-2xl text-sm sm:text-base font-sans">
              Loragent synchronizes across 8 IDE platforms seamlessly. Select your editor below to view its automated configuration snippet.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* IDE Selector Column */}
            <div className="lg:col-span-4 space-y-2">
              {Object.entries(IDE_CONFIGS).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setSelectedIde(key)}
                  className={`w-full p-4 rounded-xl font-mono text-left text-xs transition-all flex items-center justify-between ${
                    selectedIde === key
                      ? 'bg-[#00FF41]/10 text-white border border-[#00FF41]/50 shadow-[0_0_15px_rgba(0,255,65,0.2)]'
                      : 'glass-panel text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-white">{item.name}</div>
                    <div className="text-[10px] text-gray-400 truncate max-w-[200px]">{item.file}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedIde === key ? 'translate-x-1 text-[#00FF41]' : 'text-gray-600'}`} />
                </button>
              ))}
            </div>

            {/* IDE Config Code Preview */}
            <div className="lg:col-span-8">
              <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
                <div className="bg-black/80 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs text-gray-300">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span>{IDE_CONFIGS[selectedIde].file}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(IDE_CONFIGS[selectedIde].snippet, 'ide-config')}
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5 transition-all border border-white/10"
                  >
                    {copiedText === 'ide-config' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#00FF41]" />
                        <span className="text-[#00FF41]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Config</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 font-mono text-xs bg-black/90 text-gray-300 space-y-4">
                  <p className="text-gray-400 text-[11px] leading-relaxed border-b border-white/10 pb-3">
                    {IDE_CONFIGS[selectedIde].description}
                  </p>
                  <pre className="overflow-x-auto text-[#00FF41] leading-relaxed">
                    <code>{IDE_CONFIGS[selectedIde].snippet}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CLOUDFLARE REMOTE MCP & EDGE SUITE */}
        {/* ========================================================================= */}
        <section id="mcp-suite" className="space-y-8 scroll-mt-24">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-400">
              <Server className="w-3.5 h-3.5" />
              OFFICIAL CLOUDFLARE REMOTE MCP SUITE
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Cloudflare Edge Architecture
            </h2>
            <p className="text-gray-400 max-w-2xl text-sm sm:text-base font-sans">
              Direct remote integration with Cloudflare Remote MCP endpoints. Agents query live docs, provision bindings, deploy Workers, and stream real-time traces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'cloudflare-docs', endpoint: 'https://mcp.cloudflare.com/sse', desc: 'Live vector search across Cloudflare Workers AI, Vectorize, KV, and Pages.' },
              { title: 'cloudflare-bindings', endpoint: 'https://bindings.mcp.cloudflare.com', desc: 'Declarative edge resource binding for D1, R2, Queues, and Secrets.' },
              { title: 'cloudflare-builds', endpoint: 'https://builds.mcp.cloudflare.com', desc: 'Instant Pages & Worker build logs, deployment rollback, and previews.' },
              { title: 'cloudflare-observability', endpoint: 'https://telemetry.mcp.cloudflare.com', desc: 'Real-time trace logs, HTTP latency percentiles, and error rate monitors.' }
            ].map((mcp) => (
              <div key={mcp.title} className="glass-panel-cyan p-6 rounded-2xl border border-cyan-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <Cloud className="w-6 h-6 text-cyan-400" />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    Remote SSE
                  </span>
                </div>
                <div>
                  <h4 className="font-mono font-bold text-white text-base">{mcp.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{mcp.desc}</p>
                </div>
                <div className="text-[10px] font-mono text-cyan-400/80 truncate pt-2 border-t border-cyan-500/20">
                  {mcp.endpoint}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ZERO-TRUST SECURITY ENCLAVE */}
        {/* ========================================================================= */}
        <section id="vault" className="space-y-8 scroll-mt-24">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/20 via-black to-black space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[11px] font-mono text-purple-400">
                  <Shield className="w-3.5 h-3.5" />
                  ZERO-TRUST CREDENTIAL VAULT
                </div>
                <h3 className="text-3xl sm:text-4xl font-black uppercase text-white">
                  AES-256 Machine-Encrypted Secret Enclave
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed font-sans">
                  Never commit an API token or private key again. All credentials are encrypted using machine-specific cryptographic keys stored in <code className="text-[#00FF41]">.env</code> (<code className="text-[#00FF41]">LORAGENT_VAULT_ENCRYPTED_PIN</code>) and dynamically injected into child processes at runtime.
                </p>
                <div className="flex flex-wrap gap-3 pt-2 font-mono text-xs">
                  <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-purple-500/30 text-purple-300">
                    ✓ Zero Plaintext in Git
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-purple-500/30 text-purple-300">
                    ✓ Automatic Workspace-Guard Blocking
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-purple-500/30 text-purple-300">
                    ✓ GnuPG AES-256 Standard
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-black/80 p-5 rounded-2xl border border-purple-500/30 font-mono text-xs space-y-3">
                <div className="text-gray-400">// Machine Enclave Signature</div>
                <div className="text-cyan-400">LORAGENT_VAULT_ENCRYPTED_PIN=62e6e18f28...</div>
                <div className="text-cyan-400">LORAGENT_VAULT_IV=c0e6fcda713f04b2b1...</div>
                <div className="text-gray-500 pt-2">// Injected Process Output</div>
                <div className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Credentials decrypted in memory. 0 file leaks.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* AGENT INSPECTION MODAL */}
      {/* ========================================================================= */}
      {inspectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-[#00FF41]/50 space-y-6 relative">
            <button 
              onClick={() => setInspectedAgent(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white font-mono text-sm"
            >
              ✕ CLOSE
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30">
                  {inspectedAgent.formation}
                </span>
                <span className="text-xs font-mono text-gray-400">
                  LLDP Layer: [{inspectedAgent.layer.toUpperCase()}]
                </span>
              </div>
              <h3 className="text-2xl font-black font-mono text-white">{inspectedAgent.name}</h3>
              <p className="text-sm text-gray-300">{inspectedAgent.role}</p>
            </div>

            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Permitted MCP Tools:</div>
              <div className="flex flex-wrap gap-2">
                {inspectedAgent.tools.map((t: string) => (
                  <span key={t} className="text-xs font-mono px-2.5 py-1 rounded bg-black/60 border border-white/10 text-cyan-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Summon Slash Command:</div>
              <div className="flex items-center justify-between bg-black/90 p-3 rounded-xl border border-white/10 font-mono text-xs">
                <code className="text-[#00FF41]">/{inspectedAgent.name}:start</code>
                <button
                  onClick={() => copyToClipboard(`/${inspectedAgent.name}:start`, 'agent-cmd')}
                  className="text-gray-300 hover:text-white flex items-center gap-1"
                >
                  {copiedText === 'agent-cmd' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/80 py-12 mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">LORAGENT v2.0.0</span>
            <span>•</span>
            <span>Lorapok Labs Official Protocol</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://lorapok.tech" target="_blank" rel="noreferrer" className="hover:text-[#00FF41] transition-colors">Lorapok Labs</a>
            <a href="https://github.com/Maijied/Loragent" target="_blank" rel="noreferrer" className="hover:text-[#00FF41] transition-colors">GitHub</a>
            <Link href="/community" className="hover:text-cyan-400 transition-colors">Documentation</Link>
            <Link href="/admin" className="hover:text-purple-400 transition-colors">Mission Control</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
