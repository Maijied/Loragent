# Project: Lorapok Labs Brand and Portfolio System

## Overview

Create a reliable company and product narrative from the Lorapok Labs project ecosystem, then make the guidance reusable in the Labs site and Loragent. The company story should be clear and attractive while product facts remain tied to the repository and license that support them.

## Goals

- Verify which repositories are current Lorapok Labs products, components, experiments, creator works, or unrelated projects.
- Reconcile product counts, founding date, licenses, release state, and public links.
- Establish an evidence-backed brand voice and shared design guidance for the Labs portal.
- Provide reusable Loragent skill, brand rule, and research subagent.
- Keep product-specific design, ownership, and licensing differences visible.

## Timeline

| Timing | Focus | Outcome |
|---|---|---|
| Weeks 1–2 | Portfolio audit | Verified source, status, owner relationship, license, and release for each candidate |
| Weeks 3–4 | Brand system | Approved company description, voice, claims ledger, and design principles |
| Weeks 5–8 | Product presentation | Consistent, accurate pages and installation paths for selected products |
| Weeks 9–12 | Ecosystem proof | One supported cross-product workflow, if the audit confirms user value and maintenance capacity |

The detailed sequence and exit gates are in [the brand and product roadmap](LORAPOK_LABS_BRAND_AND_PRODUCT_ROADMAP.md). The initial list of 54 portal records is in [the portfolio catalog draft](LORAPOK_LABS_PORTFOLIO_CATALOG_DRAFT.md); these are catalog entries, not yet verified distinct products.

## Tasks

- [x] Research current public Labs descriptions and record conflicting claims.
- [x] Check official social links and search for a verifiable Facebook page.
- [x] Snapshot the current Labs portal catalog for repository-level audit.
- [x] Draft the brand and product roadmap.
- [x] Add a reusable Loragent context skill, brand rule, and portfolio researcher subagent.
- [x] Add a scoped Figma-to-code rule for the Labs portal.
- [x] Add a non-blocking reminder hook for edits to public copy and catalog data.
- [ ] Verify each catalog entry against its repository, owner relationship, current status, license, and release.
- [ ] Confirm the canonical founding year and distinct-product counting rule.
- [ ] Choose the target Figma file for authoritative design context.
- [ ] Publish this page to Notion after the Notion connector is available.
- [ ] Select featured products using verified adoption and maintenance data.

## Risks and open facts

- Public sources currently state 20+, 30+, and 33+ products, while the current portal source contains 54 records with components and creator works mixed in.
- Founding-year claims conflict across sources: the founder profile and LinkedIn company-page About text say 2023, the LinkedIn showcase metadata says 2024, and the LinkedIn company-page metadata says 2025.
- No official Facebook page was verified. The current official site’s social links do not include Facebook; absence from those links does not prove no page exists.
- Product licenses differ; the Labs portal repository is MIT, while the Lorapok Player site identifies LL-NC-1.0.
- The Labs site repository has existing uncommitted user changes. The new rules and hook were added as separate files without rewriting that work.
- The portal's current font declarations are inconsistent: it imports Syne and DM Mono while the root font stack uses Inter/system fonts.
- No Notion MCP connector or Figma design-system-rules generator is available in this task. The site rule is based on the local source code; no Figma file or node was provided.

## Source material

- [Research plan](LORAPOK_LABS_RESEARCH_AND_PLAN.md)
- [Labs portal](../../lorapok.github.io/README.md)
- [Labs brand and catalog source](../../lorapok.github.io/src/data/lorapok.ts)
- [Portal ecosystem snapshot](../../lorapok.github.io/src/data/ecosystem-stats.ts)
- [Lorapok Labs public site](https://lorapok.tech/)
- [LinkedIn company page](https://bd.linkedin.com/company/lorapoklabs?trk=affiliated-pages)
- [LinkedIn showcase page](https://www.linkedin.com/showcase/lorapok/)
- Official-site social directory: [Lorapok Labs footer](https://lorapok.tech/)
- [Founder profile](https://maizied.lorapok.tech/)
