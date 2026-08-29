import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import allAgentsData from '@/data/all-agents.json';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  // 1. Try finding in catalog dataset
  let item: any = allAgentsData.items.find((i: any) => i.slug === slug || i.slug === `loragent-${slug}`);

  // 2. If not found in static dataset, dynamically search filesystem live
  if (!item) {
    try {
      const root = path.resolve(process.cwd(), '..');
      const agentPath = path.join(root, 'agents', slug.replace(/^loragent-/, ''), 'SKILL.md');
      const skillPath = path.join(root, 'skills', slug.replace(/^loragent-/, ''), 'SKILL.md');
      
      const targetFile = fs.existsSync(agentPath) ? agentPath : (fs.existsSync(skillPath) ? skillPath : null);
      if (targetFile) {
        const raw = fs.readFileSync(targetFile, 'utf8');
        item = {
          id: slug,
          slug,
          name: slug.replace(/^loragent-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          type: targetFile.includes('agents') ? 'AGENT' : 'SKILL',
          category: 'ENGINEERING',
          formation: 'auto',
          layer: 'CROSS',
          version: '2.0.0',
          description: `Live discovered agent: ${slug}`,
          objective: raw.slice(0, 500),
          allowedTools: ['filesystem_read', 'loragent_steer'],
          tags: ['live-discovered', 'loragent'],
          rawBody: raw,
        };
      }
    } catch {}
  }

  if (!item) {
    return NextResponse.json({ error: `Agent '${slug}' not found` }, { status: 404 });
  }

  return NextResponse.json(item, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
