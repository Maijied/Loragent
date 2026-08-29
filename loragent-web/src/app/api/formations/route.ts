import { NextResponse } from 'next/server';
import allAgentsData from '@/data/all-agents.json';

export const dynamic = 'force-static';

export async function GET() {
  const formations = allAgentsData.items.filter((i: any) => i.type === 'FORMATION');
  return NextResponse.json({
    version: '2.0.0',
    totalFormations: formations.length,
    formations,
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
