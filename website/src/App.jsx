import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, Bot, Cpu, Command, ShieldCheck, TerminalSquare, 
  Sparkles, Layers, Search, Server, Cloud, Lock, Copy, Check,
  Zap, Compass, ChevronRight, Activity, ArrowUpRight, Code2,
  RefreshCw, CheckCircle2
} from 'lucide-react';
import './index.css';

const FORMATIONS = [
  {
    name: 'Boss Orchestrator',
    badge: 'Supreme Router',
    lead: 'loragent-boss',
    icon: Compass,
    color: '#00FF41',
    description: 'Central routing engine. Assesses task scope, summons specialized squads via MCP, and manages cross-agent steering.',
    squad: ['loragent-boss', 'loragent-teacher', 'loragent-workspace-guard', 'loragent-watchman']
  },
  {
    name: 'Auto Team Matrix',
    badge: 'Full-Stack Engineering',
    lead: 'loragent-tech-director',
    icon: Code2,
    color: '#06b6d4',
    description: 'Converts product requirements into scalable code, builds backend APIs, creates biological UIs, and runs SQA test suites.',
    squad: ['loragent-tech-director', 'loragent-backend-se', 'loragent-frontend-se', 'loragent-sqa']
  },
  {
    name: 'Office Matrix',
    badge: 'Business Operations',
    lead: 'loragent-project-coordinator',
    icon: Layers,
    color: '#a855f7',
    description: 'Autonomous enterprise operations. Plans roadmaps, writes marketing copy, creates documentation, and orchestrates PR.',
    squad: ['loragent-project-coordinator', 'loragent-marketing-strategy-manager', 'loragent-publisher']
  },
  {
    name: 'Chela Debugging',
    badge: 'Zero-Guess Bug Hunting',
    lead: 'loragent-bug-hunter',
    icon: Zap,
    color: '#f59e0b',
    description: 'Parses live orchestration graph telemetry, tracks regressions, resolves Git VCS conflicts, and applies verified patches.',
    squad: ['loragent-bug-hunter', 'loragent-shift-engineer', 'loragent-git-specialist', 'loragent-inspector']
  },
  {
    name: 'Freelance Specialists',
    badge: 'On-Demand Execution',
    lead: 'loragent-image-generate',
    icon: Sparkles,
    color: '#3b82f6',
    description: 'Isolated domain experts: Fal.ai/Replicate generative art, FFmpeg GIF creation, Cloudflare edge deployment, and package management.',
    squad: ['loragent-image-generate', 'loragent-gif-create', 'loragent-deploy', 'loragent-tools-install']
  },
  {
    name: 'Observer & Sentinel',
    badge: 'Crash Recovery',
    lead: 'loragent-watchman',
    icon: ShieldCheck,
    color: '#f43f5e',
    description: 'Zero-loss state preservation. Maintains real-time graph maps and facilitates instant resumption via /loragent-watchman continue.',
    squad: ['loragent-watchman', 'loragent-workspace-guard', 'loragent-cache-collector']
  }
];

const AGENTS = [
  { name: 'loragent-boss', role: 'Central Intelligent Routing Hub', cat: 'orchestrator', formation: 'Orchestrator', layer: 'cross' },
  { name: 'loragent-tech-director', role: 'Chief Software Architect', cat: 'auto', formation: 'Auto Team', layer: 'pulse' },
  { name: 'loragent-backend-se', role: 'Senior Backend Systems Engineer', cat: 'auto', formation: 'Auto Team', layer: 'lore' },
  { name: 'loragent-frontend-se', role: 'Senior Frontend & Sensory UI Engineer', cat: 'auto', formation: 'Auto Team', layer: 'face' },
  { name: 'loragent-sqa', role: 'Senior Software Quality Assurance', cat: 'auto', formation: 'Auto Team', layer: 'loom' },
  { name: 'loragent-deploy', role: 'Multi-Cloud & Container Deployment', cat: 'freelance', formation: 'Freelance', layer: 'loom' },
  { name: 'loragent-image-generate', role: 'Production AI Image Generator', cat: 'freelance', formation: 'Freelance', layer: 'face' },
  { name: 'loragent-gif-create', role: 'Animated GIF & Video Producer', cat: 'freelance', formation: 'Freelance', layer: 'face' },
  { name: 'loragent-tools-install', role: 'Universal Dependency Resolver', cat: 'freelance', formation: 'Freelance', layer: 'loom' },
  { name: 'loragent-watchman', role: 'Session State Guardian & Recovery', cat: 'observer', formation: 'Observer', layer: 'cross' },
  { name: 'loragent-wrangler-specialist', role: 'Cloudflare Developer Platform Lead', cat: 'freelance', formation: 'Freelance', layer: 'port' },
  { name: 'loragent-bug-hunter', role: 'The Chela Problem Solver', cat: 'chela', formation: 'Chela Debugging', layer: 'pulse' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedFormation, setSelectedFormation] = useState('all');
  const [copied, setCopied] = useState(null);

  const copyCode = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredAgents = useMemo(() => {
    return AGENTS.filter(a => {
      const matchForm = selectedFormation === 'all' || a.cat === selectedFormation;
      const matchSearch = search === '' || 
        a.name.toLowerCase().includes(search.toLowerCase()) || 
        a.role.toLowerCase().includes(search.toLowerCase());
      return matchForm && matchSearch;
    });
  }, [search, selectedFormation]);

  return (
    <div className="app-container">
      {/* HERO SECTION */}
      <motion.header 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(0,255,65,0.08)', borderRadius: '24px', border: '1px solid rgba(0,255,65,0.3)', marginBottom: '1.5rem', fontSize: '0.85rem', fontFamily: 'monospace', color: '#00FF41' }}>
          <Sparkles size={14} color="#00FF41" />
          <span>LORAGENT v2.0.0 — 224 AGENTS ACTIVE</span>
        </div>
        
        <motion.h1 whileHover={{ scale: 1.01 }}>Loragent</motion.h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#e2e8f0', fontWeight: 600 }}>The Autonomous Multi-Agent Virtual Software Firm</p>
        <p style={{ marginBottom: '2.5rem', color: '#94a3b8', maxWidth: '820px', margin: '0 auto 2.5rem auto', lineHeight: '1.7' }}>
          A 224-agent ecosystem powered by Lorapok Labs. Synchronize autonomous squads across Antigravity IDE, Cursor, Claude Code, Windsurf, and VS Code with zero-trust machine-encrypted credentials and Cloudflare edge execution.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#formations" className="btn btn-primary">Explore 6 Formations</a>
          <a href="#agents" className="btn">Specialist Roster</a>
          <a href="https://github.com/Maijied/Loragent" target="_blank" rel="noreferrer" className="btn">GitHub Repository</a>
        </div>
        
        <div style={{ marginTop: '2.5rem', color: '#94a3b8', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', fontFamily: 'monospace' }}>
          <span style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>✨ Antigravity IDE</span>
          <span style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>🎯 Cursor .mdc</span>
          <span style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>🤖 Roo Code &amp; Cline</span>
          <span style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>💬 Claude Code 3-Layer</span>
          <span style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>💨 Windsurf Cascade</span>
        </div>
      </motion.header>

      {/* 6 FORMATIONS SECTION */}
      <h2 id="formations" className="section-title" style={{ marginTop: '2rem' }}>6 Dynamic Formations</h2>
      <motion.main className="grid" variants={containerVariants} initial="hidden" animate="visible">
        {FORMATIONS.map((form) => {
          const Icon = form.icon;
          return (
            <motion.div 
              key={form.name} 
              className="glass-card" 
              variants={itemVariants} 
              whileHover={{ y: -6, borderColor: form.color }}
            >
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
            </motion.div>
          );
        })}
      </motion.main>

      {/* AGENT ROSTER */}
      <h2 id="agents" className="section-title">Specialist Agent Roster</h2>
      <div style={{ width: '100%', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', minWidth: '280px', flex: '1' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents by name or role..."
            style={{ width: '100%', padding: '12px 16px 12px 42px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '0.85rem', fontFamily: 'monospace', outline: 'none' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {['all', 'orchestrator', 'auto', 'chela', 'freelance', 'observer'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedFormation(c)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                cursor: 'pointer',
                background: selectedFormation === c ? '#00FF41' : 'rgba(255,255,255,0.05)',
                color: selectedFormation === c ? '#000' : '#94a3b8',
                fontWeight: selectedFormation === c ? '700' : '400',
                border: 'none'
              }}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', width: '100%', marginBottom: '5rem' }}>
        {filteredAgents.map((agent) => (
          <div 
            key={agent.name}
            style={{ background: 'rgba(10, 17, 32, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#00FF41' }}>[{agent.layer.toUpperCase()}]</span>
              <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#64748b' }}>{agent.formation}</span>
            </div>
            <div>
              <div style={{ fontWeight: '700', fontFamily: 'monospace', color: '#fff', fontSize: '0.95rem' }}>{agent.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px', lineHeight: '1.5' }}>{agent.role}</div>
            </div>
            <button
              onClick={() => copyCode(`/${agent.name}:start`, agent.name)}
              style={{ marginTop: 'auto', padding: '6px 10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#cbd5e1', fontSize: '0.75rem', fontFamily: 'monospace', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>/{agent.name}:start</span>
              {copied === agent.name ? <Check size={12} color="#00FF41" /> : <Copy size={12} color="#64748b" />}
            </button>
          </div>
        ))}
      </div>

      {/* ZERO-TRUST VAULT & CLOUDFLARE MCP HIGHLIGHT */}
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
        <div className="glass-card" style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}>
          <Lock size={32} color="#a855f7" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: '#c084fc' }}>Zero-Trust Credential Enclave</h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.7' }}>
            Machine-hash encrypted credentials with zero plaintext committed to Git. Backed by GnuPG AES-256 with <code>LORAGENT_VAULT_ENCRYPTED_PIN</code> auto-injected dynamically into running processes.
          </p>
        </div>

        <div className="glass-card" style={{ border: '1px solid rgba(6, 182, 212, 0.3)' }}>
          <Cloud size={32} color="#06b6d4" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: '#38bdf8' }}>Official Cloudflare Remote MCP</h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.7' }}>
            Direct SSE connection to <code>https://mcp.cloudflare.com/sse</code>. Live access to Workers AI, D1 SQL databases, R2 storage buckets, Vectorize, and real-time observability telemetry.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2.5rem', paddingBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace' }}>
        <div>LORAGENT v2.0.0 • Lorapok Labs Official Asset</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="https://lorapok.tech" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Lorapok Labs</a>
          <a href="https://github.com/Maijied/Loragent" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>GitHub</a>
          <a href="https://mission-control.lorapok.tech" target="_blank" rel="noreferrer" style={{ color: '#00FF41', textDecoration: 'none' }}>Mission Control</a>
        </div>
      </footer>
    </div>
  );
}
