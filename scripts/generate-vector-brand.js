#!/usr/bin/env node
/**
 * Loragent — Industry-Grade Vector Brand & Marketing Asset Engine
 * ===============================================================
 * Generates transparent SVGs and renders crisp transparent PNGs
 * matching Lorapok Labs' dCursor/Loravox design standards.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const targetDirs = [
  path.join(rootDir, 'assets', 'branding'),
  path.join(rootDir, 'loragent-web', 'public', 'assets'),
  path.join(rootDir, 'website', 'public', 'assets'),
  '/home/maizied/Downloads/Lorapok/Loragent-Assets'
];

for (const d of targetDirs) {
  fs.mkdirSync(d, { recursive: true });
}

// ─────────────────────────────────────────────────────────────
// 1. LORAGENT LOGO MARK (Transparent 1:1 Squircle Icon)
// ─────────────────────────────────────────────────────────────
const logoMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" role="img" aria-label="Loragent Official Mark">
  <defs>
    <!-- Brand Neon Gradients -->
    <linearGradient id="brandNeon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F3FF"/>
      <stop offset="50%" stop-color="#39FF14"/>
      <stop offset="100%" stop-color="#BC13FE"/>
    </linearGradient>

    <linearGradient id="cyberMetal" x1="10%" y1="10%" x2="90%" y2="90%">
      <stop offset="0%" stop-color="#2a3342"/>
      <stop offset="50%" stop-color="#141a24"/>
      <stop offset="100%" stop-color="#070a0f"/>
    </linearGradient>

    <linearGradient id="shellHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
      <stop offset="40%" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.6"/>
    </linearGradient>

    <linearGradient id="emeraldPanel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#39FF14"/>
      <stop offset="50%" stop-color="#00F3FF"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>

    <radialGradient id="pupilGlow" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="35%" stop-color="#39FF14"/>
      <stop offset="100%" stop-color="#00F3FF" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00F3FF" stop-opacity="0.25"/>
      <stop offset="60%" stop-color="#39FF14" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.65"/>
    </filter>
  </defs>

  <!-- Background Aura -->
  <circle cx="256" cy="256" r="230" fill="url(#auraGlow)"/>

  <!-- Squircle Base Tile -->
  <rect x="36" y="36" width="440" height="440" rx="108" fill="#030712" filter="url(#softShadow)"/>
  <rect x="36" y="36" width="440" height="440" rx="108" fill="none" stroke="url(#brandNeon)" stroke-width="4" opacity="0.85" filter="url(#neonGlow)"/>
  <rect x="42" y="42" width="428" height="428" rx="102" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.12"/>

  <!-- Subtle Matrix Circuit Tracer Lines -->
  <g opacity="0.18" stroke="#00F3FF" stroke-width="1.5" stroke-linecap="round">
    <path d="M 80 140 H 160 L 200 180 V 240"/>
    <circle cx="80" cy="140" r="3.5" fill="#00F3FF"/>
    <path d="M 432 140 H 352 L 312 180 V 240"/>
    <circle cx="432" cy="140" r="3.5" fill="#00F3FF"/>
    <path d="M 120 400 H 180 L 220 360"/>
    <circle cx="120" cy="400" r="3.5" fill="#39FF14"/>
    <path d="M 392 400 H 332 L 292 360"/>
    <circle cx="392" cy="400" r="3.5" fill="#39FF14"/>
  </g>

  <!-- Mascot: Lorapok Cyber Larva -->
  <g transform="translate(256, 265)">
    <!-- Body Segment 4 (Tail) -->
    <ellipse cx="96" cy="74" rx="42" ry="32" fill="url(#cyberMetal)"/>
    <ellipse cx="96" cy="74" rx="42" ry="32" fill="url(#shellHighlight)"/>
    <ellipse cx="96" cy="78" rx="26" ry="16" fill="url(#emeraldPanel)" opacity="0.5"/>

    <!-- Body Segment 3 -->
    <ellipse cx="58" cy="58" rx="52" ry="38" fill="url(#cyberMetal)"/>
    <ellipse cx="58" cy="58" rx="52" ry="38" fill="url(#shellHighlight)"/>
    <ellipse cx="58" cy="62" rx="34" ry="20" fill="url(#emeraldPanel)" opacity="0.55"/>

    <!-- Body Segment 2 -->
    <ellipse cx="14" cy="42" rx="60" ry="44" fill="url(#cyberMetal)"/>
    <ellipse cx="14" cy="42" rx="60" ry="44" fill="url(#shellHighlight)"/>
    <ellipse cx="14" cy="46" rx="42" ry="24" fill="url(#emeraldPanel)" opacity="0.6"/>

    <!-- Body Segment 1 (Chest) -->
    <ellipse cx="-34" cy="22" rx="68" ry="50" fill="url(#cyberMetal)"/>
    <ellipse cx="-34" cy="22" rx="68" ry="50" fill="url(#shellHighlight)"/>
    <ellipse cx="-34" cy="26" rx="48" ry="28" fill="url(#emeraldPanel)" opacity="0.65"/>

    <!-- Head -->
    <ellipse cx="-82" cy="-18" rx="76" ry="68" fill="url(#cyberMetal)"/>
    <ellipse cx="-82" cy="-18" rx="76" ry="68" fill="url(#shellHighlight)"/>

    <!-- Cyber Visor / Goggles Frame -->
    <rect x="-144" y="-56" width="124" height="66" rx="28" fill="#010308" stroke="#00F3FF" stroke-width="4" filter="url(#neonGlow)"/>
    <rect x="-140" y="-52" width="116" height="58" rx="24" fill="none" stroke="#39FF14" stroke-width="1" opacity="0.6"/>

    <!-- Glowing Cyber Eyes -->
    <circle cx="-112" cy="-23" r="18" fill="url(#pupilGlow)" filter="url(#neonGlow)"/>
    <circle cx="-52" cy="-23" r="18" fill="url(#pupilGlow)" filter="url(#neonGlow)"/>
    <circle cx="-110" cy="-26" r="6" fill="#ffffff"/>
    <circle cx="-50" cy="-26" r="6" fill="#ffffff"/>

    <!-- Cute Visor Smile -->
    <path d="M -94 3 Q -82 12 -70 3" fill="none" stroke="#39FF14" stroke-width="3.5" stroke-linecap="round"/>

    <!-- Dual Cyber Antennae -->
    <path d="M -110 -84 Q -128 -124 -146 -138" fill="none" stroke="#00F3FF" stroke-width="5" stroke-linecap="round" filter="url(#neonGlow)"/>
    <circle cx="-146" cy="-138" r="10" fill="#00F3FF" filter="url(#neonGlow)"/>
    <circle cx="-146" cy="-138" r="4" fill="#ffffff"/>

    <path d="M -54 -84 Q -36 -124 -18 -138" fill="none" stroke="#39FF14" stroke-width="5" stroke-linecap="round" filter="url(#neonGlow)"/>
    <circle cx="-18" cy="-138" r="10" fill="#39FF14" filter="url(#neonGlow)"/>
    <circle cx="-18" cy="-138" r="4" fill="#ffffff"/>

    <!-- Floating Holographic Orbit Ring -->
    <ellipse cx="0" cy="15" rx="175" ry="55" fill="none" stroke="url(#brandNeon)" stroke-width="2.5" stroke-dasharray="8 6" opacity="0.75" transform="rotate(-18)"/>
  </g>
</svg>`;

// ─────────────────────────────────────────────────────────────
// 2. LORAGENT LOCKUP DARK (Horizontal Transparent Logo)
// ─────────────────────────────────────────────────────────────
const lockupDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 180" fill="none" width="780" height="180" role="img" aria-label="Loragent by Lorapok Labs">
  <defs>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F3FF"/>
      <stop offset="50%" stop-color="#39FF14"/>
      <stop offset="100%" stop-color="#BC13FE"/>
    </linearGradient>

    <linearGradient id="metalGrad" x1="20" y1="30" x2="120" y2="130" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#3d4450"/>
      <stop offset="100%" stop-color="#14171f"/>
    </linearGradient>

    <linearGradient id="panelGrad" x1="24" y1="48" x2="116" y2="112" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#39FF14"/>
      <stop offset="100%" stop-color="#00F3FF"/>
    </linearGradient>

    <radialGradient id="eyeGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="40%" stop-color="#39FF14"/>
      <stop offset="100%" stop-color="#00F3FF" stop-opacity="0"/>
    </radialGradient>

    <filter id="glowDark" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Left Icon Emblem -->
  <g transform="translate(18, 18)">
    <rect x="0" y="0" width="144" height="144" rx="36" fill="#030712" stroke="url(#brandGrad)" stroke-width="3" filter="url(#glowDark)"/>
    
    <!-- Mascot inside icon -->
    <ellipse cx="98" cy="84" rx="20" ry="15" fill="url(#metalGrad)"/>
    <ellipse cx="84" cy="80" rx="18" ry="14" fill="url(#metalGrad)"/>
    <ellipse cx="70" cy="75" rx="17" ry="13" fill="url(#metalGrad)"/>
    <ellipse cx="56" cy="68" rx="16" ry="12" fill="url(#metalGrad)"/>
    <ellipse cx="44" cy="58" rx="18" ry="14" fill="url(#metalGrad)"/>

    <ellipse cx="84" cy="84" rx="14" ry="9" fill="url(#panelGrad)" opacity="0.6"/>
    <ellipse cx="70" cy="76" rx="12" ry="8" fill="url(#panelGrad)" opacity="0.5"/>
    <ellipse cx="44" cy="58" rx="11" ry="8" fill="url(#panelGrad)" opacity="0.4"/>

    <!-- Goggles -->
    <rect x="26" y="44" width="38" height="22" rx="9" fill="#010308" stroke="#00F3FF" stroke-width="2"/>
    <circle cx="37" cy="55" r="6.5" fill="url(#eyeGrad)"/>
    <circle cx="53" cy="55" r="6.5" fill="url(#eyeGrad)"/>
    <circle cx="37" cy="55" r="2.5" fill="#061018"/>
    <circle cx="53" cy="55" r="2.5" fill="#061018"/>

    <!-- Antennae -->
    <path d="M 36 44 Q 30 32 24 26" fill="none" stroke="#00F3FF" stroke-width="2" stroke-linecap="round"/>
    <circle cx="24" cy="26" r="3" fill="#00F3FF"/>
    <path d="M 52 44 Q 58 32 64 26" fill="none" stroke="#39FF14" stroke-width="2" stroke-linecap="round"/>
    <circle cx="64" cy="26" r="3" fill="#39FF14"/>
  </g>

  <!-- Typography Right -->
  <text x="186" y="98" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="64" font-weight="900" fill="#F8FAFC" letter-spacing="-1.5">
    LOR<tspan fill="#00FF41">AGENT</tspan>
  </text>
  
  <text x="190" y="132" font-family="'JetBrains Mono', 'Fira Code', monospace" font-size="15" font-weight="700" fill="#00F3FF" letter-spacing="0.18em">
    UNIVERSAL MULTI-AGENT ECOSYSTEM
  </text>

  <text x="590" y="132" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="500" fill="#64748B" letter-spacing="0.1em">
    • BY LORAPOK LABS
  </text>
</svg>`;

// ─────────────────────────────────────────────────────────────
// 3. LORAGENT LOCKUP LIGHT (Light Mode Horizontal Transparent)
// ─────────────────────────────────────────────────────────────
const lockupLightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 180" fill="none" width="780" height="180" role="img" aria-label="Loragent by Lorapok Labs">
  <defs>
    <linearGradient id="brandLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>

    <linearGradient id="metalLight" x1="20" y1="30" x2="120" y2="130" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>

    <linearGradient id="panelLight" x1="24" y1="48" x2="116" y2="112" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>

  <!-- Left Icon Emblem -->
  <g transform="translate(18, 18)">
    <rect x="0" y="0" width="144" height="144" rx="36" fill="#f8fafc" stroke="url(#brandLight)" stroke-width="3"/>
    
    <ellipse cx="98" cy="84" rx="20" ry="15" fill="url(#metalLight)"/>
    <ellipse cx="84" cy="80" rx="18" ry="14" fill="url(#metalLight)"/>
    <ellipse cx="70" cy="75" rx="17" ry="13" fill="url(#metalLight)"/>
    <ellipse cx="56" cy="68" rx="16" ry="12" fill="url(#metalLight)"/>
    <ellipse cx="44" cy="58" rx="18" ry="14" fill="url(#metalLight)"/>

    <ellipse cx="84" cy="84" rx="14" ry="9" fill="url(#panelLight)" opacity="0.8"/>
    <ellipse cx="70" cy="76" rx="12" ry="8" fill="url(#panelLight)" opacity="0.7"/>

    <rect x="26" y="44" width="38" height="22" rx="9" fill="#0f172a" stroke="#0284c7" stroke-width="2"/>
    <circle cx="37" cy="55" r="6" fill="#10b981"/>
    <circle cx="53" cy="55" r="6" fill="#10b981"/>
    <circle cx="37" cy="55" r="2" fill="#ffffff"/>
    <circle cx="53" cy="55" r="2" fill="#ffffff"/>

    <path d="M 36 44 Q 30 32 24 26" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
    <circle cx="24" cy="26" r="3" fill="#0284c7"/>
    <path d="M 52 44 Q 58 32 64 26" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round"/>
    <circle cx="64" cy="26" r="3" fill="#059669"/>
  </g>

  <!-- Typography Right -->
  <text x="186" y="98" font-family="'Inter', system-ui, sans-serif" font-size="64" font-weight="900" fill="#0F172A" letter-spacing="-1.5">
    LOR<tspan fill="#059669">AGENT</tspan>
  </text>
  
  <text x="190" y="132" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="700" fill="#0284C7" letter-spacing="0.18em">
    UNIVERSAL MULTI-AGENT ECOSYSTEM
  </text>

  <text x="590" y="132" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="500" fill="#64748B" letter-spacing="0.1em">
    • BY LORAPOK LABS
  </text>
</svg>`;

// ─────────────────────────────────────────────────────────────
// 4. LORAGENT ZERO-TRUST VAULT SHIELD (Transparent Vector)
// ─────────────────────────────────────────────────────────────
const zeroTrustShieldSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" width="512" height="512" role="img" aria-label="Zero-Trust AES-256 Security Vault">
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00FF41"/>
      <stop offset="50%" stop-color="#00F3FF"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>

    <linearGradient id="shieldInner" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0d1829"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>

    <filter id="glowShield" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Outer Shield Path -->
  <path d="M 256 36 L 436 96 V 264 C 436 376 356 456 256 484 C 156 456 76 376 76 264 V 96 Z" fill="url(#shieldInner)" stroke="url(#shieldGrad)" stroke-width="6" filter="url(#glowShield)"/>
  
  <!-- Inner Circuit Shield -->
  <path d="M 256 64 L 406 114 V 254 C 406 348 338 418 256 444 C 174 418 106 348 106 254 V 114 Z" fill="none" stroke="#00FF41" stroke-width="1.5" opacity="0.3" stroke-dasharray="6 4"/>

  <!-- Centered AES-256 Enclave Lock -->
  <rect x="186" y="210" width="140" height="110" rx="20" fill="#050b14" stroke="#00F3FF" stroke-width="4" filter="url(#glowShield)"/>
  <path d="M 216 210 V 165 C 216 142 234 124 256 124 C 278 124 296 142 296 165 V 210" fill="none" stroke="#00FF41" stroke-width="5" stroke-linecap="round"/>
  
  <!-- Keyhole & Biometric Stream -->
  <circle cx="256" cy="255" r="12" fill="#39FF14" filter="url(#glowShield)"/>
  <path d="M 256 267 V 290" stroke="#39FF14" stroke-width="4" stroke-linecap="round"/>

  <!-- Text Badges -->
  <text x="256" y="365" font-family="'JetBrains Mono', monospace" font-size="17" font-weight="700" fill="#00FF41" text-anchor="middle" letter-spacing="2">ZERO-TRUST VAULT</text>
  <text x="256" y="390" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#94A3B8" text-anchor="middle" letter-spacing="1">AES-256 MACHINE ENCRYPTED</text>
</svg>`;

// ─────────────────────────────────────────────────────────────
// 5. LORAGENT OPEN GRAPH / TWITTER SOCIAL BANNER (1200x630)
// ─────────────────────────────────────────────────────────────
const ogSocialCardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" fill="none" role="img" aria-label="Loragent Social Card">
  <defs>
    <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#07101e"/>
      <stop offset="50%" stop-color="#030712"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>

    <linearGradient id="ogBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F3FF"/>
      <stop offset="50%" stop-color="#39FF14"/>
      <stop offset="100%" stop-color="#BC13FE"/>
    </linearGradient>

    <filter id="ogGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#ogBg)"/>
  <rect width="1200" height="630" fill="none" stroke="url(#ogBorder)" stroke-width="3" opacity="0.6"/>

  <!-- Left Content -->
  <g transform="translate(80, 110)">
    <!-- Top Pill Badge -->
    <rect x="0" y="0" width="280" height="34" rx="8" fill="rgba(0, 255, 65, 0.12)" stroke="#00FF41" stroke-width="1.2"/>
    <text x="16" y="22" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700" fill="#00FF41" letter-spacing="2">
      ⚡ LORAPOK LABS OFFICIAL
    </text>

    <!-- Main Heading -->
    <text x="0" y="110" font-family="'Inter', sans-serif" font-size="80" font-weight="900" fill="#ffffff" letter-spacing="-3">
      LOR<tspan fill="#00FF41">AGENT</tspan>
    </text>

    <text x="0" y="165" font-family="'Inter', sans-serif" font-size="28" font-weight="600" fill="#38BDF8">
      Universal Multi-Agent Orchestration &amp; 224+ AI Roster
    </text>

    <text x="0" y="210" font-family="'Inter', sans-serif" font-size="18" fill="#94A3B8" width="600">
      Hub-and-Spoke topology with 6 squad formations across Cursor, Claude Code,
    </text>
    <text x="0" y="238" font-family="'Inter', sans-serif" font-size="18" fill="#94A3B8">
      Windsurf, Antigravity, and Zed. Zero-Trust AES-256 credential protection.
    </text>

    <!-- Stat Pills -->
    <g transform="translate(0, 290)">
      <rect x="0" y="0" width="160" height="54" rx="12" fill="#0d1829" stroke="rgba(255,255,255,0.1)"/>
      <text x="20" y="26" font-family="'Inter', sans-serif" font-size="18" font-weight="800" fill="#00FF41">224+ Agents</text>
      <text x="20" y="44" font-family="'JetBrains Mono', monospace" font-size="11" fill="#64748B">Specialist Skills</text>

      <rect x="180" y="0" width="160" height="54" rx="12" fill="#0d1829" stroke="rgba(255,255,255,0.1)"/>
      <text x="200" y="26" font-family="'Inter', sans-serif" font-size="18" font-weight="800" fill="#00F3FF">20 MCPs</text>
      <text x="200" y="44" font-family="'JetBrains Mono', monospace" font-size="11" fill="#64748B">Native Tool Mesh</text>

      <rect x="360" y="0" width="160" height="54" rx="12" fill="#0d1829" stroke="rgba(255,255,255,0.1)"/>
      <text x="380" y="26" font-family="'Inter', sans-serif" font-size="18" font-weight="800" fill="#BC13FE">6 Squads</text>
      <text x="380" y="44" font-family="'JetBrains Mono', monospace" font-size="11" fill="#64748B">Auto &amp; DAG Formations</text>
    </g>

    <!-- Terminal Prompt Line -->
    <g transform="translate(0, 380)">
      <rect x="0" y="0" width="480" height="42" rx="10" fill="#030712" stroke="rgba(0, 255, 65, 0.3)"/>
      <text x="16" y="26" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600" fill="#00FF41">
        $ npx -y @lorapok/loragent@latest
      </text>
    </g>
  </g>

  <!-- Right Visual Emblem (Mascot Badge) -->
  <g transform="translate(860, 290)">
    <circle cx="0" cy="0" r="190" fill="#00FF41" opacity="0.06" filter="url(#ogGlow)"/>
    <circle cx="0" cy="0" r="150" fill="#030712" stroke="url(#ogBorder)" stroke-width="4" filter="url(#ogGlow)"/>

    <!-- Mini Mascot Inside Emblem -->
    <g transform="translate(0, 15) scale(0.65)">
      <ellipse cx="60" cy="50" rx="35" ry="25" fill="#2a3342"/>
      <ellipse cx="30" cy="40" rx="32" ry="24" fill="#2a3342"/>
      <ellipse cx="0" cy="30" rx="30" ry="22" fill="#2a3342"/>
      <ellipse cx="-30" cy="15" rx="35" ry="26" fill="#2a3342"/>
      <ellipse cx="-65" cy="-10" rx="42" ry="38" fill="#2a3342"/>
      <rect x="-105" cy="-35" width="75" height="45" rx="18" fill="#010308" stroke="#00F3FF" stroke-width="3"/>
      <circle cx="-85" cy="-12" r="10" fill="#39FF14"/>
      <circle cx="-50" cy="-12" r="10" fill="#39FF14"/>
      <path d="M -85 -45 Q -98 -75 -110 -85" fill="none" stroke="#00F3FF" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="-110" cy="-85" r="7" fill="#00F3FF"/>
      <path d="M -45 -45 Q -32 -75 -20 -85" fill="none" stroke="#39FF14" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="-20" cy="-85" r="7" fill="#39FF14"/>
    </g>
  </g>
</svg>`;

// Write all SVGs
const svgFiles = {
  'loragent-logo-mark.svg': logoMarkSvg,
  'loragent-lockup-dark.svg': lockupDarkSvg,
  'loragent-lockup-light.svg': lockupLightSvg,
  'loragent-zerotrust-vault.svg': zeroTrustShieldSvg,
  'loragent-social-card.svg': ogSocialCardSvg
};

console.log('✨ Writing industry-grade SVGs...');
for (const [filename, content] of Object.entries(svgFiles)) {
  for (const dir of targetDirs) {
    const p = path.join(dir, filename);
    fs.writeFileSync(p, content, 'utf8');
  }
  console.log(`✓ Emitted ${filename}`);
}

// Convert SVGs to Transparent PNGs
console.log('\n🎨 Rendering transparent high-res PNGs via rsvg-convert...');
const pngConversions = [
  { svg: 'loragent-logo-mark.svg', png: 'loragent-logo-512.png', w: 512, h: 512 },
  { svg: 'loragent-logo-mark.svg', png: 'loragent-logo-256.png', w: 256, h: 256 },
  { svg: 'loragent-logo-mark.svg', png: 'loragent-logo-128.png', w: 128, h: 128 },
  { svg: 'loragent-logo-mark.svg', png: 'loragent-logo-64.png', w: 64, h: 64 },
  { svg: 'loragent-logo-mark.svg', png: 'loragent-logo-32.png', w: 32, h: 32 },
  { svg: 'loragent-logo-mark.svg', png: 'loragent-logo-mark.png', w: 512, h: 512 },
  { svg: 'loragent-lockup-dark.svg', png: 'loragent-lockup-dark.png', w: 1560, h: 360 },
  { svg: 'loragent-lockup-light.svg', png: 'loragent-lockup-light.png', w: 1560, h: 360 },
  { svg: 'loragent-zerotrust-vault.svg', png: 'loragent-zerotrust-vault.png', w: 1024, h: 1024 },
  { svg: 'loragent-social-card.svg', png: 'loragent-social-card.png', w: 1200, h: 630 }
];

for (const { svg, png, w, h } of pngConversions) {
  const srcSvg = path.join(rootDir, 'assets', 'branding', svg);
  for (const dir of targetDirs) {
    const destPng = path.join(dir, png);
    try {
      execSync(`rsvg-convert -w ${w} -h ${h} "${srcSvg}" -o "${destPng}"`);
    } catch (e) {
      console.warn(`⚠️ rsvg-convert failed for ${png}: ${e.message}`);
    }
  }
  console.log(`✓ Rendered transparent ${png} (${w}x${h})`);
}

// Generate multi-resolution ICO for browser favicon & app icon
try {
  const p32 = path.join(rootDir, 'assets', 'branding', 'loragent-logo-32.png');
  const p64 = path.join(rootDir, 'assets', 'branding', 'loragent-logo-64.png');
  for (const dir of targetDirs) {
    const icoPath = path.join(dir, 'favicon.ico');
    execSync(`convert "${p32}" "${p64}" "${icoPath}"`);
  }
  console.log('✓ Generated multi-size transparent favicon.ico');
} catch (e) {
  console.warn(`⚠️ convert favicon.ico skipped: ${e.message}`);
}

// Also copy directly to root of /home/maizied/Downloads/Lorapok/
const rootLorapokDir = '/home/maizied/Downloads/Lorapok';
if (fs.existsSync(rootLorapokDir)) {
  execSync(`cp -r "${rootDir}/assets/branding/"* "${rootLorapokDir}/"`);
  console.log(`\n🎉 Synced all brand assets directly into ${rootLorapokDir}/`);
}

console.log('\n🚀 All industry-level transparent logos, marks, and marketing banners generated successfully!');
