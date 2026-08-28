# UI/UX Specialist Agent

Loragent includes a built-in UI/UX Specialist agent capable of creating production-ready frontend code from designs, mockups, or natural language prompts.

## Overview

The UI/UX Specialist is trained to focus on three core pillars:
1. **Accessibility (a11y)**: Adheres strictly to WCAG guidelines, guaranteeing proper keyboard navigation and screen reader support.
2. **Design Quality**: Leverages curated color palettes and modern styling (Tailwind CSS, CSS modules) to avoid "generic" outputs.
3. **Responsiveness**: Ensures all outputs are mobile-first and fluid.

## Workflow Integration

When using the UI/UX Specialist in Loragent, you can seamlessly connect it to our external MCPs:

- **Frontend Design MCP**: Pulls Figma designs and UI tokens.
- **Chrome DevTools MCP**: The agent can autonomously debug live UI changes.

### Example Usage

```bash
loragent spawn ui-ux-specialist "Build a dark-mode dashboard sidebar"
```

![Agent Workflow Placeholder](/assets/ui-ux-workflow.png)
*(Placeholder: Architecture diagram for UI/UX agent)*
