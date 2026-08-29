import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import allAgentsData from '@/data/all-agents.json';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Read live marketplace if available on filesystem
  try {
    const root = path.resolve(process.cwd(), '..');
    const liveMarketplacePath = path.join(root, 'registry', 'marketplace.json');
    if (fs.existsSync(liveMarketplacePath)) {
      const liveData = JSON.parse(fs.readFileSync(liveMarketplacePath, 'utf8'));
      return NextResponse.json(liveData, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }
  } catch {}

  return NextResponse.json(allAgentsData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
