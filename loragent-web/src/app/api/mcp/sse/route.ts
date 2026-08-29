import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Server-Sent Events (SSE) stream for Model Context Protocol clients
export async function GET(request: Request) {
  const encoder = new TextEncoder();
  const sessionId = Math.random().toString(36).substring(2, 15);

  const stream = new ReadableStream({
    start(controller) {
      // 1. Send connection established event
      const initialMessage = `event: endpoint\ndata: /api/mcp?sessionId=${sessionId}\n\n`;
      controller.enqueue(encoder.encode(initialMessage));

      // 2. Send ready heartbeat
      const readyMessage = `event: message\ndata: ${JSON.stringify({
        jsonrpc: "2.0",
        method: "notifications/initialized",
        params: {
          sessionId,
          status: "connected",
          server: "Loragent-Online-MCP-Server",
          version: "2.0.0",
          protocolVersion: "2024-11-05"
        }
      })}\n\n`;
      controller.enqueue(encoder.encode(readyMessage));

      // 3. Keep-alive interval
      const interval = setInterval(() => {
        try {
          const pingMessage = `: keep-alive ${new Date().toISOString()}\n\n`;
          controller.enqueue(encoder.encode(pingMessage));
        } catch {
          clearInterval(interval);
        }
      }, 15000);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
