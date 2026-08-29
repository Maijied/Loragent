import { NextResponse } from 'next/server';
import allAgentsData from '@/data/all-agents.json';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return allAgentsData.items.map((i: any) => ({
    slug: i.slug,
  }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const item = allAgentsData.items.find((i: any) => i.slug === slug);

  if (!item) {
    return NextResponse.json({ error: `Agent or skill '${slug}' not found` }, { status: 404 });
  }

  return NextResponse.json(item, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
