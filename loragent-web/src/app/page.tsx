'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Terminal, Shield, Cpu, Cloud, Globe, Lock, Play, CheckCircle2, 
  Copy, Check, Sparkles, Layers, Search, Server, RefreshCw, Zap,
  ChevronRight, ExternalLink, Code2, Database, Workflow, Radio
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All 174 Agents', count: 174 },
  { id: 'core', label: 'Core Formations', count: 12 },
  { id: 'cloud', label: 'Cloud & DevOps', count: 18 },
  { id: 'backend', label: 'Backend & APIs', count: 28 },
  { id: 'frontend', label: 'Frontend & UI/UX', count: 24 },
  { id: 'qa', label: 'SQA & Testing', count: 14 },
  { id: 'security', label: 'Security & Auth', count: 10 },
  { id: 'business', label: 'Business & Office', count: 22 },
  { id: 'specialist', label: 'Specialist Domain', count: 46 }
];

const SAMPLE_AGENTS = [
  { name: 'loragent-boss', role: 'Central Intelligent Routing Hub', cat: 'core', formation: 'Supreme Boss', tags: ['Orchestrator', 'Routing', 'Formations'] },
  { name: 'loragent-tech-director', role: 'Chief Software Architect', cat: 'core', formation: 'Auto Team', tags: ['Architecture', 'LLDP', 'System Design'] },
  { name: 'loragent-backend-se', role: 'Senior Backend Engineer', cat: 'backend', formation: 'Auto Team', tags: ['Node.js', 'APIs', 'PostgreSQL', 'FastAPI'] },
  { name: 'loragent-frontend-se', role: 'Senior Frontend Engineer', cat: 'frontend', formation: 'Auto Team', tags: ['Next.js', 'Tailwind', 'Sensory UI', 'React'] },
  { name: 'loragent-sqa', role: 'Senior Software Quality Assurance', cat: 'qa', formation: 'Auto Team', tags: ['Unit Tests', 'E2E', 'Security Audit'] },
  { name: 'loragent-cicd-specialist', role: 'Release & CI/CD Pipeline Engineer', cat: 'cloud', formation: 'Auto Team', tags: ['GitHub Actions', 'Cloudflare', 'AMO', 'VSCE'] },
  { name: 'loragent-chorki', role: 'Autonomous Relentless Loop Engine', cat: 'core', formation: 'Autopilot', tags: ['Autonomous Loop', 'Lifecycle Hooks', 'Verification'] },
  { name: 'loragent-wrangler-specialist', role: 'Cloudflare Developer Platform Lead', cat: 'cloud', formation: 'Cloud Specialist', tags: ['Workers', 'Pages', 'D1', 'KV', 'R2', 'Vectorize'] },
  { name: 'loragent-firebase-specialist', role: 'Firebase Ecosystem & Firestore Architect', cat: 'cloud', formation: 'Cloud Specialist', tags: ['Firestore', 'Functions v2', 'Auth', 'Rules'] },
  { name: 'loragent-azure-cloud-specialist', role: 'Microsoft Azure Cloud Engineer', cat: 'cloud', formation: 'Cloud Specialist', tags: ['Container Apps', 'Cosmos DB', 'Key Vault', 'az'] },
  { name: 'loragent-gcp-specialist', role: 'Google Cloud Platform & BigQuery Expert', cat: 'cloud', formation: 'Cloud Specialist', tags: ['Cloud Run', 'BigQuery', 'GCS', 'gcloud'] },
  { name: 'loragent-aws-specialist', role: 'AWS Serverless & Infrastructure Lead', cat: 'cloud', formation: 'Cloud Specialist', tags: ['Lambda', 'S3', 'ECS', 'DynamoDB', 'aws'] },
  { name: 'loragent-gh-cli-specialist', role: 'GitHub Automation & PR Specialist', cat: 'cloud', formation: 'DevOps', tags: ['gh CLI', 'PR Automation', 'Releases', 'Secrets'] },
  { name: 'loragent-docker-specialist', role: 'Containerization & Docker Specialist', cat: 'cloud', formation: 'DevOps', tags: ['Docker', 'Compose', 'Multi-Stage', 'Images'] },
  { name: 'loragent-bug-hunter', role: 'The Chela Problem Solver', cat: 'core', formation: 'Chela Debugging', tags: ['Bug Hunter', 'Root Cause', 'Telemetry'] },
  { name: 'loragent-workspace-guard', role: 'Zero-Trust Security & Destructive Guard', cat: 'security', formation: 'Security Enclave', tags: ['Guardrails', 'Zero-Trust', 'Audit'] },
  { name: 'loragent-watchman', role: 'System Context & Orchestration Graph', cat: 'core', formation: 'System Watcher', tags: ['Context Mapping', 'State Cache', 'Resumption'] },
  { name: 'loragent-project-coordinator', role: 'Enterprise Business Operations Lead', cat: 'business', formation: 'Office Matrix', tags: ['Strategy', 'Roadmap', 'Milestones'] },
  { name: 'loragent-3d-designer', role: 'Three.js & WebGL Sensory Visualizer', cat: 'specialist', formation: 'Freelance', tags: ['Three.js', 'WebGL', 'Shaders', 'Blender'] },
  { name: 'loragent-rust-expert', role: 'High-Performance Rust Systems Engineer', cat: 'backend', formation: 'Freelance', tags: ['Rust', 'WebAssembly', 'Memory Safety'] }
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'autopilot' | 'multicloud' | 'cloudflare-mcp' | 'vault' | 'sdk'>('autopilot');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [mcpIdeTab, setMcpIdeTab] = useState<'cursor' | 'vscode' | 'gemini' | 'windsurf' | 'claude' | 'opencode'>('cursor');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredAgents = useMemo(() => {
    return SAMPLE_AGENTS.filter(agent => {
      const matchesCat = selectedCategory === 'all' || agent.cat === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#030704] text-gray-100 font-sans selection:bg-[#00FF41]/30 selection:text-[#00FF41]">
      
      {/* Background Animated Cyber Ambient Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[15%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-[#00FF41]/10 blur-[140px]" />
        <div className="absolute top-[35%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-cyan-600/10 blur-[160px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[35vw] h-[35vw] rounded-full bg-purple-600/10 blur-[150px]" />
        <div className="fixed inset-0 opacity-[0.03] bg-[radial-gradient(#00FF41_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-[#00FF41]/20 sticky top-0 bg-[#030704]/90 backdrop-blur-xl z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#00FF41] to-cyan-400 p-[1px] shadow-[0_0_15px_rgba(0,255,65,0.4)]">
              <div className="w-full h-full bg-[#030704] rounded-lg flex items-center justify-center font-mono font-black text-[#00FF41] text-base">
                &gt;_
              </div>
            </div>
            <div>
              <span className="font-mono font-black text-white text-lg tracking-wider">LORAGENT</span>
              <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30">v1.0.0_LLDP</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-gray-300">
            <a href="#architecture" className="hover:text-[#00FF41] transition-colors">Architecture</a>
            <a href="#formations" className="hover:text-[#00FF41] transition-colors">Formations</a>
            <a href="#multicloud" className="hover:text-cyan-400 transition-colors">Multi-Cloud</a>
            <a href="#mcp-suite" className="hover:text-cyan-400 transition-colors">Cloudflare MCP</a>
            <a href="#agents" className="hover:text-[#00FF41] transition-colors">174 Agents</a>
            <a href="#sdk" className="hover:text-purple-400 transition-colors">SDK</a>
            <Link href="/community" className="hover:text-cyan-400 transition-colors">Wiki &amp; Docs</Link>
            <Link href="/admin" className="hover:text-purple-400 transition-colors">Admin Panel</Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/30 text-[11px] font-mono text-[#00FF41]">
              <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-ping" />
              174 AGENTS ONLINE
            </div>
            <a 
              href="#mcp-suite"
              className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-[#00FF41] text-black rounded-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,65,0.4)]"
            >
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
            <span className="text-cyan-400">174 CONSTITUENT AGENTS</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] text-white">
                Autonomous <br />
                <span className="bg-gradient-to-r from-[#00FF41] via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Multi-Agent Power
                </span> <br />
                At Cloud Scale.
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-2xl font-sans leading-relaxed">
                Loragent is the universal virtual office protocol by Lorapok Labs. It synchronizes <strong>174 specialized AI agents</strong> across Antigravity, Cursor, Claude Code, Windsurf, and VS Code with zero-trust machine-encrypted credentials, multi-cloud automated execution, and Cloudflare Workers edge deployment.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="#sdk" 
                  className="px-6 py-3.5 bg-[#00FF41] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-[0_0_25px_rgba(0,255,65,0.4)] flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4" />
                  Install Loragent SDK
                </a>
                <a 
                  href="#mcp-suite" 
                  className="px-6 py-3.5 border border-cyan-500/40 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-900/30 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
                >
                  <Cloud className="w-4 h-4" />
                  Cloudflare Edge MCP
                </a>
                <Link 
                  href="/community" 
                  className="px-6 py-3.5 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
                >
                  <Workflow className="w-4 h-4" />
                  Wiki &amp; Docs
                </Link>
              </div>

              {/* Metrics Highlights Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-2xl font-black font-mono text-white">174</div>
                  <div className="text-[11px] text-gray-400 font-mono uppercase">AI Agents</div>
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-[#00FF41]">4</div>
                  <div className="text-[11px] text-gray-400 font-mono uppercase">Dynamic Formations</div>
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-cyan-400">7+</div>
                  <div className="text-[11px] text-gray-400 font-mono uppercase">Cloud Platforms</div>
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-purple-400">100%</div>
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
                    <span className="ml-2 font-mono text-[11px] text-gray-400">loragent-terminal ~ lldp-core</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#00FF41] px-2 py-0.5 rounded bg-[#00FF41]/10 border border-[#00FF41]/30">
                    LIVE
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
                <div className="p-5 font-mono text-xs space-y-3 bg-black/95 min-h-[300px]">
                  {activeTab === 'autopilot' && (
                    <div className="space-y-2">
                      <div className="text-gray-400"><span className="text-[#00FF41]">root@lorapok:~$</span> loragent autopilot &quot;Build &amp; Deploy Cloud Architecture&quot;</div>
                      <div className="text-gray-500">[PULSE] StateWatcher active • [LORE] Boss analyzing intent...</div>
                      <div className="text-cyan-400">▶ [AUTO TEAM] Summoning loragent-tech-director, loragent-backend-se, loragent-frontend-se, loragent-sqa</div>
                      <div className="text-purple-400">🌀 [CHORKI ENGINE] Iteration 1/5 • Executing steps...</div>
                      <div className="text-yellow-300">🔍 [HOOK TRIGGER] Executing check-done lifecycle validator...</div>
                      <div className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>All verification checks passed (Builds: PASS, Tests: 15/15 PASS, MCP: SYNCED)</span>
                      </div>
                      <div className="text-white font-bold">🎉 Task Completed successfully in 1 iteration!</div>
                      <div className="text-[#00FF41] animate-pulse">root@lorapok:~$ █</div>
                    </div>
                  )}

                  {activeTab === 'multicloud' && (
                    <div className="space-y-2">
                      <div className="text-gray-400"><span className="text-[#00FF41]">root@lorapok:~$</span> node -e &quot;import('loragent').then(m =&gt; m.executeCLI('wrangler deploy'))&quot;</div>
                      <div className="text-gray-500">[CLI_RUNNER] Intercepting command for zero-trust credential injection...</div>
                      <div className="text-blue-400">🔐 Decrypted vault token for CLOUDFLARE_API_KEY from .env enclave</div>
                      <div className="text-cyan-400">⛅ Uploading Worker mcp to Cloudflare Global Edge...</div>
                      <div className="text-emerald-400">✅ Deployed triggers: https://mcp.lorapk-labs.workers.dev (Version: 7224177e)</div>
                      <div className="text-gray-400"><span className="text-[#00FF41]">root@lorapok:~$</span> loragent exec &quot;gh release create v1.0.0&quot;</div>
                      <div className="text-emerald-400">✅ GH_TOKEN auto-injected from Cred Vault. Release published.</div>
                    </div>
                  )}

                  {activeTab === 'cloudflare-mcp' && (
                    <div className="space-y-2">
                      <div className="text-gray-400"><span className="text-[#00FF41]">root@lorapok:~$</span> curl -s https://mcp.lorapk-labs.workers.dev/health</div>
                      <div className="text-green-400 p-3 bg-[#050c05] rounded border border-green-900/50 overflow-x-auto">
{`{
  "status": "healthy",
  "service": "loragent-mcp-cloud",
  "version": "1.0.0",
  "totalAgents": 174,
  "edgeRegion": "Cloudflare Global",
  "timestamp": "2026-08-29T07:15:00.000Z"
}`}
                      </div>
                      <div className="text-cyan-400">⚡ Available Tools: loragent_exec_cli, loragent_summon_agent, loragent_steer, loragent_checkpoint_save</div>
                    </div>
                  )}

                  {activeTab === 'vault' && (
                    <div className="space-y-2">
                      <div className="text-gray-400"><span className="text-[#00FF41]">root@lorapok:~$</span> cat .env</div>
                      <div className="text-yellow-400 p-3 bg-[#0a0802] rounded border border-yellow-900/50">
                        <div>LORAGENT_VAULT_ENCRYPTED_PIN=&quot;b8c8fb7994ccd180784faa9609367f60&quot;</div>
                        <div>LORAGENT_VAULT_IV=&quot;536fa5491e6f6b90683f1a73a7bb524e&quot;</div>
                      </div>
                      <div className="text-gray-500">Algorithm: AES-256-CBC • Machine-Derived SHA-256 Key</div>
                      <div className="text-emerald-400">🔒 Zero Plaintext PINs across all git tracked files.</div>
                    </div>
                  )}

                  {activeTab === 'sdk' && (
                    <div className="space-y-2">
                      <div className="text-purple-400">// TypeScript / JavaScript SDK</div>
                      <div className="text-gray-300 p-3 bg-[#0c0514] rounded border border-purple-900/50 overflow-x-auto">
{`import { LoragentClient, LoragentBoss, LoragentChorki } from 'loragent';

const client = new LoragentClient();
const boss = new LoragentBoss();
const chorki = new LoragentChorki();

// Summon specialist & execute
await boss.initAutoTeam('Deploy scalable API');
const res = await chorki.runLoop('Verify tests and build');`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 01 // LLDP SYSTEM ARCHITECTURE */}
        {/* ========================================================================= */}
        <section id="architecture" className="space-y-8 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#00FF41]/20 pb-4">
            <div>
              <div className="text-xs font-mono text-[#00FF41] uppercase tracking-widest font-bold">01 // LAYERED ARCHITECTURE</div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">The 5 LLDP Architectural Layers</h2>
            </div>
            <div className="text-xs font-mono text-gray-400">
              LORAPOK LABS DESIGN PATTERN (LLDP)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                id: 'FACE',
                title: 'User Interface & CLI',
                desc: 'Commander.js CLI, slash commands (/loragent-boss, /autopilot), and interactive IDE shell routing.',
                path: 'face/cli/',
                color: 'emerald',
                badge: 'LAYER 1'
              },
              {
                id: 'PULSE',
                title: 'Daemon & Telemetry',
                desc: 'Continuous StateWatcher background daemon, session telemetry, OpenTelemetry tracing, and heartbeat.',
                path: 'pulse/daemon/',
                color: 'cyan',
                badge: 'LAYER 2'
              },
              {
                id: 'LORE',
                title: 'Intelligence & Roster',
                desc: 'Model orchestration, strict requirement normalization by Teacher, and 174-agent asset catalog.',
                path: 'lore/models/',
                color: 'purple',
                badge: 'LAYER 3'
              },
              {
                id: 'PORT',
                title: 'MCP & Multi-Cloud',
                desc: 'Cloudflare Workers edge MCP server, local stdio server, and zero-trust multi-cloud CLI tool runners.',
                path: 'port/mcp/',
                color: 'blue',
                badge: 'LAYER 4'
              },
              {
                id: 'LOOM',
                title: 'Workflows & Hooks',
                desc: 'Dependency injection container, Chorki autonomous loop, durable checkpoints, and check-done lifecycle hooks.',
                path: 'loom/',
                color: 'green',
                badge: 'LAYER 5'
              }
            ].map((layer) => (
              <div 
                key={layer.id}
                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#00FF41] transition-all group relative space-y-4"
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{layer.badge}</span>
                  <span className="text-green-500 group-hover:animate-pulse">●</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black font-mono text-white tracking-wider group-hover:text-[#00FF41] transition-colors">{layer.id}</h3>
                  <div className="text-xs font-semibold text-gray-300">{layer.title}</div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">{layer.desc}</p>
                <div className="pt-3 border-t border-white/5 font-mono text-[10px] text-gray-500">
                  DIR: <code>{layer.path}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 02 // 4 DYNAMIC FORMATIONS */}
        {/* ========================================================================= */}
        <section id="formations" className="space-y-8 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#00FF41]/20 pb-4">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">02 // ORCHESTRATION ENGINE</div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">4 Dynamic Formation Modes</h2>
            </div>
            <div className="text-xs font-mono text-gray-400">
              ORCHESTRATED BY LORAGENT-BOSS
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Auto Team */}
            <div className="p-6 rounded-2xl glass-panel border border-emerald-500/30 space-y-4 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Auto Team Matrix</h3>
                <div className="text-xs font-mono text-emerald-400">Full-Stack Development</div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Standard engineering formation for rapid, zero-regression feature development, testing, and deployment.
              </p>
              <div className="pt-3 border-t border-emerald-900/40 space-y-1.5 font-mono text-xs text-gray-300">
                <div className="text-emerald-400 font-semibold">• loragent-tech-director (Lead)</div>
                <div>• loragent-backend-se</div>
                <div>• loragent-frontend-se</div>
                <div>• loragent-sqa</div>
                <div>• loragent-cicd-specialist</div>
              </div>
              <div className="pt-2 font-mono text-[11px] text-gray-500">
                Command: <code>/loragent-boss auto</code>
              </div>
            </div>

            {/* 2. Enterprise Office */}
            <div className="p-6 rounded-2xl glass-panel-cyan border border-cyan-500/30 space-y-4 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Enterprise Office</h3>
                <div className="text-xs font-mono text-cyan-400">Business &amp; Operations</div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Full-scale business operations, product coordination, marketing, documentation, publishing, and PR.
              </p>
              <div className="pt-3 border-t border-cyan-900/40 space-y-1.5 font-mono text-xs text-gray-300">
                <div className="text-cyan-400 font-semibold">• loragent-project-coordinator</div>
                <div>• loragent-project-manager</div>
                <div>• loragent-marketing-strategy</div>
                <div>• loragent-publisher</div>
                <div>• loragent-pr-specialist</div>
              </div>
              <div className="pt-2 font-mono text-[11px] text-gray-500">
                Command: <code>/loragent-boss office</code>
              </div>
            </div>

            {/* 3. Freelance Specialist */}
            <div className="p-6 rounded-2xl glass-panel-purple border border-purple-500/30 space-y-4 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Freelance Isolation</h3>
                <div className="text-xs font-mono text-purple-400">On-Demand Specialists</div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                140+ highly specialized domain experts dynamically loaded into context via MCP to conserve token bandwidth.
              </p>
              <div className="pt-3 border-t border-purple-900/40 space-y-1.5 font-mono text-xs text-gray-300">
                <div className="text-purple-400 font-semibold">• loragent-3d-designer (WebGL)</div>
                <div>• loragent-rust-expert</div>
                <div>• loragent-database-designer</div>
                <div>• loragent-logo-designer</div>
                <div>• loragent-wrangler-specialist</div>
              </div>
              <div className="pt-2 font-mono text-[11px] text-gray-500">
                Command: <code>loragent summon &lt;name&gt;</code>
              </div>
            </div>

            {/* 4. Chela Debugging */}
            <div className="p-6 rounded-2xl glass-panel border border-red-500/30 space-y-4 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Chela Debugging</h3>
                <div className="text-xs font-mono text-red-400">Root Cause Resolution</div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Mission-critical bug hunting and deep troubleshooting protocol. Parses orchestration graphs to fix complex regressions.
              </p>
              <div className="pt-3 border-t border-red-900/40 space-y-1.5 font-mono text-xs text-gray-300">
                <div className="text-red-400 font-semibold">• loragent-bug-hunter (Lead)</div>
                <div>• loragent-shift-engineer</div>
                <div>• loragent-git-specialist</div>
                <div>• loragent-inspector (RCA)</div>
                <div>• loragent-debugger</div>
              </div>
              <div className="pt-2 font-mono text-[11px] text-gray-500">
                Command: <code>/loragent-boss chela</code>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 03 // MULTI-CLOUD PLATFORM & CLI RUNNERS */}
        {/* ========================================================================= */}
        <section id="multicloud" className="space-y-8 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#00FF41]/20 pb-4">
            <div>
              <div className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">03 // TOOL RUNNERS &amp; PLATFORMS</div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Multi-Cloud Execution &amp; Credential Enclave</h2>
            </div>
            <div className="text-xs font-mono text-gray-400">
              ZERO-TRUST AUTO-INJECTION (sdk/tools/cli-runner.js)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Cloudflare Platform',
                cli: 'wrangler',
                desc: 'Workers, Pages, D1 SQL, KV, R2, Vectorize, Queues, Hyperdrive.',
                vars: ['CLOUDFLARE_API_KEY', 'CLOUDFLARE_EMAIL', 'CLOUDFLARE_ACCOUNT_ID'],
                badge: '⛅ Cloudflare'
              },
              {
                name: 'GitHub Platform',
                cli: 'gh / git',
                desc: 'Pull requests, releases, Actions CI/CD workflows, secret sync.',
                vars: ['GH_TOKEN', 'GITHUB_TOKEN'],
                badge: '🐙 GitHub'
              },
              {
                name: 'Firebase Ecosystem',
                cli: 'firebase',
                desc: 'Cloud Firestore, Cloud Functions v2, Hosting, Auth, Security Rules.',
                vars: ['FIREBASE_TOKEN'],
                badge: '🔥 Firebase'
              },
              {
                name: 'Microsoft Azure',
                cli: 'az',
                desc: 'Azure Container Apps, Azure Functions, Cosmos DB, Key Vault.',
                vars: ['AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET', 'AZURE_TENANT_ID'],
                badge: '☁️ Azure'
              },
              {
                name: 'Google Cloud Platform',
                cli: 'gcloud / bq',
                desc: 'Cloud Run, BigQuery, Google Cloud Storage, IAM policies.',
                vars: ['CLOUDSDK_CORE_PROJECT'],
                badge: '🌐 GCP'
              },
              {
                name: 'Amazon Web Services',
                cli: 'aws',
                desc: 'AWS Lambda, S3 Buckets, ECS/EKS, DynamoDB, Secrets Manager.',
                vars: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_DEFAULT_REGION'],
                badge: '🔶 AWS'
              },
              {
                name: 'Vercel Edge Platform',
                cli: 'vercel',
                desc: 'Edge middleware, preview branches, serverless deployments.',
                vars: ['VERCEL_TOKEN'],
                badge: '▲ Vercel'
              },
              {
                name: 'Docker Containers',
                cli: 'docker',
                desc: 'Multi-stage builds, compose stacks, microservices orchestration.',
                vars: ['DOCKER_BUILDKIT'],
                badge: '🐳 Docker'
              }
            ].map((platform, i) => (
              <div key={i} className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-cyan-400 transition-all space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-cyan-400">{platform.badge}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black border border-white/10 text-gray-400">
                    CLI: {platform.cli}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{platform.name}</h3>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">{platform.desc}</p>
                <div className="pt-3 border-t border-white/5 space-y-1">
                  <div className="text-[10px] font-mono text-gray-500 uppercase">Auto-Injected Vault Keys:</div>
                  <div className="flex flex-wrap gap-1">
                    {platform.vars.map((v, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-[#00FF41] border border-[#00FF41]/20">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Workspace Guard Destructive Command Guardrails */}
          <div className="p-6 rounded-2xl glass-panel border border-red-500/30 space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-mono text-sm font-bold">
              <Shield className="w-4 h-4" />
              <span>Workspace Guardrail Active (loragent-workspace-guard)</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              The <code>executeCLI</code> runner intercepts all commands and automatically blocks dangerous destructive patterns unless explicit authorization is granted:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-mono">
              <div className="p-2.5 rounded bg-black/60 border border-red-900/40 text-red-300">❌ rm -rf / or ~</div>
              <div className="p-2.5 rounded bg-black/60 border border-red-900/40 text-red-300">❌ wrangler delete / drop</div>
              <div className="p-2.5 rounded bg-black/60 border border-red-900/40 text-red-300">❌ gh repo delete</div>
              <div className="p-2.5 rounded bg-black/60 border border-red-900/40 text-red-300">❌ az group delete</div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 04 // CLOUDFLARE REMOTE MCP SUITE */}
        {/* ========================================================================= */}
        <section id="mcp-suite" className="space-y-8 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#00FF41]/20 pb-4">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">04 // OFFICIAL CLOUDFLARE MCP</div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Official Cloudflare Remote MCP Suite</h2>
            </div>
            <div className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono border border-emerald-500/40 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              GLOBAL EDGE ACTIVE
            </div>
          </div>

          <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
            Loragent natively connects with the official Cloudflare Remote MCP suite and exposes its own global Cloudflare Worker MCP server (<code>https://mcp.lorapk-labs.workers.dev</code>) for instant access to 174 agents across all AI IDEs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-panel-cyan border border-cyan-500/30 space-y-3">
              <div className="text-xs font-mono text-cyan-400 font-bold">1. Loragent Cloud Edge MCP</div>
              <p className="text-xs text-gray-300">Universal multi-agent edge server with 174 agents, durable checkpoints, and safe CLI runner.</p>
              <div className="p-2.5 rounded bg-black font-mono text-[11px] text-[#00FF41] border border-[#00FF41]/20 truncate">
                https://mcp.lorapk-labs.workers.dev/mcp
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
              <div className="text-xs font-mono text-white font-bold">2. Cloudflare API &amp; Bindings</div>
              <p className="text-xs text-gray-300">Official Code Mode API + Cloudflare Bindings (KV, D1, R2, Vectorize, Queues, Hyperdrive).</p>
              <div className="p-2.5 rounded bg-black font-mono text-[11px] text-cyan-300 border border-white/10 truncate">
                https://mcp.cloudflare.com/mcp
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
              <div className="text-xs font-mono text-purple-400 font-bold">3. Docs, Builds &amp; Observability</div>
              <p className="text-xs text-gray-300">Live Cloudflare documentation search, automated build logs, and real-time observability telemetry.</p>
              <div className="p-2.5 rounded bg-black font-mono text-[11px] text-purple-300 border border-white/10 truncate">
                https://docs.mcp.cloudflare.com/mcp
              </div>
            </div>
          </div>

          {/* 1-Click IDE Config Generator */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-[#00FF41]/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Universal IDE Configuration</h3>
                <p className="text-xs text-gray-400">Copy-paste into your editor config or run <code>loragent sync</code></p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'cursor', label: 'Cursor (mcp.json)' },
                  { id: 'vscode', label: 'VS Code (.vscode/mcp.json)' },
                  { id: 'gemini', label: 'Antigravity / Gemini' },
                  { id: 'windsurf', label: 'Windsurf (serverUrl)' },
                  { id: 'claude', label: 'Claude Code CLI' },
                  { id: 'opencode', label: 'OpenCode (.jsonc)' }
                ].map((ide) => (
                  <button
                    key={ide.id}
                    onClick={() => setMcpIdeTab(ide.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      mcpIdeTab === ide.id
                        ? 'bg-[#00FF41] text-black font-bold'
                        : 'bg-black/60 text-gray-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {ide.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <pre className="p-5 rounded-xl bg-black font-mono text-xs text-gray-200 border border-white/10 overflow-x-auto leading-relaxed">
                {mcpIdeTab === 'cursor' && `{
  "mcpServers": {
    "loragent-cloud": {
      "url": "https://mcp.lorapk-labs.workers.dev/mcp",
      "type": "http"
    },
    "cloudflare": { "url": "https://mcp.cloudflare.com/mcp" },
    "cloudflare-docs": { "url": "https://docs.mcp.cloudflare.com/mcp" },
    "cloudflare-bindings": { "url": "https://bindings.mcp.cloudflare.com/mcp" },
    "cloudflare-builds": { "url": "https://builds.mcp.cloudflare.com/mcp" },
    "cloudflare-observability": { "url": "https://observability.mcp.cloudflare.com/mcp" }
  }
}`}
                {mcpIdeTab === 'vscode' && `{
  "mcpServers": {
    "loragent-cloud": { "url": "https://mcp.lorapk-labs.workers.dev/mcp" },
    "cloudflare": { "url": "https://mcp.cloudflare.com/mcp" },
    "cloudflare-docs": { "url": "https://docs.mcp.cloudflare.com/mcp" },
    "cloudflare-bindings": { "url": "https://bindings.mcp.cloudflare.com/mcp" },
    "cloudflare-builds": { "url": "https://builds.mcp.cloudflare.com/mcp" },
    "cloudflare-observability": { "url": "https://observability.mcp.cloudflare.com/mcp" }
  }
}`}
                {mcpIdeTab === 'gemini' && `{
  "mcpServers": {
    "loragent": {
      "command": "node",
      "args": ["/mnt/NewVolume/Personal_Projects/loragent/port/mcp/server.js"]
    },
    "loragent-cloud": { "url": "https://mcp.lorapk-labs.workers.dev/mcp" },
    "cloudflare": { "url": "https://mcp.cloudflare.com/mcp" },
    "cloudflare-docs": { "url": "https://docs.mcp.cloudflare.com/mcp" }
  }
}`}
                {mcpIdeTab === 'windsurf' && `{
  "mcpServers": {
    "loragent-cloud": { "serverUrl": "https://mcp.lorapk-labs.workers.dev/mcp" },
    "cloudflare": { "serverUrl": "https://mcp.cloudflare.com/mcp" },
    "cloudflare-docs": { "serverUrl": "https://docs.mcp.cloudflare.com/mcp" },
    "cloudflare-bindings": { "serverUrl": "https://bindings.mcp.cloudflare.com/mcp" },
    "cloudflare-builds": { "serverUrl": "https://builds.mcp.cloudflare.com/mcp" },
    "cloudflare-observability": { "serverUrl": "https://observability.mcp.cloudflare.com/mcp" }
  }
}`}
                {mcpIdeTab === 'claude' && `# Run in terminal to install Cloudflare marketplace plugins
claude plugin marketplace add cloudflare/skills
claude plugin install cloudflare@cloudflare

# Then inside Claude Code:
/reload-plugins`}
                {mcpIdeTab === 'opencode' && `{
  "mcp": {
    "loragent-cloud": { "type": "remote", "url": "https://mcp.lorapk-labs.workers.dev/mcp", "enabled": true },
    "cloudflare": { "type": "remote", "url": "https://mcp.cloudflare.com/mcp", "enabled": true, "oauth": {} },
    "cloudflare-docs": { "type": "remote", "url": "https://docs.mcp.cloudflare.com/mcp", "enabled": true },
    "cloudflare-bindings": { "type": "remote", "url": "https://bindings.mcp.cloudflare.com/mcp", "enabled": true, "oauth": {} },
    "cloudflare-builds": { "type": "remote", "url": "https://builds.mcp.cloudflare.com/mcp", "enabled": true, "oauth": {} },
    "cloudflare-observability": { "type": "remote", "url": "https://observability.mcp.cloudflare.com/mcp", "enabled": true, "oauth": {} }
  }
}`}
              </pre>

              <button
                onClick={() => copyToClipboard(
                  mcpIdeTab === 'cursor' ? '{\n  "mcpServers": {\n    "loragent-cloud": {\n      "url": "https://mcp.lorapk-labs.workers.dev/mcp",\n      "type": "http"\n    },\n    "cloudflare": { "url": "https://mcp.cloudflare.com/mcp" },\n    "cloudflare-docs": { "url": "https://docs.mcp.cloudflare.com/mcp" },\n    "cloudflare-bindings": { "url": "https://bindings.mcp.cloudflare.com/mcp" },\n    "cloudflare-builds": { "url": "https://builds.mcp.cloudflare.com/mcp" },\n    "cloudflare-observability": { "url": "https://observability.mcp.cloudflare.com/mcp" }\n  }\n}' :
                  mcpIdeTab === 'windsurf' ? '{\n  "mcpServers": {\n    "loragent-cloud": { "serverUrl": "https://mcp.lorapk-labs.workers.dev/mcp" },\n    "cloudflare": { "serverUrl": "https://mcp.cloudflare.com/mcp" },\n    "cloudflare-docs": { "serverUrl": "https://docs.mcp.cloudflare.com/mcp" }\n  }\n}' : 'loragent sync',
                  'mcp-config'
                )}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition-all"
              >
                {copiedText === 'mcp-config' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText === 'mcp-config' ? 'Copied' : 'Copy Config'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 05 // AGENT EXPLORER CATALOG (174 AGENTS) */}
        {/* ========================================================================= */}
        <section id="agents" className="space-y-8 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#00FF41]/20 pb-4">
            <div>
              <div className="text-xs font-mono text-[#00FF41] uppercase tracking-widest font-bold">05 // ECOSYSTEM ROSTER</div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Interactive Agent Explorer</h2>
            </div>
            <div className="text-xs font-mono text-gray-400">
              174 AGENTS • 22 FUNCTIONAL DOMAINS
            </div>
          </div>

          {/* Search & Category Filter Chips */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents by name, role, skill, or keyword (e.g., wrangler, docker, rust, 3d, boss)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/60 border border-white/10 focus:border-[#00FF41] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 font-mono outline-none transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-[#00FF41] text-black font-bold shadow-[0_0_12px_rgba(0,255,65,0.4)]'
                      : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAgents.map((agent, i) => (
              <div
                key={i}
                className="glass-panel p-5 rounded-xl border border-white/10 hover:border-[#00FF41] transition-all space-y-3 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                      {agent.formation}
                    </span>
                    <button
                      onClick={() => copyToClipboard(`@${agent.name}`, `agent-${i}`)}
                      className="text-gray-500 hover:text-[#00FF41] transition-colors p-1"
                      title="Copy @mention"
                    >
                      {copiedText === `agent-${i}` ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  
                  <h4 className="text-base font-bold font-mono text-white group-hover:text-[#00FF41] transition-colors truncate">
                    {agent.name}
                  </h4>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed line-clamp-2">
                    {agent.role}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-1">
                    {agent.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-gray-400 border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
                    <span>Summon: <code>/{agent.name.replace('loragent-', '')}</code></span>
                    <span className="text-emerald-500">READY</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link 
              href="/community" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-white transition-all"
            >
              <span>View Full 174 Master Roster &amp; Descriptions in Wiki</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 06 // TYPESCRIPT SDK REFERENCE */}
        {/* ========================================================================= */}
        <section id="sdk" className="space-y-8 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#00FF41]/20 pb-4">
            <div>
              <div className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">06 // DEVELOPER SDK</div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">TypeScript &amp; JavaScript SDK Reference</h2>
            </div>
            <div className="text-xs font-mono text-gray-400">
              NPM: loragent • TYPESCRIPT COMPLIANT
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">LoragentClient</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Core JSON-RPC client connecting directly to the Cloudflare Edge Worker or local stdio server.
              </p>
              <div className="font-mono text-xs text-gray-400 space-y-1.5 pt-2 border-t border-white/5">
                <div>• <code>client.searchAgents(query)</code></div>
                <div>• <code>client.summonAgent(name)</code></div>
                <div>• <code>client.dismissAgent(name)</code></div>
                <div>• <code>client.steer(from, to, task)</code></div>
                <div>• <code>client.exec(cmd, options)</code></div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Workflow className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">LoragentBoss</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Formations coordinator managing Auto Team, Enterprise Office, Freelance, and Chela Debugging.
              </p>
              <div className="font-mono text-xs text-gray-400 space-y-1.5 pt-2 border-t border-white/5">
                <div>• <code>boss.initAutoTeam(objective)</code></div>
                <div>• <code>boss.initOffice(objective)</code></div>
                <div>• <code>boss.initChela(objective)</code></div>
                <div>• <code>boss.delegate(agent, prompt)</code></div>
                <div>• <code>boss.getStatus()</code></div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">LoragentChorki</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Relentless autonomous loop engine with durable checkpointing and verification hooks.
              </p>
              <div className="font-mono text-xs text-gray-400 space-y-1.5 pt-2 border-t border-white/5">
                <div>• <code>chorki.runLoop(objective, opts)</code></div>
                <div>• <code>chorki.saveCheckpoint(state)</code></div>
                <div>• <code>chorki.resume(chkId)</code></div>
                <div>• <code>chorki.triggerHook(&apos;check-done&apos;)</code></div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Status Bar */}
      <footer className="border-t border-[#00FF41]/20 bg-black/90 backdrop-blur-md p-6 mt-28 text-xs text-gray-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF41] animate-pulse shadow-[0_0_8px_#00FF41]" />
            <span className="text-white font-bold">LORAGENT ECOSYSTEM</span>
            <span className="text-gray-600">|</span>
            <span className="text-[#00FF41]">174 AGENTS ACTIVE</span>
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <span>CLOUDFLARE EDGE: OPERATIONAL</span>
            <span>VAULT: AES-256-CBC ENCLAVE</span>
            <span>LORAPOK LABS © 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
