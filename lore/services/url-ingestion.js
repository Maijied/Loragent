import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

class URLIngestion {
  /**
   * Clones a repository URL to a temporary directory.
   * @param {string} url 
   * @returns {string} Path to the cloned repository
   */
  async ingest(url) {
    try {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'loragent-ingest-'));
      console.log(`[LORE] Ingesting URL: ${url} into ${tempDir}`);
      
      // Basic git clone. Future support for tarball downloads if not git.
      execSync(`git clone --depth 1 ${url} ${tempDir}`, { stdio: 'inherit' });
      return tempDir;
    } catch (e) {
      throw new Error(`Failed to ingest URL: ${url}. Error: ${e.message}`);
    }
  }

  cleanup(tempDir) {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

export default new URLIngestion();
