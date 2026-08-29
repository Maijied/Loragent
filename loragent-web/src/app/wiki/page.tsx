'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  BookOpen, ArrowLeft, Search, Terminal, Layers, Shield, Cpu, 
  Workflow, CheckCircle2, ChevronRight, Copy, Check, Sparkles,
  Server, Lock, Eye, Compass, Code2, Zap
} from 'lucide-react';

const CHAPTERS = [
  {
    id: 'overview',
    number: '01',
    title: 'System Overview & Key Metrics',
    icon: Compass,
    badge: 'Hub & Spoke',
    summary: '224-agent virtual software firm operating on Hub-and-Spoke topology with strict token budgeting.'
  },
  {
    id: 'lldp',
    number: '02',
    title: 'LLDP 5-Layer Architecture',
    icon: Layers,
    badge: 'Protocol Spec',
    summary: 'FACE (CLI/Web), PULSE (State/Hooks), LORE (Agents/Skills), PORT (MCP/API), LOOM (Multi-IDE sync).'
  },
  {
    id: 'formations',
    number: '03',
    title: 'The 6 Squad Formations',
    icon: Workflow,
    badge: 'Squad Matrices',
    summary: 'Auto-Team, Enterprise Office, Chela Debugger, Freelance Isolation, Observer, and Spidernet DAG.'
  },
  {
    id: 'cli',
    number: '04',
    title: 'Master CLI Commands & Tooling',
    icon: Terminal,
    badge: 'Developer Tooling',
    summary: 'CLI commands: autopilot, server, sync, list, discover, analyze, publish, mcp.'
  },
  {
    id: 'discovery',
    number: '05',
    title: 'Universal PC Discovery & Deduplication',
    icon: Search,
    badge: 'Smart Indexing',
    summary: '4,349+ skills scanned, intelligent slug normalization, 0-100 quality scoring, and clone reduction.'
  },
  {
    id: 'ingest',
    number: '06',
    title: 'Web Ingest & Artifact Factory Pipeline',
    icon: Sparkles,
    badge: 'Auto Generation',
    summary: 'Autonomous ingestion of remote URLs and polyglot repos into compliant SKILL.md specs.'
  },
  {
    id: 'mcp',
    number: '07',
    title: 'MCP Server Registry & Cloudflare Edge',
    icon: Server,
    badge: 'Model Context Protocol',
    summary: '20 native & Cloudflare Edge MCP servers (Workers, D1, KV, Vectorize, Observability).'
  },
  {
    id: 'security',
    number: '08',
    title: 'Zero-Trust Security & Pre-Push Encryption',
    icon: Lock,
    badge: 'TiTi Vault',
    summary: 'Machine AES-256 vault, automated pre-push code minification and .titi.enc containerization.'
  },
  {
    id: 'sync',
    number: '09',
    title: 'Multi-IDE Synchronization & Compatibility',
    icon: Code2,
    badge: '8 IDEs Supported',
    summary: 'Universal compilation to Cursor (.mdc), Claude (CLAUDE.md), Windsurf, Cline, Roo Code, VS Code.'
  },
  {
    id: 'telemetry',
    number: '10',
    title: 'Verification, Telemetry & Watchman Recovery',
    icon: Eye,
    badge: 'Fault Tolerance',
    summary: 'Chorki self-healing continuous loop, check-done lifecycle hook, and ephemeral watchman cache.'
  },
  {
    id: 'uniques',
    number: '11',
    title: 'Proprietary Uniques & Structural Innovations',
    icon: Zap,
    badge: 'The Loragent Moat',
    summary: '8 core structural innovations: 3-tier token budget, biological UI, 6D chaos vault, universal PC discovery.'
  }
];

export default function WikiPage() {
  const [selectedChapterId, setSelectedChapterId] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeChapter = useMemo(() => {
    return CHAPTERS.find(c => c.id === selectedChapterId) || CHAPTERS[0];
  }, [selectedChapterId]);

  const filteredChapters = useMemo(() => {
    if (!searchQuery) return CHAPTERS;
    const q = searchQuery.toLowerCase();
    return CHAPTERS.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.summary.toLowerCase().includes(q) ||
      c.badge.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#06060A] text-neutral-200">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#06060A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20">
              Wiki v2.0.0 Standard
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar: Chapter List */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search architecture wiki..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="space-y-1.5 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
              {filteredChapters.map((chapter) => {
                const Icon = chapter.icon;
                const isSelected = chapter.id === selectedChapterId;
                return (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedChapterId(chapter.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected 
                        ? 'bg-purple-500/15 border-purple-500/40 text-white shadow-[0_0_20px_rgba(123,47,190,0.2)]'
                        : 'bg-white/[0.01] border-white/5 text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-neutral-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-mono text-purple-400 font-semibold">
                          CH {chapter.number}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-neutral-400">
                          {chapter.badge}
                        </span>
                      </div>
                      <div className="text-xs font-semibold truncate text-white">
                        {chapter.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Main Content: Chapter Details */}
          <main className="lg:col-span-8 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                  <div className="text-xs font-mono text-purple-400 font-semibold mb-1">
                    CHAPTER {activeChapter.number}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {activeChapter.title}
                  </h1>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {activeChapter.badge}
                </span>
              </div>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                {activeChapter.summary}
              </p>

              {/* Dynamic Content based on Chapter */}
              {activeChapter.id === 'overview' && (
                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                    <div className="text-purple-300 font-semibold">📊 Ecosystem Metrics Matrix:</div>
                    <ul className="space-y-1 text-neutral-300 pl-4 list-disc">
                      <li>Total Catalog Items: 250 (224 Agents, 20 MCP Servers, 6 Formations)</li>
                      <li>Resident Orchestration Set: 5 Agents (&lt;40k tokens pinned)</li>
                      <li>Domain Specialists: 219 Agents (summoned on-demand via JSON-RPC)</li>
                      <li>Multi-IDE Support: Cursor, Claude Code, Antigravity, Windsurf, VS Code, Roo Code, Cline, Kiro</li>
                      <li>Passing Test Suites: 44/44 Suites (100% Green)</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeChapter.id === 'uniques' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-200">
                    <span className="font-semibold">The 8 Loragent Moats:</span>
                    <ol className="mt-2 space-y-2 pl-4 list-decimal text-neutral-300 font-mono">
                      <li><strong className="text-white">Hub-and-Spoke 3-Tier Dynamic Token Budgeting:</strong> 5 resident agents (&lt;40k tokens), 219 lazy-loaded over JSON-RPC.</li>
                      <li><strong className="text-white">Biological & Sensory UI Aesthetics:</strong> Obsidian #0a0a0f, Lorapok Violet #7B2FBE, glassmorphic blur.</li>
                      <li><strong className="text-white">Zero-Knowledge 6D Hyperchaotic Vault:</strong> Runge-Kutta 6D differential attractor + DNA codon nucleotide diffusion.</li>
                      <li><strong className="text-white">Universal 8-IDE Cross-Compatibility Engine:</strong> Single source compiles to .cursor, CLAUDE.md, .roomodes simultaneously.</li>
                      <li><strong className="text-white">Universal PC Asset Auto-Discovery Engine:</strong> loragent discover scans 4,349+ skills, normalizes slugs, filters clones.</li>
                      <li><strong className="text-white">Autonomous Web & Project Ingestion Pipeline:</strong> Ingests URLs and repos into full SKILL.md specs.</li>
                      <li><strong className="text-white">Self-Healing Continuous Verification Loop:</strong> Chorki loop + check-done hook + inspector RCA.</li>
                      <li><strong className="text-white">Cross-Device Machine Fingerprint Handshake:</strong> Mutual hardware key verification.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Code Snippet Box */}
              <div className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs text-neutral-200">
                <div className="flex items-center justify-between mb-2 text-neutral-400">
                  <span>Directive Execution</span>
                  <button
                    onClick={() => handleCopy('loragent discover -f react', 'ch-code')}
                    className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                  >
                    {copiedCode === 'ch-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'ch-code' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <code className="text-emerald-400">
                  loragent sync && loragent discover --category engineering
                </code>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
