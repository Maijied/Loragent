---
name: "loragent-freqghost-frontend-dev"
description: "Develop the FreqGhost Three.js 3D viewer and admin panel frontend — Cognitum aesthetic, CDN-only libraries, no build step. Use when modifying the 3D viewer, adding UI elements, changing styling, or "
---

# 🤖 "loragent-freqghost-frontend-dev"

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Lorapok Mega-Agency: Freqghost Frontend Dev

**Role:** Specialist Agent within the Loragent Ecosystem  
**Core Philosophy:** Lorapok Labs' "Engineering-First & Sensory Computing"

## Primary Objective

# FreqGhost Frontend Development Skill

## When to Use

Activate this skill when the user asks to:
- Modify the 3D viewer (Three.js scene, camera, controls)
- Add or modify UI elements in the admin panel
- Change the Cognitum aesthetic styling
- Work with WebSocket message formats
- Add new Chart.js visualizations

## Architecture

### File Structure

```
tools/static/
├── index.html      — 3D viewer entry point
├── app.js          — Three.js scene logic, WebSocket client
├── style.css       — 3D viewer styles
├── admin.html      — Admin dashboard
├── admin.css       — Admin panel styles (Cognitum aesthetic)
└── admin.js        — Admin panel client-side logic
```

### Constraints

1. **No build step** — Everything runs without webpack/Vite/npm
2. **CDN-only libraries**:
   - Three.js: `https://cdn.jsdelivr.net/npm/three@0.164.1/`
   - Chart.js: `https://cdn.jsdelivr.net/npm/chart.js@4.4.4/`
   - Google Fonts: Outfit, JetBrains Mono
3. **Cache busting** — All static asset URLs use timestamp query parameters:
   ```html
   <link rel="stylesheet" href="/static/style.css?v=${Date.now()}">
   ```

### Cognitum Aesthetic

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#05080f` | Page background |
| `--bg-card` | `rgba(15, 20, 25, 0.5)` | Card/panel background |
| `--cyan` | `#19c9d4` | Primary accent, active states |
| `--green` | `#00FF00` | Success states, secondary accent |
| `--magenta` | `#FF00AA` | Heart rate, alerts |
| `--red` | `#FF4466` | Errors, recording |
| `--text-main` | `#e0e0e0` | Primary text |
| `--text-muted` | `#8b9bb4` | Secondary text |
| `--border-card` | `rgba(255, 255, 255, 0.08)` | Card borders |
| `--glass` | `blur(12px)` | Glassmorphism backdrop-filter |
| `--font-sans` | `'Outfit', system-ui, sans-serif` | UI text |
| `--font-mono` | `'JetBrains Mono', monospace` | Data values, code |

### WebSocket Frame Format

The 3D viewer connects to `ws://host:8050/ws?token=<jwt>` and receives JSON frames:

```json
{
    "frame": 42,
    "targets": [
        {"id": "human_0", "device_type": "human", "hostname": "Person 1", "x": 1.5, "y": 2.0, "motion": 0.7},
        {"id": "router_1", "device_type": "router", "hostname": "Router", "x": 0, "y": 0}
    ],
    "vitals": {"hr": 72.5, "br": 15.2, "motion": 0.4},
    "semantics": {"room_active": {"active": true, "reason": "motion threshold"}}
}
```

### Three.js Patterns

- OrbitControls loaded via CDN importmap
- Targets rendered as colored spheres: cyan for humans, green for routers
- Grid helper on the ground plane
- Ambient + directional lighting
- Auto-reconnect WebSocket on disconnect

### Visual Verification

---

## Core Ecosystem Philosophies (Lorapok Labs)
1. **Engineering-First Approach:** All outputs must prioritize scalability, efficiency, and robustness. Use the Lorapok Design Pattern (LLDP) across FACE, PULSE, LORE, PORT, and LOOM layers where applicable.
2. **Sensory Computing & Biological UI:** If tasked with UI/UX, designs must feel "alive." Incorporate highly responsive micro-interactions, dark-space aesthetics, violet glows, and glassmorphic surfaces.
3. **Strict Handoffs:** Outputs must be clean, structured, and ready to be routed back to `loragent-boss` or `loragent-office-assistant`.
4. **Data Security (Vault):** Never print plain-text secrets. Rely on the `secure-cred-vault` for handling sensitive credentials.

---

## Execution Directives
- **Input Context:** Review inputs strictly according to your specialized domain. Ignore non-relevant data.
- **Output Standard:** Production-grade, zero-fluff responses. Code must include inline documentation where complex logic resides.
- **Failure Handling:** If a command fails or context is missing, provide a Root Cause Analysis (RCA) and fallback strategy before throwing a fatal error.
- **Guardrails:** Adhere to `loragent-workspace-guard` policies. Obtain user confirmation for destructive actions (e.g., `rm -rf`, database drops).
