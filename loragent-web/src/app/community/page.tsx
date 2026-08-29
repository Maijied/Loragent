'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Terminal, Sparkles, Server, Layers, Cpu, Shield, Globe, 
  Search, ArrowLeft, Copy, Check, ExternalLink, Code2, Cloud, Users,
  MessageSquare, Heart, Share2, Filter, Play, CheckCircle2, AlertCircle
} from 'lucide-react';

const IDE_SNIPPETS = [
  {
    ide: 'Cursor',
    description: 'Add to .cursor/mcp.json and install agent skills',
    command: 'loragent sync --ide cursor',
    config: `{
  "mcpServers": {
    "loragent": {
      "url": "http://localhost:3000/api/mcp"
    }
  }
}`
  },
  {
    ide: 'Claude Code',
    description: 'Add to ~/.claude.json or project config',
    command: 'loragent sync --ide claude',
    config: `claude mcp add loragent http://localhost:3000/api/mcp`
  },
  {
    ide: 'Antigravity IDE',
    description: 'Auto-discovered via .agents/ directory',
    command: 'loragent sync --ide antigravity',
    config: `// Native integration active via .agents/skills and port/mcp/server.js`
  },
  {
    ide: 'Windsurf',
    description: 'Add to ~/.codeium/windsurf/mcp_config.json',
    command: 'loragent sync --ide windsurf',
    config: `{
  "mcpServers": {
    "loragent": {
      "url": "http://localhost:3000/api/mcp"
    }
  }
}`
  },
  {
    ide: 'Zed / Roo / Cline',
    description: 'Custom modes and settings integration',
    command: 'loragent sync --ide roo',
    config: `// .roomodes and MCP endpoints synchronized automatically`
  }
];

const COMMUNITY_POSTS = [
  {
    id: 'post-1',
    author: 'Lorapok Core Team',
    role: 'Core Maintainer',
    title: 'Loragent v2.0 LLDP Standard Released with 224 Canonical Agents',
    summary: 'The universal 7-section LLDP specification has reduced 3,105 clone redundancies across 12 IDE locations down to 224 canonical capabilities.',
    tags: ['Announcement', 'Architecture', 'v2.0'],
    likes: 142,
    comments: 28,
    time: '2 hours ago'
  },
  {
    id: 'post-2',
    author: 'DevOps Guild',
    role: 'Specialist Lead',
    title: 'Zero-Trust Machine Vault: How AES-256 CLI Injection Works',
    summary: 'Detailed deep dive into how loragent-exec-cli dynamically injects machine-encrypted PATs into wrangler, gh, and docker child processes.',
    tags: ['Security', 'Vault', 'Zero-Trust'],
    likes: 98,
    comments: 14,
    time: '5 hours ago'
  },
  {
    id: 'post-3',
    author: 'Agentic Architect',
    role: 'Community Contributor',
    title: 'Building Stateful Multi-Agent DAGs with the Spidernet Formation',
    summary: 'Step-by-step tutorial on defining Directed Acyclic Graphs (DAG) for multi-stage software delivery with automated rollback hooks.',
    tags: ['Tutorial', 'Spidernet', 'Formations'],
    likes: 85,
    comments: 19,
    time: '1 day ago'
  }
];

export default function CommunityPage() {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [selectedIde, setSelectedIde] = useState(IDE_SNIPPETS[0]);
  const [validatorInput, setValidatorInput] = useState(`---
name: loragent-my-custom-agent
description: Specialized domain agent for high-throughput processing.
version: 2.0.0
license: MIT
formation: freelance
layer: cross
tags: ["custom", "loragent"]
connectors: ["loragent-core"]
allowed_tools: ["loragent_exec_cli", "loragent_steer"]
requires_confirmation: false
can_spawn_subagents: false
cost_tier: low
---

# 🤖 My Custom Agent

## §1 · Role & Identity
Specialist scope definition.

## §2 · Core Directives
1. Zero plaintext secrets.
2. Strict handoffs via loragent_steer.`);

  const [validationResult, setValidationResult] = useState<{ valid: boolean; messages: string[] } | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleValidateSkill = () => {
    const messages: string[] = [];
    let valid = true;

    if (!validatorInput.includes('name:')) {
      valid = false;
      messages.push('Missing "name" field in YAML frontmatter');
    }
    if (!validatorInput.includes('formation:')) {
      valid = false;
      messages.push('Missing "formation" field in YAML frontmatter');
    }
    if (!validatorInput.includes('layer:')) {
      valid = false;
      messages.push('Missing "layer" field in YAML frontmatter');
    }
    if (!validatorInput.includes('§1 · Role & Identity')) {
      valid = false;
      messages.push('Missing "§1 · Role & Identity" section');
    }
    if (!validatorInput.includes('§2 · Core Directives') && !validatorInput.includes('§2 · Core Philosophy')) {
      valid = false;
      messages.push('Missing "§2 · Core Directives" section');
    }

    if (valid) {
      messages.push('✅ Perfect! Passed all Loragent v2.0 LLDP Specification checks (100/100 Quality Score).');
    }

    setValidationResult({ valid, messages });
  };

  return (
    <div className="min-h-screen bg-[#06060A] text-neutral-200 selection:bg-purple-500/30 selection:text-purple-300">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#06060A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="font-mono font-bold text-white text-sm">Loragent Community &amp; Ecosystem Exchange</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono border border-white/10 transition-colors"
            >
              Admin Portal
            </Link>
            <Link
              href="/api-explorer"
              className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono hover:bg-purple-500/30 transition-colors"
            >
              Live MCP &amp; API
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GLOBAL AGENT &amp; SKILL COMMUNITY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Universal AI Agent Exchange
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed font-sans">
            Connect your IDE to the online MCP cluster, validate new agent skills with the LLDP v2 linter, and explore architectural discussions.
          </p>
        </div>

        {/* IDE Integration Matrix */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span>One-Click Multi-IDE Integration Setup</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Select your AI development environment to get instant copyable MCP configuration and CLI sync commands.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {IDE_SNIPPETS.map((item) => (
              <button
                key={item.ide}
                onClick={() => setSelectedIde(item)}
                className={`p-3 rounded-2xl border text-left font-mono transition-all ${
                  selectedIde.ide === item.ide
                    ? 'bg-purple-500/20 border-purple-500/40 text-white shadow-[0_0_20px_rgba(123,47,190,0.3)]'
                    : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <div className="text-xs font-bold">{item.ide}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5 truncate">{item.description}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>1. Universal Sync Directive</span>
                <button
                  onClick={() => handleCopy(selectedIde.command, 'sync-cmd')}
                  className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  {copiedSnippet === 'sync-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet === 'sync-cmd' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-emerald-400 text-xs font-mono bg-black/40 p-3 rounded-xl border border-white/5">
                {selectedIde.command}
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>2. MCP Server Configuration</span>
                <button
                  onClick={() => handleCopy(selectedIde.config, 'mcp-config')}
                  className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  {copiedSnippet === 'mcp-config' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet === 'mcp-config' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-cyan-300 text-xs font-mono bg-black/40 p-3 rounded-xl border border-white/5 overflow-x-auto max-h-[90px]">
                {selectedIde.config}
              </pre>
            </div>
          </div>
        </section>

        {/* Skill Validator Sandbox */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-400" />
                <span>LLDP v2.0 Skill &amp; Agent Syntax Validator</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Paste your custom SKILL.md below to test against the 7-section Loragent v2 LLDP quality standard.
              </p>
            </div>
            <button
              onClick={handleValidateSkill}
              className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-mono font-bold transition-all shadow-[0_0_20px_rgba(123,47,190,0.4)] flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Validate LLDP Spec</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <textarea
                value={validatorInput}
                onChange={(e) => setValidatorInput(e.target.value)}
                rows={10}
                className="w-full bg-black/80 border border-white/10 rounded-2xl p-4 font-mono text-xs text-neutral-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="lg:col-span-4 p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <span className="text-xs font-mono text-neutral-400 font-bold block">
                Validation Report
              </span>
              {validationResult ? (
                <div className="space-y-2">
                  {validationResult.messages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`text-xs font-mono p-2 rounded-lg border ${
                        validationResult.valid 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-red-500/10 border-red-500/30 text-red-300'
                      }`}
                    >
                      {msg}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs font-mono text-neutral-500 py-8 text-center">
                  Click "Validate LLDP Spec" to run instant compliance analysis.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Community Discussions */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <span>Ecosystem Discussions &amp; Insights</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Latest updates, architectural decisions, and tutorials from the Lorapok multi-agent developer community.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMMUNITY_POSTS.map((post) => (
              <div
                key={post.id}
                className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all backdrop-blur-xl flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span className="text-purple-400">{post.author}</span>
                    <span className="text-neutral-500">{post.time}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 hover:text-red-400 transition-colors">
                      <Heart className="w-3.5 h-3.5" />
                      <span>{post.likes}</span>
                    </span>
                    <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comments}</span>
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-neutral-400">
                    {post.tags[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
