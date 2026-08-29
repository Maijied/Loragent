import { NextResponse } from 'next/server';
import allAgentsData from '@/data/all-agents.json';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json(allAgentsData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
