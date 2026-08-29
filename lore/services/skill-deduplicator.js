import fs from 'node:fs';
import path from 'node:path';

/**
 * Loragent Skill Deduplication, Quality Scoring & Auto-Enrichment Engine
 * ======================================================================
 * - Normalizes skill slugs and clusters duplicate/shadow skills across IDEs.
 * - Computes a 0-100 Quality Score based on the Loragent Standard v2.
 * - Auto-merges richer capabilities from discovered duplicates to improve canonical skills.
 * - Provides semantic filtering by category, domain, tags, and minimum quality score.
 */
class SkillDeduplicator {
  /**
   * Normalizes a raw slug to its canonical form.
   * e.g. 'loragent-react-best-practices' -> 'react-best-practices'
   */
  normalizeSlug(rawName) {
    if (!rawName) return 'unknown-skill';
    let slug = rawName.toLowerCase().trim();
    slug = slug.replace(/^loragent-/, '');
    slug = slug.replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-');
    return slug;
  }

  /**
   * Computes a 0-100 quality score for a SKILL.md file.
   */
  scoreSkill(parsedSkill) {
    let score = 0;
    const { fm = {}, body = '', raw = '', description = '' } = parsedSkill;
    const desc = fm.description || description || '';

    // 1. Frontmatter & Metadata completeness (up to 30 pts)
    if (fm.name || parsedSkill.name) score += 5;
    if (desc && desc.length > 10) score += 10;
    if (fm.version || parsedSkill.version) score += 5;
    if (Array.isArray(fm.tags) && fm.tags.length > 0) score += 5;
    if (Array.isArray(fm.allowed_tools) && fm.allowed_tools.length > 0) score += 5;

    // 2. Loragent v2 Section Standards (up to 40 pts)
    const content = `${body} ${raw}`;
    const standardSections = [
      /§1|Role & Identity/i,
      /§2|Philosophy/i,
      /§3|Primary Objective/i,
      /§4|Tool Install|Availability Check/i,
      /§5|Execution Specifications/i,
      /§6|Output Contract/i,
      /§7|Failure Protocol/i,
    ];
    for (const pat of standardSections) {
      if (pat.test(content)) score += 6;
    }
    if (score > 70) score = Math.min(score, 70);

    // 3. Code examples & execution clarity (up to 20 pts)
    const codeBlockCount = (content.match(/```[a-z]*[\s\S]*?```/g) || []).length;
    if (codeBlockCount >= 1) score += 5;
    if (codeBlockCount >= 3) score += 10;
    if (content.length > 500) score += 5;

    // 4. Connectors & Tools configured (up to 10 pts)
    if (Array.isArray(fm.connectors) && fm.connectors.length > 0) score += 5;
    if (fm.cost_tier || fm.formation || fm.layer) score += 5;

    return Math.min(score, 100);
  }

  /**
   * Categorizes a skill based on its tags, slug, and content.
   */
  detectCategory(skill) {
    const text = `${skill.slug} ${skill.name} ${skill.description || ''} ${(skill.tags || []).join(' ')}`.toLowerCase();
    
    if (text.includes('security') || text.includes('audit') || text.includes('sqa') || text.includes('guard') || text.includes('vulnerability')) {
      return 'security';
    }
    if (text.includes('devops') || text.includes('deploy') || text.includes('docker') || text.includes('k8') || text.includes('ci/cd') || text.includes('cloud') || text.includes('wrangler')) {
      return 'devops';
    }
    if (text.includes('creative') || text.includes('design') || text.includes('image') || text.includes('ui') || text.includes('ux') || text.includes('3d') || text.includes('logo') || text.includes('gif')) {
      return 'creative';
    }
    if (text.includes('data') || text.includes('database') || text.includes('sql') || text.includes('bigquery') || text.includes('analytics') || text.includes('postgres')) {
      return 'data';
    }
    if (text.includes('ai') || text.includes('ml') || text.includes('llm') || text.includes('model') || text.includes('alphafold') || text.includes('fal')) {
      return 'ai';
    }
    if (text.includes('business') || text.includes('marketing') || text.includes('office') || text.includes('pr') || text.includes('hr') || text.includes('sales')) {
      return 'business';
    }
    if (text.includes('recover') || text.includes('watchman') || text.includes('cache') || text.includes('observer')) {
      return 'observer';
    }
    return 'engineering';
  }

  /**
   * Deduplicates a raw list of discovered skills into canonical clusters.
   * Merges capabilities from duplicate copies to elevate the canonical skill.
   */
  deduplicateAndEnrich(rawSkills, options = {}) {
    const {
      filter = '',
      category = '',
      minQuality = 0,
      enrichCanonical = false,
    } = options;

    const clusters = new Map();

    for (const s of rawSkills) {
      const canonicalSlug = this.normalizeSlug(s.name || path.basename(path.dirname(s.path)));
      const qualityScore = s.qualityScore !== undefined ? s.qualityScore : this.scoreSkill(s);
      const cat = s.category || this.detectCategory({ ...s, slug: canonicalSlug });

      const item = {
        ...s,
        slug: canonicalSlug,
        displayName: canonicalSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        category: cat,
        qualityScore,
      };

      if (!clusters.has(canonicalSlug)) {
        clusters.set(canonicalSlug, {
          canonical: item,
          duplicates: [],
          highestScore: qualityScore,
          allTags: new Set(item.tags || []),
          allTools: new Set(item.allowed_tools || []),
        });
      } else {
        const cluster = clusters.get(canonicalSlug);
        cluster.duplicates.push(item);
        
        // Merge tags and tools to make it richer
        (item.tags || []).forEach(t => cluster.allTags.add(t));
        (item.allowed_tools || []).forEach(t => cluster.allTools.add(t));

        // If this duplicate has a higher quality score or is in the primary repo, promote it
        const isPrimaryRepo = item.path && item.path.includes('/Personal_Projects/loragent/');
        if (qualityScore > cluster.highestScore || (isPrimaryRepo && qualityScore >= cluster.highestScore - 10)) {
          cluster.canonical = item;
          cluster.highestScore = Math.max(qualityScore, cluster.highestScore);
        }
      }
    }

    // Process clusters into final filtered list
    const results = [];
    let totalDuplicatesFiltered = 0;

    for (const [slug, cluster] of clusters.entries()) {
      totalDuplicatesFiltered += cluster.duplicates.length;

      const canonical = {
        ...cluster.canonical,
        tags: Array.from(cluster.allTags),
        allowed_tools: Array.from(cluster.allTools),
        duplicateCount: cluster.duplicates.length,
        mirrorLocations: cluster.duplicates.map(d => d.path),
      };

      // Quality filter
      if (canonical.qualityScore < minQuality) continue;

      // Category filter
      if (category && canonical.category.toLowerCase() !== category.toLowerCase()) continue;

      // Keyword filter
      if (filter) {
        const q = filter.toLowerCase();
        const searchTarget = `${canonical.slug} ${canonical.name} ${canonical.description || ''} ${canonical.tags.join(' ')} ${canonical.category}`.toLowerCase();
        if (!searchTarget.includes(q)) continue;
      }

      // If requested, enrich the canonical file on disk
      if (enrichCanonical && canonical.path && fs.existsSync(canonical.path)) {
        this._applyEnrichment(canonical);
      }

      results.push(canonical);
    }

    // Sort by quality score descending, then slug
    results.sort((a, b) => b.qualityScore - a.qualityScore || a.slug.localeCompare(b.slug));

    return {
      totalRaw: rawSkills.length,
      totalUnique: results.length,
      totalDuplicatesFiltered,
      skills: results,
    };
  }

  _applyEnrichment(skill) {
    try {
      const raw = fs.readFileSync(skill.path, 'utf8');
      const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
      if (!m) return;
      const [, fmBlock, body] = m;

      let updatedFm = fmBlock;
      // Ensure tags and allowed_tools are enriched
      if (skill.tags && skill.tags.length > 0 && !updatedFm.includes('tags:')) {
        updatedFm += `\ntags: ${JSON.stringify(skill.tags)}`;
      }
      if (skill.allowed_tools && skill.allowed_tools.length > 0 && !updatedFm.includes('allowed_tools:')) {
        updatedFm += `\nallowed_tools: ${JSON.stringify(skill.allowed_tools)}`;
      }

      const newContent = `---\n${updatedFm.trim()}\n---\n\n${body.trim()}\n`;
      fs.writeFileSync(skill.path, newContent, 'utf8');
    } catch {}
  }
}

export default new SkillDeduplicator();
