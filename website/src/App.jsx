import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, Bot, Cpu, Command, ShieldCheck, TerminalSquare, 
  Sparkles, Layers, Search, Server, Cloud, Lock, Copy, Check,
  Zap, Compass, ChevronRight, Activity, ArrowUpRight, Code2,
  RefreshCw, CheckCircle2, ShoppingBag, DownloadCloud, X, CheckCircle
} from 'lucide-react';
import './index.css';

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
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>Lorapok Labs Multi-Agent Ecosystem v2.0</p>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
