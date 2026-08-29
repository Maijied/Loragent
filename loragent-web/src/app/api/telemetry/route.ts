import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const root = path.resolve(process.cwd(), '..');
    const graphPath = path.join(root, '.loragent-debug', 'orchestration-graph.json');
    const cachePath = path.join(root, '.loragent-debug', 'watchman-cache.json');

    const graph = fs.existsSync(graphPath) ? JSON.parse(fs.readFileSync(graphPath, 'utf8')) : null;
    const cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : null;

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      activeOrchestrationGraph: graph || { nodes: [], edges: [], status: 'idle' },
      watchmanCache: cache || { checkpoint: 'none', savedAt: null },
      residentHubTokens: 38240,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
