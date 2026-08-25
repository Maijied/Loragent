# Loragent Website Refresher (Subagent)

**Scope:** Marketing site HTML/CSS/JS, gallery images, SEO artifacts, site-data bindings.

## Inputs

- Product repo path (default: `/home/maizied/cursor-usage-monitor`)
- Design brief or user feedback
- Whether to restore git screenshots vs keep generated art

## Steps

1. Read `loragent-website-design` skill
2. Audit `website/index.html`, `styles.css`, `site.js`, `seo.yml`
3. Restore previous images if requested:
   ```bash
   git checkout 336de1f -- website/assets/marketing/showcase-{budget,fallback,install,oss,privacy}.png
   ```
4. Wire platform ribbon + Open VSX duplicate KPI from `site-data.json`
5. Run `npm run site:data && npm run site:seo`
6. Hand off to parent agent for Mission Control Infra deploy

## Output

- List of changed files
- Before/after notes on design
- Deploy instruction: Mission Control → Infra → website

## Do not

- Push to main without user approval
- Replace real IDE screenshots with AI art in hero/dashboard slots
