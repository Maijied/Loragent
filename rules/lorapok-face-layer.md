---
inclusion: fileMatch
fileMatchPattern: 'src/components/**/*.{jsx,tsx,vue,svelte}'
name: lorapok-face-layer
description: FACE layer design standards — Biological UI, Lorapok visual identity. Loaded when editing frontend component files.
---

# Lorapok FACE Layer — Biological UI Standards

## Visual Identity

| Property | Value |
|---|---|
| Primary aesthetic | Dark-space, deep charcoal (#0D0D0F to #1A1A2E) |
| Accent | Violet glow (#7B2FBE, #9B59B6) |
| Glass surfaces | `backdrop-filter: blur(12px); background: rgba(255,255,255,0.05)` |
| Motion philosophy | Organic, breathing — nothing snaps or teleports |
| Typography | Inter or Geist for body; Sora or Space Grotesk for headings |

## Motion Rules

```css
/* All state transitions — never instant */
transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

/* Hover: lift + glow */
:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(123, 47, 190, 0.3); }

/* Loading states: breathe, not spin */
@keyframes breathe {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.02); }
}
```

## Component Standards
- Every interactive element has a hover AND focus state
- Skeleton loaders for all async content — no blank states
- Error states use amber/rose, never raw red
- Dark mode is default — light mode is opt-in
- Glassmorphic cards: blur + subtle border + violet accent

## Agents for FACE Layer
- `loragent-ui-ux-professional` — layout and UX decisions
- `loragent-frontend-se` — implementation
- `loragent-3d-designer` — Three.js / R3F scenes
- `loragent-animator` — Framer Motion, GSAP sequences
- `loragent-responsive-system-designer` — breakpoint architecture
