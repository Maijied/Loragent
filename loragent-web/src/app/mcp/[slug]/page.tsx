import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Server, ArrowLeft, ArrowUpRight, Terminal, Code2, Globe, CheckCircle2, 
  Layers, Shield, Box, Sparkles, Zap
} from 'lucide-react';

import allAgentsData from '@/data/all-agents.json';

export async function generateStaticParams() {
  const mcps = allAgentsData.items.filter((item: any) => item.type === 'MCP SERVER');
  return mcps.map((mcp: any) => ({
    slug: mcp.slug,
  }));
}

export default async function McpDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mcp = allAgentsData.items.find((item: any) => item.slug === slug);

  if (!mcp) {
    notFound();
  }

  const otherMcps = allAgentsData.items.filter(
    (item: any) => item.type === 'MCP SERVER' && item.slug !== mcp.slug
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* MCP Hero Banner */}
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 sm:p-10 backdrop-blur-xl overflow-hidden mb-12 shadow-[0_0_50px_rgba(0,255,200,0.1)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                MCP SERVER
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-white/5 text-neutral-400 border border-white/10">
                {mcp.category}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v2.0.0 Standard
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight flex items-center gap-3">
              <Server className="w-8 h-8 text-cyan-400" />
              <span>{mcp.name}</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
              {mcp.description}
            </p>
          </div>
        </div>

        {/* Configuration Snippet */}
        <div className="space-y-8">
          <section className="rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-md">
            <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2 font-mono">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>IDE Configuration (.mcp.json snippet)</span>
            </h2>
            <div className="p-4 rounded-xl bg-black/80 border border-white/5 font-mono text-xs text-neutral-200 overflow-x-auto select-all">
              <pre>
{JSON.stringify({
  mcpServers: {
    [mcp.slug.replace(/^mcp-/, '')]: {
      command: (mcp as any).command || "node",
      args: (mcp as any).args || [`/path/to/loragent/port/mcp/${mcp.slug}.js`],
      env: {
        LORAGENT_WORKSPACE: "${workspaceFolder}"
      }
    }
  }
}, null, 2)}
              </pre>
            </div>
          </section>

          {/* Quick CLI Auto-Binding */}
          <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
            <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2 font-mono">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Automated Multi-IDE Synchronization</span>
            </h2>
            <p className="text-xs text-neutral-400 mb-3">
              Run this single command to automatically bind this MCP server across Cursor, Claude Code, Antigravity, and Windsurf:
            </p>
            <div className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-purple-300 select-all">
              <code>loragent sync</code>
            </div>
          </section>

          {/* Other MCPs */}
          {otherMcps.length > 0 && (
            <section className="pt-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono mb-4">
                Other MCP Connectors in Loragent Ecosystem
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherMcps.map((other: any) => (
                  <Link
                    key={other.slug}
                    href={`/mcp/${other.slug}`}
                    className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all group block"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {other.name}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2">
                      {other.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
