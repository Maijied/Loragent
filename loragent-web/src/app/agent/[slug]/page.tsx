import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Terminal, Shield, Cpu, Cloud, Globe, Lock, Play, Copy, CheckCircle2, 
  Sparkles, Layers, ArrowLeft, ExternalLink, Code2, Database, Workflow, 
  Activity, Eye, Box, AlertCircle, ArrowUpRight, GitBranch, Key,
  Check, Compass, Zap
} from 'lucide-react';

import allAgentsData from '@/data/all-agents.json';

import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'auto';

export default async function AgentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 1. Try finding in precompiled catalog dataset
  let agent: any = allAgentsData.items.find((item: any) => item.slug === slug || item.slug === `loragent-${slug}`);

  // 2. Dynamic live fallback: read directly from workspace if newly created
  if (!agent) {
    try {
      const root = path.resolve(process.cwd(), '..');
      const agentPath = path.join(root, 'agents', slug.replace(/^loragent-/, ''), 'SKILL.md');
      const skillPath = path.join(root, 'skills', slug.replace(/^loragent-/, ''), 'SKILL.md');
      const targetFile = fs.existsSync(agentPath) ? agentPath : (fs.existsSync(skillPath) ? skillPath : null);

      if (targetFile) {
        const raw = fs.readFileSync(targetFile, 'utf8');
        agent = {
          id: slug,
          slug,
          name: slug.replace(/^loragent-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          type: targetFile.includes('agents') ? 'AGENT' : 'SKILL',
          category: 'ENGINEERING',
          formation: 'auto',
          layer: 'CROSS',
          version: '2.0.0',
          description: `Live discovered dynamic agent specification.`,
          objective: raw.slice(0, 600),
          allowedTools: ['filesystem_read', 'filesystem_write', 'loragent_steer'],
          tags: ['dynamic', 'loragent'],
          connectors: ['loragent-core', 'filesystem'],
          isResident: false,
          costTier: 'Optimal',
        };
      }
    } catch {}
  }

  if (!agent) {
    notFound();
  }

  // Find other agents in same squad formation
  const squadPeers = allAgentsData.items.filter(
    (item: any) => item.formation === agent.formation && item.slug !== agent.slug
  ).slice(0, 4);

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
            <span>Back to Marketplace</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/marketplace"
              className="text-xs font-medium text-neutral-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 border border-white/5"
            >
              Explore Catalog
            </Link>
            <Link
              href="/wiki"
              className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20"
            >
              Architecture Wiki
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Agent Hero Banner */}
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 sm:p-10 backdrop-blur-xl overflow-hidden mb-12 shadow-[0_0_50px_rgba(123,47,190,0.15)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {agent.formation} Squad
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-white/5 text-neutral-400 border border-white/10">
                  {agent.layer} Layer
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v{agent.version || '2.0.0'}
                </span>
                {agent.isResident && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Resident Hub ($&lt;40k$ context)
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                {agent.name}
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
                {agent.description}
              </p>
            </div>

            {/* Quick Actions Card */}
            <div className="w-full md:w-80 rounded-2xl border border-white/10 bg-black/60 p-5 space-y-4 backdrop-blur-md">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>Quick Summon Command</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-xs text-purple-300 break-all select-all flex items-center justify-between gap-2">
                <code>{agent.summonCmd || `/loragent:${agent.slug.replace(/^loragent-/, '')}`}</code>
              </div>

              <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-cyan-400" />
                <span>CLI Install Directive</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-[11px] text-neutral-300 break-all select-all">
                <code>{agent.installCmd || `npx -y @lorapok/loragent@latest install ${agent.slug}`}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Specification Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left 2 Cols: Objective & Tools */}
          <div className="lg:col-span-2 space-y-8">
            {/* Primary Objective */}
            <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Primary Objective & Responsibilities</span>
              </h2>
              <div className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                {agent.objective || agent.description}
              </div>
            </section>

            {/* Allowed Tools & Sandboxing */}
            <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Allowed Tools & Capability Permissions</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(agent.allowedTools || []).map((tool: string, idx: number) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2.5 font-mono text-xs text-neutral-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-white">{tool}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* System Connectors & Integration */}
            <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-cyan-400" />
                <span>System Connectors & Lifecycle Triggers</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {(agent.connectors || ['loragent-core', 'filesystem']).map((conn: string, idx: number) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono"
                  >
                    {conn}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Metadata & Squad */}
          <div className="space-y-6">
            {/* Metadata Card */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                Agent Telemetry
              </h3>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-neutral-500">Resource Type</span>
                  <span className="text-white font-semibold">{agent.type}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-neutral-500">Category</span>
                  <span className="text-purple-300">{agent.category}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-neutral-500">Execution Tier</span>
                  <span className="text-emerald-400">{agent.costTier || 'Optimal'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-neutral-500">Requires Confirmation</span>
                  <span className={agent.requiresConfirmation ? 'text-amber-400' : 'text-neutral-400'}>
                    {agent.requiresConfirmation ? 'Yes (Safety Guard)' : 'Auto Execution'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-neutral-500">Can Spawn Subagents</span>
                  <span className="text-cyan-400">{agent.canSpawnSubagents ? 'True' : 'False'}</span>
                </div>
              </div>

              {agent.tags && agent.tags.length > 0 && (
                <div className="pt-2">
                  <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-2">
                    Indexed Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 rounded bg-white/5 text-[11px] text-neutral-400 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Squad Matrix Peers */}
            {squadPeers.length > 0 && (
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                  {agent.formation} Squad Matrix
                </h3>
                <div className="space-y-2.5">
                  {squadPeers.map((peer: any) => (
                    <Link
                      key={peer.slug}
                      href={`/agent/${peer.slug}`}
                      className="block p-3 rounded-xl bg-black/30 hover:bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-200 group-hover:text-purple-300 transition-colors">
                          {peer.name}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-purple-400 transition-colors" />
                      </div>
                      <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                        {peer.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
