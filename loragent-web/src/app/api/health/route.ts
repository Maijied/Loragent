import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    platform: 'Loragent Universal Hub-and-Spoke Ecosystem',
    stats: {
      totalAgents: 224,
      totalMcp: 20,
      totalFormations: 6,
      residentBudgetTokens: '<40000',
    }
  });
}
