'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, ArrowLeft, ArrowUpRight, Filter, Terminal, Shield, 
  Sparkles, Layers, Server, Code2, Check, Copy, Zap, Box
} from 'lucide-react';

import allAgentsData from '@/data/all-agents.json';

const RESOURCE_TYPES = [
  { id: 'all', label: 'All Catalog Items', count: allAgentsData.total },
  { id: 'AGENT', label: 'Agents (224)', count: allAgentsData.totalAgents },
  { id: 'MCP SERVER', label: 'MCP Servers (20)', count: allAgentsData.totalMcp },
  { id: 'FORMATION', label: 'Formations (6)', count: allAgentsData.totalFormations }
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return allAgentsData.items.filter((item: any) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !searchQuery ||
                          (item.name && item.name.toLowerCase().includes(q)) ||
                          (item.slug && item.slug.toLowerCase().includes(q)) ||
                          (item.description && item.description.toLowerCase().includes(q)) ||
                          (item.tags && item.tags.some((t: string) => t.toLowerCase().includes(q)));

      const matchType = selectedType === 'all' || item.type === selectedType;
      const matchCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchType && matchCategory;
    });
  }, [searchQuery, selectedType, selectedCategory]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
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
            <Link
              href="/wiki"
              className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20"
            >
              Architecture Wiki
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>UNIVERSAL ECOSYSTEM MARKETPLACE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Explore 250 Autonomous Agents, MCPs & Formations
          </h1>
          <p className="text-neutral-400 text-sm mt-2">
            Filter by capability, quality score, and formation matrix. Prerendered with full static detail specs.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-xl space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by skill name, description, keyword, or tool..."
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Type Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {RESOURCE_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedType === t.id
                      ? 'bg-purple-500 text-white font-semibold shadow-[0_0_15px_rgba(123,47,190,0.4)]'
                      : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item: any) => {
            const isMcp = item.type === 'MCP SERVER';
            const detailHref = isMcp ? `/mcp/${item.slug}` : `/agent/${item.slug}`;

            return (
              <div
                key={item.slug}
                className="rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-5 backdrop-blur-md transition-all hover:border-purple-500/30 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold ${
                      isMcp ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {item.category}
                    </span>
                  </div>

                  <Link href={detailHref} className="block group-hover:text-purple-300 transition-colors">
                    <h3 className="text-base font-semibold text-white truncate flex items-center justify-between">
                      <span>{item.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-purple-400 transition-colors shrink-0" />
                    </h3>
                  </Link>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="font-mono text-[10px] text-neutral-500 truncate">
                    <code>{item.summonCmd || item.slashCommand || 'loragent sync'}</code>
                  </div>
                  <button
                    onClick={() => handleCopy(item.summonCmd || item.slashCommand || item.installCmd, item.slug)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                  >
                    {copiedKey === item.slug ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
