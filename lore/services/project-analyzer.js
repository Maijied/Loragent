import fs from 'fs';
import path from 'path';

class ProjectAnalyzer {
  /**
   * Scans a project directory to identify its tech stack and needs.
   * @param {string} projectPath 
   * @returns {Object} Analysis results including proposed agents and skills
   */
  async analyze(projectPath) {
    console.log(`[LORE] Analyzing project at: ${projectPath}`);
    const results = {
      frameworks: [],
      proposedAgents: [],
      proposedSkills: []
    };

    // Very naive heuristic analysis
    if (fs.existsSync(path.join(projectPath, 'package.json'))) {
      results.frameworks.push('node');
      const pkg = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json'), 'utf8'));
      if (pkg.dependencies && pkg.dependencies.react) {
        results.frameworks.push('react');
        results.proposedSkills.push('frontend-design');
      }
      if (pkg.dependencies && pkg.dependencies.express) {
        results.frameworks.push('express');
      }
    }

    if (fs.existsSync(path.join(projectPath, 'requirements.txt')) || fs.existsSync(path.join(projectPath, 'pyproject.toml'))) {
      results.frameworks.push('python');
    }

    // Default agents for any project
    results.proposedAgents.push('review-bugbot', 'plan');
    
    return results;
  }

  /**
   * Automatically generates the proposed agents and skills in the .agents directory.
   * @param {string} projectPath 
   * @param {Object} analysis 
   */
  async generateAssets(projectPath, analysis) {
    const agentsDir = path.join(projectPath, '.agents');
    if (!fs.existsSync(agentsDir)) {
      fs.mkdirSync(agentsDir, { recursive: true });
    }
    // Stub: In a real scenario, this would use the face/cli/templates to generate files
    console.log(`[LORE] Generated assets in ${agentsDir} based on analysis.`);
  }
}

export default new ProjectAnalyzer();
