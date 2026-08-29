import fs from 'node:fs';
import path from 'node:path';

/**
 * Universal Project Analyzer & Tech Stack Intelligence
 * ====================================================
 * Inspects any local directory or cloned repository to identify:
 * - Languages (TypeScript, JavaScript, Python, Rust, Go, PHP, C++)
 * - Frameworks (React, Vue, Next.js, Nuxt, Express, FastAPI, Django, Laravel)
 * - Cloud & Infrastructure (Cloudflare Workers/Pages, Docker, Kubernetes, Vercel, Railway)
 * - Recommends optimal Loragent Squad Formations and Custom Specialist Agents
 */
class ProjectAnalyzer {
  /**
   * Scans a project directory to identify its tech stack and needs.
   * @param {string} projectPath 
   * @returns {Object} Deep analysis results
   */
  async analyze(projectPath) {
    const analysis = {
      projectPath,
      name: path.basename(projectPath),
      languages: [],
      frameworks: [],
      infrastructure: [],
      databases: [],
      testingFrameworks: [],
      recommendedFormation: 'auto-team',
      recommendedAgents: [],
      recommendedSkills: [],
      recommendedMcpServers: [],
    };

    if (!fs.existsSync(projectPath)) {
      return analysis;
    }

    // 1. Node / JavaScript / TypeScript ecosystem
    const pkgPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      analysis.languages.push('javascript');
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const allDeps = {
          ...(pkg.dependencies || {}),
          ...(pkg.devDependencies || {}),
        };

        if (allDeps.typescript || fs.existsSync(path.join(projectPath, 'tsconfig.json'))) {
          analysis.languages.push('typescript');
        }

        // Frameworks
        if (allDeps.react || allDeps['react-dom']) {
          analysis.frameworks.push('react');
          analysis.recommendedSkills.push('ui-ux-specialist', 'frontend-design');
          analysis.recommendedAgents.push('loragent-frontend-se', 'loragent-ui-ux-professional');
        }
        if (allDeps.next) {
          analysis.frameworks.push('nextjs');
          analysis.recommendedSkills.push('vercel-expert');
        }
        if (allDeps.vue) {
          analysis.frameworks.push('vue');
          analysis.recommendedAgents.push('loragent-vue-specialist');
        }
        if (allDeps.express || allDeps.fastify || allDeps.koa || allDeps.hono) {
          analysis.frameworks.push('node-backend');
          analysis.recommendedAgents.push('loragent-backend-se', 'loragent-api-chef');
        }
        if (allDeps.tailwindcss) {
          analysis.frameworks.push('tailwind');
        }
        if (allDeps['@modelcontextprotocol/sdk']) {
          analysis.frameworks.push('mcp');
          analysis.recommendedSkills.push('loragent-amo-mcp');
        }

        // Databases & ORMs
        if (allDeps.prisma || allDeps.drizzle || allDeps.mongoose || allDeps.pg || allDeps.mysql2) {
          analysis.databases.push('relational-or-nosql');
          analysis.recommendedAgents.push('loragent-database-designer');
        }

        // Testing
        if (allDeps.vitest || allDeps.jest || allDeps.mocha || allDeps['@playwright/test']) {
          analysis.testingFrameworks.push('unit-or-e2e');
          analysis.recommendedAgents.push('loragent-sqa', 'loragent-test-sentinel');
        }
      } catch {}
    }

    // 2. Python ecosystem
    if (
      fs.existsSync(path.join(projectPath, 'requirements.txt')) ||
      fs.existsSync(path.join(projectPath, 'pyproject.toml')) ||
      fs.existsSync(path.join(projectPath, 'Pipfile'))
    ) {
      analysis.languages.push('python');
      analysis.recommendedAgents.push('loragent-python-expert');

      let pyText = '';
      if (fs.existsSync(path.join(projectPath, 'requirements.txt'))) {
        pyText += fs.readFileSync(path.join(projectPath, 'requirements.txt'), 'utf8');
      }
      if (fs.existsSync(path.join(projectPath, 'pyproject.toml'))) {
        pyText += fs.readFileSync(path.join(projectPath, 'pyproject.toml'), 'utf8');
      }

      if (pyText.includes('fastapi')) {
        analysis.frameworks.push('fastapi');
        analysis.recommendedAgents.push('loragent-fastapi');
      }
      if (pyText.includes('django')) {
        analysis.frameworks.push('django');
        analysis.recommendedAgents.push('loragent-django-specialist');
      }
    }

    // 3. Rust ecosystem
    if (fs.existsSync(path.join(projectPath, 'Cargo.toml'))) {
      analysis.languages.push('rust');
      analysis.recommendedAgents.push('loragent-rust-expert');
    }

    // 4. PHP ecosystem
    if (fs.existsSync(path.join(projectPath, 'composer.json'))) {
      analysis.languages.push('php');
      analysis.recommendedAgents.push('loragent-laravel-specialist');
    }

    // 5. Cloud & DevOps
    if (fs.existsSync(path.join(projectPath, 'Dockerfile')) || fs.existsSync(path.join(projectPath, 'docker-compose.yml'))) {
      analysis.infrastructure.push('docker');
      analysis.recommendedAgents.push('loragent-docker-specialist');
    }
    if (fs.existsSync(path.join(projectPath, 'wrangler.toml')) || fs.existsSync(path.join(projectPath, 'wrangler.jsonc'))) {
      analysis.infrastructure.push('cloudflare-workers');
      analysis.recommendedSkills.push('loragent-wrangler-specialist');
    }

    // Determine optimal squad formation
    if (analysis.frameworks.includes('react') && analysis.frameworks.includes('node-backend')) {
      analysis.recommendedFormation = 'auto-team';
    } else if (analysis.infrastructure.includes('cloudflare-workers') || analysis.languages.includes('rust')) {
      analysis.recommendedFormation = 'freelance-isolation';
    } else {
      analysis.recommendedFormation = 'auto-team';
    }

    // Always include Core Safety & Architecture agents
    analysis.recommendedAgents.unshift('loragent-boss', 'loragent-tech-director', 'loragent-workspace-guard');
    analysis.recommendedSkills.unshift('loragent-watchman', 'loragent-deploy');

    // Deduplicate
    analysis.languages = [...new Set(analysis.languages)];
    analysis.frameworks = [...new Set(analysis.frameworks)];
    analysis.infrastructure = [...new Set(analysis.infrastructure)];
    analysis.recommendedAgents = [...new Set(analysis.recommendedAgents)];
    analysis.recommendedSkills = [...new Set(analysis.recommendedSkills)];

    return analysis;
  }
}

export default new ProjectAnalyzer();
