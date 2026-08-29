import { Command } from 'commander';
import URLIngestion from '../../../lore/services/url-ingestion.js';
import ProjectAnalyzer from '../../../lore/services/project-analyzer.js';

export default function(program) {
  const analyzeCmd = new Command('analyze')
    .description('Ingests a URL or local path, analyzes the tech stack, and recommends agents/skills')
    .argument('<target>', 'URL of remote repository or local directory path')
    .option('--json', 'Output results as JSON')
    .action(async (target, opts) => {
      let targetPath = target;
      let tempDir = null;

      try {
        if (target.startsWith('http://') || target.startsWith('https://')) {
          console.log(`🌐 [FACE] Ingesting remote repository: ${target}...`);
          tempDir = await URLIngestion.ingest(target);
          targetPath = tempDir;
        }

        console.log(`🔍 [FACE] Analyzing project at: ${targetPath}...`);
        const analysis = await ProjectAnalyzer.analyze(targetPath);

        if (opts.json) {
          console.log(JSON.stringify(analysis, null, 2));
          return;
        }

        console.log('\n╔═══════════════════════════════════════════════════════════════╗');
        console.log(`║  Project Stack Analysis: ${analysis.name.padEnd(36)} ║`);
        console.log('╚═══════════════════════════════════════════════════════════════╝');
        console.log(`💻 Languages      : ${analysis.languages.join(', ') || 'none detected'}`);
        console.log(`📦 Frameworks    : ${analysis.frameworks.join(', ') || 'none detected'}`);
        console.log(`☁️  Infrastructure: ${analysis.infrastructure.join(', ') || 'standard'}`);
        console.log(`🛡️  Formation Squad: ${analysis.recommendedFormation}`);

        console.log('\n🤖 Recommended Autonomous Squad:');
        for (const a of analysis.recommendedAgents) {
          console.log(`  • ${a}`);
        }

        console.log('\n🛠️  Recommended Skills:');
        for (const s of analysis.recommendedSkills) {
          console.log(`  • /loragent:${s.replace(/^loragent-/, '')}`);
        }

        console.log('\n✅ Ready! Run `loragent sync` to bind this squad to your workspace.\n');
      } catch (e) {
        console.error('❌ [FACE] Analysis failed:', e.message);
      } finally {
        if (tempDir) {
          URLIngestion.cleanup(tempDir);
        }
      }
    });

  program.addCommand(analyzeCmd);
}
