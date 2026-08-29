---
description: Lorapok FACE layer design rules — Biological UI, dark-space aesthetic, glassmorphic components, motion standards. Activates for all frontend component files.
globs: ['src/components/**/*.{jsx,tsx,vue,svelte}', 'src/pages/**/*.{jsx,tsx}', 'src/views/**/*.vue', '**/*.css', '**/*.scss']
alwaysApply: false
---

# Lorapok FACE Layer — Design Rules

## Visual Identity
- Background: deep charcoal (#0D0D0F → #1A1A2E gradient)
- Accent color: violet (#7B2FBE) with glow via box-shadow
- Glass cards: `backdrop-filter: blur(12px); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)`
- No pure white on dark — use #E8E8F0 max
- No flat bold colors — always gradient or with subtle noise texture

## Motion (Non-Negotiable)
- Zero instant state changes — minimum `transition: 0.2s ease`
- Hover: translateY(-2px) + violet glow shadow
- Loading: breathing pulse animation, not a spinner
- Page transitions: fade + slight upward slide

## Component Requirements
- Every async data section needs a skeleton loader state
- Every interactive element needs hover + focus + active states
- Responsive: mobile-first, breakpoints at 640/768/1024/1280px
- Dark mode default — test in dark mode before anything else

## Agents for this layer
Route UI/component work to: `loragent-ui-ux-professional` → `loragent-frontend-se` → `loragent-sqa`
