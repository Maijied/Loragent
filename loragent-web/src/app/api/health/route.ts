import { NextResponse } from 'next/server';
import os from 'node:os';

export const dynamic = 'force-dynamic';

export async function GET() {
  const memoryUsage = process.memoryUsage();
  return NextResponse.json({
    status: 'healthy',
    mode: 'dynamic-ssr',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      cpus: os.cpus().length,
      freeMemoryMB: Math.round(os.freemem() / 1024 / 1024),
      totalMemoryMB: Math.round(os.totalmem() / 1024 / 1024),
    },
    processMemoryMB: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    },
    loragentEcosystem: {
      version: '2.0.0',
      totalAgents: 224,
      totalMcpServers: 20,
      totalFormations: 6,
      residentTokenBudget: '<40000',
    }
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
