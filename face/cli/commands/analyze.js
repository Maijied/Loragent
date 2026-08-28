import { Command } from 'commander';
import URLIngestion from '../../../lore/services/url-ingestion.js';
import ProjectAnalyzer from '../../../lore/services/project-analyzer.js';

export default function(program) {
  const analyzeCmd = new Command('analyze')
    .description('Ingests a URL, analyzes the project, and auto-generates agents/skills')
    .argument('<url>', 'URL of the repository to analyze')
    .action(async (url) => {
      let tempDir;
      try {
        console.log(`[FACE] Starting analysis for ${url}...`);
        tempDir = await URLIngestion.ingest(url);
        
        const analysis = await ProjectAnalyzer.analyze(tempDir);
        console.log('[FACE] Analysis complete:', analysis);

        await ProjectAnalyzer.generateAssets(process.cwd(), analysis);
        console.log('[FACE] Assets generated successfully.');
      } catch (e) {
        console.error('[FACE] Analysis failed:', e.message);
      } finally {
        if (tempDir) {
           URLIngestion.cleanup(tempDir);
        }
      }
    });

  program.addCommand(analyzeCmd);
};
