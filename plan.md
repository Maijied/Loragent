# Loragent Production Landing Page Plan (`plan.md`)

## 1. Project Stack & Dependencies
- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS, `@tailwindcss/typography`
- **Animation:** `framer-motion`, `canvas-confetti` (for interactions)
- **Icons:** `lucide-react`

---

## 2. Page Section Breakdown

### Section 1: Floating Glass Navbar (`components/Navbar.tsx`)
- **Structure:** Centered, floating pill-style header with `backdrop-blur-xl bg-black/40 border border-white/10`.
- **Left:** Loragent Logo (Stylized geometric 'L' badge + "Loragent" in bold sans).
- **Center Navigation:** Architecture, Token Sniper, Workflow, Ecosystem, Docs.
- **Right:**
  - Secondary: "Sign In" / "GitHub" link.
  - Primary CTA: "Get Loragent Pro" (Neon violet gradient with glowing border).

---

### Section 2: Hero Section (`components/Hero.tsx`)
- **Background:** Dynamic particle canvas or CSS twinkling star mesh with an ambient violet radial glow behind the text.
- **Badge:** `LORAPOK LABS · 108-AGENT MEGA-AGENCY` (Pill badge with glowing border).
- **Headline:** Massive typography: `"Loragent: The Autonomous Professional Virtual Office"`
- **Subheadline:** "Orchestrate 108 highly specialized AI agents to automate your digital empire—from full-stack engineering and security auditing to project management."
- **Action Buttons:**
  - Primary CTA: `"Install via NPM"` (`bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/25`).
  - Secondary CTA: `"Read Documentation"` (`bg-white/5 border border-white/10 hover:bg-white/10`).
- **Interactive Quick-Run Pill:** Inline terminal preview: `npm install -g @lorapok/loragent-cli` with copy button.

---

### Section 3: Core Pillars 4-Column Grid (`components/CoreFeatures.tsx`)
Mimic Streamiverse's numbered 4-card feature row:
1. **01 / LLDP Architecture:** "Built strictly on the Lorapok Labs Design Pattern across FACE, PULSE, LORE, PORT, and LOOM layers."
2. **02 / Universal Autopilot:** "Trigger `/loragent autopilot` in your CLI or editor. The boss agent summons dynamic skillsets instantly."
3. **03 / Secure Credential Vault:** "Passphrase-encrypted secret injection backed by GnuPG AES-256 end-to-end encryption."
4. **04 / Watchman Self-Healing:** "Lorapok Versioning Pattern (LVP) manages semantic releases while the Watchman heals AST runtime errors."

---

### Section 4: Deep Dive — Token Sniper Showcase (`components/TokenSniperShowcase.tsx`)
Zig-zag layout displaying the cost reduction engine:
- **Left Column:**
  - Tag: `PROPRIETARY TECHNOLOGY`
  - Title: `"Token Sniper: Obliterate API Token Burn"`
  - Description: "AST Pruning, Code Skeletonization, and Diff-Only Memory prevent context limit crashes and drastically reduce LLM API overhead."
- **Right Column (Interactive Glass Card Widget):**
  - **Metric 1:** Initial File Read: `4,500 → 1,200 tokens` (**73% reduction**)
  - **Metric 2:** Subsequent Edit: `4,500 → 350 tokens` (**92% reduction**)
  - **Metric 3:** Task Lifetime: `50k → 15k tokens burned` (**70% net savings**)
  - Animated visual bar showing token compression efficiency.

---

### Section 5: Supported Ecosystem Infinite Marquee (`components/EcosystemMarquee.tsx`)
- Smooth horizontal continuous scroll displaying supported development environments:
  - **Cursor IDE**
  - **Windsurf**
  - **Cline**
  - **Claude Code**
  - **Antigravity IDE**
  - **Visual Studio Code**
  - **Open VSX Registry**

---

### Section 6: How It Works — 3-Step Stepper (`components/UsageProcess.tsx`)
Vertical or 3-column chronological workflow:
- **Step 01:** Install Globally
  ```bash
  npm install -g @lorapok/loragent-cli
  ```
- **Step 02:** Summon the Boss & Form Team
  ```bash
  loragent autopilot "Build a React Dashboard with Web3 Auth"
  ```
- **Step 03:** Watchman Root-Cause Analysis
  ```bash
  loragent-inspector rca
  ```

---

### Section 7: "Why Loragent?" 6-Card Grid (`components/WhyLoragentGrid.tsx`)
Replicate Streamiverse's 6-item advantage matrix:
1. **Uncapped Context Efficiency:** Run complex multi-file refactors without running out of tokens.
2. **Universal Compatibility:** Integrates into CLI, IDE plugins, and headless CI pipelines.
3. **Zero Data Telemetry:** Local-first execution; credentials never leave your workspace.
4. **Instant Team Formation:** Automatically spins up specialized QA, Dev, and Architect agents.
5. **AST-Level Precision:** Modifies code structure directly rather than doing brute-force file rewrites.
6. **Commercial Security:** Sandboxed execution guarded by `loragent-workspace-guard`.

---

### Section 8: Lorapok Labs Ecosystem Connectors (`components/EcosystemConnectors.tsx`)
Two-column card block linking Loragent with brother tools:
- **Card A:** **Loragent Monitor Integration**
  - "Live quota tracking, billing cycle countdowns, and automatic free fallback to Composer 2.5."
  - Link to live marketplace extension.
- **Card B:** **Lorapok API Atlas Integration**
  - "Instant access to 2,100+ public and private endpoint schemas for automatic tool calling."

---

### Section 9: Founder Profile & Code of Conduct (`components/FounderTrust.tsx`)
- **Founder Statement:** Built by **Mohammad Maizied Hasan Majumder** (Senior Software Engineer at Shohoz Ltd, Founder of Lorapok Labs).
- **Ethical Safeguards:** "All agents adhere to the Lorapok Code of Conduct: user confirmation for destructive file operations and AES-256 caching."

---

### Section 10: Footer (`components/Footer.tsx`)
- **Columns:**
  - **Product:** Features, Token Sniper, Pricing, Release Notes.
  - **Ecosystem:** Loragent Monitor, API Atlas, Media Player.
  - **Legal:** Privacy Policy, Terms of Service, Security Disclosures.
  - **Socials:** GitHub, LinkedIn, Telegram, X / Twitter.
- **Bottom Bar:** "© 2026 Lorapok Labs. All rights reserved. The Mega-Agency awaits."

---

## 3. Recommended Project File Structure

```text
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── CodeBlock.tsx
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── CoreFeatures.tsx
│   ├── TokenSniperShowcase.tsx
│   ├── EcosystemMarquee.tsx
│   ├── UsageProcess.tsx
│   ├── WhyLoragentGrid.tsx
│   ├── EcosystemConnectors.tsx
│   ├── FounderTrust.tsx
│   └── Footer.tsx
├── tailwind.config.ts
└── plan.md
```
