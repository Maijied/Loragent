---
name: loragent-labs-context
description: >-
  Research Lorapok Labs repositories and public sources for evidence-backed
  brand, portfolio, and product planning. Use for Labs-wide messaging,
  portfolio audits, cross-project planning, or public company copy.
version: 1.0.0
license: MIT
tags: [lorapok-labs, brand, portfolio]
---

# Lorapok Labs Context

Use this skill when work spans multiple candidate Lorapok Labs projects or changes public Labs messaging. For a single product, follow that repository’s instructions and verify the product facts there.

## Workflow

1. Identify the requested audience, target project, and deliverable. Read its `AGENTS.md` and inspect its Git status before editing; preserve existing work.
2. Verify product claims in the product repository: README, package metadata, license, releases, and current install or support path. Do not infer Labs ownership from a folder name or catalog card.
3. Use the Labs portal as a discovery index. The current portal snapshot is transcribed in [`../../docs/LORAPOK_LABS_PORTFOLIO_CATALOG_DRAFT.md`](../../docs/LORAPOK_LABS_PORTFOLIO_CATALOG_DRAFT.md); it lists records whose ownership, status, and license still need verification.
4. For current external facts, use official Labs, product, repository, marketplace, or founder sources. Cite the source and date for public metrics. Keep source-reported claims separate from repository-verified facts and proposals.
5. Write clear product language before using biological or sensory metaphors. Keep shipped behavior separate from concepts, roadmaps, and marketing aspirations.
6. For Labs-wide planning, use [`../../docs/LORAPOK_LABS_BRAND_AND_PRODUCT_ROADMAP.md`](../../docs/LORAPOK_LABS_BRAND_AND_PRODUCT_ROADMAP.md) as the working plan and update its assumptions when stronger evidence appears.

## Evidence rules

- Do not publish an ecosystem product count until entries are deduplicated and lifecycle states are defined.
- Check the license for each product. A Labs brand relationship does not imply a shared license.
- Date performance, download, adoption, compatibility, and privacy claims; include the measurement source and conditions.
- If public sources disagree, preserve the discrepancy and mark it unresolved until the owner confirms the canonical fact.
- Do not read credential stores, `.env` files, or secret vaults for portfolio research.
- Do not modify a product repository unless the user selected that target or the request clearly requires it.

## Additional reference

- For a file-by-file audit of a candidate repository, invoke `loragent-labs-portfolio-researcher` and provide the repository path.
