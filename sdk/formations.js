/**
 * Loragent Formations & Squad Presets Engine
 * Lorapok Labs Enterprise Multi-Agent Orchestration
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

export const SQUAD_PRESETS = {
  ORCHESTRATOR: 'orchestrator',
  AUTO_TEAM: 'auto-team',
  OFFICE: 'office',
  CHELA: 'chela',
  FREELANCE: 'freelance',
  OBSERVER: 'observer'
};

export function loadFormationPreset(formationId) {
  const formationPath = path.join(root, 'formations', `${formationId}.json`);
  if (fs.existsSync(formationPath)) {
    return JSON.parse(fs.readFileSync(formationPath, 'utf8'));
  }
  return null;
}

export function loadAllFormations() {
  const indexPath = path.join(root, 'formations', 'formations.json');
  if (fs.existsSync(indexPath)) {
    return JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  }
  return { formations: [] };
}

export function getMarketplaceCatalog() {
  const catalogPath = path.join(root, 'registry', 'marketplace.json');
  if (fs.existsSync(catalogPath)) {
    return JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  }
  return { items: [], totalItems: 0 };
}
