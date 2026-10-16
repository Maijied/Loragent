# Lorapok Labs Research and Workspace Plan

**Status:** Active working draft  
**Prepared:** 16 October 2026

## Goal

Build a dependable, reusable source of context for Lorapok Labs, then use it to make the company’s agent instructions and design guidance more precise. Keep product facts, brand language, design conventions, and project-specific rules tied to evidence in the repositories and current public sources.

## Research baseline

- The local Labs portal defines the current tagline as “Open-source products that feel alive.” It describes the work through Biological UI, Sensory Computing, and Open Engineering. Its current working-tree project data contains 54 catalog records, including product modules and creator works; that is not a verified count of distinct, active products.
- Public descriptions present Lorapok Labs as an open-source software collective based in Dhaka, building apps, APIs, developer tools, and experimental interfaces. The public portfolio describes a broad ecosystem spanning AI, developer tools, localization, media, and browser extensions.
- The public product-count claims differ: the founder profile says “20+,” the Labs portal says “30+,” and Lorapok AI says “33+.” LinkedIn has two separate Lorapok Labs surfaces: the [company page](https://bd.linkedin.com/company/lorapoklabs?trk=affiliated-pages) and the [showcase page](https://www.linkedin.com/showcase/lorapok/). The company page’s About text says it was founded in 2023, its structured “Founded” field says 2025, and the showcase’s “Founded” field says 2024; the founder profile also says 2023. Keep these as source-specific conflicting claims until the owner confirms the canonical date.
- No official Lorapok Labs Facebook page was verified. The official site’s “Marketplaces & Social” links do not include Facebook, and Facebook page search did not surface a matching page. Treat Facebook presence as unconfirmed rather than claiming that no page exists.
- Licensing is per project. For example, the Labs portal repository is MIT-licensed, while the Lorapok Player site names the LL-NC-1.0 license. Do not describe every product as MIT or open source without checking its repository and license.
- The workspace contains independent, personal, archival, and work-related repositories alongside Labs projects. A directory’s presence under `Personal_Projects` does not establish that it belongs to Lorapok Labs.
- `lorapok.github.io` currently has uncommitted changes. Its working tree is useful evidence of in-progress work, but it must not be overwritten or treated as a finalized public source.

## Working brand direction

Use the existing line, “Open-source products that feel alive,” as a starting point. Make the engineering value clear first: practical tools, direct feedback, useful performance, and public source code where the individual project license permits it. Use biological and sensory language to shape product experience and visual identity; avoid applying those metaphors to every product when they do not help explain what it does.

Keep claims measurable. Product counts, downloads, performance figures, compatibility, privacy guarantees, and license statements should have a source and an “as of” date. Keep concept art, roadmap ideas, and aspirational claims separate from shipped capabilities.

## Proposed work

### Phase 1 — Verify the portfolio

Create a catalog for candidate Labs repositories with canonical name, repository URL, owner, category, current status, last release, live product URL, license, and evidence source. Resolve aliases, forks, packages that belong to one product, old demos, contributor work, and unrelated repositories. Start from the Labs portal catalog and inspect the corresponding repositories; do not use folder names alone as proof of ownership.

### Phase 2 — Establish brand facts and language

Write a short company profile, audience definition, product categories, voice guide, approved short and long descriptions, and a claims ledger. Mark uncertain facts as unresolved instead of choosing whichever public version sounds strongest. Add links and review dates so later edits can update the evidence.

### Phase 3 — Define design guidance

Inspect the active Labs site and approved logo and asset sources. Document shared tokens and reusable patterns separately from product-specific visual systems. Include responsive behavior, reduced-motion support, contrast, typography, and rules for using biological motifs. Do not prescribe one palette or component system across unrelated products without repository evidence.

### Phase 4 — Build the Codex workspace kit

In the Loragent repository, create the `loragent-labs-context` skill, an evidence-backed public-copy rule, and a portfolio researcher subagent. A non-blocking post-edit hook now reminds agents to verify public claims when the Labs catalog and copy files change. The Figma-to-code rule for the Labs portal is based on the active local source; a specific Figma file is still needed for design-context validation. A local Labs project page is prepared because no Notion connector is available.

### Phase 5 — Apply and maintain

Use the verified kit to update only the selected target: company copy, project descriptions, or design guidance. Review all claims against the evidence ledger, preserve in-progress user changes, and set a review cadence for product status, metrics, and licenses.

## Completion criteria

- Each catalog entry has a verified Labs relationship, status, license, and source.
- Product components and contributor or personal works are not counted as separate Labs products without a clear reason.
- Public metrics and technical claims include evidence and dates; unresolved discrepancies remain marked.
- The shared brand guide describes common values while leaving room for product-specific design systems.
- The skill, rule, and subagent have clear trigger conditions and point to maintained sources.

## Source references

- Local portal brand and product data: `../../lorapok.github.io/src/data/lorapok.ts` and `../../lorapok.github.io/src/data/ecosystem-stats.ts`.
- [Lorapok Labs public site](https://lorapok.tech/)
- [Lorapok Labs LinkedIn company page](https://bd.linkedin.com/company/lorapoklabs?trk=affiliated-pages)
- [Lorapok Labs LinkedIn showcase page](https://www.linkedin.com/showcase/lorapok/)
- [Founder profile](https://maizied.lorapok.tech/)
- [Lorapok AI product site](https://ai.lorapok.tech/)
- [Lorapok Player product site](https://media.lorapok.tech/)
- [ReportKit brand guide](https://reportkit.lorapok.tech/brand/)
- Local catalog snapshot: `LORAPOK_LABS_PORTFOLIO_CATALOG_DRAFT.md`.
- Local project page: `LORAPOK_LABS_PROJECT_PAGE.md`.
