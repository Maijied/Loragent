import React from 'react';
import { motion } from 'framer-motion';
import { Network, Bot, Cpu, Command, ShieldCheck, TerminalSquare } from 'lucide-react';
import './index.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

const headerVariants = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
};

function App() {
  return (
    <div className="app-container">
      {/* HERO SECTION */}
      <motion.header initial="hidden" animate="visible" variants={headerVariants}>
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}
        >
          <img src="/LorapokLabsLogo.png" alt="Lorapok Labs Logo" style={{ width: '120px', height: '120px', borderRadius: '24px', boxShadow: '0 12px 40px rgba(0, 255, 255, 0.3)' }} />
        </motion.div>
        
        <motion.h1 whileHover={{ scale: 1.02 }}>Loragent</motion.h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>The Autonomous Professional Virtual Office</p>
        <p style={{ marginBottom: '2rem', color: '#94a3b8', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
          A 108-agent Mega-Agency powered by Lorapok Labs. Orchestrate highly specialized AI agents to automate your entire digital empire—from full-stack development to marketing, security, and project management.
        </p>
        <motion.div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <motion.a href="#install" className="btn btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Get Loragent Pro</motion.a>
          <motion.a href="#docs" className="btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Read Documentation</motion.a>
        </motion.div>
        
        <motion.div style={{ marginTop: '2rem', color: '#64748b', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>✨ Cursor</span>
          <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>💨 Windsurf</span>
          <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>🤖 Cline</span>
          <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>💬 Claude Code</span>
          <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>🚀 Antigravity IDE</span>
        </motion.div>
      </motion.header>

      {/* AGENTS AND SKILLS GRID */}
      <h2 className="section-title" style={{ marginTop: '4rem' }}>The 108-Agent Mega-Agency</h2>
      <motion.main className="grid" variants={containerVariants} initial="hidden" animate="visible">
        
        <motion.div className="glass-card" variants={itemVariants} whileHover={{ y: -5 }}>
          <Network size={36} color="#00ffff" style={{ marginBottom: '1rem' }} />
          <h2>LLDP Architecture</h2>
          <p>Built strictly on the Lorapok Labs Design Pattern (LLDP). Architected into FACE, PULSE, LORE, PORT, and LOOM layers for scalable agent orchestration and pure separation of concerns.</p>
        </motion.div>

        <motion.div className="glass-card" variants={itemVariants} whileHover={{ y: -5 }}>
          <Command size={36} color="#00ffff" style={{ marginBottom: '1rem' }} />
          <h2>Universal Autopilot</h2>
          <p>Trigger <code>/loragent autopilot</code> in your CLI or AI Editor. The Loragent Boss dynamically summons specific skillsets to achieve your goals seamlessly without breaking context.</p>
        </motion.div>

        <motion.div className="glass-card" variants={itemVariants} whileHover={{ y: -5 }} style={{ border: '1px solid rgba(0, 255, 255, 0.4)', boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)' }}>
          <ShieldCheck size={36} color="#00ffff" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: '#00ffff' }}>Secure Credential Vault</h2>
          <p>The definitive <strong>passphrase-encrypted</strong> vault for ALL your Loragent projects. Never expose an API key again. Our AI agents automatically store and inject secrets seamlessly—backed by GnuPG AES-256 E2E encryption.</p>
        </motion.div>
        
        <motion.div className="glass-card" variants={itemVariants} whileHover={{ y: -5 }}>
          <Bot size={36} color="#00ffff" style={{ marginBottom: '1rem' }} />
          <h2>Version Bumper & Watchman</h2>
          <p>Lorapok Versioning Pattern (LVP) automatically manages your semantic versions (Epoch.Phase.Iteration) while the Watchman maps your orchestration graph to self-heal errors instantly.</p>
        </motion.div>

      </motion.main>

      {/* TOKEN SNIPER SECTION */}
      <motion.div 
        className="glass-card" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', marginBottom: '5rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Cpu size={40} color="#00ffff" />
          <h2 style={{ marginBottom: 0, fontSize: '2rem' }}>Token Sniper (Context Cost Reducer)</h2>
        </div>
        <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
          Our flagship proprietary technology. Token Sniper uses AST Pruning, Code Skeletonization, and Diff-Only Memory to obliterate API token burn. This mechanism will literally stop users from hitting their context token limits, easily justifying the Lorapok Pro subscription cost.
        </p>
        
        <div style={{ overflowX: 'auto', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(0, 255, 255, 0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <th style={{ padding: '16px' }}>Scenario (Editing App.tsx)</th>
                <th style={{ padding: '16px' }}>Standard Loragent (Raw)</th>
                <th style={{ padding: '16px', color: '#fff' }}>Loragent Pro (Token Sniper)</th>
                <th style={{ padding: '16px', color: '#00ffff' }}>Net Savings</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <td style={{ padding: '16px', color: '#e2e8f0' }}>Initial File Read</td>
                <td style={{ padding: '16px', color: '#94a3b8' }}>4,500 tokens (full file)</td>
                <td style={{ padding: '16px', color: '#fff' }}>1,200 tokens (AST Skeleton)</td>
                <td style={{ padding: '16px', color: '#00ffff', fontWeight: 'bold' }}>~73% reduction</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <td style={{ padding: '16px', color: '#e2e8f0' }}>Subsequent Edit Read</td>
                <td style={{ padding: '16px', color: '#94a3b8' }}>4,500 tokens (full file)</td>
                <td style={{ padding: '16px', color: '#fff' }}>350 tokens (Diff-Only)</td>
                <td style={{ padding: '16px', color: '#00ffff', fontWeight: 'bold' }}>~92% reduction</td>
              </tr>
              <tr>
                <td style={{ padding: '16px', color: '#e2e8f0' }}>Average Task Lifetime</td>
                <td style={{ padding: '16px', color: '#94a3b8' }}>50,000 tokens burned</td>
                <td style={{ padding: '16px', color: '#fff' }}>15,000 tokens burned</td>
                <td style={{ padding: '16px', color: '#00ffff', fontWeight: 'bold' }}>~70% overall reduction</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* USAGE PROCESS */}
      <h2 className="section-title">Usage Process</h2>
      <motion.div 
        className="glass-card" 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        style={{ width: '100%', marginBottom: '5rem' }}
      >
        <div className="code-block">
          <code># 1. Install Loragent globally via NPM</code><br/>
          <code>npm install -g @lorapok/loragent-cli</code><br/><br/>
          <code># 2. Summon the Boss and Auto-Team Formation</code><br/>
          <code>loragent autopilot "Build a React Dashboard with Web3 Auth"</code><br/><br/>
          <code># 3. Watchman Debugging (If tests fail)</code><br/>
          <code>loragent-inspector rca</code><br/>
        </div>
      </motion.div>

      {/* LICENSE AND CODE OF CONDUCT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%', marginBottom: '4rem' }}>
        <motion.div className="glass-card" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2>Code of Conduct</h2>
          <p>
            Lorapok Labs enforces a strict code of conduct. All agents must operate securely, requiring user consent before destructive actions (<code>loragent-workspace-guard</code>). Data privacy is absolute, backed by E2E encrypted caching.
          </p>
        </motion.div>
        
        <motion.div className="glass-card" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2>License & Terms</h2>
          <p>
            The core Loragent orchestrator is open-source (MIT). Advanced specialized officers like Token Sniper and Cache Collector are proprietary under the Lorapok Pro Commercial License.
          </p>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#">Documentation</a>
          <a href="#">API Reference</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Lorapok Labs</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Lorapok Labs. All rights reserved. The Mega-Agency awaits.</p>
      </footer>
    </div>
  );
}

export default App;
