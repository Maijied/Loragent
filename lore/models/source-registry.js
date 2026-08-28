import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs from 'fs';
import path from 'path';

class SourceRegistry {
  constructor() {
    this.registryPath = path.join(__dirname, '../../registry/sources.json');
    this.sources = this._loadSources();
  }

  _loadSources() {
    if (!fs.existsSync(this.registryPath)) return [];
    try {
      const data = JSON.parse(fs.readFileSync(this.registryPath, 'utf8'));
      return data.sources || [];
    } catch (e) {
      console.error('Failed to load sources registry:', e);
      return [];
    }
  }

  save() {
    fs.writeFileSync(this.registryPath, JSON.stringify({ sources: this.sources }, null, 2));
  }

  addSource(source) {
    if (!this.sources.find(s => s.id === source.id)) {
      this.sources.push(source);
      this.save();
    }
  }

  removeSource(id) {
    this.sources = this.sources.filter(s => s.id !== id);
    this.save();
  }

  getSources() {
    return this.sources;
  }
}

export default new SourceRegistry();
